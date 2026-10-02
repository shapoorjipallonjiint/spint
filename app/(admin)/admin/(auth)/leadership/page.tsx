"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, useFieldArray, Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { RiDeleteBinLine, RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";
import { toast } from "sonner";

// same rich text editor as the other CMS pages (TinyMCE), loaded on the client only
const TinyEditor = dynamic(() => import("@/app/components/TinyMce/TinyEditor"), { ssr: false });

// Leadership page (website: /leadership, component LeadershipV2). Everything the page shows is in `leadershipPage`.
// Saving sends only the meta fields and `leadershipPage`; the older fields of this document (firstSection ...
// fourthSection, pageTitle, ...) belong to the previous design and are never sent, so they stay untouched.

type Person = {
    _id?: string;
    image: string;
    imageAlt?: string;
    imageAlt_ar?: string;
    name: string;
    name_ar?: string;
    designation: string;
    designation_ar?: string;
};

type Leader = Person & {
    description?: string;
    description_ar?: string;
};

interface LeadershipFormProps {
    metaTitle: string;
    metaTitle_ar?: string;
    metaDescription: string;
    metaDescription_ar?: string;
    leadershipPage: {
        title: string;
        title_ar?: string;
        leaders: Leader[];
        promoters: { title: string; title_ar?: string; items: Person[] };
        coreTeam: { title: string; title_ar?: string; items: Person[] };
    };
}

const emptyPerson: Person = {
    image: "",
    imageAlt: "",
    imageAlt_ar: "",
    name: "",
    name_ar: "",
    designation: "",
    designation_ar: "",
};

// small toolbar for a list item: position, move up / down, delete
const ItemToolbar = ({
    label,
    index,
    count,
    onMove,
    onRemove,
}: {
    label: string;
    index: number;
    count: number;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
}) => (
    <div className="flex items-center justify-between mb-3">
        <span className="font-bold">{label}</span>
        <div className="flex items-center gap-3">
            <button type="button" title="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)} className="disabled:opacity-30 cursor-pointer">
                <RiArrowUpLine />
            </button>
            <button type="button" title="Move down" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} className="disabled:opacity-30 cursor-pointer">
                <RiArrowDownLine />
            </button>
            <button
                type="button"
                title="Delete"
                onClick={() => {
                    if (window.confirm(`Delete "${label}"? (It is removed from the website after you click Save.)`)) onRemove(index);
                }}
                className="text-red-600 cursor-pointer"
            >
                <RiDeleteBinLine />
            </button>
        </div>
    </div>
);

// TinyEditor keeps the change handler it got when it was created; leaders can be moved / deleted, so it gets a
// stable function that always forwards to the current field (otherwise an edit after a reorder would go to the old index)
const DescriptionEditor = ({ value, onChange }: { value?: string; onChange: (html: string) => void }) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const forward = useCallback((html: string | ((prev: string) => string)) => {
        if (typeof html === "string") onChangeRef.current(html);
    }, []);
    return <TinyEditor setNewsContent={forward} newsContent={value || "<p></p>"} />;
};

type Lang = "en" | "ar";
const sfx = (lang: Lang) => (lang === "ar" ? "_ar" : "");

// one text field of the current language column
const Field = ({
    label,
    reg,
    error,
    textarea = false,
    rows,
}: {
    label: string;
    reg: ReturnType<UseFormRegister<LeadershipFormProps>>;
    error?: string;
    textarea?: boolean;
    rows?: number;
}) => (
    <div className="flex flex-col gap-1">
        <Label className="font-bold">{label}</Label>
        {textarea ? <Textarea rows={rows} placeholder={label} {...reg} /> : <Input type="text" placeholder={label} {...reg} />}
        <FormError error={error} />
    </div>
);

type ListApi = {
    fields: { id: string }[];
    move: (from: number, to: number) => void;
    remove: (index: number) => void;
};

// people list (Promoters & Management Board / Core Leadership Team) for one language column;
// the list itself (order, add, delete) and the photos are shared by both columns
const PeopleList = ({
    name,
    list,
    lang,
    onAdd,
    control,
    register,
    errors,
}: {
    name: "leadershipPage.promoters.items" | "leadershipPage.coreTeam.items";
    list: ListApi;
    lang: Lang;
    onAdd: () => void;
    control: Control<LeadershipFormProps>;
    register: UseFormRegister<LeadershipFormProps>;
    errors?: FieldErrors<LeadershipFormProps>["leadershipPage"];
}) => {
    const listErrors = name === "leadershipPage.promoters.items" ? errors?.promoters?.items : errors?.coreTeam?.items;
    const en = lang === "en";
    return (
        <div className="flex flex-col gap-4">
            {list.fields.map((field, index) => (
                <div key={field.id} className="border border-black/20 rounded-md p-4">
                    <ItemToolbar label={`Person ${index + 1}`} index={index} count={list.fields.length} onMove={list.move} onRemove={list.remove} />
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Photo</Label>
                            <Controller
                                name={`${name}.${index}.image`}
                                control={control}
                                rules={{ required: "Photo is required" }}
                                render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                            />
                            <FormError error={listErrors?.[index]?.image?.message} />
                        </div>
                        <Field
                            label="Photo Alt Tag (empty = name)"
                            reg={register(`${name}.${index}.imageAlt${sfx(lang)}` as `${typeof name}.${number}.imageAlt`)}
                        />
                        <Field
                            label="Name"
                            reg={register(`${name}.${index}.name${sfx(lang)}` as `${typeof name}.${number}.name`, en ? { required: "Name is required" } : {})}
                            error={en ? listErrors?.[index]?.name?.message : undefined}
                        />
                        <Field
                            label="Designation"
                            reg={register(`${name}.${index}.designation${sfx(lang)}` as `${typeof name}.${number}.designation`)}
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <Button type="button" addItem onClick={onAdd}>
                    Add Person
                </Button>
            </div>
        </div>
    );
};

const LeadershipAdminPage = () => {
    const [loaded, setLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LeadershipFormProps>();

    const leaders = useFieldArray({ control, name: "leadershipPage.leaders" });
    const promoters = useFieldArray({ control, name: "leadershipPage.promoters.items" });
    const coreTeam = useFieldArray({ control, name: "leadershipPage.coreTeam.items" });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/leadership", { cache: "no-store" });
                if (!res.ok) throw new Error();
                const json = await res.json();
                const d = json.data || {};
                reset({
                    metaTitle: d.metaTitle,
                    metaTitle_ar: d.metaTitle_ar,
                    metaDescription: d.metaDescription,
                    metaDescription_ar: d.metaDescription_ar,
                    leadershipPage: {
                        title: d.leadershipPage?.title ?? "",
                        title_ar: d.leadershipPage?.title_ar ?? "",
                        leaders: d.leadershipPage?.leaders ?? [],
                        promoters: {
                            title: d.leadershipPage?.promoters?.title ?? "",
                            title_ar: d.leadershipPage?.promoters?.title_ar ?? "",
                            items: d.leadershipPage?.promoters?.items ?? [],
                        },
                        coreTeam: {
                            title: d.leadershipPage?.coreTeam?.title ?? "",
                            title_ar: d.leadershipPage?.coreTeam?.title_ar ?? "",
                            items: d.leadershipPage?.coreTeam?.items ?? [],
                        },
                    },
                });
                setLoaded(true);
            } catch {
                setLoadError(true);
            }
        })();
    }, [reset]);

    const onSubmit = async (data: LeadershipFormProps) => {
        try {
            // only these fields are sent; nothing else in the document is changed
            const payload = {
                metaTitle: data.metaTitle,
                metaTitle_ar: data.metaTitle_ar,
                metaDescription: data.metaDescription,
                metaDescription_ar: data.metaDescription_ar,
                leadershipPage: data.leadershipPage,
            };
            const res = await fetch("/api/admin/leadership", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Failed to save");
            toast.success(json?.message || "Leadership updated successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save");
        }
    };

    if (loadError) {
        return <p className="text-red-600 p-5">Could not load the Leadership page data. Please refresh - nothing has been changed.</p>;
    }
    if (!loaded) return <p className="p-5 text-black/60">Loading...</p>;

    // one language column (same sections in both, like the other CMS pages); lists and photos are shared
    const renderColumn = (lang: Lang) => {
        const en = lang === "en";
        return (
            <div className="flex flex-col gap-5">
                <AdminItemContainer>
                    <Label main>Page Title</Label>
                    <div className="p-5">
                        <Field
                            label="Title"
                            reg={register(`leadershipPage.title${sfx(lang)}` as "leadershipPage.title", en ? { required: "Title is required" } : {})}
                            error={en ? errors.leadershipPage?.title?.message : undefined}
                        />
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Leaders</Label>
                    <div className="p-5 flex flex-col gap-4">
                        <p className="text-sm text-black/60">
                            Leader 1 is shown large, above &quot;Promoters &amp; Management Board&quot;; the other leaders follow after
                            it, in this order.
                        </p>
                        {leaders.fields.map((field, index) => (
                            <div key={field.id} className="border border-black/20 rounded-md p-4">
                                <ItemToolbar
                                    label={`Leader ${index + 1}${index === 0 ? " (shown large)" : ""}`}
                                    index={index}
                                    count={leaders.fields.length}
                                    onMove={leaders.move}
                                    onRemove={leaders.remove}
                                />
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Photo</Label>
                                        <Controller
                                            name={`leadershipPage.leaders.${index}.image`}
                                            control={control}
                                            rules={{ required: "Photo is required" }}
                                            render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                        />
                                        <FormError error={errors.leadershipPage?.leaders?.[index]?.image?.message} />
                                    </div>
                                    <Field
                                        label="Photo Alt Tag (empty = name)"
                                        reg={register(`leadershipPage.leaders.${index}.imageAlt${sfx(lang)}` as `leadershipPage.leaders.${number}.imageAlt`)}
                                    />
                                    <Field
                                        label="Name"
                                        reg={register(
                                            `leadershipPage.leaders.${index}.name${sfx(lang)}` as `leadershipPage.leaders.${number}.name`,
                                            en ? { required: "Name is required" } : {}
                                        )}
                                        error={en ? errors.leadershipPage?.leaders?.[index]?.name?.message : undefined}
                                    />
                                    <Field
                                        label="Designation"
                                        reg={register(`leadershipPage.leaders.${index}.designation${sfx(lang)}` as `leadershipPage.leaders.${number}.designation`)}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <Label className="font-bold">Description</Label>
                                        <Controller
                                            name={`leadershipPage.leaders.${index}.description${sfx(lang)}` as `leadershipPage.leaders.${number}.description`}
                                            control={control}
                                            render={({ field }) => <DescriptionEditor value={field.value} onChange={field.onChange} />}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button type="button" addItem onClick={() => leaders.append({ ...emptyPerson, description: "", description_ar: "" })}>
                                Add Leader
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Promoters &amp; Management Board</Label>
                    <div className="p-5 flex flex-col gap-4">
                        <Field
                            label="Section Title"
                            reg={register(`leadershipPage.promoters.title${sfx(lang)}` as "leadershipPage.promoters.title")}
                        />
                        <PeopleList
                            name="leadershipPage.promoters.items"
                            list={promoters}
                            lang={lang}
                            onAdd={() => promoters.append({ ...emptyPerson })}
                            control={control}
                            register={register}
                            errors={errors.leadershipPage}
                        />
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>Core Leadership Team</Label>
                    <div className="p-5 flex flex-col gap-4">
                        <Field
                            label="Section Title"
                            reg={register(`leadershipPage.coreTeam.title${sfx(lang)}` as "leadershipPage.coreTeam.title")}
                        />
                        <PeopleList
                            name="leadershipPage.coreTeam.items"
                            list={coreTeam}
                            lang={lang}
                            onAdd={() => coreTeam.append({ ...emptyPerson })}
                            control={control}
                            register={register}
                            errors={errors.leadershipPage}
                        />
                    </div>
                </AdminItemContainer>

                <AdminItemContainer>
                    <Label main>SEO</Label>
                    <div className="p-5 flex flex-col gap-3">
                        <Field
                            label="Meta Title"
                            reg={register(`metaTitle${sfx(lang)}` as "metaTitle", en ? { required: "Meta title is required" } : {})}
                            error={en ? errors.metaTitle?.message : undefined}
                        />
                        <Field
                            label="Meta Description"
                            textarea
                            reg={register(`metaDescription${sfx(lang)}` as "metaDescription", en ? { required: "Meta description is required" } : {})}
                            error={en ? errors.metaDescription?.message : undefined}
                        />
                    </div>
                </AdminItemContainer>
            </div>
        );
    };

    return (
        <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(onSubmit)}>
            {/* English Version */}
            {renderColumn("en")}

            {/* Arabic Version */}
            {renderColumn("ar")}

            <div className="col-span-2">
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer text-white text-[16px] w-full">
                    {isSubmitting ? "Saving..." : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default LeadershipAdminPage;
