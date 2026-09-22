import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface AccessDeniedViewProps {
  title?: string;
  message?: string;
  currentRole?: string;
  requiredRoles?: string[];
  returnUrl?: string;
}

export function AccessDeniedView({
  title = "Access Restricted",
  message = "You do not have the required permissions to view or configure this settings section.",
  currentRole,
  requiredRoles,
  returnUrl = "/dashboard/settings",
}: AccessDeniedViewProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center backdrop-blur-xl">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
        {message}
      </p>

      {currentRole && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs">
          <span className="text-muted-foreground">Your Role:</span>
          <span className="font-semibold text-foreground">{currentRole}</span>
        </div>
      )}

      {requiredRoles && requiredRoles.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Permitted roles:{" "}
          <span className="font-medium text-foreground">{requiredRoles.join(", ")}</span>
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <Button variant="outline" size="sm" asChild className="gap-2 text-xs">
          <Link to={returnUrl}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Settings Overview
          </Link>
        </Button>
      </div>
    </div>
  );
}
