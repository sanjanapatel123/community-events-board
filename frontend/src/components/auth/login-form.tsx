"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import {
  authSchema,
  type AuthFormValues,
} from "@/lib/validations/auth";

export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      noValidate
      aria-label="Sign in"
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="space-y-5"
    >
      <Input
        id="login-email"
        label="Email address"
        type="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@example.com"
        disabled={login.isPending}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        disabled={login.isPending}
        error={errors.password?.message}
        {...register("password")}
      />

      {login.isError && (
        <p
          role="alert"
          className="rounded-xl border border-danger/15
            bg-danger/5 px-4 py-3 text-sm leading-6 text-danger"
        >
          {login.error.message}
        </p>
      )}

      <Button
        type="submit"
        loading={login.isPending}
        className="group min-h-12 w-full"
      >
        {login.isPending ? "Signing in…" : "Sign in"}

        {!login.isPending && (
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200
              motion-safe:group-hover:translate-x-1"
          />
        )}
      </Button>

      <p className="pt-2 text-center text-sm leading-6 text-muted">
        New around here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-ink underline-offset-4
            transition-colors hover:text-foreground hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}