"use client";

import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RiDeleteBinLine } from "react-icons/ri";
import { FormError } from "@/app/components/common/FormError";

/* ---------------- TYPES ---------------- */

type Side = "left" | "right";

interface Country {
    name?: string;
    name_ar?: string;
}

interface SecondSectionItemType {
    name?: string;
    name_ar?: string;
    image: string;
    imageAlt: string;
    imageAlt_ar?: string;
    projects: string;
    projects_ar: string;
    country: string;
    country_ar: string;
    countries: Country[];
}

interface GlobalPresenceForm {
    secondSection: {
        items: SecondSectionItemType[];
    };
}

interface Props {
    index: number;
    removeItem: (index: number) => void;
    side: Side;
}

/* ---------------- COMPONENT ---------------- */

const SecondSectionItem = ({ index, removeItem, side }: Props) => {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<GlobalPresenceForm>();

    const {
        fields: countryFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `secondSection.items.${index}.countries`,
    });

    const countries = useWatch({
        control,
        name: `secondSection.items.${index}.countries`,
    });

    const isLeft = side === "left";
    const isRight = side === "right";

    return (
        <div className="border p-3 rounded-md relative flex flex-col gap-4">
            {/* REMOVE ITEM — ONLY LEFT */}
            {isLeft && (
                <RiDeleteBinLine
                    className="absolute top-2 right-2 cursor-pointer text-red-600"
                    onClick={() => removeItem(index)}
                />
            )}

            {/* NAME */}
            <div>
                <Label className="font-bold">Name</Label>
                {isLeft && <Input placeholder="Name (EN)" {...register(`secondSection.items.${index}.name`)} />}
                {isRight && <Input placeholder="Nmae (AR)" {...register(`secondSection.items.${index}.name_ar`)} />}
            </div>

            {/* IMAGE — ONLY LEFT */}
            <div>
                <Label className="font-bold">Image</Label>
                <Controller
                    name={`secondSection.items.${index}.image`}
                    rules={{ required: "Image is required" }}
                    render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
                />
                <FormError error={errors?.secondSection?.items?.[index]?.image?.message} />
            </div>

            {/* IMAGE ALT */}
            <div>
                <Label className="font-bold">Image Alt</Label>
                {isLeft && (
                    <Input
                        placeholder="Image Alt (EN)"
                        {...register(`secondSection.items.${index}.imageAlt`, {
                            required: "Image Alt is required",
                        })}
                    />
                )}
                {isRight && (
                    <Input placeholder={"Image Alt (AR)"} {...register(`secondSection.items.${index}.imageAlt_ar`)} />
                )}
                <FormError
                    error={
                        isLeft
                            ? errors?.secondSection?.items?.[index]?.imageAlt?.message
                            : errors?.secondSection?.items?.[index]?.imageAlt_ar?.message
                    }
                />
            </div>

            {/* PROJECTS */}
            <div>
                <Label className="font-bold">Projects</Label>

                {isLeft && (
                    <Input
                        placeholder="Projects (EN)"
                        {...register(`secondSection.items.${index}.projects`, {
                            required: "Projects is required",
                        })}
                    />
                )}

                {isRight && (
                    <Input
                        placeholder="Projects (AR)"
                        {...register(`secondSection.items.${index}.projects_ar`, {
                            required: "المشاريع مطلوبة",
                        })}
                    />
                )}

                <FormError
                    error={
                        isLeft
                            ? errors?.secondSection?.items?.[index]?.projects?.message
                            : errors?.secondSection?.items?.[index]?.projects_ar?.message
                    }
                />
            </div>

            {/* TOTAL COUNTRIES */}
            <div>
                <Label className="font-bold">Total Countries</Label>

                {isLeft && (
                    <Input
                        placeholder="Total Countries (EN)"
                        {...register(`secondSection.items.${index}.country`, {
                            required: "Total Countries is required",
                        })}
                    />
                )}

                {isRight && (
                    <Input
                        placeholder="Total Countries (AR)"
                        {...register(`secondSection.items.${index}.country_ar`, {
                            required: "إجمالي الدول مطلوب",
                        })}
                    />
                )}

                <FormError
                    error={
                        isLeft
                            ? errors?.secondSection?.items?.[index]?.country?.message
                            : errors?.secondSection?.items?.[index]?.country_ar?.message
                    }
                />
            </div>

            {/* COUNTRIES */}
            <div>
                <Label className="font-bold">Countries</Label>

                <div className="border p-2 rounded-md flex flex-col gap-2 mt-1">
                    {countryFields.map((field, cIndex) => (
                        <div key={field.id} className="flex gap-2 items-center">
                            {isLeft && (
                                <>
                                    <Input
                                        placeholder="Country (EN)"
                                        {...register(`secondSection.items.${index}.countries.${cIndex}.name`, {
                                            required: "Country name is required",
                                        })}
                                    />
                                    <RiDeleteBinLine
                                        className="cursor-pointer text-red-600"
                                        onClick={() => remove(cIndex)}
                                    />
                                </>
                            )}

                            {isRight && (
                                <Input
                                    className="placeholder:text-black/70"
                                    placeholder={`${countries?.[cIndex]?.name} (EN)`}
                                    {...register(`secondSection.items.${index}.countries.${cIndex}.name_ar`)}
                                />
                            )}
                        </div>
                    ))}

                    <div className={`${isRight ? 'cursor-not-allowed' : ''} flex justify-end`}>
                        <Button type="button" addItem disabled={isRight} onClick={() => append({ name: "", name_ar: "" })}>
                            Add Country
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecondSectionItem;
