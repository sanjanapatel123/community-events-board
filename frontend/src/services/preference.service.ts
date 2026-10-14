import { apiClient } from "@/lib/api-client";
import type { Category, EventsResponse } from "@/types/event";

type FavouritesResponse = {
  categories: Category[];
};

export type FeedResponse = EventsResponse & {
  message: string;
  categories: Category[];
};

export const preferenceService = {
  get: (signal?: AbortSignal) =>
    apiClient<FavouritesResponse>("/favourites", { signal }),

  save: (categories: Category[]) =>
    apiClient<FavouritesResponse & { message: string }>("/favourites", {
      method: "PUT",
      body: JSON.stringify({ categories }),
    }),

  feed: (page: number, signal?: AbortSignal) =>
    apiClient<FeedResponse>(`/feed?page=${page}&limit=9`, { signal }),
};
