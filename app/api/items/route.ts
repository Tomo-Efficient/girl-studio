import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ItemCreateInput } from "@/types";

export async function GET(req: NextRequest) {
  const userId = await currentUserId();

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const collectionId = searchParams.get("collectionId");
  const favorite = searchParams.get("favorite");
  const sort = searchParams.get("sort") || "newest";
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 48);

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

  if (collectionId) {
    where.collectionId = collectionId;
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
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  let nextCursor: string | null = null;
  if (items.length > limit) {
    const next = items.pop();
    nextCursor = next!.id;
  }

  return NextResponse.json({ items, nextCursor });
}

export async function POST(req: NextRequest) {
  const userId = await currentUserId();
  const body: ItemCreateInput = await req.json();
  const { tagIds, collectionId, textContent, ...rest } = body;

  const data: Prisma.ItemCreateInput = {
    ...rest,
    textLength: textContent ? textContent.length : undefined,
    user: { connect: { id: userId } },
  };

  if (tagIds && tagIds.length > 0) {
    data.tags = {
      create: tagIds.map((tagId) => ({
        tag: { connect: { id: tagId } },
      })),
    };
  }

  if (collectionId) {
    data.collection = { connect: { id: collectionId } };
  }

  const item = await prisma.item.create({
    data,
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(item, { status: 201 });
}
