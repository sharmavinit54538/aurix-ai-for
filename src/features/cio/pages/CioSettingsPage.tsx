import React, { useState } from "react";
import { Settings, Shield, Key, Cloud, Bell, Save, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CioSettingsPage() {
  const [apiKey, setApiKey] = useState("aurix_live_cio_key_948192049182");

  const handleSave = () => {
    toast.success("Saved Enterprise CIO IT Settings.");
  };

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
            <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white text-xs cursor-pointer">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="keys" className="text-xs font-semibold">API Keys & Tokens</TabsTrigger>
          <TabsTrigger value="providers" className="text-xs font-semibold">Cloud Providers</TabsTrigger>
          <TabsTrigger value="policies" className="text-xs font-semibold">Security Policies</TabsTrigger>
          <TabsTrigger value="backups" className="text-xs font-semibold">Backup Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl">
            <h3 className="font-bold text-sm text-foreground">Enterprise Master API Token</h3>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Master Telemetry Key</label>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-slate-900/60 font-mono text-xs text-cyan-400" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CioSettingsPage;
