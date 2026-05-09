"use client";

import { ItemCard } from "@/components/items/item-card";

interface ItemGridProps {
  items: Array<Parameters<typeof ItemCard>[0]["item"]>;
  loading?: boolean;
}

export function ItemGrid({ items, loading }: ItemGridProps) {
  if (loading) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4 rounded-sm bg-white border border-[#e8dfd5] animate-pulse">
            <div className="h-48 bg-[#f2ede7]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-[#f2ede7] rounded w-2/3" />
              <div className="h-3 bg-[#f2ede7] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-[family-name:var(--font-serif)] text-2xl font-light text-[#2c2c2c] mb-3">
          还没有灵感
        </p>
        <p className="text-sm text-[var(--muted-foreground)] max-w-sm leading-relaxed">
          你的审美收藏是空的。点击右上角的"新增"按钮，开始积累属于你的灵感碎片。
        </p>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
