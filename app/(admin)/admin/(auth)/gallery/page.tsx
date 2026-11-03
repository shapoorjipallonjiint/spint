"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdChevronRight, MdWarningAmber } from "react-icons/md";
import { TbReorder } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import GalleryHeader from "@/app/components/AdminGallery/GalleryHeader";
import NameDialog from "@/app/components/AdminGallery/NameDialog";
import ConfirmDialog from "@/app/components/AdminGallery/ConfirmDialog";
import ReorderList from "@/app/components/AdminGallery/ReorderList";
import VisibilityToggle from "@/app/components/AdminGallery/VisibilityToggle";

interface GalleryPageProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
}

type Album = { _id: string; title: string; title_ar?: string; images?: string[]; isHidden?: boolean };
type AllAlbum = Album & { sectionTitle: string; sectionHidden?: boolean };
type Section = { _id: string; title: string; title_ar: string; isHidden?: boolean; categories?: Album[] };

const countPhotos = (s: Section) => (s.categories || []).reduce((n, a) => n + (a.images?.length || 0), 0);
const countEmpty = (s: Section) => (s.categories || []).filter((a) => !a.isHidden && !a.images?.length).length;
const countHiddenAlbums = (s: Section) => (s.categories || []).filter((a) => a.isHidden).length;
const firstCover = (s: Section) => (s.categories || []).find((a) => a.images?.length)?.images?.[0] || "";
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

type Tab = "page" | "gallery";

const TABS: { key: Tab; label: string }[] = [
    { key: "page", label: "Page" },
    { key: "gallery", label: "Gallery" },
];

const AdminGallery = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab: Tab = searchParams.get("tab") === "gallery" ? "gallery" : "page";

    const changeTab = (next: Tab) => {
        if (next === tab) return;
        setReorderMode(false);
        setAllMode(false);
        router.push(`/admin/gallery?tab=${next}`, { scroll: false });
    };

    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<Section | null>(null);
    const [deleting, setDeleting] = useState<Section | null>(null);

    const [reorderMode, setReorderMode] = useState(false);
    const [reorderDraft, setReorderDraft] = useState<Section[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);

    // "All" tab order (public page default tab)
    const [allOrder, setAllOrder] = useState<string[]>([]);
    const [allMode, setAllMode] = useState(false);
    const [allDraft, setAllDraft] = useState<AllAlbum[]>([]);
    const [savingAll, setSavingAll] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<GalleryPageProps>();

    const fetchGalleryData = async () => {
        try {
            const response = await fetch(`/api/admin/gallery/meta`);
            const data = await response.json();
            if (response.ok) {
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setSections(data.data.gallery || []);
                setAllOrder(data.data.allOrder || []);
            }
        } catch {
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    /* ---------- Section CRUD (same endpoints as before) ---------- */

    const addSection = async ({ name, name_ar }: { name: string; name_ar: string }) => {
        try {
            const response = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, name_ar }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return false;
            }
            toast.success("Section added");
            fetchGalleryData();
            return true;
        } catch {
            toast.error("Something went wrong");
            return false;
        }
    };

    const editSection = async ({ name, name_ar }: { name: string; name_ar: string }) => {
        if (!editing) return false;
        try {
            const response = await fetch(`/api/admin/gallery?id=${editing._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, name_ar }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return false;
            }
            toast.success("Section updated");
            fetchGalleryData();
            return true;
        } catch {
            toast.error("Something went wrong");
            return false;
        }
    };

    const deleteSection = async () => {
        if (!deleting) return;
        try {
            const response = await fetch(`/api/admin/gallery?id=${deleting._id}`, { method: "DELETE" });
            const data = await response.json();
            if (response.ok) toast.success("Section deleted");
            else toast.error(data.message);
        } catch {
            toast.error("Something went wrong");
        } finally {
            fetchGalleryData();
        }
    };

    /* ---------- Reorder (IDs only) ---------- */

    const saveOrder = async () => {
        setSavingOrder(true);
        try {
            const response = await fetch("/api/admin/gallery/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: reorderDraft.map((s) => s._id) }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setReorderMode(false);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSavingOrder(false);
            fetchGalleryData();
        }
    };

    /* ---------- Page settings (same payload as before) ---------- */

    const onSubmit = async (data: GalleryPageProps) => {
        try {
            const response = await fetch(`/api/admin/gallery/meta`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (response.ok) toast.success(res.message);
            else toast.error(res.message);
        } catch {
            toast.error("Something went wrong");
        }
    };

    /** Every album across sections, in the order the public "All" tab currently shows. */
    const defaultAll: AllAlbum[] = sections.flatMap((s) =>
        (s.categories || []).map((a) => ({
            _id: a._id,
            title: a.title,
            title_ar: a.title_ar,
            images: a.images,
            sectionTitle: s.title,
            isHidden: a.isHidden,
            sectionHidden: s.isHidden,
        }))
    );
    const rank = new Map(allOrder.map((id, i) => [id, i]));
    const effectiveAll = defaultAll
        .map((a, i) => ({ a, r: rank.has(a._id) ? rank.get(a._id)! : allOrder.length + i }))
        .sort((x, y) => x.r - y.r)
        .map(({ a }) => a);
    const hasCustomAllOrder = allOrder.length > 0;

    const saveAllOrder = async () => {
        setSavingAll(true);
        try {
            const response = await fetch("/api/admin/gallery/reorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scope: "all", order: allDraft.map((a) => a._id) }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setAllMode(false);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSavingAll(false);
            fetchGalleryData();
        }
    };

    const totalAlbums = sections.reduce((n, s) => n + (s.categories?.length || 0), 0);
    const totalPhotos = sections.reduce((n, s) => n + countPhotos(s), 0);

    return (
        <div className="flex flex-col gap-6">
            <GalleryHeader
                crumbs={[{ label: "Gallery" }]}
                title="Gallery"
                subtitle={
                    tab === "page"
                        ? "Banner title and SEO for the Gallery page."
                        : loading
                          ? "Loading..."
                          : `${plural(sections.length, "section")} · ${plural(totalAlbums, "album")} · ${plural(totalPhotos, "photo")}`
                }
            />

            <div role="tablist" className="flex gap-1 border-b border-black/10">
                {TABS.map((t) => {
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => changeTab(t.key)}
                            className={`px-5 py-2.5 text-sm font-medium -mb-px border-b-2 transition ${
                                active ? "border-primary text-primary" : "border-transparent text-black/60 hover:text-black"
                            }`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* ---------------- Gallery tab ---------------- */}
            <div role="tabpanel" hidden={tab !== "gallery"} className="flex-col gap-6 [&:not([hidden])]:flex">
            {/* ---- "All" tab order ---- */}
            <AdminItemContainer>
                <div className="flex justify-between items-center gap-4 p-5 border-b border-black/10 flex-wrap">
                    <div>
                        <p className="font-semibold text-lg">&quot;All&quot; tab order</p>
                        <p className="text-sm text-black/60">
                            &quot;All&quot; is the tab visitors see first. It shows albums from every section.{" "}
                            {hasCustomAllOrder ? "A custom order is set." : "Currently in default order (section by section)."}
                        </p>
                    </div>
                    {allMode ? (
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setAllDraft(defaultAll)}
                                disabled={savingAll}
                                title="Put albums back section by section"
                            >
                                Reset to default
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setAllMode(false)} disabled={savingAll}>
                                Cancel
                            </Button>
                            <Button type="button" className="text-white" onClick={saveAllOrder} disabled={savingAll}>
                                {savingAll ? "Saving..." : "Save order"}
                            </Button>
                        </div>
                    ) : (
                        defaultAll.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setReorderMode(false);
                                    setAllDraft(effectiveAll);
                                    setAllMode(true);
                                }}
                            >
                                <TbReorder /> Arrange &quot;All&quot; tab
                            </Button>
                        )
                    )}
                </div>
                {allMode && (
                    <div className="p-5 flex flex-col gap-3">
                        <p className="text-sm text-black/60">
                            Drag albums into the order you want on the &quot;All&quot; tab, then click Save order. This only affects the
                            &quot;All&quot; tab; each section tab keeps its own album order. New albums are added at the end.
                        </p>
                        <ReorderList
                            items={allDraft}
                            onChange={setAllDraft}
                            getThumbnail={(a) => a.images?.[0] || ""}
                            getMeta={(a) =>
                                a.sectionHidden
                                    ? `${a.sectionTitle} · hidden (section hidden)`
                                    : a.isHidden
                                      ? `${a.sectionTitle} · hidden`
                                      : a.images?.length
                                        ? a.sectionTitle
                                        : `${a.sectionTitle} · hidden (no photos)`
                            }
                        />
                    </div>
                )}
            </AdminItemContainer>

            <AdminItemContainer>
                <div className="flex justify-between items-center gap-4 p-5 border-b border-black/10 flex-wrap">
                    <div>
                        <p className="font-semibold text-lg">Sections</p>
                        <p className="text-sm text-black/60">
                            Each section is a filter tab on the Gallery page. The order here is the order of the tabs.
                        </p>
                    </div>

                    {reorderMode ? (
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setReorderMode(false)} disabled={savingOrder}>
                                Cancel
                            </Button>
                            <Button type="button" className="text-white" onClick={saveOrder} disabled={savingOrder}>
                                {savingOrder ? "Saving..." : "Save order"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {sections.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setAllMode(false);
                                        setReorderDraft(sections);
                                        setReorderMode(true);
                                    }}
                                >
                                    <TbReorder /> Reorder
                                </Button>
                            )}
                            <Button type="button" className="text-white" onClick={() => setAddOpen(true)}>
                                + Add section
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    {reorderMode ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-black/60">Drag sections into the order you want, then click Save order.</p>
                            <ReorderList
                                items={reorderDraft}
                                onChange={setReorderDraft}
                                getThumbnail={firstCover}
                                getMeta={(s) => plural(s.categories?.length || 0, "album")}
                            />
                        </div>
                    ) : loading ? (
                        <p className="text-sm text-black/60 py-10 text-center">Loading...</p>
                    ) : sections.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No sections yet</p>
                            <p className="text-sm text-black/60">Start by adding a section, e.g. &quot;Events&quot; or &quot;Projects&quot;.</p>
                            <Button type="button" className="text-white" onClick={() => setAddOpen(true)}>
                                + Add section
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {sections.map((s, index) => {
                                const albums = s.categories?.length || 0;
                                const photos = countPhotos(s);
                                const empty = countEmpty(s);
                                const hiddenAlbums = countHiddenAlbums(s);
                                const cover = firstCover(s);
                                return (
                                    <div
                                        key={s._id}
                                        className={`flex items-center gap-4 border rounded-lg p-3 transition ${
                                            s.isHidden ? "border-dashed border-black/20 bg-black/[0.02]" : "border-black/15 hover:border-black/30"
                                        }`}
                                    >
                                        <span className="w-6 text-sm text-black/50 shrink-0 text-center">{index + 1}</span>
                                        <div className={`w-20 h-14 rounded-md bg-black/5 overflow-hidden shrink-0 ${s.isHidden ? "opacity-40 grayscale" : ""}`}>
                                            {cover && (
                                                <Image src={cover} alt="" width={80} height={56} className="w-full h-full object-cover" />
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                            <p className={`font-medium truncate ${s.isHidden ? "text-black/50" : ""}`}>
                                                {s.title}
                                                {s.isHidden && (
                                                    <span className="ml-2 text-xs font-normal bg-black/10 text-black/70 rounded px-1.5 py-0.5">
                                                        Hidden on website
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-black/60 truncate" dir="rtl">
                                                {s.title_ar?.trim() || <span className="italic">No Arabic name</span>}
                                            </p>
                                            <div className="flex gap-3 text-xs text-black/60 flex-wrap">
                                                <span>{plural(albums, "album")}</span>
                                                <span>{plural(photos, "photo")}</span>
                                                {hiddenAlbums > 0 && <span>{plural(hiddenAlbums, "album")} hidden</span>}
                                                {empty > 0 && (
                                                    <span className="flex items-center gap-1 text-amber-700">
                                                        <MdWarningAmber /> {plural(empty, "album")} not shown (no photos)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <span className="mr-2">
                                                <VisibilityToggle galleryId={s._id} hidden={!!s.isHidden} onChanged={fetchGalleryData} />
                                            </span>
                                            <Button type="button" variant="ghost" size="icon" title="Rename" onClick={() => setEditing(s)}>
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Delete"
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => setDeleting(s)}
                                            >
                                                <MdDelete />
                                            </Button>
                                            <Link
                                                href={`/admin/gallery/${s._id}`}
                                                className="flex items-center gap-1 bg-primary text-white text-sm rounded-md px-3 py-2 ml-2 hover:bg-primary/90"
                                            >
                                                Manage albums <MdChevronRight />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AdminItemContainer>
            </div>

            {/* ---------------- Page tab (kept mounted so unsaved form values survive tab switches) ---------------- */}
            <div role="tabpanel" hidden={tab !== "page"}>
            <AdminItemContainer>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-5 border-b border-black/10">
                        <p className="font-semibold text-lg">Page settings</p>
                        <p className="text-sm text-black/60">Banner title and SEO for the Gallery page.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-black/50">English</p>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Banner title</Label>
                                <Input type="text" {...register("pageTitle", { required: "Banner title is required" })} />
                                <FormError error={errors.pageTitle?.message} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">SEO title</Label>
                                <Input type="text" {...register("metaTitle")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">SEO description</Label>
                                <Input type="text" {...register("metaDescription")} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4" dir="rtl">
                            <p className="text-xs font-semibold uppercase tracking-wide text-black/50" dir="ltr">
                                Arabic
                            </p>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold" dir="ltr">Banner title</Label>
                                <Input type="text" {...register("pageTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold" dir="ltr">SEO title</Label>
                                <Input type="text" {...register("metaTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold" dir="ltr">SEO description</Label>
                                <Input type="text" {...register("metaDescription_ar")} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end p-5 pt-0">
                        <Button type="submit" className="text-white" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save page settings"}
                        </Button>
                    </div>
                </form>
            </AdminItemContainer>
            </div>

            {/* ---------------- Dialogs ---------------- */}
            <NameDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                title="Add section"
                description="A section becomes a filter tab on the Gallery page. You can add albums to it next."
                onSave={addSection}
            />

            <NameDialog
                open={!!editing}
                onOpenChange={(o) => !o && setEditing(null)}
                title="Rename section"
                initial={editing ? { name: editing.title, name_ar: editing.title_ar } : undefined}
                onSave={editSection}
            />

            <ConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title={`Delete section "${deleting?.title ?? ""}"?`}
                confirmLabel="Delete section"
                onConfirm={deleteSection}
            >
                {deleting && (
                    <>
                        This will permanently remove the section
                        {(deleting.categories?.length || 0) > 0 && (
                            <>
                                {" "}and its <strong>{plural(deleting.categories?.length || 0, "album")}</strong> (
                                {plural(countPhotos(deleting), "photo")})
                            </>
                        )}{" "}
                        from the Gallery page. This cannot be undone.
                    </>
                )}
            </ConfirmDialog>
        </div>
    );
};

const AdminGalleryPage = () => (
    <Suspense fallback={null}>
        <AdminGallery />
    </Suspense>
);

export default AdminGalleryPage;
