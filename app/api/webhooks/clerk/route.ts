import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 401 });
  }

  const { id: clerkId } = evt.data;
  if (!clerkId) return new Response("Missing clerk ID", { status: 400 });

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await prisma.user.upsert({
      where: { clerkId },
      update: { email: primaryEmail, name, avatarUrl: image_url },
      create: { clerkId, email: primaryEmail, name, avatarUrl: image_url },
    });
  }

  if (eventType === "user.deleted") {
    await prisma.user.delete({ where: { clerkId } }).catch(() => {
      // already deleted via cascade or doesn't exist
    });
  }

  return new Response("ok", { status: 200 });
}

export const dynamic = "force-dynamic";
