import { Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { SuperAdminSessionsManager } from "../components/SuperAdminSessionsManager";

export function SuperAdminSecurityPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Platform Security & Sessions"
        description="Monitor active platform refresh-token sessions and revoke compromised or stale sessions across OFC360."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Link to="/dashboard/settings/security">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                My MFA Settings
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Link to="/dashboard/super-admin/audit-logs">
                <KeyRound className="h-3.5 w-3.5" />
                Audit Trail
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      <SuperAdminSessionsManager />
    </div>
  );
}

export default SuperAdminSecurityPage;
