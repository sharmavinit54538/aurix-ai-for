import { useNavigate, useLocation, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/api";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: searchEmail, resetToken: searchResetToken, token: searchToken } = useSearch({ strict: false }) as {
    email?: string;
    resetToken?: string;
    token?: string;
  };

  const state = location.state as { email?: string; resetToken?: string } | undefined;
  const email = searchEmail || state?.email || "";
  const resetToken = searchResetToken || searchToken || state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!resetToken) {
      toast.error("Invalid reset session. Please request password reset again.");
      navigate({ to: "/forgot-password" });
    }
  }, [resetToken, navigate]);

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const err = validatePassword();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    setLoading(true);

    try {
      const res = (await api.post("auth/reset-password", {
        token: resetToken,
        password: password,
        confirm_password: confirmPassword,
      })) as any;

      if (res.success) {
        toast.success("Password updated successfully.");
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 2000);
      } else {
        toast.error(res.message || "Failed to reset password.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create new password"
      subtitle="Choose a secure password with letters, numbers, and symbols."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type={show ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {validationError ? (
          <p className="text-xs text-destructive">{validationError}</p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Reset Password
        </Button>
      </form>
    </AuthShell>
  );
}
