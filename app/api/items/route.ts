import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/utils";
import type { ItemCreateInput } from "@/types";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  const type = searchParams.get("type");
  const tag = searchParams.get("tag");
  const collectionId = searchParams.get("collectionId");
  const favorite = searchParams.get("favorite");
  const sort = searchParams.get("sort") || "newest";
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 48);

  const where: Prisma.ItemWhereInput = { userId: user.id };

  if (type && ["IMAGE", "TEXT", "LINK"].includes(type)) {
    where.type = type as Prisma.EnumItemTypeFilter["equals"];
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { textContent: { contains: q, mode: "insensitive" } },
      { linkTitle: { contains: q, mode: "insensitive" } },
      { sourceName: { contains: q, mode: "insensitive" } },
    ];
  }

  if (tag) {
    where.tags = { some: { tag: { slug: tag, userId: user.id } } };
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

  return NextResponse.json({
    items,
    nextCursor,
    total: items.length,
  });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body: ItemCreateInput = await req.json();

  const { tagIds, collectionId, textContent, ...rest } = body;

  const data: Prisma.ItemCreateInput = {
    ...rest,
    textLength: textContent ? textContent.length : undefined,
    user: { connect: { id: user.id } },
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
