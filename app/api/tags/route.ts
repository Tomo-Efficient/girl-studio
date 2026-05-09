import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const TAG_COLORS = [
  "#c4736e", "#b8a9c9", "#a3b8a8", "#d4c5a9",
  "#8ba88f", "#c4a69d", "#a08db8", "#d4b8ae",
];

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { name, color } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
  }

  const slug = slugify(name.trim());
  if (!slug) {
    return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
  }

  const assignedColor = color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

  const existing = await prisma.tag.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const tag = await prisma.tag.create({
    data: {
      name: name.trim(),
      slug,
      color: assignedColor,
      userId: user.id,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
