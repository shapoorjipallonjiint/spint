"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, useFieldArray, useWatch, Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { LANG_TAB_FORM_ID, useAdminLangTab } from "@/contexts/adminLangTab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { RiDeleteBinLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
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

const iconBtn =
    "inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-black/5 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none";

// card header for a list item: position, live name preview, order control, delete.
// Order is "earlier / later" (‹ ›) plus a position picker, not up / down: in the two-column grid cards flow
// left to right, then down, so up / down arrows did not match where a card actually moves.
const ItemToolbar = ({
    label,
    index,
    count,
    onMove,
    onRemove,
    preview,
    badge,
}: {
    label: string;
    index: number;
    count: number;
    onMove: (from: number, to: number) => void;
    onRemove: (index: number) => void;
    preview?: React.ReactNode;
    badge?: string;
}) => (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {index + 1}
            </span>
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[11px] uppercase tracking-wide text-gray-500">{label}</span>
                <span className="text-sm font-medium truncate">{preview}</span>
            </div>
            {badge && (
                <span className="shrink-0 rounded-full bg-primary text-white text-[11px] font-medium px-2.5 py-0.5">{badge}</span>
            )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center rounded-md border border-gray-200 bg-white" title="Position on the website">
                <button type="button" title="Move earlier" aria-label="Move earlier" disabled={index === 0} onClick={() => onMove(index, index - 1)} className={`${iconBtn} rounded-e-none`}>
                    <RiArrowLeftSLine className="w-4 h-4" />
                </button>
                <label className="flex items-center gap-1 px-1 text-xs text-gray-500 border-x border-gray-200 h-8">
                    <select
                        aria-label="Position"
                        value={index}
                        disabled={count < 2}
                        onChange={(e) => onMove(index, Number(e.target.value))}
                        className="bg-transparent text-sm font-medium text-black cursor-pointer focus:outline-none disabled:cursor-default"
                    >
                        {Array.from({ length: count }, (_, i) => (
                            <option key={i} value={i}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <span>of {count}</span>
                </label>
                <button type="button" title="Move later" aria-label="Move later" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} className={`${iconBtn} rounded-s-none`}>
                    <RiArrowRightSLine className="w-4 h-4" />
                </button>
            </div>
            <button
                type="button"
                title="Delete"
                onClick={() => {
                    if (window.confirm(`Delete "${label} ${index + 1}"? (It is removed from the website after you click Save.)`)) onRemove(index);
                }}
                className={`${iconBtn} text-red-600 hover:bg-red-50 hover:text-red-700`}
            >
                <RiDeleteBinLine />
            </button>
        </div>
    </div>
);

// the person's name in the card header, updated as it is typed (falls back to the English name, then a placeholder)
const NamePreview = ({ control, path, lang }: { control: Control<LeadershipFormProps>; path: string; lang: "en" | "ar" }) => {
    const [name, nameEn] = useWatch({
        control,
        name: [`${path}.name${lang === "ar" ? "_ar" : ""}`, `${path}.name`] as unknown as ["leadershipPage.title", "leadershipPage.title"],
    });
    const text = (name || nameEn || "").trim();
    return text ? <>{text}</> : <span className="text-gray-400 font-normal">No name yet</span>;
};

// shown when a list has no one in it yet
const EmptyList = ({ text }: { text: string }) => (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">{text}</div>
);

// photo column of a person card (photos are shared by both language columns)
const PhotoField = ({ children, error }: { children: React.ReactNode; error?: string }) => (
    <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-gray-700">
            Photo <span className="font-normal text-gray-400">(same in both languages)</span>
        </Label>
        {children}
        <FormError error={error} />
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
    <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
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
            {list.fields.length === 0 && <EmptyList text="No one added yet. Use “Add Person” to add the first one." />}
            {/* two cards per row when the column is wide enough (single column view / language tabs) */}
            <div className="@container">
                <div className="grid grid-cols-1 @5xl:grid-cols-2 gap-4">
                    {list.fields.map((field, index) => (
                        <div key={field.id} className="@container rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <ItemToolbar
                                label="Person"
                                index={index}
                                count={list.fields.length}
                                onMove={list.move}
                                onRemove={list.remove}
                                preview={<NamePreview control={control} path={`${name}.${index}`} lang={lang} />}
                            />
                            <div className="p-4 grid grid-cols-1 @lg:grid-cols-[180px_1fr] gap-5">
                                <PhotoField error={listErrors?.[index]?.image?.message}>
                                    <Controller
                                        name={`${name}.${index}.image`}
                                        control={control}
                                        rules={{ required: "Photo is required" }}
                                        render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} className="[&_img]:object-top" />}
                                    />
                                </PhotoField>
                                <div className="flex flex-col gap-3 min-w-0">
                                    <Field
                                        label="Name"
                                        reg={register(`${name}.${index}.name${sfx(lang)}` as `${typeof name}.${number}.name`, en ? { required: "Name is required" } : {})}
                                        error={en ? listErrors?.[index]?.name?.message : undefined}
                                    />
                                    <Field
                                        label="Designation"
                                        reg={register(`${name}.${index}.designation${sfx(lang)}` as `${typeof name}.${number}.designation`)}
                                    />
                                    <Field
                                        label="Photo Alt Tag (empty = name)"
                                        reg={register(`${name}.${index}.imageAlt${sfx(lang)}` as `${typeof name}.${number}.imageAlt`)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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

    // English / Arabic tabs in the top bar (contexts/adminLangTab). The inactive column stays laid out but invisible and
    // collapsed to 0 height (not display:none): TinyMCE builds its iframe on mount and can come up blank inside a
    // display:none parent. Both columns stay mounted, so switching never loses typing; one Submit saves both.
    const { enabled: langTabs, lang: activeLang, showErrors } = useAdminLangTab();
    const langColumn = (column: Lang, base: string) =>
        langTabs && activeLang !== column
            ? `${base} invisible absolute inset-x-0 top-0 h-0 overflow-hidden pointer-events-none`
            : base;

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
            <div className={langColumn(lang, "flex flex-col gap-5")}>
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
                        <p className="text-sm text-gray-500">
                            {leaders.fields.length} {leaders.fields.length === 1 ? "leader" : "leaders"}. Leader 1 is shown large, above
                            &quot;Promoters &amp; Management Board&quot;; the other leaders follow after it, in this order.
                        </p>
                        {leaders.fields.length === 0 && <EmptyList text="No leaders added yet. Use “Add Leader” to add the first one." />}
                        {leaders.fields.map((field, index) => (
                            <div key={field.id} className="@container rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <ItemToolbar
                                    label="Leader"
                                    index={index}
                                    count={leaders.fields.length}
                                    onMove={leaders.move}
                                    onRemove={leaders.remove}
                                    badge={index === 0 ? "Shown large" : undefined}
                                    preview={<NamePreview control={control} path={`leadershipPage.leaders.${index}`} lang={lang} />}
                                />
                                <div className="p-4 grid grid-cols-1 @lg:grid-cols-[200px_1fr] gap-5">
                                    <PhotoField error={errors.leadershipPage?.leaders?.[index]?.image?.message}>
                                        <Controller
                                            name={`leadershipPage.leaders.${index}.image`}
                                            control={control}
                                            rules={{ required: "Photo is required" }}
                                            render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} className="[&_img]:object-top" />}
                                        />
                                    </PhotoField>
                                    <div className="flex flex-col gap-3 min-w-0">
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
                                    <Field
                                        label="Photo Alt Tag (empty = name)"
                                        reg={register(`leadershipPage.leaders.${index}.imageAlt${sfx(lang)}` as `leadershipPage.leaders.${number}.imageAlt`)}
                                    />
                                    </div>
                                    <div className="flex flex-col gap-1.5 @lg:col-span-2">
                                        <Label className="text-sm font-medium text-gray-700">Description</Label>
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
                        <p className="text-sm text-gray-500">
                            {promoters.fields.length} {promoters.fields.length === 1 ? "person" : "people"}, shown on the website in this order.
                        </p>
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
                        <p className="text-sm text-gray-500">
                            {coreTeam.fields.length} {coreTeam.fields.length === 1 ? "person" : "people"}, shown on the website in this order.
                        </p>
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
        <form id={LANG_TAB_FORM_ID} className={langTabs ? "relative grid grid-cols-1 gap-10" : "grid grid-cols-2 gap-10"} onSubmit={handleSubmit(onSubmit, showErrors)}>
            {/* English Version */}
            {renderColumn("en")}

            {/* Arabic Version */}
            {renderColumn("ar")}

            {/* with the language tabs, Submit sits in the top bar */}
            <div className={langTabs ? "hidden" : "col-span-2"}>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer text-white text-[16px] w-full">
                    {isSubmitting ? "Saving..." : "Submit"}
                </Button>
            </div>
        </form>
    );
};

export default LeadershipAdminPage;
