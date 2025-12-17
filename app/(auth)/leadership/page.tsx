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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
        name: string;
        name_ar?: string;
        designation: string;
        designation_ar?: string;
        description: string;
        description_ar: string;
        image: string;
        imageAlt: string;
        imageAlt_ar?: string;

        nameTwo: string;
        nameTwo_ar?: string;
        designationTwo?: string;
        designationTwo_ar?: string;
        descriptionTwo: string;
        descriptionTwo_ar: string;
        imageTwo: string;
        imageTwoAlt: string;
        imageTwoAlt_ar?: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;

        departments: {
            name: string;
            name_ar?: string;
        }[];

        items: {
            image: string;
            imageAlt?: string;
            imageAlt_ar?: string;
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;
            department: string;
            socialLink?: string;
        }[];
    };
}

type DepartmentField = FieldArrayWithId<LeadershipFormProps, "secondSection.departments", "id">;

type PersonField = FieldArrayWithId<LeadershipFormProps, "secondSection.items", "id">;

type DepartmentListProps = {
    departments: DepartmentField[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onAdd: () => void;
};

const DepartmentList = ({ departments, onEdit, onDelete, onAdd }: DepartmentListProps) => (
    <div className="p-4 flex flex-col gap-3">
        {departments.map((dept, i) => (
            <div key={dept.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted">
                <div className="cursor-pointer" onClick={() => onEdit(i)}>
                    <p className="font-medium">{dept.name || "— English name"}</p>
                    <p className="text-sm text-muted-foreground">{dept.name_ar || "— Arabic name"}</p>
                </div>

                <div className="flex gap-4">
                    <RiEditLine size={24} className="cursor-pointer" onClick={() => onEdit(i)} />
                    <RiDeleteBinLine size={22} className="cursor-pointer" onClick={() => onDelete(i)} />
                </div>
            </div>
        ))}

        <Button type="button" addItem onClick={onAdd}>
            Add Department
        </Button>
    </div>
);

type PeopleListProps = {
    people: PersonField[];
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onAdd: () => void;
};

const PeopleList = ({ people, onEdit, onDelete, onAdd }: PeopleListProps) => (
    <div className="p-4 flex flex-col gap-3">
        {people.map((person, i) => (
            <div key={person.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEdit(i)}>
                    <img src={person.image} className="w-10 h-10 rounded-full object-cover" />
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

    const [editingDepartment, setEditingDepartment] = useState<number | null>(null);
    const [editingPerson, setEditingPerson] = useState<number | null>(null);
    const [isNewDepartment, setIsNewDepartment] = useState(false);
    const [isNewPerson, setIsNewPerson] = useState(false);

    /* ---------- Field Arrays ---------- */

    const {
        fields: departmentFields,
        append: addDepartment,
        update: updateDepartment,
        remove: removeDepartment,
        replace: replaceDepartments,
    } = useFieldArray({
        control,
        name: "secondSection.departments",
    });

    const {
        fields: peopleFields,
        append: addPerson,
        update: updatePerson,
        remove: removePerson,
        replace: replacePeople,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    /* ================= SUBMIT ================= */

    const onSubmit = async (data: LeadershipFormProps) => {
        await fetch("/api/admin/leadership", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        alert("Leadership updated");
    };

    const saveToAPI = async () => {
        const data = getValues();

        await fetch("/api/admin/leadership", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
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

        setValue("secondSection.title", json.data?.secondSection?.title);
        setValue("secondSection.title_ar", json.data?.secondSection?.title_ar);

        replaceDepartments(json.data?.secondSection?.departments || []);
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
                    <Label main>Leadership Section</Label>

                    {/* ================= LEADER 1 ================= */}
                    <div className="px-5">
                        <Label className="text-sm font-semibold text-muted-foreground">Leader 1</Label>
                    </div>

                    <div className="px-5 rounded-md grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="firstSection.image"
                                control={control}
                                rules={{ required: "Leader image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.firstSection?.image?.message} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <Label className="font-bold">Name</Label>
                                <Input
                                    {...register("firstSection.name", {
                                        required: "Leader name is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.name?.message} />
                            </div>

                            <div>
                                <Label className="font-bold">Designation</Label>
                                <Input
                                    {...register("firstSection.designation", {
                                        required: "Designation is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.designation?.message} />
                            </div>

                            <div>
                                <Label className="font-bold">Image Alt</Label>
                                <Input
                                    {...register("firstSection.imageAlt", {
                                        required: "Image alt text is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.imageAlt?.message} />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                {...register("firstSection.description", {
                                    required: "Description is required",
                                })}
                                placeholder="Leader description"
                            />
                            <FormError error={errors.firstSection?.description?.message} />
                        </div>
                    </div>

                    {/* ================= LEADER 2 ================= */}
                    <div className="px-5 pt-5 border-t mt-5">
                        <Label className="text-sm font-semibold text-muted-foreground">Leader 2</Label>
                    </div>

                    <div className="px-5 pb-5 rounded-md grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="firstSection.imageTwo"
                                control={control}
                                rules={{ required: "Second leader image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.firstSection?.imageTwo?.message} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <Label className="font-bold">Name</Label>
                                <Input
                                    {...register("firstSection.nameTwo", {
                                        required: "Name is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.nameTwo?.message} />
                            </div>

                            <div>
                                <Label className="font-bold">Designation</Label>
                                <Input
                                    {...register("firstSection.designationTwo", {
                                        required: "Designation is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.designationTwo?.message} />
                            </div>

                            <div>
                                <Label className="font-bold">Image Alt</Label>
                                <Input
                                    {...register("firstSection.imageTwoAlt", {
                                        required: "Image alt text is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.imageTwoAlt?.message} />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                {...register("firstSection.descriptionTwo", {
                                    required: "Description is required",
                                })}
                                placeholder="Second leader description"
                            />
                            <FormError error={errors.firstSection?.descriptionTwo?.message} />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* ================= Second SECTION ================= */}
                <AdminItemContainer>
                    <Label main>Second Section (Team)</Label>

                    <div className="p-5 flex flex-col gap-2">
                        <Label className="font-bold">Title</Label>
                        <Input
                            {...register("secondSection.title", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.secondSection?.title?.message} />
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
                    <Label main>Leadership Section</Label>
                    {/* ================= LEADER 1 ================= */}
                    <div className="px-5">
                        <Label className="text-sm font-semibold text-muted-foreground">Leader 1</Label>
                    </div>

                    <div className="px-5 rounded-md grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="firstSection.image"
                                control={control}
                                rules={{ required: "Leader image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.firstSection?.image?.message} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <Label className="font-bold">Name</Label>
                                <Input {...register("firstSection.name_ar")} />
                            </div>

                            <div>
                                <Label className="font-bold">Designation</Label>
                                <Input {...register("firstSection.designation_ar")} />
                            </div>

                            <div>
                                <Label className="font-bold">Image Alt</Label>
                                <Input
                                    {...register("firstSection.imageAlt_ar", {
                                        required: "Image alt text is required",
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label className="font-bold">Description</Label>
                            <Textarea {...register("firstSection.description_ar")} placeholder="Leader description" />
                        </div>
                    </div>

                    {/* ================= LEADER 2 ================= */}
                    <div className="px-5 pt-5 border-t mt-5">
                        <Label className="text-sm font-semibold text-muted-foreground">Leader 2</Label>
                    </div>

                    <div className="px-5 pb-5 rounded-md grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="firstSection.imageTwo"
                                control={control}
                                rules={{ required: "Second leader image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.firstSection?.imageTwo?.message} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <div>
                                <Label className="font-bold">Name</Label>
                                <Input {...register("firstSection.nameTwo_ar")} />
                            </div>

                            <div>
                                <Label className="font-bold">Designation</Label>
                                <Input {...register("firstSection.designationTwo_ar")} />
                            </div>

                            <div>
                                <Label className="font-bold">Image Alt</Label>
                                <Input {...register("firstSection.imageTwoAlt_ar")} />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                {...register("firstSection.descriptionTwo_ar")}
                                placeholder="Second leader description"
                            />
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

            {/* ================= EDIT DEPARTMENT ================= */}
            {editingDepartment !== null && (
                <Dialog
                    open
                    onOpenChange={() => {
                        // resetField(`secondSection.departments.${editingDepartment}`);
                        setEditingDepartment(null);
                        setIsNewDepartment(false);
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Department</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                            <Input
                                placeholder="Department (English)"
                                {...register(`secondSection.departments.${editingDepartment}.name`, {
                                    required: "Department name is required",
                                })}
                            />

                            <FormError error={errors.secondSection?.departments?.[editingDepartment!]?.name?.message} />

                            <Input
                                placeholder="Department (Arabic)"
                                {...register(`secondSection.departments.${editingDepartment}.name_ar`)}
                            />

                            <Button
                                type="button"
                                className="text-white"
                                onClick={async () => {
                                    const index = editingDepartment!;

                                    const isValid = await trigger(`secondSection.departments.${index}.name`);

                                    if (!isValid) return;

                                    updateDepartment(index, {
                                        name: getValues(`secondSection.departments.${index}.name`),
                                        name_ar: getValues(`secondSection.departments.${index}.name_ar`),
                                    });

                                    await saveToAPI();

                                    setEditingDepartment(null);
                                    setIsNewDepartment(false);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* ================= EDIT PERSON ================= */}
            {editingPerson !== null && (
                <Dialog
                    open={editingPerson !== null}
                    onOpenChange={(open) => {
                        if (!open && editingPerson !== null) {
                            // resetField(`secondSection.items.${editingPerson}`);
                            setEditingPerson(null);
                            setIsNewPerson(false);
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

                                {/* DEPARTMENT – REQUIRED */}
                                <Controller
                                    control={control}
                                    name={`secondSection.items.${editingPerson}.department`}
                                    rules={{ required: "Department is required" }}
                                    render={({ field }) => (
                                        <>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>

                                                <SelectContent
                                                    className="w-full z-[60] bg-white"
                                                    position="popper"
                                                    sideOffset={4}
                                                >
                                                    {departmentFields.map((dept, i) => (
                                                        <SelectItem key={i} value={dept.name}>
                                                            <span>{dept.name}</span>
                                                            <span className="ml-4 text-muted-foreground">
                                                                ({dept.name_ar})
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormError
                                                error={errors.secondSection?.items?.[editingPerson!]?.department?.message}
                                            />
                                        </>
                                    )}
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
                                    `secondSection.items.${index}.department`,
                                ]);

                                if (!isValid) return;

                                const data = getValues(`secondSection.items.${index}`);

                                updatePerson(index, data);

                                await saveToAPI();

                                setEditingPerson(null);
                                setIsNewPerson(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

            {/* ================= MANAGE SECTIONS ================= */}
            <div className="col-span-2 mt-10 grid grid-cols-2 gap-6">
                {/* LEFT: DEPARTMENTS */}
                <AdminItemContainer>
                    <Label main>Departments</Label>
                    <DepartmentList
                        departments={departmentFields}
                        onEdit={(i) => {
                            setIsNewDepartment(false);
                            setEditingDepartment(i);
                        }}
                        onDelete={async (i) => {
                            removeDepartment(i);
                            await saveToAPI();
                        }}
                        onAdd={() => {
                            setIsNewDepartment(true);
                            setValue(`secondSection.departments.${departmentFields.length}`, {
                                name: "",
                                name_ar: "",
                            });
                            setEditingDepartment(departmentFields.length);
                        }}
                    />
                </AdminItemContainer>

                {/* RIGHT: TEAM MEMBERS */}
                <AdminItemContainer>
                    <Label main>Team Members</Label>
                    <PeopleList
                        people={peopleFields}
                        onEdit={(i) => {
                            setIsNewPerson(false);
                            setEditingPerson(i);
                        }}
                        onDelete={async (i) => {
                            removePerson(i);
                            await saveToAPI();
                        }}
                        onAdd={() => {
                            setIsNewPerson(true);
                            setValue(`secondSection.items.${peopleFields.length}`, {
                                image: "",
                                name: "",
                                name_ar: "",
                                designation: "",
                                designation_ar: "",
                                department: "",
                                socialLink: "",
                            });
                            setEditingPerson(peopleFields.length);
                        }}
                    />
                </AdminItemContainer>
            </div>
        </form>
    );
};

export default LeadershipAdminPage;
