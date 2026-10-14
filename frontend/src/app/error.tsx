"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5">
      <div role="alert" className="max-w-md text-center">
        <h2 className="text-2xl font-extrabold">Something didn’t load.</h2>

        <p className="mb-6 mt-3 text-sm leading-6 text-muted">
          We couldn’t load this page. Please try again.
        </p>

        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
