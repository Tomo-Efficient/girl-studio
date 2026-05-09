"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagBadge } from "@/components/tags/tag-badge";
import { useTags } from "@/hooks/use-tags";

interface TagInputProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagInput({ selectedTags, onChange }: TagInputProps) {
  const [open, setOpen] = useState(false);
  const { tags, createTag } = useTags();

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const selectedTagObjects = tags.filter((t) => selectedTags.includes(t.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {selectedTagObjects.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            selected
            onClick={() => toggleTag(tag.id)}
          />
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-7 gap-1 text-xs border-[#e8dfd5] font-light"
            >
              <Plus className="w-3 h-3" />
              添加标签
              <ChevronsUpDown className="w-3 h-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CreatableTagCommand
              tags={tags}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onCreateTag={async (name) => {
                const newTag = await createTag(name);
                if (newTag) {
                  onChange([...selectedTags, newTag.id]);
                }
              }}
              onClose={() => setOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function CreatableTagCommand({
  tags,
  selectedTags,
  onToggleTag,
  onCreateTag,
  onClose,
}: {
  tags: Array<{ id: string; name: string; color: string | null }>;
  selectedTags: string[];
  onToggleTag: (id: string) => void;
  onCreateTag: (name: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : tags;

  const exactMatch = tags.find((t) => t.name === search);

  return (
    <Command>
      <CommandInput
        placeholder="搜索或创建标签..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {search && !exactMatch && (
            <CommandItem
              onSelect={() => {
                onCreateTag(search);
                setSearch("");
                onClose();
              }}
            >
              <Plus className="w-3 h-3 mr-2" />
              创建 &ldquo;{search}&rdquo;
            </CommandItem>
          )}
          {!search && <p className="p-4 text-xs text-center text-[var(--muted-foreground)]">无标签</p>}
        </CommandEmpty>
        <CommandGroup heading="现有标签">
          {filtered.map((tag) => (
            <CommandItem
              key={tag.id}
              onSelect={() => onToggleTag(tag.id)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color || "#c4736e" }} />
                {tag.name}
              </span>
              {selectedTags.includes(tag.id) && <Check className="w-3 h-3" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
