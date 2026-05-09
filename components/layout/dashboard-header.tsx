"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/dashboard?${params.toString()}`);
  }, 300);

  return (
    <header className="h-14 border-b border-[#e8dfd5] flex items-center gap-3 px-4 md:px-6 shrink-0 bg-[#faf8f5]">
      <div className="w-60 md:hidden" />
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <Input
          type="text"
          placeholder="搜索灵感..."
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 h-9 text-sm border-[#e8dfd5] bg-white focus-visible:ring-[#c4736e]"
        />
      </div>

      <Link
        href="/dashboard/items/new"
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-3 rounded-sm text-sm font-light no-underline whitespace-nowrap transition-colors",
          "bg-[#c4736e] text-white hover:bg-[#b0635e]"
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">新增</span>
      </Link>
    </header>
  );
}
