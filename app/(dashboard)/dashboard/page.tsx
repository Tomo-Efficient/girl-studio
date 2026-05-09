import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemGrid } from "@/components/items/item-grid";
import { TagFilterBar } from "@/components/tags/tag-filter-bar";
import { Prisma } from "@prisma/client";

interface DashboardPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    tag?: string;
    favorite?: string;
    sort?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const userId = await currentUserId();
  const params = await searchParams;
  const { q, type, tag, favorite, sort } = params;

  const where: Prisma.ItemWhereInput = { userId };

  if (type && ["IMAGE", "TEXT", "LINK"].includes(type)) {
    where.type = type as Prisma.EnumItemTypeFilter["equals"];
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { textContent: { contains: q } },
      { linkTitle: { contains: q } },
      { sourceName: { contains: q } },
    ];
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag, userId } } };
  }

  if (favorite === "true") {
    where.isFavorite = true;
  }

  const orderBy: Prisma.ItemOrderByWithRelationInput =
    sort === "oldest" ? { createdAt: "asc" }
    : sort === "updated" ? { updatedAt: "desc" }
    : { createdAt: "desc" };

  const items = await prisma.item.findMany({
    where,
    orderBy,
    take: 48,
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <TagFilterBar currentTag={tag} />
      <ItemGrid items={items} />
    </div>
  );
}
