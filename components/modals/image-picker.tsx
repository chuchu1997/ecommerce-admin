"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

export default function ImagePickerDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, position: "left" | "right" | "full") => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<"left" | "right" | "full">("full");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (previewUrl) {
      onInsert(previewUrl, position);
      onClose();
      // Reset after insert
      setPreviewUrl(null);
      setPosition("full");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chèn hình ảnh</DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded mt-2"
          />
        )}

        <div className="flex gap-2 mt-4">
          {["left", "right", "full"].map((pos) => (
            <Button
              key={pos}
              variant={position === pos ? "default" : "outline"}
              onClick={() => setPosition(pos as "left" | "right" | "full")}>
              {pos}
            </Button>
          ))}
        </div>

        <Button
          className="mt-4 w-full"
          disabled={!previewUrl}
          onClick={handleInsert}>
          Chèn
        </Button>
      </DialogContent>
    </Dialog>
  );
}