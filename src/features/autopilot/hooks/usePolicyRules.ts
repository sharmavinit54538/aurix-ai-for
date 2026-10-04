import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { autopilotApi } from "../services/autopilotApi";
import type {
  AutopilotWorkflowId,
  PolicyRule,
  RuleSimulateRequest,
  RuleSimulateResult,
} from "../types";

export interface UsePolicyRulesReturn {
  rules: PolicyRule[];
  loading: boolean;
  error: string | null;
  backendUnavailable: boolean;
  selectedWorkflow: AutopilotWorkflowId | "all";
  simulating: boolean;
  simulationResult: RuleSimulateResult | null;
  setSelectedWorkflow: (wf: AutopilotWorkflowId | "all") => void;
  refetch: () => Promise<void>;
  createRule: (rule: Omit<PolicyRule, "id" | "createdAt" | "updatedAt">) => Promise<boolean>;
  updateRule: (id: string, partial: Partial<PolicyRule>) => Promise<boolean>;
  deleteRule: (id: string) => Promise<boolean>;
  toggleRuleEnabled: (id: string, currentEnabled: boolean) => Promise<boolean>;
  simulateRule: (req: RuleSimulateRequest) => Promise<RuleSimulateResult | null>;
  clearSimulationResult: () => void;
}

export function usePolicyRules(): UsePolicyRulesReturn {
  const [rules, setRules] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutopilotWorkflowId | "all">("all");

  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<RuleSimulateResult | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const items = await autopilotApi.getRules(
        selectedWorkflow !== "all" ? selectedWorkflow : undefined,
      );
      setRules(items);
      setError(null);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setRules([]);
        setError(null);
      } else {
        const msg = err?.response?.data?.message || err?.message || "Failed to load policy rules";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedWorkflow]);

  useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  const createRule = useCallback(
    async (newRule: Omit<PolicyRule, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
      try {
        const created = await autopilotApi.createRule(newRule);
        setRules((prev) => [created, ...prev]);
        toast.success(`Rule "${created.name}" created successfully`);
        return true;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Failed to create rule");
        }
        return false;
      }
    },
    [],
  );

  const updateRule = useCallback(
    async (id: string, partial: Partial<PolicyRule>): Promise<boolean> => {
      try {
        const updated = await autopilotApi.updateRule(id, partial);
        setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
        toast.success("Rule updated successfully");
        return true;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Failed to update rule");
        }
        return false;
      }
    },
    [],
  );

  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    try {
      await autopilotApi.deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rule deleted");
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(err?.response?.data?.message || "Failed to delete rule");
      }
      return false;
    }
  }, []);

  const toggleRuleEnabled = useCallback(
    async (id: string, currentEnabled: boolean): Promise<boolean> => {
      const target = rules.find((r) => r.id === id);
      if (!target) return false;

      // Optimistic toggle
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isEnabled: !currentEnabled } : r)),
      );

      try {
        const updated = await autopilotApi.updateRule(id, { isEnabled: !currentEnabled });
        setRules((prev) => prev.map((r) => (r.id === id ? (updated ?? { ...r, isEnabled: !currentEnabled }) : r)));
        toast.success(`Rule ${!currentEnabled ? "enabled" : "disabled"}`);
        return true;
      } catch (err: any) {
        // Rollback
        setRules((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isEnabled: currentEnabled } : r)),
        );
        toast.error("Failed to toggle rule state");
        return false;
      }
    },
    [rules],
  );

  const simulateRule = useCallback(
    async (req: RuleSimulateRequest): Promise<RuleSimulateResult | null> => {
      setSimulating(true);
      try {
        const result = await autopilotApi.simulateRule(req);
        setSimulationResult(result);
        return result;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Simulation unavailable — backend pending");
        } else {
          toast.error(err?.response?.data?.message || "Simulation failed");
        }
        return null;
      } finally {
        setSimulating(false);
      }
    },
    [],
  );

  const clearSimulationResult = useCallback(() => {
    setSimulationResult(null);
  }, []);

  return {
    rules,
    loading,
    error,
    backendUnavailable,
    selectedWorkflow,
    simulating,
    simulationResult,
    setSelectedWorkflow,
    refetch: fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleEnabled,
    simulateRule,
    clearSimulationResult,
  };
}
