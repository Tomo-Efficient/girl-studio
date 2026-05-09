import { NextRequest, NextResponse } from "next/server";
import { currentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const TAG_COLORS = [
  "#c4736e", "#b8a9c9", "#a3b8a8", "#d4c5a9",
  "#8ba88f", "#c4a69d", "#a08db8", "#d4b8ae",
];

export async function GET() {
  const userId = await currentUserId();

  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const userId = await currentUserId();
  const { name, color } = await req.json();

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Tag name required" }, { status: 400 });
  }

  const slug = slugify(name.trim());
  if (!slug) {
    return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
  }

  const existing = await prisma.tag.findUnique({
    where: { userId_slug: { userId, slug } },
  });

  if (existing) return NextResponse.json(existing);

  const tag = await prisma.tag.create({
    data: {
      name: name.trim(),
      slug,
      color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      userId,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
