"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (data: { url: string; thumbnailUrl: string; width: number; height: number }) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("只支持图片文件");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("图片不能超过 10MB");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload(data);
    } catch {
      setError("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors",
          dragOver ? "border-[#c4736e] bg-[#e8d5d3]/20" : "border-[#e8dfd5] hover:border-[#c4736e]/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {preview ? (
          <div className="relative inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={200}
              className="max-h-48 rounded-sm object-contain"
              unoptimized
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-sm">
                <Loader2 className="w-6 h-6 text-[#c4736e] animate-spin" />
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#f2ede7]"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-[var(--muted-foreground)] mx-auto" />
            <p className="text-sm text-[var(--muted-foreground)]">
              拖拽图片到此处，或点击选择
            </p>
            <p className="text-xs text-[var(--muted-foreground)]/60">
              JPG / PNG / WebP，最大 10MB
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
