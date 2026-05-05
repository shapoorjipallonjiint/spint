import { useForm, Controller, useFieldArray,Control } from "react-hook-form";
import { ProjectFormProps } from "./ProjectForm";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/image-uploader";
import Image from "next/image";

type ServiceImagesEditorProps = {
  control: Control<ProjectFormProps>;
  serviceIndex: number;
};

export const ServiceImagesEditor = ({
  control,
  serviceIndex,
}: ServiceImagesEditorProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `secondSection.service.${serviceIndex}.images`,
  });

  const handleImageUpload = (url: string) => {
    append({ url });
  };

  return (
    <div className="">
      {/* <div className="flex justify-between items-center">
        <Label className="block text-sm">Images</Label>
      </div> */}

      <div className="mt-2 w-full">
        <ImageUploader
          onChange={handleImageUpload}
          deleteAfterUpload
          multiple
          className="w-full"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {fields.map((img, index) => (
          <div key={img.id} className="relative h-40">
            <Image
              src={img.url}
              alt="service image"
              className="h-full w-full object-cover rounded-lg"
              width={100}
              height={100}
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};