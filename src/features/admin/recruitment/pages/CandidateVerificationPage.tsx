import { useState } from "react";
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Check, Users
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface VerificationCheck {
  id: string;
  name: string;
  category: "Identity" | "Education" | "Employment" | "Reference" | "Criminal";
  status: "Verified" | "In Review" | "Pending Document" | "Exception Flagged";
  verifiedAt?: string;
  verifier: string;
  documentName: string;
  notes: string;
}

interface CandidateVerificationProfile {
  candidateId: string;
  candidateName: string;
  appliedPosition: string;
  overallStatus: "Clear" | "In Progress" | "Action Required" | "Manual Review";
  riskScore: "Low" | "Medium" | "High";
  checks: VerificationCheck[];
  timeline: { date: string; title: string; actor: string }[];
}

const INITIAL_BGV_DATA: CandidateVerificationProfile[] = [];

export function CandidateVerificationPage() {
  const [bgvList, setBgvList] = useState<CandidateVerificationProfile[]>(INITIAL_BGV_DATA);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [manualOverrideModal, setManualOverrideModal] = useState<VerificationCheck | null>(null);
  const [overrideNotes, setOverrideNotes] = useState("");

  const activeProfile = bgvList.find((p) => p.candidateId === selectedProfileId) || bgvList[0] || null;

  const handleApproveCheck = (checkId: string) => {
    if (!activeProfile) return;
    const updated = bgvList.map((prof) => {
      if (prof.candidateId !== activeProfile.candidateId) return prof;
      return {
        ...prof,
        checks: prof.checks.map((chk) =>
          chk.id === checkId
            ? { ...chk, status: "Verified" as const, verifiedAt: new Date().toISOString().split("T")[0] }
            : chk
        ),
      };
    });
    setBgvList(updated);
    toast.success("Verification check approved & marked Verified!");
  };

  const handleManualOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOverrideModal || !activeProfile) return;

    const updated = bgvList.map((prof) => {
      if (prof.candidateId !== activeProfile.candidateId) return prof;
      return {
        ...prof,
        overallStatus: "Clear" as const,
        checks: prof.checks.map((chk) =>
          chk.id === manualOverrideModal.id
            ? {
                ...chk,
                status: "Verified" as const,
                notes: `[Manual HR Override Approved]: ${overrideNotes}`,
                verifiedAt: new Date().toISOString().split("T")[0],
              }
            : chk
        ),
      };
    });
    setBgvList(updated);
    toast.success("Manual review override approved and audit trail updated.");
    setManualOverrideModal(null);
    setOverrideNotes("");
  };

  const statusBadgeColor = {
    Verified: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    "In Review": "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
    "Pending Document": "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
    "Exception Flagged": "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Background Verification (BGV) Hub"
        description="Verify candidate credentials, identity documents, past employment records, court registries, and manage exceptions with full audit tracking."
      />

      {/* Main Candidate Selection & Verification Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Candidate Selector List */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="font-semibold text-sm flex items-center justify-between">
            <span>Candidates in BGV</span>
            <Badge variant="outline" className="text-xs">{bgvList.length} Active</Badge>
          </div>

          <div className="space-y-2">
            {bgvList.map((prof) => (
              <button
                key={prof.candidateId}
                onClick={() => setSelectedProfileId(prof.candidateId)}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeProfile?.candidateId === prof.candidateId
                    ? "border-indigo-500 bg-accent/60 shadow-sm"
                    : "border-border bg-card/40 hover:bg-accent/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{prof.candidateName}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ${
                      prof.overallStatus === "Clear"
                        ? "text-emerald-600 border-emerald-500/40"
                        : prof.overallStatus === "Manual Review"
                        ? "text-rose-600 border-rose-500/40"
                        : "text-amber-600 border-amber-500/40"
                    }`}
                  >
                    {prof.overallStatus}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{prof.appliedPosition}</div>
                <div className="text-[10px] text-muted-foreground mt-2 flex justify-between">
                  <span>Checks: {prof.checks.filter((c) => c.status === "Verified").length} / {prof.checks.length} Verified</span>
                  <span className="font-semibold text-foreground">Risk: {prof.riskScore}</span>
                </div>
              </button>
            ))}
            {bgvList.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-6">No candidates in verification pipeline.</div>
            )}
          </div>
        </div>

        {/* BGV Checklist & Status Details */}
        <div className="lg:col-span-2 space-y-4">
          {activeProfile ? (
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{activeProfile.candidateName}</h3>
                <p className="text-xs text-muted-foreground">{activeProfile.appliedPosition} • BGV Status: <strong className="text-foreground">{activeProfile.overallStatus}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => toast.info("Triggered refresh on external BGV partner webhooks")}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Re-sync Checks
                </Button>
              </div>
            </div>

            {/* Verification Checklist Items */}
            <div className="space-y-3">
              {activeProfile.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="rounded-xl border border-border bg-card/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{chk.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${statusBadgeColor[chk.status]}`}>
                        {chk.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Document: <span className="font-medium text-foreground">{chk.documentName}</span> • Partner: {chk.verifier}
                    </div>
                    <div className="text-[11px] text-muted-foreground italic">
                      "{chk.notes}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {chk.status === "Exception Flagged" && (
                      <Button
                        size="sm"
                        className="h-7 text-xs px-2.5 bg-rose-600 hover:bg-rose-700 text-white gap-1"
                        onClick={() => {
                          setManualOverrideModal(chk);
                          setOverrideNotes("");
                        }}
                      >
                        <AlertTriangle className="h-3 w-3" /> Manual Review
                      </Button>
                    )}

                    {chk.status !== "Verified" && chk.status !== "Exception Flagged" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 gap-1"
                        onClick={() => handleApproveCheck(chk.id)}
                      >
                        <Check className="h-3 w-3" /> Approve
                      </Button>
                    )}

                    {chk.status === "Verified" && (
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified on {chk.verifiedAt}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Timeline */}
            <div className="pt-3 border-t border-border">
              <h4 className="font-semibold text-xs text-muted-foreground mb-2">Verification Audit Log</h4>
              <div className="space-y-1.5">
                {activeProfile.timeline.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-3">No audit entries yet.</div>
                )}
                {activeProfile.timeline.map((t, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>• {t.title} <span className="text-[10px] text-muted-foreground/70">({t.actor})</span></span>
                    <span className="font-mono text-[10px]">{t.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-sm text-foreground">No Verification Cases</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                There are no candidates currently in the background verification pipeline. BGV cases will appear here once initiated.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Review Override Modal */}
      {manualOverrideModal && (
        <Dialog open={Boolean(manualOverrideModal)} onOpenChange={() => setManualOverrideModal(null)}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleManualOverrideSubmit}>
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                  Manual Review Exception Override
                </DialogTitle>
                <DialogDescription>
                  Resolve exception for {manualOverrideModal.name} for {activeProfile?.candidateName}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3 text-xs">
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                  <strong>Flagged Issue:</strong> {manualOverrideModal.notes}
                </div>

                <div>
                  <Label className="text-xs">Resolution Rationale & HR Auditor Notes *</Label>
                  <Textarea
                    className="mt-1 text-xs"
                    rows={4}
                    value={overrideNotes}
                    onChange={(e) => setOverrideNotes(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setManualOverrideModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Approve Exception Override
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
