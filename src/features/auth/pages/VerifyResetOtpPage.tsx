import { useNavigate, useLocation, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/api";
import { toast } from "sonner";
import type { ApiResponse } from "@/api/types";

export function VerifyResetOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: searchEmail } = useSearch({ strict: false }) as { email?: string };

  const state = location.state as { email?: string } | undefined;
  const email = searchEmail || state?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiryTime, setExpiryTime] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      toast.error("Please enter your email first.");
      navigate({ to: "/forgot-password" });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (expiryTime <= 0) return;
    const t = setTimeout(() => setExpiryTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [expiryTime]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (code.length !== 6) return setError("Enter the 6-digit code");
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<ApiResponse<{ resetToken: string }>>("auth/verify-reset-otp", {
        email,
        otp: code,
      });

      if (res.success && res.data) {
        toast.success(res.message || "OTP verified successfully!");
        const { resetToken } = res.data as { resetToken: string };
        navigate({
          to: "/reset-password",
          search: { email, resetToken },
          state: { email, resetToken } as Record<string, string>,
        });
      } else {
        setError(res.message || "Verification failed");
        toast.error(res.message || "Verification failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Incorrect or expired code";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiResponse>("auth/forgot-password", { email });
      if (res.success) {
        setExpiryTime(300);
        setResendCooldown(30);
        setCode("");
        toast.success(res.message || "New OTP sent successfully!");
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend OTP";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Verify security code"
      subtitle="We sent a 6-digit verification code to your email."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email-display">Email Address</Label>
          <Input id="email-display" type="email" value={email} readOnly disabled />
        </div>

        <div className="space-y-2 flex flex-col items-center">
          <Label className="self-start">Verification Code</Label>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(val) => setCode(val)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error ? <p className="text-xs text-destructive self-start mt-1">{error}</p> : null}

          <div className="flex w-full justify-between items-center text-xs mt-3 text-muted-foreground">
            <span>
              Code expires in:{" "}
              <span className="font-mono font-medium text-foreground">{formatTime(expiryTime)}</span>
            </span>
            {resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verify code
        </Button>
      </form>
    </AuthShell>
  );
}
