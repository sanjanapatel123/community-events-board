import { apiClient } from "@/lib/api-client";
import type { Credentials, LoginResponse, User } from "@/types/auth";

export const authService = {
  signup: (input: Credentials) =>
    apiClient<{ message: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (input: Credentials) =>
    apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  me: (signal?: AbortSignal) =>
    apiClient<{ user: User }>("/auth/me", { signal }),

  logout: () =>
    apiClient<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }),
};
