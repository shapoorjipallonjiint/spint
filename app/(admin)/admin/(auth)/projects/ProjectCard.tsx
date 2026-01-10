"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move } from "lucide-react";

export default function ProjectCard({
    id,
    title,
}: {
    id: string;
    title: string;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex justify-between border p-2 items-center rounded-md shadow-md bg-white cursor-grab"
        >
            <span>{title}</span>
            <Move className="w-4 h-4 text-gray-500" />
        </div>
    );
}
