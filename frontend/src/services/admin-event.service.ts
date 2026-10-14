import { apiClient } from "@/lib/api-client";
import type { Category, CommunityEvent } from "@/types/event";

export type CreateEventInput = {
  title: string;
  category: Category;
  city: string;
  startsAt: string;
  price: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

type AdminEventsResponse = {
  events: CommunityEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const adminEventService = {
  list: (page: number, signal?: AbortSignal) =>
    apiClient<AdminEventsResponse>(`/admin/events?page=${page}&limit=10`, {
      signal,
    }),

  create: (input: CreateEventInput) =>
    apiClient<{ message: string; event: CommunityEvent }>("/admin/events", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  setStatus: (input: { id: string; isActive: boolean }) =>
    apiClient<{ message: string; event: CommunityEvent }>(
      `/admin/events/${input.id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isActive: input.isActive }),
      },
    ),
};
