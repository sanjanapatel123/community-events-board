"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preferenceService } from "@/services/preference.service";

export function usePreferences(userId?: string) {
  return useQuery({
    queryKey: ["favourites", userId],
    queryFn: ({ signal }) => preferenceService.get(signal),
    enabled: Boolean(userId),
  });
}

export function useSavePreferences(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preferenceService.save,
    onSuccess: async (data) => {
      queryClient.setQueryData(["favourites", userId], {
        categories: data.categories,
      });

      await queryClient.invalidateQueries({
        queryKey: ["feed", userId],
      });
    },
  });
}

export function useFeed(userId: string, page: number) {
  return useQuery({
    queryKey: ["feed", userId, page],
    queryFn: ({ signal }) => preferenceService.feed(page, signal),
  });
}
