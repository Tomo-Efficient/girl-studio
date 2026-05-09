import { useState, useEffect, useCallback } from "react";
import type { SearchParams } from "@/types";

interface UseItemsOptions extends SearchParams {
  autoLoad?: boolean;
}

export function useItems(options: UseItemsOptions = {}) {
  const [items, setItems] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const fetchItems = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (cursor) {
        setItems((prev) => [...prev, ...data.items]);
      } else {
        setItems(data.items);
      }
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [params.toString()]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const loadMore = () => {
    if (nextCursor) fetchItems(nextCursor);
  };

  return { items, loading, error, hasMore: !!nextCursor, loadMore, refetch: () => fetchItems() };
}
