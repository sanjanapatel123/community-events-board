import { apiClient } from "@/lib/api-client";

export type RemindersResponse = {
  eventIds: string[];
};

type ReminderResponse = {
  message: string;
  eventId: string;
  reminded: boolean;
};

export const reminderService = {
  list: (signal?: AbortSignal) =>
    apiClient<RemindersResponse>("/reminders", { signal }),

  save: (eventId: string) =>
    apiClient<ReminderResponse>(`/reminders/${eventId}`, {
      method: "PUT",
      body: JSON.stringify({}),
    }),

  remove: (eventId: string) =>
    apiClient<ReminderResponse>(`/reminders/${eventId}`, {
      method: "DELETE",
      body: JSON.stringify({}),
    }),
};
