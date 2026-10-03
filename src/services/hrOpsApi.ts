import apiInstance from "@/api/apiInstance";
import type { TimelineEvent } from "@/lib/hrms/types";

export interface HrOpsOverview {
  timeline: TimelineEvent[];
  assets: {
    total: number;
    byStatus: Record<string, number>;
  };
  visitors: {
    today: number;
    total: number;
  };
  expenses: {
    total: number;
    byStatus: Record<string, number>;
  };
  travel: {
    total: number;
    pending: number;
  };
  onboarding: {
    active: number;
  };
  offboarding: {
    active: number;
  };
  exits: {
    inProgress: number;
  };
}

export const hrOpsApi = {
  async getOverview(): Promise<HrOpsOverview> {
    const res = await apiInstance.get("/api/v2/hr-ops/overview");
    const raw = res.data?.data ?? res.data ?? {};
    return {
      timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
      assets: {
        total: Number(raw.assets?.total ?? 0),
        byStatus: raw.assets?.by_status || raw.assets?.byStatus || {},
      },
      visitors: {
        today: Number(raw.visitors?.today ?? 0),
        total: Number(raw.visitors?.total ?? 0),
      },
      expenses: {
        total: Number(raw.expenses?.total ?? 0),
        byStatus: raw.expenses?.by_status || raw.expenses?.byStatus || {},
      },
      travel: {
        total: Number(raw.travel?.total ?? 0),
        pending: Number(raw.travel?.pending ?? 0),
      },
      onboarding: {
        active: Number(raw.onboarding?.active ?? 0),
      },
      offboarding: {
        active: Number(raw.offboarding?.active ?? 0),
      },
      exits: {
        inProgress: Number(raw.exits?.in_progress ?? raw.exits?.inProgress ?? 0),
      },
    };
  },
};
