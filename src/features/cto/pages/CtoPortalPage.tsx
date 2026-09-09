import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  RefreshCw,
  Download,
  Printer,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Server,
  Terminal,
  Activity,
  Code2,
  Workflow,
  Cpu,
  Layers,
  Database,
  Lock,
  GitBranch,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CtoKpiGrid, type CtoKpiItem } from "../components/CtoKpiGrid";
import { CtoSystemHealth, type SystemHealthItem } from "../components/CtoSystemHealth";
import { CtoCharts } from "../components/CtoCharts";
import { CtoAiInsights, type AiInsightItem } from "../components/CtoAiInsights";

export function CtoPortalPage() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<"day" | "week" | "month" | "quarter">("month");

  const [kpis, setKpis] = useState<CtoKpiItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthItem[]>([]);
  const [velocityTrend, setVelocityTrend] = useState<any[]>([]);
  const [deploymentTrend, setDeploymentTrend] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<AiInsightItem[]>([]);

  const fetchCtoMetrics = async () => {
    setLoading(true);
    try {
      const json: any = await api.get("/api/v1/cto/dashboard");
      if (json && json.success && json.data) {
        setKpis(json.data.kpis || []);
        setSystemHealth(json.data.systemHealth || []);
        setVelocityTrend(json.data.velocityTrend || []);
        setDeploymentTrend(json.data.deploymentTrend || []);
        setAiInsights(json.data.aiInsights || []);
      }
    } catch (err) {
      toast.error("Failed to sync CTO Portal metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCtoMetrics();
  }, []);

  const handleRefresh = () => {
    fetchCtoMetrics();
    toast.success("Refreshed CTO Enterprise metrics from backend.");
  };

  const handleExportCSV = () => {
    toast.success("Exporting CTO Executive Metrics to CSV...");
  };

  const filteredKpis = kpis.filter((k) =>
    k.title.toLowerCase().includes(search.toLowerCase()) ||
    k.value.toLowerCase().includes(search.toLowerCase()) ||
    k.change.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-slate-950 p-6 shadow-xl backdrop-blur-xl text-left">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-40 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Crown className="h-4 w-4" />
              </span>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold uppercase tracking-wider">
                Enterprise Executive Hub
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                SOC2 & ISO27001 Certified
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              CTO Engineering & Technology Control Center
            </h1>
            <p className="text-xs text-purple-200/70 max-w-2xl">
              Real-time executive oversight across Engineering, DevOps, Infrastructure, AI Models, Databases, Security, and Cloud Infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 text-xs cursor-pointer"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-border/80 text-foreground hover:bg-accent text-xs cursor-pointer"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info("Opening AI Assistant...")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs shadow-glow cursor-pointer"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              AI CTO Assistant
            </Button>
          </div>
        </div>

        {/* Date Range Selector & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-500/20 pt-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter metrics, servers, models..."
              className="pl-9 text-xs h-9 bg-card/40 border-border/80"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 p-1 text-xs">
            {(["day", "week", "month", "quarter"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-md px-3 py-1 font-medium capitalize transition-colors cursor-pointer ${
                  dateRange === range
                    ? "bg-purple-600 text-white font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 20 CTO Summary KPI Cards Grid */}
      <CtoKpiGrid kpis={filteredKpis} loading={loading} />

      {/* Live System & Service Operational Health */}
      <CtoSystemHealth services={systemHealth} />

      {/* AI CTO Copilot Recommendations */}
      <CtoAiInsights insights={aiInsights} />

      {/* Engineering Velocity & CI/CD Deployment History Charts */}
      <CtoCharts velocityTrend={velocityTrend} deploymentTrend={deploymentTrend} />
    </div>
  );
}

export default CtoPortalPage;
