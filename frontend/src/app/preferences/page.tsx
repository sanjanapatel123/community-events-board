import type { Metadata } from "next";
import { requireUser } from "@/lib/server-auth";
import { Navbar } from "@/components/layout/navbar";
import { PreferencesScreen } from "@/components/preferences/preferences-screen";

export const metadata: Metadata = {
  title: "Your interests",
};

export default async function PreferencesPage() {
  await requireUser();

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink">
          Make it personal
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          What brings you out?
        </h1>

        <p className="mb-8 mt-3 text-sm leading-6 text-muted">
          Pick your interests. We’ll find the events.
        </p>

        <PreferencesScreen />
      </main>
    </>
  );
}
