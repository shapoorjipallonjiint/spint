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

interface AccreditationFormProps {
    metaTitle: string;
    metaTitle_ar?: string;

    metaDescription: string;
    metaDescription_ar?: string;

    banner: string;
    bannerAlt?: string;
    bannerAlt_ar?: string;

    pageTitle: string;
    pageTitle_ar?: string;

    pageSubTitle:string;
    pageSubTitle_ar:string;

    pageDescription:string;
    pageDescription_ar:string;

    secondSection: {

        items: {
            fileName: string;
            fileName_ar?: string;
            fileImage?: string;
            fileImageAlt: string;
            fileImageAlt_ar: string;
        }[];
    };

}

const AccreditationPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<AccreditationFormProps>();

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });



    const handleAddAccreditation = async (data: AccreditationFormProps) => {
        try {
            const response = await fetch(`/api/admin/accreditation`, {
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
            console.log("Error in adding data", error);
        }
    };

    const fetchAccreditaionData = async () => {
        try {
            const response = await fetch(`/api/admin/accreditation`);
            if (response.ok) {
                const data = await response.json();
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setValue("pageSubTitle", data.data.pageSubTitle);
                setValue("pageSubTitle_ar", data.data.pageSubTitle_ar);
                setValue("pageDescription", data.data.pageDescription);
                setValue("pageDescription_ar", data.data.pageDescription_ar);
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        }
    };

    useEffect(() => {
        fetchAccreditaionData();
    }, []);

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(handleAddAccreditation)}>
            {/*English Version */}
            <div className="flex flex-col gap-5">
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

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-1 gap-2">
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
                    <Label main>Page Content</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex w-full gap-5">
                            <div className="w-full">
                                <Label className="font-bold">Page Title</Label>
                                <Input
                                    {...register("pageTitle_ar")}
                                /> 
                            </div>

                            <div className="w-full">
                                <Label className="font-bold">Page Sub Title</Label>
                                <Input
                                    {...register("pageSubTitle_ar")}
                                /> 
                            </div>
                        </div>

                        <div className="w-full">
                            <Label className="font-bold">Page Description</Label>
                            <Textarea
                                {...register("pageDescription_ar")}
                                placeholder="Description"
                            />
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

export default AccreditationPage;
