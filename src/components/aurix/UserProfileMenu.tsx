import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LogOut, ChevronsUpDown } from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { logout } from "@/lib/auth-bootstrap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileMenuProps {
  collapsed?: boolean;
  variant?: "sidebar" | "topbar";
  className?: string;
}

export function UserProfileMenu({
  collapsed = false,
  variant = "sidebar",
  className = "",
}: UserProfileMenuProps) {
  const ws = useAurix();
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const pathname = router.location.pathname;

  if (!ws.user) {
    return null;
  }

  const role = ws.user.role;
  const isCeoMode =
    (role || "").toLowerCase() === "ceo" ||
    (ws.user?.email || "").toLowerCase() === "siddhubunny09@gmail.com" ||
    pathname.startsWith("/dashboard/executive/ceo");
  const isCioMode =
    (role || "").toLowerCase() === "cio" ||
    pathname.startsWith("/dashboard/executive/cio");
  const isCtoMode =
    (role || "").toLowerCase() === "cto" ||
    pathname.startsWith("/dashboard/executive/cto");

  const formattedRole = isCeoMode
    ? "Chief Executive Officer"
    : isCioMode
    ? "Chief Information Officer"
    : isCtoMode
    ? "Chief Technology Officer"
    : role === "hr"
    ? "HR Executive"
    : role === "interviewer"
    ? "Interviewer"
    : role === "candidate"
    ? "Candidate Portal"
    : role === "manager"
    ? "Hiring Manager"
    : role === "employee"
    ? "Employee"
    : ws.user.role || "Team Member";

  const initials =
    ws.user.fullName
      ?.split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    logout();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {variant === "topbar" ? (
          <button
            type="button"
            id="topbar-user-menu-trigger"
            className={`flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-border/60 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
            aria-label={`User menu for ${ws.user.fullName || "User"}`}
            title={`${ws.user.fullName || "User"} (${formattedRole})`}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm">
              {initials}
            </div>
          </button>
        ) : collapsed ? (
          <button
            type="button"
            id="sidebar-user-menu-trigger-collapsed"
            className={`flex w-full items-center justify-center rounded-lg p-1.5 hover:bg-accent/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
            aria-label={`User menu for ${ws.user.fullName || "User"}`}
            title={`${ws.user.fullName || "User"} (${formattedRole})`}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm">
              {initials}
            </div>
          </button>
        ) : (
          <button
            type="button"
            id="sidebar-user-menu-trigger"
            className={`group flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left hover:bg-accent/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
            aria-label={`User menu for ${ws.user.fullName || "User"}`}
            title={`${ws.user.fullName || "User"} (${formattedRole})`}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-foreground">
                {ws.user.fullName || "User"}
              </div>
              <div className="truncate text-[11px] capitalize text-muted-foreground">
                {formattedRole}
              </div>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        id="user-profile-dropdown-content"
        side={variant === "topbar" ? "bottom" : collapsed ? "right" : "top"}
        align={variant === "topbar" ? "end" : "start"}
        sideOffset={8}
        className="w-64 p-2 rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-xl z-50 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Information Header */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div
                id="user-profile-name"
                className="truncate text-sm font-semibold text-foreground"
                title={ws.user.fullName}
              >
                {ws.user.fullName || "User"}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  id="user-profile-role"
                  className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/20 capitalize"
                >
                  {formattedRole}
                </span>
              </div>
              {ws.user.email ? (
                <div
                  id="user-profile-email"
                  className="truncate text-[11px] text-muted-foreground"
                  title={ws.user.email}
                >
                  {ws.user.email}
                </div>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5 bg-border" />

        {/* Dedicated Logout Action */}
        <DropdownMenuItem
          id="user-profile-logout-button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 focus:bg-rose-500/10 focus:text-rose-500 dark:focus:bg-rose-950/40 dark:focus:text-rose-300 cursor-pointer transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
