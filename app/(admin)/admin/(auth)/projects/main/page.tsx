"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";

interface ProjectPageProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    banner: string;
    bannerAlt: string;
    bannerAlt_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
    firstSection: {
        items: {
            number: string;
            number_ar: string;
            value: string;
            value_ar: string;
        }[];
    };
}

// Projects > Main: the projects page's banner, first section items and SEO (the project list is at /admin/projects).
// Saves only these page fields; the projects themselves are never written here.
export default function ProjectsMain() {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProjectPageProps>();

    const {
        fields: firstSectionItems,
        append: firstSectionAppend,
        remove: firstSectionRemove,
    } = useFieldArray({
        control,
        name: "firstSection.items",
    });

    const onSubmit = async (data: ProjectPageProps) => {
        try {
            const response = await fetch(`/api/admin/project`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in submitting project details", error);
        }
    };

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch("/api/admin/project");
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.items", data.data.firstSection.items);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching project details", error);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col gap-5">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
                {/*English Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner?.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input
                                                type="text"
                                                placeholder="Alt Tag"
                                                {...register(`bannerAlt`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.bannerAlt && <p className="text-red-500">{errors.bannerAlt.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Title</Label>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                {...register(`pageTitle`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.pageTitle && <p className="text-red-500">{errors.pageTitle.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border border-black/20 p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-2 p-5">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="" {...register("metaTitle")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Description</Label>
                                <Input type="text" placeholder="" {...register("metaDescription")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                {/*Arabic Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input type="text" placeholder="Alt Tag" {...register(`bannerAlt_ar`)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Title</Label>
                                            <Input type="text" placeholder="Title" {...register(`pageTitle_ar`)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border border-black/20 p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b border-black/20 pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number_ar`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value_ar`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-2 p-5">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="" {...register("metaTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Description</Label>
                                <Input type="text" placeholder="" {...register("metaDescription_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
