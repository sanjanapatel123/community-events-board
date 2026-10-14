"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Compass,
  Heart,
  LogOut,
  Menu,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Discover events", icon: Compass },
  { href: "/feed", label: "My Feed", icon: Heart },
  { href: "/preferences", label: "My interests", icon: SlidersHorizontal },
];

export function UserShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const logout = useLogout();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const user = auth.data;
  const title =
    navigation.find((item) => item.href === pathname)?.label ?? "Event details";

  function closeMenu() {
    dialogRef.current?.close();
  }

  function signOut() {
    logout.mutate(undefined, {
      onSuccess: closeMenu,
      onError: (error) => toast.error(error.message),
    });
  }

  function sidebarContent(mobile = false) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between px-6 py-7">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5"
          >
            <span
              className="flex size-10 items-center justify-center
              rounded-2xl bg-[#f8edf4] text-[#88476f]"
            >
              <Sparkles aria-hidden="true" className="size-5" />
            </span>

            <span className="font-heading text-xl font-extrabold tracking-tight">
              community<span className="text-[#bb76a2]">.</span>
            </span>
          </Link>

          {mobile && (
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation"
              className="flex size-11 items-center justify-center rounded-xl
                hover:bg-[#f7f5f7]"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p
            className="mb-4 px-4 text-[10px] font-bold uppercase
            tracking-[0.22em] text-[#6e6573]"
          >
            Your community
          </p>

          <nav aria-label={mobile ? "Mobile navigation" : "Sidebar navigation"}>
            <div className="space-y-2">
              {navigation.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-2xl px-4",
                      "text-sm font-semibold transition-colors duration-200",
                      active
                        ? "bg-[#17151b] text-white shadow-sm"
                        : "text-[#6e6573] hover:bg-[#f8edf4] hover:text-[#88476f]",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4.5" />
                    {label}

                    {active && (
                      <span
                        aria-hidden="true"
                        className="ml-auto size-1.5 rounded-full bg-[#bb76a2]"
                      />
                    )}
                  </Link>
                );
              })}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center gap-3 rounded-2xl
                    px-4 text-sm font-semibold text-[#6e6573] hover:bg-[#f8edf4]"
                >
                  <CalendarDays aria-hidden="true" className="size-4.5" />
                  Manage events
                </Link>
              )}
            </div>
          </nav>

          <div
            className="relative mt-10 overflow-hidden rounded-3xl
            bg-[#f8edf4] p-5"
          >
            <Sparkles
              aria-hidden="true"
              className="mb-4 size-6 text-[#88476f]"
            />

            <p className="font-heading text-lg font-extrabold leading-tight">
              More your thing.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6e6573]">
              Pick your interests for a feed that feels like you.
            </p>

            <Link
              href="/preferences"
              onClick={closeMenu}
              className="mt-4 inline-flex min-h-11 items-center gap-2
                text-xs font-bold text-[#88476f]"
            >
              Choose interests
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-[#ece6ed] p-4">
          {auth.isPending ? (
            <p role="status" className="p-3 text-xs text-[#6e6573]">
              Loading account…
            </p>
          ) : auth.isError ? (
            <button
              type="button"
              disabled={auth.isFetching}
              onClick={() => void auth.refetch()}
              className="min-h-11 w-full rounded-xl text-sm text-[#88476f]"
            >
              Retry account
            </button>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center
                rounded-full bg-[#f8edf4] text-sm font-bold text-[#88476f]"
              >
                {user.email.charAt(0).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  title={user.email}
                  className="truncate text-xs font-semibold"
                >
                  {user.email}
                </p>
                <p className="mt-1 text-[11px] text-[#6e6573]">
                  {user.role === "ADMIN" ? "Administrator" : "Community member"}
                </p>
              </div>

              <button
                type="button"
                aria-label="Sign out"
                disabled={logout.isPending}
                onClick={signOut}
                className="flex size-11 shrink-0 items-center justify-center
                  rounded-xl text-[#6e6573] hover:bg-[#f7f5f7]
                  disabled:opacity-50"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex min-h-12 items-center justify-center rounded-full
                bg-[#bb76a2] text-sm font-semibold text-[#17151b]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfafc] text-[#17151b]">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-64
        border-r border-[#ece6ed] bg-white lg:block"
      >
        {sidebarContent()}
      </aside>

      <dialog
        ref={dialogRef}
        aria-label="User navigation"
        onClose={() => menuButtonRef.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="fixed inset-y-0 left-0 right-auto m-0
          h-dvh max-h-none w-[min(320px,88vw)] max-w-none
          border-0 bg-white p-0 text-[#17151b]
          backdrop:bg-black/35"
      >
        {sidebarContent(true)}
      </dialog>

      <div className="min-w-0 lg:pl-64">
        <header
          className="sticky top-0 z-30 border-b border-[#ece6ed]
          bg-white/95 backdrop-blur-md"
        >
          <div
            className="mx-auto flex min-h-19 max-w-7xl items-center
            justify-between gap-3 px-4 sm:px-8"
          >
            <div className="flex min-w-0 items-center gap-3">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label="Open navigation"
                aria-haspopup="dialog"
                onClick={() => dialogRef.current?.showModal()}
                className="flex size-11 shrink-0 items-center justify-center
                  rounded-xl border border-[#ece6ed] lg:hidden"
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{title}</p>
                <p className="mt-1 hidden text-xs text-[#6e6573] sm:block">
                  Good things happen nearby.
                </p>
              </div>
            </div>

            <Link
              href={user ? "/preferences" : "/login"}
              className="inline-flex min-h-11 shrink-0 items-center gap-2
                rounded-full border border-[#ece6ed] bg-white px-4
                text-xs font-semibold transition-colors hover:bg-[#f8edf4]"
            >
              <span className="size-2 rounded-full bg-[#bb76a2]" />
              {user ? "Your interests" : "Sign in"}
            </Link>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
