import { useState } from "react";
import {
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText,
  UserCheck, Building, GraduationCap, Phone, Upload, Check, X,
  Search, Eye, AlertCircle, Sparkles, Filter
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

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

const INITIAL_BGV_DATA: CandidateVerificationProfile[] = [
  {
    candidateId: "cand-201",
    candidateName: "Siddharth Nambiar",
    appliedPosition: "Senior Full Stack Engineer",
    overallStatus: "In Progress",
    riskScore: "Low",
    checks: [
      {
        id: "chk-1",
        name: "Government ID / Passport",
        category: "Identity",
        status: "Verified",
        verifiedAt: "2026-03-12",
        verifier: "Automated OCR Verification",
        documentName: "Passport_Front_Back.pdf",
        notes: "Aadhaar & Passport match official UIDAI records 100%.",
      },
      {
        id: "chk-2",
        name: "Highest Degree Verification",
        category: "Education",
        status: "Verified",
        verifiedAt: "2026-03-13",
        verifier: "National Academic Depository (NAD)",
        documentName: "NIT_Surathkal_Degree.pdf",
        notes: "B.Tech Computer Science verified directly with university records.",
      },
      {
        id: "chk-3",
        name: "Previous Employer Experience Check",
        category: "Employment",
        status: "In Review",
        verifier: "First Advantage Partner",
        documentName: "Razorpay_Relieving_Letter.pdf",
        notes: "Tenure confirmed. Awaiting formal HR exit confirmation letter.",
      },
      {
        id: "chk-4",
        name: "Professional Reference Checks",
        category: "Reference",
        status: "Pending Document",
        verifier: "HR Operations",
        documentName: "Reference_Contact_Form.pdf",
        notes: "Candidate requested to submit 2 peer/manager references.",
      },
      {
        id: "chk-5",
        name: "Court & Criminal Record Search",
        category: "Criminal",
        status: "Verified",
        verifiedAt: "2026-03-14",
        verifier: "e-Courts National Database",
        documentName: "Court_Registry_Check.pdf",
        notes: "No litigation, criminal records, or adverse civil records found.",
      },
    ],
    timeline: [
      { date: "2026-03-11", title: "BGV Package Initiated", actor: "System" },
      { date: "2026-03-12", title: "Government Identity Verified via OCR", actor: "Automated OCR" },
      { date: "2026-03-13", title: "Education Degree Authenticated with NAD", actor: "NAD Partner" },
    ],
  },
  {
    candidateId: "cand-203",
    candidateName: "Aditya Roy",
    appliedPosition: "Lead Product Designer (UI/UX)",
    overallStatus: "Clear",
    riskScore: "Low",
    checks: [
      {
        id: "chk-11",
        name: "Government ID",
        category: "Identity",
        status: "Verified",
        verifiedAt: "2026-03-05",
        verifier: "Automated OCR Verification",
        documentName: "Aadhaar_Card.pdf",
        notes: "Biometric and demographic data verified.",
      },
      {
        id: "chk-12",
        name: "Degree Verification",
        category: "Education",
        status: "Verified",
        verifiedAt: "2026-03-06",
        verifier: "NID Academic Registry",
        documentName: "NID_BDes_Certificate.pdf",
        notes: "Degree confirmed with distinction.",
      },
      {
        id: "chk-13",
        name: "Employment History",
        category: "Employment",
        status: "Verified",
        verifiedAt: "2026-03-08",
        verifier: "Postman HR Operations",
        documentName: "Postman_Experience_Letter.pdf",
        notes: "Senior Product Designer tenure confirmed without discrepancy.",
      },
    ],
    timeline: [
      { date: "2026-03-04", title: "BGV Initiated on Offer Acceptance", actor: "HR" },
      { date: "2026-03-08", title: "All BGV checks completed with Zero Exceptions", actor: "HR Lead" },
    ],
  },
  {
    candidateId: "cand-204",
    candidateName: "Kavita Ranganathan",
    appliedPosition: "DevOps & Cloud Infrastructure Lead",
    overallStatus: "Manual Review",
    riskScore: "Medium",
    checks: [
      {
        id: "chk-21",
        name: "Employment History Discrepancy",
        category: "Employment",
        status: "Exception Flagged",
        verifier: "Manual HR Review",
        documentName: "Zoho_Service_Certificate.pdf",
        notes: "Relieving date differs by 14 days due to unencashed leave balance. Requires manual sign-off.",
      },
    ],
    timeline: [
      { date: "2026-03-12", title: "Exception raised on relieving date mismatch", actor: "Verification Analyst" },
    ],
  },
];

export function CandidateVerificationPage() {
  const [bgvList, setBgvList] = useState<CandidateVerificationProfile[]>(INITIAL_BGV_DATA);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("cand-201");
  const [manualOverrideModal, setManualOverrideModal] = useState<VerificationCheck | null>(null);
  const [overrideNotes, setOverrideNotes] = useState("");

  const activeProfile = bgvList.find((p) => p.candidateId === selectedProfileId) || bgvList[0];

  const handleApproveCheck = (checkId: string) => {
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
    if (!manualOverrideModal) return;

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
                  activeProfile.candidateId === prof.candidateId
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
          </div>
        </div>

        {/* BGV Checklist & Status Details */}
        <div className="lg:col-span-2 space-y-4">
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
                          setOverrideNotes("Discrepancy verified with HR relieving documentation. Exception approved.");
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
                {activeProfile.timeline.map((t, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>• {t.title} <span className="text-[10px] text-muted-foreground/70">({t.actor})</span></span>
                    <span className="font-mono text-[10px]">{t.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                  Resolve exception for {manualOverrideModal.name} for {activeProfile.candidateName}.
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
