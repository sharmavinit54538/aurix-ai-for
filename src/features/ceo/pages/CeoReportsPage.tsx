import React from "react";
import { LineChart as LineChartIcon, FileText, FileSpreadsheet, Download, Filter, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function CeoReportsPage() {
  const reports = [
    { title: "Executive Board Financial Audit Report Q2 2026", cat: "Financial", date: "Jul 28, 2026", size: "4.2 MB" },
    { title: "Annual Headcount & Retention Analysis Report", cat: "HR & People", date: "Jul 24, 2026", size: "2.8 MB" },
    { title: "Enterprise Sales Pipeline & ARR Projections", cat: "Sales", date: "Jul 20, 2026", size: "3.5 MB" },
    { title: "Global Infrastructure & SOC2 Security Compliance", cat: "Operations", date: "Jul 15, 2026", size: "5.1 MB" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <LineChartIcon className="h-4 w-4" />
              </span>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase">
                Executive Reports & Exports
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Board Reports & Financial Statements
            </h1>
            <p className="text-xs text-purple-200/70 max-w-2xl">
              Downloadable executive board decks, financial statements, HR workforce audits, sales pipelines, and SOC2 compliance reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("Exported Executive PDF Package")} className="bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Export PDF Deck
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success("Exported Master Excel Ledger")} className="border-border text-foreground text-xs cursor-pointer">
              <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
            <tr>
              <th className="p-3">Report Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date Generated</th>
              <th className="p-3">File Size</th>
              <th className="p-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {reports.map((r, idx) => (
              <tr key={idx} className="hover:bg-accent/20 transition-colors">
                <td className="p-3 font-bold text-foreground">{r.title}</td>
                <td className="p-3 text-purple-400 font-mono">{r.cat}</td>
                <td className="p-3 text-muted-foreground">{r.date}</td>
                <td className="p-3 font-mono text-muted-foreground">{r.size}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloaded ${r.title}`)} className="h-7 text-xs text-purple-400 hover:bg-purple-500/20 cursor-pointer">
                    <Download className="mr-1 h-3.5 w-3.5" /> PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CeoReportsPage;
