import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { ItemUpdateInput } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;

  const item = await prisma.item.findFirst({
    where: { id, userId: user.id },
    include: {
      tags: { include: { tag: true } },
      collection: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;

  const existing = await prisma.item.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const body: ItemUpdateInput = await req.json();
  const { tagIds, ...rest } = body;

  if (tagIds !== undefined) {
    // Replace all tags
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
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;

  const existing = await prisma.item.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  await prisma.item.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
