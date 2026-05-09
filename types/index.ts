export type ItemType = "IMAGE" | "TEXT" | "LINK";

export interface ItemCreateInput {
  type: ItemType;
  title?: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  textContent?: string;
  textLength?: number;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImageUrl?: string;
  linkFavicon?: string;
  sourceName?: string;
  sourceUrl?: string;
  tagIds?: string[];
  collectionId?: string;
}

export interface ItemUpdateInput {
  title?: string;
  description?: string;
  sourceName?: string;
  sourceUrl?: string;
  tagIds?: string[];
  collectionId?: string;
  isFavorite?: boolean;
}

export interface SearchParams {
  q?: string;
  type?: ItemType;
  tag?: string;
  collectionId?: string;
  favorite?: string;
  sort?: "newest" | "oldest" | "updated";
  cursor?: string;
  limit?: string;
}
