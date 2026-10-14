import { apiClient } from "@/lib/api-client";
import type {
  CommunityEvent,
  EventFilters,
  EventsResponse,
} from "@/types/event";

export const eventService = {
  list: (filters: EventFilters, signal?: AbortSignal) => {
    const params = new URLSearchParams({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    if (filters.category) {
      params.set("category", filters.category);
    }

    if (filters.city.trim()) {
      params.set("city", filters.city.trim());
    }

    if (filters.search.trim()) {
      params.set("search", filters.search.trim());
    }

    return apiClient<EventsResponse>(`/events?${params}`, {
      signal,
    });
  },

  get: (id: string, signal?: AbortSignal) =>
    apiClient<{ event: CommunityEvent }>(`/events/${encodeURIComponent(id)}`, {
      signal,
    }),
};
