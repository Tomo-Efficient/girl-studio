"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ExternalLink, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/tags/tag-badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ItemDetailProps {
  item: {
    id: string;
    type: "IMAGE" | "TEXT" | "LINK";
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    imageWidth?: number | null;
    imageHeight?: number | null;
    textContent?: string | null;
    linkUrl?: string | null;
    linkTitle?: string | null;
    linkDescription?: string | null;
    linkImageUrl?: string | null;
    linkFavicon?: string | null;
    sourceName?: string | null;
    sourceUrl?: string | null;
    isFavorite: boolean;
    createdAt: Date | string;
    tags?: Array<{ tag: { id: string; name: string; slug: string; color: string | null } }>;
    collection?: { id: string; name: string; slug: string } | null;
  };
}

export function ItemDetail({ item }: ItemDetailProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [deleting, setDeleting] = useState(false);

  const handleFavorite = async () => {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: next }),
      });
    } catch {
      setIsFavorite(!next);
      toast.error("操作失败");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("已删除");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("删除失败");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[#2c2c2c] transition-colors no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Link>

      {/* Content area */}
      <div className="bg-white border border-[#e8dfd5] rounded-sm overflow-hidden">
        {item.type === "IMAGE" && item.imageUrl && (
          <div className="relative bg-[#f2ede7]">
            <Image
              src={item.imageUrl}
              alt={item.title || ""}
              width={item.imageWidth || 1200}
              height={item.imageHeight || 800}
              className="w-full max-h-[70vh] object-contain"
              unoptimized
            />
          </div>
        )}

        {item.type === "TEXT" && item.textContent && (
          <div className="p-8 md:p-12">
            <blockquote className="font-[family-name:var(--font-serif)] text-xl md:text-3xl font-light leading-relaxed text-center">
              &ldquo;{item.textContent}&rdquo;
            </blockquote>
          </div>
        )}

        {item.type === "LINK" && item.linkUrl && (
          <div className="p-8">
            {item.linkImageUrl && (
              <Image
                src={item.linkImageUrl}
                alt=""
                width={1200}
                height={600}
                className="w-full max-h-64 object-cover rounded-sm mb-6"
                unoptimized
              />
            )}
            <div className="flex items-center gap-3 mb-3">
              {item.linkFavicon && (
                <Image src={item.linkFavicon} alt="" width={20} height={20} className="w-5 h-5" unoptimized />
              )}
              <h2 className="font-[family-name:var(--font-serif)] text-xl font-light">
                {item.linkTitle || item.linkUrl}
              </h2>
            </div>
            {item.linkDescription && (
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.linkDescription}</p>
            )}
            <a
              href={item.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-sm text-[#c4736e] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              打开原链接
            </a>
          </div>
        )}

        {/* Meta info */}
        <div className="p-6 border-t border-[#e8dfd5] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {item.title && (
                <h1 className="font-[family-name:var(--font-serif)] text-xl font-light mb-1">{item.title}</h1>
              )}
              {item.description && (
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-lg">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                className="hover:bg-[#f2ede7]"
              >
                <Heart className={isFavorite ? "w-5 h-5 text-[#c4736e] fill-[#c4736e]" : "w-5 h-5"} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/dashboard/items/${item.id}/edit`)}
                className="hover:bg-[#f2ede7]"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={deleting}
                className="hover:bg-red-50 text-red-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {(item.sourceName || item.sourceUrl) && (
            <div className="text-xs text-[var(--muted-foreground)]">
              来源：
              {item.sourceUrl ? (
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#c4736e] hover:underline">
                  {item.sourceName || item.sourceUrl}
                </a>
              ) : (
                <span>{item.sourceName}</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {item.tags?.map(({ tag }) => (
              <Link key={tag.id} href={`/dashboard?tag=${tag.slug}`}>
                <TagBadge name={tag.name} color={tag.color} />
              </Link>
            ))}
            {item.collection && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2ede7] text-[var(--muted-foreground)]">
                {item.collection.name}
              </span>
            )}
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            创建于 {formatDate(item.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
