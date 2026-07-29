import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import { api } from "@/api";
import { parseLoginResponse } from "@/features/auth/utils/parseLoginResponse";
import { persistAuthSession, getPostLoginRoute } from "@/lib/auth-bootstrap";
import { getErrorMessage } from "@/api/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  action?: "login" | "register";
}

export function GoogleAuthButton({ action = "login" }: GoogleAuthButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClick = () => {
    setErrorMsg(null);
    setDialogOpen(true);
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.post("auth/google", {
        email: googleEmail.trim(),
        action,
      });

      const login = parseLoginResponse(res);
      if (login) {
        const { accessToken, refreshToken, user } = login;

        // Double check user role on frontend as extra security
        const userRole = (user.role || "").toLowerCase();
        if (userRole !== "admin" && userRole !== "super_admin") {
          const restrictedMsg =
            "Access Restricted: Only Company Admins are allowed to login using Google. Employees and company members must sign in using their work email and password.";
          setErrorMsg(restrictedMsg);
          toast.error(restrictedMsg);
          return;
        }

        persistAuthSession(user, { accessToken, refreshToken });
        toast.success(`Welcome back, ${user.name}! (Company Admin)`);
        setDialogOpen(false);
        navigate({ to: getPostLoginRoute(user) });
        return;
      }
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        getErrorMessage(err, "Google sign-in failed.");

      if (
        msg.toLowerCase().includes("restricted") ||
        msg.toLowerCase().includes("admin") ||
        err?.status === 403
      ) {
        const adminOnlyMsg =
          "Access Restricted: Only Company Admins are allowed to login using Google. Employees and staff members must sign in using their work email and password.";
        setErrorMsg(adminOnlyMsg);
        toast.error(adminOnlyMsg);
      } else {
        setErrorMsg(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Or continue with
        </div>
      </div>

      {/* Styled Google Pill Button (Matching user screenshot) */}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/50"
      >
        <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>
        <span className="tracking-wide">Continue with Google</span>
      </button>

      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground text-center pt-0.5">
        <Lock className="h-3 w-3 text-amber-500 shrink-0" />
        <span>Restricted to <strong>Company Admin</strong> accounts only</span>
      </div>

      {/* Google SSO Dialog / Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-[#1a73e8]">
              <div className="h-8 w-8 rounded-full bg-[#1a73e8]/10 flex items-center justify-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <DialogTitle className="text-lg font-bold">Google SSO (Company Admin Only)</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Enter your Company Admin Google Account email address to sign in.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGoogleSubmit} className="space-y-4 pt-2">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Access Denied</span>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="googleEmail" className="text-xs">Google Work Email</Label>
              <Input
                id="googleEmail"
                type="email"
                placeholder="admin@company.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                Security Rule Notice:
              </div>
              <p className="opacity-90">
                Only registered <strong>Company Admins</strong> are authorized to log in using Google. Employees, staff, and non-admin members must sign in using password authentication.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={loading || !googleEmail.trim()}
                className="h-8 text-xs bg-[#1a73e8] hover:bg-[#1557b0] text-white gap-1.5"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Authenticate Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
