"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Image from "next/image";
import { Move } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, Modifier, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import { VideoUploader } from "@/components/ui/video-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { toast } from "sonner";
import Link from "next/link";
import CredentialsCubesEditor from "@/app/components/common/CredentialsCubesEditor";
import { fromLegacyCubes, normalizeColumns } from "@/lib/credentialsCubes";
import { LANG_TAB_FORM_ID, useAdminLangTab } from "@/contexts/adminLangTab";

interface HomeFormProps {
    metaTitle: string;
    metaTitle_ar?: string;

    metaDescription: string;
    metaDescription_ar?: string;

    firstSection: {
        title: string;
        title_ar?: string;

        subTitle: {
            text?: string;
            text_ar?: string;
            link?: string;
            link_ar?: string;
        };

        video: string;
        videoAlt: string;
        videoAlt_ar: string;

        videoPosterImage?: string;
        videoPosterImageAlt?: string;
        videoPosterImageAlt_ar?: string;

        // home hero (/ and /home-v2): one video per visit, in this order
        rotatingVideos?: { video: string; poster?: string }[];

        // label above the hero social icons; empty = "Stay Connected"
        socialLabel?: string;
        socialLabel_ar?: string;
    };

    secondSection: {
        title: string;
        title_ar?: string;

        subTitle?: string;
        subTitle_ar?: string;

        description?: string;
        description_ar?: string;

        image?: string;
        imageAlt?: string;
        imageAlt_ar?: string;

        video?: string;
        videoAlt?: string;
        videoAlt_ar?: string;

        videoPosterImage?: string;
        videoPosterImageAlt?: string;
        videoPosterImageAlt_ar?: string;

        items: {
            key?: string;
            key_ar?: string;
            value?: string;
            value_ar?: string;
        }[];

        // READ MORE button; empty text = "READ MORE", empty link = the third section's link
        button?: {
            text?: string;
            text_ar?: string;
            link?: string;
            link_ar?: string;
        };

        // highlights cycling above the stats (homepage slide 2)
        highlights?: {
            title?: string;
            title_ar?: string;
            icon?: string;
            iconAlt?: string;
            iconAlt_ar?: string;
        }[];
    };

    thirdSection: {
        title: string;
        title_ar?: string;

        description: string;
        description_ar?: string;

        link?: string;
        link_ar?: string;

        // READ MORE text; empty = "READ MORE"
        buttonText?: string;
        buttonText_ar?: string;

        image: string;
        imageAlt: string;
        imageAlt_ar?: string;

        items: {
            key?: string;
            key_ar?: string;
            value?: string;
            value_ar?: string;
        }[];

        // right side background video (desktop)
        video?: string;
        videoPosterImage?: string;

        // left side of the slide ("Our Credentials"); cubes order: lib/credentialsCubes.ts
        credentials?: {
            title?: string;
            title_ar?: string;
            description?: string;
            description_ar?: string;
            cubes?: {
                value?: string;
                value_ar?: string;
                key?: string;
                key_ar?: string;
            }[];
            // cubes per column, left to right (cubes fill each column bottom to top)
            columns?: number[];
        };
    };

    fourthSection: {
        title: string;
        title_ar?: string;
    };

    fifthSection: {
        title: string;
        title_ar?: string;
        items: {
            image: string;
            imageAlt: string;
            imageAlt_ar: string;
            logo: string;
            logoAlt: string;
            logoAlt_ar: string;
            completedProjects: string;
            completedProjects_ar: string;
            title: string;
            title_ar: string;
        }[];
    };

    sixthSection: {
        title: string;
        title_ar?: string;

        // map legend; spGroup is also the label on the SP Group map dot. Empty = "SP Group" / "SP International"
        legend?: {
            spGroup?: string;
            spGroup_ar?: string;
            spInternational?: string;
            spInternational_ar?: string;
        };

        cities: {
            id?: string;
            name?: string;
            name_ar?: string;
            left?: string;
            top?: string;
            completedProjects?: string;
            employees?: string;
        }[];
    };

    seventhSection: {
        title?: string;
        title_ar?: string;

        image?: string;
        imageAlt?: string;
        imageAlt_ar?: string;

        items: {
            title?: string;
            title_ar?: string;
            description?: string;
            description_ar?: string;
        }[];

        button?: {
            text?: string;
            text_ar?: string;
            link?: string;
            link_ar?: string;
        };
    };
}

// the reorder list only moves up/down: drop the sideways part of the drag
const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 });

// ".../1712345678901clip.mp4?rlkey=..." -> "clip.mp4" (uploads are stored as <timestamp><original file name>)
const videoFileName = (url?: string) => {
    if (!url) return "";
    try {
        const last = new URL(url).pathname.split("/").pop() || "";
        return decodeURIComponent(last).replace(/^\d{13}/, "");
    } catch {
        return url;
    }
};

// one rotating video in the reorder list: its poster (or the video's first frame) + file name, dragged into place
const SortableVideoRow = ({ id, serial, video, poster }: { id: string; serial: number; video?: string; poster?: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const name = videoFileName(video);
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 px-3 py-2 bg-white cursor-grab active:cursor-grabbing touch-none ${
                isDragging ? "relative z-10 shadow-md" : ""
            }`}
        >
            <span className="min-w-7 text-sm text-black/50 tabular-nums">{serial}.</span>
            {/* pointer-events-none: the thumbnail never starts the browser's own image drag */}
            <div className="relative w-24 aspect-video shrink-0 rounded overflow-hidden bg-black/10 pointer-events-none">
                {poster ? (
                    <Image src={poster} alt="" fill sizes="96px" draggable={false} className="object-cover" />
                ) : video ? (
                    <video src={`${video}#t=0.1`} muted preload="metadata" className="w-full h-full object-cover" />
                ) : null}
            </div>
            <span className={`flex-1 min-w-0 truncate text-sm ${name ? "" : "text-black/40 italic"}`}>
                {name || "(no video uploaded)"}
            </span>
            <Move className="w-4 h-4 text-gray-500 shrink-0" />
        </div>
    );
};

const Home = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        control,
        watch,
        formState: { errors },
    } = useForm<HomeFormProps>();

    // English / Arabic tabs in the top bar: one column at a time (both stay mounted, so nothing is lost on switch)
    const { enabled: langTabs, lang, showErrors } = useAdminLangTab();
    const columnClass = (column: "en" | "ar") =>
        `flex flex-col gap-5 ${langTabs && lang !== column ? "hidden" : ""}`;

    // live cube values for the admin preview
    const credentialCubes = watch("thirdSection.credentials.cubes");
    const credentialColumns = watch("thirdSection.credentials.columns");

    const {
        fields: rotatingVideoItems,
        append: rotatingVideoAppend,
        remove: rotatingVideoRemove,
        replace: rotatingVideoReplace,
    } = useFieldArray({
        control,
        name: "firstSection.rotatingVideos",
    });

    // ---------- rotating videos reorder (same flow as Contact > Regional Office) ----------
    // Reorder shows a draggable list (poster + file name). Done applies the new order to the form; nothing is
    // written until Submit. null = not reordering, otherwise the draft order as field ids.
    const [videoReorderIds, setVideoReorderIds] = useState<string[] | null>(null);
    const isReorderingVideos = videoReorderIds !== null;
    const watchedRotatingVideos = watch("firstSection.rotatingVideos");

    // small move threshold so a click on a row doesn't start a drag
    const reorderSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    const startVideoReorder = () => setVideoReorderIds(rotatingVideoItems.map((f) => f.id));
    const cancelVideoReorder = () => setVideoReorderIds(null);

    const handleVideoReorderDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        setVideoReorderIds((ids) =>
            ids ? arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))) : ids
        );
    };

    const finishVideoReorder = () => {
        if (!videoReorderIds) return;
        const indexById = new Map(rotatingVideoItems.map((f, i) => [f.id, i]));
        const unchanged = videoReorderIds.every((id, i) => indexById.get(id) === i);
        if (!unchanged) {
            // current values (incl. unsaved uploads), in the new order
            const videos = getValues("firstSection.rotatingVideos") || [];
            rotatingVideoReplace(videoReorderIds.map((id) => videos[indexById.get(id) as number]));
            toast.success("Order updated - click Submit to save");
        }
        setVideoReorderIds(null);
    };

    const {
        fields: secondSectionItems,
        append: secondSectionAppend,
        remove: secondSectionRemove,
    } = useFieldArray({
        control,
        name: "secondSection.items",
    });

    const {
        fields: highlightItems,
        append: highlightAppend,
        remove: highlightRemove,
    } = useFieldArray({
        control,
        name: "secondSection.highlights",
    });

    const {
        fields: fifthSectionItems,
        append: fifthSectionAppend,
        remove: fifthSectionRemove,
    } = useFieldArray({
        control,
        name: "fifthSection.items",
    });

    // const {
    //     fields: sixthSectionCities,
    //     append: sixthSectionCitiesAppend,
    //     remove: sixthSectionCitiesRemove,
    // } = useFieldArray({
    //     control,
    //     name: "sixthSection.cities",
    // });

    const {
        fields: seventhSectionItems,
        append: seventhSectionAppend,
        remove: seventhSectionRemove,
    } = useFieldArray({
        control,
        name: "seventhSection.items",
    });

    const handleAddHome = async (data: HomeFormProps) => {
        try {
            // map countries are managed on the Map Locations page: only send the section titles here, so a save
            // from this page can never overwrite the cities with the copy loaded when the page was opened
            const { sixthSection, ...rest } = data;
            const payload: Record<string, unknown> = { ...rest };
            if (sixthSection?.title !== undefined) payload["sixthSection.title"] = sixthSection.title;
            if (sixthSection?.title_ar !== undefined) payload["sixthSection.title_ar"] = sixthSection.title_ar;
            if (sixthSection?.legend !== undefined) payload["sixthSection.legend"] = sixthSection.legend;

            const response = await fetch(`/api/admin/home`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
            }
        } catch (error) {
            console.log("Error in adding home", error);
            toast.error("Failed to update home data");
        }
    };

    const fetchHomeData = async () => {
        try {
            const response = await fetch(`/api/admin/home`, {
                cache: "no-store"
            });
            if (response.ok) {
                const data = await response.json();
                setValue("metaTitle", data.data.metaTitle);
                setValue("metaDescription", data.data.metaDescription);
                setValue("firstSection", data.data.firstSection);
                setValue("firstSection.rotatingVideos", data.data.firstSection?.rotatingVideos || []);
                setValue("secondSection", data.data.secondSection);
                setValue("secondSection.items", data.data.secondSection.items);
                setValue("secondSection.highlights", data.data.secondSection?.highlights || []);
                setValue("thirdSection", data.data.thirdSection);
                setValue("thirdSection.items", data.data.thirdSection.items);
                // credentials saved before the column layout existed: switch them to the new bottom-to-top order
                // (default layout) keeping every cube in exactly the same spot; stored only when Submit is clicked
                const credentials = data.data.thirdSection?.credentials;
                if (!normalizeColumns(credentials?.columns)) {
                    if (credentials?.cubes?.length) {
                        const converted = fromLegacyCubes(credentials.cubes);
                        setValue("thirdSection.credentials.cubes", converted.cubes);
                        setValue("thirdSection.credentials.columns", converted.columns);
                    } else {
                        setValue("thirdSection.credentials.columns", fromLegacyCubes([]).columns);
                    }
                }
                setValue("fourthSection", data.data.fourthSection);
                setValue("fifthSection", data.data.fifthSection);
                setValue("fifthSection.items", data.data.fifthSection.items);
                setValue("sixthSection", data.data.sixthSection);
                // setValue("sixthSection.cities", data.data.sixthSection.cities);
                setValue("seventhSection", data.data.seventhSection);
                setValue("seventhSection.items", data.data.seventhSection.items);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in fetching home data", error);
            toast.error("Failed to fetch home data");
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    return (
        <form
            id={LANG_TAB_FORM_ID}
            className={langTabs ? "grid grid-cols-1 gap-10" : "grid grid-cols-2 gap-10"}
            onSubmit={handleSubmit(handleAddHome, showErrors)}
        >
            {/* English Version */}
            <div className={columnClass("en")}>
                <AdminItemContainer>
                    <Label className="" main>
                        First Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className="">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("firstSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.title?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Text</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("firstSection.subTitle.text", {
                                    required: "Sub Title Text is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.subTitle?.text?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Link</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("firstSection.subTitle.link", {
                                    required: "Sub Title Link is required",
                                })}
                            />
                            <FormError error={errors.firstSection?.subTitle?.link?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Social Icons Label</Label>
                            <Input type="text" placeholder="Stay Connected" {...register("firstSection.socialLabel")} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <Label className="font-bold">Rotating Videos</Label>
                                {isReorderingVideos ? (
                                    <div className="flex items-center gap-2">
                                        <Button type="button" size="sm" variant="outline" onClick={cancelVideoReorder}>
                                            Cancel
                                        </Button>
                                        <Button type="button" size="sm" className="text-white bg-yellow-700" onClick={finishVideoReorder}>
                                            Done
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="text-white bg-green-700"
                                        disabled={rotatingVideoItems.length < 2}
                                        onClick={startVideoReorder}
                                    >
                                        Reorder
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-black/60 mt-0.5">
                                Home page hero: one video per visit, in this order. A visitor&apos;s 1st visit plays Video 1, the
                                next visit Video 2, and so on, then it starts again from Video 1. Each video&apos;s poster shows
                                while it loads. Leave empty to use the Video and Poster Image above.
                            </p>
                            {isReorderingVideos ? (
                            <div className="border border-black/20 rounded-md overflow-hidden divide-y divide-black/10 mt-2">
                                <DndContext
                                    sensors={reorderSensors}
                                    collisionDetection={closestCenter}
                                    modifiers={[restrictToVerticalAxis]}
                                    onDragEnd={handleVideoReorderDragEnd}
                                >
                                    <SortableContext items={videoReorderIds || []} strategy={verticalListSortingStrategy}>
                                        {(videoReorderIds || []).map((id, i) => {
                                            const index = rotatingVideoItems.findIndex((f) => f.id === id);
                                            const item = watchedRotatingVideos?.[index];
                                            return <SortableVideoRow key={id} id={id} serial={i + 1} video={item?.video} poster={item?.poster} />;
                                        })}
                                    </SortableContext>
                                </DndContext>
                            </div>
                            ) : (
                            <div className="border border-black/20 p-2 rounded-md flex flex-col gap-5 mt-2">
                                {rotatingVideoItems.map((field, index) => (
                                    <div key={field.id} className="flex flex-col gap-2 relative border-b border-black/20 pb-5">
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => rotatingVideoRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <Label className="font-bold">Video {index + 1}</Label>
                                        <div className="flex gap-4 justify-between">
                                            <div className="flex flex-col w-1/2 gap-2">
                                                <Label className="font-bold">Video</Label>
                                                <Controller
                                                    name={`firstSection.rotatingVideos.${index}.video`}
                                                    control={control}
                                                    rules={{ required: "Upload a video or remove this row" }}
                                                    render={({ field }) => (
                                                        <VideoUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                <FormError error={errors.firstSection?.rotatingVideos?.[index]?.video?.message} />
                                            </div>
                                            <div className="flex flex-col w-1/2 gap-2">
                                                <Label className="font-bold">Poster Image (optional)</Label>
                                                <Controller
                                                    name={`firstSection.rotatingVideos.${index}.poster`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end">
                                    <Button type="button" addItem onClick={() => rotatingVideoAppend({ video: "", poster: "" })}>
                                        Add Video
                                    </Button>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Second Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("secondSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.title?.message} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title"
                                {...register("secondSection.subTitle", {
                                    required: "Sub Title is required",
                                })}
                            />
                            <FormError error={errors.secondSection?.subTitle?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`secondSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.secondSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`secondSection.imageAlt`)} />
                                <FormError error={errors.secondSection?.imageAlt?.message} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Video</Label>
                            <Controller
                                name={`secondSection.video`}
                                control={control}
                                rules={{ required: "Video is required" }}
                                render={({ field }) => (
                                    <VideoUploader value={field.value} onChange={field.onChange} />
                                )}
                            />
                            <FormError error={errors.secondSection?.video?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Button Text</Label>
                                <Input type="text" placeholder="READ MORE" {...register("secondSection.button.text")} />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Button Link (empty = Third Section link)</Label>
                                <Input type="text" placeholder="Link" {...register("secondSection.button.link")} />
                            </div>
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-2 gap-4 xl:grid-cols-4">
                                {secondSectionItems.map((field, index) => (
                                    <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Stat {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => secondSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Key"
                                                    {...register(`secondSection.items.${index}.key`, {
                                                        required: "Key is required",
                                                    })}
                                                />
                                                <FormError error={errors.secondSection?.items?.[index]?.key?.message} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`secondSection.items.${index}.value`, {
                                                        required: "Value is required",
                                                    })}
                                                />
                                                <FormError error={errors.secondSection?.items?.[index]?.value?.message} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="col-span-full flex justify-end">
                                    <Button
                                        type="button"
                                        className=""
                                        addItem
                                        onClick={() =>
                                            secondSectionAppend({
                                                key: "",
                                                key_ar: "",
                                                value: "",
                                                value_ar: "",
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 border-t border-black/20 pt-5 mt-2">
                            <Label className="font-bold">Highlights</Label>
                        <p className="text-sm text-black/50">
                            The icon + title that cycle above the stats on the homepage.
                        </p>
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {highlightItems.map((field, index) => (
                            <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Highlight {index + 1}</span>
                                    <RiDeleteBinLine
                                        onClick={() => highlightRemove(index)}
                                        className="absolute top-3 right-3 cursor-pointer text-red-600"
                                    />
                                    <Controller
                                        name={`secondSection.highlights.${index}.icon`}
                                        control={control}
                                        render={({ field }) => <ImageUploader isLogo value={field.value} onChange={field.onChange} />}
                                    />
                                <div className="flex flex-col gap-1">
                                    <Label>Icon Alt</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register(`secondSection.highlights.${index}.iconAlt`)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Title</Label>
                                    <Input type="text" placeholder="Title" {...register(`secondSection.highlights.${index}.title`)} />
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                addItem
                                onClick={() => highlightAppend({ title: "", title_ar: "", icon: "", iconAlt: "", iconAlt_ar: "" })}
                            >
                                Add Highlight
                            </Button>
                        </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    {/* Third Section = homepage slide 3: "Our Credentials" (left) + "About SP International" (right).
                    The old image and items are no longer shown on the site; they are not edited here but are kept
                    as they are (loaded with the section and saved back unchanged). */}
                    <Label className="" main>
                        Third Section
                    </Label>
                    <div className="p-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold text-base">Our Credentials (left side)</Label>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Title</Label>
                                <Input type="text" placeholder="e.g. Our Credentials" {...register("thirdSection.credentials.title")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Description</Label>
                                <Textarea placeholder="Description" {...register("thirdSection.credentials.description")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Cubes</Label>
                                <CredentialsCubesEditor
                                    setValue={setValue}
                                    cubes={credentialCubes}
                                    name="thirdSection.credentials.cubes"
                                    columns={credentialColumns}
                                    columnsName="thirdSection.credentials.columns"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-black/20 pt-4">
                            <Label className="font-bold text-base">About SP International (right side)</Label>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Main Title"
                                    {...register("thirdSection.title", {
                                        required: "Title is required",
                                    })}
                                />
                                <FormError error={errors.thirdSection?.title?.message} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Description</Label>
                                <Textarea
                                    placeholder="Description"
                                    {...register("thirdSection.description", {
                                        required: "Description is required",
                                    })}
                                />
                                <FormError error={errors.thirdSection?.description?.message} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Link (Read More)</Label>
                                <Input
                                    type="text"
                                    placeholder="Link"
                                    {...register("thirdSection.link", {
                                        required: "Link is required",
                                    })}
                                />
                                <FormError error={errors.thirdSection?.link?.message} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Button Text</Label>
                                <Input type="text" placeholder="READ MORE" {...register("thirdSection.buttonText")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Background Video (desktop, used for both languages)</Label>
                                <Controller
                                    name="thirdSection.video"
                                    control={control}
                                    render={({ field }) => <VideoUploader value={field.value} onChange={field.onChange} />}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Video Poster Image (shown until the video loads)</Label>
                                <Controller
                                    name="thirdSection.videoPosterImage"
                                    control={control}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fourth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("fourthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.fourthSection?.title?.message} />
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fifth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("fifthSection.title")}
                            />
                            <FormError error={errors.fifthSection?.title?.message} />
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {fifthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-4"
                                    >
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Sector {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => fifthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.image && (
                                                    <p data-form-error className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.imageAlt`)}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.imageAlt && (
                                                        <p data-form-error className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.imageAlt.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Logo</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.logo`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader isLogo value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.logo && (
                                                    <p data-form-error className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.logo.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.logoAlt`)}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.logoAlt && (
                                                        <p data-form-error className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.logoAlt.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.title`)}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.title && (
                                                        <p data-form-error className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.title.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Completed Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.completedProjects`)}
                                                    />
                                                    {errors.fifthSection?.items?.[index]?.completedProjects && (
                                                        <p data-form-error className="text-red-500">
                                                            {errors.fifthSection?.items?.[index]?.completedProjects.message}
                                                        </p>
                                                    )}
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
                                        fifthSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            logo: "",
                                            logoAlt: "",
                                            logoAlt_ar: "",
                                            completedProjects: "",
                                            completedProjects_ar: "",
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
                    <Label className="" main>
                        Sixth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input
                                type="text"
                                placeholder="Main Title"
                                {...register("sixthSection.title", {
                                    required: "Title is required",
                                })}
                            />
                            <FormError error={errors.sixthSection?.title?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Legend: SP Group (also on the map dot)</Label>
                                <Input type="text" placeholder="SP Group" {...register("sixthSection.legend.spGroup")} />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Legend: SP International</Label>
                                <Input type="text" placeholder="SP International" {...register("sixthSection.legend.spInternational")} />
                            </div>
                        </div>
                    </div>
                    {/* <div className="px-5 pb-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-5 rounded-md flex flex-col gap-5 mt-0.5">
                            {sixthSectionCities.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 p-2 relative border-b pb-5">
                                    <div className="absolute top-3 right-3">
                                        <RiDeleteBinLine
                                            onClick={() => sixthSectionCitiesRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">ID (name)</Label>
                                        <Input
                                            type="text"
                                            placeholder="ID (name)"
                                            {...register(`sixthSection.cities.${index}.id`, {
                                                required: "ID (name) is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.id?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Name"
                                            {...register(`sixthSection.cities.${index}.name`, {
                                                required: "Name is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.name?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Left (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Left coordinate"
                                            {...register(`sixthSection.cities.${index}.left`, {
                                                required: "Left coordinate is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.left?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Top (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Top coordinate"
                                            {...register(`sixthSection.cities.${index}.top`, {
                                                required: "Top coordinate is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.top?.message} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Iconic Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Iconic projects"
                                            {...register(`sixthSection.cities.${index}.iconicProjects`, {
                                                required: "Iconic projects is required",
                                            })}
                                        />
                                        <FormError error={errors.sixthSection?.cities?.[index]?.iconicProjects?.message} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Completed Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Completed projects"
                                            {...register(`sixthSection.cities.${index}.completedProjects`, {
                                                required: "Completed projects is required",
                                            })}
                                        />
                                        <FormError
                                            error={errors.sixthSection?.cities?.[index]?.completedProjects?.message}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Dedicated Employees</Label>
                                        <Input
                                            type="text"
                                            placeholder="Dedicated employees"
                                            {...register(`sixthSection.cities.${index}.dedicatedEmployees`, {
                                                required: "Dedicated employees is required",
                                            })}
                                        />
                                        <FormError
                                            error={errors.sixthSection?.cities?.[index]?.dedicatedEmployees?.message}
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
                                        sixthSectionCitiesAppend({
                                            id: "",
                                            name: "",
                                            name_ar: "",
                                            left: "",
                                            top: "",
                                            iconicProjects: "",
                                            completedProjects: "",
                                            dedicatedEmployees: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex justify-end p-5">
                        <Link href="/4dm1n-5p1nt/home/map-locations">
                            <Button className="bg-black text-white">Manage Map Locations</Button>
                        </Link>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Seventh Section
                    </Label>
                    <div className="px-5 pt-2 flex flex-col gap-2">
                        <Label className=" font-bold">Title</Label>
                        <Textarea
                            placeholder="Title"
                            {...register("seventhSection.title", {
                                required: "Title is required",
                            })}
                        />
                        <FormError error={errors.seventhSection?.title?.message} />
                    </div>
                    <div className="flex gap-4 px-5">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image</Label>
                            <Controller
                                name={`seventhSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.seventhSection?.image?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Image Alt Tag" {...register(`seventhSection.imageAlt`)} />
                            <FormError error={errors.seventhSection?.imageAlt?.message} />
                        </div>
                    </div>
                    <div className="flex px-5 pt-2 pb-2 w-full gap-4 justify-between">
                        <div className="flex flex-col gap-2 w-full">
                            <Label className=" font-bold">Button Text</Label>
                            <Input
                                type="text"
                                placeholder="Button Text"
                                {...register("seventhSection.button.text", {
                                    required: "Button text is required",
                                })}
                            />
                            <FormError error={errors.seventhSection?.button?.text?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Label className="font-bold">Button Link</Label>
                            <Input
                                type="text"
                                placeholder="Button Link"
                                {...register("seventhSection.button.link", {
                                    required: "Button link is required",
                                })}
                            />
                            <FormError error={errors.seventhSection?.button?.link?.message} />
                        </div>
                    </div>
                    <Label className="mx-5 font-bold">Items</Label>
                    <div className="m-5 mt-1 grid grid-cols-2 gap-4">
                        {seventhSectionItems.map((field, index) => (
                            <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Item {index + 1}</span>
                                <div className="absolute top-3 right-3">
                                    <RiDeleteBinLine
                                        onClick={() => seventhSectionRemove(index)}
                                        className="cursor-pointer text-red-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register(`seventhSection.items.${index}.title`, {
                                            required: "Title is required",
                                        })}
                                    />
                                    <FormError error={errors.seventhSection?.items?.[index]?.title?.message} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Description"
                                        {...register(`seventhSection.items.${index}.description`, {
                                            required: "Description is required",
                                        })}
                                    />
                                    <FormError error={errors.seventhSection?.items?.[index]?.description?.message} />
                                </div>
                            </div>
                        ))}

                        <div className="col-span-full flex justify-end">
                            <Button
                                type="button"
                                className=""
                                addItem
                                onClick={() =>
                                    seventhSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                    })
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

            {/* Arabic Version */}
            <div className={columnClass("ar")}>
                <AdminItemContainer>
                    <Label className="" main>
                        First Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("firstSection.title_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Text</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title Text"
                                {...register("firstSection.subTitle.text_ar")}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title Link</Label>
                            <Input
                                type="text"
                                placeholder="Sub Title Link"
                                {...register("firstSection.subTitle.link_ar")}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Social Icons Label</Label>
                            <Input type="text" placeholder="Stay Connected" {...register("firstSection.socialLabel_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Second Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("secondSection.title_ar")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Sub Title</Label>
                            <Input type="text" placeholder="Sub Title" {...register("secondSection.subTitle_ar")} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image</Label>
                                <Controller
                                    name={`secondSection.image`}
                                    control={control}
                                    rules={{ required: "Image is required" }}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                                <FormError error={errors.secondSection?.image?.message} />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                                <Label className=" font-bold">Image Alt Tag</Label>
                                <Input type="text" placeholder="Image Alt Tag" {...register(`secondSection.imageAlt_ar`)} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Video</Label>
                            <Controller
                                name={`secondSection.video`}
                                control={control}
                                rules={{ required: "Video is required" }}
                                render={({ field }) => (
                                    <VideoUploader value={field.value} onChange={field.onChange} />
                                )}
                            />
                            <FormError error={errors.secondSection?.video?.message} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Button Text</Label>
                                <Input type="text" placeholder="READ MORE" {...register("secondSection.button.text_ar")} />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Button Link (empty = Third Section link)</Label>
                                <Input type="text" placeholder="Link" {...register("secondSection.button.link_ar")} />
                            </div>
                        </div>
                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-2 gap-4 xl:grid-cols-4">
                                {secondSectionItems.map((field, index) => (
                                    <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Stat {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => secondSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Key</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Key"
                                                    {...register(`secondSection.items.${index}.key_ar`)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Value</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Value"
                                                    {...register(`secondSection.items.${index}.value_ar`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="col-span-full flex justify-end">
                                    <Button
                                        type="button"
                                        className=""
                                        addItem
                                        onClick={() =>
                                            secondSectionAppend({
                                                key: "",
                                                key_ar: "",
                                                value: "",
                                                value_ar: "",
                                            })
                                        }
                                    >
                                        Add Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 border-t border-black/20 pt-5 mt-2">
                            <Label className="font-bold">Highlights</Label>
                        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {highlightItems.map((field, index) => (
                            <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Highlight {index + 1}</span>
                                <div className="flex flex-col gap-1">
                                    <Label>Icon Alt</Label>
                                    <Input type="text" placeholder="Alt Tag" {...register(`secondSection.highlights.${index}.iconAlt_ar`)} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Title</Label>
                                    <Input type="text" placeholder="Title" {...register(`secondSection.highlights.${index}.title_ar`)} />
                                </div>
                            </div>
                        ))}
                        </div>
                        <p className="text-sm text-black/50">Highlights are added, removed and given icons in the English column.</p>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Third Section
                    </Label>
                    <div className="p-5 flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label className="font-bold text-base">Our Credentials (left side)</Label>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Title</Label>
                                <Input type="text" placeholder="Title" {...register("thirdSection.credentials.title_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Description</Label>
                                <Textarea placeholder="Description" {...register("thirdSection.credentials.description_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Cubes</Label>
                                <CredentialsCubesEditor
                                    setValue={setValue}
                                    cubes={credentialCubes}
                                    name="thirdSection.credentials.cubes"
                                    columns={credentialColumns}
                                    columnsName="thirdSection.credentials.columns"
                                    lang="ar"
                                    showLayout={false}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-black/20 pt-4">
                            <Label className="font-bold text-base">About SP International (right side)</Label>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Title</Label>
                                <Input type="text" placeholder="Main Title" {...register("thirdSection.title_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Description</Label>
                                <Textarea placeholder="Description" {...register("thirdSection.description_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Link (Read More)</Label>
                                <Input type="text" placeholder="Link" {...register("thirdSection.link_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className=" font-bold">Button Text</Label>
                                <Input type="text" placeholder="READ MORE" {...register("thirdSection.buttonText_ar")} />
                            </div>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fourth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("fourthSection.title_ar")} />
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Fifth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("fifthSection.title_ar")} />
                        </div>

                        <div>
                            <Label className="font-bold">Items</Label>
                            <div className="mt-1 grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {fifthSectionItems.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 grid grid-cols-2 gap-4"
                                    >
                                        <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Sector {index + 1}</span>
                                        <div className="absolute top-3 right-3">
                                            <RiDeleteBinLine
                                                onClick={() => fifthSectionRemove(index)}
                                                className="cursor-pointer text-red-600"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Image</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.image && (
                                                    <p data-form-error className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.image.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.imageAlt_ar`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                                <Label className="font-bold">Logo</Label>
                                                <Controller
                                                    name={`fifthSection.items.${index}.logo`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <ImageUploader isLogo value={field.value} onChange={field.onChange} />
                                                    )}
                                                />
                                                {errors.fifthSection?.items?.[index]?.logo && (
                                                    <p data-form-error className="text-red-500">
                                                        {errors.fifthSection?.items?.[index]?.logo.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Alt Tag</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Alt Tag"
                                                        {...register(`fifthSection.items.${index}.logoAlt_ar`)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Title</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.title_ar`)}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label className="font-bold">Completed Projects</Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Title"
                                                        {...register(`fifthSection.items.${index}.completedProjects_ar`)}
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
                                        fifthSectionAppend({
                                            title: "",
                                            image: "",
                                            imageAlt: "",
                                            title_ar: "",
                                            imageAlt_ar: "",
                                            logo: "",
                                            logoAlt: "",
                                            logoAlt_ar: "",
                                            completedProjects: "",
                                            completedProjects_ar: "",
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
                    <Label className="" main>
                        Sixth Section
                    </Label>
                    <div className="p-5 flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label className=" font-bold">Title</Label>
                            <Input type="text" placeholder="Main Title" {...register("sixthSection.title_ar")} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Legend: SP Group (also on the map dot)</Label>
                                <Input type="text" placeholder="SP Group" {...register("sixthSection.legend.spGroup_ar")} />
                            </div>
                            <div className="flex flex-col gap-1 w-1/2">
                                <Label className=" font-bold">Legend: SP International</Label>
                                <Input type="text" placeholder="SP International" {...register("sixthSection.legend.spInternational_ar")} />
                            </div>
                        </div>
                    </div>
                    {/* <div className="px-5 pb-5">
                        <Label className="font-bold">Items</Label>
                        <div className="border p-5 rounded-md flex flex-col gap-5 mt-0.5">
                            {sixthSectionCities.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 p-2 relative border-b pb-5">
                                    <div className="absolute top-3 right-3">
                                        <RiDeleteBinLine
                                            onClick={() => sixthSectionCitiesRemove(index)}
                                            className="cursor-pointer text-red-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">ID (name)</Label>
                                        <Input
                                            type="text"
                                            placeholder="ID (name)"
                                            {...register(`sixthSection.cities.${index}.id`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Name"
                                            {...register(`sixthSection.cities.${index}.name_ar`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Left (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Left coordinate"
                                            {...register(`sixthSection.cities.${index}.left`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Top (coordinate)</Label>
                                        <Input
                                            type="text"
                                            placeholder="Top coordinate"
                                            {...register(`sixthSection.cities.${index}.top`)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Iconic Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Iconic projects"
                                            {...register(`sixthSection.cities.${index}.iconicProjects`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Completed Projects</Label>
                                        <Input
                                            type="text"
                                            placeholder="Completed projects"
                                            {...register(`sixthSection.cities.${index}.completedProjects`)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="font-bold">Dedicated Employees</Label>
                                        <Input
                                            type="text"
                                            placeholder="Dedicated employees"
                                            {...register(`sixthSection.cities.${index}.dedicatedEmployees`)}
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
                                        sixthSectionCitiesAppend({
                                            id: "",
                                            name: "",
                                            name_ar: "",
                                            left: "",
                                            top: "",
                                            iconicProjects: "",
                                            completedProjects: "",
                                            dedicatedEmployees: "",
                                        })
                                    }
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex justify-end p-5">
                        <Link href="/4dm1n-5p1nt/home/map-locations">
                            <Button className="bg-black text-white">Manage Map Locations</Button>
                        </Link>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label className="" main>
                        Seventh Section
                    </Label>
                    <div className="px-5 pt-2 flex flex-col gap-2">
                        <Label className=" font-bold">Title</Label>
                        <Textarea placeholder="Title" {...register("seventhSection.title_ar")} />
                    </div>
                    <div className="flex gap-4 px-5">
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image</Label>
                            <Controller
                                name={`seventhSection.image`}
                                control={control}
                                rules={{ required: "Image is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={errors.seventhSection?.image?.message} />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <Label className=" font-bold">Image Alt Tag</Label>
                            <Input type="text" placeholder="Image Alt Tag" {...register(`seventhSection.imageAlt_ar`)} />
                        </div>
                    </div>
                    <div className="flex px-5 pt-2 pb-2 w-full gap-4 justify-between">
                        <div className="flex flex-col gap-2 w-full">
                            <Label className=" font-bold">Button Text</Label>
                            <Input type="text" placeholder="Button Text" {...register("seventhSection.button.text_ar")} />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Label className="font-bold">Button Link</Label>
                            <Input type="text" placeholder="Button Link" {...register("seventhSection.button.link_ar")} />
                        </div>
                    </div>
                    <Label className="mx-5 font-bold">Items</Label>
                    <div className="m-5 mt-1 grid grid-cols-2 gap-4">
                        {seventhSectionItems.map((field, index) => (
                            <div key={field.id} className="relative rounded-lg border border-slate-200 bg-slate-50/70 p-4 pt-10 flex flex-col gap-3">
                                <span className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Item {index + 1}</span>
                                <div className="absolute top-3 right-3">
                                    <RiDeleteBinLine
                                        onClick={() => seventhSectionRemove(index)}
                                        className="cursor-pointer text-red-600"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...register(`seventhSection.items.${index}.title_ar`)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="font-bold">Description</Label>
                                    <Input
                                        type="text"
                                        placeholder="Description"
                                        {...register(`seventhSection.items.${index}.description_ar`)}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="col-span-full flex justify-end">
                            <Button
                                type="button"
                                className=""
                                addItem
                                onClick={() =>
                                    seventhSectionAppend({
                                        title: "",
                                        title_ar: "",
                                        description: "",
                                        description_ar: "",
                                    })
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
                {isReorderingVideos && (
                    <p className="text-sm text-yellow-700 mb-2 text-center">
                        Click Done in Rotating Videos (First Section) to keep the new order, then Submit to save.
                    </p>
                )}
                <Button type="submit" className="cursor-pointer text-white text-[16px] w-full" disabled={isReorderingVideos}>
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default Home;
