/**
 * Autopilot HR API Service
 * Central typed service integrating all Autopilot HR endpoints with apiInstance,
 * typed request/response models, and bidirectional snake_case <-> camelCase mapping.
 */

import apiInstance from "@/api/apiInstance";
import type {
  AgentActionToolCall,
  AuditLogEntry,
  AutoOnboardingRun,
  AutoPayrollStatus,
  AutopilotException,
  AutopilotOverview,
  AutopilotWorkflowId,
  AutonomySettings,
  ExceptionDecisionPayload,
  PolicyRule,
  ProactiveAlert,
  RuleSimulateRequest,
  RuleSimulateResult,
} from "../types";
import {
  mapAgentActionFromBackend,
  mapAlertFromBackend,
  mapAuditLogFromBackend,
  mapAutonomySettingsFromBackend,
  mapAutonomySettingsToBackend,
  mapExceptionFromBackend,
  mapOnboardingRunFromBackend,
  mapOverviewFromBackend,
  mapPayrollStatusFromBackend,
  mapPolicyRuleFromBackend,
  mapPolicyRuleToBackend,
} from "../utils/mappers";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  workflow?: AutopilotWorkflowId | string;
}

export interface ExceptionsQueryParams extends PaginationParams {
  status?: string;
  urgency?: string;
}

export interface AuditQueryParams extends PaginationParams {
  decision?: string;
  outcome?: string;
  confidenceMin?: number;
  confidenceMax?: number;
  startDate?: string;
  endDate?: string;
}

export interface AlertsQueryParams {
  category?: string;
  severity?: string;
  status?: string;
}

export const autopilotApi = {
  // ── 1) Autonomy Settings ──────────────────────────────────────────
  async getSettings(): Promise<AutonomySettings> {
    const res = await apiInstance.get("/api/v2/autopilot/settings");
    const data = res.data?.data ?? res.data;
    return mapAutonomySettingsFromBackend(data);
  },

  async updateSettings(settings: AutonomySettings): Promise<AutonomySettings> {
    const payload = mapAutonomySettingsToBackend(settings);
    const res = await apiInstance.put("/api/v2/autopilot/settings", payload);
    const data = res.data?.data ?? res.data;
    return mapAutonomySettingsFromBackend(data);
  },

  // ── 2) Policy Rules Builder ───────────────────────────────────────
  async getRules(workflow?: AutopilotWorkflowId): Promise<PolicyRule[]> {
    const res = await apiInstance.get("/api/v2/autopilot/rules", {
      params: workflow ? { workflow } : undefined,
    });
    const data = res.data?.data ?? res.data;
    const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
    return items.map(mapPolicyRuleFromBackend);
  },

  async createRule(rule: Omit<PolicyRule, "id" | "createdAt" | "updatedAt">): Promise<PolicyRule> {
    const payload = mapPolicyRuleToBackend(rule);
    const res = await apiInstance.post("/api/v2/autopilot/rules", payload);
    const data = res.data?.data ?? res.data;
    return mapPolicyRuleFromBackend(data);
  },

  async updateRule(id: string, rule: Partial<PolicyRule>): Promise<PolicyRule> {
    const payload = mapPolicyRuleToBackend(rule);
    const res = await apiInstance.put(`/api/v2/autopilot/rules/${id}`, payload);
    const data = res.data?.data ?? res.data;
    return mapPolicyRuleFromBackend(data);
  },

  async deleteRule(id: string): Promise<void> {
    await apiInstance.delete(`/api/v2/autopilot/rules/${id}`);
  },

  async simulateRule(req: RuleSimulateRequest): Promise<RuleSimulateResult> {
    const payload = {
      workflow: req.workflow,
      rule_id: req.ruleId,
      sample_data: req.sampleData,
    };
    const res = await apiInstance.post("/api/v2/autopilot/rules/simulate", payload);
    const raw = res.data?.data ?? res.data;
    return {
      matched: Boolean(raw?.matched),
      ruleId: raw?.rule_id,
      ruleName: raw?.rule_name,
      action: raw?.action || "escalate_to_human",
      confidence: Number(raw?.confidence ?? 0),
      policyClause: String(raw?.policy_clause || ""),
      reasoning: String(raw?.reasoning || ""),
      evaluatedConditions: Array.isArray(raw?.evaluated_conditions)
        ? raw.evaluated_conditions.map((ec: any) => ({
            field: String(ec.field || ""),
            operator: ec.operator,
            expected: ec.expected,
            actual: ec.actual,
            passed: Boolean(ec.passed),
          }))
        : [],
    };
  },

  // ── 3) Exceptions Inbox ───────────────────────────────────────────
  async getExceptions(params?: ExceptionsQueryParams): Promise<{
    items: AutopilotException[];
    total: number;
  }> {
    const res = await apiInstance.get("/api/v2/autopilot/exceptions", { params });
    const raw = res.data?.data ?? res.data;
    const itemsRaw = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
    const total = raw?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapExceptionFromBackend),
      total,
    };
  },

  async submitExceptionDecision(
    id: string,
    payload: ExceptionDecisionPayload,
  ): Promise<AutopilotException> {
    const body = {
      decision: payload.decision,
      reason: payload.reason,
      reassigned_to_user_id: payload.reassignedToUserId,
    };
    const res = await apiInstance.post(`/api/v2/autopilot/exceptions/${id}/decision`, body);
    const raw = res.data?.data ?? res.data;
    return mapExceptionFromBackend(raw);
  },

  // ── 4) HR Agent Chat and Action Execution ─────────────────────────
  async sendAgentChat(message: string, conversationId?: string): Promise<any> {
    const res = await apiInstance.post("/api/v2/autopilot/agent/chat", {
      message,
      conversation_id: conversationId,
    });
    return res.data;
  },

  async confirmAgentAction(id: string): Promise<AgentActionToolCall> {
    const res = await apiInstance.post(`/api/v2/autopilot/agent/actions/${id}/confirm`);
    const raw = res.data?.data ?? res.data;
    return mapAgentActionFromBackend(raw);
  },

  async cancelAgentAction(id: string, reason?: string): Promise<AgentActionToolCall> {
    const res = await apiInstance.post(`/api/v2/autopilot/agent/actions/${id}/cancel`, {
      reason,
    });
    const raw = res.data?.data ?? res.data;
    return mapAgentActionFromBackend(raw);
  },

  // ── 5) AI Action Audit Log ─────────────────────────────────────────
  async getAuditLogs(params?: AuditQueryParams): Promise<{
    items: AuditLogEntry[];
    total: number;
  }> {
    const res = await apiInstance.get("/api/v2/autopilot/audit", {
      params: {
        page: params?.page,
        limit: params?.limit,
        workflow: params?.workflow,
        search: params?.search,
        decision: params?.decision,
        confidence_min: params?.confidenceMin,
        confidence_max: params?.confidenceMax,
        start_date: params?.startDate,
        end_date: params?.endDate,
      },
    });
    const raw = res.data?.data ?? res.data;
    const itemsRaw = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
    const total = raw?.total ?? itemsRaw.length;
    return {
      items: itemsRaw.map(mapAuditLogFromBackend),
      total,
    };
  },

  async undoAuditAction(id: string, reason: string): Promise<AuditLogEntry> {
    const res = await apiInstance.post(`/api/v2/autopilot/audit/${id}/undo`, { reason });
    const raw = res.data?.data ?? res.data;
    return mapAuditLogFromBackend(raw);
  },

  async overrideAuditAction(
    id: string,
    payload: { newDecision: string; reason: string },
  ): Promise<AuditLogEntry> {
    const res = await apiInstance.post(`/api/v2/autopilot/audit/${id}/override`, {
      new_decision: payload.newDecision,
      reason: payload.reason,
    });
    const raw = res.data?.data ?? res.data;
    return mapAuditLogFromBackend(raw);
  },

  // ── 6) Proactive Alerts Center ─────────────────────────────────────
  async getAlerts(params?: AlertsQueryParams): Promise<ProactiveAlert[]> {
    const res = await apiInstance.get("/api/v2/autopilot/alerts", { params });
    const raw = res.data?.data ?? res.data;
    const itemsRaw = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
    return itemsRaw.map(mapAlertFromBackend);
  },

  async acknowledgeAlert(id: string): Promise<ProactiveAlert> {
    const res = await apiInstance.post(`/api/v2/autopilot/alerts/${id}/ack`);
    const raw = res.data?.data ?? res.data;
    return mapAlertFromBackend(raw);
  },

  async snoozeAlert(id: string, untilIso: string): Promise<ProactiveAlert> {
    const res = await apiInstance.post(`/api/v2/autopilot/alerts/${id}/snooze`, {
      snoozed_until: untilIso,
    });
    const raw = res.data?.data ?? res.data;
    return mapAlertFromBackend(raw);
  },

  async createAlertTask(
    id: string,
    payload: { title: string; assignedToUserId?: string; dueDate?: string },
  ): Promise<{ taskId: string; alert: ProactiveAlert }> {
    const res = await apiInstance.post(`/api/v2/autopilot/alerts/${id}/task`, {
      title: payload.title,
      assigned_to_user_id: payload.assignedToUserId,
      due_date: payload.dueDate,
    });
    const raw = res.data?.data ?? res.data;
    return {
      taskId: String(raw?.task_id || ""),
      alert: mapAlertFromBackend(raw?.alert ?? raw),
    };
  },

  // ── 7) Autopilot Overview / Dashboard ──────────────────────────────
  async getOverview(): Promise<AutopilotOverview> {
    const res = await apiInstance.get("/api/v2/autopilot/overview");
    const raw = res.data?.data ?? res.data;
    return mapOverviewFromBackend(raw);
  },

  // ── 8) Auto Onboarding & Auto Payroll Status ───────────────────────
  async getOnboardingRuns(): Promise<AutoOnboardingRun[]> {
    const res = await apiInstance.get("/api/v2/autopilot/onboarding/runs");
    const raw = res.data?.data ?? res.data;
    const itemsRaw = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
    return itemsRaw.map(mapOnboardingRunFromBackend);
  },

  async getOnboardingRun(id: string): Promise<AutoOnboardingRun> {
    const res = await apiInstance.get(`/api/v2/autopilot/onboarding/runs/${id}`);
    const raw = res.data?.data ?? res.data;
    return mapOnboardingRunFromBackend(raw);
  },

  async retryOnboardingStep(runId: string, stepId: string): Promise<AutoOnboardingRun> {
    const res = await apiInstance.post(`/api/v2/autopilot/onboarding/runs/${runId}/retry-step`, {
      step_id: stepId,
    });
    const raw = res.data?.data ?? res.data;
    return mapOnboardingRunFromBackend(raw);
  },

  async getPayrollStatus(): Promise<AutoPayrollStatus> {
    const res = await apiInstance.get("/api/v2/autopilot/payroll/status");
    const raw = res.data?.data ?? res.data;
    return mapPayrollStatusFromBackend(raw);
  },
};
