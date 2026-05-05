import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiDeleteBinLine } from "react-icons/ri";
import { Textarea } from "@/components/ui/textarea";
import {
    Control,
    FieldErrors,
    UseFormRegister,
} from "react-hook-form";
import { ProjectFormProps } from "./ProjectForm";
import TinyEditor from "../TinyMce/TinyEditor";


type ServiceItemsEditorProps = {
    control: Control<ProjectFormProps>;
    register: UseFormRegister<ProjectFormProps>;
    serviceIndex: number;
    selected: boolean;
    errors: FieldErrors<ProjectFormProps>;
};

export const ServiceItemsEditor = ({
    control,
    register,
    serviceIndex,
    selected,
    errors
}: ServiceItemsEditorProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `secondSection.service.${serviceIndex}.items`
    });


    if (!selected || serviceIndex === -1) return null;

    return (
        <div className="flex flex-col gap-2 p-5">
            <Label className="font-bold">Items</Label>

            <div className="border p-2 rounded-md flex flex-col gap-5">
                {fields.map((fieldItem, idx) => (
                    <div key={fieldItem.id} className="grid grid-cols-1 gap-2 relative border-b pb-5">

                        <div className="absolute top-2 right-2">
                            <RiDeleteBinLine
                                onClick={() => remove(idx)}
                                className="cursor-pointer text-red-600"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Title</Label>
                            <Input
                                {...register(`secondSection.service.${serviceIndex}.items.${idx}.title`, {
                                    validate: (value) => {
                                        if (!selected) return true;
                                        return value?.trim() !== "" || "Title is required";
                                    }
                                })}
                            />
                        </div>

                        <div className="flex flex-col gap-2 h-[250px]">
                            <Label>Description</Label>
                            <Controller
                                name={`secondSection.service.${serviceIndex}.items.${idx}.description`}
                                control={control}
                                rules={{ required: "Description is required" }}
                                render={({ field }) => {
                                    return <TinyEditor setNewsContent={field.onChange} newsContent={field.value} />;
                                }}
                            />
                            {/* <Textarea
                {...register(`secondSection.service.${serviceIndex}.items.${idx}.description`, {
                  validate: (value) => {
                    if (!selected) return true;
                    return value?.trim() !== "" || "Description is required";
                  }
                })}
              /> */}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end">
                    <Button
                        type="button"
                        className="text-white"
                        onClick={() => append({ title: "", description: "" })}
                    >
                        Add Item
                    </Button>
                </div>
            </div>
        </div>
    );
};