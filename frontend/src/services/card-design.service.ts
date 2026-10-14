import { apiClient } from "@/lib/api-client";
import type { CardDesign, CardDesignResponse } from "@/types/card-design";

export const cardDesignService = {
  get: (eventId: string, signal?: AbortSignal) =>
    apiClient<CardDesignResponse>(`/card-designs/${eventId}`, {
      signal,
    }),

  save: (eventId: string, design: CardDesign) =>
    apiClient<CardDesignResponse>(`/card-designs/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(design),
    }),
};
