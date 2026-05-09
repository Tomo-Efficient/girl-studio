import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const response = await fetch(parsed.toString(), {
      headers: { "User-Agent": "GirlStudio/1.0" },
      signal: AbortSignal.timeout(8000),
    });

    const html = await response.text();

    const getMeta = (prop: string): string | null => {
      const match = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i"))
        || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, "i"));
      return match ? match[1] : null;
    };

    const title = getMeta("title") || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || null;
    const description = getMeta("description");
    const image = getMeta("image");

    const faviconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)
      || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i);
    const favicon = faviconMatch
      ? new URL(faviconMatch[1], parsed.origin).toString()
      : `${parsed.origin}/favicon.ico`;

    return NextResponse.json({
      title,
      description,
      imageUrl: image,
      favicon,
      url: parsed.toString(),
    });
  } catch (error) {
    console.error("Link preview error:", error);
    return NextResponse.json({ error: "Failed to fetch link preview" }, { status: 500 });
  }
}
