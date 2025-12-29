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

interface HseFormProps {
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
            fileName: string;
            fileName_ar?: string;
            fileImage?: string;
            fileImageAlt: string;
            fileImageAlt_ar: string;
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

        items: {
            title?: string;
            title_ar?: string;
            image?: string;
            imageAlt?: string;
            imageAlt_ar?: string;
        }[];
    };
}

const HsePage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<HseFormProps>();

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

    const handleAddHse = async (data: HseFormProps) => {
        try {
            const response = await fetch(`/api/admin/hse`, {
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
            console.log("Error in adding hse", error);
        }
    };

    const fetchHseData = async () => {
        try {
            const response = await fetch(`/api/admin/hse`);
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
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching hse data", error);
        }
    };

    useEffect(() => {
        fetchHseData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddHse)}>
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
                                                        <Label className="font-bold">FileName</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="FileName"
                                                            {...register(`secondSection.items.${index}.fileName`)}
                                                        />
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.fileName?.message}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">File Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.fileImage`}
                                                        control={control}
                                                        rules={{ required: "File Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.fileImage && (
                                                        <FormError
                                                            error={errors.secondSection?.items?.[index]?.fileImage?.message}
                                                        />
                                                    )}
                                                    <Label className="font-bold">File Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.fileImageAlt`)}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.fileImageAlt?.message}
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
                                                        fileName: "",
                                                        fileName_ar: "",
                                                        fileImage: "",
                                                        fileImageAlt: "",
                                                        fileImageAlt_ar: "",
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
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.title_ar", {
                                            required: "Title is required",
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register("secondSection.description_ar", {
                                            required: "Description is required",
                                        })}
                                    />
                                    <FormError error={errors.secondSection?.description_ar?.message} />
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
                                                        <Label className="font-bold">FileName</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="FileName"
                                                            {...register(`secondSection.items.${index}.fileName_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">File Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.fileImage`}
                                                        control={control}
                                                        rules={{ required: "File Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    <FormError
                                                        error={errors.secondSection?.items?.[index]?.fileImage?.message}
                                                    />
                                                    <Label className="font-bold">File Image Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`secondSection.items.${index}.fileImageAlt_ar`)}
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
                                                        fileName: "",
                                                        fileName_ar: "",
                                                        fileImage: "",
                                                        fileImageAlt: "",
                                                        fileImageAlt_ar: "",
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
                                                        {...register(`fourthSection.items.${index}.title_ar`, {
                                                            required: "Value is required",
                                                        })}
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

export default HsePage;
