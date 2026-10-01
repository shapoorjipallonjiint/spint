"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import AdminItemContainer from "@/app/components/common/AdminItemContainer";
import TinyEditor from "@/app/components/TinyMce/TinyEditor";
import { toast } from "sonner";

interface TermsAndConditionsFormProps {
    metaTitle: string;
    metaTitle_ar: string;
    metaDescription: string;
    metaDescription_ar: string;

    banner: string;
    bannerAlt: string;
    bannerAlt_ar: string;

    pageTitle: string;
    pageTitle_ar: string;

    content: string;
    content_ar: string;
}

const FIELDS: (keyof TermsAndConditionsFormProps)[] = [
    "metaTitle", "metaTitle_ar", "metaDescription", "metaDescription_ar",
    "banner", "bannerAlt", "bannerAlt_ar", "pageTitle", "pageTitle_ar",
    "content", "content_ar",
];

const TermsAndConditionsPage = () => {
    const methods = useForm<TermsAndConditionsFormProps>();
    const { register, handleSubmit, setValue, control } = methods;

    // the editors only mount once the saved content is loaded, so they always start with the real content;
    // if loading fails, saving is blocked so an empty form can never overwrite the stored page
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/terms-and-conditions");
                if (res.status === 404) {
                    setStatus("ready"); // nothing saved yet - start empty
                    return;
                }
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                const json = await res.json();
                const data = json?.data || {};
                FIELDS.forEach((key) => setValue(key, data[key] ?? ""));
                setStatus("ready");
            } catch (error) {
                console.error("Failed to load Terms and Conditions:", error);
                setStatus("error");
            }
        };
        fetchData();
    }, [setValue]);

    const onSubmit = async (formData: TermsAndConditionsFormProps) => {
        if (status !== "ready") return;
        try {
            const res = await fetch("/api/admin/terms-and-conditions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) {
                toast.error(result?.message || "Failed to save Terms and Conditions");
                return;
            }
            toast.success("Terms and Conditions updated successfully");
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Something went wrong while saving");
        }
    };

    if (status === "loading") {
        return <div className="p-10 text-center text-black/60">Loading Terms and Conditions...</div>;
    }

    if (status === "error") {
        return (
            <div className="p-10 text-center text-red-600">
                Could not load the Terms and Conditions page. Please refresh before editing - nothing has been changed.
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form className="grid grid-cols-2 gap-10" onSubmit={handleSubmit(onSubmit)}>
                {/* English Version */}
                <div className="flex flex-col gap-6">
                    <AdminItemContainer>
                        <Label main>Banner</Label>
                        <div className="flex gap-4 p-5">
                            <div className="flex flex-col gap-2 w-1/2">
                                <Controller
                                    name="banner"
                                    control={control}
                                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                                />
                            </div>
                            <div className="flex flex-col w-1/2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label>Banner Alt</Label>
                                    <Input {...register("bannerAlt")} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label>Page Title</Label>
                                    <Input {...register("pageTitle")} />
                                </div>
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>Content</Label>
                        <div className="p-5">
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <TinyEditor setNewsContent={field.onChange} newsContent={field.value || "<p></p>"} />
                                )}
                            />
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input {...register("metaTitle")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Description</Label>
                                <Input {...register("metaDescription")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                {/* Arabic Version */}
                <div className="flex flex-col gap-6" dir="rtl">
                    <AdminItemContainer>
                        <Label main>Banner</Label>
                        <div className="flex flex-col gap-4 p-5">
                            <p className="text-sm text-black/50">The banner image is shared with the English version.</p>
                            <div className="flex flex-col gap-1">
                                <Label>Banner Alt</Label>
                                <Input {...register("bannerAlt_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Page Title</Label>
                                <Input {...register("pageTitle_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>Content</Label>
                        <div className="p-5">
                            <Controller
                                name="content_ar"
                                control={control}
                                render={({ field }) => (
                                    <TinyEditor setNewsContent={field.onChange} newsContent={field.value || "<p></p>"} />
                                )}
                            />
                        </div>
                    </AdminItemContainer>

                    <AdminItemContainer>
                        <Label main>SEO</Label>
                        <div className="flex flex-col gap-4 p-5">
                            <div className="flex flex-col gap-1">
                                <Label>Title</Label>
                                <Input {...register("metaTitle_ar")} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Description</Label>
                                <Input {...register("metaDescription_ar")} />
                            </div>
                        </div>
                    </AdminItemContainer>
                </div>

                <div className="col-span-2">
                    <Button type="submit" className="w-full bg-primary text-white font-semibold hover:bg-primary/90">
                        Submit
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default TermsAndConditionsPage;
