"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useFormContext, useFormState, Controller, FormProvider, get } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { RiDeleteBinLine } from "react-icons/ri";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { FooterData } from "@/lib/footer";

type LinkListName = `columns.${number}.links` | "bottomLinks";

const EMPTY_LINK = { label: "", label_ar: "", href: "" };

// validation message for any (nested) field
const FieldError = ({ name }: { name: string }) => {
    const { errors } = useFormState();
    return <FormError error={get(errors, name)?.message} />;
};

// move up / move down / delete for one row of a list
const RowActions = ({
    index,
    count,
    move,
    remove,
}: {
    index: number;
    count: number;
    move: (from: number, to: number) => void;
    remove: (index: number) => void;
}) => (
    <div className="flex items-center gap-2 shrink-0">
        <button
            type="button"
            title="Move up"
            disabled={index === 0}
            onClick={() => move(index, index - 1)}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30"
        >
            <ChevronUp className="h-4 w-4" />
        </button>
        <button
            type="button"
            title="Move down"
            disabled={index === count - 1}
            onClick={() => move(index, index + 1)}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30"
        >
            <ChevronDown className="h-4 w-4" />
        </button>
        <button type="button" title="Delete" onClick={() => remove(index)} className="p-1 rounded hover:bg-red-50">
            <RiDeleteBinLine className="h-4 w-4 text-red-600" />
        </button>
    </div>
);

// label (English / Arabic) + URL rows, used for the links of each column and the bottom bar links
const LinkList = ({ name }: { name: LinkListName }) => {
    const { control, register } = useFormContext<FooterData>();
    const { fields, append, remove, move } = useFieldArray({ control, name });

    return (
        <div className="flex flex-col gap-3">
            {fields.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-sm text-black/50">
                    <span>Label</span>
                    <span>Label (Arabic)</span>
                    <span>URL</span>
                    <span className="w-[92px]" />
                </div>
            )}
            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start">
                    <div>
                        <Input {...register(`${name}.${index}.label`, { required: "Label is required" })} />
                        <FieldError name={`${name}.${index}.label`} />
                    </div>
                    <Input dir="rtl" {...register(`${name}.${index}.label_ar`)} />
                    <div>
                        <Input
                            placeholder="/about-us or https://..."
                            {...register(`${name}.${index}.href`, { required: "URL is required" })}
                        />
                        <FieldError name={`${name}.${index}.href`} />
                    </div>
                    <RowActions index={index} count={fields.length} move={move} remove={remove} />
                </div>
            ))}
            <div className="flex justify-end">
                <Button type="button" addItem onClick={() => append({ ...EMPTY_LINK })}>
                    Add Link
                </Button>
            </div>
        </div>
    );
};

const FooterAdminPage = () => {
    const methods = useForm<FooterData>();
    const { register, handleSubmit, reset, control, watch } = methods;
    const socials = useFieldArray({ control, name: "socials" });
    const columns = useFieldArray({ control, name: "columns" });

    // if loading fails, saving is blocked so an empty form can never overwrite the stored footer
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/footer", { cache: "no-store" });
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                const json = await res.json();
                reset(json.data);
                setStatus("ready");
            } catch (error) {
                console.error("Failed to load footer:", error);
                setStatus("error");
            }
        };
        fetchData();
    }, [reset]);

    const onSubmit = async (formData: FooterData) => {
        if (status !== "ready") return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/footer", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result?.message || "Failed to save the footer");
                return;
            }
            reset(result.data);
            toast.success("Footer updated successfully");
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Something went wrong while saving");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading") {
        return <div className="p-10 text-center text-black/60">Loading footer...</div>;
    }

    if (status === "error") {
        return (
            <div className="p-10 text-center text-red-600">
                Could not load the footer. Please refresh before editing - nothing has been changed.
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                {/* LOGO & CONTACT */}
                <AdminItemContainer>
                    <Label main>Logo & Contact</Label>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4 p-5">
                        <div className="flex flex-col gap-1">
                            <Label>Logo</Label>
                            <Controller
                                name="logo"
                                control={control}
                                rules={{ required: "Logo is required" }}
                                render={({ field }) => <ImageUploader isLogo value={field.value} onChange={field.onChange} />}
                            />
                            <p className="text-sm text-black/50">Shown in white on the footer.</p>
                            <FieldError name="logo" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <Label>Logo Alt</Label>
                                <Input {...register("logoAlt")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Logo Alt (Arabic)</Label>
                                <Input dir="rtl" {...register("logoAlt_ar")} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Address</Label>
                            <Textarea rows={3} {...register("address")} />
                            <p className="text-sm text-black/50">Each new line starts a new line on the website.</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Address (Arabic)</Label>
                            <Textarea dir="rtl" rows={3} {...register("address_ar")} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Phone</Label>
                            <Input placeholder="+971 42156222" {...register("phone")} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Email</Label>
                            <Input type="email" {...register("email")} />
                        </div>
                    </div>
                </AdminItemContainer>

                {/* SOCIAL MEDIA */}
                <AdminItemContainer>
                    <Label main>Social Media</Label>
                    <div className="flex flex-col gap-4 p-5">
                        <p className="text-sm text-black/50">
                            Upload white icons (SVG or PNG) - the footer background is dark. Shown in this order; use the eye icon to hide one from the website.
                        </p>
                        {socials.fields.map((field, index) => (
                            <div key={field.id} className="flex gap-6 items-start border-b border-black/10 pb-4">
                                <div className={`w-[120px] shrink-0 ${watch(`socials.${index}.hidden`) ? "opacity-40" : ""}`}>
                                    <Controller
                                        name={`socials.${index}.icon`}
                                        control={control}
                                        rules={{ required: "Icon is required" }}
                                        render={({ field }) => (
                                            <ImageUploader isLogo value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    <FieldError name={`socials.${index}.icon`} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <Label>Name</Label>
                                        <Input placeholder="Instagram" {...register(`socials.${index}.name`)} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label>Profile Link</Label>
                                        <Input
                                            placeholder="https://..."
                                            {...register(`socials.${index}.href`, { required: "Link is required" })}
                                        />
                                        <FieldError name={`socials.${index}.href`} />
                                    </div>
                                </div>
                                {/* show / hide on the website */}
                                <Controller
                                    name={`socials.${index}.hidden`}
                                    control={control}
                                    render={({ field }) => (
                                        <button
                                            type="button"
                                            title={field.value ? "Hidden on the website - click to show" : "Shown on the website - click to hide"}
                                            onClick={() => field.onChange(!field.value)}
                                            className="p-1 mt-0.5 rounded hover:bg-black/5 shrink-0"
                                        >
                                            {field.value ? (
                                                <EyeOff className="h-4 w-4 text-black/40" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    )}
                                />
                                <RowActions
                                    index={index}
                                    count={socials.fields.length}
                                    move={socials.move}
                                    remove={socials.remove}
                                />
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button type="button" addItem onClick={() => socials.append({ name: "", icon: "", href: "", hidden: false })}>
                                Add Social Icon
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* LINK COLUMNS */}
                <AdminItemContainer>
                    <Label main>Link Columns</Label>
                    <div className="flex flex-col gap-5 p-5">
                        <p className="text-sm text-black/50">
                            Services hidden in Services &gt; Main are left out of the footer automatically, and service
                            links follow the order set there.
                        </p>
                        {columns.fields.map((field, index) => (
                            <div key={field.id} className="border border-black/20 rounded-md p-4 flex flex-col gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="flex flex-col gap-1">
                                            <Label>Column Title</Label>
                                            <Input {...register(`columns.${index}.title`, { required: "Title is required" })} />
                                            <FieldError name={`columns.${index}.title`} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Label>Column Title (Arabic)</Label>
                                            <Input dir="rtl" {...register(`columns.${index}.title_ar`)} />
                                        </div>
                                    </div>
                                    <RowActions
                                        index={index}
                                        count={columns.fields.length}
                                        move={columns.move}
                                        remove={columns.remove}
                                    />
                                </div>
                                <LinkList name={`columns.${index}.links`} />
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                addItem
                                onClick={() => columns.append({ title: "", title_ar: "", links: [{ ...EMPTY_LINK }] })}
                            >
                                Add Column
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* BOTTOM BAR */}
                <AdminItemContainer>
                    <Label main>Bottom Bar</Label>
                    <div className="flex flex-col gap-5 p-5">
                        <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                            <div className="flex flex-col gap-1">
                                <Label>Copyright</Label>
                                <Input {...register("copyright")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Copyright (Arabic)</Label>
                                <Input dir="rtl" {...register("copyright_ar")} />
                            </div>
                            <p className="col-span-2 text-sm text-black/50">
                                Write {"{year}"} where the current year should appear.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Links</Label>
                            <LinkList name="bottomLinks" />
                        </div>
                    </div>
                </AdminItemContainer>

                <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-white font-semibold hover:bg-primary/90"
                >
                    {saving ? "Saving..." : "Submit"}
                </Button>
            </form>
        </FormProvider>
    );
};

export default FooterAdminPage;
