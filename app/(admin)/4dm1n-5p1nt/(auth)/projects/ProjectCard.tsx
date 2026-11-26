"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";

// highlight: "active" = the search match in focus, "match" = any other search match
export default function ProjectCard({
    id,
    serial,
    title,
    country,
    highlight,
}: {
    id: string;
    serial?: number;
    title: string;
    country?: string;
    highlight?: "active" | "match";
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            id={`reorder-item-${id}`}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`flex justify-between gap-4 rounded-xl border border-slate-200/80 px-3 py-2.5 items-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] cursor-grab active:cursor-grabbing transition-colors hover:border-primary/25 ${
                highlight === "active"
                    ? "bg-yellow-100 ring-2 ring-yellow-500"
                    : highlight === "match"
                      ? "bg-yellow-50"
                      : "bg-white"
            }`}
        >
            <span>
                {serial !== undefined && (
                    <span className="me-3 inline-flex h-7 min-w-8 items-center justify-center rounded-lg bg-slate-100 px-1.5 text-[12px] font-semibold tabular-nums text-slate-500">
                        {serial}
                    </span>
                )}
                <span className="text-[15px] font-medium text-slate-900">{title}</span>
                {country && <span className="text-slate-500"> · {country}</span>}
            </span>
            <Move className="w-4 h-4 shrink-0 text-slate-400" />
        </div>
    );
}
