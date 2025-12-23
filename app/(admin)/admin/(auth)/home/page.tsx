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
import { VideoUploader } from '@/components/ui/video-uploader';
import AdminItemContainer from '@/app/components/common/AdminItemContainer';

interface HomeFormProps {

    metaTitle: string;
    metaDescription: string;
    banner: string;
    bannerAlt: string;
    pageTitle: string;
    bannerSection: {
        items: {
            video: string;
            mainTitle: string;
            subTitle: string;
            poster: string;
            primaryColorText: string;
        }[];
    };
    firstSection: {
        mainTitle: string;
        subTitle: string;
        buttonText: string;
        items: {
            logo: string;
            logoAlt: string;
            number: string;
            value: string;
            suffix: string;
        }[];
    };
    clientsSection: {
        items: {
            logo: string;
            logoAlt: string;
        }[];
    };
    servicesSection: {
        title: string;
        items: {
            logo: string;
            logoAlt: string;
            title: string;
            description: string;
            image: string;
            imageAlt: string;
            slug: string;
        }[];
    };
    sustainabilitySection: {
        video: string;
        poster: string;
        title: string;
        description: string;
        itemTitle: string;
        items: {
            logo: string;
            logoAlt: string;
            title: string;
        }[];
    };
}

const Home = () => {


    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<HomeFormProps>();


    const { fields: firstSectionItems, append: firstSectionAppend, remove: firstSectionRemove } = useFieldArray({
        control,
        name: "firstSection.items"
    });

    const { fields: bannerSectionItems, append: bannerSectionAppend, remove: bannerSectionRemove } = useFieldArray({
        control,
        name: "bannerSection.items"
    });

    const { fields: clientsSectionItems, append: clientsSectionAppend, remove: clientsSectionRemove } = useFieldArray({
        control,
        name: "clientsSection.items"
    });

    const { fields: servicesSectionItems, append: servicesSectionAppend, remove: servicesSectionRemove } = useFieldArray({
        control,
        name: "servicesSection.items"
    });

    const { fields: sustainabilitySectionItems, append: sustainabilitySectionAppend, remove: sustainabilitySectionRemove } = useFieldArray({
        control,
        name: "sustainabilitySection.items"
    });


    const handleAddHome = async (data: HomeFormProps) => {
        try {
            const response = await fetch(`/api/admin/home`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in adding home", error);
        }
    }

    const fetchHomeData = async () => {
        try {
            const response = await fetch(`/api/admin/home`);
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaDescription", data.data.metaDescription);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.items", data.data.firstSection.items);
                setValue("clientsSection.items", data.data.clientsSection.items);
                setValue("servicesSection", data.data.servicesSection);
                setValue("servicesSection.items", data.data.servicesSection.items);
                setValue("bannerSection.items", data.data.bannerSection.items);
                setValue("sustainabilitySection", data.data.sustainabilitySection);
                setValue("sustainabilitySection.items", data.data.sustainabilitySection.items);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching home data", error);
        }
    }



    useEffect(() => {
        fetchHomeData();
    }, []);


    return (
        <div className='flex flex-col gap-5'>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(handleAddHome)}>


                <AdminItemContainer>
                    <Label className='' main>Banner Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-5'>


                        {bannerSectionItems.map((field, index) => (
                            <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                <div className='absolute top-2 right-2'>
                                    <RiDeleteBinLine onClick={() => bannerSectionRemove(index)} className='cursor-pointer text-red-600' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-2'>
                                        <Label className=''>Video</Label>
                                        <Controller
                                            name={`bannerSection.items.${index}.video`}
                                            control={control}
                                            rules={{ required: "Video is required" }}
                                            render={({ field }) => (
                                                <VideoUploader
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                        {errors.bannerSection?.items?.[index]?.video && (
                                            <p className="text-red-500">{errors.bannerSection?.items?.[index]?.video.message}</p>
                                        )}
                                    </div>

                                    

                                </div>
                                <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-2'>
                                        <Label className='text-[16px] font-light'>Poster</Label>
                                        <Controller
                                            name={`bannerSection.items.${index}.poster`}
                                            control={control}
                                            rules={{ required: "Poster is required" }}
                                            render={({ field }) => (
                                                <ImageUploader
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                        {errors.bannerSection?.items?.[index]?.poster && (
                                            <p className="text-red-500">{errors.bannerSection?.items?.[index]?.poster.message}</p>
                                        )}
                                    </div>
                                    <div>
                                    
                                </div>
                                
                            </div>
                            <div className='grid grid-cols-3 col-span-2 gap-3'>
                            <div className='flex flex-col gap-2'>
                                        <Label className='text-[16px] font-light'>Main Title</Label>
                                        <Input type='text' placeholder='Main Title' {...register(`bannerSection.items.${index}.mainTitle`, {
                                            required: "Main Title is required"
                                        })} />
                                        {errors.bannerSection?.items?.[index]?.mainTitle && <p className='text-red-500'>{errors.bannerSection?.items?.[index]?.mainTitle.message}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='text-[16px] font-light'>Sub Title</Label>
                                        <Input type='text' placeholder='Sub Title' {...register(`bannerSection.items.${index}.subTitle`, {
                                            required: "Sub Title is required"
                                        })} />
                                        {errors.bannerSection?.items?.[index]?.subTitle && <p className='text-red-500'>{errors.bannerSection?.items?.[index]?.subTitle.message}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label className='text-[16px] font-light'>Primary Color Text</Label>
                                        <Input type='text' placeholder='Primary Color Text' {...register(`bannerSection.items.${index}.primaryColorText`)} />
                                    </div>
                                    </div>
                                    </div>
                        ))}

                        <div className='flex justify-end'>
                            <Button type='button' className="" addItem onClick={() => bannerSectionAppend({ mainTitle: "", subTitle: "", video: "", poster: "", primaryColorText: "" })}>Add Item</Button>
                        </div>

                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                <Label className='' main>First Section</Label>
                <div className='p-5 flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label className=' font-bold'>Main Title</Label>
                            <Input type='text' placeholder='Main Title' {...register("firstSection.mainTitle", {
                                required: "Main Title is required"
                            })} />
                            {errors.firstSection?.mainTitle && <p className='text-red-500'>{errors.firstSection?.mainTitle.message}</p>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className=' font-bold'>Sub Title</Label>
                            <Input type='text' placeholder='Sub Title' {...register("firstSection.subTitle", {
                                required: "Sub Title is required"
                            })} />
                            {errors.firstSection?.subTitle && <p className='text-red-500'>{errors.firstSection?.subTitle.message}</p>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className=' font-bold'>Button Text</Label>
                            <Input type='text' placeholder='Button Text' {...register("firstSection.buttonText", {
                                required: "Button Text is required"
                            })} />
                            {errors.firstSection?.buttonText && <p className='text-red-500'>{errors.firstSection?.buttonText.message}</p>}
                        </div>
                    </div>


                    <div className='flex flex-col gap-2'>
                        <Label className=' font-bold'>Items</Label>
                        <div className='border p-2 rounded-md flex flex-col gap-5'>


                            {firstSectionItems.map((field, index) => (
                                <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                    <div className='absolute top-2 right-2'>
                                        <RiDeleteBinLine onClick={() => firstSectionRemove(index)} className='cursor-pointer text-red-600' />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Label className=' font-bold'>Logo</Label>
                                        <Controller
                                            name={`firstSection.items.${index}.logo`}
                                            control={control}
                                            rules={{ required: "Logo is required" }}
                                            render={({ field }) => (
                                                <ImageUploader
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    isLogo
                                                />
                                            )}
                                        />
                                        {errors.firstSection?.items?.[index]?.logo && (
                                            <p className="text-red-500">{errors.firstSection?.items?.[index]?.logo.message}</p>
                                        )}

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className=' font-bold'>Alt Tag</Label>
                                                <Input type='text' placeholder='Alt Tag' {...register(`firstSection.items.${index}.logoAlt`)} />
                                            </div>
                                        </div>

                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Number</Label>
                                            <Input type='text' placeholder='Number' {...register(`firstSection.items.${index}.number`)} />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Suffix</Label>
                                            <Input type='text' placeholder='Suffix' {...register(`firstSection.items.${index}.suffix`)} />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Value</Label>
                                            <Input type='text' placeholder='Value' {...register(`firstSection.items.${index}.value`, {
                                                required: "Value is required"
                                            })} />
                                            {errors.firstSection?.items?.[index]?.value && <p className='text-red-500'>{errors.firstSection?.items?.[index]?.value.message}</p>}
                                        </div>
                                    </div>

                                </div>
                            ))}

                            <div className='flex justify-end'>
                                <Button type='button' className="" addItem onClick={() => firstSectionAppend({ suffix:"",number: "", value: "", logo: "", logoAlt: "" })}>Add Item</Button>
                            </div>

                        </div>
                    </div>


                </div>
                </AdminItemContainer>


                <AdminItemContainer>
                <Label className='' main>Clients Section</Label>
                    <div className='rounded-md flex flex-col gap-5 p-5'>


                        {clientsSectionItems.map((field, index) => (
                            <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b pb-5'>
                                <div className='absolute top-2 right-2'>
                                    <RiDeleteBinLine onClick={() => clientsSectionRemove(index)} className='cursor-pointer text-red-600' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label className=' font-bold'>Logo</Label>
                                    <Controller
                                        name={`clientsSection.items.${index}.logo`}
                                        control={control}
                                        rules={{ required: "Logo is required" }}
                                        render={({ field }) => (
                                            <ImageUploader
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.clientsSection?.items?.[index]?.logo && (
                                        <p className="text-red-500">{errors.clientsSection?.items?.[index]?.logo.message}</p>
                                    )}
                                </div>
                                
                                <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Alt Tag</Label>
                                            <Input type='text' placeholder='Alt Tag' {...register(`clientsSection.items.${index}.logoAlt`)} />
                                        </div>
                                    </div>
                            </div>
                        ))}

                        <div className='flex justify-end'>
                            <Button type='button' className="" addItem onClick={() => clientsSectionAppend({ logo: "", logoAlt: "" })}>Add Item</Button>
                        </div>

                    </div>


                </AdminItemContainer>

                <AdminItemContainer>
                <Label className='' main>Services Section</Label>
                <div className='p-5  flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label className=' font-bold'>Title</Label>
                            <Input type='text' placeholder='Title' {...register("servicesSection.title", {
                                required: "Title is required"
                            })} />
                            {errors.servicesSection?.title && <p className='text-red-500'>{errors.servicesSection?.title.message}</p>}
                        </div>

                    </div>


                    <div>
                        <div className='rounded-md flex flex-col gap-5'>
                        <Label className=' font-bold'>Items</Label>

                            {servicesSectionItems.map((field, index) => (
                                <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b p-2'>
                                    <div className='absolute top-2 right-2'>
                                        <RiDeleteBinLine onClick={() => servicesSectionRemove(index)} className='cursor-pointer text-red-600' />
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Logo</Label>
                                            <Controller
                                                name={`servicesSection.items.${index}.logo`}
                                                control={control}
                                                rules={{ required: "Logo is required" }}
                                                render={({ field }) => (
                                                    <ImageUploader
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        isLogo
                                                    />
                                                )}
                                            />
                                            {errors.servicesSection?.items?.[index]?.logo && (
                                                <p className="text-red-500">{errors.servicesSection?.items?.[index]?.logo.message}</p>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='pl-3 font-bold'>Alt Tag</Label>
                                                <Input type='text' placeholder='Alt Tag' {...register(`servicesSection.items.${index}.logoAlt`, {
                                                    required: "Value is required"
                                                })} />
                                                {errors.servicesSection?.items?.[index]?.logoAlt && <p className='text-red-500'>{errors.servicesSection?.items?.[index]?.logoAlt.message}</p>}
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='pl-3 font-bold'>Title</Label>
                                                <Input type='text' placeholder='Title' {...register(`servicesSection.items.${index}.title`, {
                                                    required: "Value is required"
                                                })} />
                                                {errors.servicesSection?.items?.[index]?.title && <p className='text-red-500'>{errors.servicesSection?.items?.[index]?.title.message}</p>}
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='pl-3 font-bold'>Description</Label>
                                                <Textarea placeholder='Description' {...register(`servicesSection.items.${index}.description`, {
                                                    required: "Value is required"
                                                })} />
                                                {errors.servicesSection?.items?.[index]?.description && <p className='text-red-500'>{errors.servicesSection?.items?.[index]?.description.message}</p>}
                                            </div>
                                        </div>
                                    </div>


                                    </div>


                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            <Label className='pl-3 font-bold'>Image</Label>
                                            <Controller
                                                name={`servicesSection.items.${index}.image`}
                                                control={control}
                                                rules={{ required: "Image is required" }}
                                                render={({ field }) => (
                                                    <ImageUploader
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            {errors.servicesSection?.items?.[index]?.image && (
                                                <p className="text-red-500">{errors.servicesSection?.items?.[index]?.image.message}</p>
                                            )}
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='pl-3 font-bold'>Alt Tag</Label>
                                                <Input type='text' placeholder='Alt Tag' {...register(`servicesSection.items.${index}.imageAlt`, {
                                                    required: "Value is required"
                                                })} />
                                                {errors.servicesSection?.items?.[index]?.imageAlt && <p className='text-red-500'>{errors.servicesSection?.items?.[index]?.imageAlt.message}</p>}
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='pl-3 font-bold'>Slug</Label>
                                                <Input type='text' placeholder='Slug' {...register(`servicesSection.items.${index}.slug`, {
                                                    required: "Value is required"
                                                })} />
                                                {errors.servicesSection?.items?.[index]?.slug && <p className='text-red-500'>{errors.servicesSection?.items?.[index]?.slug.message}</p>}
                                            </div>
                                        </div>


                                    </div>

                                    

                                </div>
                            ))}

                            <div className='flex justify-end'>
                                <Button type='button' className="" addItem onClick={() => servicesSectionAppend({ title: "", description: "", logo: "", logoAlt: "", image: "", imageAlt: "", slug: "" })}>Add Item</Button>
                            </div>

                        </div>
                    </div>


                </div>
                </AdminItemContainer>


                <AdminItemContainer>
                <Label className='' main>Sustainability Section</Label>
                <div className=' p-5  flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold'>Video</Label>
                            <Controller
                                name="sustainabilitySection.video"
                                control={control}
                                rules={{ required: "Video is required" }}
                                render={({ field }) => (
                                    <VideoUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.sustainabilitySection?.video && (
                                <p className="text-red-500">{errors.sustainabilitySection?.video.message}</p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold'>Poster</Label>
                            <Controller
                                name="sustainabilitySection.poster"
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => (
                                    <ImageUploader
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.sustainabilitySection?.poster && (
                                <p className="text-red-500">{errors.sustainabilitySection?.poster.message}</p>
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold'>Title</Label>
                            <Input type='text' placeholder='Title' {...register("sustainabilitySection.title", {
                                required: "Title is required"
                            })} />
                            {errors.sustainabilitySection?.title && <p className='text-red-500'>{errors.sustainabilitySection?.title.message}</p>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold'>Description</Label>
                            <Controller name="sustainabilitySection.description" control={control} render={({ field }) => {
                                return <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className='custom-quill'/>
                            }} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label className='font-bold'>Item Title</Label>
                            <Input type='text' placeholder='Item Title' {...register("sustainabilitySection.itemTitle", {
                                required: "Item Title is required"
                            })} />
                            {errors.sustainabilitySection?.itemTitle && <p className='text-red-500'>{errors.sustainabilitySection?.itemTitle.message}</p>}
                        </div>

                        <div>                          

                                {sustainabilitySectionItems.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b pb-5'>
                                        <div className='absolute top-2 right-2'>
                                            <RiDeleteBinLine onClick={() => sustainabilitySectionRemove(index)} className='cursor-pointer text-red-600' />
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <Label className='font-bold'>Logo</Label>
                                                <Controller
                                                    name={`sustainabilitySection.items.${index}.logo`}
                                                    control={control}
                                                    rules={{ required: "Logo is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            isLogo
                                                        />
                                                    )}
                                                />
                                                {errors.sustainabilitySection?.items?.[index]?.logo && (
                                                    <p className="text-red-500">{errors.sustainabilitySection?.items?.[index]?.logo.message}</p>
                                                )}
                                            </div>

                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Alt Tag</Label>
                                                    <Input type='text' placeholder='Alt Tag' {...register(`sustainabilitySection.items.${index}.logoAlt`, {
                                                        required: "Value is required"
                                                    })} />
                                                    {errors.sustainabilitySection?.items?.[index]?.logoAlt && <p className='text-red-500'>{errors.sustainabilitySection?.items?.[index]?.logoAlt.message}</p>}
                                                </div>
                                            </div>


                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label className='font-bold'>Title</Label>
                                                    <Input type='text' placeholder='Title' {...register(`sustainabilitySection.items.${index}.title`, {
                                                        required: "Value is required"
                                                    })} />
                                                    {errors.sustainabilitySection?.items?.[index]?.title && <p className='text-red-500'>{errors.sustainabilitySection?.items?.[index]?.title.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}

                                <div className='flex justify-end mt-2'>
                                    <Button type='button' className="" addItem onClick={() => sustainabilitySectionAppend({ title: "", logo: "", logoAlt: "" })}>Add Item</Button>
                                </div>

                        </div>



                    </div>

                </div>

                </AdminItemContainer>

                <div className='flex flex-col gap-2'>
                    <Label className='font-bold'>Meta Title</Label>
                    <Input type='text' placeholder='Meta Title' {...register("metaTitle")} />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label className='font-bold'>Meta Description</Label>
                    <Input type='text' placeholder='Meta Description' {...register("metaDescription")} />
                </div>

                <div className='flex justify-center'>
                    <Button type='submit' className="cursor-pointer text-white text-[16px] w-full">Submit</Button>
                </div>

            </form>
        </div>
    )
}

export default Home