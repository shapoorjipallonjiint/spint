"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { ImageUploader } from '@/components/ui/image-uploader'
import Image from 'next/image'
import { RiAiGenerateText } from 'react-icons/ri'
import { closestCorners, DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ImageCard from './ImageCard'
import { TbReorder } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import AdminItemContainer from '../common/AdminItemContainer'
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { statusData } from './statusData'



interface ProjectFormProps {
    firstSection:{
        title:string;
        title_ar:string;
        subTitle:string; 
        subTitle_ar:string; 
        coverImage:string;
        coverImageAlt:string;   
        coverImageAlt_ar:string;   
        status:string;
    };
    secondSection:{
        title:string;
        title_ar:string;
        location:string;
        sector:string;
        service:string;
        status:string;
        items:{
            key:string;
            key_ar:string;
            value:string;
            value_ar:string;
        }[]
    }
    thirdSection:{
        title:string;
        title_ar:string;
        items:{
            number:string;
            number_ar:string;
            value:string;
            value_ar:string;
        }[]
    }
    fourthSection:{
        title:string;
        title_ar:string;
        description:string;
        description_ar:string;
    }
    images:string[];
    sixthSection:{
        title:string;
        title_ar:string;
        subTitle:string;
        subTitle_ar:string;
        email:string;
        email_ar:string;
    },
    slug:string;
    thumbnail:string;
    thumbnailAlt:string;
    thumbnailAlt_ar:string;
    metaTitle:string;
    metaTitle_ar:string;
    metaDescription:string;
    metaDescription_ar:string;
}

const ProjectForm = ({ editMode }: { editMode?: boolean }) => {

    const router = useRouter();
    const {id} = useParams();

    const [sectorList, setSectorList] = useState<{_id: string; name: string; name_ar: string }[]>([]);
    const [locationList, setLocationList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);
    const [serviceList, setServiceList] = useState<{ _id: string; pageTitle: string; pageTitle_ar: string }[]>([]);
    const [reorderMode, setReorderMode] = useState(false);

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProjectFormProps>();


        const { fields: secondSectionItems, append: secondSectionAppend, remove: secondSectionRemove } = useFieldArray({
            control,
            name: "secondSection.items"
        });

        const { fields: thirdSectionItems, append: thirdSectionAppend, remove: thirdSectionRemove } = useFieldArray({
            control,
            name: "thirdSection.items"
        });



    const handleAddProject = async (data: ProjectFormProps) => {
        try {
            const response = await fetch(editMode ? `/api/admin/project?id=${id}` : `/api/admin/project`, {
                method: editMode ? "PATCH" : "POST",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                router.push("/admin/projects");
            }
        } catch (error) {
            console.log("Error in adding project", error);
        }
    }

    const fetchProjectData = async () => {
        try {
            const response = await fetch(`/api/admin/project?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setValue("secondSection", {
                    ...data.data.secondSection,
                    sector: data.data.secondSection.sector?._id || "",
                    location: data.data.secondSection.location?._id || "",
                    service: data.data.secondSection.service._id || "",
                  });
                  setValue("firstSection", data.data.firstSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                setValue("fourthSection", data.data.fourthSection);
                setValue("sixthSection", data.data.sixthSection);
                setValue("thumbnail", data.data.thumbnail);
                setValue("thumbnailAlt", data.data.thumbnailAlt);
                setValue("thumbnailAlt_ar", data.data.thumbnailAlt_ar);
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("images", data.data.images);
                setValue("slug", data.data.slug);
                setImageUrls(data.data.images);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error in fetching project data", error);
        }
    }


    const fetchLocation = async () => {
        try {
            const response = await fetch("/api/admin/project/country");
            if (response.ok) {
                const data = await response.json();
                setLocationList(data.data);
            }
        } catch (error) {
            console.log("Error in fetching location", error);
        }
    }

    const fetchSector = async () => {
        try {
            const response = await fetch("/api/admin/project/sector");
            if (response.ok) {
                const data = await response.json();
                setSectorList(data.data);
            }
        } catch (error) {
            console.log("Error in fetching sector", error);
        }
    }

        const fetchService = async () => {
        try {
            const response = await fetch("/api/admin/services");
            if (response.ok) {
                const data = await response.json();
                setServiceList(data.data);
            }
        } catch (error) {
            console.log("Error in fetching service", error);
        }
    }


    useEffect(() => {
        if (editMode) {
            fetchLocation().then(() => fetchSector()).then(() => fetchService()).then(() => fetchProjectData());
        } else {
            fetchLocation().then(() => fetchSector()).then(() => fetchService());
        }
    }, []);

    useEffect(() => {
        if (watch("slug") === undefined) return;
        const slug = watch("slug").replace(/\s+/g, '-');
        setValue("slug", slug);
    }, [watch("slug")])

    const handleAutoGenerate = () => {
        const name = watch("firstSection.title");
        if (!name) return;
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
        setValue("slug", slug);
    };



    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const handleImageUpload = async (uploadedUrl: string) => {
        setImageUrls((prev) => [...prev, uploadedUrl]);
        setValue("images", [...imageUrls, uploadedUrl]);
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
        setValue(
            "images",
            imageUrls.filter((_, index) => index !== indexToRemove)
        );
    };


    const getTaskPos = (id: string) => imageUrls.findIndex((item: string) => (item == id))
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = getTaskPos(active.id as string);
        const newIndex = getTaskPos(over.id as string);

        const newPosition = arrayMove(imageUrls, oldIndex, newIndex);
        setImageUrls(newPosition);
        setValue("images", newPosition);

    };


const secondStatus = watch("secondSection.status");

useEffect(() => {
  if (secondStatus) {
    setValue("firstSection.status", secondStatus);
  }
}, [secondStatus, setValue]);




    return (
        <form className='grid grid-cols-2 gap-10' onSubmit={handleSubmit(handleAddProject)}>
            {/*English Version */}
            <div className='flex flex-col gap-5 rounded-md'>

                <AdminItemContainer>
                    <Label className='' main>First Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("firstSection.title", { required: "Title is required" })} />
                            {errors.firstSection?.title && <p className='text-red-500'>{errors.firstSection.title.message}</p>}
                        </div>

                        <div>
                            <Label className=''>Sub Title</Label>
                            <Input type='text' placeholder='Sub Title' {...register("firstSection.subTitle", { required: "Sub Title is required" })} />
                            {errors.firstSection?.subTitle && <p className='text-red-500'>{errors.firstSection.subTitle.message}</p>}
                        </div>


                        <div>
                            <Label className='flex gap-2 items-center mb-1'>
                                Slug
                                <div className='flex gap-2 items-center bg-green-600 text-white p-1 rounded-md cursor-pointer w-fit' onClick={handleAutoGenerate}>
                                    <p>Auto Generate</p>
                                    <RiAiGenerateText />
                                </div>
                            </Label>
                            <Input type='text' placeholder='Slug' {...register("slug", {
                                required: "Slug is required", pattern: {
                                    value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                                    message: "Slug must contain only lowercase letters, numbers, and hyphens (no spaces)"
                                }
                            })} />
                            {errors.slug && <p className='text-red-500'>{errors.slug.message}</p>}
                        </div>

                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Cover Image</Label>
                                    <ImageUploader onChange={(url) => setValue("firstSection.coverImage", url)} value={watch("firstSection.coverImage")} />
                                    {errors.firstSection?.coverImage && <p className='text-red-500'>{errors.firstSection.coverImage.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Cover Image Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("firstSection.coverImageAlt")} />
                                    {errors.firstSection?.coverImageAlt && <p className='text-red-500'>{errors.firstSection.coverImageAlt.message}</p>}
                                </div>
                            </div>


                        </div>

                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Thumbnail</Label>
                                    <ImageUploader onChange={(url) => setValue("thumbnail", url)} value={watch("thumbnail")} />
                                    {errors.thumbnail && <p className='text-red-500'>{errors.thumbnail.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Thumbnail Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("thumbnailAlt")} />
                                    {errors.thumbnailAlt && <p className='text-red-500'>{errors.thumbnailAlt.message}</p>}
                                </div>
                            </div>


                        </div>

                    </div>

                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className='' main>Second Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("secondSection.title", { required: "Title is required" })} />
                            {errors.secondSection?.title && <p className='text-red-500'>{errors.secondSection.title.message}</p>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Location</Label>
                            <Controller
                                name="secondSection.location"
                                control={control}
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locationList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.location && <p className="text-red-500">{errors.secondSection.location.message}</p>}

                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label className=''>Sector</Label>
                            <Controller
                                name="secondSection.sector"
                                control={control}
                                rules={{ required: "Sector is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectorList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.sector && <p className="text-red-500">{errors.secondSection.sector.message}</p>}

                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Service</Label>
                            <Controller
                                name="secondSection.service"
                                control={control}
                                rules={{ required: "Service is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.pageTitle}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.service && <p className="text-red-500">{errors.secondSection.service.message}</p>}

                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Status</Label>
                            <Controller
                                name="secondSection.status"
                                control={control}
                                rules={{ required: "Status is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusData.map((item, index) => (
                                                <SelectItem key={index} value={item.name}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.status && <p className="text-red-500">{errors.secondSection.status.message}</p>}

                        </div>


                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Items</Label>
                                            <div className='border p-2 rounded-md flex flex-col gap-5'>
                
                
                                                {secondSectionItems.map((field, index) => (
                                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                                        <div className='absolute top-2 right-2'>
                                                            <RiDeleteBinLine onClick={() => secondSectionRemove(index)} className='cursor-pointer text-red-600' />
                                                        </div>
                
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Key</Label>
                                                                <Input type='text' placeholder='Key' {...register(`secondSection.items.${index}.key`)} />
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Value</Label>
                                                                <Input type='text' placeholder='Value' {...register(`secondSection.items.${index}.value`)} />
                                                            </div>
                                                        </div>
                
                                                    </div>
                                                ))}
                
                                                <div className='flex justify-end'>
                                                    <Button type='button' className="" addItem onClick={() => secondSectionAppend({ key: "", value: "",key_ar: "", value_ar: "" })}>Add Item</Button>
                                                </div>
                
                                            </div>
                                        </div>

                        
                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                                    <Label className='' main>Third Section</Label>
                                    <div className='p-5 flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            
                                            <div className='flex flex-col gap-1'>
                                                <Label className=' font-bold'>Title</Label>
                                                <Input type='text' placeholder='Title' {...register("thirdSection.title", {
                                                    required: "Title is required"
                                                })} />
                                                {errors.thirdSection?.title && <p className='text-red-500'>{errors.thirdSection?.title.message}</p>}
                                            </div>
                                        </div>
                
                
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Items</Label>
                                            <div className='border p-2 rounded-md flex flex-col gap-5'>
                
                
                                                {thirdSectionItems.map((field, index) => (
                                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                                        <div className='absolute top-2 right-2'>
                                                            <RiDeleteBinLine onClick={() => thirdSectionRemove(index)} className='cursor-pointer text-red-600' />
                                                        </div>
                
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Number</Label>
                                                                <Input type='text' placeholder='Number' {...register(`thirdSection.items.${index}.number`)} />
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Value</Label>
                                                                <Input type='text' placeholder='Number' {...register(`thirdSection.items.${index}.value`)} />
                                                            </div>
                                                        </div>
                
                                                    </div>
                                                ))}
                
                                                <div className='flex justify-end'>
                                                    <Button type='button' className="" addItem onClick={() => thirdSectionAppend({ number: "",value:"", number_ar: "",value_ar:"" })}>Add Item</Button>
                                                </div>
                
                                            </div>
                                        </div>
                
                
                                    </div>
                                </AdminItemContainer>


                                <AdminItemContainer>
                    <Label className='' main>Fourth Section</Label>
                    <div className='p-5 flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("fourthSection.title", {
                                    required: "Title is required"
                                })} />
                                {errors.fourthSection?.title && <p className='text-red-500'>{errors.fourthSection?.title.message}</p>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Description</Label>
                                <Textarea placeholder='Description' {...register("fourthSection.description", {
                                    required: "Description is required"
                                })} />
                                {errors.fourthSection?.description && <p className='text-red-500'>{errors.fourthSection?.description.message}</p>}
                            </div>
                        </div>

                    </div>
                </AdminItemContainer>


                <div className='flex flex-col gap-2 p-5 rounded-md bg-white shadow-md'>

                    <div>
                        <div className='flex justify-between items-center'>
                            <Label className="block text-sm">Images</Label>
                            <Button className="bg-green-600 text-white" type="button" onClick={() => setReorderMode(!reorderMode)}>{reorderMode ? <GiConfirmed /> : <TbReorder />}</Button>
                        </div>
                        <div className="mt-2">
                            <ImageUploader onChange={handleImageUpload} deleteAfterUpload={true} multiple={true} />
                        </div>

                        {reorderMode && <div className="mt-4 grid grid-cols-3 gap-4">
                            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                                <SortableContext items={imageUrls} strategy={verticalListSortingStrategy}>
                                    {imageUrls.map((url, index) => (
                                        <ImageCard key={url} url={url} index={index} handleRemoveImage={handleRemoveImage} id={url} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>}


                        {!reorderMode && <div className="mt-4 grid grid-cols-3 gap-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative h-40">
                                    <Image
                                        src={url}
                                        alt={`Uploaded image ${index + 1}`}
                                        className="h-full w-full object-cover rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>}
                    </div>



                </div>

                <AdminItemContainer>
                    <Label className='' main>Sixth Section</Label>
                    <div className='p-5 flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("sixthSection.title", {
                                    required: "Title is required"
                                })} />
                                {errors.sixthSection?.title && <p className='text-red-500'>{errors.sixthSection?.title.message}</p>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Sub Title</Label>
                                <Input placeholder='Sub Title' {...register("sixthSection.subTitle", {
                                    required: "Sub Title is required"
                                })} />
                                {errors.sixthSection?.subTitle && <p className='text-red-500'>{errors.sixthSection?.subTitle.message}</p>}
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Email</Label>
                                <Input placeholder='Email' {...register("sixthSection.email", {
                                    required: "Email is required"
                                })} />
                                {errors.sixthSection?.email && <p className='text-red-500'>{errors.sixthSection?.email.message}</p>}
                            </div>
                        </div>

                    </div>
                </AdminItemContainer>

                <div className="h-fit w-full p-2 border-2 border-gray-300 rounded-md mt-5">
                    <div className="flex justify-between border-b-2 pb-2">
                        <Label className="text-sm ">Meta Section</Label>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2  h-fit">
                        <div>
                            <Label>Meta title</Label>
                            <Input type="text" {...register("metaTitle")} />
                        </div>
                        <div>
                            <Label>Meta Description</Label>
                            <Input type="text" {...register("metaDescription")} />
                        </div>
                    </div>
                </div>

            </div>

            {/*Arabic Version */}
            <div className='flex flex-col gap-5 rounded-md'>

                <AdminItemContainer>
                    <Label className='' main>First Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("firstSection.title_ar")} />
                        </div>

                        <div>
                            <Label className=''>Sub Title</Label>
                            <Input type='text' placeholder='Sub Title' {...register("firstSection.subTitle_ar")} />
                        </div>


                        <div>
                            <Label className='flex gap-2 items-center mb-1'>
                                Slug
                            </Label>
                            <Input disabled type='text' placeholder='Slug' {...register("slug", {
                                required: "Slug is required", pattern: {
                                    value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                                    message: "Slug must contain only lowercase letters, numbers, and hyphens (no spaces)"
                                }
                            })} />
                        </div>

                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Cover Image</Label>
                                    <ImageUploader onChange={(url) => setValue("firstSection.coverImage", url)} value={watch("firstSection.coverImage")} />
                                    {errors.firstSection?.coverImage && <p className='text-red-500'>{errors.firstSection.coverImage.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Cover Image Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("firstSection.coverImageAlt_ar")} />
                                </div>
                            </div>


                        </div>

                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Thumbnail</Label>
                                    <ImageUploader onChange={(url) => setValue("thumbnail", url)} value={watch("thumbnail")} />
                                    {errors.thumbnail && <p className='text-red-500'>{errors.thumbnail.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Thumbnail Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("thumbnailAlt_ar")} />
                                </div>
                            </div>


                        </div>

                    </div>

                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className='' main>Second Section</Label>
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("secondSection.title_ar")} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Location</Label>
                            <Controller
                                name="secondSection.location"
                                control={control}
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <Select
                                    disabled
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locationList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.name_ar?.trim()
                              ? `${item.name_ar} (${item.name})`
                              : `${item.name}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.location && <p className="text-red-500">{errors.secondSection.location.message}</p>}

                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label className=''>Sector</Label>
                            <Controller
                            
                                name="secondSection.sector"
                                control={control}
                                rules={{ required: "Sector is required" }}
                                render={({ field }) => (
                                    <Select
                                    disabled
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sectorList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.name_ar?.trim()
                              ? `${item.name_ar} (${item.name})`
                              : `${item.name}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.sector && <p className="text-red-500">{errors.secondSection.sector.message}</p>}

                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Service</Label>
                            <Controller
                                name="secondSection.service"
                                control={control}
                                rules={{ required: "Service is required" }}
                                render={({ field }) => (
                                    <Select
                                    disabled
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.pageTitle_ar?.trim()
                              ? `${item.pageTitle_ar} (${item.pageTitle})`
                              : `${item.pageTitle}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.secondSection?.service && <p className="text-red-500">{errors.secondSection.service.message}</p>}

                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Status</Label>
                            <Controller
                                name="firstSection.status"
                                control={control}
                                rules={{ required: "Status is required" }}
                                render={({ field }) => (
                                    <Select
                                    disabled
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusData.map((item, index) => (
                                                <SelectItem key={index} value={item.name}>
                                                    {item.name_ar?.trim()
                              ? `${item.name_ar} (${item.name})`
                              : `${item.name}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.firstSection?.status && <p className="text-red-500">{errors.firstSection.status.message}</p>}

                        </div>


                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Items</Label>
                                            <div className='border p-2 rounded-md flex flex-col gap-5'>
                
                
                                                {secondSectionItems.map((field, index) => (
                                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                                        <div className='absolute top-2 right-2'>
                                                            <RiDeleteBinLine onClick={() => secondSectionRemove(index)} className='cursor-pointer text-red-600' />
                                                        </div>
                
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Key</Label>
                                                                <Input type='text' placeholder='Key' {...register(`secondSection.items.${index}.key_ar`)} />
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Value</Label>
                                                                <Input type='text' placeholder='Value' {...register(`secondSection.items.${index}.value_ar`)} />
                                                            </div>
                                                        </div>
                
                                                    </div>
                                                ))}
                
                                                <div className='flex justify-end'>
                                                    <Button type='button' className="" addItem onClick={() => secondSectionAppend({ key: "", value: "", key_ar: "", value_ar: "" })}>Add Item</Button>
                                                </div>
                
                                            </div>
                                        </div>

                        
                    </div>
                </AdminItemContainer>


                <AdminItemContainer>
                                    <Label className='' main>Third Section</Label>
                                    <div className='p-5 flex flex-col gap-2'>
                                        <div className='flex flex-col gap-2'>
                                            
                                            <div className='flex flex-col gap-1'>
                                                <Label className=' font-bold'>Title</Label>
                                                <Input type='text' placeholder='Title' {...register("thirdSection.title_ar")} />
                                            </div>
                                        </div>
                
                
                                        <div className='flex flex-col gap-2'>
                                            <Label className=' font-bold'>Items</Label>
                                            <div className='border p-2 rounded-md flex flex-col gap-5'>
                
                
                                                {thirdSectionItems.map((field, index) => (
                                                    <div key={field.id} className='grid grid-cols-2 gap-2 relative border-b  pb-5'>
                                                        <div className='absolute top-2 right-2'>
                                                            <RiDeleteBinLine onClick={() => thirdSectionRemove(index)} className='cursor-pointer text-red-600' />
                                                        </div>
                
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Number</Label>
                                                                <Input type='text' placeholder='Number' {...register(`thirdSection.items.${index}.number_ar`)} />
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex flex-col gap-2'>
                                                                <Label className=' font-bold'>Value</Label>
                                                                <Input type='text' placeholder='Number' {...register(`thirdSection.items.${index}.value_ar`)} />
                                                            </div>
                                                        </div>
                
                                                    </div>
                                                ))}
                
                                                <div className='flex justify-end'>
                                                    <Button type='button' className="" addItem onClick={() => thirdSectionAppend({ number: "",value:"", number_ar: "",value_ar:"" })}>Add Item</Button>
                                                </div>
                
                                            </div>
                                        </div>
                
                
                                    </div>
                                </AdminItemContainer>


                                <AdminItemContainer>
                    <Label className='' main>Fourth Section</Label>
                    <div className='p-5 flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("fourthSection.title_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Description</Label>
                                <Textarea placeholder='Description' {...register("fourthSection.description_ar")} />
                            </div>
                        </div>

                    </div>
                </AdminItemContainer>


                <div className='flex flex-col gap-2 p-5 rounded-md bg-white shadow-md'>

                    <div>
                        <div className='flex justify-between items-center'>
                            <Label className="block text-sm">Images</Label>
                            <Button className="bg-green-600 text-white" type="button" onClick={() => setReorderMode(!reorderMode)}>{reorderMode ? <GiConfirmed /> : <TbReorder />}</Button>
                        </div>
                        <div className="mt-2">
                            <ImageUploader onChange={handleImageUpload} deleteAfterUpload={true} multiple={true} />
                        </div>

                        {reorderMode && <div className="mt-4 grid grid-cols-3 gap-4">
                            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                                <SortableContext items={imageUrls} strategy={verticalListSortingStrategy}>
                                    {imageUrls.map((url, index) => (
                                        <ImageCard key={url} url={url} index={index} handleRemoveImage={handleRemoveImage} id={url} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>}


                        {!reorderMode && <div className="mt-4 grid grid-cols-3 gap-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative h-40">
                                    <Image
                                        src={url}
                                        alt={`Uploaded image ${index + 1}`}
                                        className="h-full w-full object-cover rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>}
                    </div>



                </div>

                <AdminItemContainer>
                    <Label className='' main>Sixth Section</Label>
                    <div className='p-5 flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Title</Label>
                                <Input type='text' placeholder='Title' {...register("sixthSection.title_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Sub Title</Label>
                                <Input placeholder='Sub Title' {...register("sixthSection.subTitle_ar")} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <Label className=' font-bold'>Email</Label>
                                <Input placeholder='Email' {...register("sixthSection.email_ar")} />
                            </div>
                        </div>

                    </div>
                </AdminItemContainer>

                <div className="h-fit w-full p-2 border-2 border-gray-300 rounded-md mt-5">
                    <div className="flex justify-between border-b-2 pb-2">
                        <Label className="text-sm ">Meta Section</Label>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2  h-fit">
                        <div>
                            <Label>Meta title</Label>
                            <Input type="text" {...register("metaTitle_ar")} />
                        </div>
                        <div>
                            <Label>Meta Description</Label>
                            <Input type="text" {...register("metaDescription_ar")} />
                        </div>
                    </div>
                </div>

            </div>

            <div className='col-span-2'>
                    <Button type='submit' className="cursor-pointer text-white w-full">Submit</Button>
                </div>

        </form>
    )
}

export default ProjectForm