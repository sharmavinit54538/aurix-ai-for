import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, Phone, Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/recruitment/vendors")({
  head: () => ({ meta: [{ title: "Vendors & Agencies — Recruitment" }] }),
  component: Vendors,
});

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  specialty: string[];
  feeModel: string;
  rating: number;
  activeReqs: number;
  hires: number;
  spend: number;
  status: "active" | "paused" | "terminated";
}

const vendors: Vendor[] = [
  { id: "v1", name: "Northwind Talent Partners", contact: "Olivia Reed", email: "olivia@northwindtp.com", phone: "+1 (415) 555-2918",
    specialty: ["Engineering", "AI/ML"], feeModel: "22% of base", rating: 4.7, activeReqs: 6, hires: 14, spend: 187000, status: "active" },
  { id: "v2", name: "BlueOrbit Recruiting", contact: "Felix Chen", email: "felix@blueorbit.io", phone: "+44 20 7946 0091",
    specialty: ["Sales", "GTM"], feeModel: "20% of OTE", rating: 4.4, activeReqs: 3, hires: 9, spend: 96000, status: "active" },
  { id: "v3", name: "PrismHire EU", contact: "Lina Kovač", email: "lina@prismhire.eu", phone: "+49 30 5557 2210",
    specialty: ["Design", "Product"], feeModel: "Retainer + 18%", rating: 4.2, activeReqs: 2, hires: 5, spend: 62500, status: "active" },
  { id: "v4", name: "Apex Executive Search", contact: "Marcus Liu", email: "m.liu@apexexec.com", phone: "+1 (212) 555-7800",
    specialty: ["Leadership", "VP+"], feeModel: "33% retained", rating: 4.9, activeReqs: 1, hires: 3, spend: 145000, status: "active" },
  { id: "v5", name: "TalentBridge APAC", contact: "Sana Reddy", email: "sana@talentbridge.asia", phone: "+65 6555 4400",
    specialty: ["Engineering", "Data"], feeModel: "18% of base", rating: 3.8, activeReqs: 0, hires: 2, spend: 24000, status: "paused" },
];

const STATUS_TONE: Record<Vendor["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  paused: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  terminated: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

function Vendors() {
  const totalSpend = vendors.reduce((a, v) => a + v.spend, 0);
  const totalHires = vendors.reduce((a, v) => a + v.hires, 0);

  return (
    <>
      <PageHeader
        title="Vendors & Agencies"
        description="External recruiting partners, performance & spend."
        actions={<Button><Plus className="mr-2 h-4 w-4" />Add Vendor</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Active Vendors" value={vendors.filter((v) => v.status === "active").length} />
        <Kpi label="Open Reqs (vendor)" value={vendors.reduce((a, v) => a + v.activeReqs, 0)} />
        <Kpi label="Vendor Hires (YTD)" value={totalHires} />
        <Kpi label="Spend (YTD)" value={`$${(totalSpend / 1000).toFixed(0)}k`} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {vendors.map((v) => (
          <div key={v.id} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/40"><Building2 className="h-4 w-4" /></div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{v.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{v.contact}</div>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] capitalize ring-1 ${STATUS_TONE[v.status]}`}>{v.status}</span>
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{v.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{v.phone}</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {v.specialty.map((s) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <div><div className="font-semibold">{v.activeReqs}</div><div className="text-muted-foreground">Open</div></div>
              <div><div className="font-semibold">{v.hires}</div><div className="text-muted-foreground">Hires</div></div>
              <div><div className="font-semibold">${(v.spend / 1000).toFixed(0)}k</div><div className="text-muted-foreground">Spend</div></div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold">{v.rating}</span>
                <span className="text-muted-foreground">· {v.feeModel}</span>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
