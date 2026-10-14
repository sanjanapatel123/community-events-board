"use client";

import Link from "next/link";
import { Bell, BellRing, LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useReminders, useReminderMutation } from "@/hooks/use-reminders";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SavedReminderButton({
  userId,
  eventId,
}: {
  userId: string;
  eventId: string;
}) {
  const reminders = useReminders(userId);
  const mutation = useReminderMutation(userId, eventId);

  if (reminders.isPending) {
    return (
      <Button variant="secondary" disabled className="w-full">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading reminder…
      </Button>
    );
  }

  if (reminders.isError) {
    return (
      <Button
        variant="secondary"
        loading={reminders.isFetching}
        onClick={() => void reminders.refetch()}
        className="w-full"
      >
        Retry reminder status
      </Button>
    );
  }

  const reminded = reminders.data.eventIds.includes(eventId);
  const Icon = reminded ? BellRing : Bell;

  return (
    <button
      type="button"
      aria-pressed={reminded}
      aria-busy={mutation.isSaving}
      disabled={mutation.isSaving}
      onClick={() => mutation.mutate(!reminded)}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2",
        "rounded-full border px-4 text-sm font-semibold",
        "transition-colors duration-200 disabled:cursor-wait",
        reminded
          ? "border-brand/30 bg-blush text-brand-ink"
          : "border-line bg-white text-foreground hover:border-brand",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />

      <span aria-live="polite">
        {reminded ? "Reminder saved" : "Remind me"}
      </span>

      {mutation.isSaving && (
        <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
      )}
    </button>
  );
}

export function ReminderButton({ eventId }: { eventId: string }) {
  const auth = useAuth();

  if (auth.isPending) {
    return (
      <Button variant="secondary" disabled className="w-full">
        Loading account…
      </Button>
    );
  }

  if (auth.isError) {
    return (
      <Button
        variant="secondary"
        loading={auth.isFetching}
        onClick={() => void auth.refetch()}
        className="w-full"
      >
        Retry account
      </Button>
    );
  }

  if (!auth.data) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-11 w-full items-center justify-center
          gap-2 rounded-full border border-line px-4 text-sm
          font-semibold transition-colors hover:bg-blush"
      >
        <Bell aria-hidden="true" className="size-4" />
        Sign in to remind me
      </Link>
    );
  }

  return (
    <SavedReminderButton
      key={auth.data.id}
      userId={auth.data.id}
      eventId={eventId}
    />
  );
}
