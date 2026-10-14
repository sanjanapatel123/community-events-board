"use client";

import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  reminderService,
  type RemindersResponse,
} from "@/services/reminder.service";

const reminderKey = (userId: string) => ["reminders", userId] as const;

export function useReminders(userId: string) {
  return useQuery({
    queryKey: reminderKey(userId),
    queryFn: ({ signal }) => reminderService.list(signal),
  });
}

export function useReminderMutation(userId: string, eventId: string) {
  const queryClient = useQueryClient();
  const queryKey = reminderKey(userId);
  const mutationKey = ["reminder-update", userId, eventId];

  const pendingCount = useIsMutating({
    mutationKey,
    exact: true,
  });

  const mutation = useMutation({
    mutationKey,

    // Run even when the browser reports offline, so failure rolls back.
    networkMode: "always",

    mutationFn: (reminded: boolean) =>
      reminded
        ? reminderService.save(eventId)
        : reminderService.remove(eventId),

    onMutate: async (reminded) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<RemindersResponse>(queryKey);
      const wasReminded = previous?.eventIds.includes(eventId) ?? false;

      queryClient.setQueryData<RemindersResponse>(queryKey, (current) => {
        const ids = current?.eventIds ?? [];

        return {
          eventIds: reminded
            ? [...new Set([...ids, eventId])]
            : ids.filter((id) => id !== eventId),
        };
      });

      return { wasReminded };
    },

    onError: (error, _reminded, context) => {
      if (context) {
        // Restore only this event; preserve other in-flight changes.
        queryClient.setQueryData<RemindersResponse>(queryKey, (current) => {
          if (!current) return current;

          const otherIds = current.eventIds.filter((id) => id !== eventId);

          return {
            eventIds: context.wasReminded ? [...otherIds, eventId] : otherIds,
          };
        });
      }

      toast.error(error.message);
    },

    onSettled: () => {
      // Refetch when the final reminder mutation finishes.
      if (
        queryClient.isMutating({
          mutationKey: ["reminder-update", userId],
        }) === 1
      ) {
        return queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  return {
    ...mutation,
    isSaving: mutation.isPending || pendingCount > 0,
  };
}
