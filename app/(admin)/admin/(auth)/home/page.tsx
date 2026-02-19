"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { VideoUploader } from "@/components/ui/video-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { toast } from "sonner";
import Link from "next/link";

interface HomeFormProps {
    metaTitle: string;
    metaTitle_ar?: string;

    metaDescription: string;
    metaDescription_ar?: string;

    firstSection: {
        title: string;
        title_ar?: string;

        subTitle: {
            text?: string;
            text_ar?: string;
            link?: string;
            link_ar?: string;
        };

        video: string;
        videoAlt: string;
        videoAlt_ar: string;

        videoPosterImage?: string;
        videoPosterImageAlt?: string;
        videoPosterImageAlt_ar?: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;

        subTitle?: string;
        subTitle_ar?: string;

        description?: string;
        description_ar?: string;

        image?: string;
        imageAlt?: string;
        imageAlt_ar?: string;

        video?: string;
        videoAlt?: string;
        videoAlt_ar?: string;

        videoPosterImage?: string;
        videoPosterImageAlt?: string;
        videoPosterImageAlt_ar?: string;

        items: {
            key?: string;
            key_ar?: string;
            value?: string;
            value_ar?: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        link?: string;
        link_ar?: string;

        image: string;
        imageAlt: string;
        imageAlt_ar?: string;

        items: {
            key?: string;
            key_ar?: string;
            value?: string;
            value_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;
    };

    fifthSection: {
        title: string;
        title_ar?: string;
        items: {
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
            logo: string;
            logoAlt: string;
            logoAlt_ar: string;
            completedProjects: string;
            ongoingProjects: string;
            completedProjects_ar: string;
            ongoingProjects_ar: string;
            title: string;
            title_ar: string;
        }[];
    };

    sixthSection: {
        title: string;
        title_ar?: string;

        cities: {
            id?: string;
            name?: string;
            name_ar?: string;
            left?: string;
            top?: string;
            completedProjects?: string;
            employees?: string;
        }[];
    };

    seventhSection: {
        title?: string;
        title_ar?: string;

        image?: string;
        imageAlt?: string;
        imageAlt_ar?: string;

        items: {
            title?: string;
            title_ar?: string;
            description?: string;
            description_ar?: string;
        }[];

        button?: {
            text?: string;
            text_ar?: string;
            link?: string;
            link_ar?: string;
        };
    };
}

const Home = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<HomeFormProps>();

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
        append: fifthSectionAppend,
        remove: fifthSectionRemove,
    } = useFieldArray({
        control,
        name: "fifthSection.items",
    });

    // const {
    //     fields: sixthSectionCities,
    //     append: sixthSectionCitiesAppend,
    //     remove: sixthSectionCitiesRemove,
    // } = useFieldArray({
    //     control,
    //     name: "sixthSection.cities",
    // });

    const {
        fields: seventhSectionItems,
        append: seventhSectionAppend,
        remove: seventhSectionRemove,
    } = useFieldArray({
        control,
        name: "seventhSection.items",
    });

    const handleAddHome = async (data: HomeFormProps) => {
        try {
            const response = await fetch(`/api/admin/home`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
            }
        } catch (error) {
            console.log("Error in adding home", error);
            toast.error("Failed to update home data");
        }
    };

    const fetchHomeData = async () => {
        try {
            const response = await fetch(`/api/admin/home`);
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaDescription", data.data.metaDescription);
                setValue("firstSection", data.data.firstSection);
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                setValue("fourthSection", data.data.fourthSection);
                setValue("fifthSection", data.data.fifthSection);
                setValue("fifthSection.items", data.data.fifthSection.items);
                setValue("sixthSection", data.data.sixthSection);
                // setValue("sixthSection.cities", data.data.sixthSection.cities);
                setValue("seventhSection", data.data.seventhSection);
                setValue("seventhSection.items", data.data.seventhSection.items);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in fetching home data", error);
            toast.error("Failed to fetch home data");
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddHome)}>
            {/* English Version */}
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label className="" main>
                        First Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className="">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("firstSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.title?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Text</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("firstSection.subTitle.text", {
                                    required: "Sub Title Text is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.subTitle?.text?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Link</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("firstSection.subTitle.link", {
                                    required: "Sub Title Link is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.subTitle?.link?.message} />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video</Label>
                                    <Controller
                                        name={`firstSection.video`}
                                        control={control}
                                        rules={{ required: "Video is required" }}
                                        render={({ field }) => (
                                            <VideoUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.firstSection?.video?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className=" font-bold">Video Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Video Alt Tag"
                                            {...register(`firstSection.videoAlt`)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Poster Image</Label>
                                    <Controller
                                        name={`firstSection.videoPosterImage`}
                                        control={control}
                                        rules={{ required: "PosterImage is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.firstSection?.videoPosterImage?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">PosterImage Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="PosterImage Alt Tag"
                                        {...register(`firstSection.videoPosterImageAlt`)}
                                    />
                                    <FormError error={errors.firstSection?.videoPosterImageAlt?.message} />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Second Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("secondSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.title?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("secondSection.subTitle", {
                                    required: "Sub Title is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.subTitle?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`secondSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.secondSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`secondSection.imageAlt`)} />
                                <FormError error={errors.secondSection?.imageAlt?.message} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea
                                placeholder="Description"
                                {...register("secondSection.description", {
                                    required: "Description is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.description?.message} />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video</Label>
                                    <Controller
                                        name={`secondSection.video`}
                                        control={control}
                                        rules={{ required: "Video is required" }}
                                        render={({ field }) => (
                                            <VideoUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.secondSection?.video?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className=" font-bold">Video Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Video Alt Tag"
                                            {...register(`secondSection.videoAlt`)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video Poster Image</Label>
                                    <Controller
                                        name={`secondSection.videoPosterImage`}
                                        control={control}
                                        rules={{ required: "PosterImage is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.secondSection?.videoPosterImage?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">PosterImage Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="PosterImage Alt Tag"
                                        {...register(`secondSection.videoPosterImageAlt`)}
                                    />
                                    <FormError error={errors.secondSection?.videoPosterImageAlt?.message} />
                                </div>
                            </div>
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
                                                <FormError error={errors.secondSection?.items?.[index]?.key?.message} />
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
                                                <FormError error={errors.secondSection?.items?.[index]?.value?.message} />
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
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Third Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("thirdSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.title?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`thirdSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.thirdSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`thirdSection.imageAlt`)} />
                                <FormError error={errors.thirdSection?.imageAlt?.message} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Link</Label>
                            <Input
                                type="text"
                                placeholder="Link"
                                {...register("thirdSection.link", {
                                    required: "Link is required",
                                })}
                            />
                            <FormError error={errors.thirdSection?.link?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Description</Label>
                            <Textarea
                                placeholder="Description"
                                {...register("thirdSection.description", {
                                    required: "Description is required",
                                })}
                            />
                            <FormError error={errors.thirdSection?.description?.message} />
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                {thirdSectionItems.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Textarea

                                                    placeholder="Key"
                                                    {...register(`thirdSection.items.${index}.key`, {
                                                        required: "Key is required",
                                                    })}
                                                />
                                                <FormError error={errors.thirdSection?.items?.[index]?.key?.message} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`thirdSection.items.${index}.value`, {
                                                        required: "Value is required",
                                                    })}
                                                />
                                                <FormError error={errors.thirdSection?.items?.[index]?.value?.message} />
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
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fourth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("fourthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.fourthSection?.title?.message} />
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fifth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("fifthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.fifthSection?.title?.message} />
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
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.imageAlt`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.imageAlt && (
                                                        <p className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.imageAlt.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Logo</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.logo`}
                                                    control={control}
                                                    rules={{ required: "Logo is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.logo && (
                                                    <p className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.logo.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.logoAlt`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.logoAlt && (
                                                        <p className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.logoAlt.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.title`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.title && (
                                                        <p className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.title.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Completed Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.completedProjects`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.completedProjects && (
                                                        <p className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.completedProjects.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Ongoing Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Ongoing Projects"
                                                        {...register(`fifthSection.items.${index}.ongoingProjects`)}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.ongoingProjects && (
                                                        <p className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.ongoingProjects.message}
                                                        </p>
                                                    )}
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
                                        fifthSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            logo: "",
                                            logoAlt: "",
                                            logoAlt_ar: "",
                                            completedProjects: "",
                                            ongoingProjects: "",
                                            completedProjects_ar: "",
                                            ongoingProjects_ar: "",
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
                    <Label className="" main>
                        Sixth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("sixthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.sixthSection?.title?.message} />
                        </div>
                    </div>
                    {/* <div className="px-5 pb-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-5 rounded-md flex flex-col gap-5 mt-0.5">
                            {sixthSectionCities.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 p-2 relative border-b pb-5">
                                    <div className="absolute top-2 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => sixthSectionCitiesRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">ID (name)</Label>
                                        <Input
                                            type="text"
                                            placeholder="ID (name)"
                                            {...register(`sixthSection.cities.${index}.id`, {
                                                required: "ID (name) is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.id?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Name"
                                            {...register(`sixthSection.cities.${index}.name`, {
                                                required: "Name is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.name?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Left (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Left coordinate"
                                            {...register(`sixthSection.cities.${index}.left`, {
                                                required: "Left coordinate is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.left?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Top (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Top coordinate"
                                            {...register(`sixthSection.cities.${index}.top`, {
                                                required: "Top coordinate is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.top?.message} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Iconic Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Iconic projects"
                                            {...register(`sixthSection.cities.${index}.iconicProjects`, {
                                                required: "Iconic projects is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.iconicProjects?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Completed Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Completed projects"
                                            {...register(`sixthSection.cities.${index}.completedProjects`, {
                                                required: "Completed projects is required",
                                            })}
                                        />
                                        <FormError
                                            error={errors.sixthSection?.cities?.[index]?.completedProjects?.message}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Dedicated Employees</Label>
                                        <Input
                                            type="text"
                                            placeholder="Dedicated employees"
                                            {...register(`sixthSection.cities.${index}.dedicatedEmployees`, {
                                                required: "Dedicated employees is required",
                                            })}
                                        />
                                        <FormError
                                            error={errors.sixthSection?.cities?.[index]?.dedicatedEmployees?.message}
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
                                        sixthSectionCitiesAppend({
                                            id: "",
                                            name: "",
                                            name_ar: "",
                                            left: "",
                                            top: "",
                                            iconicProjects: "",
                                            completedProjects: "",
                                            dedicatedEmployees: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex justify-end p-5">
                        <Link href="/admin/home/map-locations">
                            <Button className="bg-black text-white">Manage Map Locations</Button>
                        </Link>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Seventh Section
                    </Label>
                    <div className="px-5 pt-2 flex flex-col gap-2">
                        <Label className=" font-bold">Title</Label>
                        <Textarea
                            placeholder="Title"
                            {...register("seventhSection.title", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.seventhSection?.title?.message} />
                    </div>
                    <div className="flex gap-4 px-5">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image</Label>
                            <Controller
                                name={`seventhSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.seventhSection?.image?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Image Alt Tag" {...register(`seventhSection.imageAlt`)} />
                            <FormError error={errors.seventhSection?.imageAlt?.message} />
                        </div>
                    </div>
                    <div className="flex px-5 pt-2 pb-2 w-full gap-4 justify-between">
                        <div className="flex flex-col gap-2 w-full">
                            <Label className=" font-bold">Button Text</Label>
                            <Input
                                type="text"
                                placeholder="Button Text"
                                {...register("seventhSection.button.text", {
                                    required: "Button text is required",
                                })}
                            />
                            <FormError error={errors.seventhSection?.button?.text?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Label className="font-bold">Button Link</Label>
                            <Input
                                type="text"
                                placeholder="Button Link"
                                {...register("seventhSection.button.link", {
                                    required: "Button link is required",
                                })}
                            />
                            <FormError error={errors.seventhSection?.button?.link?.message} />
                        </div>
                    </div>
                    <Label className="mx-5 font-bold">Items</Label>
                    <div className="border m-5 p-2 rounded-md flex flex-col gap-5 mt-0.5">
                        {seventhSectionItems.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b pb-5">
                                <div className="absolute top-2 right-2">
                                    <RiDeleteBinLine
                                        onClick={() => seventhSectionRemove(index)}
                                        className="cursor-pointer text-red-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register(`seventhSection.items.${index}.title`, {
                                            required: "Title is required",
                                        })}
                                    />
                                    <FormError error={errors.seventhSection?.items?.[index]?.title?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Description"
                                        {...register(`seventhSection.items.${index}.description`, {
                                            required: "Description is required",
                                        })}
                                    />
                                    <FormError error={errors.seventhSection?.items?.[index]?.description?.message} />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                className=""
                                addItem
                                onClick={() =>
                                    seventhSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                    })
                                }
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Title</Label>
                    <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Description</Label>
                    <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                </div>
            </div>

            {/* Arabic Version */}
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label className="" main>
                        First Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("firstSection.title_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Text</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title Text"
                                {...register("firstSection.subTitle.text_ar")}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Link</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title Link"
                                {...register("firstSection.subTitle.link_ar")}
                            />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video</Label>
                                    <Controller
                                        name={`firstSection.video`}
                                        control={control}
                                        rules={{ required: "Video is required" }}
                                        render={({ field }) => (
                                            <VideoUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.firstSection?.video?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className=" font-bold">Video Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Video Alt Tag"
                                            {...register(`firstSection.videoAlt_ar`)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Poster Image</Label>
                                    <Controller
                                        name={`firstSection.videoPosterImage`}
                                        control={control}
                                        rules={{ required: "PosterImage is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">PosterImage Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="PosterImage Alt Tag"
                                        {...register(`firstSection.videoPosterImageAlt_ar`)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Second Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("secondSection.title_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title</Label>
                            <Input type="text" placeholder="Sub Title" {...register("secondSection.subTitle_ar")} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`secondSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.secondSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`secondSection.imageAlt_ar`)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Description</Label>
                            <Textarea placeholder="Description" {...register("secondSection.description_ar")} />
                        </div>
                        <div className="flex gap-4 justify-between">
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video</Label>
                                    <Controller
                                        name={`secondSection.video`}
                                        control={control}
                                        rules={{ required: "Video is required" }}
                                        render={({ field }) => (
                                            <VideoUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.secondSection?.video?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className=" font-bold">Video Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Video Alt Tag"
                                            {...register(`secondSection.videoAlt_ar`)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">Video Poster Image</Label>
                                    <Controller
                                        name={`secondSection.videoPosterImage`}
                                        control={control}
                                        rules={{ required: "PosterImage is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FormError error={errors.secondSection?.videoPosterImage?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className=" font-bold">PosterImage Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="PosterImage Alt Tag"
                                        {...register(`secondSection.videoPosterImageAlt_ar`)}
                                    />
                                </div>
                            </div>
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
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Third Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("thirdSection.title_ar")} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`thirdSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.thirdSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`thirdSection.imageAlt_ar`)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Link</Label>
                            <Input type="text" placeholder="Link" {...register("thirdSection.link_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Description</Label>
                            <Textarea placeholder="Description" {...register("thirdSection.description_ar")} />
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                {thirdSectionItems.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Key"
                                                    {...register(`thirdSection.items.${index}.key_ar`)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`thirdSection.items.${index}.value_ar`)}
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
                                            thirdSectionAppend({
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
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fourth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("fourthSection.title_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fifth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("fifthSection.title_ar")} />
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
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.imageAlt_ar`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Logo</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.logo`}
                                                    control={control}
                                                    rules={{ required: "Logo is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.logo && (
                                                    <p className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.logo.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.logoAlt_ar`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.title_ar`)}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Completed Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.completedProjects_ar`)}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Ongoing Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Ongoing Projects"
                                                        {...register(`fifthSection.items.${index}.ongoingProjects_ar`)}
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
                                        fifthSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            logo: "",
                                            logoAlt: "",
                                            logoAlt_ar: "",
                                            completedProjects: "",
                                            ongoingProjects: "",
                                            completedProjects_ar: "",
                                            ongoingProjects_ar: "",
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
                    <Label className="" main>
                        Sixth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("sixthSection.title_ar")} />
                        </div>
                    </div>
                    {/* <div className="px-5 pb-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-5 rounded-md flex flex-col gap-5 mt-0.5">
                            {sixthSectionCities.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 p-2 relative border-b pb-5">
                                    <div className="absolute top-2 right-2">
                                        <RiDeleteBinLine
                                            onClick={() => sixthSectionCitiesRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">ID (name)</Label>
                                        <Input
                                            type="text"
                                            placeholder="ID (name)"
                                            {...register(`sixthSection.cities.${index}.id`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Name"
                                            {...register(`sixthSection.cities.${index}.name_ar`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Left (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Left coordinate"
                                            {...register(`sixthSection.cities.${index}.left`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Top (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Top coordinate"
                                            {...register(`sixthSection.cities.${index}.top`)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Iconic Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Iconic projects"
                                            {...register(`sixthSection.cities.${index}.iconicProjects`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Completed Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Completed projects"
                                            {...register(`sixthSection.cities.${index}.completedProjects`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Dedicated Employees</Label>
                                        <Input
                                            type="text"
                                            placeholder="Dedicated employees"
                                            {...register(`sixthSection.cities.${index}.dedicatedEmployees`)}
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
                                        sixthSectionCitiesAppend({
                                            id: "",
                                            name: "",
                                            name_ar: "",
                                            left: "",
                                            top: "",
                                            iconicProjects: "",
                                            completedProjects: "",
                                            dedicatedEmployees: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex justify-end p-5">
                        <Link href="/admin/home/map-locations">
                            <Button className="bg-black text-white">Manage Map Locations</Button>
                        </Link>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Seventh Section
                    </Label>
                    <div className="px-5 pt-2 flex flex-col gap-2">
                        <Label className=" font-bold">Title</Label>
                        <Textarea placeholder="Title" {...register("seventhSection.title_ar")} />
                    </div>
                    <div className="flex gap-4 px-5">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image</Label>
                            <Controller
                                name={`seventhSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.seventhSection?.image?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Image Alt Tag" {...register(`seventhSection.imageAlt_ar`)} />
                        </div>
                    </div>
                    <div className="flex px-5 pt-2 pb-2 w-full gap-4 justify-between">
                        <div className="flex flex-col gap-2 w-full">
                            <Label className=" font-bold">Button Text</Label>
                            <Input type="text" placeholder="Button Text" {...register("seventhSection.button.text_ar")} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Label className="font-bold">Button Link</Label>
                            <Input type="text" placeholder="Button Link" {...register("seventhSection.button.link_ar")} />
                        </div>
                    </div>
                    <Label className="mx-5 font-bold">Items</Label>
                    <div className="border m-5 p-2 rounded-md flex flex-col gap-5 mt-0.5">
                        {seventhSectionItems.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-2 gap-4 relative border-b pb-5">
                                <div className="absolute top-2 right-2">
                                    <RiDeleteBinLine
                                        onClick={() => seventhSectionRemove(index)}
                                        className="cursor-pointer text-red-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register(`seventhSection.items.${index}.title_ar`)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Description"
                                        {...register(`seventhSection.items.${index}.description_ar`)}
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
                                    seventhSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                    })
                                }
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Title</Label>
                    <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Meta Description</Label>
                    <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                </div>
            </div>

            <div className="col-span-2">
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default Home;
