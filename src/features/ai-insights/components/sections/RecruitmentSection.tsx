import { Briefcase, LineChart as LineChartIcon, Target, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CandidateMatchItem, RecruitmentData } from "@/store/aiInsights/aiInsightsTypes";
import { BarMeter } from "../shared/Badges";
import { EmptySection } from "../shared/EmptySection";
import { InsightsPanel } from "../shared/InsightsPanel";
import { MiniStat } from "../shared/MiniStat";
import { SectionTitle } from "../shared/SectionTitle";

export function RecruitmentSection({
  recruitment,
  candidates,
}: {
  recruitment: RecruitmentData | null;
  candidates: CandidateMatchItem[];
}) {
  return (
    <>
      <SectionTitle eyebrow="Hiring" title="AI Recruitment Assistant" icon={Briefcase} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MiniStat
          label="Open Positions"
          value={recruitment?.openPositions != null ? String(recruitment.openPositions) : "—"}
          hint="across active departments"
          icon={Briefcase}
        />
        <MiniStat
          label="Recommended Candidates"
          value={recruitment?.recommendedCandidatesCount != null ? String(recruitment.recommendedCandidatesCount) : "—"}
          hint="match score > 80%"
          icon={UserPlus}
        />
        <MiniStat
          label="Pipeline Health"
          value={recruitment?.pipelineHealth ?? "N/A"}
          hint="active hiring pipeline"
          icon={LineChartIcon}
        />

        <InsightsPanel
          title="Top Candidate Matches"
          icon={Target}
          accent="from-violet-500/20 to-fuchsia-500/10"
          className="lg:col-span-3"
        >
          {candidates.length === 0 ? (
            <EmptySection message="No recommended candidate matches available." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Candidate</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Resume Match</th>
                  <th className="text-left">Interview Readiness</th>
                  <th className="text-left"></th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id ?? candidate.name} className="border-t border-border/60">
                    <td className="py-2.5 font-medium">{candidate.name}</td>
                    <td className="text-muted-foreground">{candidate.role}</td>
                    <td className="w-48">
                      <BarMeter value={candidate.match} />
                    </td>
                    <td className="w-48">
                      <BarMeter value={candidate.readiness} tone="violet" />
                    </td>
                    <td>
                      <Button size="sm" variant="outline">
                        Shortlist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </InsightsPanel>
      </div>
    </>
  );
}
