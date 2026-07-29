import React, { useState } from "react";
import { Settings, Building, CreditCard, Users, Shield, Bell, Sliders, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CeoSettingsPage() {
  const [compName, setCompName] = useState("OFC HR Enterprise Technologies Inc.");
  const [taxId, setTaxId] = useState("EIN-84-2940192");

  const handleSave = () => {
    toast.success("Saved CEO Corporate Settings.");
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
                CEO Corporate & Enterprise Settings
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Corporate Entity & Executive Governance Settings
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Company legal entity profile, billing & enterprise tier, executive permissions, custom branding, and audit security policies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-500 text-white text-xs cursor-pointer">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="profile" className="text-xs font-semibold">Company Profile</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs font-semibold">Billing & Tier</TabsTrigger>
          <TabsTrigger value="users" className="text-xs font-semibold">Executive Users</TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-semibold">Security & Audit</TabsTrigger>
          <TabsTrigger value="branding" className="text-xs font-semibold">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 max-w-2xl">
            <h3 className="font-bold text-sm text-foreground">Corporate Legal Entity Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Company Legal Name</label>
                <Input value={compName} onChange={(e) => setCompName(e.target.value)} className="bg-slate-900/60 text-xs" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Tax ID / Employer Identification Number (EIN)</label>
                <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} className="bg-slate-900/60 font-mono text-xs text-amber-400" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CeoSettingsPage;
