import { Activity } from "lucide-react";
import type { KpiItem } from "@/store/aiInsights/aiInsightsTypes";
import { EmptySection } from "../shared/EmptySection";
import { KpiCard } from "../shared/KpiCard";
import { SectionTitle } from "../shared/SectionTitle";

export function KpiOverviewSection({ kpis }: { kpis: KpiItem[] }) {
  return (
    <>
      <SectionTitle eyebrow="Overview" title="AI Workforce KPIs" icon={Activity} />
      {kpis.length === 0 ? (
        <EmptySection message="No KPI metrics currently available." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi, index) => (
            <KpiCard key={kpi.label} kpi={kpi} delay={index * 0.04} />
          ))}
        </div>
      )}
    </>
  );
}
