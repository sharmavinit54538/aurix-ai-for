import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ExternalLink, Eye, Globe, Palette, Share2, Save } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/lib/recruitment/store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/recruitment/career-site")({
  head: () => ({ meta: [{ title: "Career Site — Recruitment" }] }),
  component: CareerSite,
});

function CareerSite() {
  const allJobs = useRecruitment((s) => s.jobs);
  const jobs = useMemo(() => allJobs.filter((j: any) => j.status === "active"), [allJobs]);
  
  const [brand, setBrand] = useState("Aurix");
  const [tagline, setTagline] = useState("Build the future of work with us.");
  const [accent, setAccent] = useState("#7c5cff");
  const [showSalary, setShowSalary] = useState(true);
  const [allowReferrals, setAllowReferrals] = useState(true);
  const [eeoStatement, setEeoStatement] = useState(
    "We're an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees."
  );

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedBrand = window.localStorage.getItem("aurix.careers.brand");
        if (savedBrand) setBrand(savedBrand);

        const savedTagline = window.localStorage.getItem("aurix.careers.tagline");
        if (savedTagline) setTagline(savedTagline);

        const savedAccent = window.localStorage.getItem("aurix.careers.accent");
        if (savedAccent) setAccent(savedAccent);

        const savedShowSalary = window.localStorage.getItem("aurix.careers.showSalary");
        if (savedShowSalary !== null) setShowSalary(savedShowSalary === "true");

        const savedAllowReferrals = window.localStorage.getItem("aurix.careers.allowReferrals");
        if (savedAllowReferrals !== null) setAllowReferrals(savedAllowReferrals === "true");

        const savedEeo = window.localStorage.getItem("aurix.careers.eeoStatement");
        if (savedEeo) setEeoStatement(savedEeo);
      }
    } catch (e) {
      console.warn("localStorage is not accessible:", e);
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aurix.careers.brand", brand);
      window.localStorage.setItem("aurix.careers.tagline", tagline);
      window.localStorage.setItem("aurix.careers.accent", accent);
      window.localStorage.setItem("aurix.careers.showSalary", String(showSalary));
      window.localStorage.setItem("aurix.careers.allowReferrals", String(allowReferrals));
      window.localStorage.setItem("aurix.careers.eeoStatement", eeoStatement);
      toast.success("Career site configuration saved successfully!");
    }
  };

  const handleCopyUrl = () => {
    if (typeof window !== "undefined") {
      const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const url = `${window.location.origin}/careers/${slug}`;
      navigator.clipboard.writeText(url);
      toast.success(`Copied career site URL: ${url}`);
    }
  };

  const handleOpenLive = () => {
    if (typeof window !== "undefined") {
      const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const url = `${window.location.origin}/careers/${slug}`;
      window.open(url, "_blank");
      toast.info("Opening live public job board (simulated)...");
    }
  };

  return (
    <>
      <PageHeader
        title="Career Site"
        description="Your public-facing job board. Branding, settings, and live preview."
        actions={
          <>
            <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Settings</Button>
            <Button variant="outline" onClick={handleCopyUrl}><Share2 className="mr-2 h-4 w-4" />Copy URL</Button>
            <Button onClick={handleOpenLive}><ExternalLink className="mr-2 h-4 w-4" />Open Live</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground"><Palette className="h-4 w-4 text-primary" />Branding</div>
            <div className="space-y-3">
              <Field label="Company name"><Input value={brand} onChange={(e) => setBrand(e.target.value)} /></Field>
              <Field label="Tagline"><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></Field>
              <Field label="Accent color">
                <div className="flex items-center gap-2">
                  <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-12 rounded-md border border-border bg-background cursor-pointer" />
                  <Input value={accent} onChange={(e) => setAccent(e.target.value)} className="font-mono text-xs" />
                </div>
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground"><Globe className="h-4 w-4 text-primary" />Visibility & Compliance</div>
            <div className="space-y-3">
              <Toggle label="Show salary ranges" checked={showSalary} onCheckedChange={setShowSalary} />
              <Toggle label="Allow employee referrals from public page" checked={allowReferrals} onCheckedChange={setAllowReferrals} />
              <Field label="EEO statement"><Textarea rows={4} value={eeoStatement} onChange={(e) => setEeoStatement(e.target.value)} /></Field>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">GDPR consent</Badge>
                <Badge variant="secondary">CCPA notice</Badge>
                <Badge variant="secondary">WCAG AA</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Eye className="h-3.5 w-3.5" />Live preview</div>
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="p-8" style={{ background: `linear-gradient(135deg, ${accent}22, transparent 60%)` }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>Careers at {brand}</div>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">{tagline}</h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Join {jobs.length} open roles across engineering, design, sales and operations. Remote-friendly with offices in SF, London and Berlin.
              </p>
            </div>
            <div className="divide-y divide-border">
              {jobs.slice(0, 6).map((j) => (
                <div key={j.id} className="flex items-center justify-between gap-3 p-4 hover:bg-accent/20">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-foreground text-sm">{j.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{j.department} · {j.location} · {j.workMode}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {showSalary && (
                      <span className="hidden text-xs text-muted-foreground sm:inline font-medium">
                        INR {(j.salaryMin / 1000).toFixed(0)}k–{(j.salaryMax / 1000).toFixed(0)}k
                      </span>
                    )}
                    <Button size="sm" style={{ background: accent, color: "white" }}>Apply</Button>
                  </div>
                </div>
              ))}
              {!jobs.length && <div className="p-6 text-center text-sm text-muted-foreground">No active roles right now.</div>}
            </div>
            <div className="border-t border-border p-4 text-[11px] text-muted-foreground leading-relaxed">{eeoStatement}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-2 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
