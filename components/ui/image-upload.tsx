/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onRemove: (value: string) => void;
  onChange: (value: string) => void;
  value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onRemove,
  onChange,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const uploadImage = (result: any) => {
    setIsUploading(false);

    onChange(result.info.url);
  };

  return (
    <div>
      <div className="mb-4 relative overflow-x-hidden md:overflow-x-auto ">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-start gap-4">
          {value.map((url) => (
            <div
              key={url}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button
                  variant={"destructive"}
                  size="icon"
                  type="button"
                  onClick={() => onRemove(url)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <Image
                fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="eager" // ✅ Ensures images load immediately
                alt="Image"
                src={url}></Image>
            </div>
          ))}
        </div>
      </div>

      {/* THIS IS IS CLOUDINARY  */}
      <CldUploadWidget
        uploadPreset="nguyencuong" // Replace with your Cloudinary upload preset
        onSuccess={uploadImage}
        onOpen={() => setIsUploading(true)}
        options={{
          sources: ["local", "url", "camera", "google_drive", "dropbox"],
          resourceType: "image",
          maxFileSize: 10000000, // 10MB
        }}>
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            disabled={disabled || isUploading}>
            {isUploading ? "Uploading..." : "Upload Images"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
