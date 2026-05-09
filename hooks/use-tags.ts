import { useState, useEffect, useCallback } from "react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count?: { items: number };
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tags");
      if (res.ok) {
        setTags(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = async (name: string, color?: string) => {
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });
    if (res.ok) {
      const newTag = await res.json();
      setTags((prev) => {
        if (prev.find((t) => t.id === newTag.id)) return prev;
        return [...prev, newTag];
      });
      return newTag;
    }
    return null;
  };

  return { tags, loading, createTag, refetch: fetchTags };
}
