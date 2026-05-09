"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/tags/tag-input";
import { ImageUpload } from "@/components/items/image-upload";
import { TextItemInput } from "@/components/items/text-item-input";
import { LinkItemInput } from "@/components/items/link-item-input";
import { Loader2, Image, Type, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import type { ItemCreateInput } from "@/types";

export function AddItemForm() {
  const router = useRouter();
  const [type, setType] = useState<"IMAGE" | "TEXT" | "LINK">("IMAGE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Image
  const [imageData, setImageData] = useState<{ url: string; thumbnailUrl: string; width: number; height: number } | null>(null);

  // Text
  const [textContent, setTextContent] = useState("");

  // Link
  const [linkData, setLinkData] = useState<{
    url: string;
    linkTitle?: string;
    linkDescription?: string;
    linkImageUrl?: string;
    linkFavicon?: string;
  }>({ url: "" });

  // Meta
  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = () => {
    if (type === "IMAGE") return !!imageData;
    if (type === "TEXT") return textContent.trim().length > 0;
    if (type === "LINK") return !!linkData.url;
    return false;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;
    setSubmitting(true);

    const body: ItemCreateInput = {
      type,
      title: title || undefined,
      description: description || undefined,
      sourceName: sourceName || undefined,
      sourceUrl: sourceUrl || undefined,
      tagIds: selectedTags.length > 0 ? selectedTags : undefined,
    };

    if (type === "IMAGE" && imageData) {
      body.imageUrl = imageData.url;
      body.thumbnailUrl = imageData.thumbnailUrl;
      body.imageWidth = imageData.width;
      body.imageHeight = imageData.height;
    } else if (type === "TEXT") {
      body.textContent = textContent.trim();
      body.textLength = textContent.trim().length;
    } else if (type === "LINK") {
      body.linkUrl = linkData.url;
      body.linkTitle = linkData.linkTitle;
      body.linkDescription = linkData.linkDescription;
      body.linkImageUrl = linkData.linkImageUrl;
      body.linkFavicon = linkData.linkFavicon;
    }

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("灵感已保存");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="font-[family-name:var(--font-serif)] text-2xl font-light">添加灵感</h2>

      <Tabs value={type} onValueChange={(v) => setType(v as "IMAGE" | "TEXT" | "LINK")}>
        <TabsList className="bg-[#f2ede7] h-10 p-1 rounded-sm">
          <TabsTrigger value="IMAGE" className="gap-1.5 data-[state=active]:bg-white text-sm h-8 rounded-sm">
            <Image className="w-4 h-4" />
            图片
          </TabsTrigger>
          <TabsTrigger value="TEXT" className="gap-1.5 data-[state=active]:bg-white text-sm h-8 rounded-sm">
            <Type className="w-4 h-4" />
            文字
          </TabsTrigger>
          <TabsTrigger value="LINK" className="gap-1.5 data-[state=active]:bg-white text-sm h-8 rounded-sm">
            <LinkIcon className="w-4 h-4" />
            链接
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="IMAGE">
            <ImageUpload
              onUpload={(data) => setImageData(data)}
            />
          </TabsContent>
          <TabsContent value="TEXT">
            <TextItemInput value={textContent} onChange={setTextContent} />
          </TabsContent>
          <TabsContent value="LINK">
            <LinkItemInput
              url={linkData.url}
              onChange={(data) => setLinkData((prev) => ({ ...prev, ...data }))}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Meta fields */}
      <div className="space-y-4 pt-4 border-t border-[#e8dfd5]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
              标题（可选）
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这段灵感起个名字"
              className="border-[#e8dfd5] focus-visible:ring-[#c4736e]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
              来源名称（可选）
            </label>
            <Input
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="Pinterest / Are.na / 小红书"
              className="border-[#e8dfd5] focus-visible:ring-[#c4736e]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
            描述（可选）
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="为什么这段灵感打动你？"
            className="min-h-[80px] border-[#e8dfd5] focus-visible:ring-[#c4736e]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
            标签
          </label>
          <TagInput selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit() || submitting}
            className="bg-[#c4736e] hover:bg-[#b0635e] text-white font-light px-8"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            保存灵感
          </Button>
        </div>
      </div>
    </div>
  );
}
