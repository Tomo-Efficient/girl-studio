import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import sharp from "sharp";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

    // Upload original
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
    });

    // Generate thumbnail (600px wide, webp, quality 80)
    const thumbnail = await sharp(buffer)
      .resize(600, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const thumbBlob = await put(`${filename}-thumb.webp`, thumbnail, {
      access: "public",
      contentType: "image/webp",
    });

    // Get original dimensions
    const metadata = await sharp(buffer).metadata();

    return NextResponse.json({
      url: blob.url,
      thumbnailUrl: thumbBlob.url,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
