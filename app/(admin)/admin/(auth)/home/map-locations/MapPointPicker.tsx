"use client";

import { useState, type MouseEvent } from "react";
import { hasMapPoint } from "@/lib/mapDataHelper";

// Same image the home page map uses; x / y are stored as % of its full width / height.
const MAP_SRC = "/assets/images/world_map.png";
const ZOOMS = [1, 2, 3];

type PickerCity = {
    _id?: string;
    id?: string;
    name?: string;
    left?: string;
    top?: string;
    x?: number;
    y?: number;
};

type Point = { x: number; y: number };

// Where a city's dot sits on the image. Typed (legacy) left/top values are drawn on desktop at
// left + 15.96% / top + 37.74% of the image (the -4.8% shift + the 480px box centring), measured on the live page.
export const cityMapPoint = (city: PickerCity): Point | null => {
    if (hasMapPoint(city)) return { x: city.x as number, y: city.y as number };
    const left = parseFloat(city.left ?? "");
    const top = parseFloat(city.top ?? "");
    if (!Number.isFinite(left) || !Number.isFinite(top)) return null;
    return { x: left + 15.96, y: top + 37.74 };
};

const round2 = (n: number) => Math.round(n * 100) / 100;

type Props = {
    cities: PickerCity[];
    editingCity?: PickerCity;
    picked?: Point;
    onPick: (point: Point) => void;
};

export default function MapPointPicker({ cities, editingCity, picked, onPick }: Props) {
    const [zoom, setZoom] = useState(1);
    const current = editingCity ? cityMapPoint(editingCity) : null;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onPick({ x: round2(Math.min(100, Math.max(0, x))), y: round2(Math.min(100, Math.max(0, y))) });
    };

    return (
        <div className="space-y-2 mt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Click on the map to place the dot. Zoom in for crowded areas.</span>
                <div className="flex gap-1">
                    {ZOOMS.map((z) => (
                        <button
                            key={z}
                            type="button"
                            onClick={() => setZoom(z)}
                            className={`px-2 py-0.5 rounded border ${zoom === z ? "bg-black text-white" : "bg-white"}`}
                        >
                            {z}x
                        </button>
                    ))}
                </div>
            </div>

            <div className="border rounded-md overflow-auto max-h-[60vh] bg-white">
                <div
                    className="relative cursor-crosshair select-none"
                    style={{ width: `${zoom * 100}%` }}
                    onClick={handleClick}
                >
                    {/* natural aspect ratio, no cropping, so the click maps 1:1 to the image */}
                    <img src={MAP_SRC} alt="World map" draggable={false} className="block w-full h-auto" />

                    {/* other countries, for reference */}
                    {cities.map((city, i) => {
                        if (city === editingCity) return null;
                        const p = cityMapPoint(city);
                        if (!p) return null;
                        return (
                            <span
                                key={city._id ?? i}
                                title={city.name}
                                className={`absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-60 ${
                                    city.id === "sp-international" ? "bg-[#1E45A2]" : "bg-[#30B6F9]"
                                }`}
                                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                            />
                        );
                    })}

                    {/* where this country is shown right now */}
                    {current && (
                        <span
                            title="Current position"
                            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-orange-500 pointer-events-none"
                            style={{ left: `${current.x}%`, top: `${current.y}%` }}
                        />
                    )}

                    {/* newly picked point */}
                    {picked && (
                        <span
                            title="New position"
                            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 ring-2 ring-white pointer-events-none"
                            style={{ left: `${picked.x}%`, top: `${picked.y}%` }}
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {current && (
                    <span>
                        <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-dashed border-orange-500 align-middle me-1" />
                        Current{editingCity && !hasMapPoint(editingCity) ? ` (typed X:${editingCity.left} Y:${editingCity.top})` : `: ${current.x}, ${current.y}`}
                    </span>
                )}
                <span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 align-middle me-1" />
                    {picked ? `New: ${picked.x}, ${picked.y}` : current ? "Not changed - click the map to move it" : "No point picked yet"}
                </span>
            </div>
        </div>
    );
}
