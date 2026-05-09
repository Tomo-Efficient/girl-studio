"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Plus, Heart, Menu, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function navLinkClasses(active: boolean) {
  return cn(
    "flex items-center gap-2 w-full h-9 px-3 rounded-sm text-sm font-light no-underline transition-colors",
    active
      ? "bg-[#f2ede7] text-[#2c2c2c]"
      : "text-[#2c2c2c] hover:bg-[#f2ede7]"
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");
  const isFavorite = searchParams.get("favorite") === "true";
  const isHome = !currentTag && !isFavorite && pathname === "/dashboard";

  return (
    <>
      <aside className="hidden md:flex w-60 flex-col border-r border-[#e8dfd5] bg-[#faf8f5] h-full">
        <div className="p-5">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wider no-underline text-[#2c2c2c]">
            Beauty
          </Link>
        </div>

        <Separator className="bg-[#e8dfd5]" />

        <div className="p-3 space-y-1">
          <Link href="/dashboard" className={navLinkClasses(isHome)}>
            所有灵感
          </Link>
          <Link
            href="/dashboard?favorite=true"
            className={navLinkClasses(isFavorite)}
          >
            <Heart className="w-4 h-4" />
            收藏
          </Link>
        </div>

        <Separator className="bg-[#e8dfd5]" />

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-[var(--muted-foreground)] font-medium">
            Tags
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-0.5">
              <p className="text-xs text-[var(--muted-foreground)] px-2 py-4 text-center">
                加载标签...
              </p>
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-[#e8dfd5]" />

        <div className="p-3 space-y-1">
          <Link
            href="/dashboard/items/new"
            className={cn(navLinkClasses(false), "text-[#c4736e]")}
          >
            <Plus className="w-4 h-4" />
            添加灵感
          </Link>
        </div>

        <div className="p-4 flex items-center gap-3 border-t border-[#e8dfd5]">
          <div className="w-8 h-8 rounded-full bg-[#f2ede7] flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--muted-foreground)]" />
          </div>
          <span className="text-sm font-light truncate">Demo</span>
        </div>
      </aside>

      <Sheet>
        <SheetTrigger className="md:hidden absolute top-3 left-3 z-50 inline-flex items-center justify-center size-8 rounded-sm hover:bg-[#f2ede7] text-[#2c2c2c]">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 bg-[#faf8f5]">
          <MobileSidebar currentTag={currentTag} isFavorite={isFavorite} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function MobileSidebar({ currentTag, isFavorite }: { currentTag: string | null; isFavorite: boolean }) {
  const isHome = !currentTag && !isFavorite;
  return (
    <div className="flex flex-col h-full">
      <div className="p-5">
        <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold tracking-wider no-underline text-[#2c2c2c]">
          Beauty
        </Link>
      </div>
      <Separator className="bg-[#e8dfd5]" />
      <div className="p-3 space-y-1">
        <Link href="/dashboard" className={navLinkClasses(isHome)}>
          所有灵感
        </Link>
        <Link href="/dashboard?favorite=true" className={navLinkClasses(isFavorite)}>
          <Heart className="w-4 h-4" />
          收藏
        </Link>
      </div>
      <Separator className="bg-[#e8dfd5]" />
      <div className="p-3 space-y-1">
        <Link href="/dashboard/items/new" className={cn(navLinkClasses(false), "text-[#c4736e]")}>
          <Plus className="w-4 h-4" />
          添加灵感
        </Link>
      </div>
      <div className="mt-auto p-4 border-t border-[#e8dfd5] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f2ede7] flex items-center justify-center">
          <User className="w-4 h-4 text-[var(--muted-foreground)]" />
        </div>
        <span className="text-sm font-light truncate">Demo</span>
      </div>
    </div>
  );
}
