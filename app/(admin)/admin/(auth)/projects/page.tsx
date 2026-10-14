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
import { toast } from "sonner";
import { Search, Eye, EyeOff, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import ProjectCard from "./ProjectCard";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { isValidOrderKey, normalizeCountryCode, orderKeyForCountry, orderKeyLabel } from "@/lib/countryCodes";

type ProjectListItem = {
    _id: string;
    slug?: string;
    // hidden from the website; missing means visible
    isHidden?: boolean;
    firstSection: {
        title: string;
        description: string;
        status?: string;
    };
    secondSection?: {
        sector?: { name?: string }[];
        location?: {
            name?: string;
            code?: string;
        };
        // project details rows; the "Location" row holds the city / area (e.g. Dubai)
        items?: { key?: string; value?: string }[];
    };
};

const ALL_SCOPE = "Country";

// search text in a comparable form: titles saved from Word/web can hold non-breaking or invisible spaces,
// tabs or double spaces, so "Sidi Abdellah University" typed normally would not match. Display is unchanged.
const normalizeForSearch = (text?: string) =>
    (text || "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[\s\u00A0]+/g, " ")
        .trim()
        .toLowerCase();
const titleMatches = (item: ProjectListItem, term: string) =>
    normalizeForSearch(item?.firstSection?.title).includes(normalizeForSearch(term));

// small flag for the country pill (flagcdn.com image, so it looks the same on every OS - emoji flags
// show as plain letters on Windows). Nothing is shown for a missing / unknown code or if the image fails.
const CountryFlag = ({ code }: { code?: string }) => {
    const iso = normalizeCountryCode(code).toLowerCase();
    const [failed, setFailed] = useState(false);
    if (!iso || failed) return null;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://flagcdn.com/w20/${iso}.png`}
            srcSet={`https://flagcdn.com/w40/${iso}.png 2x`}
            alt=""
            width={16}
            height={12}
            loading="lazy"
            onError={() => setFailed(true)}
            className="w-4 h-3 object-cover rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
        />
    );
};

// the project's "Location" detail value (city / area), found by its English label like the project page does
const locationDetailOf = (item: ProjectListItem) =>
    (item?.secondSection?.items || []).find((row) => /^\s*location\b/i.test(row?.key ?? ""))?.value?.trim() || "";

// dropdown value for a project: its order key ("AE", "AFRICA", ...), or its location name when it has no country code
const scopeOf = (item: ProjectListItem) => {
    const location = item?.secondSection?.location;
    return orderKeyForCountry(location?.code) || (location?.name ? `name:${location.name}` : "");
};

const PAGE_TABS = [
    { key: "projects", label: "Projects" },
    { key: "sectors", label: "Sectors" },
    { key: "services", label: "Services" },
] as const;

export default function Projects() {
    const [activeTab, setActiveTab] = useState<(typeof PAGE_TABS)[number]["key"]>("projects");
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
            // services hidden in Services > Main are left out of this list
            const [response, visibility] = await Promise.all([
                fetch("/api/admin/services"),
                fetch("/api/admin/services/visibility", { cache: "no-store" })
                    .then((res) => (res.ok ? res.json() : null))
                    .catch(() => null),
            ]);
            if (response.ok) {
                const data = await response.json();
                const hiddenIds: string[] = visibility?.data?.hiddenServiceIds || [];
                setServiceList((data.data || []).filter((item: { _id: string }) => !hiddenIds.includes(String(item._id))));
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching service", error);
        }
    };

    // show / hide one project on the website; only its isHidden flag is changed
    const [visibilityBusyId, setVisibilityBusyId] = useState<string | null>(null);
    const handleToggleVisibility = async (item: ProjectListItem) => {
        const isHidden = !item.isHidden;
        setVisibilityBusyId(item._id);
        try {
            const response = await fetch("/api/admin/project/visibility", {
                method: "PATCH",
                body: JSON.stringify({ id: item._id, isHidden }),
            });
            const data = await response.json();
            if (response.ok) {
                setProjectList((list) => list.map((p) => (p._id === item._id ? { ...p, isHidden } : p)));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error changing project visibility", error);
            toast.error("Could not change visibility");
        } finally {
            setVisibilityBusyId(null);
        }
    };

    // project waiting for the Yes / No delete confirmation (null = dialog closed)
    const [projectToDelete, setProjectToDelete] = useState<ProjectListItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const confirmDeleteProject = async () => {
        if (!projectToDelete) return;
        setDeleting(true);
        await handleDeleteProject(projectToDelete._id);
        setDeleting(false);
        setProjectToDelete(null);
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

    useEffect(() => {
        handleFetchProjects();
        handleFetchProjectOrders();
        handleFetchSector();
        // handleFetchCountry();
        handleFetchService();
    }, []);

    // dropdown options: one per country (all African countries together as "Africa"), sorted by label
    const countries = useMemo<{ value: string; label: string }[]>(() => {
        // projects that match search (ignore country filter)
        const searchFiltered = projectList.filter((item) => titleMatches(item, search));

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

        const list = projectList.filter((item) => {
            const countryMatch = selectedCountry === ALL_SCOPE || scopeOf(item) === selectedCountry;

            const titleMatch = titleMatches(item, search);

            return countryMatch && titleMatch;
        });

        return selectedOrderKey ? sortByScopeOrder(list) : list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectList, selectedCountry, search, projectOrders]);

    // S.No = position in the current order (global, or the selected country's), unaffected by the search box
    const positionById = useMemo(() => {
        const scoped =
            selectedCountry === ALL_SCOPE ? projectList : projectList.filter((item) => scopeOf(item) === selectedCountry);
        const ordered = selectedOrderKey ? sortByScopeOrder(scoped) : scoped;
        return new Map(ordered.map((item, i) => [item._id, i + 1]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectList, selectedCountry, projectOrders]);

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
        if (!reorderMode || !normalizeForSearch(search)) return [];
        return reorderList
            .filter((item) => titleMatches(item, search))
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
        // fills the admin content area exactly: the tabs stay put and only the lists inside scroll
        <div className="h-full flex flex-col gap-5">
            {/* one section at a time: Projects (default), Sectors or Services */}
            <div className="shrink-0 inline-flex w-fit rounded-md border overflow-hidden">
                {PAGE_TABS.map((tab, index) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm cursor-pointer ${index > 0 ? "border-l" : ""} ${
                            activeTab === tab.key ? "bg-primary text-white" : "bg-white"
                        }`}
                    >
                        {tab.label}
                        <span className={`ms-1.5 text-xs ${activeTab === tab.key ? "text-white/70" : "text-black/40"}`}>
                            {tab.key === "projects"
                                ? projectList.length
                                : tab.key === "sectors"
                                  ? sectorList.length
                                  : serviceList.length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0">
                {activeTab !== "projects" && (
                <div className="h-full">
                    {activeTab === "services" && (
                    <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
                        <div className="flex justify-between border-b-2 border-black/20 pb-2">
                            <Label className="text-sm font-bold">Service</Label>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pb-2">
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
                    )}

                    {activeTab === "sectors" && (
                    <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
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
                        <div className="mt-2 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pb-2">
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
                    )}

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
                )}

                {activeTab === "projects" && (
                <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
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
                            // paste as plain text: copies from Word/web/Excel can carry non-breaking or
                            // invisible spaces, tabs and line breaks that stop a title from matching
                            onPaste={(e) => {
                                e.preventDefault();
                                const pasted = e.clipboardData
                                    .getData("text/plain")
                                    .replace(/[​-‍﻿]/g, "")
                                    .replace(/[\s ]+/g, " ")
                                    .trim();
                                const input = e.currentTarget;
                                const start = input.selectionStart ?? search.length;
                                const end = input.selectionEnd ?? search.length;
                                setSearch(search.slice(0, start) + pasted + search.slice(end));
                                // keep the cursor right after the pasted text
                                requestAnimationFrame(() => input.setSelectionRange(start + pasted.length, start + pasted.length));
                            }}
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
                                    {/* hidden projects stay in the list (editable / reorderable), greyed out */}
                                    <div className={item.isHidden ? "opacity-50" : ""}>
                                        <span className="inline-block min-w-11 text-muted-foreground tabular-nums">
                                            {positionById.get(item._id)}.
                                        </span>
                                        {item.firstSection.title}
                                        {item.isHidden && <span className="text-muted-foreground"> (Hidden)</span>}
                                        {/* location / status / sector pills under the name, lined up with the title (past the number) */}
                                        <div className="flex flex-wrap gap-1.5 mt-1 ps-11">
                                            {/* country pill with its flag, then the project's location (city / area) from its "Location" detail */}
                                            {item.secondSection?.location?.name && (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                                                    <CountryFlag code={item.secondSection.location.code} />
                                                    {item.secondSection.location.name}
                                                </span>
                                            )}
                                            {(() => {
                                                const place = locationDetailOf(item);
                                                // skip when empty or just repeating the country
                                                if (!place || normalizeForSearch(place) === normalizeForSearch(item.secondSection?.location?.name)) return null;
                                                return (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white text-gray-700 border border-gray-300">
                                                        <MapPin className="w-3 h-3 text-gray-500" />
                                                        {place}
                                                    </span>
                                                );
                                            })()}
                                            {item.firstSection.status && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-200">
                                                    {item.firstSection.status}
                                                </span>
                                            )}
                                            {(item.secondSection?.sector || [])
                                                .filter((s) => s?.name)
                                                .map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200"
                                                    >
                                                        {s.name}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    {/* row actions: each icon has a tooltip (components/ui/tooltip) that fades in / out on hover */}
                                    <div className="flex gap-5 items-center">
                                        {/* view the live project page in a new tab (read-only link, the admin page stays open) */}
                                        {item.slug ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a
                                                        href={`/projects/${item.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`View ${item.firstSection.title} on website`}
                                                        className="cursor-pointer transition-transform duration-200 hover:scale-125"
                                                    >
                                                        <MdOpenInNew />
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>View on website</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span aria-label="No slug yet">
                                                        <MdOpenInNew className="opacity-30" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>No slug yet</TooltipContent>
                                            </Tooltip>
                                        )}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleVisibility(item)}
                                                    disabled={visibilityBusyId === item._id}
                                                    aria-label={item.isHidden ? `Show ${item.firstSection.title} on website` : `Hide ${item.firstSection.title} from website`}
                                                    className="cursor-pointer transition-transform duration-200 hover:scale-125 disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100"
                                                >
                                                    {item.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>{item.isHidden ? "Hidden - click to show on website" : "Visible - click to hide from website"}</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    onClick={() => router.push(`/admin/projects/edit/${item._id}`)}
                                                    aria-label={`Edit ${item.firstSection.title}`}
                                                    className="cursor-pointer transition-transform duration-200 hover:scale-125"
                                                >
                                                    <MdEdit />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Edit project</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    // asks Yes / No first (dialog at the end of the page); nothing is deleted here
                                                    onClick={() => setProjectToDelete(item)}
                                                    aria-label={`Delete ${item.firstSection.title}`}
                                                    className="cursor-pointer transition-transform duration-200 hover:scale-125"
                                                >
                                                    <MdDelete />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>Delete project</TooltipContent>
                                        </Tooltip>
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
                                    {reorderList.map((item, index) => (
                                        <ProjectCard
                                            key={item._id}
                                            id={item._id}
                                            serial={index + 1}
                                            title={item.firstSection.title}
                                            country={item.secondSection?.location?.name}
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
                )}
            </div>

            {/* delete confirmation: the project is deleted only on "Yes"; "No", Esc or clicking outside cancels */}
            <Dialog
                open={!!projectToDelete}
                onOpenChange={(open) => {
                    if (!open && !deleting) setProjectToDelete(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete project?</DialogTitle>
                        <DialogDescription>
                            &ldquo;{projectToDelete?.firstSection.title}&rdquo; will be permanently deleted from the website and the
                            admin. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setProjectToDelete(null)}
                            disabled={deleting}
                            className="px-4 py-2 rounded-md border border-black/20 hover:bg-black/5 cursor-pointer disabled:opacity-40"
                        >
                            No
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteProject}
                            disabled={deleting}
                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer disabled:opacity-60"
                        >
                            {deleting ? "Deleting..." : "Yes, delete"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
