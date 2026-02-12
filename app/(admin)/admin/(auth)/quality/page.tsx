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
import { FileUploader } from "@/components/ui/file-uploader";

interface QualityFormProps {
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

        image?: string;
        imageAlt?: string;
        imageAlt_ar?: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;
        description?: string;
        description_ar?: string;
        items: {
            title: string;
            title_ar?: string;
            subTitle?: string;
            subTitle_ar?: string;
            thumbnail?: string;
            thumbnailAlt: string;
            thumbnailAlt_ar: string;
            files: {
                file?: string;
                name: string;
                name_ar?: string;
            }[]
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        itemsOne: {
            key?: string;
            key_ar?: string;
            value?: string;
            value_ar?: string;
        }[];

        itemsTwo: {
            image?: string;
            imageAlt?: string;
            imageAlt_ar?: string;
        }[];
    };

    fourthSection: {
        title: string;
        title_ar?: string;
        subTitle: string;
        subTitle_ar?: string;
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

    unifiedStandardSection: {
        items: {
            logo: string;
            title: string;
            title_ar: string;
            description: string;
            description_ar: string;
        }[];
    };

    sixthSection: {
        image: string;
        imageAlt: string;
        imageAlt_ar: string;
        title: string;
        title_ar: string;
        description: string;
        description_ar: string;
        subTitle: string;
        subTitle_ar: string;
    };
}

const QualityPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm<QualityFormProps>();

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    const {
        fields: thirdSectionItemsOne,
        append: thirdSectionAppendOne,
        remove: thirdSectionRemoveOne,
    } = useFieldArray({
        control,
        name: "thirdSection.itemsOne",
    });

    const {
        fields: thirdSectionItemsTwo,
        append: thirdSectionAppendTwo,
        remove: thirdSectionRemoveTwo,
    } = useFieldArray({
        control,
        name: "thirdSection.itemsTwo",
    });

    const {
        fields: fourthSectionItems,
        append: fourthSectionAppend,
        remove: fourthSectionRemove,
    } = useFieldArray({
        control,
        name: "fourthSection.items",
    });

    const {
        fields: unifiedStandardSectionItems,
        append: unifiedStandardSectionAppend,
        remove: unifiedStandardSectionRemove,
    } = useFieldArray({
        control,
        name: "unifiedStandardSection.items",
    });

    const handleAddQuality = async (data: QualityFormProps) => {
        try {
            const response = await fetch(`/api/admin/quality`, {
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

    const fetchQualityData = async () => {
        try {
            const response = await fetch(`/api/admin/quality`);
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
                setValue("thirdSection.itemsOne", data.data.thirdSection.itemsOne);
                setValue("thirdSection.itemsTwo", data.data.thirdSection.itemsTwo);
                setValue("fourthSection", data.data.fourthSection);
                setValue("fourthSection.items", data.data.fourthSection.items);
                setValue("sixthSection", data.data.sixthSection);
                setValue("unifiedStandardSection.items", data.data.unifiedStandardSection.items);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching about data", error);
        }
    };

    useEffect(() => {
        fetchQualityData();
    }, []);


    const handleAddFile = (index: number) => {
        const currentFiles = watch(`secondSection.items.${index}.files`) || [];
        setValue(`secondSection.items.${index}.files`, [
            ...currentFiles,
            {
                file: "",
                name: "",
                name_ar: "",
            },
        ]);
    };

    const handleRemoveFile = (index: number, fileIndex: number) => {
        const currentFiles = watch(`secondSection.items.${index}.files`) || [];
        setValue(
            `secondSection.items.${index}.files`,
            currentFiles.filter((_, i) => i !== fileIndex)
        );
    };

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddQuality)}>
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
                                        <Label className="text-sm font-bold">Image</Label>
                                        <Controller
                                            name="firstSection.image"
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <FormError error={errors.firstSection?.image?.message} />
                                    <Label className="font-bold">Image Alt Tag</Label>
                                    <Input type="text" placeholder="Image Alt Tag" {...register("firstSection.imageAlt")} />
                                    <FormError error={errors.firstSection?.imageAlt?.message} />
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
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {unifiedStandardSectionItems.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                                <div className="absolute top-2 right-2">
                                                    <RiDeleteBinLine
                                                        onClick={() => unifiedStandardSectionRemove(index)}
                                                        className="cursor-pointer text-red-600"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Logo</Label>
                                                    <Controller
                                                        name={`unifiedStandardSection.items.${index}.logo`}
                                                        control={control}
                                                        rules={{ required: "Logo is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.unifiedStandardSection?.items?.[index]?.logo && (
                                                        <FormError
                                                            error={
                                                                errors.unifiedStandardSection?.items?.[index]?.logo?.message
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Title"
                                                            {...register(`unifiedStandardSection.items.${index}.title`)}
                                                        />
                                                        <FormError
                                                            error={
                                                                errors.unifiedStandardSection?.items?.[index]?.title
                                                                    ?.message
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Description</Label>
                                                        <Textarea
                                                            placeholder="Description"
                                                            {...register(
                                                                `unifiedStandardSection.items.${index}.description`,
                                                            )}
                                                        />
                                                        <FormError
                                                            error={
                                                                errors.unifiedStandardSection?.items?.[index]?.description
                                                                    ?.message
                                                            }
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
                                                    unifiedStandardSectionAppend({
                                                        logo: "",
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
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Third Section</Label>
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
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Sub Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Sub Title"
                                    {...register("fourthSection.subTitle", {
                                        required: "Sub Title is required",
                                    })}
                                />
                                <FormError error={errors.fourthSection?.subTitle?.message} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">First Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemove(index)}
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
                                                        {...register(`fourthSection.items.${index}.title`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.title?.message}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Description</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Description"
                                                        {...register(`fourthSection.items.${index}.description`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.description?.message}
                                                    />
                                                </div>
                                            </div>
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

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fourthSection.items.${index}.imageAlt`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.fourthSection?.items?.[index]?.imageAlt?.message}
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
                                        fourthSectionAppend({
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
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
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
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.description", {
                                            required: "Description is required",
                                        })}
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
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Title"
                                                            {...register(`secondSection.items.${index}.title`)}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.title?.message}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Sub Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sub Title"
                                                            {...register(`secondSection.items.${index}.subTitle`)}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.subTitle?.message}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Thumbnail</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.thumbnail`}
                                                        control={control}
                                                        rules={{ required: "Thumbnail is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.thumbnail && (
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.thumbnail?.message}
                                                        />
                                                    )}
                                                    <Label className="font-bold">Thumbnail Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.thumbnailAlt`)}
                                                    />
                                                    <div className="flex gap-2 justify-end items-end">
                                                        <div>
                                                            <Button
                                                                type="button"
                                                                className="w-full cursor-pointer text-white bg-green-400 text-[16px]"
                                                                onClick={() => {
                                                                    handleAddFile(index);
                                                                }}
                                                            >
                                                                Add Files
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                                    {(watch(`secondSection.items.${index}.files`) || []).map(
                                                        (file, fileIndex) => (
                                                            <div key={fileIndex} className="relative p-2 rounded-md col-span-1">
                                                                <Controller
                                                                    name={`secondSection.items.${index}.files.${fileIndex}.file`}
                                                                    control={control}
                                                                    rules={{ required: "Image is required" }}
                                                                    render={({ field }) => (
                                                                        <FileUploader
                                                                            value={field.value}
                                                                            onChange={field.onChange}
                                                                        />
                                                                    )}
                                                                />

                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">File Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="File Name"
                                                                        {...register(`secondSection.items.${index}.files.${fileIndex}.name`)}
                                                                    />
                                                                    <FormError
                                                                        error={errors.secondSection?.items?.[index]?.files?.[fileIndex]?.name?.message}
                                                                    />
                                                                </div>

                                                                {!file.file && <RiDeleteBinLine
                                                                    onClick={() => handleRemoveFile(index, fileIndex)}
                                                                    className="absolute top-3 right-3 cursor-pointer text-red-600"
                                                                />}
                                                            </div>
                                                        )
                                                    )}
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
                                                        thumbnail: "",
                                                        thumbnailAlt: "",
                                                        thumbnailAlt_ar: "",
                                                        files: [],
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
                    <Label main>Fifth Section</Label>

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

                        <div className="border p-5 rounded-md">
                            <Label>Items One (Key Values)</Label>
                            <div className="border p-2 rounded-md mt-2">
                                {thirdSectionItemsOne.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemoveOne(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`thirdSection.itemsOne.${index}.key`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 mt-4">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`thirdSection.itemsOne.${index}.value`)}
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
                                        thirdSectionAppendOne({
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

                        <div className="border rounded-md p-5">
                            <Label>Items Two (Images)</Label>
                            <div className="border p-2 rounded-md mt-2">
                                {thirdSectionItemsTwo.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 pt-2 relative border-b pb-4 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemoveTwo(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Image</Label>
                                                <Controller
                                                    name={`thirdSection.itemsTwo.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.thirdSection?.itemsTwo?.[index]?.image?.message} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`thirdSection.itemsTwo.${index}.imageAlt`, {
                                                            required: "Value is required",
                                                        })}
                                                    />
                                                    <FormError
                                                        error={errors.thirdSection?.itemsTwo?.[index]?.imageAlt?.message}
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
                                        thirdSectionAppendTwo({
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

                <AdminItemContainer>
                    <Label main>Sixth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("sixthSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.firstSection?.title?.message} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="sixthSection.description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Sub Title</Label>
                                <Controller
                                    name="sixthSection.subTitle"
                                    control={control}
                                    rules={{ required: "Sub Title is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label className="text-sm font-bold">Image</Label>
                                        <Controller
                                            name="sixthSection.image"
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <FormError error={errors.sixthSection?.image?.message} />
                                    <Label className="font-bold">Image Alt Tag</Label>
                                    <Input type="text" placeholder="Image Alt Tag" {...register("sixthSection.imageAlt")} />
                                    <FormError error={errors.sixthSection?.imageAlt?.message} />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <div className="p-5">
                    <div className="flex flex-col gap-2 mb-4">
                        <Label className="pl-3 font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="pl-3 font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                    </div>
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
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("firstSection.title_ar", {
                                        required: "Title is required",
                                    })}
                                />
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
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label className="text-sm font-bold">Image</Label>
                                        <Controller
                                            name="firstSection.image"
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <FormError error={errors.firstSection?.image?.message} />
                                    <Label className="font-bold">Image Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="Image Alt Tag"
                                        {...register("firstSection.imageAlt_ar")}
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
                                <div>
                                    <Label className="font-bold">Items</Label>
                                    <div className="border p-2 rounded-md flex flex-col gap-5 mt-0.5">
                                        {unifiedStandardSectionItems.map((field, index) => (
                                            <div key={field.id} className="grid grid-cols-2 gap-2 relative border-b pb-5">
                                                <div className="absolute top-2 right-2">
                                                    <RiDeleteBinLine
                                                        onClick={() => unifiedStandardSectionRemove(index)}
                                                        className="cursor-pointer text-red-600"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Logo</Label>
                                                    <Controller
                                                        name={`unifiedStandardSection.items.${index}.logo`}
                                                        control={control}
                                                        // rules={{ required: "Logo is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Title"
                                                            {...register(`unifiedStandardSection.items.${index}.title_ar`)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Description</Label>
                                                        <Textarea
                                                            placeholder="Description"
                                                            {...register(
                                                                `unifiedStandardSection.items.${index}.description_ar`,
                                                            )}
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
                                                    unifiedStandardSectionAppend({
                                                        logo: "",
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
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Third Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("fourthSection.title_ar")} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Sub Title</Label>
                                <Input type="text" placeholder="Title" {...register("fourthSection.subTitle_ar")} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">First Items</Label>
                            <div className="border p-2 rounded-md flex flex-col gap-5">
                                {fourthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-5 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => fourthSectionRemove(index)}
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
                                                        {...register(`fourthSection.items.${index}.title_ar`)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Description</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Description"
                                                        {...register(`fourthSection.items.${index}.description_ar`)}
                                                    />
                                                </div>
                                            </div>
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

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fourthSection.items.${index}.imageAlt_ar`, {
                                                            required: "Value is required",
                                                        })}
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
                                        fourthSectionAppend({
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
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.title_ar")}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Description"
                                        {...register("secondSection.description_ar")}
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
                                                        <Label className="font-bold">Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Title"
                                                            {...register(`secondSection.items.${index}.title_ar`)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Sub Title</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sub Title"
                                                            {...register(`secondSection.items.${index}.subTitle_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Thumbnail</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.thumbnail`}
                                                        control={control}
                                                        rules={{ required: "Thumbnail is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.thumbnail && (
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.thumbnail?.message}
                                                        />
                                                    )}
                                                    <Label className="font-bold">Thumbnail Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.thumbnailAlt_ar`)}
                                                    />
                                                    <div className="flex gap-2 justify-end items-end">
                                                        <div>
                                                            <Button
                                                                type="button"
                                                                className="w-full cursor-pointer text-white bg-green-400 text-[16px]"
                                                                onClick={() => {
                                                                    handleAddFile(index);
                                                                }}
                                                            >
                                                                Add Files
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                                    {(watch(`secondSection.items.${index}.files`) || []).map(
                                                        (file, fileIndex) => (
                                                            <div key={fileIndex} className="relative p-2 rounded-md col-span-1">
                                                                <Controller
                                                                    name={`secondSection.items.${index}.files.${fileIndex}.file`}
                                                                    control={control}
                                                                    rules={{ required: "File is required" }}
                                                                    render={({ field }) => (
                                                                        <FileUploader
                                                                            value={field.value}
                                                                            onChange={field.onChange}
                                                                        />
                                                                    )}
                                                                />

                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">File Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="File Name"
                                                                        {...register(`secondSection.items.${index}.files.${fileIndex}.name_ar`)}
                                                                    />
                                                                </div>

                                                                {!file.file && <RiDeleteBinLine
                                                                    onClick={() => handleRemoveFile(index, fileIndex)}
                                                                    className="absolute top-3 right-3 cursor-pointer text-red-600"
                                                                />}
                                                            </div>
                                                        )
                                                    )}
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
                                                        thumbnail: "",
                                                        thumbnailAlt: "",
                                                        thumbnailAlt_ar: "",
                                                        files: [],
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
                    <Label main>Fifth Section</Label>

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
                            </div>
                        </div>

                        <div className="border p-5 rounded-md">
                            <Label>Items One (Key Values)</Label>
                            <div className="border p-2 rounded-md mt-2">
                                {thirdSectionItemsOne.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemoveOne(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`thirdSection.itemsOne.${index}.key_ar`)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 mt-4">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`thirdSection.itemsOne.${index}.value_ar`)}
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
                                        thirdSectionAppendOne({
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

                        <div className="border rounded-md p-5">
                            <Label>Items Two (Images)</Label>
                            <div className="border p-2 rounded-md mt-2">
                                {thirdSectionItemsTwo.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-4 pt-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemoveTwo(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Image</Label>
                                                <Controller
                                                    name={`thirdSection.itemsTwo.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.thirdSection?.itemsTwo?.[index]?.image?.message} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`thirdSection.itemsTwo.${index}.imageAlt_ar`, {
                                                            required: "Value is required",
                                                        })}
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
                                        thirdSectionAppendTwo({
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

                <AdminItemContainer>
                    <Label main>Sixth Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("sixthSection.title_ar")} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="sixthSection.description_ar"
                                    control={control}
                                    // rules={{ required: "Description is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Sub Title</Label>
                                <Controller
                                    name="sixthSection.subTitle_ar"
                                    control={control}
                                    // rules={{ required: "Sub Title is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <Label className="text-sm font-bold">Image</Label>
                                        <Controller
                                            name="sixthSection.image"
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <Label className="font-bold">Image Alt Tag</Label>
                                    <Input
                                        type="text"
                                        placeholder="Image Alt Tag"
                                        {...register("sixthSection.imageAlt_ar")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <div className="p-5">
                    <div className="flex flex-col gap-2 mb-4">
                        <Label className="pl-3 font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="pl-3 font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                    </div>
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

export default QualityPage;
