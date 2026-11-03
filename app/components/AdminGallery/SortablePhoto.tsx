"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdClose, MdStar } from "react-icons/md";

/** A draggable photo tile. Buttons stop pointer events so clicks never start a drag. */
const SortablePhoto = ({
    id,
    url,
    index,
    onRemove,
    onMakeCover,
}: {
    id: string;
    url: string;
    index: number;
    onRemove: () => void;
    onMakeCover: () => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const isCover = index === 0;

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            {...attributes}
            {...listeners}
            className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-black/5 cursor-grab active:cursor-grabbing select-none group ${
                isCover ? "ring-2 ring-primary ring-offset-2" : ""
            } ${isDragging ? "z-10 shadow-xl opacity-90" : ""}`}
        >
            <Image src={url} alt={`Photo ${index + 1}`} fill sizes="(max-width: 1024px) 33vw, 20vw" className="object-cover pointer-events-none" />

            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs rounded px-2 py-0.5">
                {isCover ? (
                    <span className="flex items-center gap-1">
                        <MdStar /> Cover
                    </span>
                ) : (
                    index + 1
                )}
            </span>

            <button
                type="button"
                title="Remove photo"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-600 hover:text-white text-black rounded-full p-1 shadow"
            >
                <MdClose />
            </button>

            {!isCover && (
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={onMakeCover}
                    className="absolute bottom-2 left-2 right-2 bg-white/90 hover:bg-white text-xs rounded py-1 opacity-0 group-hover:opacity-100 transition"
                >
                    Set as cover
                </button>
            )}
        </div>
    );
};

export default SortablePhoto;
