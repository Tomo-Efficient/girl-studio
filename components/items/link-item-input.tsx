"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface LinkPreview {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  favicon: string | null;
}

interface LinkItemInputProps {
  url: string;
  onChange: (data: {
    url: string;
    linkTitle?: string;
    linkDescription?: string;
    linkImageUrl?: string;
    linkFavicon?: string;
  }) => void;
}

export function LinkItemInput({ url, onChange }: LinkItemInputProps) {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreview = useCallback(async (inputUrl: string) => {
    if (!inputUrl.trim()) { setPreview(null); return; }
    try {
      new URL(inputUrl);
    } catch {
      return;
    }

    setFetching(true);
    setError(null);
    try {
      const res = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPreview(data);
      onChange({
        url: inputUrl,
        linkTitle: data.title || undefined,
        linkDescription: data.description || undefined,
        linkImageUrl: data.imageUrl || undefined,
        linkFavicon: data.favicon || undefined,
      });
    } catch {
      setError("无法获取链接预览");
    } finally {
      setFetching(false);
    }
  }, [onChange]);

  return (
    <div className="space-y-3">
      <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
        链接地址
      </label>
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => {
            // Don't auto-fetch on every keystroke—fetch on blur
          }}
          onBlur={(e) => {
            onChange({ url: e.target.value });
            fetchPreview(e.target.value);
          }}
          placeholder="https://..."
          className="border-[#e8dfd5] focus-visible:ring-[#c4736e]"
        />
        {fetching && <Loader2 className="w-5 h-5 animate-spin text-[#c4736e] self-center" />}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {preview && (
        <div className="rounded-sm border border-[#e8dfd5] overflow-hidden bg-white">
          {preview.imageUrl && (
            <Image
              src={preview.imageUrl}
              alt=""
              width={600}
              height={300}
              className="w-full h-36 object-cover"
              unoptimized
            />
          )}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-2">
              {preview.favicon && (
                <Image src={preview.favicon} alt="" width={16} height={16} className="w-4 h-4" unoptimized />
              )}
              <p className="text-sm font-medium line-clamp-1">{preview.title || url}</p>
            </div>
            {preview.description && (
              <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{preview.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
