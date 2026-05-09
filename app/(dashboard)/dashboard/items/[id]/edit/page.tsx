import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const { id } = await params;

  const item = await prisma.item.findFirst({
    where: { id, userId: user.id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!item) notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light mb-6">编辑灵感</h2>
      <p className="text-sm text-[var(--muted-foreground)]">
        编辑功能将在下一步完成。目前你可以修改基本信息。
      </p>
      {/* Simplified edit for now — full form reuse in a future iteration */}
    </div>
  );
}
