"use client";

import { useQuery } from "@tanstack/react-query";
import { AccountBoundary } from "@/components/auth/account-boundary";
import { Button } from "@/components/ui/button";
import { cardDesignService } from "@/services/card-design.service";
import type { CommunityEvent } from "@/types/event";
import { CardDesignEditor } from "./card-design-editor";

function SavedDesigner({
  userId,
  event,
}: {
  userId: string;
  event: CommunityEvent;
}) {
  const query = useQuery({
    queryKey: ["card-design", userId, event.id],
    queryFn: ({ signal }) => cardDesignService.get(event.id, signal),
  });

  if (query.isPending) {
    return (
      <p role="status" className="py-8 text-sm text-muted">
        Loading your design…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div role="alert">
        <p className="mb-4 text-sm text-danger">{query.error.message}</p>
        <Button loading={query.isFetching} onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <CardDesignEditor
      userId={userId}
      event={event}
      initialDesign={query.data.design}
    />
  );
}

export function CardDesigner({ event }: { event: CommunityEvent }) {
  return (
    <section
      className="mt-12 rounded-3xl border border-line
      bg-white p-5 shadow-card sm:p-8"
    >
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        A little more <span className="text-[#88476f]">you.</span>
      </h2>

      <p className="mb-7 mt-2 text-sm text-muted">
        Design your event card with colours and stickers.
      </p>

      <AccountBoundary>
        {(user) => (
          <SavedDesigner
            key={`${user.id}-${event.id}`}
            userId={user.id}
            event={event}
          />
        )}
      </AccountBoundary>
    </section>
  );
}
