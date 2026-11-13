"use client";

import { useEffect, useState } from "react";
import { Move } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { toast } from "sonner";

interface ContactFormProps {
    metaTitle: string;
    metaTitle_ar?: string;
    metaDescription: string;
    metaDescription_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;

    firstSection: {
        title: string;
        title_ar?: string;
        name: string;
        name_ar?: string;
        address: string;
        address_ar?: string;
        phone: string;
        email: string;
        location: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;
        items: {
            name: string;
            name_ar?: string;
            address: string;
            address_ar?: string;
            phone: string;
            fax: string;
            location: string;
        }[];
    };
}

// the reorder list only moves up/down: drop the sideways part of the drag
const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

// one regional office in the reorder list: only its name, dragged into place
const SortableOfficeRow = ({ id, serial, name }: { id: string; serial: number; name: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 px-3 py-2 bg-white cursor-grab active:cursor-grabbing touch-none ${
                isDragging ? "relative z-10 shadow-md" : ""
            }`}
        >
            <span className="min-w-7 text-sm text-black/50 tabular-nums">{serial}.</span>
            <span className={`flex-1 text-sm ${name ? "" : "text-black/40 italic"}`}>{name || "(no name)"}</span>
            <Move className="w-4 h-4 text-gray-500 shrink-0" />
        </div>
    );
};

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        formState: { errors },
    } = useForm<ContactFormProps>({
        defaultValues: {
            firstSection: {
                title: "",
                name: "",
                address: "",
                phone: "",
                email: "",
                location: "",
            },
            secondSection: {
                title: "",
                items: [],
            },
        },
    });

    const watchedFirstSection = useWatch({
        control,
        name: "firstSection",
    });

    const watchedSecondSectionItems = useWatch({
        control,
        name: "secondSection.items",
    });

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
        replace: secondSectionReplace,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    // ---------- regional office reorder ----------
    // Reorder shows a names-only list (in both columns: English and Arabic share the same items).
    // Done applies the new order to the form; nothing is written until Submit.
    // null = not reordering, otherwise the draft order as field ids.
    const [reorderIds, setReorderIds] = useState<string[] | null>(null);
    const isReordering = reorderIds !== null;

    // small move threshold so a click on a row doesn't start a drag
    const reorderSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const startReorder = () => setReorderIds(secondSectionItems.map((f) => f.id));
    const cancelReorder = () => setReorderIds(null);

    const handleReorderDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        setReorderIds((ids) =>
            ids ? arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))) : ids
        );
    };

    const finishReorder = () => {
        if (!reorderIds) return;
        const indexById = new Map(secondSectionItems.map((f, i) => [f.id, i]));
        const unchanged = reorderIds.every((id, i) => indexById.get(id) === i);
        if (!unchanged) {
            // current values (incl. unsaved edits), in the new order
            const items = getValues("secondSection.items");
            secondSectionReplace(reorderIds.map((id) => items[indexById.get(id) as number]));
            toast.success("Order updated - click Submit to save");
        }
        setReorderIds(null);
    };

    // names shown in the reorder list: English column uses name, Arabic column name_ar (falls back to name)
    const renderReorderList = (lang: "en" | "ar") => {
        const indexById = new Map(secondSectionItems.map((f, i) => [f.id, i]));
        return (
            <div className="border border-black/20 rounded-md overflow-hidden divide-y divide-black/10">
                <DndContext
                    sensors={reorderSensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleReorderDragEnd}
                >
                    <SortableContext items={reorderIds || []} strategy={verticalListSortingStrategy}>
                        {(reorderIds || []).map((id, i) => {
                            const item = watchedSecondSectionItems?.[indexById.get(id) as number];
                            const name = lang === "ar" ? item?.name_ar || item?.name || "" : item?.name || "";
                            return <SortableOfficeRow key={id} id={id} serial={i + 1} name={name} />;
                        })}
                    </SortableContext>
                </DndContext>
            </div>
        );
    };

    // "Items" label with the Reorder / Cancel + Done buttons beside it
    const renderItemsHeader = () => (
        <div className="flex items-center justify-between gap-3">
            <Label className="font-bold">Items</Label>
            {isReordering ? (
                <div className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={cancelReorder}>
                        Cancel
                    </Button>
                    <Button type="button" size="sm" className="text-white bg-yellow-700" onClick={finishReorder}>
                        Done
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    size="sm"
                    className="text-white bg-green-700"
                    disabled={secondSectionItems.length < 2}
                    onClick={startReorder}
                >
                    Reorder
                </Button>
            )}
        </div>
    );

    const handleSubmitForm = async (data: ContactFormProps) => {
        try {
            const response = await fetch(`/api/admin/contact`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const res = await response.json();
                toast.success(res.message);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update contact information");
            }
        } catch (error) {
            console.log("Submit error", error);
            toast.error("An error occurred while submitting the form");
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/admin/contact`);
            if (response.ok) {
                const res = await response.json();
                reset(res.data);
            }
        } catch (error) {
            console.log("Fetch error", error);
            toast.error("Failed to load contact information");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleSubmitForm)}>
            {/* English Version */}
            <div className="flex flex-col gap-5">
                {/* Page Title */}
                <AdminItemContainer>
                    <Label main>Banner</Label>
                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Page Title</Label>
                        <Input
                            placeholder="Page Title"
                            {...register("pageTitle", { required: "Page title is required" })}
                        />
                        <FormError error={errors.pageTitle?.message} />
                    </div>
                </AdminItemContainer>

                {/* Head Office */}
                <AdminItemContainer>
                    <Label main>Head Office Section</Label>
                    <div className="p-5 flex flex-col gap-3">
                        <div>
                            <Label className="font-bold">Title</Label>
                            <Input {...register("firstSection.title", { required: "Title is required" })} />
                            <FormError error={errors.firstSection?.title?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Name</Label>
                            <Input {...register("firstSection.name", { required: "Name is required" })} />
                            <FormError error={errors.firstSection?.name?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Address</Label>
                            <Controller
                                name="firstSection.address"
                                control={control}
                                rules={{ required: "Address is required" }}
                                render={({ field }) => <Textarea value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.firstSection?.address?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Phone</Label>
                            <Input {...register("firstSection.phone", { required: "Phone is required" })} />
                            <FormError error={errors.firstSection?.phone?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Email</Label>
                            <Input {...register("firstSection.email", { required: "Email is required" })} />
                            <FormError error={errors.firstSection?.email?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Location</Label>
                            <Input {...register("firstSection.location", { required: "Location is required" })} />
                            <FormError error={errors.firstSection?.location?.message} />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* Regional Offices */}
                <AdminItemContainer>
                    <Label main>Regional Office Section</Label>
                    <div className="p-5 flex flex-col gap-3">
                        <div>
                            <Label className="font-bold">Title</Label>
                            <Input {...register("secondSection.title", { required: "Title is required" })} />
                            <FormError error={errors.secondSection?.title?.message} />
                        </div>

                        {renderItemsHeader()}

                        {isReordering ? (
                            renderReorderList("en")
                        ) : (
                        <div className="border border-black/20 p-3 rounded-md flex flex-col gap-5">
                            {secondSectionItems.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b border-black/20 pb-5">
                                    <RiDeleteBinLine
                                        className="absolute right-2 top-2 cursor-pointer text-red-600"
                                        onClick={() => secondSectionRemove(index)}
                                    />

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.name`, {
                                                required: "Name is required",
                                            })}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.name?.message} />

                                        <Label className="font-bold">Address</Label>
                                        <Controller
                                            name={`secondSection.items.${index}.address`}
                                            control={control}
                                            rules={{ required: "Address is required" }}
                                            render={({ field }) => (
                                                <Textarea value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.address?.message} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">
                                            Phone{" "}
                                            <span className="text-sm text-primary">
                                                (use comma to separate multiple numbers)
                                            </span>
                                        </Label>
                                        <Input {...register(`secondSection.items.${index}.phone`)} />
                                        <FormError error={errors.secondSection?.items?.[index]?.phone?.message} />

                                        <Label className="font-bold">Fax</Label>
                                        <Input {...register(`secondSection.items.${index}.fax`)} />
                                        <FormError error={errors.secondSection?.items?.[index]?.fax?.message} />

                                        <Label className="font-bold">Location</Label>
                                        <Input {...register(`secondSection.items.${index}.location`)} />
                                        <FormError error={errors.secondSection?.items?.[index]?.location?.message} />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        secondSectionAppend({
                                            name: "",
                                            address: "",
                                            phone: "",
                                            fax: "",
                                            location: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>
                </AdminItemContainer>

                {/* Meta */}
                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input {...register("metaTitle")} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Description</Label>
                            <Input {...register("metaDescription")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>

            {/* Arabic Version */}
            <div className="flex flex-col gap-5">
                {/* Page Title */}
                <AdminItemContainer>
                    <Label main>Banner</Label>
                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Page Title</Label>
                        <Input
                            placeholder="Page Title"
                            {...register("pageTitle_ar")}
                        />
                    </div>
                </AdminItemContainer>

                {/* Head Office */}
                <AdminItemContainer>
                    <Label main>Head Office Section</Label>
                    <div className="p-5 flex flex-col gap-3">
                        <div>
                            <Label className="font-bold">Title</Label>
                            <Input {...register("firstSection.title_ar")} />
                        </div>

                        <div>
                            <Label className="font-bold">Name</Label>
                            <Input {...register("firstSection.name_ar")} />
                        </div>

                        <div>
                            <Label className="font-bold">Address</Label>
                            <Controller
                                name="firstSection.address_ar"
                                control={control}
                                render={({ field }) => <Textarea value={field.value} onChange={field.onChange} />}
                            />
                        </div>

                        <div>
                            <Label className="font-bold">Phone</Label>
                            <Input
                                value={watchedFirstSection?.phone || ""}
                                readOnly
                                disabled
                                className="bg-muted cursor-default"
                            />
                        </div>

                        <div>
                            <Label className="font-bold">Email</Label>
                            <Input
                                value={watchedFirstSection?.email || ""}
                                readOnly
                                disabled
                                className="bg-muted cursor-default"
                            />
                        </div>

                        <div>
                            <Label className="font-bold">Location</Label>
                            <Input
                                value={watchedFirstSection?.location || ""}
                                readOnly
                                disabled
                                className="bg-muted cursor-default"
                            />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* Regional Offices */}
                <AdminItemContainer>
                    <Label main>Regional Office Section</Label>
                    <div className="p-5 flex flex-col gap-3">
                        <div>
                            <Label className="font-bold">Title</Label>
                            <Input {...register("secondSection.title_ar")} />
                        </div>

                        {renderItemsHeader()}

                        {isReordering ? (
                            renderReorderList("ar")
                        ) : (
                        <div className="border border-black/20 p-3 rounded-md flex flex-col gap-5">
                            {secondSectionItems.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b border-black/20 pb-5">
                                    <RiDeleteBinLine
                                        className="absolute right-2 top-2 cursor-pointer text-red-600"
                                        onClick={() => secondSectionRemove(index)}
                                    />

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input {...register(`secondSection.items.${index}.name_ar`)} />

                                        <Label className="font-bold">Address</Label>
                                        <Controller
                                            name={`secondSection.items.${index}.address_ar`}
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Phone</Label>
                                        <Input
                                            readOnly
                                            disabled
                                            value={watchedSecondSectionItems?.[index]?.phone || ""}
                                            className="bg-muted cursor-default"
                                        />

                                        <Label className="font-bold">Fax</Label>
                                        <Input
                                            readOnly
                                            disabled
                                            value={watchedSecondSectionItems?.[index]?.fax || ""}
                                            className="bg-muted cursor-default"
                                        />

                                        <Label className="font-bold">Location</Label>
                                        <Input
                                            readOnly
                                            disabled
                                            value={watchedSecondSectionItems?.[index]?.location || ""}
                                            className="bg-muted cursor-default"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end cursor-not-allowed">
                                <Button
                                    className="bg-muted"
                                    type="button"
                                    disabled
                                    addItem
                                    onClick={() =>
                                        secondSectionAppend({
                                            name: "",
                                            address: "",
                                            phone: "",
                                            fax: "",
                                            location: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                        )}
                    </div>
                </AdminItemContainer>

                {/* Meta */}
                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input {...register("metaTitle_ar")} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Description</Label>
                            <Input {...register("metaDescription_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>

            <div className="col-span-2">
                {isReordering && (
                    <p className="text-sm text-yellow-700 mb-2 text-center">
                        Click Done in the Regional Office Section to keep the new order, then Submit to save.
                    </p>
                )}
                <Button type="submit" className="w-full text-white text-[16px]" disabled={isReordering}>
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default ContactPage;
