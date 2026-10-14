"use client";

import { AccountBoundary } from "@/components/auth/account-boundary";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/use-preferences";
import { CategoryPicker } from "./category-picker";

function PreferencesContent({ userId }: { userId: string }) {
  const query = usePreferences(userId);

  if (query.isPending) {
    return (
      <p role="status" className="py-10 text-sm text-muted">
        Loading your interests…
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
    <CategoryPicker userId={userId} initialCategories={query.data.categories} />
  );
}

export function PreferencesScreen() {
  return (
    <AccountBoundary>
      {(user) => <PreferencesContent key={user.id} userId={user.id} />}
    </AccountBoundary>
  );
}
