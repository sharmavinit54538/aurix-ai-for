import { Loader2 } from "lucide-react";

export function AuthLoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-elegant backdrop-blur-xl">
        <span className="grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold tracking-tight">
            Verifying session...
          </div>
          <p className="text-sm text-muted-foreground">Please wait while we restore your secure session.</p>
        </div>
      </div>
    </div>
  );
}
