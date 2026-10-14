"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/auth";

export function AccountBoundary({
  children,
}: {
  children: (user: User) => ReactNode;
}) {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted">
        Loading your account…
      </p>
    );
  }

  if (auth.isError) {
    return (
      <div role="alert" className="py-16 text-center">
        <p className="mb-4 text-sm text-danger">{auth.error.message}</p>

        <Button loading={auth.isFetching} onClick={() => void auth.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!auth.data) {
    return (
      <div
        className="rounded-3xl border border-line bg-blush/40
        px-6 py-14 text-center"
      >
        <h2 className="text-xl font-bold">Make it yours.</h2>

        <p className="mb-6 mt-2 text-sm text-muted">
          Sign in to save your interests and see your feed.
        </p>

        <Link
          href="/login"
          className="inline-flex min-h-11 items-center rounded-full
            bg-brand px-6 text-sm font-semibold text-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return children(auth.data);
}
