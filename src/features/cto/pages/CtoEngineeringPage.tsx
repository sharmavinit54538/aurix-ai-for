import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wrench, ListTodo, GitPullRequest, FileEdit, Hash, TrendingUp, ShieldAlert, Layers,
  CalendarCheck, Plus, Search, Filter, RefreshCw, CheckCircle2, Clock, PlayCircle,
  BarChart3, UserCheck, AlertCircle, FileText, Download, Users, CheckSquare, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

export function CtoEngineeringPage() {
  const [activeTab, setActiveTab] = useState("sprint");

  const velocityData: any[] = [];
  const prStatusData: any[] = [];
  const sprintTasks: any[] = [];
  const pullRequests: any[] = [];
  const codeReviews: any[] = [];
  const storyPointBreakdown: any[] = [];
  const techDebtItems: any[] = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Wrench className="h-4 w-4" />
              </span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase">
                Engineering Management Hub
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Software Engineering & Development Management
            </h1>
            <p className="text-xs text-indigo-200/70 max-w-2xl">
              Sprint boards, code reviews, PR analytics, story point velocity tracking, technical debt backlog, architecture, and release planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("Created new Sprint task")} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs cursor-pointer">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Task
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Exported Engineering report")} className="border-border text-foreground text-xs cursor-pointer">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Sprint Progress", val: "—", sub: "Backend API integration pending", color: "text-emerald-400", icon: ListTodo },
          { label: "Open Pull Requests", val: "0 PRs", sub: "Backend API integration pending", color: "text-indigo-400", icon: GitPullRequest },
          { label: "Sprint Velocity", val: "—", sub: "Backend API integration pending", color: "text-cyan-400", icon: TrendingUp },
          { label: "Tech Debt Score", val: "—", sub: "Backend API integration pending", color: "text-amber-400", icon: ShieldAlert },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold uppercase">
              <span>{kpi.label}</span>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-2xl font-bold font-display ${kpi.color}`}>{kpi.val}</div>
            <div className="text-[11px] text-muted-foreground">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Sprint Progress & Capacity */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Sprint Progress & Team Capacity</h3>
              <p className="text-xs text-muted-foreground">Planned vs Completed story points vs total capacity</p>
            </div>
          </div>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sprint" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Bar dataKey="planned" fill="#6366f1" radius={[4, 4, 0, 0]} name="Planned Points" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed Points" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No sprint capacity telemetry available. Backend API integration pending.</p>
            )}
          </div>
        </div>

        {/* Chart 2: Velocity Trend */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Velocity Trend & Acceleration</h3>
              <p className="text-xs text-muted-foreground">Story points delivery velocity trajectory</p>
            </div>
          </div>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sprint" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="completed" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVel)" name="Velocity (Pts)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No velocity history available. Backend API integration pending.</p>
            )}
          </div>
        </div>

        {/* Chart 3: PR Status Distribution */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">PR Status Breakdown</h3>
              <p className="text-xs text-muted-foreground">Pull requests review & approval pipeline status</p>
            </div>
          </div>
          <div className="h-56 w-full flex items-center justify-center pt-2">
            {prStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={prStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={4}>
                    {prStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No pull requests data available. Backend API integration pending.</p>
            )}
          </div>
        </div>

        {/* Chart 4: Team Capacity Utilization */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-foreground">Team Capacity Utilization</h3>
              <p className="text-xs text-muted-foreground">Sprint engineering hours allocated vs total capacity</p>
            </div>
          </div>
          <div className="h-56 w-full pt-2 flex items-center justify-center">
            {velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="sprint" stroke="#888888" fontSize={10} />
                  <YAxis stroke="#888888" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  <Bar dataKey="capacity" fill="#818cf8" radius={[4, 4, 0, 0]} name="Max Capacity" />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Utilized Capacity" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground">No capacity utilization data available. Backend API integration pending.</p>
            )}
          </div>
        </div>
      </div>

      {/* 8 Required Module Sub-Tabs */}
      <Tabs defaultValue="sprint" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="sprint" className="text-xs font-semibold">Sprint Board</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs font-semibold">Code Reviews</TabsTrigger>
          <TabsTrigger value="prs" className="text-xs font-semibold">Pull Requests</TabsTrigger>
          <TabsTrigger value="techdebt" className="text-xs font-semibold">Technical Debt</TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs font-semibold">Architecture</TabsTrigger>
          <TabsTrigger value="storypoints" className="text-xs font-semibold">Story Points</TabsTrigger>
          <TabsTrigger value="velocity" className="text-xs font-semibold">Velocity</TabsTrigger>
          <TabsTrigger value="releases" className="text-xs font-semibold">Release Planning</TabsTrigger>
        </TabsList>

        {/* 1. Sprint Board */}
        <TabsContent value="sprint" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Backlog", "In Progress", "Code Review", "Done"].map((colStatus) => (
              <div key={colStatus} className="rounded-xl border border-border/60 bg-card/40 p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">{colStatus}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {sprintTasks.filter((t) => t.status === colStatus).length}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {sprintTasks.filter((t) => t.status === colStatus).length > 0 ? (
                    sprintTasks
                      .filter((t) => t.status === colStatus)
                      .map((task) => (
                        <div key={task.id} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-2 hover:border-indigo-500/50 transition-colors">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-indigo-400 font-bold">{task.id}</span>
                            <Badge className="text-[9px] bg-indigo-500/10 text-indigo-300 border-indigo-500/20">{task.priority}</Badge>
                          </div>
                          <p className="text-xs font-semibold text-foreground leading-snug">{task.title}</p>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                            <span>{task.assignee}</span>
                            <span className="font-mono font-bold text-foreground">{task.points} pts</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">No tasks in this lane</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 2. Code Reviews */}
        <TabsContent value="reviews">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Review ID</th>
                  <th className="p-3">Review Title</th>
                  <th className="p-3">Reviewer</th>
                  <th className="p-3">Security Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {codeReviews.length > 0 ? (
                  codeReviews.map((cr) => (
                    <tr key={cr.id} className="hover:bg-accent/20 transition-colors">
                      <td className="p-3 font-mono text-indigo-400 font-bold">{cr.id}</td>
                      <td className="p-3 font-semibold text-foreground">{cr.title}</td>
                      <td className="p-3 text-muted-foreground">{cr.reviewer}</td>
                      <td className="p-3 font-mono text-emerald-400">{cr.score}</td>
                      <td className="p-3">
                        <Badge className="text-[10px] bg-indigo-500/20 text-indigo-400 border-indigo-500/30">{cr.status}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                      No code reviews pending or recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* 3. Pull Requests */}
        <TabsContent value="prs">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">PR ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Repository</th>
                  <th className="p-3">Review Status</th>
                  <th className="p-3">CI Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {pullRequests.length > 0 ? (
                  pullRequests.map((pr) => (
                    <tr key={pr.id} className="hover:bg-accent/20 transition-colors">
                      <td className="p-3 font-mono text-indigo-400 font-bold">{pr.id}</td>
                      <td className="p-3 font-semibold text-foreground">{pr.title}</td>
                      <td className="p-3 text-muted-foreground">{pr.author}</td>
                      <td className="p-3 font-mono text-muted-foreground">{pr.repo}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400">{pr.status} ({pr.reviews})</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{pr.ci}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                      No active pull requests in repository queues.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* 4. Technical Debt */}
        <TabsContent value="techdebt">
          <div className="space-y-3">
            {techDebtItems.length > 0 ? (
              techDebtItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/80 bg-card/60 p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-bold text-xs">{item.id}</span>
                      <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground">Effort Estimate: {item.effort}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">{item.score}</Badge>
                    <Button size="sm" variant="outline" className="text-xs cursor-pointer">Schedule Refactor</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                No technical debt items tracked.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 5. Architecture */}
        <TabsContent value="architecture">
          <div className="p-6 rounded-xl border border-border/80 bg-card/60 space-y-3 text-center">
            <Layers className="h-8 w-8 text-indigo-400 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Microservices & Event-Driven Architecture Blueprint</h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Decoupled backend services, distributed cache, vector search, web layer, and container orchestration cluster.
            </p>
          </div>
        </TabsContent>

        {/* 6. Story Points */}
        <TabsContent value="storypoints">
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Story Points Distribution</h3>
            {storyPointBreakdown.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {storyPointBreakdown.map((sb, idx) => (
                  <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                    <div className="text-xs text-muted-foreground font-semibold">{sb.category}</div>
                    <div className="text-xl font-bold font-display text-indigo-400">{sb.points} Pts</div>
                    <div className="text-[11px] text-emerald-400">{sb.pct} of total sprint</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                No story point breakdown available.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 7. Velocity */}
        <TabsContent value="velocity">
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Velocity Analytics & Trajectory</h3>
            <div className="h-60 w-full flex items-center justify-center">
              {velocityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="sprint" stroke="#888888" fontSize={10} />
                    <YAxis stroke="#888888" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                    <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Velocity Pts" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No historical velocity points available. Backend API integration pending.</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 8. Release Planning */}
        <TabsContent value="releases">
          <div className="p-6 rounded-xl border border-border/80 bg-card/60 space-y-3 text-center">
            <CalendarCheck className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Release Planning</h3>
            <p className="text-xs text-muted-foreground">No upcoming releases scheduled.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CtoEngineeringPage;
