"use client";

import { photos } from "@/constants/default-images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import FormErrors from "./form-errors";

type Props = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

const FormPicker = ({ id, errors }: Props) => {
  const { pending } = useFormStatus();

  const [images, setImages] = useState<Array<Record<string, any>>>(photos);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const resp = result.response as unknown as Array<Record<string, any>>;
          setImages(resp);
        } else {
          console.error("No response from Unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(photos);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-main animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => {
          const isSelected = selectedImageId === image.id;
          return (
            <div
              key={image.id}
              className={cn(
                "aspect-video relative group hover:opacity-75 transition bg-muted rounded-sm",
                isSelected && "ring-2 ring-main ring-offset-2",
                pending && "opacity-50 hover:opacity-50 cursor-auto"
              )}
              onClick={() => {
                if (pending) return;
                setSelectedImageId(image.id);
              }}
            >
              <input
                id={id}
                name={id}
                type="radio"
                className="hidden"
                checked={isSelected}
                readOnly
                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              />
              <Image
                src={image.urls.thumb}
                alt={id}
                className="object-cover rounded-sm"
                fill
              />
              <Link
                href={image.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute
                bottom-0 inset-x-0 text-xs truncate text-white hover:underline
                transition px-1 py-px bg-black/50 rounded-b-sm"
              >
                {image.user.name}
              </Link>
            </div>
          );
        })}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};

export default FormPicker;
