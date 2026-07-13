import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Sparkles, KeyRound, Copy } from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const ws = useAurix();
  const showOtpPreview = false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />

      <header className="px-6 py-6 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Aurix</span>
        </Link>
      </header>

      <main className="flex min-h-[calc(100vh-120px)] items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl border bg-card/70 p-8 shadow-elegant backdrop-blur-xl"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="mb-6">
              <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {children}
          </div>
          {footer ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
          ) : null}
        </motion.div>
      </main>

      {showOtpPreview ? (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed right-4 top-24 z-50 hidden w-72 rounded-2xl border bg-card/80 p-4 shadow-elegant backdrop-blur-xl lg:block"
          style={{ borderColor: "var(--glass-border)" }}
          aria-label="OTP debug preview"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" />
            Dev OTP Preview
          </div>
          <div className="mt-3 font-display text-3xl font-semibold tracking-[0.4em] text-foreground">
            {ws.pendingOtp}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Visible in development only. Use this code to verify your email.
          </p>
          <button
            type="button"
            onClick={() => {
              if (ws.pendingOtp) {
                navigator.clipboard?.writeText(ws.pendingOtp);
                toast.success("OTP copied");
              }
            }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy code
          </button>
        </motion.aside>
      ) : null}
    </div>
  );
}
