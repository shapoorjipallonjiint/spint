"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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

const ContactPage = () => {
    const {
        register,
        handleSubmit,
        control,
        reset,
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

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

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

                        <Label className="font-bold">Items</Label>

                        <div className="border p-3 rounded-md flex flex-col gap-5">
                            {secondSectionItems.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b pb-5">
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
                                        <Label className="font-bold">Phone</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.phone`, {
                                                required: "Phone is required",
                                            })}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.phone?.message} />

                                        <Label className="font-bold">Fax</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.fax`, {
                                                required: "Fax is required",
                                            })}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.fax?.message} />

                                        <Label className="font-bold">Location</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.location`, {
                                                required: "Location is required",
                                            })}
                                        />
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
                    </div>
                </AdminItemContainer>

                {/* Meta */}
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Title</Label>
                    <Input {...register("metaTitle")} />
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Description</Label>
                    <Input {...register("metaDescription")} />
                </div>
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
                            {...register("pageTitle_ar", { required: "Page title is required" })}
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
                            <Input {...register("secondSection.title_ar")} />
                        </div>

                        <Label className="font-bold">Items</Label>

                        <div className="border p-3 rounded-md flex flex-col gap-5">
                            {secondSectionItems.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b pb-5">
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
                                            {...register(`secondSection.items.${index}.phone`, {
                                                required: "Phone is required",
                                            })}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.phone?.message} />

                                        <Label className="font-bold">Fax</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.fax`, {
                                                required: "Fax is required",
                                            })}
                                        />
                                        <FormError error={errors.secondSection?.items?.[index]?.fax?.message} />

                                        <Label className="font-bold">Location</Label>
                                        <Input
                                            {...register(`secondSection.items.${index}.location`, {
                                                required: "Location is required",
                                            })}
                                        />
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
                    </div>
                </AdminItemContainer>

                {/* Meta */}
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Title</Label>
                    <Input {...register("metaTitle_ar")} />
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Description</Label>
                    <Input {...register("metaDescription_ar")} />
                </div>
            </div>

            <div className="col-span-2">
                <Button type="submit" className="w-full text-white text-[16px]">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default ContactPage;
