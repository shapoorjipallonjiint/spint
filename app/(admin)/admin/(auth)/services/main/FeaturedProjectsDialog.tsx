"use client";

import { useEffect, useMemo, useState } from "react";
import { Move, Search } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProjectOption = {
    _id: string;
    isHidden?: boolean;
    thumbnail?: string;
    firstSection?: { title?: string };
    secondSection?: { location?: { name?: string } | null; service?: { serviceId?: string }[] };
};

// same spacing-proof comparison as the projects list search (titles pasted from Word/web can hold odd spaces)
const normalize = (text?: string) =>
    (text || "")
        .replace(/[​-‍﻿]/g, "")
        .replace(/[\s ]+/g, " ")
        .trim()
        .toLowerCase();

// the order list only moves up/down: drop the sideways part of the drag (no horizontal scroll while dragging)
const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

// one row of the "Order" tab: dragged to set where the project appears in the service's Featured Projects slider
const SortableFeaturedRow = ({ id, serial, project }: { id: string; serial: number; project?: ProjectOption }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 px-3 py-2 bg-white cursor-grab active:cursor-grabbing touch-none ${
                isDragging ? "relative z-10 shadow-md" : ""
            }`}
        >
            <span className="min-w-7 text-sm text-black/50 tabular-nums">{serial}.</span>
            <span className={`flex-1 text-sm ${project?.isHidden ? "text-black/40" : ""}`}>
                {project?.firstSection?.title}
                {project?.secondSection?.location?.name && (
                    <span className="text-black/50"> - {project.secondSection.location.name}</span>
                )}
            </span>
            {project?.isHidden && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">Hidden</span>
            )}
            <Move className="w-4 h-4 text-gray-500 shrink-0" />
        </div>
    );
};

// Picks the projects shown in one service page's "Featured Projects" section, and their order there.
// Nothing is written until Save; Save sets only this service's list (projects themselves are never changed),
// so the order here never affects the projects pages or other services.
const FeaturedProjectsDialog = ({
    service,
    savedIds,
    serviceIdSlugs,
    onClose,
    onSaved,
}: {
    service: { slug: string; name: string } | null;
    savedIds: string[];
    serviceIdSlugs: Record<string, string>;
    onClose: () => void;
    onSaved: (featuredProjects: Record<string, string[]>) => void;
}) => {
    const [projects, setProjects] = useState<ProjectOption[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    // ticked project ids in their Featured Projects order (newly ticked ones go to the end)
    const [selected, setSelected] = useState<string[]>([]);
    const [tab, setTab] = useState<"select" | "order">("select");
    const [search, setSearch] = useState("");
    const [onlySelected, setOnlySelected] = useState(false);
    const [onlyLinked, setOnlyLinked] = useState(false);
    const [saving, setSaving] = useState(false);

    // (re)load every time the dialog opens for a service, starting from its saved selection
    useEffect(() => {
        if (!service) return;
        setSelected([...new Set(savedIds)]);
        setTab("select");
        setSearch("");
        setOnlySelected(false);
        setOnlyLinked(false);
        setStatus("loading");
        fetch("/api/admin/project", { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((json) => {
                setProjects(json?.data?.projects || []);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service?.slug]);

    // project is tagged with this service in its own project settings
    const isLinked = (project: ProjectOption) =>
        (project.secondSection?.service || []).some((s) => serviceIdSlugs[String(s?.serviceId)] === service?.slug);

    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const projectById = useMemo(() => new Map(projects.map((p) => [p._id, p])), [projects]);
    // ticked ids that are still projects (a deleted project drops out of the order list)
    const orderedIds = useMemo(() => selected.filter((id) => projectById.has(id)), [selected, projectById]);

    const visibleProjects = useMemo(() => {
        const term = normalize(search);
        return projects.filter(
            (p) =>
                (!term || normalize(p.firstSection?.title).includes(term)) &&
                (!onlySelected || selectedSet.has(p._id)) &&
                (!onlyLinked || isLinked(p))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects, search, onlySelected, onlyLinked, selectedSet, serviceIdSlugs, service?.slug]);

    const toggle = (id: string) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    // small move threshold so a click on a row doesn't start a drag
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        setSelected((prev) => {
            const ids = prev.filter((id) => projectById.has(id));
            return arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
        });
    };

    // a different set of projects or a different order both count as a change
    const changed = (() => {
        const saved = [...new Set(savedIds)];
        return saved.length !== selected.length || saved.some((id, i) => selected[i] !== id);
    })();

    const save = async () => {
        if (!service || saving) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/services/featured-projects", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: service.slug, projectIds: orderedIds }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Could not save");
            onSaved(json?.data?.featuredProjects || {});
            toast.success(json?.message || "Saved");
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not save");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={!!service}
            onOpenChange={(open) => {
                if (!open && !saving) onClose();
            }}
        >
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Featured Projects - {service?.name}</DialogTitle>
                    <DialogDescription>
                        Tick the projects to show in the Featured Projects section of the {service?.name} page, then drag
                        them into place under Order. This order is used only in that section, not on the projects pages.
                        With none ticked, the section is not shown on that page.
                    </DialogDescription>
                </DialogHeader>

                {status === "loading" && <p className="text-sm text-black/60">Loading projects...</p>}
                {status === "error" && (
                    <p className="text-sm text-red-600">Could not load the projects. Please close and try again - nothing has been changed.</p>
                )}

                {status === "ready" && (
                    <div className="flex gap-1 border-b border-black/10">
                        {(
                            [
                                ["select", "Select projects"],
                                ["order", `Order (${orderedIds.length})`],
                            ] as const
                        ).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTab(key)}
                                className={`px-3 py-2 -mb-px text-sm border-b-2 cursor-pointer ${
                                    tab === key ? "border-black font-medium" : "border-transparent text-black/60 hover:text-black"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {status === "ready" && tab === "order" && (
                    <>
                        <p className="text-sm text-black/60">
                            Drag the projects into the order they should appear in the slider. Projects without a thumbnail or
                            hidden projects stay in the list but are not shown on the website.
                        </p>
                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden border border-black/10 rounded-md">
                            {orderedIds.length === 0 ? (
                                <p className="p-3 text-sm text-black/60">No projects ticked yet - tick them under Select projects.</p>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    modifiers={[restrictToVerticalAxis]}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                                        <div className="divide-y divide-black/10">
                                            {orderedIds.map((id, i) => (
                                                <SortableFeaturedRow key={id} id={id} serial={i + 1} project={projectById.get(id)} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </>
                )}

                {status === "ready" && tab === "select" && (
                    <>
                        <div className="flex flex-col gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search project..."
                                    className="w-full rounded-md border border-black/20 px-3 py-2 pr-9 text-sm outline-none focus:border-black/50"
                                />
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={onlySelected} onChange={(e) => setOnlySelected(e.target.checked)} />
                                    Selected only
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" checked={onlyLinked} onChange={(e) => setOnlyLinked(e.target.checked)} />
                                    Only projects linked to {service?.name}
                                </label>
                                <span className="ms-auto text-black/60">{orderedIds.length} selected</span>
                                {orderedIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSelected([])}
                                        className="text-red-600 hover:underline cursor-pointer"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto border border-black/10 rounded-md divide-y divide-black/10">
                            {visibleProjects.length === 0 && <p className="p-3 text-sm text-black/60">No projects match.</p>}
                            {visibleProjects.map((project) => {
                                const checked = selectedSet.has(project._id);
                                return (
                                    <label
                                        key={project._id}
                                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-black/[0.03] ${checked ? "bg-blue-50/60" : ""}`}
                                    >
                                        <input type="checkbox" checked={checked} onChange={() => toggle(project._id)} />
                                        <span className={`flex-1 text-sm ${project.isHidden ? "text-black/40" : ""}`}>
                                            {project.firstSection?.title}
                                            {project.secondSection?.location?.name && (
                                                <span className="text-black/50"> - {project.secondSection.location.name}</span>
                                            )}
                                        </span>
                                        <span className="flex gap-1.5 shrink-0">
                                            {isLinked(project) && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                                                    Linked
                                                </span>
                                            )}
                                            {project.isHidden && (
                                                <span
                                                    title="Hidden projects are not shown on the website, even when ticked"
                                                    className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200"
                                                >
                                                    Hidden
                                                </span>
                                            )}
                                            {!project.thumbnail && (
                                                <span
                                                    title="No thumbnail image - add one in the project so the card has an image"
                                                    className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200"
                                                >
                                                    No thumbnail
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </>
                )}

                <div className="flex items-center justify-end gap-3">
                    {changed && status === "ready" && <span className="text-sm text-black/60">Not saved yet</span>}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 rounded-md border border-black/20 hover:bg-black/5 disabled:opacity-40 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        disabled={status !== "ready" || !changed || saving}
                        className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80 disabled:opacity-40 cursor-pointer"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FeaturedProjectsDialog;
