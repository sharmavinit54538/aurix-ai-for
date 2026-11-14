import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { getDefaultDashboardPath } from "@/lib/role-routing";

export const Route = createFileRoute("/dashboard/forbidden")({
  head: () => ({ meta: [{ title: "Access Restricted — OFC360" }] }),
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const ws = useAurix();
  const role = ws.user?.role || "employee";
  const homePath = getDefaultDashboardPath(ws.user);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="max-w-md rounded-2xl border border-border bg-card/60 p-8 text-center shadow-lg backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-semibold">Access Restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current account role (<strong className="text-foreground capitalize">{role}</strong>) does not have authorization to view this enterprise module. Contact your organization administrator to request elevated permissions.
        </p>
        <div className="mt-6">
          <Link
            to={homePath as any}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
