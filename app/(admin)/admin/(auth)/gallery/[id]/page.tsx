"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdChevronRight, MdVisibilityOff, MdPhotoLibrary } from "react-icons/md";
import { TbReorder } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import GalleryHeader from "@/app/components/AdminGallery/GalleryHeader";
import NameDialog from "@/app/components/AdminGallery/NameDialog";
import ConfirmDialog from "@/app/components/AdminGallery/ConfirmDialog";
import ReorderList from "@/app/components/AdminGallery/ReorderList";
import VisibilityToggle from "@/app/components/AdminGallery/VisibilityToggle";

type Album = { _id: string; title: string; title_ar: string; images?: string[]; isHidden?: boolean };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const SectionAlbums = () => {
    const { id } = useParams();

    const [section, setSection] = useState<{ title: string; title_ar?: string; isHidden?: boolean } | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    const [addOpen, setAddOpen] = useState(false);
    const [editing, setEditing] = useState<Album | null>(null);
    const [deleting, setDeleting] = useState<Album | null>(null);

    const [reorderMode, setReorderMode] = useState(false);
    const [reorderDraft, setReorderDraft] = useState<Album[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);

    const fetchGalleryData = async () => {
        try {
            const response = await fetch(`/api/admin/gallery?id=${id}`);
            const data = await response.json();
            if (response.ok) {
                setSection({ title: data.data.title, title_ar: data.data.title_ar, isHidden: data.data.isHidden });
                setAlbums(data.data.categories || []);
            } else {
                toast.error(data.message);
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

    /* ---------- Album CRUD (same endpoints as before) ---------- */

    const addAlbum = async ({ name, name_ar }: { name: string; name_ar: string }) => {
        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, name_ar }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return false;
            }
            toast.success("Album added. Now add photos to make it visible.");
            fetchGalleryData();
            return true;
        } catch {
            toast.error("Something went wrong");
            return false;
        }
    };

    const editAlbum = async ({ name, name_ar }: { name: string; name_ar: string }) => {
        if (!editing) return false;
        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${editing._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, name_ar, galleryId: id }),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return false;
            }
            toast.success("Album updated");
            fetchGalleryData();
            return true;
        } catch {
            toast.error("Something went wrong");
            return false;
        }
    };

    const deleteAlbum = async () => {
        if (!deleting) return;
        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${deleting._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ galleryId: id }),
            });
            const data = await response.json();
            if (response.ok) toast.success("Album deleted");
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
                body: JSON.stringify({ galleryId: id, order: reorderDraft.map((a) => a._id) }),
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

    const sectionName = section?.title || "Section";
    const emptyCount = albums.filter((a) => !a.isHidden && !a.images?.length).length;
    const hiddenCount = albums.filter((a) => a.isHidden).length;

    return (
        <div className="flex flex-col gap-6">
            <GalleryHeader
                crumbs={[{ label: "Gallery", href: "/admin/gallery?tab=gallery" }, { label: sectionName }]}
                title={sectionName}
                subtitle={
                    <>
                        {section?.title_ar && (
                            <span dir="rtl" className="mr-2">
                                {section.title_ar} ·
                            </span>
                        )}
                        Albums shown under the &quot;{sectionName}&quot; tab on the Gallery page.
                    </>
                }
                actions={
                    section && (
                        <VisibilityToggle galleryId={String(id)} hidden={!!section.isHidden} onChanged={fetchGalleryData} />
                    )
                }
            />

            {section?.isHidden && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-sm px-4 py-3">
                    This whole section is hidden from the website, so none of its albums are shown, whatever their own setting.
                    Use the switch above to show it again.
                </div>
            )}

            <AdminItemContainer>
                <div className="flex justify-between items-center gap-4 p-5 border-b border-black/10 flex-wrap">
                    <div>
                        <p className="font-semibold text-lg">Albums {!loading && <span className="text-black/50 font-normal">({albums.length})</span>}</p>
                        <p className="text-sm text-black/60">
                            The order here is the order of the cards on the site.
                            {hiddenCount > 0 && <> {plural(hiddenCount, "album")} hidden.</>}
                            {emptyCount > 0 && <> {plural(emptyCount, "album")} without photos {emptyCount === 1 ? "is" : "are"} not shown until photos are added.</>}
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
                            {albums.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setReorderDraft(albums);
                                        setReorderMode(true);
                                    }}
                                >
                                    <TbReorder /> Reorder
                                </Button>
                            )}
                            <Button type="button" className="text-white" onClick={() => setAddOpen(true)}>
                                + Add album
                            </Button>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    {reorderMode ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-black/60">Drag albums into the order you want, then click Save order.</p>
                            <ReorderList
                                items={reorderDraft}
                                onChange={setReorderDraft}
                                getThumbnail={(a) => a.images?.[0] || ""}
                                getMeta={(a) => `${plural(a.images?.length || 0, "photo")}${a.isHidden ? " · hidden" : ""}`}
                            />
                        </div>
                    ) : loading ? (
                        <p className="text-sm text-black/60 py-10 text-center">Loading...</p>
                    ) : albums.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No albums in this section yet</p>
                            <p className="text-sm text-black/60">Add an album, then upload photos to it.</p>
                            <Button type="button" className="text-white" onClick={() => setAddOpen(true)}>
                                + Add album
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {albums.map((a, index) => {
                                const photos = a.images?.length || 0;
                                const cover = a.images?.[0];
                                return (
                                    <div
                                        key={a._id}
                                        className={`flex flex-col border rounded-lg overflow-hidden ${
                                            a.isHidden ? "border-dashed border-black/25 bg-black/[0.02]" : "border-black/15 bg-white"
                                        }`}
                                    >
                                        <Link href={`/admin/gallery/${id}/${a._id}`} className="relative block aspect-[4/3] bg-black/5 group">
                                            {cover ? (
                                                <Image
                                                    src={cover}
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 1280px) 50vw, 33vw"
                                                    className={`object-cover ${a.isHidden ? "opacity-40 grayscale" : ""}`}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-black/50">
                                                    <MdVisibilityOff className="text-2xl" />
                                                    <span className="text-sm">No photos: not shown on site</span>
                                                </div>
                                            )}
                                            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs rounded px-2 py-0.5">#{index + 1}</span>
                                            {a.isHidden && (
                                                <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 text-black text-xs rounded px-2 py-0.5">
                                                    <MdVisibilityOff /> Hidden on website
                                                </span>
                                            )}
                                            {cover && (
                                                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs rounded px-2 py-0.5">Cover</span>
                                            )}
                                            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                                        </Link>

                                        <div className="flex flex-col gap-1 p-3 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`font-medium line-clamp-2 ${a.isHidden ? "text-black/50" : ""}`}>{a.title}</p>
                                                <span className="shrink-0">
                                                    <VisibilityToggle
                                                        galleryId={String(id)}
                                                        categoryId={a._id}
                                                        hidden={!!a.isHidden}
                                                        onChanged={fetchGalleryData}
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-sm text-black/60 line-clamp-2" dir="rtl">
                                                {a.title_ar?.trim() || <span className="italic">No Arabic name</span>}
                                            </p>
                                            <p className="text-xs text-black/50 mt-1">{plural(photos, "photo")}</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 border-t border-black/10 p-2">
                                            <div className="flex gap-1">
                                                <Button type="button" variant="ghost" size="icon" title="Rename" onClick={() => setEditing(a)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => setDeleting(a)}
                                                >
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                            <Link
                                                href={`/admin/gallery/${id}/${a._id}`}
                                                className="flex items-center gap-1 bg-primary text-white text-sm rounded-md px-3 py-2 hover:bg-primary/90"
                                            >
                                                <MdPhotoLibrary /> Manage photos <MdChevronRight />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </AdminItemContainer>

            <NameDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                title={`Add album to "${sectionName}"`}
                description="The album stays hidden on the site until you add at least one photo."
                onSave={addAlbum}
            />

            <NameDialog
                open={!!editing}
                onOpenChange={(o) => !o && setEditing(null)}
                title="Rename album"
                initial={editing ? { name: editing.title, name_ar: editing.title_ar } : undefined}
                onSave={editAlbum}
            />

            <ConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title={`Delete album "${deleting?.title ?? ""}"?`}
                confirmLabel="Delete album"
                onConfirm={deleteAlbum}
            >
                {deleting && (
                    <>
                        This will permanently remove the album
                        {(deleting.images?.length || 0) > 0 && (
                            <>
                                {" "}and its <strong>{plural(deleting.images?.length || 0, "photo")}</strong>
                            </>
                        )}{" "}
                        from the Gallery page. This cannot be undone.
                    </>
                )}
            </ConfirmDialog>
        </div>
    );
};

export default SectionAlbums;
