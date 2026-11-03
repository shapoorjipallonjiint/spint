"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { MdInfoOutline } from "react-icons/md";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/button";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import GalleryHeader from "@/app/components/AdminGallery/GalleryHeader";
import ConfirmDialog from "@/app/components/AdminGallery/ConfirmDialog";
import SortablePhoto from "@/app/components/AdminGallery/SortablePhoto";
import VisibilityToggle from "@/app/components/AdminGallery/VisibilityToggle";

type Photo = { key: string; url: string };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const AlbumPhotos = () => {
    const router = useRouter();
    const { categoryId, id } = useParams();

    const keySeq = useRef(0);
    const toPhotos = useCallback((urls: string[]) => urls.map((url) => ({ key: `p${keySeq.current++}`, url })), []);

    const [sectionName, setSectionName] = useState("Section");
    const [album, setAlbum] = useState<{ title: string; title_ar?: string; isHidden?: boolean } | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [savedUrls, setSavedUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pendingHref, setPendingHref] = useState<string | null>(null);

    const urls = useMemo(() => photos.map((p) => p.url), [photos]);
    const dirty = useMemo(
        () => urls.length !== savedUrls.length || urls.some((u, i) => u !== savedUrls[i]),
        [urls, savedUrls]
    );

    const fetchAlbum = async () => {
        try {
            const [albumRes, sectionRes] = await Promise.all([
                fetch(`/api/admin/gallery/inside?galleryId=${id}&categoryId=${categoryId}`),
                fetch(`/api/admin/gallery?id=${id}`),
            ]);
            const albumData = await albumRes.json();
            if (albumRes.ok) {
                const images: string[] = albumData.data.images || [];
                setAlbum({ title: albumData.data.title, title_ar: albumData.data.title_ar, isHidden: albumData.data.isHidden });
                setSavedUrls(images);
                setPhotos(toPhotos(images));
            } else {
                toast.error(albumData.message);
            }
            if (sectionRes.ok) {
                const sectionData = await sectionRes.json();
                setSectionName(sectionData.data.title || "Section");
            }
        } catch (error) {
            console.log("Error in fetching gallery data", error);
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbum();
    }, []);

    // Warn before closing / reloading the tab with unsaved changes.
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    /* ---------- Editing (local until Save) ---------- */

    const handleImageUpload = (uploadedUrl: string) => {
        if (!uploadedUrl) return;
        setPhotos((prev) => [...prev, ...toPhotos([uploadedUrl])]);
    };

    const removePhoto = (key: string) => {
        const index = photos.findIndex((p) => p.key === key);
        if (index === -1) return;
        const removed = photos[index];
        setPhotos((prev) => prev.filter((p) => p.key !== key));
        toast("Photo removed. Click Save changes to apply.", {
            action: {
                label: "Undo",
                onClick: () =>
                    setPhotos((cur) => {
                        if (cur.some((p) => p.key === removed.key)) return cur;
                        const next = [...cur];
                        next.splice(Math.min(index, next.length), 0, removed);
                        return next;
                    }),
            },
        });
    };

    const makeCover = (key: string) => {
        setPhotos((prev) => {
            const index = prev.findIndex((p) => p.key === key);
            return index > 0 ? arrayMove(prev, index, 0) : prev;
        });
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setPhotos((prev) => {
            const oldIndex = prev.findIndex((p) => p.key === active.id);
            const newIndex = prev.findIndex((p) => p.key === over.id);
            if (oldIndex === -1 || newIndex === -1) return prev;
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    const discardChanges = () => setPhotos(toPhotos(savedUrls));

    /* ---------- Save (same endpoint & payload as before) ---------- */

    const saveChanges = async () => {
        if (urls.length === 0) return;
        setSaving(true);
        try {
            const response = await fetch(`/api/admin/gallery/inside?galleryId=${id}&categoryId=${categoryId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images: urls }),
            });
            const data = await response.json();
            if (response.ok) {
                setSavedUrls(urls);
                toast.success("Photos saved");
            } else {
                toast.error(data.message || "Could not save photos");
            }
        } catch (error) {
            console.log("Error in saving gallery", error);
            toast.error("Something went wrong. Your changes are still here; please try again.");
        } finally {
            setSaving(false);
        }
    };

    /** Re-read only the hidden flag, so unsaved photo changes on this page are kept. */
    const refreshVisibility = async () => {
        try {
            const res = await fetch(`/api/admin/gallery/inside?galleryId=${id}&categoryId=${categoryId}`);
            if (res.ok) {
                const data = await res.json();
                setAlbum((prev) => (prev ? { ...prev, isHidden: data.data.isHidden } : prev));
            }
        } catch {
            /* toast already shown by the toggle */
        }
    };

    const guardNavigation = (href: string) => {
        if (!dirty) return true;
        setPendingHref(href);
        return false;
    };

    const albumName = album?.title || "Album";

    return (
        <div className="flex flex-col gap-6 pb-24">
            <GalleryHeader
                crumbs={[
                    { label: "Gallery", href: "/admin/gallery?tab=gallery" },
                    { label: sectionName, href: `/admin/gallery/${id}` },
                    { label: albumName },
                ]}
                title={albumName}
                subtitle={
                    <>
                        {album?.title_ar && (
                            <span dir="rtl" className="mr-2">
                                {album.title_ar} ·
                            </span>
                        )}
                        {loading ? "Loading..." : plural(savedUrls.length, "photo")} in the &quot;{sectionName}&quot; section
                    </>
                }
                onNavigate={guardNavigation}
                actions={
                    album && (
                        <VisibilityToggle
                            galleryId={String(id)}
                            categoryId={String(categoryId)}
                            hidden={!!album.isHidden}
                            onChanged={refreshVisibility}
                        />
                    )
                }
            />

            {album?.isHidden && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-sm px-4 py-3">
                    This album is hidden from the website. Its photos are kept and you can still edit them here.
                </div>
            )}

            <AdminItemContainer>
                <div className="p-5 border-b border-black/10 flex flex-col gap-1">
                    <p className="font-semibold text-lg">Upload photos</p>
                    <p className="text-sm text-black/60">You can select several files at once. New photos are added to the end.</p>
                </div>
                <div className="p-5">
                    <ImageUploader onChange={handleImageUpload} deleteAfterUpload multiple />
                </div>
            </AdminItemContainer>

            <AdminItemContainer>
                <div className="p-5 border-b border-black/10 flex flex-col gap-2">
                    <p className="font-semibold text-lg">
                        Photos <span className="text-black/50 font-normal">({photos.length})</span>
                    </p>
                    <p className="text-sm text-black/60 flex items-start gap-1">
                        <MdInfoOutline className="mt-0.5 shrink-0" />
                        Drag photos to change the order. The first photo is the album cover on the Gallery page. Changes are only applied when you click Save changes.
                    </p>
                </div>

                <div className="p-5">
                    {loading ? (
                        <p className="text-sm text-black/60 py-10 text-center">Loading...</p>
                    ) : photos.length === 0 ? (
                        <div className="py-12 text-center flex flex-col gap-1">
                            <p className="font-medium">No photos in this album</p>
                            <p className="text-sm text-black/60">
                                {savedUrls.length > 0
                                    ? "You removed all photos. Click Discard to restore them, or delete the album from the section page instead."
                                    : "Upload photos above. This album stays hidden on the site until it has at least one photo."}
                            </p>
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={photos.map((p) => p.key)} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {photos.map((p, index) => (
                                        <SortablePhoto
                                            key={p.key}
                                            id={p.key}
                                            url={p.url}
                                            index={index}
                                            onRemove={() => removePhoto(p.key)}
                                            onMakeCover={() => makeCover(p.key)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </AdminItemContainer>

            {/* Sticky save bar */}
            <div
                className={`fixed bottom-0 right-0 left-0 z-40 transition-transform ${dirty ? "translate-y-0" : "translate-y-full"}`}
            >
                <div className="mx-auto max-w-5xl m-4 flex items-center justify-between gap-4 rounded-xl bg-black text-white px-5 py-3 shadow-2xl flex-wrap">
                    <span className="text-sm">
                        You have unsaved changes
                        {photos.length === 0 && " · an album needs at least one photo"}
                    </span>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="text-black" onClick={discardChanges} disabled={saving}>
                            Discard
                        </Button>
                        <Button
                            type="button"
                            className="bg-white text-black hover:bg-white/90"
                            onClick={saveChanges}
                            disabled={saving || photos.length === 0}
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!pendingHref}
                onOpenChange={(o) => !o && setPendingHref(null)}
                title="Leave without saving?"
                confirmLabel="Leave and discard"
                onConfirm={() => {
                    if (pendingHref) router.push(pendingHref);
                }}
            >
                Your photo changes in this album have not been saved and will be lost.
            </ConfirmDialog>
        </div>
    );
};

export default AlbumPhotos;
