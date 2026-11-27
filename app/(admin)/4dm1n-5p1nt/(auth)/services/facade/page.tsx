"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { LANG_TAB_FORM_ID, useAdminLangTab } from "@/contexts/adminLangTab";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { VideoUploader } from "@/components/ui/video-uploader";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FacadeProps {
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
        headName: string;
        headDesignation: string;
        headProfilePic: string;
        headProfilePicAlt: string;
        headName_ar: string;
        headDesignation_ar: string;
        headProfilePicAlt_ar: string;
    };
    secondSection: {
        title: string;
        title_ar: string;
        description: string;
        description_ar: string;
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
        image: string;
        imageAlt: string;
        imageAlt_ar: string;
    };
    // "Our Facade, Glazing & Metalwork" accordion (optional)
    systemsSection?: {
        title?: string;
        title_ar?: string;
        subTitle?: string;
        subTitle_ar?: string;
        items?: {
            title?: string;
            title_ar?: string;
            description?: string;
            description_ar?: string;
        }[];
    };
}

const FacadePage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<FacadeProps>();

    // English / Arabic tabs in the top bar (contexts/adminLangTab): one language column at a time; both stay
    // mounted (only hidden), so switching never loses typing and one Submit still saves both languages
    const { enabled: langTabs, lang, showErrors } = useAdminLangTab();
    const langColumn = (column: "en" | "ar", base: string) => `${base} ${langTabs && lang !== column ? "hidden" : ""}`;

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    const {
        fields: thirdSectionItems,
        append: thirdSectionAppend,
        remove: thirdSectionRemove,
    } = useFieldArray({
        control,
        name: "thirdSection.items",
    });

    const {
        fields: systemsSectionItems,
        append: systemsSectionAppend,
        remove: systemsSectionRemove,
    } = useFieldArray({
        control,
        name: "systemsSection.items",
    });

    const handleAddFacade = async (data: FacadeProps) => {
        try {
            const response = await fetch(`/api/admin/services/facade`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                // router.push("/4dm1n-5p1nt/commitment");
            }
        } catch (error) {
            console.log("Error in adding data", error);
        }
    };

    const fetchFacadeData = async () => {
        try {
            const response = await fetch(`/api/admin/services/facade`);
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
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                setValue("fourthSection", data.data.fourthSection);
                setValue("systemsSection", data.data.systemsSection);
                setValue("systemsSection.items", data.data.systemsSection?.items || []);
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.log("Error in fetching data", error);
        }
    };

    useEffect(() => {
        fetchFacadeData();
    }, []);

    return (
        <form id={LANG_TAB_FORM_ID} className={langTabs ? "grid grid-cols-1 gap-10" : "grid grid-cols-2 gap-10"} onSubmit={handleSubmit(handleAddFacade, showErrors)}>
            {/*English Version */}
            <div className={langColumn("en", "flex flex-col gap-5")}>
                <AdminItemContainer>
                    <Label className="" main>
                        Banner
                    </Label>
                    <div className="p-5 flex flex-col gap-6">
                        {/* the banner at the top of this service page */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Page Banner</p>
                                <p className="text-xs text-slate-500">Shown at the top of this service page.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="banner"
                                control={control}
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            {errors.banner && <p className="text-red-500">{errors.banner.message}</p>}
                        </div>
                                <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Alt Tag</Label>
                                <Input type="text" placeholder="Alt Tag" {...register("bannerAlt")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input type="text" placeholder="Page Title" {...register("pageTitle")} />
                            </div>
                                </div>
                            </div>
                        </div>
                        {/* not on this page: the Home page Services section and the Projects page service filter */}
                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Home Page &amp; Project Selector</p>
                                <p className="text-xs text-slate-500">Used on the Home page&apos;s Services section and the Projects page service filter, not in this page&apos;s banner.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Home Image</Label>
                                    <Controller
                                        name={`homeImage`}
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    {errors.homeImage && <p className="text-red-500">{errors.homeImage.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Home Image Alt Tag</Label>
                                        <Input
                                            type="text"
                                            placeholder="Alt Tag"
                                            {...register(`homeImageAlt`, {
                                                required: "Value is required",
                                            })}
                                        />
                                        {errors.homeImageAlt && (
                                            <p className="text-red-500">{errors.homeImageAlt.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                                <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title (for home and project page selector)</Label>
                                <Input type="text" placeholder="Title" {...register("title")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Description (for home)</Label>
                                <Textarea {...register("description")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Link (for home)</Label>
                                <Input type="text" placeholder="Link" {...register("link")} />
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("firstSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                {errors.firstSection?.title && (
                                    <p className="text-red-500">{errors.firstSection?.title.message}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="firstSection.description"
                                    control={control}
                                    rules={{ required: "Description is required" }}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="">Video</Label>
                                <Controller
                                    name="firstSection.video"
                                    control={control}
                                    rules={{ required: "Video is required" }}
                                    render={({ field }) => <VideoUploader value={field.value} onChange={field.onChange} />}
                                />
                                {errors.firstSection?.video && (
                                    <p className="text-red-500">{errors.firstSection?.video?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[16px] font-light">Poster</Label>
                                <Controller
                                    name="firstSection.poster"
                                    control={control}
                                    rules={{ required: "Poster is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                {errors.firstSection?.poster && (
                                    <p className="text-red-500">{errors.firstSection?.poster?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    {...register("secondSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                {errors.secondSection?.title && (
                                    <p className="text-red-500">{errors.secondSection?.title.message}</p>
                                )}
                            </div>

                            <div>
                                <Label className="font-bold">Items</Label>
                                <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    {secondSectionItems.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-3"
                                        >
                                            <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Expertise {index + 1}</span>
                                            <div className="absolute top-3 right-3">
                                                <RiDeleteBinLine
                                                    onClick={() => secondSectionRemove(index)}
                                                    className="cursor-pointer text-red-600"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader isLogo value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.image && (
                                                        <p className="text-red-500">
                                                            {errors.secondSection?.items?.[index]?.image.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Alt Tag</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Alt Tag"
                                                            {...register(`secondSection.items.${index}.imageAlt`, {
                                                                required: "Value is required",
                                                            })}
                                                        />
                                                        {errors.secondSection?.items?.[index]?.imageAlt && (
                                                            <p className="text-red-500">
                                                                {errors.secondSection?.items?.[index]?.imageAlt.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <Label className="text-sm font-bold">Description</Label>
                                                        <Controller
                                                            name={`secondSection.items.${index}.description`}
                                                            control={control}
                                                            rules={{ required: "Description is required" }}
                                                            render={({ field }) => {
                                                                return (
                                                                    <Textarea
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </div>
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
                                            secondSectionAppend({
                                                title: "",
                                                image: "",
                                                imageAlt: "",
                                                title_ar: "",
                                                imageAlt_ar: "",
                                                description: "",
                                                description_ar: "",
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register(`thirdSection.title`)} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {thirdSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-3"
                                    >
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Point {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`thirdSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.thirdSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">
                                                        {errors.thirdSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`thirdSection.items.${index}.imageAlt`)}
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
                                                        {...register(`thirdSection.items.${index}.title`)}
                                                    />
                                                </div>
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
                                        thirdSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            description: "",
                                            description_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Facade, Glazing &amp; Metalwork Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input type="text" placeholder="Title" {...register(`systemsSection.title`)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Sub Title (optional)</Label>
                            <Textarea placeholder="Sub Title" {...register(`systemsSection.subTitle`)} />
                        </div>
                        <div className="flex flex-col gap-5">
                            {systemsSectionItems.map((field, index) => (
                                <div key={field.id} className="relative flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10">
                                    <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">System {index + 1}</span>
                                    <RiDeleteBinLine
                                        onClick={() => systemsSectionRemove(index)}
                                        className="absolute top-3 right-3 cursor-pointer text-red-600"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Item {index + 1} Title</Label>
                                        <Input type="text" placeholder="Title" {...register(`systemsSection.items.${index}.title`)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Item {index + 1} List (use the bullet list button)</Label>
                                        <Controller
                                            name={`systemsSection.items.${index}.description`}
                                            control={control}
                                            render={({ field }) => (
                                                <ReactQuill theme="snow" value={field.value || ""} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                addItem
                                onClick={() =>
                                    systemsSectionAppend({ title: "", title_ar: "", description: "", description_ar: "" })
                                }
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input type="text" placeholder="" {...register("metaTitle")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Description</Label>
                            <Input type="text" placeholder="" {...register("metaDescription")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>

            {/*Arabic Version */}
            <div className={langColumn("ar", "flex flex-col gap-5")}>
                <AdminItemContainer>
                    <Label className="" main>
                        Banner
                    </Label>
                    <div className="p-5 flex flex-col gap-6">
                        {/* the banner at the top of this service page */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Page Banner</p>
                                <p className="text-xs text-slate-500">Shown at the top of this service page.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Controller
                                name="banner"
                                control={control}
                                rules={{ required: "Banner is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            {errors.banner && <p className="text-red-500">{errors.banner.message}</p>}
                        </div>
                                <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Alt Tag</Label>
                                <Input type="text" placeholder="Alt Tag" {...register("bannerAlt_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Page Title</Label>
                                <Input type="text" placeholder="Page Title" {...register("pageTitle_ar")} />
                            </div>
                                </div>
                            </div>
                        </div>
                        {/* not on this page: the Home page Services section and the Projects page service filter */}
                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Home Page &amp; Project Selector</p>
                                <p className="text-xs text-slate-500">Used on the Home page&apos;s Services section and the Projects page service filter, not in this page&apos;s banner.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Home Image</Label>
                                    <Controller
                                        name={`homeImage`}
                                        control={control}
                                        rules={{ required: "Image is required" }}
                                        render={({ field }) => (
                                            <ImageUploader value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    {errors.homeImage && <p className="text-red-500">{errors.homeImage.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Home Image Alt Tag</Label>
                                        <Input type="text" placeholder="Alt Tag" {...register(`homeImageAlt_ar`)} />
                                    </div>
                                </div>

                            </div>
                                <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title (for home and project page selector)</Label>
                                <Input type="text" placeholder="Title" {...register("title_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Description (for home)</Label>
                                <Textarea {...register("description_ar")} />
                            </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="font-bold">Link (for home)</Label>
                                    <Input type="text" disabled placeholder="Link" />
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>First Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("firstSection.title_ar")} />
                            </div>
                            <div>
                                <Label className="text-sm font-bold">Description</Label>
                                <Controller
                                    name="firstSection.description_ar"
                                    control={control}
                                    render={({ field }) => {
                                        return <Textarea value={field.value} onChange={field.onChange} />;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="">Video</Label>
                                <Controller
                                    name="firstSection.video"
                                    control={control}
                                    rules={{ required: "Video is required" }}
                                    render={({ field }) => <VideoUploader value={field.value} onChange={field.onChange} />}
                                />
                                {errors.firstSection?.video && (
                                    <p className="text-red-500">{errors.firstSection?.video?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="text-[16px] font-light">Poster</Label>
                                <Controller
                                    name="firstSection.poster"
                                    control={control}
                                    rules={{ required: "Poster is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                {errors.firstSection?.poster && (
                                    <p className="text-red-500">{errors.firstSection?.poster?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Second Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("secondSection.title_ar")} />
                            </div>

                            <div>
                                <Label className="font-bold">Items</Label>
                                <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    {secondSectionItems.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-3"
                                        >
                                            <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Expertise {index + 1}</span>
                                            <div className="absolute top-3 right-3">
                                                <RiDeleteBinLine
                                                    onClick={() => secondSectionRemove(index)}
                                                    className="cursor-pointer text-red-600"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Image</Label>
                                                    <Controller
                                                        name={`secondSection.items.${index}.image`}
                                                        control={control}
                                                        rules={{ required: "Image is required" }}
                                                        render={({ field }) => (
                                                            <ImageUploader isLogo value={field.value} onChange={field.onChange} />
                                                        )}
                                                    />
                                                    {errors.secondSection?.items?.[index]?.image && (
                                                        <p className="text-red-500">
                                                            {errors.secondSection?.items?.[index]?.image.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="font-bold">Alt Tag</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Alt Tag"
                                                            {...register(`secondSection.items.${index}.imageAlt_ar`)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <div>
                                                        <Label className="text-sm font-bold">Description</Label>
                                                        <Controller
                                                            name={`secondSection.items.${index}.description_ar`}
                                                            control={control}
                                                            render={({ field }) => {
                                                                return (
                                                                    <Textarea
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </div>
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
                                            secondSectionAppend({
                                                title: "",
                                                image: "",
                                                imageAlt: "",
                                                title_ar: "",
                                                imageAlt_ar: "",
                                                description: "",
                                                description_ar: "",
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Third Section</Label>

                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Label className="font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register(`thirdSection.title_ar`)} />
                            </div>
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {thirdSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-3"
                                    >
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Point {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => thirdSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`thirdSection.items.${index}.image`}
                                                    control={control}
                                                    rules={{ required: "Image is required" }}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.thirdSection?.items?.[index]?.image && (
                                                    <p className="text-red-500">
                                                        {errors.thirdSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`thirdSection.items.${index}.imageAlt_ar`)}
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
                                                        {...register(`thirdSection.items.${index}.title_ar`)}
                                                    />
                                                </div>
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
                                        thirdSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            description: "",
                                            description_ar: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Facade, Glazing &amp; Metalwork Section</Label>
                    <div className="p-5 rounded-md flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input type="text" placeholder="Title" {...register(`systemsSection.title_ar`)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Sub Title (optional)</Label>
                            <Textarea placeholder="Sub Title" {...register(`systemsSection.subTitle_ar`)} />
                        </div>
                        <div className="flex flex-col gap-5">
                            {systemsSectionItems.map((field, index) => (
                                <div key={field.id} className="relative flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10">
                                    <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">System {index + 1}</span>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Item {index + 1} Title</Label>
                                        <Input type="text" placeholder="Title" {...register(`systemsSection.items.${index}.title_ar`)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Item {index + 1} List (use the bullet list button)</Label>
                                        <Controller
                                            name={`systemsSection.items.${index}.description_ar`}
                                            control={control}
                                            render={({ field }) => (
                                                <ReactQuill theme="snow" value={field.value || ""} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-black/50">Items are added and removed in the English column.</p>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="flex flex-col gap-2 p-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Title</Label>
                            <Input type="text" placeholder="" {...register("metaTitle_ar")} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold">Description</Label>
                            <Input type="text" placeholder="" {...register("metaDescription_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>
            </div>

            {/* with the language tabs, Submit sits in the top bar */}
            <div className={langTabs ? "hidden" : "col-span-2"}>
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default FacadePage;
