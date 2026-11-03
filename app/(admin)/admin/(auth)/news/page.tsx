"use client"

import React, { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MdDelete, MdEdit, MdOpenInNew } from "react-icons/md";
import { Search } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";



interface ProjectPageProps {
  metaTitle: string;
  metaTitle_ar: string;
  metaDescription: string;
  metaDescription_ar: string;
  title: string;
  title_ar: string;
}



type NewsListItem = {
  _id: string;
  title: string;
  slug?: string;
  // populated by the news API (name / name_ar); can be missing if the topic was deleted
  topic?: { _id: string; name: string; name_ar?: string } | null;
};

// search text in a comparable form (ignores invisible / non-breaking spaces, case and extra spaces)
const normalizeForSearch = (text?: string) =>
  (text || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\s\u00A0]+/g, " ")
    .trim()
    .toLowerCase();

// same tab setup as the Projects page: one section at a time, News first
const PAGE_TABS = [
  { key: "news", label: "News" },
  { key: "topic", label: "Topic" },
  { key: "page", label: "Page" },
] as const;

export default function Projects() {

  const [activeTab, setActiveTab] = useState<(typeof PAGE_TABS)[number]["key"]>("news");

  const [topic, setTopic] = useState<string>("");
  const [topic_ar, setTopicAr] = useState<string>("");


  const [newsList, setNewsList] = useState<NewsListItem[]>([]);
  const [search, setSearch] = useState("");
  const [topicList, setTopicList] = useState<{ _id: string, name: string, name_ar: string }[]>([]);

  const router = useRouter();

  // News tab search: matches the title or the topic name
  const filteredNews = useMemo(() => {
    const term = normalizeForSearch(search);
    if (!term) return newsList;
    return newsList.filter(
      (item) =>
        normalizeForSearch(item.title).includes(term) || normalizeForSearch(item.topic?.name).includes(term)
    );
  }, [newsList, search]);


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
        body: JSON.stringify({ name: topic, name_ar: topic_ar }),
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
        body: JSON.stringify({ name: topic, name_ar: topic_ar }),
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

  const fetchNewsDetails = async () => {
    try {
      const response = await fetch("/api/admin/news");
      if (response.ok) {
        const data = await response.json();
        setValue("metaTitle", data.data.metaTitle);
        setValue("metaTitle_ar", data.data.metaTitle_ar);
        setValue("metaDescription", data.data.metaDescription);
        setValue("metaDescription_ar", data.data.metaDescription_ar);
        setValue("title", data.data.title);
        setValue("title_ar", data.data.title_ar);
      } else {
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
    // fills the admin content area exactly: the tabs stay put and only the lists inside scroll
    <div className="h-full flex flex-col gap-5">
      <div className="shrink-0 inline-flex w-fit rounded-md border overflow-hidden">
        {PAGE_TABS.map((tab, index) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm cursor-pointer ${index > 0 ? "border-l" : ""} ${
              activeTab === tab.key ? "bg-primary text-white" : "bg-white"
            }`}
          >
            {tab.label}
            {tab.key !== "page" && (
              <span className={`ms-1.5 text-xs ${activeTab === tab.key ? "text-white/70" : "text-black/40"}`}>
                {tab.key === "news" ? newsList.length : topicList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
      {/* Page: banner title + SEO. Hidden (not unmounted) on other tabs so unsaved edits are kept */}
      <form onSubmit={handleSubmit(onSubmit)} className={`grid grid-cols-2 gap-10 pb-5 ${activeTab === "page" ? "" : "hidden"}`}>
        {/*English Version */}
        <div className='flex flex-col gap-5'>

          <AdminItemContainer>
            <Label className='' main>First Section</Label>

            <div className='p-5 flex flex-col gap-2'>

              <div>
                <div className='flex flex-col gap-2'>
                  <Label className='font-bold'>Title</Label>
                  <Input type='text' placeholder='Title' {...register(`title`, {
                    required: "Title is required"
                  })} />
                  {errors.title && <p className="text-red-500">{errors.title.message}</p>}
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


          <AdminItemContainer>
            <Label main>SEO</Label>
            <div className="flex flex-col gap-2 p-5">
              <div className='flex flex-col gap-2'>
                <Label className='font-bold'>Meta Title</Label>
                <Input type='text' placeholder='Meta Title' {...register("metaTitle_ar")} />
              </div>
              <div className='flex flex-col gap-2'>
                <Label className='font-bold'>Meta Description</Label>
                <Input type='text' placeholder='Meta Description' {...register("metaDescription_ar")} />
              </div>
            </div>
          </AdminItemContainer>



        </div>

        <div className='col-span-2'>
          <Button type='submit' className="cursor-pointer text-white text-[16px] w-full">Submit</Button>
        </div>

      </form>


        {activeTab === "topic" && (
        <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
          <div className="flex justify-between border-b-2 border-black/20 pb-2">
            <Label className="text-sm font-bold">Topic</Label>
            <Dialog>
              <DialogTrigger className="bg-black text-white px-2 py-1 rounded-md" onClick={() => { setTopic(""); setTopicAr("") }}>Add Topic</DialogTrigger>
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
          <div className="mt-2 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pb-2">
            {topicList.length === 0 && <p className="py-10 text-center text-sm text-black/40">No topics yet.</p>}
            {topicList.map((item) => (
              <div className="flex justify-between border border-black/20 p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                <div className="text-[16px]">
                  {item.name}
                </div>
                <div className="flex gap-5">
                  <Dialog>
                    <DialogTrigger onClick={() => { setTopic(item.name); setTopicAr(item.name_ar) }}><MdEdit /></DialogTrigger>
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
        )}

        {activeTab === "news" && (
        <div className="h-full w-full p-5 shadow-md border-black/20 rounded-md overflow-y-hidden bg-white flex flex-col">
          <div className="flex justify-between border-b-2 border-black/20 pb-2">
            <Label className="text-sm font-bold">News</Label>
            <Button className="bg-black text-white" onClick={() => router.push("/admin/news/add")}>Add News</Button>
          </div>

          <div className="relative mt-3 shrink-0">
            <Input
              type="text"
              placeholder="Search by title or topic"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 text-sm"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="mt-2 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pb-2">
            {newsList.length === 0 && <p className="py-10 text-center text-sm text-black/40">No news yet.</p>}
            {newsList.length > 0 && filteredNews.length === 0 && (
              <p className="py-10 text-center text-sm text-black/40">No news matches &quot;{search.trim()}&quot;.</p>
            )}
            {filteredNews.map((item) => (
              <div className="flex justify-between gap-4 border border-black/20 p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                <div className="flex min-w-0 flex-col items-start gap-1.5">
                  <span className="w-full truncate text-[16px]">{item.title}</span>
                  {item.topic?.name && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {item.topic.name}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 gap-5 items-center">
                  {/* view the live article in a new tab (the admin page stays open) */}
                  {item.slug && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`/press-releases/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${item.title} on website`}
                          className="cursor-pointer transition-transform duration-200 hover:scale-125"
                        >
                          <MdOpenInNew />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>View on website</TooltipContent>
                    </Tooltip>
                  )}
                  <MdEdit className="cursor-pointer" onClick={() => router.push(`/admin/news/edit/${item._id}`)} />

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
        )}
      </div>
    </div>
  );
}
