import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  HardDrive,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Search,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { superAdminApi } from "../superAdminApi";
import type { PlatformOrganization } from "../types";

export function SuperAdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<PlatformOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void superAdminApi.getOrganizations().then((data) => {
      setOrgs(data);
      setLoading(false);
    });
  }, []);

  const filteredOrgs = orgs.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.domain.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations by name or domain..."
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Organization Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-blue-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-wider text-blue-400 border-blue-500/30"
                >
                  {org.plan}
                </Badge>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-base text-foreground">{org.name}</h3>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{org.domain}</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-y border-border/40 py-3">
                <div>
                  <div className="text-muted-foreground text-[11px]">Total Members</div>
                  <div className="font-bold text-foreground mt-0.5">{org.totalUsers} users</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[11px]">Active Accounts</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{org.activeUsers} active</div>
                </div>
                <div className="mt-2">
                  <div className="text-muted-foreground text-[11px]">Cloud Storage</div>
                  <div className="font-medium text-foreground mt-0.5">{org.storageUsed}</div>
                </div>
                <div className="mt-2">
                  <div className="text-muted-foreground text-[11px]">Tenant Status</div>
                  <div className="font-medium text-emerald-400 mt-0.5 capitalize flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {org.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Joined: {new Date(org.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
              <span className="text-[11px] text-blue-400 font-medium">Tenant ID: {org.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
