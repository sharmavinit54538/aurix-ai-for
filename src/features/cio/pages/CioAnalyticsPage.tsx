import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CioAnalyticsPage() {
  const reports: Array<{
    title: string;
    type: string;
    date: string;
    size: string;
  }> = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border">
            <tr>
              <th className="p-3">Report Document</th>
              <th className="p-3">Domain Type</th>
              <th className="p-3">Date Generated</th>
              <th className="p-3">Size</th>
              <th className="p-3 text-right">Download Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                  No generated IT analytics or compliance reports found.
                </td>
              </tr>
            ) : (
              reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-accent/20 transition-colors">
                  <td className="p-3 font-bold text-foreground">{r.title}</td>
                  <td className="p-3 text-primary font-mono">{r.type}</td>
                  <td className="p-3 text-muted-foreground">{r.date}</td>
                  <td className="p-3 font-mono text-muted-foreground">{r.size}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloaded ${r.title}`)} className="h-7 text-xs text-primary hover:bg-primary/10 cursor-pointer">
                      <Download className="mr-1 h-3.5 w-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CioAnalyticsPage;
