"use client";

import React from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

const SortableRow = ({
    id,
    position,
    title,
    subtitle,
    meta,
    thumbnail,
}: {
    id: string;
    position: number;
    title: string;
    subtitle?: string;
    meta?: string;
    thumbnail?: string;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-4 border border-black/20 rounded-lg p-3 bg-white cursor-grab active:cursor-grabbing select-none ${
                isDragging ? "shadow-lg z-10 relative opacity-90" : ""
            }`}
        >
            <MdDragIndicator className="text-2xl text-black/40 shrink-0" />
            <span className="w-6 text-sm text-black/50 shrink-0">{position}</span>
            {thumbnail !== undefined && (
                <div className="w-14 h-10 rounded bg-black/5 overflow-hidden shrink-0">
                    {thumbnail && (
                        <Image src={thumbnail} alt="" width={56} height={40} className="w-full h-full object-cover" />
                    )}
                </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
                <p className="truncate">{title}</p>
                {subtitle?.trim() && (
                    <p className="text-sm text-black/60 truncate" dir="rtl">
                        {subtitle}
                    </p>
                )}
            </div>
            {meta && <span className="text-xs text-black/50 shrink-0">{meta}</span>}
        </div>
    );
};

export default SortableRow;
