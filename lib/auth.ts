import { prisma } from "@/lib/prisma";

let cachedUserId: string | null = null;

export async function getOrCreateUser(): Promise<string> {
  if (cachedUserId) return cachedUserId;

  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: { name: "Demo", email: "demo@beauty.studio" },
    });
  }

  cachedUserId = user.id;
  return user.id;
}

export async function currentUserId(): Promise<string> {
  return getOrCreateUser();
}
