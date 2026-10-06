import React from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CioSettingsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                <Settings className="h-4 w-4" />
              </span>
              <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase">
                Enterprise IT Infrastructure Settings
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Multi-Cloud Provider Credentials & Security Policies
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              AWS/Azure/GCP API Keys, IAM user roles & permissions, automated backup frequency settings, and security policy rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-muted text-muted-foreground text-xs opacity-70 cursor-not-allowed"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Multi-cloud configuration and credentials management backend services are not connected yet."
      />
    </div>
  );
}

export default CioSettingsPage;
