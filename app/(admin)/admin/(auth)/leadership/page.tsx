"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm, useFieldArray, Controller, FieldArrayWithId } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/app/components/common/FormError";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove } from "@dnd-kit/sortable";
import { TbReorder } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";

interface LeadershipFormProps {
    metaTitle: string;
    metaTitle_ar?: string;
    metaDescription: string;
    metaDescription_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;
    pageSubTitle: string;
    pageSubTitle_ar?: string;
    pageDescription: string;
    pageDescription_ar?: string;

    firstSection: {
        items: {
            image: string;
            imageAlt?: string;
            imageAlt_ar?: string;
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;
            description: string;
            description_ar: string;
        }[];
    };

    secondSection: {
        title: string;
        title_ar?: string;

        items: {
            image: string;
            imageAlt?: string;
            imageAlt_ar?: string;
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;
            socialLink?: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;
        items: {
            image: string;
            imageAlt?: string;
            imageAlt_ar?: string;
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;
        items: {
            image: string;
            imageAlt?: string;
            imageAlt_ar?: string;
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;
        }[];
    };
}

type PersonField = FieldArrayWithId<LeadershipFormProps, "secondSection.items", "id">;

type PeopleListProps = {
    people: PersonField[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onAdd: () => void;
};

const SortablePerson = ({
    person,
    index,
    onEdit,
    onDelete,
}: {
    person: PersonField;
    index: number;
    onEdit: (i: number) => void;
    onDelete: (i: number) => void;
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: person.id,
    });

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
            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted cursor-grab active:cursor-grabbing transition-all"
        >
            <div className="flex items-center gap-3">
                <Image
                    height={40}
                    width={40}
                    src={person.image}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{person.name || "Unnamed Member"}</span>
            </div>

            <div className="flex gap-4">
                <RiEditLine size={22} className="cursor-pointer" onClick={() => onEdit(index)} />
                <RiDeleteBinLine size={20} className="cursor-pointer" onClick={() => onDelete(index)} />
            </div>
        </div>
    );
};

const PeopleList = ({ people, onEdit, onDelete, onAdd }: PeopleListProps) => (
    <div className="p-4 flex flex-col gap-3">
        {people.map((person, i) => (
            <div key={person.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEdit(i)}>
                    <Image
                        height={40}
                        width={40}
                        src={person.image}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{person.name || "Unnamed Member"}</span>
                </div>

                <div className="flex gap-4">
                    <RiEditLine size={24} className="cursor-pointer" onClick={() => onEdit(i)} />
                    <RiDeleteBinLine size={22} className="cursor-pointer" onClick={() => onDelete(i)} />
                </div>
            </div>
        ))}

        <Button type="button" addItem onClick={onAdd}>
            Add Member
        </Button>
    </div>
);

/* ================= PAGE ================= */

const LeadershipAdminPage = () => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<LeadershipFormProps>();

    const [editingPerson, setEditingPerson] = useState<number | null>(null);
    const [reorderMode, setReorderMode] = useState(false);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = peopleFields.findIndex((p) => p.id === active.id);
        const newIndex = peopleFields.findIndex((p) => p.id === over.id);

        const newItems = arrayMove(getValues("secondSection.items"), oldIndex, newIndex);

        replacePeople(newItems);

        await saveToAPI();
    };

    /* ---------- Field Arrays ---------- */

    const {
        fields: peopleFields,
        update: updatePerson,
        remove: removePerson,
        replace: replacePeople,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    const {
        fields: firstSectionItems,
        append: firstSectionAppend,
        remove: firstSectionRemove,
    } = useFieldArray({
        control,
        name: "firstSection.items",
    });

    const {
        fields: thirdSectionItems,
        append: thirdSectionAppend,
        remove: thirdSectionRemove,
    } = useFieldArray({
        control,
        name: "thirdSection.items",
    });

    const {
        fields: fourthSectionItems,
        append: fourthSectionAppend,
        remove: fourthSectionRemove,
    } = useFieldArray({
        control,
        name: "fourthSection.items",
    });

    /* ================= SUBMIT ================= */

    const onSubmit = async (data: LeadershipFormProps) => {
        try {
            toast.loading("Saving leadership...", { id: "leadership-submit" });

            const res = await fetch("/api/admin/leadership", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Failed to update leadership");
            }

            toast.success("Leadership updated successfully", {
                id: "leadership-submit",
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message, { id: "leadership-submit" });
        }
    };

    const saveToAPI = async () => {
        try {
            const data = getValues();

            toast.loading("Saving changes...", { id: "leadership-autosave" });

            const res = await fetch("/api/admin/leadership", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message || "Auto-save failed");
            }

            toast.success("Changes saved", {
                id: "leadership-autosave",
                duration: 2000,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message, { id: "leadership-autosave" });
        }
    };

    /* ================= FETCH ================= */

    const fetchData = async () => {
        const res = await fetch("/api/admin/leadership");
        const json = await res.json();

        setValue("metaTitle", json.data?.metaTitle);
        setValue("metaTitle_ar", json.data?.metaTitle_ar);
        setValue("metaDescription", json.data?.metaDescription);
        setValue("metaDescription_ar", json.data?.metaDescription_ar);

        setValue("pageTitle", json.data?.pageTitle);
        setValue("pageTitle_ar", json.data?.pageTitle_ar);
        setValue("pageSubTitle", json.data?.pageSubTitle);
        setValue("pageSubTitle_ar", json.data?.pageSubTitle_ar);
        setValue("pageDescription", json.data?.pageDescription);
        setValue("pageDescription_ar", json.data?.pageDescription_ar);

        setValue("firstSection", json.data?.firstSection);
        setValue("firstSection.items", json.data?.firstSection.items);

        setValue("secondSection.title", json.data?.secondSection?.title);
        setValue("secondSection.title_ar", json.data?.secondSection?.title_ar);

        setValue("thirdSection.title", json.data?.thirdSection?.title);
        setValue("thirdSection.title_ar", json.data?.thirdSection?.title_ar);
        setValue("thirdSection.items", json.data?.thirdSection?.items);

        setValue("fourthSection.title", json.data?.fourthSection?.title);
        setValue("fourthSection.title_ar", json.data?.fourthSection?.title_ar);
        setValue("fourthSection.items", json.data?.fourthSection?.items);

        replacePeople(json.data?.secondSection?.items || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= UI ================= */

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
            {/* ================= ENGLISH ================= */}
            <div className="flex flex-col gap-6">
                {/* ================= PAGE CONTENT ================= */}
                <AdminItemContainer>
                    <Label main>Page Content</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex w-full gap-5">
                            <div className="w-full">
                                <Label className="font-bold">Page Title</Label>
                                <Input
                                    {...register("pageTitle", {
                                        required: "Page title is required",
                                    })}
                                />
                                <FormError error={errors.pageTitle?.message} />
                            </div>

                            <div className="w-full">
                                <Label className="font-bold">Page Sub Title</Label>
                                <Input
                                    {...register("pageSubTitle", {
                                        required: "Page sub title is required",
                                    })}
                                />
                                <FormError error={errors.pageSubTitle?.message} />
                            </div>
                        </div>

                        <div className="w-full">
                            <Label className="font-bold">Page Description</Label>
                            <Textarea
                                {...register("pageDescription", {
                                    required: "Page description is required",
                                })}
                                placeholder="Description"
                            />
                            <FormError error={errors.pageDescription?.message} />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= LEADERSHIP SECTION ================= */}

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {firstSectionItems.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="px-5 grid grid-cols-2 gap-5 relative border-b pb-2"
                                            >
                                                <div className="absolute top-0 right-2">
                                                    <RiDeleteBinLine
                                                        onClick={() => firstSectionRemove(index)}
                                                        className="cursor-pointer text-red-600"
                                                    />
                                                </div>
                                                <div>
                                                    <Controller
                                                        name={`firstSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Leader image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <FormError
                                                        error={errors.firstSection?.items?.[index]?.image?.message}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div>
                                                        <Label className="font-bold">Name</Label>
                                                        <Input
                                                            {...register(`firstSection.items.${index}.name`, {
                                                                required: "Leader name is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={errors.firstSection?.items?.[index]?.name?.message}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="font-bold">Designation</Label>
                                                        <Input
                                                            {...register(`firstSection.items.${index}.designation`, {
                                                                required: "Designation is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={
                                                                errors.firstSection?.items?.[index]?.designation?.message
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="font-bold">Image Alt</Label>
                                                        <Input
                                                            {...register(`firstSection.items.${index}.imageAlt`, {
                                                                required: "Image alt text is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={errors.firstSection?.items?.[index]?.imageAlt?.message}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <Label className="font-bold">Description</Label>
                                                    <Textarea
                                                        {...register(`firstSection.items.${index}.description`, {
                                                            required: "Description is required",
                                                        })}
                                                        placeholder="Leader description"
                                                    />
                                                    <FormError
                                                        error={errors.firstSection?.items?.[index]?.description?.message}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                className=""
                                                addItem
                                                onClick={() =>
                                                    firstSectionAppend({
                                                        image: "",
                                                        name: "",
                                                        name_ar: "",
                                                        designation: "",
                                                        designation_ar: "",
                                                        description: "",
                                                        description_ar: "",
                                                        imageAlt: "",
                                                        imageAlt_ar: "",
                                                    })
                                                }
                                            >
                                                Add Item
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= Second SECTION ================= */}
                <AdminItemContainer>
                    <Label main>Second Section (Team)</Label>

                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input
                            {...register("thirdSection.title", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.thirdSection?.title?.message} />
                    </div>
                    <div className="p-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                            {thirdSectionItems.map((field, index) => (
                                <div key={field.id} className="px-5 grid grid-cols-2 gap-5 relative border-b pb-2">
                                    <div className="absolute top-0 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => thirdSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name={`thirdSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Leader image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.image?.message} />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <Label className="font-bold">Name</Label>
                                            <Input
                                                {...register(`thirdSection.items.${index}.name`, {
                                                    required: "Leader name is required",
                                                })}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.name?.message} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Designation</Label>
                                            <Input
                                                {...register(`thirdSection.items.${index}.designation`, {
                                                    required: "Designation is required",
                                                })}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.designation?.message} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Image Alt</Label>
                                            <Input
                                                {...register(`thirdSection.items.${index}.imageAlt`, {
                                                    required: "Image alt text is required",
                                                })}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.imageAlt?.message} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    className=""
                                    addItem
                                    onClick={() =>
                                        thirdSectionAppend({
                                            image: "",
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            imageAlt: "",
                                            imageAlt_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= Third SECTION ================= */}
                <AdminItemContainer>
                    <Label main>Third Section (Team)</Label>

                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input
                            {...register("fourthSection.title", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.fourthSection?.title?.message} />
                    </div>
                    <div className="p-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                            {fourthSectionItems.map((field, index) => (
                                <div key={field.id} className="px-5 grid grid-cols-2 gap-5 relative border-b pb-2">
                                    <div className="absolute top-0 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => fourthSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name={`fourthSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Leader image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.fourthSection?.items?.[index]?.image?.message} />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <Label className="font-bold">Name</Label>
                                            <Input
                                                {...register(`fourthSection.items.${index}.name`, {
                                                    required: "Leader name is required",
                                                })}
                                            />
                                            <FormError error={errors.fourthSection?.items?.[index]?.name?.message} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Designation</Label>
                                            <Input
                                                {...register(`fourthSection.items.${index}.designation`, {
                                                    required: "Designation is required",
                                                })}
                                            />
                                            <FormError error={errors.fourthSection?.items?.[index]?.designation?.message} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Image Alt</Label>
                                            <Input
                                                {...register(`fourthSection.items.${index}.imageAlt`, {
                                                    required: "Image alt text is required",
                                                })}
                                            />
                                            <FormError error={errors.fourthSection?.items?.[index]?.imageAlt?.message} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    className=""
                                    addItem
                                    onClick={() =>
                                        fourthSectionAppend({
                                            image: "",
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            imageAlt: "",
                                            imageAlt_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= META ================= */}
                <AdminItemContainer>
                    <Label main>Meta</Label>

                    <div className="p-5 rounded-md flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Meta Title</Label>
                            <Input {...register("metaTitle")} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Meta Description</Label>
                            <Input {...register("metaDescription")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>

            {/* ================= Arabic ================= */}
            <div className="flex flex-col gap-6">
                {/* ================= PAGE CONTENT ================= */}
                <AdminItemContainer>
                    <Label main>Page Content</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex w-full gap-5">
                            <div className="w-full">
                                <Label className="font-bold">Page Title</Label>
                                <Input {...register("pageTitle_ar")} />
                            </div>

                            <div className="w-full">
                                <Label className="font-bold">Page Sub Title</Label>
                                <Input {...register("pageSubTitle_ar")} />
                            </div>
                        </div>

                        <div className="w-full">
                            <Label className="font-bold">Page Description</Label>
                            <Textarea {...register("pageDescription_ar")} placeholder="Description" />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= LEADERSHIP SECTION ================= */}
                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {firstSectionItems.map((field, index) => (
                                            <div key={field.id} className="px-5 rounded-md grid grid-cols-2 gap-5">
                                                <div>
                                                    <Controller
                                                        name={`firstSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Leader image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <FormError
                                                        error={errors.firstSection?.items?.[index]?.image?.message}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div>
                                                        <Label className="font-bold">Name</Label>
                                                        <Input {...register(`firstSection.items.${index}.name_ar`)} />
                                                    </div>

                                                    <div>
                                                        <Label className="font-bold">Designation</Label>
                                                        <Input
                                                            {...register(`firstSection.items.${index}.designation_ar`)}
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label className="font-bold">Image Alt</Label>
                                                        <Input {...register(`firstSection.items.${index}.imageAlt_ar`)} />
                                                    </div>
                                                </div>

                                                <div className="col-span-2">
                                                    <Label className="font-bold">Description</Label>
                                                    <Textarea
                                                        {...register(`firstSection.items.${index}.description_ar`)}
                                                        placeholder="Leader description"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                className=""
                                                addItem
                                                onClick={() =>
                                                    firstSectionAppend({
                                                        image: "",
                                                        name: "",
                                                        name_ar: "",
                                                        designation: "",
                                                        designation_ar: "",
                                                        description: "",
                                                        description_ar: "",
                                                        imageAlt: "",
                                                        imageAlt_ar: "",
                                                    })
                                                }
                                            >
                                                Add Item
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= Second SECTION ================= */}
                <AdminItemContainer>
                    <Label main>Second Section (Team)</Label>

                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input
                            {...register("secondSection.title_ar", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.secondSection?.title_ar?.message} />
                    </div>
                    <div className="p-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                            {thirdSectionItems.map((field, index) => (
                                <div key={field.id} className="px-5 grid grid-cols-2 gap-5 relative border-b pb-2">
                                    <div className="absolute top-0 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => thirdSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name={`thirdSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Leader image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.image?.message} />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <Label className="font-bold">Name</Label>
                                            <Input {...register(`thirdSection.items.${index}.name_ar`)} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Designation</Label>
                                            <Input {...register(`thirdSection.items.${index}.designation_ar`)} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Image Alt</Label>
                                            <Input {...register(`thirdSection.items.${index}.imageAlt_ar`)} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    className=""
                                    addItem
                                    onClick={() =>
                                        thirdSectionAppend({
                                            image: "",
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            imageAlt: "",
                                            imageAlt_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= Third SECTION ================= */}
                <AdminItemContainer>
                    <Label main>Third Section (Team)</Label>

                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input {...register("fourthSection.title_ar")} />
                    </div>
                    <div className="p-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                            {fourthSectionItems.map((field, index) => (
                                <div key={field.id} className="px-5 grid grid-cols-2 gap-5 relative border-b pb-2">
                                    <div className="absolute top-0 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => fourthSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name={`fourthSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Leader image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.fourthSection?.items?.[index]?.image?.message} />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <Label className="font-bold">Name</Label>
                                            <Input {...register(`fourthSection.items.${index}.name_ar`)} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Designation</Label>
                                            <Input {...register(`fourthSection.items.${index}.designation_ar`)} />
                                        </div>

                                        <div>
                                            <Label className="font-bold">Image Alt</Label>
                                            <Input {...register(`fourthSection.items.${index}.imageAlt_ar`)} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    className=""
                                    addItem
                                    onClick={() =>
                                        fourthSectionAppend({
                                            image: "",
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            imageAlt: "",
                                            imageAlt_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= META ================= */}
                <AdminItemContainer>
                    <Label main>Meta</Label>

                    <div className="p-5 rounded-md flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Meta Title</Label>
                            <Input {...register("metaTitle")} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Meta Description</Label>
                            <Input {...register("metaDescription")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>
            {/* ================= SUBMIT ================= */}
            <div className="col-span-2">
                <Button type="submit" className="w-full text-white bg-primary">
                    Save Leadership Page
                </Button>
            </div>

            {/* ================= EDIT PERSON ================= */}
            {editingPerson !== null && (
                <Dialog
                    open={editingPerson !== null}
                    onOpenChange={(open) => {
                        if (!open && editingPerson !== null) {
                            // resetField(`secondSection.items.${editingPerson}`);
                            setEditingPerson(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Edit Team Member</DialogTitle>
                        </DialogHeader>

                        {/* IMAGE – FULL WIDTH */}
                        <div className="w-full">
                            <Controller
                                name={`secondSection.items.${editingPerson}.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />

                            <FormError error={errors.secondSection?.items?.[editingPerson!]?.image?.message} />
                        </div>

                        {/* FORM – EN (LEFT) / AR (RIGHT) */}
                        <div className="grid grid-cols-2 gap-6 mt-6">
                            {/* LEFT – ENGLISH (REQUIRED) */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Input
                                        placeholder="Name (English)"
                                        {...register(`secondSection.items.${editingPerson}.name`, {
                                            required: "Name (English) is required",
                                        })}
                                    />
                                    <FormError error={errors.secondSection?.items?.[editingPerson!]?.name?.message} />
                                </div>

                                <div>
                                    <Input
                                        placeholder="Designation (English)"
                                        {...register(`secondSection.items.${editingPerson}.designation`, {
                                            required: "Designation (English) is required",
                                        })}
                                    />
                                    <FormError
                                        error={errors.secondSection?.items?.[editingPerson!]?.designation?.message}
                                    />
                                </div>

                                <div>
                                    <Input
                                        placeholder="Image Alt (English)"
                                        {...register(`secondSection.items.${editingPerson}.imageAlt`, {
                                            required: "Image alt text (English) is required",
                                        })}
                                    />
                                    <FormError error={errors.secondSection?.items?.[editingPerson!]?.imageAlt?.message} />
                                </div>

                                <Input
                                    placeholder="Social Link"
                                    {...register(`secondSection.items.${editingPerson}.socialLink`)}
                                />
                            </div>

                            {/* RIGHT – ARABIC (OPTIONAL) */}
                            <div className="flex flex-col gap-4">
                                <Input
                                    placeholder="Name (Arabic)"
                                    {...register(`secondSection.items.${editingPerson}.name_ar`)}
                                />

                                <Input
                                    placeholder="Designation (Arabic)"
                                    {...register(`secondSection.items.${editingPerson}.designation_ar`)}
                                />

                                <Input
                                    placeholder="Image Alt (Arabic)"
                                    {...register(`secondSection.items.${editingPerson}.imageAlt_ar`)}
                                />
                            </div>
                        </div>

                        {/* SAVE */}
                        <Button
                            type="button"
                            className="text-white mt-6"
                            onClick={async () => {
                                const index = editingPerson!;

                                const isValid = await trigger([
                                    `secondSection.items.${index}.image`,
                                    `secondSection.items.${index}.name`,
                                    `secondSection.items.${index}.designation`,
                                    `secondSection.items.${index}.imageAlt`,
                                ]);

                                if (!isValid) return;

                                const data = getValues(`secondSection.items.${index}`);

                                updatePerson(index, data);

                                await saveToAPI();

                                setEditingPerson(null);
                            }}
                        >
                            Save
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

            {/* ================= MANAGE SECTIONS ================= */}
            <div className="col-span-2 mt-10 grid grid-cols-1 gap-6">
                {/* RIGHT: TEAM MEMBERS */}
                {/*   <AdminItemContainer>
                    <Label main>Team Members</Label>
                    <PeopleList
                        people={peopleFields}
                        onEdit={(i) => {
                            setEditingPerson(i);
                        }}
                        onDelete={async (i) => {
                            removePerson(i);
                            await saveToAPI();
                        }}
                        onAdd={() => {
                            setValue(`secondSection.items.${peopleFields.length}`, {
                                image: "",
                                name: "",
                                name_ar: "",
                                designation: "",
                                designation_ar: "",
                                socialLink: "",
                            });
                            setEditingPerson(peopleFields.length);
                        }}
                    />
                </AdminItemContainer> */}

                <AdminItemContainer>
                    <div className="flex justify-between items-center p-3 border-b-1">
                        <Label className="!text-lg !font-bold">Team Members</Label>

                        <Button
                            type="button"
                            className="bg-green-600 text-white"
                            onClick={() => setReorderMode(!reorderMode)}
                        >
                            {reorderMode ? <GiConfirmed /> : <TbReorder />}
                        </Button>
                    </div>

                    {!reorderMode && (
                        <PeopleList
                            people={peopleFields}
                            onEdit={(i) => setEditingPerson(i)}
                            onDelete={async (i) => {
                                removePerson(i);
                                await saveToAPI();
                            }}
                            onAdd={() => {
                                setValue(`secondSection.items.${peopleFields.length}`, {
                                    image: "",
                                    name: "",
                                    name_ar: "",
                                    designation: "",
                                    designation_ar: "",
                                    socialLink: "",
                                });
                                setEditingPerson(peopleFields.length);
                            }}
                        />
                    )}

                    {reorderMode && (
                        <div className="p-4 flex flex-col gap-3">
                            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={peopleFields.map((p) => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {peopleFields.map((person, i) => (
                                        <SortablePerson
                                            key={person.id}
                                            person={person}
                                            index={i}
                                            onEdit={(i) => setEditingPerson(i)}
                                            onDelete={async (i) => {
                                                removePerson(i);
                                                await saveToAPI();
                                            }}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </AdminItemContainer>
            </div>
        </form>
    );
};

export default LeadershipAdminPage;
