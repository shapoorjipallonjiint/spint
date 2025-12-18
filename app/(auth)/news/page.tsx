"use client"

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MdDelete, MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import AdminItemContainer from '@/app/components/common/AdminItemContainer';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ImageUploader } from '@/components/ui/image-uploader'
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";



interface ProjectPageProps {
  metaTitle: string;
  metaTitle_ar: string;
  metaDescription: string;
  metaDescription_ar: string;
  title:string;
  title_ar:string;
}



export default function Projects() {

  const [topic, setTopic] = useState<string>("");
  const [topic_ar, setTopicAr] = useState<string>("");


  const [newsList, setNewsList] = useState<{_id:string,title:string,topic:string,topic_ar:string}[]>([]);
  const [topicList, setTopicList] = useState<{ _id: string, name: string, name_ar:string }[]>([]);

  const router = useRouter();


  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProjectPageProps>();

  
  const handleFetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news");
      if (response.ok) {
        const data = await response.json();
        setNewsList(data.data.news);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching news", error);
    }
  }

  const handleAddTopic = async () => {
    try {
      const response = await fetch("/api/admin/news/topic", {
        method: "POST",
        body: JSON.stringify({ name: topic,name_ar:topic_ar }),
      });
      if (response.ok) {
        const data = await response.json();
        setTopic("");
        toast.success(data.message);
        handleFetchTopic();
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error adding topic", error);
    }
  }

  const handleFetchTopic = async () => {
    try {
      const response = await fetch("/api/admin/news/topic");
      if (response.ok) {
        const data = await response.json();
        setTopicList(data.data);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching topic", error);
    }
  }

  const handleEditTopic = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news/topic?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: topic,name_ar:topic_ar }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        handleFetchTopic();
        setTopic("");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error editing topic", error);
    }
  }

  const handleDeleteTopic = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news/topic?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        handleFetchTopic();
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error deleting topic", error);
    }
  }



  const handleDeleteNews = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        handleFetchNews();
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error deleting news", error);
    }
  }

  const onSubmit = async (data: ProjectPageProps) => {
    try {
        const response = await fetch(`/api/admin/news`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const data = await response.json();
            toast.success(data.message);
            // router.push("/admin/commitment");
        }
    } catch (error) {
        console.log("Error in submitting news details", error);
    }
}

  const fetchNewsDetails = async() => {
    try {
      const response = await fetch("/api/admin/news");
      if(response.ok) {
        const data = await response.json();
        setValue("metaTitle", data.data.metaTitle);
        setValue("metaTitle_ar", data.data.metaTitle);
        setValue("metaDescription", data.data.metaDescription);
        setValue("metaDescription_ar", data.data.metaDescription);
        setValue("title", data.data.title);
        setValue("title_ar", data.data.title_ar);
      }else{
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching news details", error);
    }
  }

  useEffect(() => {
    handleFetchNews();
    handleFetchTopic();
    fetchNewsDetails();
  }, [])

  return (
    <div className="flex flex-col gap-5">

<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
  {/*English Version */}
<div className='flex flex-col gap-5'>

                      <AdminItemContainer>
                    <Label className='' main>First Section</Label>
                    
                    <div className='p-5 flex flex-col gap-2'>

                        <div>
                            <div className='flex flex-col gap-2'>
                                                            <Label className='font-bold'>Title</Label>
                                                            <Input type='text' placeholder='Title' {...register(`title`,{
                                                                required:"Title is required"
                                                            })} />
                                                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
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
            
                </div>


                  {/*Arabic Version */}
<div className='flex flex-col gap-5'>

                      <AdminItemContainer>
                    <Label className='' main>First Section</Label>
                    <div className='p-5 flex flex-col gap-2'>

                        <div>
                            <div className='flex flex-col gap-2'>
                                                            <Label className='font-bold'>Title</Label>
                                                            <Input type='text' placeholder='Title' {...register(`title_ar`)} />
                                                        </div>
                        </div>
                    
                    </div>
                </AdminItemContainer>


                <div className='flex flex-col gap-2'>
                                    <Label className='font-bold'>Meta Title</Label>
                                    <Input type='text' placeholder='Meta Title' {...register("metaTitle_ar")} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label className='font-bold'>Meta Description</Label>
                                    <Input type='text' placeholder='Meta Description' {...register("metaDescription_ar")} />
                                </div>
                
                                

                </div>

                <div className='col-span-2'>
                                    <Button type='submit' className="cursor-pointer text-white text-[16px] w-full">Submit</Button>
                                </div>

                </form>


      <div className="h-screen grid grid-cols-2 gap-5">

          <div className="h-full w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
            <div className="flex justify-between border-b-2 pb-2">
              <Label className="text-sm font-bold">Topic</Label>
              <Dialog>
                <DialogTrigger className="bg-black text-white px-2 py-1 rounded-md" onClick={() => {setTopic("");setTopicAr("")}}>Add Topic</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Topic</DialogTitle>
                    <DialogDescription className="flex flex-col gap-3">
                      <Label>Topic Name (English)</Label>
                      <Input type="text" placeholder="Topic Name" value={topic} onChange={(e) => setTopic(e.target.value)} />

                      <Label>Topic Name (Arabic)</Label>
                      <Input type="text" placeholder="Topic Name" value={topic_ar} onChange={(e) => setTopicAr(e.target.value)} />

                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={handleAddTopic}>Save</DialogClose>
                </DialogContent>

              </Dialog>
            </div>
            <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
              {topicList.map((item) => (
                <div className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                  <div className="text-[16px]">
                    {item.name}
                  </div>
                  <div className="flex gap-5">
                    <Dialog>
                      <DialogTrigger onClick={() => { setTopic(item.name);setTopicAr(item.name_ar)}}><MdEdit /></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Topic</DialogTitle>
                          <DialogDescription>
                            <Label>Topic Name (English)</Label>
                            <Input type="text" placeholder="Topic Name" value={topic} onChange={(e) => setTopic(e.target.value)} />

                            <Label>Topic Name (Arabic)</Label>
                            <Input type="text" placeholder="Topic Name" value={topic_ar} onChange={(e) => setTopicAr(e.target.value)} />

                          </DialogDescription>
                        </DialogHeader>
                        <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleEditTopic(item._id)}>Save</DialogClose>
                      </DialogContent>

                    </Dialog>



                    <Dialog>
                      <DialogTrigger><MdDelete /></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-2">
                          <DialogClose className="bg-black text-white px-2 py-1 rounded-md">No</DialogClose>
                          <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleDeleteTopic(item._id)}>Yes</DialogClose>
                        </div>

                      </DialogContent>

                    </Dialog>

                  </div>
                </div>
              ))}

            </div>
          </div>


        <div className="h-screen w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
          <div className="flex justify-between border-b-2 pb-2">
            <Label className="text-sm font-bold">News</Label>
            <Button className="bg-black text-white" onClick={() => router.push("/news/add")}>Add News</Button>
          </div>
          <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
            {newsList.map((item) => (
              <div className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                <div className="text-[16px]">
                  {item.title}
                </div>
                <div className="flex gap-5">
                  <MdEdit onClick={() => router.push(`/news/edit/${item._id}`)} />

                  <Dialog>
                    <DialogTrigger><MdDelete /></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                      </DialogHeader>
                      <div className="flex gap-2">
                        <DialogClose className="bg-black text-white px-2 py-1 rounded-md">No</DialogClose>
                        <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleDeleteNews(item._id)}>Yes</DialogClose>
                      </div>

                    </DialogContent>

                  </Dialog>
                </div>
              </div>
            ))}


          </div>
        </div>
      </div>
    </div>
  );
}
