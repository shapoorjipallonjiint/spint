"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slugify";

type City = { _id: string; name: string; name_ar?: string; showInProjectFilter?: boolean };
type CountryOption = { slug: string; name: string; ids: string[] };
type ProjectLite = { secondSection?: { location?: { _id?: string } | string | null } };

// one draggable row
const Row = ({ option, position, count, inSaved }: { option: CountryOption; position: number; count: number; inSaved: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: option.slug });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-shadow ${
                isDragging ? "z-10 border-primary/40 shadow-lg" : "border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            }`}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                aria-label={`Drag ${option.name}`}
                className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:cursor-grabbing"
            >
                <GripVertical className="h-4 w-4" />
            </button>
            <span className="w-7 shrink-0 text-right text-[13px] font-semibold tabular-nums text-slate-400">{position}</span>
            <span className="flex-1 truncate text-[15px] text-slate-800">{option.name}</span>
            {!inSaved && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200/70">
                    Not in saved order
                </span>
            )}
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 ring-1 ring-blue-200">
                {count} {count === 1 ? "project" : "projects"}
            </span>
        </div>
    );
};

// Order of the countries in the website's /projects country filter (the client orders them by project volume / cost).
// Lists the map locations that have "show in project filter" on, grouped by name exactly like the filter does.
export default function CountryFilterTab({ projects }: { projects: ProjectLite[] }) {
    const [cities, setCities] = useState<City[]>([]);
    const [savedOrder, setSavedOrder] = useState<string[]>([]);
    const [order, setOrder] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/home/countries", { cache: "no-store" }).then((res) => (res.ok ? res.json() : { data: [] })),
            fetch("/api/admin/project/country-filter-order", { cache: "no-store" }).then((res) =>
                res.ok ? res.json() : { data: { order: [] } }
            ),
        ])
            .then(([countries, saved]) => {
                setCities(countries?.data || []);
                setSavedOrder(saved?.data?.order || []);
            })
            .catch(() => toast.error("Could not load the countries"))
            .finally(() => setLoading(false));
    }, []);

    // filter options, grouped by slug like the website filter
    const options = useMemo(() => {
        const bySlug = new Map<string, CountryOption>();
        cities
            .filter((city) => city.showInProjectFilter)
            .forEach((city) => {
                const slug = slugify(city.name);
                if (!slug) return;
                if (!bySlug.has(slug)) bySlug.set(slug, { slug, name: city.name, ids: [] });
                bySlug.get(slug)!.ids.push(String(city._id));
            });
        return bySlug;
    }, [cities]);

    // projects per country option (all projects, hidden included)
    const counts = useMemo(() => {
        const perLocation = new Map<string, number>();
        projects.forEach((p) => {
            const loc = p.secondSection?.location;
            const id = typeof loc === "string" ? loc : loc?._id;
            if (id) perLocation.set(String(id), (perLocation.get(String(id)) || 0) + 1);
        });
        const result: Record<string, number> = {};
        options.forEach((opt) => (result[opt.slug] = opt.ids.reduce((n, id) => n + (perLocation.get(id) || 0), 0)));
        return result;
    }, [projects, options]);

    // the website's order: saved countries first, then the rest by number of projects (then A-Z)
    const websiteOrder = useMemo(() => {
        const all = [...options.keys()];
        const saved = savedOrder.filter((slug) => options.has(slug));
        const rest = all
            .filter((slug) => !saved.includes(slug))
            .sort((a, b) => (counts[b] || 0) - (counts[a] || 0) || options.get(a)!.name.localeCompare(options.get(b)!.name));
        return [...saved, ...rest];
    }, [options, savedOrder, counts]);

    // editable copy, reset whenever the saved state / data changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- derived list re-seeded from loaded data
        setOrder(websiteOrder);
    }, [websiteOrder]);

    const dirty = order.join("|") !== websiteOrder.join("|");

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        setOrder((list) => arrayMove(list, list.indexOf(String(active.id)), list.indexOf(String(over.id))));
    };

    const save = async (next: string[]) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/project/country-filter-order", {
                method: "PUT",
                body: JSON.stringify({ order: next }),
            });
            const data = await res.json();
            if (res.ok) {
                setSavedOrder(data?.data?.order || []);
                toast.success(data.message);
            } else {
                toast.error(data.message || "Could not save the order");
            }
        } catch {
            toast.error("Could not save the order");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-black/20 pb-3">
                <div>
                    <Label className="text-sm font-bold">Country Filter Order</Label>
                    <p className="mt-1 max-w-[70ch] text-xs text-black/50">
                        Order of the countries in the website&apos;s projects filter. Drag to match the client&apos;s volume list, then
                        save. Countries not in the saved order follow after it, by number of projects. Countries are added or
                        removed from the filter in <Link href="/4dm1n-5p1nt/home/map-locations" className="text-primary underline">Map Locations</Link>{" "}
                        (&quot;show in project filter&quot;).
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={saving || savedOrder.length === 0}
                        onClick={() => save([])}
                        title="Forget the saved order: most projects first again"
                    >
                        <RotateCcw /> Reset to default
                    </Button>
                    {dirty && (
                        <Button type="button" variant="outline" disabled={saving} onClick={() => setOrder(websiteOrder)}>
                            Cancel
                        </Button>
                    )}
                    <Button type="button" className="text-white" disabled={saving || (!dirty && savedOrder.length > 0)} onClick={() => save(order)}>
                        {saving ? "Saving..." : "Save order"}
                    </Button>
                </div>
            </div>

            {savedOrder.length === 0 && !loading && (
                <p className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
                    No order saved yet: the website currently shows the countries with the most projects first (the order below).
                </p>
            )}

            <div className="mt-3 flex-1 min-h-0 overflow-y-auto pb-2">
                {loading ? (
                    <p className="p-2 text-sm text-black/40">Loading countries...</p>
                ) : order.length === 0 ? (
                    <p className="p-2 text-sm text-black/40">No countries are shown in the project filter.</p>
                ) : (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={order} strategy={verticalListSortingStrategy}>
                            <div className="flex flex-col gap-2">
                                {order.map((slug, index) => {
                                    const option = options.get(slug);
                                    if (!option) return null;
                                    return (
                                        <Row
                                            key={slug}
                                            option={option}
                                            position={index + 1}
                                            count={counts[slug] || 0}
                                            inSaved={savedOrder.length === 0 || savedOrder.includes(slug)}
                                        />
                                    );
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
