"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ApiError } from "@/lib/api-client";

export const authKey = ["auth", "me"] as const;

export function useAuth() {
  return useQuery({
    queryKey: authKey,
    queryFn: async ({ signal }) => {
      try {
        const result = await authService.me(signal);
        return result.user;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async ({ user }) => {
      await queryClient.cancelQueries();

      queryClient.clear();
      queryClient.setQueryData(authKey, user);

      router.replace(user.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: authService.signup,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      queryClient.setQueryData(authKey, null);

      router.replace("/");
      router.refresh();
    },
  });
}
