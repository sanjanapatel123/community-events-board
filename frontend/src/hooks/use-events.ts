"use client";

import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/event.service";
import type { EventFilters } from "@/types/event";

export function useEvents(filters: EventFilters) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: ({ signal }) => eventService.list(filters, signal),
  });
}
