"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: {
    id: string;
    type: "IMAGE" | "TEXT" | "LINK";
    title?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    textContent?: string | null;
    linkUrl?: string | null;
    linkTitle?: string | null;
    linkDescription?: string | null;
    linkImageUrl?: string | null;
    sourceName?: string | null;
    sourceUrl?: string | null;
    isFavorite?: boolean;
    tags?: Array<{ tag: { id: string; name: string; slug: string; color: string | null } }>;
    createdAt: Date | string;
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const tag = item.tags?.[0]?.tag;

  return (
    <Link
      href={`/dashboard/items/${item.id}`}
      className="block break-inside-avoid mb-4 group relative overflow-hidden rounded-sm bg-white border border-[#e8dfd5] hover:border-[#c4736e]/40 transition-all duration-300 hover:shadow-sm"
    >
      {item.type === "IMAGE" && item.thumbnailUrl && (
        <div className="relative w-full overflow-hidden">
          <Image
            src={item.thumbnailUrl}
            alt={item.title || ""}
            width={600}
            height={400}
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {item.type === "TEXT" && item.textContent && (
        <div className="p-4 md:p-5">
          <blockquote className="font-[family-name:var(--font-serif)] text-base leading-relaxed text-[#2c2c2c] line-clamp-3">
            &ldquo;{item.textContent}&rdquo;
          </blockquote>
        </div>
      )}

      {item.type === "LINK" && (
        <div className="p-4 md:p-5">
          {item.linkImageUrl && (
            <Image
              src={item.linkImageUrl}
              alt=""
              width={600}
              height={300}
              className="w-full h-32 object-cover rounded-sm mb-3"
              unoptimized
            />
          )}
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.linkUrl}</span>
          </div>
          {(item.linkTitle || item.linkDescription) && (
            <div className="mt-2">
              {item.linkTitle && <p className="text-sm font-medium line-clamp-1">{item.linkTitle}</p>}
              {item.linkDescription && <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mt-1">{item.linkDescription}</p>}
            </div>
          )}
        </div>
      )}

      {/* Info bar */}
      <div className="px-4 md:px-5 py-3 flex items-center justify-between border-t border-[#e8dfd5]/50">
        <div className="flex items-center gap-2 min-w-0">
          {tag && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full text-white truncate max-w-[100px]"
              style={{ backgroundColor: tag.color || "#c4736e" }}
            >
              {tag.name}
            </span>
          )}
          {item.title && !tag && (
            <span className="text-xs text-[var(--muted-foreground)] truncate">{item.title}</span>
          )}
        </div>
        {item.isFavorite && <Heart className="w-3 h-3 text-[#c4736e] fill-[#c4736e]" />}
      </div>
    </Link>
  );
}
