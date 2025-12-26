"use client";

import { useEffect, useState } from "react";
import { IoIosImages } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/app/components/common/FormError";

interface GalleryPageProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
}

const AdminGallery = () => {
    const [category, setCategory] = useState("");
    const [categoryArabic, setCategoryArabic] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const [addOpen, setAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [categoryList, setCategoryList] = useState<{ _id: string; title: string; slug: string; title_ar: string }[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<GalleryPageProps>();

    const handleAddCategory = async () => {
        if (!category.trim()) {
            setCategoryError("Category name (English) is required");
            return;
        }

        setCategoryError("");

        try {
            const response = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: category.trim(),
                    name_ar: categoryArabic?.trim() || "",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setCategory("");
                setCategoryArabic("");
                setAddOpen(false);
                fetchGalleryData();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleEditCategory = async (id: string) => {
        if (!category.trim()) {
            setCategoryError("Category name (English) is required");
            return;
        }

        setCategoryError("");

        try {
            const response = await fetch(`/api/admin/gallery?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: category.trim(),
                    name_ar: categoryArabic?.trim() || "",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setEditingId(null);
                fetchGalleryData();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/gallery?id=${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            response.ok ? toast.success(data.message) : toast.error(data.message);
            fetchGalleryData();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const fetchGalleryData = async () => {
        try {
            const response = await fetch(`/api/admin/gallery/meta`);
            const data = await response.json();
            if (response.ok) {
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle_ar);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription_ar);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle_ar);
                setCategoryList(data.data.gallery);
            }
        } catch {
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const onSubmit = async (data: GalleryPageProps) => {
        try {
            const response = await fetch(`/api/admin/gallery/meta`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (response.ok) toast.success(res.message);
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
                {/*English Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register(`pageTitle`, {
                                        required: "Value is required",
                                    })}
                                />
                                <FormError error={errors.pageTitle?.message} />
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <div className="p-5">
                            <div className="flex flex-col gap-2 mb-4">
                                <Label className="font-bold">Meta Title</Label>
                                <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Meta Description</Label>
                                <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                                <FormError error={errors.metaDescription?.message} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                {/*Arabic Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register(`pageTitle_ar`)} />
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <div className="p-5">
                            <div className="flex flex-col gap-2 mb-4">
                                <Label className="font-bold">Meta Title</Label>
                                <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Meta Description</Label>
                                <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                        Submit
                    </Button>
                </div>
            </form>

            <AdminItemContainer>
                <div className="flex justify-between items-center p-5">
                    <p className="font-semibold">Gallery</p>

                    {/* ADD */}
                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger
                            className="bg-primary text-white px-3 py-1 rounded-md font-semibold"
                            onClick={() => {
                                setCategory("");
                                setCategoryArabic("");
                                setCategoryError("");
                                setAddOpen(true);
                            }}
                        >
                            Add Item
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="mb-4 text-lg">Add Item</DialogTitle>
                                <DialogDescription>
                                    <Label className="font-bold">Category Name</Label>
                                    <Input
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-2 mb-4"
                                    />
                                    <FormError error={categoryError} />

                                    <Label className="font-bold mt-4">Category Name Arabic</Label>
                                    <Input
                                        value={categoryArabic}
                                        onChange={(e) => setCategoryArabic(e.target.value)}
                                        className="mt-2 mb-4"
                                    />
                                </DialogDescription>
                            </DialogHeader>

                            <Button className="text-white font-bold bg-black" onClick={handleAddCategory}>
                                Save
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="px-5 flex flex-col gap-4 py-3">
                    {categoryList.length === 0 ? (
                        <p className="text-sm py-10">No items found</p>
                    ) : (
                        categoryList.map((item) => (
                            <div key={item._id} className="flex justify-between items-center border rounded-md p-4">
                                <div>
                                    <p>{item.title}</p>
                                    <p className="text-sm">{item.title_ar?.trim() || "----------"}</p>
                                </div>

                                <div className="flex gap-8 items-center">
                                    {/* EDIT */}
                                    <Dialog
                                        open={editingId === item._id}
                                        onOpenChange={(open) => {
                                            if (!open) setEditingId(null);
                                        }}
                                    >
                                        <DialogTrigger
                                            onClick={() => {
                                                setCategory(item.title);
                                                setCategoryArabic(item.title_ar);
                                                setCategoryError("");
                                                setEditingId(item._id);
                                            }}
                                        >
                                            <FaEdit className="text-3xl cursor-pointer" />
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-lg mb-4">Edit Item</DialogTitle>
                                                <DialogDescription>
                                                    <Label className="font-bold">Category Name</Label>
                                                    <Input
                                                        value={category}
                                                        onChange={(e) => setCategory(e.target.value)}
                                                        className="mt-2 mb-4"
                                                    />
                                                    <FormError error={categoryError} />

                                                    <Label className="font-bold mt-4">Category Name Arabic</Label>
                                                    <Input
                                                        value={categoryArabic}
                                                        onChange={(e) => setCategoryArabic(e.target.value)}
                                                        className="mt-2 mb-4"
                                                    />
                                                </DialogDescription>
                                            </DialogHeader>

                                            <Button
                                                className="text-white font-bold bg-black"
                                                onClick={() => handleEditCategory(item._id)}
                                            >
                                                Save
                                            </Button>
                                        </DialogContent>
                                    </Dialog>

                                    <Link href={`/admin/gallery/${item._id}`}>
                                        <IoIosImages className="text-3xl cursor-pointer" />
                                    </Link>

                                    {/* DELETE */}
                                    <Dialog>
                                        <DialogTrigger>
                                            <MdDelete className="text-3xl cursor-pointer" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure?</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2">
                                                <Button variant="outline">No</Button>
                                                <Button onClick={() => handleDeleteCategory(item._id)}>Yes</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </AdminItemContainer>
        </div>
    );
};

export default AdminGallery;
