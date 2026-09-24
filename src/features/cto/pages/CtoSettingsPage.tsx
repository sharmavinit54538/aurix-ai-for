import React, { useState } from "react";
import { Settings, Building, GitBranch, Cloud, Bell, Shield, Sliders, CreditCard, Archive, FileText, SunMoon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function CtoSettingsPage() {
  const [githubOrg, setGithubOrg] = useState("");
  const [awsAccount, setAwsAccount] = useState("");
  const [qdrantHost, setQdrantHost] = useState("");
  const [orgName, setOrgName] = useState("");

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
                CTO Organization & Platform Settings
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Platform & Integration Settings
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Git VCS integrations, cloud providers credentials (AWS, Azure, GCP), automated backup schedules, security policies, and billing overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              className="bg-indigo-600/50 text-white/70 text-xs cursor-not-allowed opacity-70"
              title="Coming soon (Backend API pending)"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Configuration (Coming soon)
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="general" className="text-xs font-semibold">General</TabsTrigger>
          <TabsTrigger value="git" className="text-xs font-semibold">Git Integrations</TabsTrigger>
          <TabsTrigger value="cloud" className="text-xs font-semibold">Cloud Providers</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-semibold">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-semibold">Security Policies</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs font-semibold">Billing & Cloud Cost</TabsTrigger>
          <TabsTrigger value="backup" className="text-xs font-semibold">Automated Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">General Platform Configuration</h3>
              <Badge variant="outline" className="text-[10px] text-amber-500/90 border-amber-500/30">Backend API Pending</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Organization Name</label>
                <Input
                  disabled
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Your Company Name"
                  className="bg-slate-900/60 text-xs opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Primary Vector DB Endpoint</label>
                <Input
                  disabled
                  value={qdrantHost}
                  onChange={(e) => setQdrantHost(e.target.value)}
                  placeholder="e.g. qdrant.internal:6333"
                  className="bg-slate-900/60 font-mono text-xs text-indigo-400 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground/80">
              Platform configuration persistence is pending backend CTO settings endpoint implementation.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="git">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Version Control (GitHub / GitLab Integration)</h3>
              <Badge variant="outline" className="text-[10px] text-amber-500/90 border-amber-500/30">Backend API Pending</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">GitHub Enterprise Organization</label>
                <Input
                  disabled
                  value={githubOrg}
                  onChange={(e) => setGithubOrg(e.target.value)}
                  placeholder="e.g. github-organization-slug"
                  className="bg-slate-900/60 font-mono text-xs text-indigo-400 opacity-60 cursor-not-allowed"
                />
              </div>
              <Badge className="bg-muted text-muted-foreground border-border text-[10px]">
                Pending Backend Integration
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cloud">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">Cloud Account & Infrastructure Connection</h3>
              <Badge variant="outline" className="text-[10px] text-amber-500/90 border-amber-500/30">Backend API Pending</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">AWS Production Account ID</label>
                <Input
                  disabled
                  value={awsAccount}
                  onChange={(e) => setAwsAccount(e.target.value)}
                  placeholder="e.g. 123456789012"
                  className="bg-slate-900/60 font-mono text-xs text-sky-400 opacity-60 cursor-not-allowed"
                />
              </div>
              <Badge className="bg-muted text-muted-foreground border-border text-[10px]">
                Pending IAM OIDC Integration
              </Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            No notification channels configured. Add Slack, PagerDuty, or Webhook destinations.
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            Default security baseline active. Configure SSO, SAML, and IP whitelists.
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            No cloud billing account linked. Connect AWS Cost Explorer or GCP Billing API.
          </div>
        </TabsContent>

        <TabsContent value="backup">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-8 text-center text-xs text-muted-foreground">
            No automated backup schedules configured.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CtoSettingsPage;
