"use client";

import { useEffect, useRef } from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import Image from "next/image";
import { X } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

interface ImageItem {
    image: string;
}

interface ImageZoneProps<TFieldValues extends FieldValues> {
    label: string;
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
}

// One image zone of the Community Engagement first-section collage (admin > Community Engagement > First Section).
// Images are added / removed right here and saved with the page's Submit, like every other field.
// Existing entries are kept as they are (only filtered on remove), new ones are added as { image }.
export function ImageZone<TFieldValues extends FieldValues>({ label, field }: ImageZoneProps<TFieldValues>) {
    const images: ImageItem[] = field.value ?? [];

    // a multi-file upload reports each file separately, before React re-renders: keep a running list so every
    // file is added (not only the last one)
    const latest = useRef<ImageItem[]>(images);
    useEffect(() => {
        latest.current = field.value ?? [];
    }, [field.value]);

    const addImage = (url: string) => {
        if (!url) return;
        latest.current = [...latest.current, { image: url }];
        field.onChange(latest.current);
    };

    const removeImage = (index: number) => {
        const next = images.filter((_, i) => i !== index);
        latest.current = next;
        field.onChange(next);
    };

    return (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                <span className="text-xs text-slate-400">
                    {images.length} {images.length === 1 ? "image" : "images"}
                </span>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <div key={`${img.image}-${idx}`} className="group relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                            <Image src={img.image} alt="" fill className="object-cover" />
                            <button
                                type="button"
                                title="Remove image (saved with Submit)"
                                aria-label={`Remove image ${idx + 1} from ${label}`}
                                onClick={() => removeImage(idx)}
                                className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white shadow"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <ImageUploader multiple deleteAfterUpload onChange={addImage} />
        </div>
    );
}
