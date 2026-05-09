import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS = [
  { name: "穿搭", slug: "outfit", color: "#c4736e" },
  { name: "摄影", slug: "photography", color: "#8ba88f" },
  { name: "文案", slug: "copywriting", color: "#b8a9c9" },
  { name: "建筑", slug: "architecture", color: "#d4c5a9" },
  { name: "设计", slug: "design", color: "#a08db8" },
  { name: "灵感", slug: "inspiration", color: "#c4a69d" },
];

const SEED_ITEMS = [
  {
    type: "IMAGE" as const,
    title: "丹麦海边度假屋",
    description: "温暖的自然光、亚麻织物、不加修饰的材质——这间小屋定义了什么是舒适的留白。",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=60",
    sourceName: "Unsplash",
    sourceUrl: "https://unsplash.com",
    tagSlugs: ["architecture", "photography", "inspiration"],
    isFavorite: true,
  },
  {
    type: "IMAGE" as const,
    title: "90s 极简穿搭",
    description: "白衬衫、直筒牛仔裤、黑色细带凉鞋。越是简单的单品，越考验剪裁和面料。",
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=60",
    sourceName: "Pinterest",
    sourceUrl: "https://pinterest.com",
    tagSlugs: ["outfit", "inspiration"],
    isFavorite: true,
  },
  {
    type: "IMAGE" as const,
    title: "东京中目黑书店",
    description: "混凝土墙面与橡木书架的并置。灯光只打在书脊上，其余都留给阴影。",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=60",
    sourceName: "Unsplash",
    sourceUrl: "https://unsplash.com",
    tagSlugs: ["design", "architecture", "photography"],
    isFavorite: false,
  },
  {
    type: "IMAGE" as const,
    title: "陶艺家工作室一角",
    description: "未上釉的素坯、散落的工具、窗台上的干花。美在过程，不在成品。",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=60",
    sourceName: "Are.na",
    sourceUrl: "https://are.na",
    tagSlugs: ["design", "inspiration"],
    isFavorite: false,
  },
  {
    type: "TEXT" as const,
    title: "山本耀司",
    textContent: "黑色是一种最有态度的颜色，它分明在表达——我不烦你，你也别烦我。",
    sourceName: "山本耀司",
    sourceUrl: "",
    tagSlugs: ["copywriting", "inspiration"],
    isFavorite: true,
  },
  {
    type: "TEXT" as const,
    title: "原研哉《白》",
    textContent: "白不是无色，而是容纳所有可能性的容器。设计不是制造色彩，而是为白赋予意义。",
    sourceName: "原研哉《白》",
    sourceUrl: "",
    tagSlugs: ["copywriting", "design"],
    isFavorite: true,
  },
  {
    type: "TEXT" as const,
    title: "Agnes Martin",
    textContent: "When I think of art, I think of beauty. Beauty is the mystery of life. It is not in the eye, it is in the mind.",
    sourceName: "Agnes Martin",
    sourceUrl: "",
    tagSlugs: ["copywriting", "inspiration"],
    isFavorite: false,
  },
  {
    type: "LINK" as const,
    title: "为什么我们会被「不完美」打动",
    linkUrl: "https://en.wikipedia.org/wiki/Wabi-sabi",
    linkTitle: "Wabi-sabi — Wikipedia",
    linkDescription: "A world view centered on the acceptance of transience and imperfection. The aesthetic is sometimes described as one of appreciating beauty that is imperfect, impermanent, and incomplete.",
    linkFavicon: "https://en.wikipedia.org/favicon.ico",
    tagSlugs: ["inspiration", "design"],
    isFavorite: false,
  },
  {
    type: "LINK" as const,
    title: "MUJI 的设计哲学",
    linkUrl: "https://www.muji.com",
    linkTitle: "MUJI — 無印良品",
    linkDescription: "追求合理的价格与优良的品质，通过消除不必要的功能与装饰，呈现物品本来的样子。",
    linkFavicon: "https://www.muji.com/favicon.ico",
    tagSlugs: ["design", "inspiration"],
    isFavorite: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure demo user exists
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { name: "Demo", email: "demo@beauty.studio" },
    });
    console.log("  Created demo user");
  }

  // Create tags
  const tagMap: Record<string, string> = {};
  for (const tag of TAGS) {
    const created = await prisma.tag.upsert({
      where: { userId_slug: { userId: user.id, slug: tag.slug } },
      create: { ...tag, userId: user.id },
      update: { name: tag.name, color: tag.color },
    });
    tagMap[tag.slug] = created.id;
  }
  console.log(`  Created/updated ${TAGS.length} tags`);

  // Create items
  for (const item of SEED_ITEMS) {
    const { tagSlugs, ...itemData } = item;

    const existing = await prisma.item.findFirst({
      where: { userId: user.id, title: item.title },
    });
    if (existing) continue;

    await prisma.item.create({
      data: {
        ...itemData,
        textLength: itemData.type === "TEXT" ? itemData.textContent?.length : undefined,
        userId: user.id,
        tags: {
          create: tagSlugs
            .filter((slug) => tagMap[slug])
            .map((slug) => ({ tagId: tagMap[slug] })),
        },
      },
    });
  }
  console.log(`  Created ${SEED_ITEMS.length} items`);

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
