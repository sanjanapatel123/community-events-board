"use client";

import Link from "next/link";
import { Sparkles, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const auth = useAuth();
  const logout = useLogout();

  const user = auth.data;

  function handleLogout() {
    logout.mutate(undefined, {
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <header className="border-b border-line/70 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-wrap items-center
          justify-between gap-3 px-5 py-4 sm:px-8 sm:py-5"
      >
        <Link
          href="/"
          aria-label="Community home"
          className="inline-flex shrink-0 items-center gap-2"
        >
          <span
            className="flex size-9 items-center justify-center
              rounded-xl bg-blush text-brand-ink sm:size-10"
          >
            <Sparkles aria-hidden="true" className="size-5" />
          </span>

          <span
            className="font-heading text-lg font-extrabold
              tracking-tight text-foreground sm:text-xl"
          >
            community<span className="text-brand">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {auth.isPending ? (
            <span role="status" className="text-xs text-muted sm:text-sm">
              Loading account…
            </span>
          ) : auth.isError ? (
            <Button
              variant="secondary"
              loading={auth.isFetching}
              onClick={() => void auth.refetch()}
              className="px-3 sm:px-4"
            >
              {!auth.isFetching && (
                <RefreshCw aria-hidden="true" className="size-4" />
              )}
              Retry account
            </Button>
          ) : user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/feed"}
                className="inline-flex min-h-11 items-center rounded-full
    px-3 text-sm font-semibold text-brand-ink
    transition-colors hover:bg-blush"
              >
                {user.role === "ADMIN" ? "Manage events" : "My Feed"}
              </Link>

              <div className="hidden items-center gap-3 sm:flex">
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center
      rounded-full bg-blush text-sm font-bold text-brand-ink"
                >
                  {user.email.charAt(0).toUpperCase()}
                </span>

                <span
                  title={user.email}
                  className="max-w-44 truncate text-sm font-medium"
                >
                  {user.email}
                </span>
              </div>

              <Button
                variant="secondary"
                loading={logout.isPending}
                onClick={handleLogout}
                className="px-3 sm:px-4"
              >
                {!logout.isPending && (
                  <LogOut aria-hidden="true" className="size-4" />
                )}
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center
                  justify-center rounded-full px-3 text-sm
                  font-medium text-muted transition-colors
                  hover:bg-elevated hover:text-foreground"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="inline-flex min-h-11 items-center
                  justify-center rounded-full bg-brand px-4
                  text-sm font-semibold text-foreground shadow-sm
                  transition duration-200 hover:bg-brand-hover
                  motion-safe:active:scale-[0.98] sm:px-5"
              >
                Join in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
