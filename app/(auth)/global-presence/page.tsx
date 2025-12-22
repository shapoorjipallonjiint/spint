"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import SecondSectionItem from "../../components/GlobalPresence/SecondSectionItems";
import { toast } from "sonner";

interface GlobalPresenceFormProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;

    banner: string;
    bannerAlt?: string;
    bannerAlt_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;

    firstSection: {
        title: string;
        title_ar: string;
        description: string;
        description_ar: string;
    };

    secondSection: {
        title: string;
        title_ar: string;
        items: {
            name?: string;
            name_ar?: string;
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
            projects: string;
            projects_ar: string;
            country: string;
            country_ar: string;
            countries: { name: string; name_ar: string }[];
        }[];
    };
}

const GlobalPresencePage = () => {
    const methods = useForm<GlobalPresenceFormProps>();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = methods;

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/admin/global-presence");
            const json = await res.json();
            const data = json?.data;

            if (!data) return;

            setValue("banner", data.banner);
            setValue("bannerAlt", data.bannerAlt);
            setValue("bannerAlt_ar", data.bannerAlt_ar);

            setValue("pageTitle", data.pageTitle);
            setValue("pageTitle_ar", data.pageTitle_ar);

            setValue("metaTitle", data.metaTitle);
            setValue("metaTitle_ar", data.metaTitle_ar);
            setValue("metaDescription", data.metaDescription);
            setValue("metaDescription_ar", data.metaDescription_ar);

            setValue("firstSection", data.firstSection);
            setValue("secondSection.title", data.secondSection?.title);
            setValue("secondSection.title_ar", data.secondSection?.title_ar);

            // ✅ THIS IS THE IMPORTANT PART
            if (Array.isArray(data.secondSection?.items)) {
                replace(data.secondSection.items);
            }
        };

        fetchData();
    }, [setValue, replace]);

    const onSubmit = async (formData: GlobalPresenceFormProps) => {
        try {
            const res = await fetch("/api/admin/global-presence", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                console.error("Save failed:", result);
                toast.error(result?.message || "Failed to save Global Presence");
                return;
            }

            toast.success("Global Presence updated successfully");
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Something went wrong while saving");
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                className="grid grid-cols-2 gap-10"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                }}
            >
                {/* English Version */}
                <div className="flex flex-col gap-6">
                    {/* BANNER */}
                    <AdminItemContainer>
                        <Label main>Banner</Label>

                        <div className="flex gap-4 p-5">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Controller
                                    name="banner"
                                    rules={{ required: "Banner is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.banner?.message} />
                            </div>

                            <div className="flex flex-col w-1/2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label>Banner Alt</Label>
                                    <Input {...register("bannerAlt")} />
                                    <FormError error={errors.bannerAlt?.message} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Page Title</Label>
                                    <Input {...register("pageTitle")} />
                                    <FormError error={errors.pageTitle?.message} />
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* FIRST SECTION */}
                    <AdminItemContainer>
                        <Label main>First Section</Label>

                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input
                                    {...register("firstSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.title?.message} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label>Description</Label>
                                <Textarea
                                    {...register("firstSection.description", {
                                        required: "Description is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.description?.message} />
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* SECOND SECTION */}
                    <AdminItemContainer>
                        <Label main>Second Section</Label>

                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input
                                    {...register("secondSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.secondSection?.title?.message} />
                            </div>

                            <div className="flex flex-col gap-4">
                                {fields.map((_, index) => (
                                    <SecondSectionItem key={index} index={index} removeItem={remove} side="left" />
                                ))}

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        addItem
                                        onClick={() =>
                                            append({
                                                name: "",
                                                name_ar: "",
                                                image: "",
                                                imageAlt: "",
                                                imageAlt_ar: "",
                                                projects: "",
                                                projects_ar: "",
                                                country: "",
                                                country_ar: "",
                                                countries: [],
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* META */}
                    <div className="flex flex-col gap-4 p-1">
                        <div className="flex flex-col gap-1">
                            <Label>Meta Title</Label>
                            <Input {...register("metaTitle")} />
                            <FormError error={errors.metaTitle?.message} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Meta Description</Label>
                            <Input {...register("metaDescription")} />
                            <FormError error={errors.metaDescription?.message} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* BANNER */}
                    <AdminItemContainer>
                        <Label main>Banner</Label>

                        <div className="flex gap-4 p-5">
                            <Controller
                                name="banner"
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />

                            <div className="flex flex-col w-full gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label>Banner Alt</Label>
                                    <Input {...register("bannerAlt_ar")} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Page Title</Label>
                                    <Input {...register("pageTitle_ar")} />
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* FIRST SECTION */}
                    <AdminItemContainer>
                        <Label main>First Section</Label>

                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input {...register("firstSection.title_ar")} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label>Description</Label>
                                <Textarea {...register("firstSection.description_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* SECOND SECTION */}
                    <AdminItemContainer>
                        <Label main>Second Section</Label>

                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input {...register("secondSection.title_ar")} />
                            </div>

                            <div className="flex flex-col gap-4">
                                {fields.map((_, index) => (
                                    <SecondSectionItem key={index} index={index} removeItem={remove} side="right" />
                                ))}

                                <div className="flex justify-end cursor-not-allowed">
                                    <Button
                                        disabled
                                        type="button"
                                        addItem
                                        onClick={() =>
                                            append({
                                                name: "",
                                                name_ar: "",
                                                image: "",
                                                imageAlt: "",
                                                imageAlt_ar: "",
                                                projects: "",
                                                projects_ar: "",
                                                country: "",
                                                country_ar: "",
                                                countries: [],
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    {/* META */}
                    <div className="flex flex-col gap-4 p-1">
                        <div className="flex flex-col gap-1">
                            <Label>Meta Title</Label>
                            <Input {...register("metaTitle_ar")} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Meta Description</Label>
                            <Input {...register("metaDescription_ar")} />
                        </div>
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="col-span-2">
                    <Button type="submit" className="w-full bg-primary text-white font-semibold hover:bg-primary/90">
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default GlobalPresencePage;
