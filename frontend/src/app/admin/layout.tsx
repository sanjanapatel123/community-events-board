import { Suspense, type ReactNode } from "react";
import { requireAdmin } from "@/lib/server-auth";
import { AdminShell } from "@/components/admin/admin-shell";

async function ProtectedWorkspace({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p role="status" className="text-sm text-muted">
            Loading workspace…
          </p>
        </div>
      }
    >
      <ProtectedWorkspace>{children}</ProtectedWorkspace>
    </Suspense>
  );
}
