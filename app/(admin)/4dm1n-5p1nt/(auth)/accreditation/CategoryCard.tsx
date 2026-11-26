import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CategoryCard = ({ title, id }: { title: string; id: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id,
    });
    const style = {
        transition: "transform 0.2s ease-in-out",
        transform: CSS.Transform.toString(transform),
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            key={id}
            {...attributes}
            {...listeners}
        >
            <div className="text-[16px]">{title}</div>
        </div>
    );
};

export default CategoryCard;
