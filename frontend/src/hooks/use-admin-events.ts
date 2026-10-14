"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminEventService } from "@/services/admin-event.service";

export function useAdminEvents(userId: string, page: number) {
  return useQuery({
    queryKey: ["admin-events", userId, page],
    queryFn: ({ signal }) => adminEventService.list(page, signal),
  });
}

function useRefreshEventQueries() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-events"] }),
      queryClient.invalidateQueries({ queryKey: ["events"] }),
      queryClient.invalidateQueries({ queryKey: ["feed"] }),
      queryClient.invalidateQueries({ queryKey: ["event"] }),
    ]);
}

export function useCreateEvent() {
  const refresh = useRefreshEventQueries();

  return useMutation({
    mutationFn: adminEventService.create,
    onSuccess: refresh,
  });
}

export function useSetEventStatus() {
  const refresh = useRefreshEventQueries();

  return useMutation({
    mutationFn: adminEventService.setStatus,
    onSuccess: refresh,
  });
}
