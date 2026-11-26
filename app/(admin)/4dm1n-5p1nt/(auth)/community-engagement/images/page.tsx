"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  FirstSectionZoneKey,
  FIRST_SECTION_ZONES,
} from "../../community-engagement/page";

interface ImageItem {
  image: string;
}

interface CommunityResponse {
  data: {
    firstSection: {
      items: Record<FirstSectionZoneKey, ImageItem[]>;
    };
  };
}

export default function CommunityImageManager() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const zoneParam = searchParams.get("zone");

  const zone: FirstSectionZoneKey | null =
    zoneParam && zoneParam in FIRST_SECTION_ZONES
      ? (zoneParam as FirstSectionZoneKey)
      : null;

  const [images, setImages] = useState<string[]>([]);

  // ✅ Hooks ALWAYS run
  useEffect(() => {
    if (!zone) return;

    (async () => {
      const res = await fetch("/api/admin/community-engagement");
      const json: CommunityResponse = await res.json();

      const zoneImages = json.data.firstSection.items[zone];
      setImages(zoneImages.map((item) => item.image));
    })();
  }, [zone]);

  const addImage = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveImages = async () => {
    if (!zone) return;

    await fetch("/api/admin/community-engagement", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstSection: {
          items: {
            [zone]: images.map((img) => ({ image: img })),
          },
        },
      }),
    });

    router.back();
  };

  // ✅ CONDITIONAL UI AFTER HOOKS
  if (!zone) {
    return <div className="p-6 text-red-500">Invalid image zone</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-bold">Manage Images – {zone}</h3>

      <ImageUploader multiple deleteAfterUpload onChange={addImage} />

      <div className="grid grid-cols-4 gap-4">
        {images.map((url, i) => (
          <div key={url} className="relative h-40">
            <Image src={url} alt="" fill className="object-cover rounded" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <Button onClick={saveImages} className="w-full text-white">
        Save Images
      </Button>
    </div>
  );
}
