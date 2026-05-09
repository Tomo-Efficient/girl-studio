import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
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
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const baseName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const filename = `${baseName}.webp`;
    const filepath = path.join(uploadsDir, filename);
    const thumbFilename = `${baseName}-thumb.webp`;
    const thumbFilepath = path.join(uploadsDir, thumbFilename);

    // Save optimized original as WebP
    const optimized = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer();
    await writeFile(filepath, optimized);

    // Generate thumbnail
    const thumbnail = await sharp(buffer)
      .resize(600, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    await writeFile(thumbFilepath, thumbnail);

    const metadata = await sharp(buffer).metadata();

    return NextResponse.json({
      url: `/uploads/${filename}`,
      thumbnailUrl: `/uploads/${thumbFilename}`,
      width: metadata.width,
      height: metadata.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
