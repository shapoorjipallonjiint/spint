"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { ImageZone } from "@/app/components/Community/ImageZone";

interface CommunityFormProps {
    metaTitle: string;
    metaTitle_ar?: string;

    metaDescription: string;
    metaDescription_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;

    banner: string;
    bannerAlt: string;
    bannerAlt_ar?: string;

    firstSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        items: {
            leftMost: {
                image: string;
            }[];

            leftColTop: {
                image: string;
            }[];

            leftColBottom: {
                image: string;
            }[];

            leftOfCenter: {
                image: string;
            }[];

            center: {
                image: string;
            }[];

            rightOfCenter: {
                image: string;
            }[];

            rightColTop: {
                image: string;
            }[];

            rightColBottom: {
                image: string;
            }[];

            rightMost: {
                image: string;
            }[];
        };
    };

    secondSection: {
        title: string;
        title_ar?: string;

        items: {
            title: string;
            title_ar?: string;

            description: string;
            description_ar?: string;

            icon: string;
            iconAlt: string;
            iconAlt_ar?: string;

            image: string;
            imageAlt: string;
            imageAlt_ar?: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        items: {
            title: string;
            title_ar?: string;

            description: string;
            description_ar?: string;

            image: string;
            imageAlt: string;
            imageAlt_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;

        items: {
            title: string;
            title_ar?: string;

            date: string;

            image: string;
            imageAlt: string;
            imageAlt_ar?: string;
        }[];
    };
}

export const FIRST_SECTION_ZONES = {
    leftMost: { label: "Left Most" },

    leftColTop: { label: "Left Column Top" },
    leftColBottom: { label: "Left Column Bottom" },

    leftOfCenter: { label: "Left of Center" },

    center: { label: "Center (Main)" },

    rightOfCenter: { label: "Right of Center" },

    rightColTop: { label: "Right Column Top" },
    rightColBottom: { label: "Right Column Bottom" },

    rightMost: { label: "Right Most" },
} as const;

export type FirstSectionZoneKey = keyof typeof FIRST_SECTION_ZONES;

const CommunityPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CommunityFormProps>({
        defaultValues: {
            firstSection: {
                items: {
                    leftMost: [],
                    leftColTop: [],
                    leftColBottom: [],
                    leftOfCenter: [],
                    center: [],
                    rightOfCenter: [],
                    rightColTop: [],
                    rightColBottom: [],
                    rightMost: [],
                },
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

    const handleAddCommunity = async (data: CommunityFormProps) => {
        try {
            const response = await fetch(`/api/admin/community-engagement`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in adding about", error);
        }
    };

    const fetchSustainabilityData = async () => {
        try {
            const response = await fetch(`/api/admin/community-engagement`);
            if (response.ok) {
                const data = await response.json();
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.items", data.data.firstSection.items);
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                setValue("fourthSection", data.data.fourthSection);
                setValue("fourthSection.items", data.data.fourthSection.items);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching about data", error);
        }
    };

    useEffect(() => {
        fetchSustainabilityData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddCommunity)}>
            {/*English Version */}
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label className="" main>
                        Banner
                    </Label>
                    <div className="p-5 rounded-md grid grid-cols-2 gap-5">
                        <div className="flex gap-1 flex-col">
                            <Label>Banner Image</Label>
                            <Controller
                                name="banner"
                                rules={{ required: "Banner is required" }}
                                control={control}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.banner?.message} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Page Title"
                                    {...register("pageTitle", { required: "Page title is required" })}
                                />
                                <FormError error={errors.pageTitle?.message} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Alt Tag</Label>
                                <Input
                                    type="text"
                                    placeholder="Alt Tag"
                                    {...register("bannerAlt", { required: "Alt tag is required" })}
                                />
                                <FormError error={errors.bannerAlt?.message} />
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("firstSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.title?.message} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="firstSection.description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                                <FormError error={errors.firstSection?.description?.message} />
                            </div>
                        </div>
                        <Label className="text-primary font-medium">
                            NB: The image layout is at the bottom of this page.
                        </Label>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.title", {
                                            required: "Title is required",
                                        })}
                                    />
                                    <FormError error={errors.secondSection?.title?.message} />
                                </div>
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {secondSectionItems.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                                <div className="absolute top-2 right-2">
                                                    <RiDeleteBinLine
                                                        onClick={() => secondSectionRemove(index)}
                                                        className="cursor-pointer text-red-600"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="title"
                                                            {...register(`secondSection.items.${index}.title`)}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.title?.message}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Description</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Description"
                                                            {...register(`secondSection.items.${index}.description`, {
                                                                required: "Description is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={
                                                                errors.secondSection?.items?.[index]?.description?.message
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Icon</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.icon`}
                                                        control={control}
                                                        rules={{ required: "Icon is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.icon && (
                                                        <p className="text-red-500">
                                                            {errors.secondSection?.items?.[index]?.icon?.message}
                                                        </p>
                                                    )}
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.iconAlt`)}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.iconAlt && (
                                                        <p className="text-red-500">
                                                            {errors.secondSection?.items?.[index]?.iconAlt?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.image?.message}
                                                    />
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.imageAlt`)}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.imageAlt?.message}
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
                                                    secondSectionAppend({
                                                        title: "",
                                                        title_ar: "",
                                                        description: "",
                                                        description_ar: "",
                                                        image: "",
                                                        imageAlt: "",
                                                        imageAlt_ar: "",
                                                        icon: "",
                                                        iconAlt: "",
                                                        iconAlt_ar: "",
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

                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register(`thirdSection.title`, {
                                        required: "Value is required",
                                    })}
                                />
                                <FormError error={errors.thirdSection?.title?.message} />
                            </div>
                        </div>

                        <Label>Items</Label>
                        <div className="border p-2 rounded-md">
                            {thirdSectionItems.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                >
                                    <div className="absolute top-2 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => thirdSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="pl-3 font-bold">Title</Label>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                {...register(`thirdSection.items.${index}.title`)}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.title?.message} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="pl-3 font-bold">Description</Label>
                                            <Controller
                                                name={`thirdSection.items.${index}.description`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea value={field.value} onChange={field.onChange} />
                                                )}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.description?.message} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`thirdSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.image?.message} />
                                        <Label className="font-bold">Image Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Alt Tag"
                                            {...register(`thirdSection.items.${index}.imageAlt`)}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.imageAlt?.message} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button
                                type="button"
                                addItem
                                onClick={() =>
                                    thirdSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                        image: "",
                                        imageAlt: "",
                                        imageAlt_ar: "",
                                    })
                                }
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("fourthSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.fourthSection?.title?.message} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItems.map((field, index) => (
                                    <div key={field.id} className="relative border-b pb-5 last:border-b-0">
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-4 w-full">
                                            {/* Title & Date — 2 columns */}
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fourthSection.items.${index}.title`, {
                                                            required: "Title is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.title?.message}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Date</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Date"
                                                        {...register(`fourthSection.items.${index}.date`, {
                                                            required: "Date is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.date?.message}
                                                    />
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fourthSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fourthSection?.items?.[index]?.image?.message} />
                                            </div>

                                            {/* Image Alt */}
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fourthSection.items.${index}.imageAlt`, {
                                                        required: "Alt tag is required",
                                                    })}
                                                />
                                                <FormError
                                                    error={errors.fourthSection?.items?.[index]?.imageAlt?.message}
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
                                        fourthSectionAppend({
                                            title: "",
                                            title_ar: "",
                                            date: "",
                                            image: "",
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

                <div className="flex flex-col gap-2">
                    <Label className="pl-3 font-bold">Meta Title</Label>
                    <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="pl-3 font-bold">Meta Description</Label>
                    <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                </div>
            </div>

            {/*Arabic Version */}
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label className="" main>
                        Banner
                    </Label>
                    <div className="p-5 rounded-md grid grid-cols-2 gap-5">
                        <div className="flex gap-1 flex-col">
                            <Label>Banner Image</Label>
                            <Controller
                                name="banner"
                                rules={{ required: "Banner is required" }}
                                control={control}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.banner?.message} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Page Title"
                                    {...register("pageTitle_ar", { required: "Page title is required" })}
                                />
                                <FormError error={errors.pageTitle_ar?.message} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Alt Tag</Label>
                                <Input
                                    type="text"
                                    placeholder="Alt Tag"
                                    {...register("bannerAlt_ar", { required: "Alt tag is required" })}
                                />
                                <FormError error={errors.bannerAlt_ar?.message} />
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("firstSection.title_ar", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.title_ar?.message} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="firstSection.description_ar"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                                <FormError error={errors.firstSection?.description_ar?.message} />
                            </div>
                        </div>
                        <Label className="text-primary font-medium">
                            NB: The image layout is at the bottom of this page.
                        </Label>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.title_ar", {
                                            required: "Title is required",
                                        })}
                                    />
                                    <FormError error={errors.secondSection?.title_ar?.message} />
                                </div>
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {secondSectionItems.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                                <div className="absolute top-2 right-2">
                                                    <RiDeleteBinLine
                                                        onClick={() => secondSectionRemove(index)}
                                                        className="cursor-pointer text-red-600"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="title"
                                                            {...register(`secondSection.items.${index}.title_ar`)}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.title_ar?.message}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Description</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Description"
                                                            {...register(`secondSection.items.${index}.description_ar`, {
                                                                required: "Description is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={
                                                                errors.secondSection?.items?.[index]?.description_ar?.message
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Icon</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.icon`}
                                                        control={control}
                                                        rules={{ required: "Icon is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                            <FormError error={errors.secondSection?.items?.[index]?.icon?.message} />
                                                
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.iconAlt_ar`)}
                                                    />
                                                    <FormError error={errors.secondSection?.items?.[index]?.iconAlt_ar?.message} />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.image?.message}
                                                    />
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.imageAlt_ar`)}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.imageAlt_ar?.message}
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
                                                    secondSectionAppend({
                                                        title: "",
                                                        title_ar: "",
                                                        description: "",
                                                        description_ar: "",
                                                        image: "",
                                                        imageAlt: "",
                                                        imageAlt_ar: "",
                                                        icon: "",
                                                        iconAlt: "",
                                                        iconAlt_ar: "",
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

                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register(`thirdSection.title_ar`, {
                                        required: "Value is required",
                                    })}
                                />
                                <FormError error={errors.thirdSection?.title_ar?.message} />
                            </div>
                        </div>

                        <Label>Items</Label>
                        <div className="border p-2 rounded-md">
                            {thirdSectionItems.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                >
                                    <div className="absolute top-2 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => thirdSectionRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="pl-3 font-bold">Title</Label>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                {...register(`thirdSection.items.${index}.title_ar`)}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.title_ar?.message} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="pl-3 font-bold">Description</Label>
                                            <Controller
                                                name={`thirdSection.items.${index}.description_ar`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Textarea value={field.value} onChange={field.onChange} />
                                                )}
                                            />
                                            <FormError error={errors.thirdSection?.items?.[index]?.description_ar?.message} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`thirdSection.items.${index}.image`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.image?.message} />
                                        <Label className="font-bold">Image Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Alt Tag"
                                            {...register(`thirdSection.items.${index}.imageAlt_ar`)}
                                        />
                                        <FormError error={errors.thirdSection?.items?.[index]?.imageAlt_ar?.message} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button
                                type="button"
                                addItem
                                onClick={() =>
                                    thirdSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                        image: "",
                                        imageAlt: "",
                                        imageAlt_ar: "",
                                    })
                                }
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("fourthSection.title_ar", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.fourthSection?.title_ar?.message} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItems.map((field, index) => (
                                    <div key={field.id} className="relative border-b pb-5 last:border-b-0">
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-4 w-full">
                                            {/* Title & Date — 2 columns */}
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fourthSection.items.${index}.title_ar`, {
                                                            required: "Title is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.title_ar?.message}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Date</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Date"
                                                        {...register(`fourthSection.items.${index}.date`, {
                                                            required: "Date is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.date?.message}
                                                    />
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fourthSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fourthSection?.items?.[index]?.image?.message} />
                                            </div>

                                            {/* Image Alt */}
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fourthSection.items.${index}.imageAlt_ar`, {
                                                        required: "Alt tag is required",
                                                    })}
                                                />
                                                <FormError
                                                    error={errors.fourthSection?.items?.[index]?.imageAlt_ar?.message}
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
                                        fourthSectionAppend({
                                            title: "",
                                            title_ar: "",
                                            date: "",
                                            image: "",
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

                <div className="flex flex-col gap-2">
                    <Label className="pl-3 font-bold">Meta Title</Label>
                    <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="pl-3 font-bold">Meta Description</Label>
                    <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                </div>
            </div>

            {/*First Section Image Layout */}
            <div className="col-span-2">
                <AdminItemContainer>
                    <Label main>First Section – Image Layout</Label>

                    <div className="grid grid-cols-7 gap-5 p-5 place-items-center">
                        {/* COL 1 — Left Most */}
                        <Controller
                            name="firstSection.items.leftMost"
                            control={control}
                            render={({ field }) => (
                                <ImageZone label={FIRST_SECTION_ZONES.leftMost.label} zoneKey="leftMost" field={field} />
                            )}
                        />

                        {/* COL 2 — Left Top + Bottom */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="firstSection.items.leftColTop"
                                control={control}
                                render={({ field }) => (
                                    <ImageZone
                                        label={FIRST_SECTION_ZONES.leftColTop.label}
                                        zoneKey="leftColTop"
                                        field={field}
                                    />
                                )}
                            />

                            <Controller
                                name="firstSection.items.leftColBottom"
                                control={control}
                                render={({ field }) => (
                                    <ImageZone
                                        label={FIRST_SECTION_ZONES.leftColBottom.label}
                                        zoneKey="leftColBottom"
                                        field={field}
                                    />
                                )}
                            />
                        </div>

                        {/* COL 3 — Left of Center */}
                        <Controller
                            name="firstSection.items.leftOfCenter"
                            control={control}
                            render={({ field }) => (
                                <ImageZone
                                    label={FIRST_SECTION_ZONES.leftOfCenter.label}
                                    zoneKey="leftOfCenter"
                                    field={field}
                                />
                            )}
                        />

                        {/* COL 4 — Center */}
                        <Controller
                            name="firstSection.items.center"
                            control={control}
                            render={({ field }) => (
                                <ImageZone label={FIRST_SECTION_ZONES.center.label} zoneKey="center" field={field} />
                            )}
                        />

                        {/* COL 5 — Right of Center */}
                        <Controller
                            name="firstSection.items.rightOfCenter"
                            control={control}
                            render={({ field }) => (
                                <ImageZone
                                    label={FIRST_SECTION_ZONES.rightOfCenter.label}
                                    zoneKey="rightOfCenter"
                                    field={field}
                                />
                            )}
                        />

                        {/* COL 6 — Right Top + Bottom */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="firstSection.items.rightColTop"
                                control={control}
                                render={({ field }) => (
                                    <ImageZone
                                        label={FIRST_SECTION_ZONES.rightColTop.label}
                                        zoneKey="rightColTop"
                                        field={field}
                                    />
                                )}
                            />

                            <Controller
                                name="firstSection.items.rightColBottom"
                                control={control}
                                render={({ field }) => (
                                    <ImageZone
                                        label={FIRST_SECTION_ZONES.rightColBottom.label}
                                        zoneKey="rightColBottom"
                                        field={field}
                                    />
                                )}
                            />
                        </div>

                        {/* COL 7 — Right Most */}
                        <Controller
                            name="firstSection.items.rightMost"
                            control={control}
                            render={({ field }) => (
                                <ImageZone label={FIRST_SECTION_ZONES.rightMost.label} zoneKey="rightMost" field={field} />
                            )}
                        />
                    </div>
                </AdminItemContainer>
            </div>

            <div className="flex col-span-2">
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full text-center">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default CommunityPage;
