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
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { toast } from "sonner";

interface CareerFormProps {
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

        button: {
            text: string;
            text_ar?: string;
            link: string;
            link_ar: string;
        };

        items: {
            image?: string;
        }[];
    };

    secondSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        items: {
            key: string;
            key_ar?: string;
            value: string;
            value_ar?: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        items: {
            title: string;
            title_ar?: string;
            image: string;
            imageAlt: string;
            imageAlt_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        image: string;
        imageAlt?: string;
        imageAlt_ar?: string;
    };

    fifthSection: {
        title: string;
        title_ar?: string;

        items: {
            name: string;
            name_ar?: string;
            designation: string;
            designation_ar?: string;

            video?: string;
            videoAlt?: string;
            videoAlt_ar?: string;

            videoPosterImage: string;
            videoPosterImageAlt?: string;
            videoPosterImageAlt_ar?: string;
        }[];
    };

    sixthSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        image: string;
        imageAlt: string;
        imageAlt_ar?: string;

        button: {
            text: string;
            text_ar?: string;
            btnLink: string;
            btnLink_ar: string;
        };
    };
}

const SustainabilityPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CareerFormProps>();

    const {
        fields: firstSectionItems,
        append: firstSectionAppend,
        remove: firstSectionRemove,
    } = useFieldArray({
        control,
        name: "firstSection.items",
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
        fields: fifthSectionItems,
        append: fifthSectionItemsAppend,
        remove: fifthSectionRemove,
    } = useFieldArray({
        control,
        name: "fifthSection.items",
    });

    const handleAddCareers = async (data: CareerFormProps) => {
        try {
            const response = await fetch(`/api/admin/careers`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in adding about", error);
            toast.error("Failed to save careers data");
        }
    };

    const fetchCareerMainPageData = async () => {
        try {
            const response = await fetch(`/api/admin/careers`);
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
                setValue("fifthSection", data.data.fifthSection);
                setValue("fifthSection.items", data.data.fifthSection.items);
                setValue("sixthSection", data.data.sixthSection);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error in fetching about data", error);
            toast.error("Failed to fetch careers data");
        }
    };

    useEffect(() => {
        fetchCareerMainPageData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddCareers)}>
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
                                <FormError error={errors?.pageTitle?.message} />
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
                            <div className="flex w-full gap-2">
                                <div className="w-1/2">
                                    <Label className="text-sm font-bold">Button Text</Label>
                                    <Input
                                        type="text"
                                        placeholder="Button Text"
                                        {...register("firstSection.button.text", {
                                            required: "Button text is required",
                                        })}
                                    />
                                    <FormError error={errors.firstSection?.button?.text?.message} />
                                </div>
                                <div className="w-1/2">
                                    <Label className="text-sm font-bold">Button Link</Label>
                                    <Input
                                        type="text"
                                        placeholder="Button Link"
                                        {...register("firstSection.button.link")}
                                    />
                                    <FormError error={errors.firstSection?.button?.link?.message} />
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Images</Label>
                                <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                    {firstSectionItems.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                            <div className="absolute top-2 right-2">
                                                <RiDeleteBinLine
                                                    onClick={() => firstSectionRemove(index)}
                                                    className="cursor-pointer text-red-600"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Images</Label>
                                                <Controller
                                                    name={`firstSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.firstSection?.items?.[index]?.image?.message} />
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
                                                })
                                            }
                                        >
                                            Add Image
                                        </Button>
                                    </div>
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
                                <div>
                                    <Label className="text-sm font-bold">Description</Label>
                                    <Controller
                                        name="secondSection.description"
                                        control={control}
                                        rules={{ required: "Description is required" }}
                                        render={({ field }) => {
                                            return <Textarea value={field.value} onChange={field.onChange} />;
                                        }}
                                    />
                                    <FormError error={errors.secondSection?.description?.message} />
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
                                                        <Label className="font-bold">Key</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Key"
                                                            {...register(`secondSection.items.${index}.key`, {
                                                                required: "Key is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.key?.message}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Value</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Value"
                                                            {...register(`secondSection.items.${index}.value`, {
                                                                required: "Value is required",
                                                            })}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.value?.message}
                                                        />
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
                                                    secondSectionAppend({
                                                        key: "",
                                                        key_ar: "",
                                                        value: "",
                                                        value_ar: "",
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
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                placeholder="Description"
                                {...register("fourthSection.description", {
                                    required: "Description is required",
                                })}
                            />
                            <FormError error={errors.fourthSection?.description?.message} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Image</Label>
                            <Controller
                                name={`fourthSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.fourthSection?.image?.message} />
                            <Label className="font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Alt Tag" {...register(`fourthSection.imageAlt`)} />
                            <FormError error={errors.fourthSection?.imageAlt?.message} />
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
                                                <Label className="font-bold">Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Name"
                                                    {...register(`fifthSection.items.${index}.name`, {
                                                        required: "Name is required",
                                                    })}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.name?.message} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Designation</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Designation"
                                                    {...register(`fifthSection.items.${index}.designation`, {
                                                        required: "Designation is required",
                                                    })}
                                                />
                                                <FormError
                                                    error={errors.fifthSection?.items?.[index]?.designation?.message}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Video</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.video`}
                                                    control={control}
                                                    rules={{ required: "Video is required" }}
                                                    render={({ field }) => (
                                                        <VideoUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.video?.message} />
                                                <Label className="font-bold">Video Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.videoAlt`)}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.videoAlt?.message} />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Video Poster Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.videoPosterImage`}
                                                    control={control}
                                                    rules={{ required: "Video poster image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError
                                                    error={errors.fifthSection?.items?.[index]?.videoPosterImage?.message}
                                                />
                                                <Label className="font-bold">Video Poster Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.videoPosterImageAlt`)}
                                                />
                                                <FormError
                                                    error={
                                                        errors.fifthSection?.items?.[index]?.videoPosterImageAlt?.message
                                                    }
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
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            video: "",
                                            videoAlt: "",
                                            videoAlt_ar: "",
                                            videoPosterImage: "",
                                            videoPosterImageAlt: "",
                                            videoPosterImageAlt_ar: "",
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
                    <Label main>Sixth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Title"
                                {...register("sixthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.sixthSection?.title?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                placeholder="Description"
                                {...register("sixthSection.description", {
                                    required: "Description is required",
                                })}
                            />
                            <FormError error={errors.sixthSection?.description?.message} />
                        </div>
                        <div className="flex w-full gap-2">
                            <div className="w-1/2">
                                <Label className="text-sm font-bold">Button Text</Label>
                                <Input type="text" placeholder="Button Text" {...register("sixthSection.button.text")} />
                            </div>
                            <div className="w-1/2">
                                <Label className="text-sm font-bold">Button Link</Label>
                                <Input type="text" placeholder="Button Link" {...register("sixthSection.button.btnLink")} />
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
                                rules={{ required: "Banner is required" }}
                                control={control}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.banner?.message} />
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
                            <div className="flex w-full gap-2">
                                <div className="w-1/2">
                                    <Label className="text-sm font-bold">Button Text</Label>
                                    <Input
                                        type="text"
                                        placeholder="Button Text"
                                        {...register("firstSection.button.text_ar")}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <Label className="text-sm font-bold">Button Link</Label>
                                    <Input
                                        type="text"
                                        placeholder="Button Link"
                                        {...register("firstSection.button.link_ar")}
                                    />
                                </div>
                            </div>
                            <div className="opacity-50">
                                <Label className="text-sm font-bold">Images</Label>
                                <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                    {firstSectionItems.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                            <div className="absolute top-2 right-2">
                                                <RiDeleteBinLine
                                                    onClick={() => firstSectionRemove(index)}
                                                    className="cursor-pointer text-red-600"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Images</Label>
                                                <Controller
                                                    name={`firstSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.firstSection?.items?.[index]?.image?.message} />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-end">
                                        <Button
                                            disabled
                                            type="button"
                                            className=""
                                            addItem
                                            onClick={() =>
                                                firstSectionAppend({
                                                    image: "",
                                                })
                                            }
                                        >
                                            Add Image
                                        </Button>
                                    </div>
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
                                <div>
                                    <Label className="text-sm font-bold">Description</Label>
                                    <Controller
                                        name="secondSection.description_ar"
                                        control={control}
                                        render={({ field }) => {
                                            return <Textarea value={field.value} onChange={field.onChange} />;
                                        }}
                                    />
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
                                                        <Label className="font-bold">Key</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Key"
                                                            {...register(`secondSection.items.${index}.key_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Value</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Value"
                                                            {...register(`secondSection.items.${index}.value_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                disabled
                                                className=""
                                                addItem
                                                onClick={() =>
                                                    secondSectionAppend({
                                                        key: "",
                                                        key_ar: "",
                                                        value: "",
                                                        value_ar: "",
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
                                disabled
                                addItem
                                onClick={() =>
                                    thirdSectionAppend({
                                        title: "",
                                        title_ar: "",
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
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Title</Label>
                            <Input type="text" placeholder="Title" {...register("fourthSection.title_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea placeholder="Description" {...register("fourthSection.description_ar")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Image</Label>
                            <Controller
                                name={`fourthSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.fourthSection?.image?.message} />
                            <Label className="font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Alt Tag" {...register(`fourthSection.imageAlt_ar`)} />
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
                                                <Label className="font-bold">Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Name"
                                                    {...register(`fifthSection.items.${index}.name_ar`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Designation</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Designation"
                                                    {...register(`fifthSection.items.${index}.designation_ar`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Video</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.video`}
                                                    control={control}
                                                    rules={{ required: "Video is required" }}
                                                    render={({ field }) => (
                                                        <VideoUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.fifthSection?.items?.[index]?.video?.message} />
                                                <Label className="font-bold">Video Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.videoAlt_ar`)}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Video Poster Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.videoPosterImage`}
                                                    control={control}
                                                    rules={{ required: "Video poster image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError
                                                    error={errors.fifthSection?.items?.[index]?.videoPosterImage?.message}
                                                />
                                                <Label className="font-bold">Video Poster Image Alt Tag</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Alt Tag"
                                                    {...register(`fifthSection.items.${index}.videoPosterImageAlt_ar`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    disabled
                                    addItem
                                    onClick={() =>
                                        fifthSectionItemsAppend({
                                            name: "",
                                            name_ar: "",
                                            designation: "",
                                            designation_ar: "",
                                            video: "",
                                            videoAlt: "",
                                            videoAlt_ar: "",
                                            videoPosterImage: "",
                                            videoPosterImageAlt: "",
                                            videoPosterImageAlt_ar: "",
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
                    <Label main>Sixth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Title"
                                {...register("sixthSection.title_ar")}
                            />
                            <FormError error={errors.sixthSection?.title_ar?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                placeholder="Description"
                                {...register("sixthSection.description_ar")}
                            />
                            <FormError error={errors.sixthSection?.description_ar?.message} />
                        </div>
                        <div className="flex w-full gap-2">
                            <div className="w-1/2">
                                <Label className="text-sm font-bold">Button Text</Label>
                                <Input type="text" placeholder="Button Text" {...register("sixthSection.button.text_ar")} />
                            </div>
                            <div className="w-1/2">
                                <Label className="text-sm font-bold">Button Link</Label>
                                <Input type="text" placeholder="Button Link" {...register("sixthSection.button.btnLink_ar")} />
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

            {/* Submit Btn */}
            <div className="flex col-span-2">
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full text-center">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default SustainabilityPage;
