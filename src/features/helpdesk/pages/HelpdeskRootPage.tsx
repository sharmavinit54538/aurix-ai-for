import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useCurrentRole, isSuperAdmin, isManager } from "@/lib/roles";
import { useAurix } from "@/lib/aurix-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Inbox,
  MessageSquare,
  PhoneCall,
  Video,
  ArrowUpRight,
} from "lucide-react";
import { TicketTable } from "../components/TicketTable";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { TicketDetailModal } from "../components/TicketDetailModal";
import { KnowledgeBaseSection } from "../components/KnowledgeBaseSection";
import { HelpdeskMetricsGrid } from "../components/HelpdeskMetricsGrid";
import { AiSupportAssistantModal } from "../components/AiSupportAssistantModal";
import {
  HelpdeskAccessDeniedState,
  HelpdeskErrorState,
  HelpdeskLoadingState,
} from "../components/HelpdeskStates";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import type {
  HelpdeskTicket,
  HelpdeskMetrics,
  HelpdeskCategory,
  HelpdeskPriority,
} from "../types";

function SlackIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.2 79.7c0 7.5-6.1 13.6-13.6 13.6S0 87.2 0 79.7s6.1-13.6 13.6-13.6h13.6v13.6zm6.8 0c0-7.5 6.1-13.6 13.6-13.6s13.6 6.1 13.6 13.6v34.1c0 7.5-6.1 13.6-13.6 13.6s-13.6-6.1-13.6-13.6V79.7z" fill="#E01E5A"/>
      <path d="M47.6 27.2c-7.5 0-13.6-6.1-13.6-13.6S40.1 0 47.6 0s13.6 6.1 13.6 13.6v13.6H47.6zm0 6.8c7.5 0 13.6 6.1 13.6 13.6s-6.1 13.6-13.6 13.6H13.6C6.1 61.2 0 55.1 0 47.6s6.1-13.6 13.6-13.6h34z" fill="#36C5F0"/>
      <path d="M99.8 47.6c0-7.5 6.1-13.6 13.6-13.6s13.6 6.1 13.6 13.6-6.1 13.6-13.6 13.6H99.8V47.6zm-6.8 0c0 7.5-6.1 13.6-13.6 13.6s-13.6-6.1-13.6-13.6V13.6C65.8 6.1 71.9 0 79.4 0s13.6 6.1 13.6 13.6v34z" fill="#2EB67D"/>
      <path d="M79.4 99.8c7.5 0 13.6 6.1 13.6 13.6s-6.1 13.6-13.6 13.6v-13.6h13.6zm0-6.8c-7.5 0-13.6-6.1-13.6-13.6s6.1-13.6 13.6-13.6h34.1c7.5 0 13.6 6.1 13.6 13.6s-6.1 13.6-13.6 13.6H79.4z" fill="#ECB22E"/>
    </svg>
  );
}

export default function HelpdeskRootPage() {
  const navigate = useNavigate();
  const currentRole = useCurrentRole();
  const aurix = useAurix();
  const user = aurix.user;

  const searchLocation = useRouterState({
    select: (s) => s.location.search,
  }) as unknown as Record<string, string>;

  const currentDept =
    searchLocation?.dept ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("dept")
      : null);



  const isHr = currentRole === "hr_admin";
  const isIt = currentRole === "it_admin";
  const isExec = currentRole === "executive";
  const isMgr = isManager(currentRole);
  const isStaffAgent = isHr || isIt;

  // Real Data States
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [metrics, setMetrics] = useState<HelpdeskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Modals & Selected Ticket
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [prefilledDraft, setPrefilledDraft] = useState<{
    title: string;
    category: HelpdeskCategory;
    priority: HelpdeskPriority;
  } | null>(null);

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<string>(
    isStaffAgent || isExec ? "dashboard" : "my-tickets"
  );

  // Load real data depending on role
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isStaffAgent || isExec) {
        // Staff Agent & Executive view: fetch triage tickets and real SLA metrics in parallel
        const [ticketsRes, metricsRes] = await Promise.all([
          helpdeskApi.getAdminTickets({ limit: 100 }),
          helpdeskApi.getHelpdeskMetrics().catch(() => null),
        ]);
        setTickets(ticketsRes.tickets);
        setMetrics(metricsRes);
      } else {
        // Employee & Manager view: fetch real authenticated user's tickets
        const myTickets = await helpdeskApi.getMyTickets();
        setTickets(myTickets);
      }
    } catch (err) {
      const msg = getHelpdeskErrorMessage(err, "Unable to load tickets. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isStaffAgent, isExec]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synchronize activeTab with URL parameters (dept=hr, dept=it, tab=...)
  useEffect(() => {
    const dept = currentDept;
    const tab =
      searchLocation?.tab ||
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("tab")
        : null);

    if (dept === "hr" || dept === "hr_policy") {
      if (isStaffAgent) {
        setActiveTab("department-tickets");
      } else {
        setActiveTab("my-tickets");
      }
    } else if (dept === "it" || dept === "it_hardware" || dept === "it_software") {
      if (isStaffAgent) {
        setActiveTab("department-tickets");
      } else {
        setActiveTab("my-tickets");
      }
    } else if (tab) {
      setActiveTab(tab);
    }
  }, [currentDept, searchLocation?.tab, isStaffAgent]);

  const handleTicketSelected = (ticket: HelpdeskTicket) => {
    setSelectedTicketId(ticket.id);
  };

  const handleTicketCreated = (newTicket: HelpdeskTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
  };

  // Super Admin is STRICTLY forbidden from Helpdesk module
  if (isSuperAdmin(currentRole)) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <HelpdeskAccessDeniedState
          title="Super Admin Access Prohibited"
          description="Super Administrators do not have access to the Helpdesk module. Support operations are isolated to organization employees and designated company administrators."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
      {/* Support & Communication Channels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Chat Card */}
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/connect" })}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-card/95 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden min-h-[148px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/30 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60 transition-colors group-hover:border-blue-500/30 group-hover:text-foreground">
                    Connect
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-blue-400">
                  Chat & Messaging
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Real-time direct messages, group chats, and coworker support discussions
                </p>
              </div>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-blue-400">
              <span>Open Chat</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-blue-500/10 blur-xl transition-all duration-300 group-hover:bg-blue-500/20" />
          </button>

          {/* Calls Card */}
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/calls" })}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-card/95 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden min-h-[148px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60 transition-colors group-hover:border-emerald-500/30 group-hover:text-foreground">
                    WebRTC
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-400">
                  Voice & Video Calls
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  One-on-one HD audio and video calls with team members and IT agents
                </p>
              </div>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-emerald-400">
              <span>Start Call</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-xl transition-all duration-300 group-hover:bg-emerald-500/20" />
          </button>

          {/* Meetings Card */}
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/meetings" })}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-card/95 hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer overflow-hidden min-h-[148px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <Video className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60 transition-colors group-hover:border-violet-500/30 group-hover:text-foreground">
                    Conferencing
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-violet-400">
                  Meetings & Rooms
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Schedule conferences, join live screen-sharing rooms & view calendar
                </p>
              </div>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-violet-400">
              <span>Join Meeting</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-violet-500/10 blur-xl transition-all duration-300 group-hover:bg-violet-500/20" />
          </button>

          {/* Slack Card */}
          <button
            type="button"
            onClick={() => {
              window.open("https://slack.com", "_blank", "noopener,noreferrer");
              toast.success("Connecting to company Slack #helpdesk channel...");
            }}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:bg-card/95 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer overflow-hidden min-h-[148px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card border border-border/80 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1">
                  <SlackIcon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60 transition-colors group-hover:border-amber-500/30 group-hover:text-foreground">
                    #helpdesk
                  </span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-amber-400">
                  Slack Channels
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Direct escalation via company Slack workspace and #helpdesk-support channel
                </p>
              </div>
            </div>
            <div className="mt-3.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-amber-400">
              <span>Open Slack</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-amber-500/10 blur-xl transition-all duration-300 group-hover:bg-amber-500/20" />
          </button>
        </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="h-10 p-1 bg-muted/60">
          {(isStaffAgent || isExec) && (
            <TabsTrigger value="dashboard" className="gap-1.5 text-xs font-semibold">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard & Metrics</span>
            </TabsTrigger>
          )}

          {isStaffAgent && (
            <TabsTrigger value="department-tickets" className="gap-1.5 text-xs font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>{isHr ? "HR Tickets" : "IT Tickets"}</span>
            </TabsTrigger>
          )}

          <TabsTrigger value="my-tickets" className="gap-1.5 text-xs font-semibold">
            <Inbox className="h-3.5 w-3.5" />
            <span>
              {isStaffAgent ? "All Triage Tickets" : isMgr ? "Team & My Tickets" : "My Tickets"}
            </span>
          </TabsTrigger>

          <TabsTrigger value="knowledge-base" className="gap-1.5 text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Knowledge Base</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab for Admins & Executives */}
        {(isStaffAgent || isExec) && (
          <TabsContent value="dashboard" className="space-y-6 focus-visible:outline-none">
            {loading ? (
              <HelpdeskLoadingState message="Calculating real Helpdesk metrics from active database..." />
            ) : error ? (
              <HelpdeskErrorState error={error} onRetry={loadData} />
            ) : (
              <HelpdeskMetricsGrid
                metrics={metrics}
                tickets={tickets}
                roleTitle={isHr ? "HR Support" : isIt ? "IT Operations" : "Company Helpdesk"}
              />
            )}

            {/* Quick Priority Queue Table on Dashboard */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Active Triage Queue</h3>
                <span className="text-xs text-muted-foreground">{tickets.length} total active</span>
              </div>
              <TicketTable
                tickets={tickets}
                onSelectTicket={handleTicketSelected}
                showRequesterColumn={true}
                onCreateTicket={() => setIsCreateOpen(true)}
                isLoading={loading}
                filterDepartment={isHr ? "HR" : isIt ? "IT" : "All"}
              />
            </div>
          </TabsContent>
        )}

        {/* Department-filtered Tickets Tab (HR / IT specific) */}
        {isStaffAgent && (
          <TabsContent value="department-tickets" className="space-y-4 focus-visible:outline-none">
            {loading ? (
              <HelpdeskLoadingState message="Loading department service tickets..." />
            ) : error ? (
              <HelpdeskErrorState error={error} onRetry={loadData} />
            ) : (
              <TicketTable
                tickets={tickets}
                onSelectTicket={handleTicketSelected}
                showRequesterColumn={true}
                onCreateTicket={() => setIsCreateOpen(true)}
                isLoading={loading}
                filterDepartment={currentDept === "hr" ? "HR" : currentDept === "it" ? "IT" : isHr ? "HR" : "IT"}
              />
            )}
          </TabsContent>
        )}

        {/* My Tickets / Triage Table Tab */}
        <TabsContent value="my-tickets" className="space-y-4 focus-visible:outline-none">
          {loading ? (
            <HelpdeskLoadingState message="Loading tickets..." />
          ) : error ? (
            <HelpdeskErrorState error={error} onRetry={loadData} />
          ) : (
            <TicketTable
              tickets={tickets}
              onSelectTicket={handleTicketSelected}
              showRequesterColumn={isStaffAgent || isMgr}
              onCreateTicket={() => setIsCreateOpen(true)}
              isLoading={loading}
              filterDepartment={currentDept === "hr" ? "HR" : currentDept === "it" ? "IT" : "All"}
            />
          )}
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4 focus-visible:outline-none">
          <KnowledgeBaseSection canManage={isStaffAgent} />
        </TabsContent>
      </Tabs>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleTicketCreated}
        defaultCategory={
          prefilledDraft?.category ||
          (currentDept === "hr" ? "hr_policy" : currentDept === "it" ? "it_hardware" : isHr ? "hr_policy" : "it_hardware")
        }
      />

      {/* Ticket Details & Conversation Modal */}
      <TicketDetailModal
        open={Boolean(selectedTicketId)}
        onOpenChange={(open) => !open && setSelectedTicketId(null)}
        ticketId={selectedTicketId}
        currentUserRole={currentRole}
        currentUserId={user?.id}
        onTicketUpdated={loadData}
      />

      {/* AI Troubleshooting Assistant Modal */}
      <AiSupportAssistantModal
        open={isAiOpen}
        onOpenChange={setIsAiOpen}
        onDraftTicket={(draft) => {
          setPrefilledDraft(draft);
          setIsCreateOpen(true);
        }}
      />
    </div>
  );
}
