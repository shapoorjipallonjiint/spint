"use client";

import { ImageUploader } from "@/components/ui/image-uploader";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ImageCard from "@/app/components/AdminGallery/ImageCard";
import Image from "next/image";
import { TbReorder } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { toast } from "sonner";

interface GalleryForm {
    images: string[];
}

const IndiGallery = () => {
    const router = useRouter();
    const { categoryId, id } = useParams();

    const [reorderMode, setReorderMode] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const { setValue } = useForm<GalleryForm>();

    const fetchGalleryData = async () => {
        try {
            const response = await fetch(
                `/api/admin/gallery/inside?galleryId=${id}&categoryId=${categoryId}`
            );
            if (response.ok) {
                const data = await response.json();
                setImageUrls(data.data.images);
                setValue("images", data.data.images);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error in fetching gallery data", error);
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const handleImageUpload = (uploadedUrl: string) => {
        setImageUrls((prev) => {
            const updated = [...prev, uploadedUrl];
            setValue("images", updated);
            return updated;
        });
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls((prev) => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            setValue("images", updated);
            return updated;
        });
    };

    const getTaskPos = (id: string) =>
        imageUrls.findIndex((item) => item === id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = getTaskPos(active.id as string);
        const newIndex = getTaskPos(over.id as string);

        const newOrder = arrayMove(imageUrls, oldIndex, newIndex);
        setImageUrls(newOrder);
        setValue("images", newOrder);
    };

    const handleAddGallery = async () => {
        try {
            const response = await fetch(
                `/api/admin/gallery/inside?galleryId=${id}&categoryId=${categoryId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: imageUrls }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                router.push(`/gallery/${id}`);
            }
        } catch (error) {
            console.log("Error in adding gallery", error);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 p-5 rounded-md bg-white shadow-md">
                <div className="flex justify-between items-center">
                    <Label className="block text-sm">Images</Label>

                    <Button
                        type="button"
                        className="bg-green-600 text-white flex items-center gap-2"
                        onClick={() => setReorderMode(!reorderMode)}
                    >
                        {reorderMode ? (
                            <>
                                <GiConfirmed />
                                Done Reordering
                            </>
                        ) : (
                            <>
                                <TbReorder />
                                Reorder Images
                            </>
                        )}
                    </Button>
                </div>

                <div className="mt-2">
                    <ImageUploader
                        onChange={handleImageUpload}
                        deleteAfterUpload
                        multiple
                    />
                </div>

                {/* REORDER MODE */}
                {reorderMode && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <DndContext
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={imageUrls}
                                strategy={verticalListSortingStrategy}
                            >
                                {imageUrls.map((url, index) => (
                                    <ImageCard
                                        key={url}
                                        id={url}
                                        url={url}
                                        index={index}
                                        handleRemoveImage={handleRemoveImage}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                {/* NORMAL MODE */}
                {!reorderMode && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="relative h-40">
                                <Image
                                    src={url}
                                    alt={`Uploaded image ${index + 1}`}
                                    className="h-full w-full object-cover rounded-lg"
                                    width={100}
                                    height={100}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* SAVE */}
                {!reorderMode && (
                    <Button
                        type="button"
                        disabled={imageUrls.length === 0}
                        onClick={handleAddGallery}
                        className="w-full text-white mt-5"
                    >
                        Save Images
                    </Button>
                )}
            </div>
        </div>
    );
};

export default IndiGallery;
