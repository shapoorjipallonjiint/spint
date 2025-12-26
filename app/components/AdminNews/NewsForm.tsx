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
import { useForm, Controller } from "react-hook-form";
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { ImageUploader } from '@/components/ui/image-uploader'
import { RiAiGenerateText } from 'react-icons/ri'
import AdminItemContainer from '../common/AdminItemContainer'
import { toast } from 'sonner'
import TinyEditor from "@/app/components/TinyMce/TinyEditor";



interface ProjectFormProps {
    title: string;
    title_ar: string;
    coverImage: string;
    coverImageAlt: string;
    coverImageAlt_ar: string;
    topic: string;
    date:string;
    date_ar:string;
    content: string;
    content_ar: string;
    slug: string;
    thumbnail: string;
    thumbnailAlt: string;
    thumbnailAlt_ar: string;
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
}

const NewsForm = ({ editMode }: { editMode?: boolean }) => {

    const router = useRouter();
    const { id } = useParams();

    const [topicList, setTopicList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProjectFormProps>();

    const handleAddNews = async (data: ProjectFormProps) => {
        try {
            const response = await fetch(editMode ? `/api/admin/news?id=${id}` : `/api/admin/news`, {
                method: editMode ? "PATCH" : "POST",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                router.push("/admin/news");
            }
        } catch (error) {
            console.log("Error in adding news", error);
        }
    }

    const fetchNewsData = async () => {
        try {
            const response = await fetch(`/api/admin/news?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setValue("title", data.data.title);
                setValue("title_ar", data.data.title_ar);
                setValue("topic", data.data.topic._id);
                setValue("coverImage", data.data.coverImage);
                setValue("coverImageAlt", data.data.coverImageAlt);
                setValue("coverImageAlt_ar", data.data.coverImageAlt_ar);
                setValue("content", data.data.content);
                setValue("content_ar", data.data.content_ar);
                setValue("thumbnail", data.data.thumbnail);
                setValue("thumbnailAlt", data.data.thumbnailAlt);
                setValue("thumbnailAlt_ar", data.data.thumbnailAlt_ar);
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("slug", data.data.slug);
                const isoDate = new Date(data.data.date).toISOString().split("T")[0];
                setValue("date", isoDate);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error in fetching news data", error);
        }
    }


    const fetchTopic = async () => {
        try {
            const response = await fetch("/api/admin/news/topic");
            if (response.ok) {
                const data = await response.json();
                setTopicList(data.data);
            }
        } catch (error) {
            console.log("Error in fetching topic", error);
        }
    }



    useEffect(() => {
        if (editMode) {
            fetchTopic().then(() => fetchNewsData());
        } else {
            fetchTopic();
        }
    }, []);

    useEffect(() => {
        if (watch("slug") === undefined) return;
        const slug = watch("slug").replace(/\s+/g, '-');
        setValue("slug", slug);
    }, [watch("slug")])

    const handleAutoGenerate = () => {
        const name = watch("title");
        if (!name) return;
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''); // remove leading/trailing dashes
        setValue("slug", slug);
    };


    const date = watch("date");

useEffect(() => {
  if (date) {
    setValue("date_ar", date);
  }
}, [date, setValue]);



    return (
        <form className='grid grid-cols-2 gap-10' onSubmit={handleSubmit(handleAddNews)}>
            {/*English Version */}
            <div className='flex flex-col gap-5 rounded-md'>

                <AdminItemContainer>
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("title", { required: "Title is required" })} />
                            {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
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

                        <div className='flex flex-col gap-2'>
                            <Label className=''>Topic</Label>
                            <Controller
                                name="topic"
                                control={control}
                                rules={{ required: "Topic is required" }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >

                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topicList.map((item, index) => (
                                                <SelectItem key={index} value={item._id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.topic && <p className="text-red-500">{errors.topic.message}</p>}

                        </div>


                        <div>
                    <Label className=''>Date</Label>
                    <Input type='date' placeholder='Date' max={new Date().toISOString().split("T")[0]} {...register("date", { required: "Date is required" })} />
                    {errors.date && <p className='text-red-500'>{errors.date.message}</p>}
                </div>



                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Cover Image</Label>
                                    <ImageUploader onChange={(url) => setValue("coverImage", url)} value={watch("coverImage")} />
                                    {errors.coverImage && <p className='text-red-500'>{errors.coverImage.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Cover Image Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("coverImageAlt")} />
                                    {errors.coverImageAlt && <p className='text-red-500'>{errors.coverImageAlt.message}</p>}
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

                        <div className="flex flex-col gap-1">
                            <Label className=''>Content</Label>
                            <Controller name="content" control={control} rules={{ required: "Content is required" }} render={({ field }) => {
                                return <TinyEditor setNewsContent={field.onChange} newsContent={field.value} />
                            }} />
                            {errors.content && <p className='text-red-500'>{errors.content.message}</p>}
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
                    <div className='p-5 rounded-md flex flex-col gap-5'>
                        <div>
                            <Label className=''>Title</Label>
                            <Input type='text' placeholder='Title' {...register("title_ar")} />
                        </div>


                        <div>
                            <Label className='flex gap-2 items-center mb-1'>
                                Slug
                                <div className='flex gap-2 items-center bg-slate-400 text-white p-1 rounded-md  w-fit'>
                                    <p>Auto Generate</p>
                                    <RiAiGenerateText />
                                </div>
                            </Label>
                            <Input disabled type='text' placeholder='Slug' {...register("slug", {
                                required: "Slug is required", pattern: {
                                    value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                                    message: "Slug must contain only lowercase letters, numbers, and hyphens (no spaces)"
                                }
                            })} />
                        </div>


                        <div className='flex flex-col gap-2'>
                            <Label className=''>Topic</Label>
                            <Controller
                                name="topic"
                                control={control}
                                rules={{ required: "Topic is required" }}
                                render={({ field }) => (
                                    <Select
                                        disabled
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue=""
                                    >

                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topicList.map((item, index) => (
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
                            {errors.topic && <p className="text-red-500">{errors.topic.message}</p>}

                        </div>

                        <div>
                    <Label className=''>Date</Label>
                    <Input disabled type='date' placeholder='Date' max={new Date().toISOString().split("T")[0]} {...register("date_ar")} />
                </div>

                        <div className='grid grid-cols-1 gap-2'>
                            <div>
                                <div>
                                    <Label className=''>Cover Image</Label>
                                    <ImageUploader onChange={(url) => setValue("coverImage", url)} value={watch("coverImage")} />
                                    {errors.coverImage && <p className='text-red-500'>{errors.coverImage.message}</p>}
                                </div>
                                <div>
                                    <Label className=''>Cover Image Alt</Label>
                                    <Input type='text' placeholder='Alt Tag' {...register("coverImageAlt_ar")} />
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

                        <div className="flex flex-col gap-1">
                            <Label className=''>Content</Label>
                            <Controller name="content_ar" control={control} render={({ field }) => {
                                return <TinyEditor setNewsContent={field.onChange} newsContent={field.value} />
                            }} />
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

export default NewsForm