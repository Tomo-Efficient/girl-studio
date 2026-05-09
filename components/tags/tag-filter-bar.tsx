import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { TagBadge } from "@/components/tags/tag-badge";

interface TagFilterBarProps {
  currentTag?: string;
}

export async function TagFilterBar({ currentTag }: TagFilterBarProps) {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return null;

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  if (tags.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {currentTag && (
        <Link href="/dashboard">
          <TagBadge name="清除筛选" color="#8c8c8c" />
        </Link>
      )}
      {tags.map((tag) => (
        <Link key={tag.id} href={`/dashboard?tag=${tag.slug}`}>
          <TagBadge
            name={`${tag.name} (${tag._count.items})`}
            color={tag.color}
            selected={tag.slug === currentTag}
          />
        </Link>
      ))}
    </div>
  );
}
