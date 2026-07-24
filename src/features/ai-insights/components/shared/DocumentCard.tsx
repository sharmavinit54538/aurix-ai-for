import { memo } from "react";
import { FileText } from "lucide-react";
import type { DocumentItem } from "@/store/aiInsights/aiInsightsTypes";
import { getAIInsightsIcon } from "../../utils/iconMap";

export const DocumentCard = memo(function DocumentCard({ document }: { document: DocumentItem }) {
  const Icon = getAIInsightsIcon(document.type, FileText);

  return (
    <button className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-left backdrop-blur-xl transition-all hover:border-foreground/20 hover:shadow-glow">
      <div
        className="mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand-foreground"
        style={{ background: "var(--gradient-brand)" }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium">{document.label}</div>
      <div className="mt-1 text-xs text-muted-foreground">Auto-fill from employee data</div>
      <div className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">AI</div>
    </button>
  );
});
