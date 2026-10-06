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
            className={`flex justify-between border p-2 items-center rounded-md shadow-md cursor-grab transition-colors ${
                highlight === "active"
                    ? "bg-yellow-100 ring-2 ring-yellow-500"
                    : highlight === "match"
                      ? "bg-yellow-50"
                      : "bg-white"
            }`}
        >
            <span>
                {serial !== undefined && (
                    <span className="inline-block min-w-8 text-muted-foreground tabular-nums">{serial}.</span>
                )}
                {title}
                {country && <span className="text-muted-foreground"> - {country}</span>}
            </span>
            <Move className="w-4 h-4 text-gray-500" />
        </div>
    );
}
