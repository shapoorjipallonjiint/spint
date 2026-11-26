"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useFormContext, useFormState, Controller, FormProvider, get } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import { FormError } from "@/app/components/common/FormError";
import { RiDeleteBinLine } from "react-icons/ri";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { HeaderData } from "@/lib/header";

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

// dropdown links (English / Arabic label + URL) of one menu item
const SubmenuList = ({ itemIndex }: { itemIndex: number }) => {
    const { control, register } = useFormContext<HeaderData>();
    const name = `menu.${itemIndex}.submenu` as const;
    const { fields, append, remove, move } = useFieldArray({ control, name });

    return (
        <div className="flex flex-col gap-3">
            <Label>Dropdown Links</Label>
            {fields.length > 0 ? (
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 text-sm text-black/50">
                    <span>Label</span>
                    <span>Label (Arabic)</span>
                    <span>URL</span>
                    <span className="w-[92px]" />
                </div>
            ) : (
                <p className="text-sm text-black/50">No dropdown - this item links straight to its URL.</p>
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
                    Add Dropdown Link
                </Button>
            </div>
        </div>
    );
};

// one top-level menu item; its URL is only required when it has no dropdown
const MenuItemFields = ({ index }: { index: number }) => {
    const { register, watch } = useFormContext<HeaderData>();
    const hasDropdown = (watch(`menu.${index}.submenu`) || []).length > 0;

    return (
        <div className="grid grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col gap-1">
                <Label>Title</Label>
                <Input {...register(`menu.${index}.title`, { required: "Title is required" })} />
                <FieldError name={`menu.${index}.title`} />
            </div>
            <div className="flex flex-col gap-1">
                <Label>Title (Arabic)</Label>
                <Input dir="rtl" {...register(`menu.${index}.title_ar`)} />
            </div>
            <div className="flex flex-col gap-1">
                <Label>URL</Label>
                <Input
                    placeholder={hasDropdown ? "Not needed - opens the dropdown" : "/projects or https://..."}
                    disabled={hasDropdown}
                    {...register(`menu.${index}.href`, {
                        validate: (value, values) =>
                            (values.menu?.[index]?.submenu?.length ?? 0) > 0 ||
                            !!value?.trim() ||
                            "URL is required when there is no dropdown",
                    })}
                />
                <FieldError name={`menu.${index}.href`} />
            </div>
        </div>
    );
};

const HeaderAdminPage = () => {
    const methods = useForm<HeaderData>();
    const { register, handleSubmit, reset, control } = methods;
    const menu = useFieldArray({ control, name: "menu" });

    // if loading fails, saving is blocked so an empty form can never overwrite the stored header
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/header", { cache: "no-store" });
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                const json = await res.json();
                reset(json.data);
                setStatus("ready");
            } catch (error) {
                console.error("Failed to load header:", error);
                setStatus("error");
            }
        };
        fetchData();
    }, [reset]);

    const onSubmit = async (formData: HeaderData) => {
        if (status !== "ready") return;
        if (!formData.menu?.length) {
            toast.error("The menu needs at least one item");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/admin/header", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result?.message || "Failed to save the header");
                return;
            }
            reset(result.data);
            toast.success("Header updated successfully");
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Something went wrong while saving");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading") {
        return <div className="p-10 text-center text-black/60">Loading header...</div>;
    }

    if (status === "error") {
        return (
            <div className="p-10 text-center text-red-600">
                Could not load the header. Please refresh before editing - nothing has been changed.
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                {/* MENU */}
                <AdminItemContainer>
                    <Label main>Menu</Label>
                    <div className="flex flex-col gap-5 p-5">
                        <p className="text-sm text-black/50">
                            Shown in this order on the desktop header, the mobile menu and the homepage menu. Add
                            dropdown links to make an item open a dropdown. Services hidden in Services &gt; Main are
                            left out automatically, and service links follow the order set there.
                        </p>
                        {menu.fields.map((field, index) => (
                            <div key={field.id} className="border border-black/20 rounded-md p-4 flex flex-col gap-4">
                                <div className="flex gap-4 items-start">
                                    <MenuItemFields index={index} />
                                    <div className="pt-7">
                                        <RowActions
                                            index={index}
                                            count={menu.fields.length}
                                            move={menu.move}
                                            remove={menu.remove}
                                        />
                                    </div>
                                </div>
                                <SubmenuList itemIndex={index} />
                            </div>
                        ))}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                addItem
                                onClick={() => menu.append({ title: "", title_ar: "", href: "", submenu: [] })}
                            >
                                Add Menu Item
                            </Button>
                        </div>
                    </div>
                </AdminItemContainer>

                {/* EMPLOYEE LOGIN */}
                <AdminItemContainer>
                    <Label main>Employee Login Button</Label>
                    <div className="flex flex-col gap-4 p-5">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-black/50">
                                The button next to the menu on desktop and inside the mobile menu. Opens in a new tab.
                            </p>
                            <Controller
                                name="portal.hidden"
                                control={control}
                                render={({ field }) => (
                                    <button
                                        type="button"
                                        onClick={() => field.onChange(!field.value)}
                                        className="flex shrink-0 items-center gap-2 rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5"
                                    >
                                        {field.value ? (
                                            <>
                                                <EyeOff className="h-4 w-4 text-black/40" /> Hidden on the website
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4" /> Shown on the website
                                            </>
                                        )}
                                    </button>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label>Label</Label>
                                <Input placeholder="Employee Login" {...register("portal.label")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Label (Arabic)</Label>
                                <Input dir="rtl" {...register("portal.label_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>URL</Label>
                                <Input placeholder="https://..." {...register("portal.href")} />
                                <p className="text-sm text-black/50">Leave empty to hide the button.</p>
                            </div>
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

export default HeaderAdminPage;
