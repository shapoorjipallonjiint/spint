"use client";

import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FirstSectionZoneKey } from "@/app/(auth)/community-engagement/page";

interface ImageItem {
    image: string;
}

interface ImageZoneProps<TFieldValues extends FieldValues> {
    label: string;
    zoneKey: FirstSectionZoneKey;
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
}

export function ImageZone<TFieldValues extends FieldValues>({ label, zoneKey, field }: ImageZoneProps<TFieldValues>) {
    const router = useRouter();
    const images: ImageItem[] = field.value ?? [];

    return (
        <div className="border rounded-lg px-2 py-3 h-full w-full">
            <div className="flex justify-between items-center mb-3 gap-4 w-full">
                <h4 className="font-semibold text-sm">{label}</h4>

                <Button
                    type="button"
                    className="text-white text-2xl w-6 h-8 flex items-center justify-center"
                    variant="outline"
                    onClick={() => router.push(`/community-engagement/images?zone=${zoneKey}`)}
                >
                    +
                </Button>
            </div>

            {images.length ? (
                <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded border overflow-hidden">
                            <Image src={img.image} alt="" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-400">No images</p>
            )}
        </div>
    );
}
