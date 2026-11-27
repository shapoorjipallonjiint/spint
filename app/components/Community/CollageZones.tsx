"use client";

import { useState } from "react";
import { Control, Controller, FieldValues, Path, useWatch } from "react-hook-form";
import Image from "next/image";
import { ImageZone } from "./ImageZone";

export type CollageZone =
    | "leftMost"
    | "leftColTop"
    | "leftColBottom"
    | "leftOfCenter"
    | "center"
    | "rightOfCenter"
    | "rightColTop"
    | "rightColBottom"
    | "rightMost";

// The website collage (Client/CommunityEngagement/sections/EmpoweringCommunities), desktop (lg) sizes: each column's
// width (%), how far it drops from the top, and its blocks' heights. Kept in sync with that file so the map below shows
// every zone exactly where it appears on the website.
const COLUMNS: { width: number; top: number; zones: { key: CollageZone; height: number }[] }[] = [
    { width: 15.27, top: 280, zones: [{ key: "leftMost", height: 218 }] },
    { width: 15.27, top: 218, zones: [{ key: "leftColTop", height: 182 }, { key: "leftColBottom", height: 174 }] },
    { width: 15.74, top: 136, zones: [{ key: "leftOfCenter", height: 180 }] },
    { width: 21.71, top: 0, zones: [{ key: "center", height: 200 }] },
    { width: 15.74, top: 136, zones: [{ key: "rightOfCenter", height: 180 }] },
    { width: 15.27, top: 218, zones: [{ key: "rightColTop", height: 182 }, { key: "rightColBottom", height: 174 }] },
    { width: 15.27, top: 320, zones: [{ key: "rightMost", height: 218 }] },
];
const SCALE = 0.5; // map drawn at half the website size
const GAP = 16; // gap between stacked blocks on the website (lg)

type ZoneImages = Partial<Record<CollageZone, { image?: string }[]>>;

// Community Engagement > First Section image layout: a map of the website collage (click a zone to edit it) and the
// editor for the selected zone. Edits the same fields as before (firstSection.items.<zone>), saved with Submit.
export function CollageZones<T extends FieldValues>({
    control,
    labels,
}: {
    control: Control<T>;
    labels: Record<CollageZone, string>;
}) {
    const [active, setActive] = useState<CollageZone>("center");
    const zones = (useWatch({ control, name: "firstSection.items" as Path<T> }) ?? {}) as ZoneImages;

    const tile = (key: CollageZone, height: number) => {
        const images = (zones[key] ?? []).filter((img) => img?.image);
        const isActive = key === active;
        return (
            <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                aria-pressed={isActive}
                title={`Edit ${labels[key]}`}
                style={{ height: height * SCALE }}
                className={`group relative w-full overflow-hidden rounded-md border text-left transition-all cursor-pointer ${
                    isActive
                        ? "border-primary ring-2 ring-primary/40 ring-offset-2 ring-offset-white"
                        : "border-slate-300 hover:border-primary/50"
                }`}
            >
                {images[0]?.image ? (
                    <Image src={images[0].image} alt="" fill sizes="200px" className="object-cover" />
                ) : (
                    <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_6px,#e2e8f0_6px,#e2e8f0_12px)]" />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-5 text-[11px] leading-tight text-white">
                    <span className="font-medium">{labels[key]}</span>
                    <span className="shrink-0 rounded-full bg-white/20 px-1.5">{images.length}</span>
                </span>
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            {/* map: same columns, widths, drops and heights as the website (scaled) */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex min-w-[640px] items-start justify-center gap-2">
                    {COLUMNS.map((column, i) => (
                        <div
                            key={i}
                            className="flex flex-col"
                            style={{ flex: `${column.width} 1 0`, marginTop: column.top * SCALE, gap: GAP * SCALE }}
                        >
                            {column.zones.map((zone) => tile(zone.key, zone.height))}
                        </div>
                    ))}
                </div>
            </div>

            {/* editor for the selected zone */}
            <Controller
                key={active}
                name={`firstSection.items.${active}` as Path<T>}
                control={control}
                render={({ field }) => <ImageZone label={labels[active]} field={field} />}
            />
        </div>
    );
}
