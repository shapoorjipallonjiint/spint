"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";
import { Dice1 } from "lucide-react";

interface ProjectPageProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;
    banner: string;
    bannerAlt: string;
    bannerAlt_ar: string;
    pageTitle: string;
    pageTitle_ar: string;
    firstSection: {
        items: {
            number: string;
            number_ar: string;
            value: string;
            value_ar: string;
        }[];
    };
}

export default function Projects() {
    const [sector, setSector] = useState<string>("");
    const [sector_ar, setSectorAr] = useState<string>("");

    const [service, setService] = useState<string>("");
    const [service_ar, setServiceAr] = useState<string>("");

    const [country, setCountry] = useState<string>("");
    const [country_ar, setCountryAr] = useState<string>("");

    const [projectList, setProjectList] = useState<{ _id: string; firstSection: { title: string; description: string } }[]>(
        []
    );
    const [countryList, setCountryList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);
    const [sectorList, setSectorList] = useState<{ _id: string; name: string; name_ar: string }[]>([]);
    const [serviceList, setServiceList] = useState<{ _id: string; pageTitle: string; name_ar: string }[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProjectPageProps>();

    const {
        fields: firstSectionItems,
        append: firstSectionAppend,
        remove: firstSectionRemove,
    } = useFieldArray({
        control,
        name: "firstSection.items",
    });

    const handleFetchProjects = async () => {
        try {
            const response = await fetch("/api/admin/project");
            if (response.ok) {
                const data = await response.json();
                setProjectList(data.data.projects);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching projects", error);
        }
    };

    const handleAddSector = async () => {
        try {
            const response = await fetch("/api/admin/project/sector", {
                method: "POST",
                body: JSON.stringify({ name: sector, name_ar: sector_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                setSector("");
                toast.success(data.message);
                handleFetchSector();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error adding sector", error);
        }
    };

    const handleFetchSector = async () => {
        try {
            const response = await fetch("/api/admin/project/sector");
            if (response.ok) {
                const data = await response.json();
                setSectorList(data.data);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching sector", error);
        }
    };

    const handleEditSector = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project/sector?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ name: sector, name_ar: sector_ar }),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchSector();
                setSector("");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error editing sector", error);
        }
    };

    const handleDeleteSector = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project/sector?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchSector();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error deleting sector", error);
        }
    };

    // const handleAddService = async () => {
    //   try {
    //     const response = await fetch("/api/admin/project/service", {
    //       method: "POST",
    //       body: JSON.stringify({ name: service,name_ar:service_ar }),
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       setService("");
    //       toast.success(data.message);
    //       handleFetchService();
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error adding service", error);
    //   }
    // }

    const handleFetchService = async () => {
        try {
            const response = await fetch("/api/admin/services");
            if (response.ok) {
                const data = await response.json();
                setServiceList(data.data);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching service", error);
        }
    };

    // const handleEditService = async (id: string) => {
    //   try {
    //     const response = await fetch(`/api/admin/project/service?id=${id}`, {
    //       method: "PATCH",
    //       body: JSON.stringify({ name: service,name_ar:service_ar }),
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       toast.success(data.message);
    //       handleFetchService();
    //       setService("");
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error editing service", error);
    //   }
    // }

    // const handleDeleteService = async (id: string) => {
    //   try {
    //     const response = await fetch(`/api/admin/project/service?id=${id}`, {
    //       method: "DELETE",
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       toast.success(data.message);
    //       handleFetchService();
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error deleting service", error);
    //   }
    // }

    const handleFetchCountry = async () => {
        try {
            const response = await fetch("/api/admin/project/country");
            if (response.ok) {
                const data = await response.json();
                setCountryList(data.data);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching country", error);
        }
    };

    // const handleAddCountry = async () => {
    //   try {
    //     const response = await fetch("/api/admin/project/country", {
    //       method: "POST",
    //       body: JSON.stringify({ name: country,name_ar:country_ar }),
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       setCountry("");
    //       toast.success(data.message);
    //       handleFetchCountry();
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error adding country", error);
    //   }
    // }

    // const handleEditCountry = async (id: string) => {
    //   try {
    //     const response = await fetch(`/api/admin/project/country?id=${id}`, {
    //       method: "PATCH",
    //       body: JSON.stringify({ name: country,name_ar:country_ar }),
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       toast.success(data.message);
    //       handleFetchCountry();
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error editing country", error);
    //   }
    // }

    // const handleDeleteCountry = async (id: string) => {
    //   try {
    //     const response = await fetch(`/api/admin/project/country?id=${id}`, {
    //       method: "DELETE",
    //     });
    //     if (response.ok) {
    //       const data = await response.json();
    //       toast.success(data.message);
    //       handleFetchCountry();
    //     } else {
    //       const data = await response.json();
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     console.log("Error deleting country", error);
    //   }
    // }

    const handleDeleteProject = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/project?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                handleFetchProjects();
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error deleting project", error);
        }
    };

    const onSubmit = async (data: ProjectPageProps) => {
        try {
            const response = await fetch(`/api/admin/project`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                // router.push("/admin/commitment");
            }
        } catch (error) {
            console.log("Error in submitting project details", error);
        }
    };

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch("/api/admin/project");
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaTitle_ar", data.data.metaTitle);
                setValue("metaDescription", data.data.metaDescription);
                setValue("metaDescription_ar", data.data.metaDescription);
                setValue("banner", data.data.banner);
                setValue("bannerAlt", data.data.bannerAlt);
                setValue("bannerAlt_ar", data.data.bannerAlt);
                setValue("pageTitle", data.data.pageTitle);
                setValue("pageTitle_ar", data.data.pageTitle);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.items", data.data.firstSection.items);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Error fetching project details", error);
        }
    };

    useEffect(() => {
        handleFetchProjects();
        handleFetchSector();
        handleFetchCountry();
        handleFetchService();
        fetchProjectDetails();
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-10">
                {/*English Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner?.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input
                                                type="text"
                                                placeholder="Alt Tag"
                                                {...register(`bannerAlt`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.bannerAlt && <p className="text-red-500">{errors.bannerAlt.message}</p>}
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
                                                {...register(`pageTitle`, {
                                                    required: "Value is required",
                                                })}
                                            />
                                            {errors.pageTitle && <p className="text-red-500">{errors.pageTitle.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription")} />
                    </div>
                </div>

                {/*Arabic Version */}
                <div className="flex flex-col gap-5">
                    <AdminItemContainer>
                        <Label className="" main>
                            Banner Section
                        </Label>
                        <div className="p-5 rounded-md flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-2 relative pb-5">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Image</Label>
                                        <Controller
                                            name={`banner`}
                                            control={control}
                                            rules={{ required: "Image is required" }}
                                            render={({ field }) => (
                                                <ImageUploader value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        {errors.banner && <p className="text-red-500">{errors.banner.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Alt Tag</Label>
                                            <Input type="text" placeholder="Alt Tag" {...register(`bannerAlt_ar`)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label className="font-bold">Title</Label>
                                            <Input type="text" placeholder="Title" {...register(`pageTitle_ar`)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label className="" main>
                            First Section
                        </Label>
                        <div className="p-5 flex flex-col gap-2">
                            <Label>Items</Label>
                            <div className="border p-2 rounded-md">
                                {firstSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-2 gap-2 relative border-b pb-2 last:border-b-0"
                                    >
                                        <div className="absolute top-2 right-2">
                                            <RiDeleteBinLine
                                                onClick={() => firstSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Number</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.number_ar`)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <Label className="pl-3 font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Title"
                                                    {...register(`firstSection.items.${index}.value_ar`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="button"
                                    addItem
                                    onClick={() =>
                                        firstSectionAppend({ number: "", value: "", number_ar: "", value_ar: "" })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Title</Label>
                        <Input type="text" placeholder="Meta Title" {...register("metaTitle_ar")} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="font-bold">Meta Description</Label>
                        <Input type="text" placeholder="Meta Description" {...register("metaDescription_ar")} />
                    </div>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                        Submit
                    </Button>
                </div>
            </form>

            <div className="h-screen grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2 h-screen">
                    <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 pb-2">
                            <Label className="text-sm font-bold">Service</Label>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {serviceList.map((item) => (
                                <div
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.pageTitle}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-1/2 w-full p-5 shadow-md border-gray-300 rounded-md overflow-y-hidden bg-white">
                        <div className="flex justify-between border-b-2 pb-2">
                            <Label className="text-sm font-bold">Sector</Label>
                            <Dialog>
                                <DialogTrigger
                                    className="bg-black text-white px-2 py-1 rounded-md"
                                    onClick={() => {
                                        setSector("");
                                        setSectorAr("");
                                    }}
                                >
                                    Add Sector
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Sector</DialogTitle>
                                        <DialogDescription>
                                            <Label>Sector Name (English)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Sector Name"
                                                value={sector}
                                                onChange={(e) => setSector(e.target.value)}
                                            />

                                            <Label>Sector Name (Arabic)</Label>
                                            <Input
                                                type="text"
                                                placeholder="Sector Name"
                                                value={sector_ar}
                                                onChange={(e) => setSectorAr(e.target.value)}
                                            />
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose
                                        className="bg-black text-white px-2 py-1 rounded-md"
                                        onClick={handleAddSector}
                                    >
                                        Save
                                    </DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[80%]">
                            {sectorList.map((item) => (
                                <div
                                    className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                    key={item._id}
                                >
                                    <div className="text-[16px]">{item.name}</div>
                                    <div className="flex gap-5">
                                        <Dialog>
                                            <DialogTrigger
                                                onClick={() => {
                                                    setSector(item.name);
                                                    setSectorAr(item.name_ar);
                                                }}
                                            >
                                                <MdEdit className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Sector</DialogTitle>
                                                    <DialogDescription>
                                                        <Label>Sector Name (English)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sector Name"
                                                            value={sector}
                                                            onChange={(e) => setSector(e.target.value)}
                                                        />

                                                        <Label>Sector Name (Arabic)</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Sector Name"
                                                            value={sector_ar}
                                                            onChange={(e) => setSectorAr(e.target.value)}
                                                        />
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogClose
                                                    className="bg-black text-white px-2 py-1 rounded-md"
                                                    onClick={() => handleEditSector(item._id)}
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
                                                        onClick={() => handleDeleteSector(item._id)}
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
                    <div className="flex justify-between border-b-2 pb-2">
                        <Label className="text-sm font-bold">Projects</Label>
                        <p className="textsm">Count: {projectList.length}</p>
                        <Button className="bg-black text-white" onClick={() => router.push("/admin/projects/add")}>
                            Add Project
                        </Button>
                    </div>
                    <div className="mt-2 flex flex-col gap-2 overflow-y-scroll h-[90%]">
                        {projectList?.slice()?.reverse().map((item) => (
                            <div
                                className="flex justify-between border p-2 items-center rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                                key={item._id}
                            >
                                <div className="text-[16px]">{item.firstSection.title}
                                    {/* <p className="text-red-500">{item?.secondSection?.location?.name}</p> */}
                                </div>
                                <div className="flex gap-5">
                                    <MdEdit className="cursor-pointer" onClick={() => router.push(`/admin/projects/edit/${item._id}`)} />

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
                                                    onClick={() => handleDeleteProject(item._id)}
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
            </div>
        </div>
    );
}
