import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ItemUpdateInput } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await currentUserId();
  const { id } = await params;

  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await currentUserId();
  const { id } = await params;

  const existing = await prisma.item.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body: ItemUpdateInput = await req.json();
  const { tagIds, ...rest } = body;

  if (tagIds !== undefined) {
    await prisma.itemTag.deleteMany({ where: { itemId: id } });
    if (tagIds.length > 0) {
      await prisma.itemTag.createMany({
        data: tagIds.map((tagId) => ({ itemId: id, tagId })),
      });
    }
  }

  const item = await prisma.item.update({
    where: { id },
    data: rest,
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await currentUserId();
  const { id } = await params;

  const existing = await prisma.item.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
