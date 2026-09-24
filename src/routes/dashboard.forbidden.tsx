import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAurix } from "@/lib/aurix-store";
import { getRoleDefaultHome } from "@/lib/route-guards";

export const Route = (createFileRoute as any)("/dashboard/forbidden")({
  head: () => ({
    meta: [{ title: "403 Forbidden — Access Denied | OFC360" }],
  }),
  component: DashboardForbiddenPage,
});

function DashboardForbiddenPage() {
  const ws = useAurix();
  const role = ws.user?.role || "employee";
  const homePath = getRoleDefaultHome(role);

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-glow">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-card border border-border text-muted-foreground shadow-sm">
          <Lock className="h-3.5 w-3.5" />
        </div>
      </div>

      <span className="inline-block rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive border border-destructive/20 mb-3">
        403 — Access Restricted
      </span>

      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Module Access Denied
      </h1>

      <p className="mt-2.5 max-w-md text-sm text-muted-foreground leading-relaxed">
        Your current account role (<strong className="text-foreground capitalize">{role}</strong>) does not have authorization to view this enterprise module. Contact your organization administrator to request elevated permissions.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <button type="button" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </Button>

        <Button asChild size="sm" className="gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90">
          <Link to={homePath as any}>
            <Home className="h-4 w-4" /> Return to My Portal
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardForbiddenPage;
