"use client";

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableRow from "./SortableRow";

export type ReorderItem = { _id: string; title: string; title_ar?: string };

/**
 * Drag-and-drop list that only rearranges items in local state.
 * Persisting the order is the parent's responsibility (send IDs only).
 */
const ReorderList = <T extends ReorderItem>({
    items,
    onChange,
    getMeta,
    getThumbnail,
}: {
    items: T[];
    onChange: (items: T[]) => void;
    getMeta?: (item: T) => string;
    getThumbnail?: (item: T) => string;
}) => {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((i) => i._id === active.id);
        const newIndex = items.findIndex((i) => i._id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        onChange(arrayMove(items, oldIndex, newIndex));
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i._id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                    {items.map((item, index) => (
                        <SortableRow
                            key={item._id}
                            id={item._id}
                            position={index + 1}
                            title={item.title}
                            subtitle={item.title_ar}
                            meta={getMeta?.(item)}
                            thumbnail={getThumbnail ? getThumbnail(item) : undefined}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default ReorderList;
