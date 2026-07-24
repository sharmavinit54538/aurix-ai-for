import { useEffect, useMemo } from "react";
import { AlertCircle, Briefcase, RefreshCw } from "lucide-react";
import { AIModulePage } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIInsightsDashboard } from "@/store/aiInsights/aiInsightsThunk";
import {
  selectAIInsightsCandidates,
  selectAIInsightsError,
  selectAIInsightsHiringDemand,
  selectAIInsightsLastUpdated,
  selectAIInsightsLoading,
  selectAIInsightsRecruitment,
} from "@/store/aiInsights/aiInsightsSelectors";
import {
  buildRecruiterCharts,
  buildRecruiterFeatures,
  buildRecruiterKpis,
  formatLastAnalysis,
} from "../utils/recruiterMappers";

export function AIRecruiterPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const recruitment = useAppSelector(selectAIInsightsRecruitment);
  const candidates = useAppSelector(selectAIInsightsCandidates);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const lastUpdated = useAppSelector(selectAIInsightsLastUpdated);

  useEffect(() => {
    dispatch(fetchAIInsightsDashboard());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAIInsightsDashboard());
  };

  const hasData = Boolean(recruitment || candidates.length > 0 || hiringDemand.length > 0);

  const kpis = useMemo(() => buildRecruiterKpis(recruitment, candidates), [recruitment, candidates]);
  const charts = useMemo(() => buildRecruiterCharts(candidates, hiringDemand), [candidates, hiringDemand]);
  const features = useMemo(() => buildRecruiterFeatures(recruitment, candidates), [recruitment, candidates]);
  const lastAnalysis = formatLastAnalysis(lastUpdated);

  if (loading && !hasData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <AIModulePage
      icon={Briefcase}
      eyebrow="AI Recruiter"
      title="Hire smarter, faster, with AI ranking & matching"
      description="Auto-screen resumes, rank candidates, match to JDs and generate tailored interview questions."
      lastAnalysis={lastAnalysis}
      kpis={kpis}
      charts={charts}
      features={features}
    >
      {error ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}

      {!loading && !error && !hasData ? (
        <div className="mt-4 rounded-xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
          No recruitment intelligence data available yet. Run AI analysis or add active requisitions to populate this view.
        </div>
      ) : null}
    </AIModulePage>
  );
}

export default AIRecruiterPage;
