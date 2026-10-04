import React, { useState, useEffect, useCallback } from "react";
import { useCurrentRole, isSuperAdmin, isHrAdmin, isManager } from "@/lib/roles";
import { useAurix } from "@/lib/aurix-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  LifeBuoy,
  Plus,
  BookOpen,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Layers,
  Inbox,
} from "lucide-react";
import { TicketTable } from "../components/TicketTable";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { TicketDetailModal } from "../components/TicketDetailModal";
import { KnowledgeBaseSection } from "../components/KnowledgeBaseSection";
import { HelpdeskMetricsGrid } from "../components/HelpdeskMetricsGrid";
import { AiSupportAssistantModal } from "../components/AiSupportAssistantModal";
import {
  HelpdeskAccessDeniedState,
  HelpdeskEmptyState,
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

export default function HelpdeskRootPage() {
  const currentRole = useCurrentRole();
  const aurix = useAurix();
  const user = aurix.user;

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

  const handleTicketSelected = (ticket: HelpdeskTicket) => {
    setSelectedTicketId(ticket.id);
  };

  const handleTicketCreated = (newTicket: HelpdeskTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {isHr
                  ? "HR Helpdesk Command Center"
                  : isIt
                  ? "IT Helpdesk Operations"
                  : isExec
                  ? "Executive Helpdesk Analytics"
                  : isMgr
                  ? "Team Support & Helpdesk"
                  : "Helpdesk & Employee Support"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isStaffAgent
                  ? "Live ticket triage, agent assignment, internal notes, and SLA compliance monitoring."
                  : isExec
                  ? "Executive overview of SLA compliance, resolution times, and department service loads."
                  : "Submit tickets, track resolution progress, view SLA status, and search knowledge base."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-9 gap-1.5"
            title="Refresh tickets from server"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {!isExec && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAiOpen(true)}
                className="h-9 gap-1.5 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Help</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setPrefilledDraft(null);
                  setIsCreateOpen(true);
                }}
                className="h-9 gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Create Ticket</span>
              </Button>
            </>
          )}
        </div>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {isHr ? "HR & Payroll Service Queue" : "IT Hardware & Software Service Queue"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Filtered specifically to departmental categories requiring your attention.
                </p>
              </div>
            </div>
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
                filterDepartment={isHr ? "HR" : "IT"}
              />
            )}
          </TabsContent>
        )}

        {/* My Tickets / Triage Table Tab */}
        <TabsContent value="my-tickets" className="space-y-4 focus-visible:outline-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isStaffAgent
                  ? "All Company Triage Tickets"
                  : isMgr
                  ? "Team & Assigned Tickets"
                  : "My Support Tickets"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isStaffAgent
                  ? "Manage, assign, and resolve tickets across the entire organization."
                  : "View real-time status, reply to support staff, and track resolution SLAs."}
              </p>
            </div>
          </div>

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
        defaultCategory={prefilledDraft?.category || (isHr ? "hr_policy" : "it_hardware")}
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
