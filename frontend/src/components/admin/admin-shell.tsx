"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Plus,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

const navigation = [
  { href: "/admin", label: "Events", icon: CalendarDays },
  { href: "/admin/new", label: "Create event", icon: Plus },
];

export function AdminShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useLogout();

  function signOut() {
    logout.mutate(undefined, {
      onError: (error) => toast.error(error.message),
    });
  }

  function navigationLinks() {
    return navigation.map(({ href, label, icon: Icon }) => {
      const active = pathname === href;

      return (
        <Link
          key={href}
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
          className={cn(
            "flex min-h-12 items-center gap-3 rounded-xl px-4",
            "text-sm font-semibold transition-colors",
            active
              ? "bg-blush text-brand-ink"
              : "text-muted hover:bg-elevated hover:text-foreground",
          )}
        >
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </Link>
      );
    });
  }

  return (
    <div className="min-h-screen bg-[#faf9fb] text-foreground">
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-64
        flex-col border-r border-line bg-white lg:flex"
      >
        <Link
          href="/"
          className="flex items-center gap-3 px-7 py-8
            font-heading text-xl font-extrabold"
        >
          <span
            className="flex size-10 items-center justify-center
            rounded-2xl bg-blush text-brand-ink"
          >
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          community<span className="-ml-3 text-brand">.</span>
        </Link>

        <div className="px-5 pt-7">
          <p
            className="mb-4 px-4 text-[10px] font-bold
            uppercase tracking-[0.2em] text-muted"
          >
            Workspace
          </p>

          <nav aria-label="Admin navigation" className="space-y-2">
            {navigationLinks()}
          </nav>
        </div>

        <div className="mt-auto space-y-5 p-5">
          <div className="rounded-2xl border border-line bg-elevated/50 p-4">
            <p className="text-sm font-bold">See the visitor view</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Check how your events appear on the board.
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex min-h-11 items-center gap-2
                text-xs font-semibold text-brand-ink"
            >
              Open events board
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <Button
            variant="ghost"
            loading={logout.isPending}
            onClick={signOut}
            className="w-full justify-start"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="border-b border-line bg-white">
          <div
            className="mx-auto flex min-h-20 max-w-7xl
            items-center justify-between gap-4 px-5 sm:px-8"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-navigation"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex size-11 items-center justify-center
                  rounded-xl border border-line lg:hidden"
              >
                {menuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>

              <div>
                <p className="text-sm font-semibold">Admin workspace</p>
                <p className="mt-1 hidden text-xs text-muted sm:block">
                  Community Events Board
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="max-w-48 truncate text-sm font-semibold">
                  {user.email}
                </p>
                <p className="mt-1 text-xs text-muted">Administrator</p>
              </div>

              <span
                aria-label={`Signed in as ${user.email}`}
                className="flex size-10 shrink-0 items-center justify-center
                  rounded-full bg-blush text-sm font-bold text-brand-ink"
              >
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <nav
            id="admin-mobile-navigation"
            aria-label="Mobile admin navigation"
            hidden={!menuOpen}
            className="space-y-2 border-t border-line p-4 lg:hidden"
          >
            {navigationLinks()}

            <Link
              href="/"
              className="flex min-h-12 items-center gap-3 rounded-xl
                px-4 text-sm font-semibold text-muted"
            >
              <ArrowUpRight aria-hidden="true" className="size-4" />
              Visitor view
            </Link>

            <Button
              variant="ghost"
              loading={logout.isPending}
              onClick={signOut}
              className="w-full justify-start"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Sign out
            </Button>
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
