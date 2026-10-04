import React, { useState, useEffect, useCallback } from "react";
import { useCurrentRole, isSuperAdmin, isManager } from "@/lib/roles";
import { useAurix } from "@/lib/aurix-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  LayoutDashboard,
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
                filterDepartment={isHr ? "HR" : "IT"}
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
