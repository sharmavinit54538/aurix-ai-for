import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIInsightsDashboard } from "@/store/aiInsights/aiInsightsThunk";
import {
  selectAIInsightsAlerts,
  selectAIInsightsAttendance,
  selectAIInsightsAttrition,
  selectAIInsightsBurnout,
  selectAIInsightsCandidates,
  selectAIInsightsDocuments,
  selectAIInsightsError,
  selectAIInsightsHeadcountForecast,
  selectAIInsightsHiringDemand,
  selectAIInsightsKPIs,
  selectAIInsightsLoading,
  selectAIInsightsPayroll,
  selectAIInsightsPayrollAlerts,
  selectAIInsightsPayrollTrend,
  selectAIInsightsRecruitment,
  selectAIInsightsRecommendations,
  selectAIInsightsSatisfactionTrend,
  selectAIInsightsSkillGap,
  selectAIInsightsSummary,
  selectAIInsightsSupportPerformers,
  selectAIInsightsTopPerformers,
} from "@/store/aiInsights/aiInsightsSelectors";

export function useAIInsights() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const summary = useAppSelector(selectAIInsightsSummary);
  const kpis = useAppSelector(selectAIInsightsKPIs);
  const attrition = useAppSelector(selectAIInsightsAttrition);
  const burnout = useAppSelector(selectAIInsightsBurnout);
  const attendance = useAppSelector(selectAIInsightsAttendance);
  const recruitment = useAppSelector(selectAIInsightsRecruitment);
  const candidates = useAppSelector(selectAIInsightsCandidates);
  const topPerformers = useAppSelector(selectAIInsightsTopPerformers);
  const supportPerformers = useAppSelector(selectAIInsightsSupportPerformers);
  const skillGap = useAppSelector(selectAIInsightsSkillGap);
  const payroll = useAppSelector(selectAIInsightsPayroll);
  const payrollAlerts = useAppSelector(selectAIInsightsPayrollAlerts);
  const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
  const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const satisfactionTrend = useAppSelector(selectAIInsightsSatisfactionTrend);
  const alerts = useAppSelector(selectAIInsightsAlerts);
  const recommendations = useAppSelector(selectAIInsightsRecommendations);
  const documents = useAppSelector(selectAIInsightsDocuments);

  const refresh = useCallback(() => {
    dispatch(fetchAIInsightsDashboard());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasData = useMemo(
    () =>
      Boolean(
        kpis.length > 0 ||
          attrition.length > 0 ||
          burnout.length > 0 ||
          attendance.length > 0 ||
          candidates.length > 0 ||
          topPerformers.length > 0 ||
          recommendations.length > 0 ||
          alerts.length > 0 ||
          summary !== null,
      ),
    [
      kpis,
      attrition,
      burnout,
      attendance,
      candidates,
      topPerformers,
      recommendations,
      alerts,
      summary,
    ],
  );

  return {
    loading,
    error,
    summary,
    kpis,
    attrition,
    burnout,
    attendance,
    recruitment,
    candidates,
    topPerformers,
    supportPerformers,
    skillGap,
    payroll,
    payrollAlerts,
    payrollTrend,
    headcountForecast,
    hiringDemand,
    satisfactionTrend,
    alerts,
    recommendations,
    documents,
    hasData,
    refresh,
  };
}
