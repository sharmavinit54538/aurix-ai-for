import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const r = z.string().email().safeParse(email);
    if (!r.success) return setError("Enter a valid email");
    setError(null);
    setLoading(true);

    try {
      const res = (await api.post("auth/forgot-password", { email })) as any;
      if (res.success) {
        toast.success(res.message || "OTP sent successfully.");
        navigate({
          to: "/verify-reset-otp" as any,
          search: { email } as any,
          state: { email } as Record<string, string>,
        });
      } else {
        toast.error(res.message || "Failed to send OTP.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "User not found or connection error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email tied to your workspace and we'll send a verification OTP."
      footer={
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Work email</Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-invalid={!!error}
            disabled={loading}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send OTP
        </Button>
      </form>
    </AuthShell>
  );
}
