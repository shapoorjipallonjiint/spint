"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { VideoUploader } from "@/components/ui/video-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";

interface SustainabilityFormProps {
    metaTitle: string;
    metaTitle_ar?: string;

    metaDescription: string;
    metaDescription_ar?: string;

    banner: string;
    bannerAlt?: string;
    bannerAlt_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;

    firstSection: {
        title: string;
        title_ar?: string;
        description: string;
        description_ar?: string;

        video: string;
        videoAlt: string;
        videoAlt_ar?: string;
        videoPosterImage?: string;
        videoPosterImageAlt?: string;
        videoPosterImageAlt_ar?: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;

        image: string;
        imageAlt: string;
        imageAlt_ar: string;

        items: {
            title: string;
            title_ar?: string;
            description: string;
            description_ar?: string;
            icon?: string;
            iconAlt: string;
            iconAlt_ar: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        items: {
            title?: string;
            title_ar?: string;
            description?: string;
            description_ar?: string;
            image?: string;
            imageAlt?: string;
            imageAlt_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;

        itemsOne: {
            title?: string;
            title_ar?: string;
            icon?: string;
            iconAlt?: string;
            iconAlt_ar?: string;
        }[];

        itemsTwo: {
            value: string;
            value_ar?: string;
            key: string;
            key_ar?: string;
        }[];
    };

    fifthSection: {
        title: string;
        title_ar?: string;

        items: {
            title: string;
            title_ar?: string;
            icon: string;
            iconAlt: string;
            iconAlt_ar: string;
            description: string;
            description_ar: string;
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
        }[];
    };
}

const SustainabilityPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<SustainabilityFormProps>();

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
        fields: fourthSectionItemsOne,
        append: fourthSectionAppendOne,
        remove: fourthSectionRemoveOne,
    } = useFieldArray({
        control,
        name: "fourthSection.itemsOne",
    });
    const {
        fields: fourthSectionItemsTwo,
        append: fourthSectionAppendTwo,
        remove: fourthSectionRemoveTwo,
    } = useFieldArray({
        control,
        name: "fourthSection.itemsTwo",
    });

    const {
        fields: fifthSectionItems,
        append: fifthSectionItemsAppend,
        remove: fifthSectionRemove,
    } = useFieldArray({
        control,
        name: "fifthSection.items",
    });

    const handleAddSustainability = async (data: SustainabilityFormProps) => {
        try {
            const response = await fetch(`/api/admin/sustainability`, {
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
            const response = await fetch(`/api/admin/sustainability`);
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
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                setValue("fourthSection", data.data.fourthSection);
                setValue("fourthSection.itemsOne", data.data.fourthSection.itemsOne);
                setValue("fourthSection.itemsTwo", data.data.fourthSection.itemsTwo);
                setValue("fifthSection", data.data.fifthSection);
                setValue("fifthSection.items", data.data.fifthSection.items);
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
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddSustainability)}>
            {/*English Version */}
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label className="" main>
                        Banner
                    </Label>
                    <div className="p-5 rounded-md grid grid-cols-2 gap-5">
                        <div>
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
                                <Label className="font-bold">Alt Tag</Label>
                                <Input type="text" placeholder="Alt Tag" {...register("bannerAlt")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input type="text" placeholder="Page Title" {...register("pageTitle")} />
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
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label className="text-sm font-bold">Video</Label>
                                        <Controller
                                            name="firstSection.video"
                                            control={control}
                                            rules={{ required: "Video is required" }}
                                            render={({ field }) => (
                                                <VideoUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <FormError error={errors.firstSection?.video?.message} />
                                    <Label className="font-bold">Video Alt Tag</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register("firstSection.videoAlt")} />
                                    <FormError error={errors.firstSection?.videoAlt?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Video Poster Image</Label>
                                    <Controller
                                        name="firstSection.videoPosterImage"
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.firstSection?.videoPosterImage?.message} />
                                    <Label className="font-bold">Video Poster Image Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="Alt Tag"
                                        {...register("firstSection.videoPosterImageAlt")}
                                    />
                                    <FormError error={errors.firstSection?.videoPosterImageAlt?.message} />
                                </div>
                            </div>
                        </div>
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
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Image</Label>
                                    <Controller
                                        name="secondSection.image"
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.secondSection?.image?.message} />
                                    <Label className="font-bold">Alt Tag</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register("secondSection.imageAlt")} />
                                    <FormError error={errors.secondSection?.imageAlt?.message} />
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
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.icon?.message}
                                                    />
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.iconAlt`)}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.iconAlt?.message}
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
                                                        description: "",
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
                                                render={({ field }) => {
                                                    return (
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    );
                                                }}
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
                                        description: "",
                                        title_ar: "",
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
                            <Label className="font-bold">First Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItemsOne.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemoveOne(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fourthSection.itemsOne.${index}.title`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.itemsOne?.[index]?.title?.message}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Icon</Label>
                                                <Controller
                                                    name={`fourthSection.itemsOne.${index}.icon`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fourthSection?.itemsOne?.[index]?.icon?.message} />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fourthSection.itemsOne.${index}.iconAlt`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.itemsOne?.[index]?.iconAlt?.message}
                                                    />
                                                </div>
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
                                        fourthSectionAppendOne({
                                            title: "",
                                            title_ar: "",
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
                        <div>
                            <Label className="font-bold">Second Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItemsTwo.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemoveTwo(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Value</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Value"
                                                        {...register(`fourthSection.itemsTwo.${index}.value`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.itemsTwo?.[index]?.value?.message}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`fourthSection.itemsTwo.${index}.key`, {
                                                        required: "Value is required",
                                                    })}
                                                />
                                                <FormError error={errors.fourthSection?.itemsTwo?.[index]?.key?.message} />
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
                                        fourthSectionAppendTwo({
                                            value: "",
                                            value_ar: "",
                                            key: "",
                                            key_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fifth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("fifthSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.fifthSection?.title?.message} />
                            </div>
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fifthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fifthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Value"
                                                        {...register(`fifthSection.items.${index}.title`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fifthSection?.items?.[index]?.title?.message}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Icon</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.icon`}
                                                    control={control}
                                                    rules={{ required: "Icon is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.icon?.message} />
                                                <Label className="font-bold">Icon Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.iconAlt`)}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.iconAlt?.message} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Description</Label>
                                                <Textarea
                                                    placeholder="Description"
                                                    {...register(`fifthSection.items.${index}.description`, {
                                                        required: "Description is required",
                                                    })}
                                                />
                                                <FormError
                                                    error={errors.fifthSection?.items?.[index]?.description?.message}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.image?.message} />
                                                <Label className="font-bold">Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.imageAlt`)}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.imageAlt?.message} />
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
                                        fifthSectionItemsAppend({
                                            title: "",
                                            title_ar: "",
                                            icon: "",
                                            iconAlt: "",
                                            iconAlt_ar: "",
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
                        <div>
                            <Controller
                                name="banner"
                                control={control}
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Alt Tag</Label>
                                <Input type="text" placeholder="Alt Tag" {...register("bannerAlt_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input type="text" placeholder="Page Title" {...register("pageTitle_ar")} />
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
                                <Input type="text" placeholder="Title" {...register("firstSection.title_ar")} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="firstSection.description_ar"
                                    control={control}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label className="text-sm font-bold">Video</Label>
                                        <Controller
                                            name="firstSection.video"
                                            control={control}
                                            render={({ field }) => (
                                                <VideoUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    {errors.firstSection?.video && (
                                        <p className="text-red-500">{errors.firstSection?.video.message}</p>
                                    )}
                                    <Label className="font-bold">Video Alt Tag</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register("firstSection.videoAlt_ar")} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Video Poster Image</Label>
                                    <Controller
                                        name="firstSection.videoPosterImage"
                                        control={control}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <Label className="font-bold">Video Poster Image Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="Alt Tag"
                                        {...register("firstSection.videoPosterImageAlt_ar")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Title</Label>
                                    <Input type="text" placeholder="Title" {...register("secondSection.title_ar")} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Image</Label>
                                    <Controller
                                        name="secondSection.image"
                                        control={control}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    {errors.secondSection?.image && (
                                        <p className="text-red-500">{errors.secondSection?.image.message}</p>
                                    )}
                                    <Label className="font-bold">Alt Tag</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register("secondSection.imageAlt_ar")} />
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
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Description</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Description"
                                                            {...register(`secondSection.items.${index}.description_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Icon</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.icon`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.iconAlt_ar`)}
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
                                                        description: "",
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
                                <Input type="text" placeholder="Title" {...register(`thirdSection.title_ar`)} />
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
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label className="pl-3 font-bold">Description</Label>
                                            <Controller
                                                name={`thirdSection.items.${index}.description_ar`}
                                                control={control}
                                                render={({ field }) => {
                                                    return (
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`thirdSection.items.${index}.image`}
                                            control={control}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <Label className="font-bold">Image Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Alt Tag"
                                            {...register(`thirdSection.items.${index}.imageAlt_ar`)}
                                        />
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
                                        description: "",
                                        title_ar: "",
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
                                <Input type="text" placeholder="Title" {...register("fourthSection.title_ar")} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">First Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItemsOne.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemoveOne(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fourthSection.itemsOne.${index}.title_ar`)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Icon</Label>
                                                <Controller
                                                    name={`fourthSection.itemsOne.${index}.icon`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Icon Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fourthSection.itemsOne.${index}.iconAlt_ar`)}
                                                    />
                                                </div>
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
                                        fourthSectionAppendOne({
                                            title: "",
                                            title_ar: "",
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
                        <div>
                            <Label className="font-bold">Second Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItemsTwo.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemoveTwo(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Value</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Value"
                                                        {...register(`fourthSection.itemsTwo.${index}.value_ar`)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`fourthSection.itemsTwo.${index}.key_ar`)}
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
                                        fourthSectionAppendTwo({
                                            value: "",
                                            value_ar: "",
                                            key: "",
                                            key_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fifth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("fifthSection.title_ar")} />
                            </div>
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fifthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fifthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Value"
                                                        {...register(`fifthSection.items.${index}.title_ar`)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Icon</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.icon`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <Label className="font-bold">Icon Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.iconAlt_ar`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Description</Label>
                                                <Textarea
                                                    placeholder="Description"
                                                    {...register(`fifthSection.items.${index}.description_ar`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <Label className="font-bold">Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.imageAlt_ar`)}
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
                                        fifthSectionItemsAppend({
                                            title: "",
                                            title_ar: "",
                                            icon: "",
                                            iconAlt: "",
                                            iconAlt_ar: "",
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

            <div className="flex col-span-2">
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full text-center">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default SustainabilityPage;
