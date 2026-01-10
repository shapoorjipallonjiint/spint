"use client";

import { useMemo, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
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
    const [selectedCountry, setSelectedCountry] = useState("Country");
    const [search, setSearch] = useState("");

    const [sector, setSector] = useState<string>("");
    const [sector_ar, setSectorAr] = useState<string>("");

    const [reorderMode, setReorderMode] = useState(false);

    // const [service, setService] = useState<string>("");
    // const [service_ar, setServiceAr] = useState<string>("");

    // const [country, setCountry] = useState<string>("");
    // const [country_ar, setCountryAr] = useState<string>("");

    const [projectList, setProjectList] = useState<
        {
            _id: string;
            firstSection: {
                title: string;
                description: string;
            };
            secondSection?: {
                location?: {
                    name?: string;
                };
            };
        }[]
    >([]);

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
                setValue("metaTitle_ar", data.data.metaTitle);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription);
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle);
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
        handleFetchSector();
        // handleFetchCountry();
        handleFetchService();
        fetchProjectDetails();
    }, []);

    // unique country list
    const countries = useMemo<string[]>(() => {
        if (!projectList?.length) return ["All"];

        // projects that match search (ignore country filter)
        const searchFiltered = projectList.filter((item) =>
            item?.firstSection?.title?.toLowerCase().includes(search.toLowerCase())
        );

        const list = searchFiltered
            .map((p) => p?.secondSection?.location?.name)
            .filter((name): name is string => Boolean(name));

        const uniqueSorted = Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));

        return ["Country", ...uniqueSorted];
    }, [projectList, search]);

    // filtered projects
    const filteredProjects = useMemo(() => {
        if (!projectList?.length) return [];

        const normalizedSearch = search.toLowerCase();

        return projectList.filter((item) => {
            const countryName = item?.secondSection?.location?.name;

            const countryMatch = selectedCountry === "Country" || countryName === selectedCountry;

            const titleMatch = item?.firstSection?.title?.toLowerCase().includes(normalizedSearch) ?? false;

            return countryMatch && titleMatch;
        });
    }, [projectList, selectedCountry, search]);

    const getProjectPos = (id: string) => projectList.findIndex((item) => item._id === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = getProjectPos(active.id as string);
        const newIndex = getProjectPos(over.id as string);

        setProjectList((items) => arrayMove(items, oldIndex, newIndex));
    };

    const confirmProjectOrder = async () => {
        setReorderMode(false);

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
                            <div className="border p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
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

                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                    </div>
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
                            <div className="border p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
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

                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                    </div>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                        Submit
                    </Button>
                </div>
            </form>

            <div className="h-screen grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 h-screen">
                    <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 pb-2">
                            <Label className="text-sm font-bold">Service</Label>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {serviceList.map((item) => (
                                <div
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.pageTitle}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 pb-2">
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
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
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

                <div className="h-screen w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                    <div className="border-b-2 pb-3">
                        <div className="flex justify-between items-center">
                            {/* LEFT: Title */}
                            <Label className="text-sm font-bold">Projects</Label>

                            {/* RIGHT: Controls */}
                            <div className="flex items-center gap-4">
                                <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                                    <SelectTrigger className="w-[180px] text-sm">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white max-h-[350px] overflow-y-scroll">
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country} className="hover:bg-gray-200">
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    className={`text-white ${reorderMode ? "bg-yellow-700" : "bg-green-700"}`}
                                    onClick={() => (reorderMode ? confirmProjectOrder() : setReorderMode(true))}
                                >
                                    {reorderMode ? "Done" : "Reorder"}
                                </Button>

                                <Button className="bg-black text-white" onClick={() => router.push("/admin/projects/add")}>
                                    Add Project
                                </Button>
                            </div>
                        </div>

                        {/* SECOND LINE: Count */}
                        <p className="text-sm text-muted-foreground mt-1">Count: {filteredProjects.length}</p>
                    </div>

                    <div className="relative mt-2 mb-4">
                        <Input
                            type="text"
                            placeholder="Search project..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pr-10 text-sm"
                        />

                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {!reorderMode && (
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
                            {filteredProjects.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md"
                                >
                                    <div>{item.firstSection.title}</div>
                                    <div className="flex gap-5">
                                        <MdEdit onClick={() => router.push(`/admin/projects/edit/${item._id}`)} />
                                        <MdDelete onClick={() => handleDeleteProject(item._id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {reorderMode && (
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
                            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={projectList.map((p) => p._id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {projectList.map((item) => (
                                        <ProjectCard key={item._id} id={item._id} title={item.firstSection.title} />
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
