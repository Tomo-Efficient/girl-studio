"use client";

import { Textarea } from "@/components/ui/textarea";

interface TextItemInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextItemInput({ value, onChange }: TextItemInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-[var(--muted-foreground)] tracking-[0.05em] uppercase">
        文字内容
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="粘贴打动你的文案、诗句、台词..."
        className="min-h-[180px] text-base leading-relaxed border-[#e8dfd5] focus-visible:ring-[#c4736e] resize-y font-[family-name:var(--font-serif)]"
      />
      <p className="text-[10px] text-[var(--muted-foreground)] text-right">
        {value.length} 字
      </p>
    </div>
  );
}
