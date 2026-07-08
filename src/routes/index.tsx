import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Briefcase, Sparkles } from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { AuthLoadingScreen } from "@/components/aurix/AuthLoadingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recruitment Dashboard — Aurix" },
      { name: "description", content: "Recruitment Insight Engine dashboard for jobs, candidates, pipeline health, and hiring velocity." },
      { property: "og:title", content: "Recruitment Dashboard — Aurix" },
      { property: "og:description", content: "Recruitment Insight Engine dashboard for jobs, candidates, pipeline health, and hiring velocity." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const workspace = useAurix();

  useEffect(() => {
    if (workspace.isRestoring) return;

    if (!workspace.user) {
      navigate({ to: "/login", replace: true });
    } else {
      // Redirect based on user role
      if (!workspace.user.emailVerified) {
        navigate({ to: "/verify-email", replace: true });
      } else if (!workspace.user.onboardingComplete) {
        navigate({ to: "/onboarding", replace: true });
      } else if (workspace.user.role === "manager") {
        navigate({ to: "/dashboard/manager", replace: true });
      } else if (workspace.user.role === "employee") {
        navigate({ to: "/dashboard/employee", replace: true });
      } else {
        navigate({ to: "/dashboard/recruitment", replace: true });
      }
    }
  }, [navigate, workspace.user, workspace.isRestoring]);

  if (workspace.isRestoring) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-elegant backdrop-blur-xl">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Briefcase className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
            Opening Recruitment Insight Engine
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Loading hiring pipeline dashboard…</p>
        </div>
      </div>
    </div>
  );
}
