"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect } from 'react'

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from '@/components/ui/textarea'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css';
import dynamic from 'next/dynamic'
import AdminItemContainer from '@/app/components/common/AdminItemContainer';
import { VideoUploader } from '@/components/ui/video-uploader';

interface EngineeringAndConstructionFormProps {

    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    banner: string;
    bannerAlt: string;
    bannerAlt_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
    title: string;
    title_ar: string;
    description: string;
    description_ar: string;
    homeImage: string;
    homeImageAlt: string;
    homeImageAlt_ar: string;
    link: string;
    firstSection: {
        title: string;
        title_ar: string;
        description: string;
        description_ar: string;
        video: string;
        poster: string;
    };
    secondSection: {
        title: string;
        title_ar: string;
        subTitle: string;
        subTitle_ar: string;
        items: {
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
            description: string;
            description_ar: string;
            title: string;
            title_ar: string;
            subTitle: string;
            subTitle_ar: string;
        }[]
    };
    thirdSection: {
        title: string;
        title_ar: string;
        items: {
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
            title: string;
            title_ar: string;
            description: string;
            description_ar: string;
        }[];
    };
    fourthSection: {
        title: string;
        title_ar: string;
        description: string;
        description_ar: string;
        items: {
            title: string;
            title_ar: string;
            description: string;
            description_ar: string;
        }[];
    };
}

const EngineeringAndConstructionPage = () => {


    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<EngineeringAndConstructionFormProps>();


    const { fields: secondSectionItems, append: secondSectionAppend, remove: secondSectionRemove } = useFieldArray({
        control,
        name: "secondSection.items"
    });

    const { fields: thirdSectionItems, append: thirdSectionAppend, remove: thirdSectionRemove } = useFieldArray({
        control,
        name: "thirdSection.items"
    });

    const { fields: fourthSectionItems, append: fourthSectionAppend, remove: fourthSectionRemove } = useFieldArray({
        control,
        name: "fourthSection.items"
    });


    const handleAddEngineeringAndConstruction = async (data: EngineeringAndConstructionFormProps) => {
        try {
            const response = await fetch(`/api/admin/services/engineering-and-construction`, {
                method: "PATCH",
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
    }

    const fetchEngineeringAndConstructionData = async () => {
        try {
            const response = await fetch(`/api/admin/services/engineering-and-construction`);
            if (response.ok) {
                const data = await response.json();
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setValue("title", data.data.title);
                setValue("title_ar", data.data.title_ar);
                setValue("description", data.data.description);
                setValue("description_ar", data.data.description_ar);
                setValue("homeImage", data.data.homeImage);
                setValue("homeImageAlt", data.data.homeImageAlt);
                setValue("homeImageAlt_ar", data.data.homeImageAlt_ar);
                setValue("link", data.data.link);
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("firstSection", data.data.firstSection);
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("thirdSection", data.data.thirdSection)
                setValue("thirdSection.items", data.data.thirdSection.items)
                setValue("fourthSection", data.data.fourthSection)
                setValue("fourthSection.items", data.data.fourthSection.items)
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        }
    }



    useEffect(() => {
        fetchEngineeringAndConstructionData();
    }, []);


    return (
        <form className='grid grid-cols-2 gap-10' onSubmit={handleSubmit(handleAddEngineeringAndConstruction)}>
            {/*English Version */}
            <div className='flex flex-col gap-5'>


                <AdminItemContainer>
                    <Label className="" main>Banner</Label>
                    <div className='p-5 rounded-md grid grid-cols-2 gap-5'>
                        <div>
                            <Controller
                                name="banner"
                                control={control}
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => (
                                    <ImageUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.banner && (
                                <p className="text-red-500">{errors.banner.message}</p>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Alt Tag</Label>
                                <Input type='text' placeholder='Alt Tag' {...register("bannerAlt")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Page Title</Label>
                                <Input type='text' placeholder='Page Title' {...register("pageTitle")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title (for home and project page selector)</Label>
                                <Input type='text' placeholder='Title' {...register("title")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Description (for home)</Label>
                                <Textarea {...register("description")} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <Label className='font-bold'>Home Image</Label>
                                    <Controller
                                        name={`homeImage`}
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.homeImage && (
                                        <p className="text-red-500">{errors.homeImage.message}</p>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='font-bold'>Home Image Alt Tag</Label>
                                        <Input type='text' placeholder='Alt Tag' {...register(`homeImageAlt`, {
                                            required: "Value is required"
                                        })} />
                                        {errors.homeImageAlt && <p className='text-red-500'>{errors.homeImageAlt.message}</p>}
                                    </div>
                                </div>


                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Link (for home)</Label>
                                <Input type='text' placeholder='Link' {...register("link")} />
                            </div>

                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("firstSection.title", {
                                    required: "Title is required"
                                })} />
                                {errors.firstSection?.title && <p className='text-red-500'>{errors.firstSection?.title.message}</p>}
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller name="firstSection.description" control={control} rules={{ required: "Description is required" }} render={({ field }) => {
                                    return <Textarea value={field.value} onChange={field.onChange} />
                                }} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className=''>Video</Label>
                                <Controller
                                    name="firstSection.video"
                                    control={control}
                                    rules={{ required: "Video is required" }}
                                    render={({ field }) => (
                                        <VideoUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.firstSection?.video && (
                                    <p className="text-red-500">{errors.firstSection?.video?.message}</p>
                                )}
                            </div>

                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-[16px] font-light'>Poster</Label>
                                <Controller
                                    name="firstSection.poster"
                                    control={control}
                                    rules={{ required: "Poster is required" }}
                                    render={({ field }) => (
                                        <ImageUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.firstSection?.poster && (
                                    <p className="text-red-500">{errors.firstSection?.poster?.message}</p>
                                )}
                            </div>
                            <div>

                            </div>

                        </div>


                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("secondSection.title", {
                                    required: "Title is required"
                                })} />
                                {errors.secondSection?.title && <p className='text-red-500'>{errors.secondSection?.title.message}</p>}
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Sub Title</Label>
                                <Input type='text' placeholder='SubTitle' {...register("secondSection.subTitle", {
                                    required: "Title is required"
                                })} />
                                {errors.secondSection?.subTitle && <p className='text-red-500'>{errors.secondSection?.subTitle.message}</p>}
                            </div>

                            <div>
                                <Label className='font-bold'>Items</Label>
                                <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                    {secondSectionItems.map((field, index) => (
                                        <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                            <div className='absolute top-2 right-2'>
                                                <RiDeleteBinLine onClick={() => secondSectionRemove(index)} className='cursor-pointer text-red-600' />
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.image && (
                                                        <p className="text-red-500">{errors.secondSection?.items?.[index]?.image.message}</p>
                                                    )}
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label className='font-bold'>Alt Tag</Label>
                                                        <Input type='text' placeholder='Alt Tag' {...register(`secondSection.items.${index}.imageAlt`, {
                                                            required: "Value is required"
                                                        })} />
                                                        {errors.secondSection?.items?.[index]?.imageAlt && <p className='text-red-500'>{errors.secondSection?.items?.[index]?.imageAlt.message}</p>}
                                                    </div>
                                                </div>


                                            </div>

                                            <div className='flex flex-col gap-2'>

                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`secondSection.items.${index}.title`, {
                                                        required: "Title is required"
                                                    })} />
                                                    {errors.secondSection?.items?.[index]?.title && <p className='text-red-500'>{errors.secondSection?.items?.[index]?.title.message}</p>}
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Sub Title</Label>
                                                    <Input type='text' placeholder='Alt Tag' {...register(`secondSection.items.${index}.subTitle`, {
                                                        required: "Sub Title is required"
                                                    })} />
                                                    {errors.secondSection?.items?.[index]?.subTitle && <p className='text-red-500'>{errors.secondSection?.items?.[index]?.subTitle.message}</p>}
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label className='font-bold'>Description</Label>
                                                        <Controller name={`secondSection.items.${index}.description`} control={control} render={({ field }) => {
                                                            return <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
                                                        }} />
                                                        {errors.secondSection?.items?.[index]?.description && <p className='text-red-500'>{errors.secondSection?.items?.[index]?.description.message}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}



                                </div>
                                <div className='flex justify-end mt-2'>
                                    <Button type='button' addItem onClick={() => secondSectionAppend({ description: "", image: "", imageAlt: "", description_ar: "", imageAlt_ar: "", title: "", title_ar: "", subTitle: "", subTitle_ar: "" })}>Add Item</Button>
                                </div>
                            </div>

                        </div>

                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register(`thirdSection.title`, {
                                    required: "Value is required"
                                })} />
                                {errors.thirdSection?.title && <p className='text-red-500'>{errors.thirdSection?.title.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label className='font-bold'>Items</Label>
                            <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                {thirdSectionItems.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                        <div className='absolute top-2 right-2'>
                                            <RiDeleteBinLine onClick={() => thirdSectionRemove(index)} className='cursor-pointer text-red-600' />
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='font-bold'>Image</Label>
                                                <Controller
                                                    name={`thirdSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader
                                                            isLogo
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                                {errors.thirdSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">{errors.thirdSection?.items?.[index]?.image.message}</p>
                                                )}
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Alt Tag</Label>
                                                    <Input type='text' placeholder='Alt Tag' {...register(`thirdSection.items.${index}.imageAlt`, {
                                                        required: "Value is required"
                                                    })} />
                                                    {errors.thirdSection?.items?.[index]?.imageAlt && <p className='text-red-500'>{errors.thirdSection?.items?.[index]?.imageAlt.message}</p>}
                                                </div>
                                            </div>


                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`thirdSection.items.${index}.title`, {
                                                        required: "Value is required"
                                                    })} />
                                                    {errors.thirdSection?.items?.[index]?.title && <p className='text-red-500'>{errors.thirdSection?.items?.[index]?.title.message}</p>}
                                                </div>
                                            </div>


                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Description</Label>
                                                    <Controller name={`thirdSection.items.${index}.description`} control={control} render={({ field }) => {
                                                        return <Textarea value={field.value} onChange={field.onChange} />
                                                    }} />
                                                    {errors.thirdSection?.items?.[index]?.description && <p className='text-red-500'>{errors.thirdSection?.items?.[index]?.description.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}



                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button type='button' addItem onClick={() => thirdSectionAppend({ title: "", description: "", image: "", imageAlt: "", title_ar: "", description_ar: "", imageAlt_ar: "" })}>Add Item</Button>
                            </div>
                        </div>


                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("fourthSection.title", {
                                    required: "Title is required"
                                })} />
                                {errors.fourthSection?.title && <p className='text-red-500'>{errors.fourthSection?.title.message}</p>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Description</Label>
                                <Controller name="fourthSection.description" control={control} render={({ field }) => {
                                    return <Textarea placeholder='Description' {...register("fourthSection.description", {
                                        required: "Description is required"
                                    })} />
                                }} />
                                {errors.fourthSection?.description && <p className='text-red-500'>{errors.fourthSection?.description.message}</p>}
                            </div>

                        </div>


                        <div>
                            <Label className='font-bold'>Items</Label>
                            <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                {fourthSectionItems.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                        <div className='absolute top-2 right-2'>
                                            <RiDeleteBinLine onClick={() => fourthSectionRemove(index)} className='cursor-pointer text-red-600' />
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`fourthSection.items.${index}.title`, {
                                                        required: "Value is required"
                                                    })} />
                                                    {errors.fourthSection?.items?.[index]?.title && <p className='text-red-500'>{errors.fourthSection?.items?.[index]?.title.message}</p>}
                                                </div>
                                            </div>

                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='font-bold'>Description</Label>
                                                <Controller name={`fourthSection.items.${index}.description`} control={control} render={({ field }) => {
                                                    return <Textarea value={field.value} onChange={field.onChange} />
                                                }} />
                                                {errors.fourthSection?.items?.[index]?.description && <p className='text-red-500'>{errors.fourthSection?.items?.[index]?.description.message}</p>}
                                            </div>
                                        </div>

                                    </div>
                                ))}



                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button type='button' addItem onClick={() => fourthSectionAppend({ title: "", description: "", title_ar: "", description_ar: "" })}>Add Item</Button>
                            </div>
                        </div>


                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className='flex flex-col gap-2'>
                            <Label className='font-bold'>Title</Label>
                            <Input type='text' placeholder='' {...register("metaTitle")} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label className='font-bold'>Description</Label>
                            <Input type='text' placeholder='' {...register("metaDescription")} />
                        </div>
                    </div>
                </AdminItemContainer>



            </div>

            {/*Arabic Version */}
            <div className='flex flex-col gap-5'>


                <AdminItemContainer>
                    <Label className="" main>Banner</Label>
                    <div className='p-5 rounded-md grid grid-cols-2 gap-5'>
                        <div>
                            <Controller
                                name="banner"
                                control={control}
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => (
                                    <ImageUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.banner && (
                                <p className="text-red-500">{errors.banner.message}</p>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Alt Tag</Label>
                                <Input type='text' placeholder='Alt Tag' {...register("bannerAlt_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Page Title</Label>
                                <Input type='text' placeholder='Page Title' {...register("pageTitle_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title (for home and project page selector)</Label>
                                <Input type='text' placeholder='Title' {...register("title_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Description (for home)</Label>
                                <Textarea {...register("description_ar")} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <Label className='font-bold'>Home Image</Label>
                                    <Controller
                                        name={`homeImage`}
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.homeImage && (
                                        <p className="text-red-500">{errors.homeImage.message}</p>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='font-bold'>Home Image Alt Tag</Label>
                                        <Input type='text' placeholder='Alt Tag' {...register(`homeImageAlt_ar`)} />
                                    </div>
                                </div>


                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Link (for home)</Label>
                                <Input type='text' disabled placeholder='Link' />
                            </div>

                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("firstSection.title_ar")} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller name="firstSection.description_ar" control={control} render={({ field }) => {
                                    return <Textarea value={field.value} onChange={field.onChange} />
                                }} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className=''>Video</Label>
                                <Controller
                                    name="firstSection.video"
                                    control={control}
                                    rules={{ required: "Video is required" }}
                                    render={({ field }) => (
                                        <VideoUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.firstSection?.video && (
                                    <p className="text-red-500">{errors.firstSection?.video?.message}</p>
                                )}
                            </div>

                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className='text-[16px] font-light'>Poster</Label>
                                <Controller
                                    name="firstSection.poster"
                                    control={control}
                                    rules={{ required: "Poster is required" }}
                                    render={({ field }) => (
                                        <ImageUploader
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.firstSection?.poster && (
                                    <p className="text-red-500">{errors.firstSection?.poster?.message}</p>
                                )}
                            </div>
                            <div>

                            </div>

                        </div>


                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("secondSection.title_ar")} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Sub Title</Label>
                                <Input type='text' placeholder='SubTitle' {...register("secondSection.subTitle_ar", {
                                })} />
                            </div>

                            <div>
                                <Label className='font-bold'>Items</Label>
                                <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                    {secondSectionItems.map((field, index) => (
                                        <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                            <div className='absolute top-2 right-2'>
                                                <RiDeleteBinLine onClick={() => secondSectionRemove(index)} className='cursor-pointer text-red-600' />
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.image && (
                                                        <p className="text-red-500">{errors.secondSection?.items?.[index]?.image.message}</p>
                                                    )}
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label className='font-bold'>Alt Tag</Label>
                                                        <Input type='text' placeholder='Alt Tag' {...register(`secondSection.items.${index}.imageAlt_ar`)} />
                                                    </div>
                                                </div>


                                            </div>

                                            <div className='flex flex-col gap-2'>

                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`secondSection.items.${index}.title_ar`)} />
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Sub Title</Label>
                                                    <Input type='text' placeholder='Alt Tag' {...register(`secondSection.items.${index}.subTitle_ar`)} />
                                                </div>


                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-col gap-2'>
                                                        <Label className='font-bold'>Description</Label>
                                                        <Controller name={`secondSection.items.${index}.description_ar`} control={control} render={({ field }) => {
                                                            return <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}



                                </div>
                                <div className='flex justify-end mt-2'>
                                    <Button type='button' addItem onClick={() => secondSectionAppend({ description: "", image: "", imageAlt: "", description_ar: "", imageAlt_ar: "", title: "", title_ar: "", subTitle: "", subTitle_ar: "" })}>Add Item</Button>
                                </div>
                            </div>

                        </div>

                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-2'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register(`thirdSection.title_ar`)} />
                            </div>
                        </div>

                        <div>
                            <Label className='font-bold'>Items</Label>
                            <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                {thirdSectionItems.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                        <div className='absolute top-2 right-2'>
                                            <RiDeleteBinLine onClick={() => thirdSectionRemove(index)} className='cursor-pointer text-red-600' />
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='font-bold'>Image</Label>
                                                <Controller
                                                    name={`thirdSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader
                                                            isLogo
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                                {errors.thirdSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">{errors.thirdSection?.items?.[index]?.image.message}</p>
                                                )}
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Alt Tag</Label>
                                                    <Input type='text' placeholder='Alt Tag' {...register(`thirdSection.items.${index}.imageAlt_ar`)} />
                                                </div>
                                            </div>


                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`thirdSection.items.${index}.title_ar`)} />
                                                </div>
                                            </div>


                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Description</Label>
                                                    <Controller name={`thirdSection.items.${index}.description_ar`} control={control} render={({ field }) => {
                                                        return <Textarea value={field.value} onChange={field.onChange} />
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}



                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button type='button' addItem onClick={() => thirdSectionAppend({ title: "", description: "", image: "", imageAlt: "", title_ar: "", description_ar: "", imageAlt_ar: "" })}>Add Item</Button>
                            </div>
                        </div>


                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                    <Label main>Fourth Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("fourthSection.title_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className='font-bold'>Description</Label>
                                <Controller name="fourthSection.description_ar" control={control} render={({ field }) => {
                                    return <Textarea placeholder='Description' {...register("fourthSection.description_ar")} />
                                }} />
                            </div>

                        </div>


                        <div>
                            <Label className='font-bold'>Items</Label>
                            <div className='border border-black/20 p-2 rounded-md flex flex-col gap-5'>


                                {fourthSectionItems.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b border-black/20 pb-5 last:border-b-0'>
                                        <div className='absolute top-2 right-2'>
                                            <RiDeleteBinLine onClick={() => fourthSectionRemove(index)} className='cursor-pointer text-red-600' />
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`fourthSection.items.${index}.title_ar`)} />
                                                </div>
                                            </div>

                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='font-bold'>Description</Label>
                                                <Controller name={`fourthSection.items.${index}.description_ar`} control={control} render={({ field }) => {
                                                    return <Textarea value={field.value} onChange={field.onChange} />
                                                }} />
                                            </div>
                                        </div>

                                    </div>
                                ))}



                            </div>
                            <div className='flex justify-end mt-2'>
                                <Button type='button' addItem onClick={() => fourthSectionAppend({ title: "", description: "", title_ar: "", description_ar: "" })}>Add Item</Button>
                            </div>
                        </div>


                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className='flex flex-col gap-2'>
                            <Label className='font-bold'>Title</Label>
                            <Input type='text' placeholder='' {...register("metaTitle_ar")} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label className='font-bold'>Description</Label>
                            <Input type='text' placeholder='' {...register("metaDescription_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>



            </div>

            <div className='col-span-2'>
                <Button type='submit' className="cursor-pointer text-white text-[16px] w-full">Submit</Button>
            </div>

        </form>
    )
}

export default EngineeringAndConstructionPage