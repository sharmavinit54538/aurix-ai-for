import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/aurix/AuthShell";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { aurix, useAurix } from "@/lib/aurix-store";
import { api } from "@/api";
import { toast } from "sonner";
import { AuthLoadingScreen } from "@/components/aurix/AuthLoadingScreen";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — Aurix" }] }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ws.isRestoring) return;

    if (!ws.user) {
      navigate({ to: "/register" });
    } else if (ws.user.emailVerified) {
      navigate({ to: "/onboarding" });
    }
  }, [ws.user, ws.isRestoring, navigate]);

  if (ws.isRestoring) {
    return <AuthLoadingScreen />;
  }

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return setError("Enter the 6-digit code");
    setError(null);
    setLoading(true);

    try {
      const email = ws.user?.email || "";
      const res = await api.post("auth/verify-email", {
        email,
        otp: code,
      });

      if (res.success) {
        if (ws.user) {
          aurix.set({ user: { ...ws.user, emailVerified: true } });
        }
        setSuccess(true);
        toast.success(res.message || "Email verified successfully!");
        setTimeout(() => navigate({ to: "/onboarding" }), 1100);
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (err: any) {
      setError(err.message || "Incorrect or expired code");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    const email = ws.user?.email || "";
    const payload = { email };
    console.log("Resend OTP Payload:", payload);
    setResending(true);
    try {
      const res = await api.post("auth/resend-otp", payload);
      if (res.success) {
        setSecondsLeft(30);
        toast.success(res.message || "OTP sent successfully.");
      } else {
        toast.error(res.message || "Failed to resend code");
      }
    } catch (err: any) {
      toast.error(err.message || "Too many attempts, please try again later.");
    } finally {
      setResending(false);
    }
  }

  if (success) {
    return (
      <AuthShell title="Email verified" subtitle="Redirecting to onboarding…">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted-foreground">All set, {ws.user?.fullName?.split(" ")[0]}.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        ws.user ? `We sent a 6-digit code to ${ws.user.email}` : "We sent you a 6-digit code"
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error ? <p className="text-center text-xs text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verify email
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {secondsLeft > 0 ? `Code expires in ${secondsLeft}s` : "Code expired"}
          </span>
          <button
            type="button"
            onClick={resend}
            disabled={secondsLeft > 0 || resending}
            className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {resending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Resend code
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
