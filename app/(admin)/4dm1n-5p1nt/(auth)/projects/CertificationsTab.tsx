"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { MdDelete, MdEdit, MdExpandMore, MdOpenInNew } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export type CertificationBadgeItem = {
    _id: string;
    name: string;
    name_ar?: string;
    image: string;
    alt?: string;
    alt_ar?: string;
};

type Draft = Omit<CertificationBadgeItem, "_id">;
const EMPTY: Draft = { name: "", name_ar: "", image: "", alt: "", alt_ar: "" };

// Shared certification badges (e.g. LEED Gold). Upload once here, then pick one in each project's form.
export default function CertificationsTab({
    projects,
    onCountChange,
}: {
    projects: { _id: string; certificationBadgeId?: string; isHidden?: boolean; firstSection?: { title?: string } }[];
    onCountChange?: (count: number) => void;
}) {
    const [badges, setBadges] = useState<CertificationBadgeItem[]>([]);
    // null = dialog closed, "new" = adding, otherwise the id being edited
    const [editing, setEditing] = useState<string | null>(null);
    const [draft, setDraft] = useState<Draft>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [toDelete, setToDelete] = useState<CertificationBadgeItem | null>(null);
    // badges whose project list is expanded
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const fetchBadges = async () => {
        try {
            const response = await fetch("/api/admin/project/certification", { cache: "no-store" });
            const data = await response.json();
            if (response.ok) {
                setBadges(data.data || []);
                onCountChange?.((data.data || []).length);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching certifications", error);
        }
    };

    useEffect(() => {
        fetchBadges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // projects using each badge, keyed by badge id (alphabetical)
    const projectsByBadge = useMemo(() => {
        const map: Record<string, typeof projects> = {};
        projects.forEach((p) => {
            if (p.certificationBadgeId) (map[p.certificationBadgeId] ||= []).push(p);
        });
        Object.values(map).forEach((list) =>
            list.sort((a, b) => (a.firstSection?.title || "").localeCompare(b.firstSection?.title || ""))
        );
        return map;
    }, [projects]);
    const usage = useMemo(
        () => Object.fromEntries(Object.entries(projectsByBadge).map(([id, list]) => [id, list.length])) as Record<string, number>,
        [projectsByBadge]
    );

    const openAdd = () => {
        setDraft(EMPTY);
        setEditing("new");
    };
    const openEdit = (badge: CertificationBadgeItem) => {
        setDraft({
            name: badge.name || "",
            name_ar: badge.name_ar || "",
            image: badge.image || "",
            alt: badge.alt || "",
            alt_ar: badge.alt_ar || "",
        });
        setEditing(badge._id);
    };

    const save = async () => {
        if (!draft.name.trim() || !draft.image) {
            toast.error("Name and badge image are required");
            return;
        }
        setSaving(true);
        try {
            const isNew = editing === "new";
            const response = await fetch(
                isNew ? "/api/admin/project/certification" : `/api/admin/project/certification?id=${editing}`,
                { method: isNew ? "POST" : "PATCH", body: JSON.stringify(draft) }
            );
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setEditing(null);
                fetchBadges();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error saving certification", error);
            toast.error("Could not save certification");
        } finally {
            setSaving(false);
        }
    };

    const remove = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project/certification?id=${id}`, { method: "DELETE" });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                fetchBadges();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error deleting certification", error);
        }
    };

    return (
        <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
            <div className="flex justify-between items-center border-b-2 border-black/20 pb-2">
                <div>
                    <Label className="text-sm font-bold">Certifications</Label>
                    <p className="text-xs text-black/50">
                        Badges shown on project cards (e.g. LEED Gold). Upload once here, then choose one in each project.
                    </p>
                </div>
                <button type="button" className="bg-black text-white px-2 py-1 rounded-md cursor-pointer" onClick={openAdd}>
                    Add Certification
                </button>
            </div>

            <div className="mt-2 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pb-2">
                {badges.length === 0 && <p className="text-sm text-black/40 p-2">No certifications yet.</p>}
                {badges.map((badge) => {
                    const used = projectsByBadge[badge._id] || [];
                    const isOpen = !!expanded[badge._id] && used.length > 0;
                    return (
                        <div
                            key={badge._id}
                            className="border border-black/20 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex justify-between p-2 items-center">
                                <div className="flex items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={badge.image} alt="" className="h-12 w-12 object-contain rounded-md bg-black/80 p-1" />
                                    <div className="text-[16px]">{badge.name}</div>
                                    {/* project count; click to show / hide the project names */}
                                    <button
                                        type="button"
                                        disabled={used.length === 0}
                                        aria-expanded={isOpen}
                                        onClick={() => setExpanded((e) => ({ ...e, [badge._id]: !e[badge._id] }))}
                                        className={`inline-flex items-center gap-1 ps-2.5 pe-1.5 py-0.5 rounded-full text-xs border transition-colors ${
                                            isOpen
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                        } ${used.length === 0 ? "cursor-default opacity-70" : "cursor-pointer"}`}
                                    >
                                        {used.length} {used.length === 1 ? "project" : "projects"}
                                        {used.length > 0 && (
                                            <MdExpandMore
                                                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className="flex gap-5">
                                    <button type="button" onClick={() => openEdit(badge)} aria-label="Edit">
                                        <MdEdit className="cursor-pointer" />
                                    </button>
                                    <button type="button" onClick={() => setToDelete(badge)} aria-label="Delete">
                                        <MdDelete className="cursor-pointer" />
                                    </button>
                                </div>
                            </div>

                            {/* project names, animated open / close */}
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="mx-2 mb-2 border-t border-black/10 pt-3 ps-[60px] flex flex-wrap gap-2">
                                        {used.map((project) => (
                                            <Link
                                                key={project._id}
                                                href={`/4dm1n-5p1nt/projects/edit/${project._id}`}
                                                title="Edit project"
                                                className="group inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-sm text-black/80 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                {project.firstSection?.title || "Untitled project"}
                                                {project.isHidden && (
                                                    <span className="rounded-full bg-black/5 px-1.5 text-[10px] uppercase tracking-wide text-black/50">
                                                        Hidden
                                                    </span>
                                                )}
                                                <MdOpenInNew className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* add / edit */}
            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing === "new" ? "Add Certification" : "Edit Certification"}</DialogTitle>
                        <DialogDescription>A transparent PNG or SVG works best.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        <div>
                            <Label>Badge Image</Label>
                            <ImageUploader isLogo value={draft.image} onChange={(url) => setDraft((d) => ({ ...d, image: url }))} />
                        </div>
                        <div>
                            <Label>Name (English)</Label>
                            <Input
                                placeholder="e.g. LEED Gold"
                                value={draft.name}
                                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label>Name (Arabic)</Label>
                            <Input value={draft.name_ar} onChange={(e) => setDraft((d) => ({ ...d, name_ar: e.target.value }))} />
                        </div>
                        <div>
                            <Label>Alt Tag (English)</Label>
                            <Input
                                placeholder="e.g. LEED Gold Certified"
                                value={draft.alt}
                                onChange={(e) => setDraft((d) => ({ ...d, alt: e.target.value }))}
                            />
                        </div>
                        <div>
                            <Label>Alt Tag (Arabic)</Label>
                            <Input value={draft.alt_ar} onChange={(e) => setDraft((d) => ({ ...d, alt_ar: e.target.value }))} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <DialogClose className="px-4 py-2 rounded-md border border-black/20 hover:bg-black/5 cursor-pointer">
                            Cancel
                        </DialogClose>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={save}
                            className="px-4 py-2 rounded-md bg-black text-white cursor-pointer disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* delete confirmation */}
            <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete certification?</DialogTitle>
                        <DialogDescription>
                            &ldquo;{toDelete?.name}&rdquo; will be permanently deleted. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {toDelete && (usage[toDelete._id] || 0) > 0 && (
                        <p className="text-sm rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2">
                            Warning: {usage[toDelete._id]} {usage[toDelete._id] === 1 ? "project uses" : "projects use"} this
                            badge. The projects will not be deleted, but their cards will no longer show a badge.
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        <DialogClose className="px-4 py-2 rounded-md border border-black/20 hover:bg-black/5 cursor-pointer">
                            No
                        </DialogClose>
                        <DialogClose
                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                            onClick={() => toDelete && remove(toDelete._id)}
                        >
                            Yes, delete
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
