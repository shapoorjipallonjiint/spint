"use client";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormError } from "@/app/components/common/FormError";

const IndiGallery = () => {
    const { id } = useParams();

    const [category, setCategory] = useState("");
    const [categoryArabic, setCategoryArabic] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const [categoryList, setCategoryList] = useState<
        { _id: string; title: string; title_ar: string }[]
    >([]);

    const [addOpen, setAddOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchGalleryData = async () => {
        try {
            const response = await fetch(`/api/admin/gallery?id=${id}`);
            const data = await response.json();
            if (response.ok) {
                setCategoryList(data.data.categories);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const validate = () => {
        if (!category.trim()) {
            setCategoryError("Title (English) is required");
            return false;
        }
        setCategoryError("");
        return true;
    };

    const handleAddCategory = async () => {
        if (!validate()) return;

        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${id}`, {
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
                setAddOpen(false);
                setCategory("");
                setCategoryArabic("");
                fetchGalleryData();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleEditCategory = async (categoryId: string) => {
        if (!validate()) return;

        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${categoryId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: category.trim(),
                    name_ar: categoryArabic?.trim() || "",
                    galleryId: id,
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

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const response = await fetch(`/api/admin/gallery/inside/category?id=${categoryId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ galleryId: id }),
            });

            const data = await response.json();
            response.ok ? toast.success(data.message) : toast.error(data.message);
            fetchGalleryData();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 p-5 rounded-md bg-white shadow-md">
                <div className="flex justify-between items-center">
                    <Label className="text-sm">Items</Label>

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
                                <DialogTitle className="text-lg mb-4">Add Item</DialogTitle>

                                <Label>Title</Label>
                                <Textarea
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                <FormError error={categoryError} />

                                <Label className="mt-3">Title Arabic</Label>
                                <Textarea
                                    value={categoryArabic}
                                    onChange={(e) => setCategoryArabic(e.target.value)}
                                />
                            </DialogHeader>

                            <Button className="bg-black text-white font-bold" onClick={handleAddCategory}>Save</Button>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-col gap-4 py-3">
                    {categoryList.length === 0 ? (
                        <p className="text-left text-sm py-10">
                            No items found
                        </p>
                    ) : (
                        categoryList.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-center border rounded-md p-4 hover:bg-gray-100 transition"
                            >
                                <div className="flex flex-col gap-2">
                                    <p>{item.title}</p>
                                    <p>{item.title_ar.trim().length > 0 ? item.title_ar : "-------"}</p>
                                </div>

                                <div className="flex gap-6 items-center">
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
                                            <FaEdit className="cursor-pointer text-3xl" />
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="mb-4 text-lg">Edit Item</DialogTitle>

                                                <Label>Title</Label>
                                                <Textarea
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                />
                                                <FormError error={categoryError} />

                                                <Label className="mt-3">Title Arabic</Label>
                                                <Textarea
                                                    value={categoryArabic}
                                                    onChange={(e) => setCategoryArabic(e.target.value)}
                                                />
                                            </DialogHeader>

                                            <Button className="bg-black text-white font-bold" onClick={() => handleEditCategory(item._id)}>
                                                Save
                                            </Button>
                                        </DialogContent>
                                    </Dialog>

                                    <Link href={`/gallery/${id}/${item._id}`}>
                                        <IoIosImages className="cursor-pointer text-3xl" />
                                    </Link>

                                    <MdDelete
                                        className="cursor-pointer text-3xl"
                                        onClick={() => handleDeleteCategory(item._id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndiGallery;
