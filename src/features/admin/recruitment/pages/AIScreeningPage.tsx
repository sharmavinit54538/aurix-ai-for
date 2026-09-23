import { useState, useMemo } from "react";
import {
  Sparkles, Sliders, CheckCircle2,
  GitCompare, Check, X, Eye
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";
import type { Candidate } from "../types";

export function AIScreeningPage() {
  const { candidates, jobs, moveStage } = useRecruitment();
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "review" | "rejected">("all");

  // Screening Configuration Weights
  const [skillWeight, setSkillWeight] = useState(40);
  const [expWeight, setExpWeight] = useState(30);
  const [eduWeight, setEduWeight] = useState(20);
  const [certWeight, setCertWeight] = useState(10);

  // Candidate Comparison State (up to 3 candidates)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Detail Modal State
  const [inspectCandidate, setInspectCandidate] = useState<Candidate | null>(null);

  // Auto-sync job selection
  useMemo(() => {
    if ((!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  // Candidates for this job or all candidates
  const jobCandidates = useMemo(() => {
    if (!selectedJobId) return candidates;
    const list = candidates.filter((c) => c.jobId === selectedJobId);
    return list.length > 0 ? list : candidates;
  }, [candidates, selectedJobId]);

  // Compute calculated ATS scores dynamically based on user-adjusted weights
  const scoredCandidates = useMemo(() => {
    return jobCandidates.map((c) => {
      const candSkills = c.skills || [];
      const jobSkills = selectedJob?.skills || [];
      const matchCount = jobSkills.length > 0
        ? candSkills.filter((s) =>
            jobSkills.some((k) => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()))
          ).length
        : 0;
      const skillScore = jobSkills.length > 0
        ? Math.min(100, Math.round((matchCount / jobSkills.length) * 100))
        : (candSkills.length > 0 ? 50 : 0);
      const expScore = Math.min(100, Math.round(((c.yearsExperience || 0) / 6) * 100));
      const eduScore = (c.education || []).length > 0 ? 90 : 50;
      const certScore = (c.certifications || []).length > 0 ? 90 : 50;

      const totalWeight = skillWeight + expWeight + eduWeight + certWeight;
      const compositeScore = totalWeight > 0
        ? Math.round(
            (skillScore * skillWeight +
              expScore * expWeight +
              eduScore * eduWeight +
              certScore * certWeight) /
              totalWeight
          )
        : 0;

      let decisionCategory: "shortlisted" | "review" | "rejected" = "review";
      if (compositeScore >= 85) decisionCategory = "shortlisted";
      else if (compositeScore < 70) decisionCategory = "rejected";

      const matchedSkills = candSkills.filter((s) =>
        jobSkills.some((k) => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()))
      );

      let rationale = "";
      if (compositeScore >= 85) {
        rationale = matchedSkills.length > 0
          ? `Strong match on ${matchedSkills.slice(0, 3).join(", ")}. ${c.yearsExperience || 0} years of relevant experience.`
          : `High composite score. ${c.yearsExperience || 0} years of experience.`;
      } else if (compositeScore >= 70) {
        rationale = `Moderate fit. ${c.yearsExperience || 0} years experience. Further evaluation recommended.`;
      } else {
        rationale = `Below threshold. Skills gap identified against role requirements.`;
      }

      return {
        ...c,
        skills: candSkills,
        calculatedScore: compositeScore,
        skillScore,
        expScore,
        eduScore,
        certScore,
        decisionCategory,
        rationale,
      };
    });
  }, [jobCandidates, selectedJob, skillWeight, expWeight, eduWeight, certWeight]);

  const filteredCandidates = useMemo(() => {
    if (activeTab === "all") return scoredCandidates;
    return scoredCandidates.filter((c) => c.decisionCategory === activeTab);
  }, [scoredCandidates, activeTab]);

  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else {
      if (compareIds.length >= 3) {
        toast.error("You can compare at most 3 candidates simultaneously.");
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const handleDecisionAction = (candId: string, decision: "shortlisted" | "rejected") => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;
    const nextStage = decision === "shortlisted" ? "technical" : "rejected";
    const targetId = cand.applicationId || cand.id;
    if (targetId) {
      moveStage(targetId, nextStage);
    }
    toast.success(`Candidate ${cand.name} marked as ${decision.toUpperCase()}!`);
  };

  const compareList = scoredCandidates.filter((c) => compareIds.includes(c.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Resume Screening & Match Intelligence"
        description="Fine-tune criteria weights, inspect AI semantic fit breakdown, compare candidate scorecards side-by-side, and triage shortlists."
        actions={
          <div className="flex items-center gap-2">
            {compareIds.length >= 2 && (
              <Button
                onClick={() => setShowCompareModal(true)}
                className="gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow"
              >
                <GitCompare className="h-4 w-4" />
                Compare ({compareIds.length}) Candidates
              </Button>
            )}
          </div>
        }
      />

      {/* Target Job Selector & Screening Weights Configuration */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Active Requisition</span>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>
          {jobs.length === 0 ? (
            <div className="p-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground bg-muted/20">
              No jobs available. Create a job requisition first.
            </div>
          ) : (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedJob && (
            <div className="text-xs space-y-2 pt-2 border-t border-border">
              {selectedJob.department && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Department:</span>
                  <span className="font-medium text-foreground">{selectedJob.department}</span>
                </div>
              )}
              {selectedJob.experience && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Target Experience:</span>
                  <span className="font-medium text-foreground">{selectedJob.experience}</span>
                </div>
              )}
              {selectedJob.skills.length > 0 && (
                <>
                  <div className="text-muted-foreground">Key Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dynamic AI Scoring Weight Sliders */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-500" />
                Screening Criteria Weightings
              </h3>
              <p className="text-xs text-muted-foreground">
                Adjust sliders to dynamically re-calibrate match algorithms for this role.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => {
                setSkillWeight(40);
                setExpWeight(30);
                setEduWeight(20);
                setCertWeight(10);
                toast.info("Reset weights to balanced default");
              }}
            >
              Reset Default
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Skills & Tech Stack ({skillWeight}%)</span>
                <span className="text-muted-foreground">{skillWeight}%</span>
              </div>
              <Slider
                value={[skillWeight]}
                min={10}
                max={60}
                step={5}
                onValueChange={(v) => setSkillWeight(v[0])}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Years of Experience ({expWeight}%)</span>
                <span className="text-muted-foreground">{expWeight}%</span>
              </div>
              <Slider
                value={[expWeight]}
                min={10}
                max={50}
                step={5}
                onValueChange={(v) => setExpWeight(v[0])}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Education & Pedigree ({eduWeight}%)</span>
                <span className="text-muted-foreground">{eduWeight}%</span>
              </div>
              <Slider
                value={[eduWeight]}
                min={5}
                max={30}
                step={5}
                onValueChange={(v) => setEduWeight(v[0])}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Certifications & Projects ({certWeight}%)</span>
                <span className="text-muted-foreground">{certWeight}%</span>
              </div>
              <Slider
                value={[certWeight]}
                min={5}
                max={30}
                step={5}
                onValueChange={(v) => setCertWeight(v[0])}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decision Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          {(["all", "shortlisted", "review", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All Screened" : tab} (
              {tab === "all"
                ? scoredCandidates.length
                : scoredCandidates.filter((c) => c.decisionCategory === tab).length}
              )
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          {compareIds.length} candidate(s) selected for comparison
        </div>
      </div>

      {/* Candidates Screening Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/20">
          <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No candidates to screen</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {candidates.length === 0
              ? "Add candidates to your pipeline to begin AI screening."
              : "No candidates match the current filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className={`rounded-2xl border bg-card/60 p-4 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between ${
                compareIds.includes(cand.id) ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-border"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{cand.name}</h4>
                    <div className="text-xs text-muted-foreground">{cand.appliedPosition}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-foreground">
                      {cand.calculatedScore}%
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[9px] uppercase tracking-wider font-bold ${
                        cand.decisionCategory === "shortlisted"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : cand.decisionCategory === "rejected"
                          ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                          : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {cand.decisionCategory}
                    </Badge>
                  </div>
                </div>

                {/* Match Details Progress Bars */}
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Skills Match:</span>
                    <span className="font-semibold text-foreground">{cand.skillScore}%</span>
                  </div>
                  <Progress value={cand.skillScore} className="h-1.5" />

                  <div className="flex justify-between text-muted-foreground pt-1">
                    <span>Experience Fit ({cand.yearsExperience || 0} yrs):</span>
                    <span className="font-semibold text-foreground">{cand.expScore}%</span>
                  </div>
                  <Progress value={cand.expScore} className="h-1.5" />
                </div>

                {/* AI Rationale Snippet */}
                <div className="mt-3 rounded-lg bg-muted/40 p-2 text-[11px] text-muted-foreground leading-relaxed border border-border/60">
                  <span className="font-semibold text-foreground flex items-center gap-1 mb-0.5">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    AI Rationale:
                  </span>
                  {cand.rationale}
                </div>

                {cand.skills.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {cand.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[9px]">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={compareIds.includes(cand.id)}
                    onChange={() => handleToggleCompare(cand.id)}
                    className="rounded border-border text-indigo-600"
                  />
                  Compare
                </label>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs px-2"
                    onClick={() => setInspectCandidate(cand)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Inspect
                  </Button>

                  {cand.decisionCategory !== "shortlisted" && (
                    <Button
                      size="sm"
                      className="h-7 text-xs px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleDecisionAction(cand.id, "shortlisted")}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}

                  {cand.decisionCategory !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                      onClick={() => handleDecisionAction(cand.id, "rejected")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Comparison Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-indigo-500" />
              Side-by-Side Candidate Comparison
            </DialogTitle>
            <DialogDescription>
              Comparing {compareList.length} candidates{selectedJob ? ` for ${selectedJob.title}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2.5 w-1/4 font-semibold text-muted-foreground">Evaluation Vector</th>
                  {compareList.map((c) => (
                    <th key={c.id} className="p-2.5 w-1/4">
                      <div className="font-bold text-sm text-foreground">{c.name}</div>
                      {c.currentCompany && (
                        <div className="text-[11px] text-muted-foreground">{c.currentCompany}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Composite ATS Score</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-bold text-sm text-indigo-500">
                      {c.calculatedScore}% ({c.decisionCategory})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Skills Match</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5">
                      <div className="font-semibold">{c.skillScore}%</div>
                      {c.skills.length > 0 && (
                        <div className="text-[10px] text-muted-foreground">{c.skills.join(", ")}</div>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Relevant Experience</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-semibold">
                      {c.yearsExperience || 0} Years
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Education</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-muted-foreground">
                      {c.education?.[0]?.degree || "Not specified"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Notice Period</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-semibold">
                      {c.noticeDays ? `${c.noticeDays} Days` : "Not specified"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Expected Compensation</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-semibold">
                      {c.expectedSalary ? `₹${(c.expectedSalary / 100000).toFixed(1)} LPA` : "Not specified"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">AI Rationale</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] text-muted-foreground leading-normal">
                      {c.rationale}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Recommendation</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5">
                      <Button
                        size="sm"
                        className="w-full h-8 text-xs bg-gradient-brand text-brand-foreground shadow-glow"
                        onClick={() => {
                          handleDecisionAction(c.id, "shortlisted");
                          setShowCompareModal(false);
                        }}
                      >
                        Advance to Tech Interview
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inspect Candidate Drawer */}
      {inspectCandidate && (
        <Dialog open={Boolean(inspectCandidate)} onOpenChange={() => setInspectCandidate(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">{inspectCandidate.stage}</Badge>
                {inspectCandidate.atsScore != null && (
                  <span className="font-display text-lg font-bold text-indigo-500">
                    {inspectCandidate.atsScore}% Match
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl font-bold">{inspectCandidate.name}</DialogTitle>
              <DialogDescription>
                {[
                  inspectCandidate.appliedPosition ? `Applied for ${inspectCandidate.appliedPosition}` : "",
                  inspectCandidate.location,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {inspectCandidate.summary && (
                <div>
                  <Label className="font-semibold text-muted-foreground">Candidate Summary</Label>
                  <p className="mt-1 p-3 rounded-lg border border-border bg-card/60 leading-relaxed text-foreground">
                    {inspectCandidate.summary}
                  </p>
                </div>
              )}

              {inspectCandidate.skills.length > 0 && (
                <div>
                  <Label className="font-semibold text-muted-foreground">Extracted Skills</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {inspectCandidate.skills.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setInspectCandidate(null)}>
                  Close
                </Button>
                <Button
                  className="bg-gradient-brand text-brand-foreground shadow-glow"
                  onClick={() => {
                    handleDecisionAction(inspectCandidate.id, "shortlisted");
                    setInspectCandidate(null);
                  }}
                >
                  Confirm Shortlist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
