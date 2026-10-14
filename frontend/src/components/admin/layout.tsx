import { Suspense, type ReactNode } from "react";
import { requireAdmin } from "@/lib/server-auth";
import { AdminShell } from "@/components/admin/admin-shell";

async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="flex min-h-screen items-center justify-center
            bg-white text-sm text-muted"
        >
          Loading your workspace…
        </div>
      }
    >
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </Suspense>
  );
}
