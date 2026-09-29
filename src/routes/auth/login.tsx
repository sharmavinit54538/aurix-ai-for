import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { isUserAuthenticated } from "@/lib/route-guards";
import { aurix } from "@/lib/aurix-store";
import { waitForAuth } from "@/lib/auth-bootstrap";
import { getSafeRedirectUrl } from "@/lib/role-routing";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: async ({ search }) => {
    if (typeof window !== "undefined") {
      await waitForAuth();
      if (isUserAuthenticated()) {
        const ws = aurix.get();
        const redirectParam = (search as any)?.redirect || (search as any)?.callbackUrl;
        const destination = getSafeRedirectUrl(redirectParam, ws.user);
        throw redirect({ to: destination as any });
      }
    }
  },
  head: () => ({ meta: [{ title: "Sign in — OFC360" }] }),
  component: LoginPage,
});
