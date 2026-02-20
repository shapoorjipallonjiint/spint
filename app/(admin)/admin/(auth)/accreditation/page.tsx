"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { MdDelete, MdEdit } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/ui/file-uploader";

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

    pageSubTitle: string;
    pageSubTitle_ar: string;

    pageDescription: string;
    pageDescription_ar: string;
}

const AccreditationPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<AccreditationFormProps>();

    const [fileImage, setFileImage] = useState<string>("");
    const [fileImageAlt, setFileImageAlt] = useState<string>("");
    const [fileImageAlt_ar, setFileImageAlt_ar] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [title_ar, setTitle_ar] = useState<string>("");
    const [file, setFile] = useState<string>("");

    const [category, setCategory] = useState("")
    const [category_ar, setCategory_ar] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")

    const [categoryList, setCategoryList] = useState<{ _id: string, name: string, name_ar: string }[]>([])
    const [accreditationList, setAccreditationList] = useState<{ _id: string, fileImage: string, fileImageAlt: string, fileImageAlt_ar: string, title: string, title_ar: string, category: string, file: string }[]>([])




    const handleAddAccreditation = async () => {
        try {
            const response = await fetch(`/api/admin/accreditation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileImage, fileImageAlt, fileImageAlt_ar, title, title_ar, category: selectedCategory, file }),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchAccreditaionData();
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in adding data", error);
        }
    };

    const handleUpdateAccreditation = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/accreditation?id=${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileImage, fileImageAlt, fileImageAlt_ar, title, title_ar, category: selectedCategory, file }),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchAccreditaionData();
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in adding data", error);
        }
    };


    const handleDeleteAccreditation = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/accreditation?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                fetchAccreditaionData();
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in deleting data", error);
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
                setAccreditationList(data.data.categories.flatMap((category: any) => category.accreditations));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        }
    };


    const handleAddCategory = async () => {
        try {
            const response = await fetch("/api/admin/accreditation/category", {
                method: "POST",
                body: JSON.stringify({ name: category, name_ar: category_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                setCategory("");
                setCategory_ar("");
                alert(data.message);
                handleFetchCategory();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error adding sector", error);
        }
    };


    const handleFetchCategory = async () => {
        try {
            const response = await fetch("/api/admin/accreditation/category");
            if (response.ok) {
                const data = await response.json();
                setCategoryList(data.data);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error fetching sector", error);
        }
    };

    const handleEditCategory = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/accreditation/category?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ name: category, name_ar: category_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                handleFetchCategory();
                setCategory("");
                setCategory_ar("");
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error editing category", error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/accreditation/category?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                handleFetchCategory();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error deleting category", error);
        }
    };



    useEffect(() => {
        fetchAccreditaionData();
        handleFetchCategory();
    }, []);

    return (
        <>
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

                    {/* <AdminItemContainer>
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
                </AdminItemContainer> */}

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


                    {/* <AdminItemContainer>
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
                </AdminItemContainer> */}


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


            <div className="h-screen grid grid-cols-2 gap-5 mt-10">
                <div className="flex flex-col gap-2 h-screen">
                    <div className="h-full w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 pb-2">
                            <Label className="text-sm font-bold">Category</Label>
                            <Dialog>
                                <DialogTrigger
                                    className="bg-black text-white px-2 py-1 rounded-md"
                                    onClick={() => {
                                        setCategory("");
                                        setCategory_ar("");
                                    }}
                                >
                                    Add Category
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Category</DialogTitle>
                                        <DialogDescription>
                                            <Label>Category Name (English)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Category Name"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            />

                                            <Label>Category Name (Arabic)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Category Name"
                                                value={category_ar}
                                                onChange={(e) => setCategory_ar(e.target.value)}
                                            />
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose
                                        className="bg-black text-white px-2 py-1 rounded-md"
                                        onClick={handleAddCategory}
                                    >
                                        Save
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {categoryList.map((item) => (
                                <div
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.name}</div>
                                    <div className="flex gap-5">
                                        <Dialog>
                                            <DialogTrigger
                                                onClick={() => {
                                                    setCategory(item.name);
                                                    setCategory_ar(item.name_ar);
                                                }}
                                            >
                                                <MdEdit className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Category</DialogTitle>
                                                    <DialogDescription>
                                                        <Label>Category Name (English)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Category Name"
                                                            value={category}
                                                            onChange={(e) => setCategory(e.target.value)}
                                                        />

                                                        <Label>Category Name (Arabic)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Category Name"
                                                            value={category_ar}
                                                            onChange={(e) => setCategory_ar(e.target.value)}
                                                        />
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogClose
                                                    className="bg-black text-white px-2 py-1 rounded-md"
                                                    onClick={() => handleEditCategory(item._id)}
                                                >
                                                    Save
                                                </DialogClose>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger>
                                                <MdDelete className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex gap-2">
                                                    <DialogClose className="bg-black text-white px-2 py-1 rounded-md">
                                                        No
                                                    </DialogClose>
                                                    <DialogClose
                                                        className="bg-black text-white px-2 py-1 rounded-md"
                                                        onClick={() => handleDeleteCategory(item._id)}
                                                    >
                                                        Yes
                                                    </DialogClose>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
            <div className="flex justify-between border-b-2 pb-2">
              <Label className="text-sm font-bold">Country</Label>
              <Dialog>
                <DialogTrigger className="bg-black text-white px-2 py-1 rounded-md" onClick={() => {setCountry("");setCountryAr("")}}>Add Country</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Country</DialogTitle>
                    <DialogDescription>
                      <Label>Country Name (English)</Label>
                      <Input type="text" placeholder="Country Name" value={country} onChange={(e) => setCountry(e.target.value)} />

                      <Label>Country Name (Arabic)</Label>
                      <Input type="text" placeholder="Country Name" value={country_ar} onChange={(e) => setCountryAr(e.target.value)} />


                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={handleAddCountry}>Save</DialogClose>
                </DialogContent>

              </Dialog>
            </div>
            <div className="h-full">

              <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                {countryList.map((item) => (
                  <div className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300" key={item._id}>
                    <div className="text-[16px]">
                      {item.name}
                    </div>
                    <div className="flex gap-5">
                      <Dialog>
                        <DialogTrigger onClick={() => { setCountry(item.name);setCountryAr(item.name_ar)}}><MdEdit /></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Country</DialogTitle>
                            <DialogDescription>
                              <Label>Country Name (English)</Label>
                              <Input type="text" placeholder="Country Name" value={country} onChange={(e) => setCountry(e.target.value)} />

                              <Label>Country Name (Arabic)</Label>
                              <Input type="text" placeholder="Country Name" value={country_ar} onChange={(e) => setCountryAr(e.target.value)} />


                            </DialogDescription>
                          </DialogHeader>
                          <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleEditCountry(item._id)}>Save</DialogClose>
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
                            <DialogClose className="bg-black text-white px-2 py-1 rounded-md" onClick={() => handleDeleteCountry(item._id)}>Yes</DialogClose>
                          </div>

                        </DialogContent>

                      </Dialog>

                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div> */}
                </div>

                <div className="h-screen w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                    <div className="border-b-2 pb-3">
                        <div className="flex justify-between items-center">
                            {/* LEFT: Title */}
                            <Label className="text-sm font-bold">Accreditations</Label>

                            {/* RIGHT: Controls */}
                            <div className="flex items-center gap-4">
                                <Dialog>
                                    <DialogTrigger
                                        className="bg-black text-white px-2 py-1 rounded-md"
                                        onClick={() => {
                                            setFileImage("");
                                            setFileImageAlt("");
                                            setFileImageAlt_ar("");
                                            setTitle("");
                                            setTitle_ar("");
                                            setSelectedCategory("");
                                            setFile("")
                                        }}
                                    >
                                        Add Accreditation
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Accreditation</DialogTitle>
                                            <div className="p-5 rounded-md flex flex-col gap-5">
                                                <div className="grid grid-cols-2 gap-2 relative pb-5">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col gap-2">
                                                            <Label className="font-bold">File Image</Label>

                                                            <ImageUploader value={fileImage} onChange={(url) => setFileImage(url)} />


                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">Alt Tag</Label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Alt Tag"
                                                                    value={fileImageAlt}
                                                                    onChange={(e) => setFileImageAlt(e.target.value)}
                                                                />

                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">Alt Tag (Arabic)</Label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Alt Tag"
                                                                    value={fileImageAlt_ar}
                                                                    onChange={(e) => setFileImageAlt_ar(e.target.value)}
                                                                />

                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">Title</Label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Title"
                                                                    value={title}
                                                                    onChange={(e) => setTitle(e.target.value)}
                                                                />

                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">Title (Arabic)</Label>
                                                                <Input
                                                                    type="text"
                                                                    placeholder="Title"
                                                                    value={title_ar}
                                                                    onChange={(e) => setTitle_ar(e.target.value)}
                                                                />

                                                            </div>

                                                            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                                                                <SelectTrigger className="w-[180px] text-sm">
                                                                    <SelectValue placeholder="Select Category" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-white max-h-[350px] overflow-y-scroll">
                                                                    {categoryList.map((category) => (
                                                                        <SelectItem key={category._id} value={category._id} className="hover:bg-gray-200">
                                                                            {category.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">File</Label>

                                                                <FileUploader value={file} onChange={(url) => setFile(url)} />


                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogHeader>
                                        <DialogClose
                                            className="bg-black text-white px-2 py-1 rounded-md"
                                            onClick={() => handleAddAccreditation()}
                                        >
                                            Save
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>


                    <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
                        {accreditationList.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between border p-2 items-center rounded-md shadow-md"
                            >
                                <div>
                                    {categoryList.find(category => category._id === item.category)?.name ?? "Unknown Category"}
                                    {" - "}
                                    {item.title}
                                </div>

                                <div className="flex gap-5">
                                    <Dialog>
                                        <DialogTrigger
                                        >
                                            <MdEdit onClick={() => { setFileImage(item.fileImage); setFileImageAlt(item.fileImageAlt); setFileImageAlt_ar(item.fileImageAlt_ar); setTitle(item.title); setTitle_ar(item.title_ar); setSelectedCategory(item.category); setFile(item.file) }} />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Accreditation</DialogTitle>
                                                <div className="p-5 rounded-md flex flex-col gap-5">
                                                    <div className="grid grid-cols-2 gap-2 relative pb-5">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <Label className="font-bold">File Image</Label>

                                                                <ImageUploader value={fileImage} onChange={(url) => setFileImage(url)} />


                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">Alt Tag</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Alt Tag"
                                                                        value={fileImageAlt}
                                                                        onChange={(e) => setFileImageAlt(e.target.value)}
                                                                    />

                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">Alt Tag (Arabic)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Alt Tag"
                                                                        value={fileImageAlt_ar}
                                                                        onChange={(e) => setFileImageAlt_ar(e.target.value)}
                                                                    />

                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">Title</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Title"
                                                                        value={title}
                                                                        onChange={(e) => setTitle(e.target.value)}
                                                                    />

                                                                </div>

                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">Title (Arabic)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Title"
                                                                        value={title_ar}
                                                                        onChange={(e) => setTitle_ar(e.target.value)}
                                                                    />

                                                                </div>

                                                                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                                                                    <SelectTrigger className="w-[180px] text-sm">
                                                                        <SelectValue placeholder="Select country" />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-white max-h-[350px] overflow-y-scroll">
                                                                        {categoryList.map((category) => (
                                                                            <SelectItem key={category._id} value={category._id} className="hover:bg-gray-200">
                                                                                {category.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>

                                                                <div className="flex flex-col gap-2">
                                                                    <Label className="font-bold">File</Label>

                                                                    <FileUploader value={file} onChange={(url) => setFile(url)} />


                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogHeader>
                                            <DialogClose
                                                className="bg-black text-white px-2 py-1 rounded-md"
                                                onClick={() => handleUpdateAccreditation(item._id)}
                                            >
                                                Save
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                    <MdDelete onClick={() => handleDeleteAccreditation(item._id)} />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </>
    );
};

export default AccreditationPage;
