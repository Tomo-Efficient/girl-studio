import { notFound } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemDetail } from "@/components/items/item-detail";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const userId = await currentUserId();
  const { id } = await params;

  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!item) notFound();

  return <ItemDetail item={item} />;
}
