"use client";

import { useMemo, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit, MdOpenInNew } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
// import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import ProjectCard from "./ProjectCard";
import { isValidOrderKey, orderKeyForCountry, orderKeyLabel } from "@/lib/countryCodes";

type ProjectListItem = {
    _id: string;
    slug?: string;
    firstSection: {
        title: string;
        description: string;
    };
    secondSection?: {
        location?: {
            name?: string;
            code?: string;
        };
    };
};

const ALL_SCOPE = "Country";

// dropdown value for a project: its order key ("AE", "AFRICA", ...), or its location name when it has no country code
const scopeOf = (item: ProjectListItem) => {
    const location = item?.secondSection?.location;
    return orderKeyForCountry(location?.code) || (location?.name ? `name:${location.name}` : "");
};

interface ProjectPageProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    banner: string;
    bannerAlt: string;
    bannerAlt_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
    firstSection: {
        items: {
            number: string;
            number_ar: string;
            value: string;
            value_ar: string;
        }[];
    };
}

export default function Projects() {
    const [selectedCountry, setSelectedCountry] = useState(ALL_SCOPE);
    const [search, setSearch] = useState("");

    const [sector, setSector] = useState<string>("");
    const [sector_ar, setSectorAr] = useState<string>("");

    const [reorderMode, setReorderMode] = useState(false);
    // saved country / Africa orders: key -> ordered project ids
    const [projectOrders, setProjectOrders] = useState<Record<string, string[]>>({});
    // the projects being dragged when reordering one country / Africa (global reorder uses projectList)
    const [scopedList, setScopedList] = useState<ProjectListItem[]>([]);

    // const [service, setService] = useState<string>("");
    // const [service_ar, setServiceAr] = useState<string>("");

    // const [country, setCountry] = useState<string>("");
    // const [country_ar, setCountryAr] = useState<string>("");

    const [projectList, setProjectList] = useState<ProjectListItem[]>([]);

    // const [countryList, setCountryList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);
    const [sectorList, setSectorList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);
    const [serviceList, setServiceList] = useState<{ _id: string; pageTitle: string; name_ar: string }[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProjectPageProps>();

    const {
        fields: firstSectionItems,
        append: firstSectionAppend,
        remove: firstSectionRemove,
    } = useFieldArray({
        control,
        name: "firstSection.items",
    });

    const handleFetchProjects = async () => {
        try {
            const response = await fetch("/api/admin/project");
            if (response.ok) {
                const data = await response.json();
                setProjectList(data.data.projects);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching projects", error);
        }
    };

    const handleFetchProjectOrders = async () => {
        try {
            const response = await fetch("/api/admin/project/order");
            if (response.ok) {
                const data = await response.json();
                setProjectOrders(
                    Object.fromEntries(
                        (data.data || []).map((o: { key: string; projectIds: string[] }) => [o.key, o.projectIds])
                    )
                );
            }
        } catch (error) {
            console.log("Error fetching project orders", error);
        }
    };

    const handleAddSector = async () => {
        try {
            const response = await fetch("/api/admin/project/sector", {
                method: "POST",
                body: JSON.stringify({ name: sector, name_ar: sector_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                setSector("");
                toast.success(data.message);
                handleFetchSector();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error adding sector", error);
        }
    };

    const handleFetchSector = async () => {
        try {
            const response = await fetch("/api/admin/project/sector");
            if (response.ok) {
                const data = await response.json();
                setSectorList(data.data);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching sector", error);
        }
    };

    const handleEditSector = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project/sector?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ name: sector, name_ar: sector_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchSector();
                setSector("");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error editing sector", error);
        }
    };

    const handleDeleteSector = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project/sector?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchSector();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error deleting sector", error);
        }
    };

    const handleFetchService = async () => {
        try {
            const response = await fetch("/api/admin/services");
            if (response.ok) {
                const data = await response.json();
                setServiceList(data.data);
                console.log(data.data)
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching service", error);
        }
    };

    const handleDeleteProject = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchProjects();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error deleting project", error);
        }
    };

    const onSubmit = async (data: ProjectPageProps) => {
        try {
            const response = await fetch(`/api/admin/project`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in submitting project details", error);
        }
    };

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch("/api/admin/project");
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.items", data.data.firstSection.items);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching project details", error);
        }
    };

    useEffect(() => {
        handleFetchProjects();
        handleFetchProjectOrders();
        handleFetchSector();
        // handleFetchCountry();
        handleFetchService();
        fetchProjectDetails();
    }, []);

    // dropdown options: one per country (all African countries together as "Africa"), sorted by label
    const countries = useMemo<{ value: string; label: string }[]>(() => {
        // projects that match search (ignore country filter)
        const searchFiltered = projectList.filter((item) =>
            item?.firstSection?.title?.toLowerCase().includes(search.toLowerCase())
        );

        const byScope = new Map<string, string>();
        searchFiltered.forEach((item) => {
            const scope = scopeOf(item);
            if (!scope || byScope.has(scope)) return;
            byScope.set(scope, isValidOrderKey(scope) ? orderKeyLabel(scope) : item.secondSection?.location?.name || scope);
        });

        const options = Array.from(byScope, ([value, label]) => ({ value, label })).sort((a, b) =>
            a.label.localeCompare(b.label)
        );

        return [{ value: ALL_SCOPE, label: "Country" }, ...options];
    }, [projectList, search]);

    // the selected country's saved order key ("" for all countries, or a location without a country code)
    const selectedOrderKey = isValidOrderKey(selectedCountry) ? selectedCountry : "";

    // selected country's projects in its saved order; ones not placed yet follow in the global order
    const sortByScopeOrder = (items: ProjectListItem[]) => {
        const rank = new Map((projectOrders[selectedOrderKey] || []).map((id, i) => [id, i]));
        const pos = (item: ProjectListItem) => rank.get(item._id) ?? Number.MAX_SAFE_INTEGER;
        return [...items].sort((a, b) => pos(a) - pos(b));
    };

    // filtered projects
    const filteredProjects = useMemo(() => {
        if (!projectList?.length) return [];

        const normalizedSearch = search.toLowerCase();

        const list = projectList.filter((item) => {
            const countryMatch = selectedCountry === ALL_SCOPE || scopeOf(item) === selectedCountry;

            const titleMatch = item?.firstSection?.title?.toLowerCase().includes(normalizedSearch) ?? false;

            return countryMatch && titleMatch;
        });

        return selectedOrderKey ? sortByScopeOrder(list) : list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectList, selectedCountry, search, projectOrders]);

    const startReorder = () => {
        if (selectedCountry === ALL_SCOPE) {
            setReorderMode(true);
            return;
        }
        if (!selectedOrderKey) {
            toast.error("Set this location's Country Code in Home > Map Locations to give it its own order");
            return;
        }
        // all of the country's projects (search ignored), starting from its saved order
        setScopedList(sortByScopeOrder(projectList.filter((item) => scopeOf(item) === selectedOrderKey)));
        setReorderMode(true);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const move = (items: ProjectListItem[]) => {
            const oldIndex = items.findIndex((item) => item._id === active.id);
            const newIndex = items.findIndex((item) => item._id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        };

        if (selectedCountry === ALL_SCOPE) setProjectList(move);
        else setScopedList(move);
    };

    const confirmProjectOrder = async () => {
        setReorderMode(false);

        // one country / Africa: saved as that country's own order, the global order is not touched
        if (selectedCountry !== ALL_SCOPE) {
            const res = await fetch("/api/admin/project/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: selectedOrderKey, projectIds: scopedList.map((p) => p._id) }),
            });
            const data = await res.json();
            if (res.ok) {
                setProjectOrders((prev) => ({ ...prev, [data.data.key]: data.data.projectIds }));
                toast.success(`${orderKeyLabel(data.data.key)} order saved`);
            } else {
                toast.error(data.message || "Failed to save order");
            }
            return;
        }

        const orderedIds = projectList.map((p) => p._id);

        const formData = new FormData();
        formData.append("projects", JSON.stringify(orderedIds));

        const res = await fetch("/api/admin/project/reorder", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            toast.success(data.message);
            // reload so the list shows exactly what was saved (incl. any project kept at the end)
            handleFetchProjects();
        }
    };

    const reorderList = selectedCountry === ALL_SCOPE ? projectList : scopedList;

    // ---------- search while reordering: nothing is hidden (the full list stays draggable);
    // matches are highlighted and the active one is scrolled into view. Enter jumps to the next match.
    const [activeMatchId, setActiveMatchId] = useState("");
    const [scrollTick, setScrollTick] = useState(0);

    const reorderMatchIds = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!reorderMode || !term) return [];
        return reorderList
            .filter((item) => item?.firstSection?.title?.toLowerCase().includes(term))
            .map((item) => item._id);
    }, [reorderMode, reorderList, search]);
    const reorderMatchSet = useMemo(() => new Set(reorderMatchIds), [reorderMatchIds]);

    // a new search term (or entering reorder mode) focuses the first match
    useEffect(() => {
        setActiveMatchId(reorderMatchIds[0] || "");
        setScrollTick((t) => t + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, reorderMode]);

    // scroll only when the focused match changes / Enter is pressed, never just because an item was dragged
    useEffect(() => {
        if (!activeMatchId) return;
        document.getElementById(`reorder-item-${activeMatchId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [activeMatchId, scrollTick]);

    const focusNextMatch = () => {
        if (!reorderMatchIds.length) return;
        const next = (reorderMatchIds.indexOf(activeMatchId) + 1) % reorderMatchIds.length;
        setActiveMatchId(reorderMatchIds[next]);
        setScrollTick((t) => t + 1);
    };

    // the selected country / Africa has its own saved order (otherwise its visitors see the global order)
    const hasSavedOrder = !!selectedOrderKey && !!projectOrders[selectedOrderKey];

    // removes only this country's saved order; projects and the global order are not touched
    const resetOrderToGlobal = async () => {
        const key = selectedOrderKey;
        if (!key) return;
        const res = await fetch(`/api/admin/project/order?key=${encodeURIComponent(key)}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
            setProjectOrders((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            toast.success(`${orderKeyLabel(key)} now uses the global order`);
        } else {
            toast.error(data.message || "Failed to reset order");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
                {/*English Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner?.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input
                                                type="text"
                                                placeholder="Alt Tag"
                                                {...register(`bannerAlt`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.bannerAlt && <p className="text-red-500">{errors.bannerAlt.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Title</Label>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                {...register(`pageTitle`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.pageTitle && <p className="text-red-500">{errors.pageTitle.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border border-black/20 p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-2 p-5">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="" {...register("metaTitle")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Description</Label>
                                <Input type="text" placeholder="" {...register("metaDescription")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                {/*Arabic Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input type="text" placeholder="Alt Tag" {...register(`bannerAlt_ar`)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Title</Label>
                                            <Input type="text" placeholder="Title" {...register(`pageTitle_ar`)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border border-black/20 p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number_ar`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value_ar`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-2 p-5">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="" {...register("metaTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Description</Label>
                                <Input type="text" placeholder="" {...register("metaDescription_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                        Submit
                    </Button>
                </div>
            </form>

            <div className="h-screen grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 h-screen">
                    <div className="h-1/2 w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 border-black/20 pb-2">
                            <Label className="text-sm font-bold">Service</Label>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {serviceList.map((item) => (
                                <div
                                    className="flex justify-between border border-black/20 p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.pageTitle}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-1/2 w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 border-black/20 pb-2">
                            <Label className="text-sm font-bold">Sector</Label>
                            <Dialog>
                                <DialogTrigger
                                    className="bg-black text-white px-2 py-1 rounded-md"
                                    onClick={() => {
                                        setSector("");
                                        setSectorAr("");
                                    }}
                                >
                                    Add Sector
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Sector</DialogTitle>
                                        <DialogDescription>
                                            <Label>Sector Name (English)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Sector Name"
                                                value={sector}
                                                onChange={(e) => setSector(e.target.value)}
                                            />

                                            <Label>Sector Name (Arabic)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Sector Name"
                                                value={sector_ar}
                                                onChange={(e) => setSectorAr(e.target.value)}
                                            />
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose
                                        className="bg-black text-white px-2 py-1 rounded-md"
                                        onClick={handleAddSector}
                                    >
                                        Save
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {sectorList.map((item) => (
                                <div
                                    className="flex justify-between border border-black/20 p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.name}</div>
                                    <div className="flex gap-5">
                                        <Dialog>
                                            <DialogTrigger
                                                onClick={() => {
                                                    setSector(item.name);
                                                    setSectorAr(item.name_ar);
                                                }}
                                            >
                                                <MdEdit className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Sector</DialogTitle>
                                                    <DialogDescription>
                                                        <Label>Sector Name (English)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sector Name"
                                                            value={sector}
                                                            onChange={(e) => setSector(e.target.value)}
                                                        />

                                                        <Label>Sector Name (Arabic)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sector Name"
                                                            value={sector_ar}
                                                            onChange={(e) => setSectorAr(e.target.value)}
                                                        />
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogClose
                                                    className="bg-black text-white px-2 py-1 rounded-md"
                                                    onClick={() => handleEditSector(item._id)}
                                                >
                                                    Save
                                                </DialogClose>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger>
                                                <MdDelete className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex gap-2">
                                                    <DialogClose className="bg-black text-white px-2 py-1 rounded-md">
                                                        No
                                                    </DialogClose>
                                                    <DialogClose
                                                        className="bg-black text-white px-2 py-1 rounded-md"
                                                        onClick={() => handleDeleteSector(item._id)}
                                                    >
                                                        Yes
                                                    </DialogClose>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
            <div className="flex justify-between border-b-2 pb-2">
              <Label className="text-sm font-bold">Country</Label>
              <Dialog>
                <DialogTrigger className="bg-black text-white px-2 py-1 rounded-md" onClick={() => {setCountry("");setCountryAr("")}}>Add Country</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Country</DialogTitle>
                    <DialogDescription>
                      <Label>Country Name (English)</Label>
                      <Input type="text" placeholder="Country Name" value={country} onChange={(e) => setCountry(e.target.value)} />

                      <Label>Country Name (Arabic)</Label>
                      <Input type="text" placeholder="Country Name" value={country_ar} onChange={(e) => setCountryAr(e.target.value)} />


                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={handleAddCountry}>Save</DialogClose>
                </DialogContent>

              </Dialog>
            </div>
            <div className="h-full">

              <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                {countryList.map((item) => (
                  <div className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                    <div className="text-[16px]">
                      {item.name}
                    </div>
                    <div className="flex gap-5">
                      <Dialog>
                        <DialogTrigger onClick={() => { setCountry(item.name);setCountryAr(item.name_ar)}}><MdEdit /></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Country</DialogTitle>
                            <DialogDescription>
                              <Label>Country Name (English)</Label>
                              <Input type="text" placeholder="Country Name" value={country} onChange={(e) => setCountry(e.target.value)} />

                              <Label>Country Name (Arabic)</Label>
                              <Input type="text" placeholder="Country Name" value={country_ar} onChange={(e) => setCountryAr(e.target.value)} />


                            </DialogDescription>
                          </DialogHeader>
                          <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleEditCountry(item._id)}>Save</DialogClose>
                        </DialogContent>

                      </Dialog>



                      <Dialog>
                        <DialogTrigger><MdDelete /></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                          </DialogHeader>
                          <div className="flex gap-2">
                            <DialogClose className="bg-black text-white px-2 py-1 rounded-md">No</DialogClose>
                            <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleDeleteCountry(item._id)}>Yes</DialogClose>
                          </div>

                        </DialogContent>

                      </Dialog>

                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div> */}
                </div>

                <div className="h-screen w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
                    <div className="border-b-2 border-black/20 pb-3">
                        <div className="flex justify-between items-center">
                            {/* LEFT: Title */}
                            <Label className="text-sm font-bold">Projects</Label>

                            {/* RIGHT: Controls */}
                            <div className="flex items-center gap-4">
                                <Select
                                    value={selectedCountry}
                                    onValueChange={(value) => setSelectedCountry(value)}
                                    disabled={reorderMode}
                                >
                                    <SelectTrigger className="w-[180px] text-sm">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-[350px] overflow-y-scroll">
                                        {countries.map((country) => (
                                            <SelectItem key={country.value} value={country.value} className="hover:bg-gray-200">
                                                {country.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {hasSavedOrder && !reorderMode && (
                                    <Dialog>
                                        <DialogTrigger className="border border-black/30 px-3 py-2 rounded-md text-sm">
                                            Reset to global
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Reset {orderKeyLabel(selectedOrderKey)} order?</DialogTitle>
                                                <DialogDescription>
                                                    Visitors from {orderKeyLabel(selectedOrderKey)} will see the global
                                                    project order. Only this country&apos;s custom order is removed; no
                                                    projects are changed.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-end gap-2">
                                                <DialogClose className="border px-3 py-1 rounded-md">Cancel</DialogClose>
                                                <DialogClose
                                                    className="bg-black text-white px-3 py-1 rounded-md"
                                                    onClick={resetOrderToGlobal}
                                                >
                                                    Reset
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}

                                <Button
                                    className={`text-white ${reorderMode ? "bg-yellow-700" : "bg-green-700"}`}
                                    onClick={() => (reorderMode ? confirmProjectOrder() : startReorder())}
                                >
                                    {reorderMode ? "Done" : "Reorder"}
                                </Button>

                                <Button className="bg-black text-white" onClick={() => router.push("/admin/projects/add")}>
                                    Add Project
                                </Button>
                            </div>
                        </div>

                        {/* SECOND LINE: Count */}
                        <p className="text-sm text-muted-foreground mt-1">
                            Count: {reorderMode ? reorderList.length : filteredProjects.length}
                            {!reorderMode && selectedOrderKey && (
                                <span className="ml-2">
                                    · {hasSavedOrder ? "Custom order for its visitors" : "Visitors see the global order"}
                                </span>
                            )}
                            {reorderMode && (
                                <span className="ml-2 font-medium text-yellow-700">
                                    {selectedCountry === ALL_SCOPE
                                        ? "Reordering: Global order (all visitors)"
                                        : `Reordering: ${orderKeyLabel(selectedOrderKey)} order (visitors from ${orderKeyLabel(selectedOrderKey)})`}
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="relative mt-2 mb-4">
                        <Input
                            type="text"
                            placeholder={reorderMode ? "Find a project to move... (Enter = next match)" : "Search project..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (reorderMode && e.key === "Enter") {
                                    e.preventDefault();
                                    focusNextMatch();
                                }
                            }}
                            className={`w-full text-sm ${reorderMode && search.trim() ? "pr-28" : "pr-10"}`}
                        />

                        {reorderMode && search.trim() && (
                            <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                                {reorderMatchIds.length
                                    ? `${reorderMatchIds.indexOf(activeMatchId) + 1} of ${reorderMatchIds.length}`
                                    : "No match"}
                            </span>
                        )}

                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* list takes only the height left under the header + search, so the last rows aren't clipped */}
                    {!reorderMode && (
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll flex-1 min-h-0 pb-2">
                            {filteredProjects.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between border border-black/20 p-2 items-center rounded-md shadow-md"
                                >
                                    <div>{item.firstSection.title}</div>
                                    <div className="flex gap-5 items-center">
                                        {/* view the live project page in a new tab (read-only link, the admin page stays open) */}
                                        {item.slug ? (
                                            <a
                                                href={`/projects/${item.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="View on website"
                                                aria-label={`View ${item.firstSection.title} on website`}
                                            >
                                                <MdOpenInNew />
                                            </a>
                                        ) : (
                                            <MdOpenInNew className="opacity-30" title="No slug yet" />
                                        )}
                                        <MdEdit onClick={() => router.push(`/admin/projects/edit/${item._id}`)} />
                                        <MdDelete onClick={() => handleDeleteProject(item._id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {reorderMode && (
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll flex-1 min-h-0 pb-2">
                            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={reorderList.map((p) => p._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {reorderList.map((item) => (
                                        <ProjectCard
                                            key={item._id}
                                            id={item._id}
                                            title={item.firstSection.title}
                                            highlight={
                                                item._id === activeMatchId
                                                    ? "active"
                                                    : reorderMatchSet.has(item._id)
                                                      ? "match"
                                                      : undefined
                                            }
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
