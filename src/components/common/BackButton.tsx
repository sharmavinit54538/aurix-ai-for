import React from "react";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Routes where the global BackButton should NOT be rendered.
 * Easy to extend with new paths or RegExp patterns.
 */
export const EXCLUDED_BACK_BUTTON_ROUTES: (string | RegExp)[] = [
  // Root / Home
  "/",
  // Dashboard Home / Overviews (user portal home screens)
  "/dashboard",
  "/dashboard/",
  "/dashboard/employee",
  "/dashboard/manager",
  "/dashboard/executive/ceo",
  "/dashboard/executive/cio",
  "/dashboard/executive/cto",
  "/dashboard/recruitment/templates",
  "/dashboard/recruitment/templates/",
  // Auth Pages
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-reset-otp",
  // Onboarding
  "/onboarding",
  "/employee-onboarding",
  // Top-level Public Marketing Pages
  "/about",
  "/pricing",
  "/features",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/blog/",
];

export function isRouteExcluded(
  pathname: string,
  _search?: Record<string, unknown> | string,
  excludedList: (string | RegExp)[] = EXCLUDED_BACK_BUTTON_ROUTES
): boolean {
  if (!pathname) return true;
  // Normalize trailing slash (unless it's just "/")
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  return excludedList.some((item) => {
    if (typeof item === "string") {
      const normalizedItem = item.length > 1 ? item.replace(/\/+$/, "") : item;
      return normalized === normalizedItem;
    }
    if (item instanceof RegExp) {
      return item.test(pathname) || item.test(normalized);
    }
    return false;
  });
}

function getSensibleFallback(pathname: string): string {
  if (!pathname) return "/";
  if (pathname.startsWith("/dashboard/settings")) {
    return "/dashboard";
  }
  if (pathname.startsWith("/dashboard")) {
    return "/dashboard";
  }
  if (pathname.startsWith("/blog/")) {
    return "/blog";
  }
  return "/";
}

export interface BackButtonProps {
  /** Optional custom label (defaults to "Back") */
  label?: string;
  /** Whether to render the label text alongside the icon (defaults to true) */
  showLabel?: boolean;
  /** Custom route to navigate to if no in-app history exists */
  fallbackTo?: string;
  /** Additional CSS classes for styling or container margins */
  className?: string;
  /** Custom click handler (overrides default back navigation) */
  onClick?: () => void;
  /** Custom excluded routes override */
  excludedRoutes?: (string | RegExp)[];
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  showLabel = true,
  fallbackTo,
  className,
  onClick,
  excludedRoutes = EXCLUDED_BACK_BUTTON_ROUTES,
}) => {
  const router = useRouter();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname ?? "";
  const search = (location?.search ?? {}) as any;

  // Normalize pathname: remove trailing slashes (unless it's just "/")
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  // Don't render if current path is on the excluded routes list
  if (isRouteExcluded(pathname, search, excludedRoutes)) {
    return null;
  }

  const hasSectionParam = Boolean(
    search && typeof search === "object"
      ? (search as any).section
      : typeof search === "string"
      ? search.includes("section=")
      : false
  );

  const isSettingsSubroute =
    normalizedPath.startsWith("/dashboard/settings/") && normalizedPath !== "/dashboard/settings/";

  const isSettingsSection = isSettingsSubroute || (normalizedPath === "/dashboard/settings" && hasSectionParam);

  const effectiveLabel =
    label === "Back" && isSettingsSection ? "Back to Settings" : label;

  const canGoBackInApp = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      if (typeof router?.history?.canGoBack === "function") {
        return router.history.canGoBack();
      }
      // TanStack Router tracks in-app history depth in location.state.__TSR_index
      const tsrIndex =
        (router?.history?.location?.state as any)?.__TSR_index ??
        (window.history?.state as any)?.__TSR_index;
      if (typeof tsrIndex === "number") {
        return tsrIndex > 0;
      }
      return (window.history?.length ?? 0) > 1;
    } catch {
      return false;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (onClick) {
      onClick();
      return;
    }

    try {
      // Special handling for Settings sections and sub-routes:
      // If we are in a Settings section (?section=...) or sub-route (/dashboard/settings/*),
      // clicking Back must always return to the Settings overview hub (/dashboard/settings),
      // never popping history to unrelated modules like Workforce or Dashboard overview.
      if (isSettingsSection) {
        navigate({ to: "/dashboard/settings" as any, search: {} as any });
        return;
      }

      // Navigating back from the Settings main overview hub returns directly to the Dashboard home
      if (normalizedPath === "/dashboard/settings") {
        navigate({ to: "/dashboard" as any });
        return;
      }

      if (canGoBackInApp()) {
        router.history.back();
      } else {
        const targetFallback = fallbackTo || getSensibleFallback(pathname);
        navigate({ to: targetFallback as any });
      }
    } catch (error) {
      console.error("BackButton navigation error:", error);
      try {
        const targetFallback = fallbackTo || getSensibleFallback(pathname);
        navigate({ to: targetFallback as any });
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = fallbackTo || getSensibleFallback(pathname);
        }
      }
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="group -ml-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground cursor-pointer"
        aria-label={effectiveLabel}
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        {showLabel && <span>{effectiveLabel}</span>}
      </Button>
    </div>
  );
};

export default BackButton;
