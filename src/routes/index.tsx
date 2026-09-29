import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { aurix } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { getSafeRedirectUrl } from "@/lib/role-routing";
import { hasValidAccessToken } from "@/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — OFC360" },
      { name: "description", content: "OFC360 Enterprise Operations & Intelligence Platform" },
      { property: "og:title", content: "Dashboard — OFC360" },
      { property: "og:description", content: "OFC360 Enterprise Operations & Intelligence Platform" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const authReady = useAuthReady();

  useEffect(() => {
    if (!authReady) return;

    const workspace = aurix.get();

    if (!workspace.user && !hasValidAccessToken()) {
      navigate({ to: "/login", replace: true });
    } else {
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get("redirect") || params.get("callbackUrl");
      const destination = getSafeRedirectUrl(redirectParam, workspace.user);
      navigate({ to: destination as any, replace: true });
    }
  }, [authReady, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-elegant backdrop-blur-xl">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow"
          style={{ background: "var(--gradient-brand)" }}
        >
          <LayoutDashboard className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
            Opening OFC360 Workspace
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your workspace dashboard…</p>
        </div>
      </div>
    </div>
  );
}
