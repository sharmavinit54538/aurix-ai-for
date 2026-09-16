import { useState, useMemo } from "react";
import {
  FileText, DollarSign, CheckCircle2, Clock, XCircle, Send,
  Download, Sparkles, TrendingUp, UserCheck, ShieldCheck,
  ChevronRight, Edit3, RefreshCw, Eye
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import type { Offer } from "../types";

export function CompensationOfferBuilderPage() {
  const { candidates, jobs, offers, upsertOffer } = useRecruitment();
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || "cand-201");
  const [showOfferPreview, setShowOfferPreview] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Compensation Structure State
  const [baseSalary, setBaseSalary] = useState(2400000);
  const [variableBonus, setVariableBonus] = useState(400000);
  const [esopGrant, setEsopGrant] = useState(300000);
  const [joiningBonus, setJoiningBonus] = useState(200000);
  const [targetJoiningDate, setTargetJoiningDate] = useState("2026-04-15");

  // Negotiation history state
  const [negotiationLog, setNegotiationLog] = useState<{ round: string; date: string; amount: string; note: string }[]>([
    { round: "Initial HR Screen", date: "2026-03-08", amount: "₹24 LPA", note: "Candidate communicated current CTC ₹20L, expecting ₹26L+" },
    { round: "Revised Proposal", date: "2026-03-14", amount: "₹28 LPA Total CTC", note: "Added ₹2L sign-on bonus for immediate 30-day joiner." },
  ]);
  const [revisionNote, setRevisionNote] = useState("");

  const candidate =
    candidates.find((c) => c.id === selectedCandidateId) ||
    candidates[0] || {
      id: "cand-201",
      name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      appliedPosition: "Senior Full Stack Engineer",
      currentCompany: "Fintech Corp",
      expectedSalary: 2600000,
      jobId: "job-101",
      stage: "offer",
      applicationId: "app-201",
    };
  const job =
    jobs.find((j) => j.id === candidate?.jobId) ||
    jobs[0] || {
      id: "job-101",
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      salaryMax: 3200000,
    };

  const totalCtc = baseSalary + variableBonus + esopGrant + joiningBonus;
  const candidateExpected = candidate?.expectedSalary || 2600000;
  const budgetMax = job?.salaryMax || 3200000;

  // Breakdown Calculations
  const basic = Math.round(baseSalary * 0.5);
  const hra = Math.round(baseSalary * 0.25);
  const specialAllowance = baseSalary - basic - hra;

  const handleCreateOrUpdateOffer = () => {
    const newOff: Offer = {
      id: `off-${Date.now()}`,
      applicationId: candidate.applicationId || "app-new",
      candidateId: candidate.id,
      candidateName: candidate.name,
      jobId: job.id,
      jobTitle: candidate.appliedPosition || job.title,
      salary: totalCtc,
      currency: "INR",
      joiningDate: targetJoiningDate,
      benefits: [
        `Base Salary: ₹${(baseSalary / 100000).toFixed(1)} LPA`,
        `Annual Performance Bonus: ₹${(variableBonus / 100000).toFixed(1)} LPA`,
        `ESOP Equity Value: ₹${(esopGrant / 100000).toFixed(1)} LPA`,
        `One-time Joining Bonus: ₹${(joiningBonus / 100000).toFixed(1)} Lakhs`,
        "Family Health Insurance (₹10 Lakh sum insured)",
      ],
      status: "pending-approval",
      sentAt: new Date().toISOString(),
      approvals: [
        { stage: "Hiring Manager Sign-off", by: "Arun Verma", at: new Date().toISOString(), status: "approved" },
        { stage: "Finance / CFO Approval", by: "Kunal Gupta (CFO)", at: new Date().toISOString(), status: "pending" },
      ],
    };

    upsertOffer(newOff);
    toast.success(`Formal Compensation Package for ${candidate.name} submitted for CFO Approval!`);
    setShowOfferPreview(true);
  };

  const handleReviseOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote.trim()) return;

    setNegotiationLog([
      {
        round: `Revision ${negotiationLog.length + 1}`,
        date: new Date().toISOString().split("T")[0],
        amount: `₹${(totalCtc / 100000).toFixed(1)} LPA`,
        note: revisionNote,
      },
      ...negotiationLog,
    ]);
    toast.success("Offer parameters revised and logged in audit history.");
    setShowRevisionModal(false);
    setRevisionNote("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compensation Proposal & Offer Letter Management"
        description="Structure fixed and variable components, benchmark against candidate expectations, run multi-tier approval workflows, and generate binding offer letters."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRevisionModal(true)}
              className="gap-1.5"
            >
              <Edit3 className="h-4 w-4" /> Revise Offer Terms
            </Button>
            <Button
              onClick={handleCreateOrUpdateOffer}
              className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
            >
              <Send className="h-4 w-4" /> Submit for Approval
            </Button>
          </div>
        }
      />

      {/* Target Candidate & Benchmark Comparison Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Candidate & Job Context */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Candidate for Offer Structuring</Label>
            <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
              <SelectTrigger className="mt-1 h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — {c.appliedPosition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border bg-background/50 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Role:</span>
              <span className="font-semibold text-foreground">{candidate.appliedPosition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Company:</span>
              <span className="font-medium text-foreground">{candidate.currentCompany || "Fintech Corp"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Candidate Expectation:</span>
              <span className="font-bold text-foreground">₹{(candidateExpected / 100000).toFixed(1)} LPA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approved Job Band Max:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{(budgetMax / 100000).toFixed(1)} LPA</span>
            </div>
          </div>

          {/* Budget Health Indicator */}
          <div className="rounded-xl bg-muted/40 p-3 space-y-1.5 border border-border/80 text-xs">
            <div className="flex justify-between font-semibold">
              <span>Budget Consumption</span>
              <span className={totalCtc <= budgetMax ? "text-emerald-500" : "text-rose-500"}>
                {Math.round((totalCtc / budgetMax) * 100)}% of Max
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${totalCtc <= budgetMax ? "bg-emerald-500" : "bg-rose-500"}`}
                style={{ width: `${Math.min(100, Math.round((totalCtc / budgetMax) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              {totalCtc <= budgetMax
                ? `✓ Proposed package is ₹${((budgetMax - totalCtc) / 100000).toFixed(1)}L below upper cap.`
                : `⚠ Exceeds department budget allocation by ₹${((totalCtc - budgetMax) / 100000).toFixed(1)}L.`}
            </p>
          </div>
        </div>

        {/* Salary Structuring Sliders & Components */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-base text-foreground">Annual CTC Breakdown: ₹{(totalCtc / 100000).toFixed(2)} LPA</h3>
              <p className="text-xs text-muted-foreground">Dynamically calculate fixed basic, HRA, performance bonus, and stock options.</p>
            </div>
            <Badge variant="secondary" className="text-xs font-bold font-mono">
              ₹{Math.round(totalCtc / 12).toLocaleString()}/month gross
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Fixed Base Salary (INR)</span>
                <span className="font-mono font-bold">₹{(baseSalary / 100000).toFixed(1)} LPA</span>
              </div>
              <Slider
                value={[baseSalary]}
                min={1000000}
                max={4000000}
                step={50000}
                onValueChange={(v) => setBaseSalary(v[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Annual Variable Performance Bonus</span>
                <span className="font-mono font-bold">₹{(variableBonus / 100000).toFixed(1)} LPA</span>
              </div>
              <Slider
                value={[variableBonus]}
                min={0}
                max={1500000}
                step={25000}
                onValueChange={(v) => setVariableBonus(v[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Annualized ESOP Equity Grant</span>
                <span className="font-mono font-bold">₹{(esopGrant / 100000).toFixed(1)} LPA</span>
              </div>
              <Slider
                value={[esopGrant]}
                min={0}
                max={2000000}
                step={50000}
                onValueChange={(v) => setEsopGrant(v[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">One-Time Joining Bonus</span>
                <span className="font-mono font-bold">₹{(joiningBonus / 100000).toFixed(1)} Lakhs</span>
              </div>
              <Slider
                value={[joiningBonus]}
                min={0}
                max={1000000}
                step={25000}
                onValueChange={(v) => setJoiningBonus(v[0])}
              />
            </div>
          </div>

          {/* Salary Structure Details */}
          <div className="grid grid-cols-3 gap-2 bg-muted/30 p-3 rounded-xl text-center text-xs">
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Basic (50%)</div>
              <div className="font-bold text-sm text-foreground">₹{(basic / 100000).toFixed(2)}L</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">HRA (25%)</div>
              <div className="font-bold text-sm text-foreground">₹{(hra / 100000).toFixed(2)}L</div>
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] uppercase">Special Allowance</div>
              <div className="font-bold text-sm text-foreground">₹{(specialAllowance / 100000).toFixed(2)}L</div>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation History & Approval Flow */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            Offer Negotiation & Audit Trail
          </h4>
          <div className="space-y-2 text-xs">
            {negotiationLog.map((n, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-card/40 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>{n.round}</span>
                  <span className="font-mono text-indigo-500">{n.amount}</span>
                </div>
                <div className="text-muted-foreground">{n.note}</div>
                <div className="text-[10px] text-muted-foreground/70">{n.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Chain */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Executive Approval Chain
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground">1. Hiring Manager Sign-off</div>
                <div className="text-[11px] text-muted-foreground">Arun Verma (Director of Engineering)</div>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card/40 flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground">2. Financial Review & Cap Check</div>
                <div className="text-[11px] text-muted-foreground">Kunal Gupta (CFO)</div>
              </div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending Sign-off</Badge>
            </div>

            <div className="p-3 rounded-xl border border-border bg-card/40 flex items-center justify-between">
              <div>
                <div className="font-bold text-foreground">3. Final Offer Release to Candidate</div>
                <div className="text-[11px] text-muted-foreground">Meera Nair (VP People)</div>
              </div>
              <Badge variant="outline">Queued</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Offer Letter Preview Modal */}
      <Dialog open={showOfferPreview} onOpenChange={setShowOfferPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Formal Offer Letter Preview
            </DialogTitle>
            <DialogDescription>
              Binding employment agreement for {candidate.name}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[450px] overflow-y-auto p-6 rounded-xl border border-border bg-zinc-950 text-zinc-100 font-serif text-xs leading-relaxed space-y-4 shadow-inner">
            <div className="text-center border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold font-sans tracking-wide uppercase">OFC360 Technologies Private Limited</h2>
              <div className="text-[10px] text-zinc-400 font-sans">CIN: U72200KA2026PTC109876 • Bengaluru, India</div>
            </div>

            <div className="text-[11px] font-sans">
              <strong>Date:</strong> {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}<br />
              <strong>To:</strong> {candidate.name}<br />
              <strong>Address:</strong> {candidate.location}
            </div>

            <p>
              Dear <strong>{candidate.name}</strong>,
            </p>

            <p>
              On behalf of OFC360 Technologies, we are delighted to offer you full-time employment as <strong>{candidate.appliedPosition}</strong> reporting to the Director of Engineering.
            </p>

            <div className="p-3 rounded border border-zinc-800 bg-zinc-900/60 font-sans space-y-1">
              <div className="font-bold text-xs">Summary of Compensation Terms:</div>
              <div>• Total Annual Cost to Company (CTC): <strong>₹{(totalCtc / 100000).toFixed(2)} LPA</strong></div>
              <div>• Fixed Base Salary: ₹{(baseSalary / 100000).toFixed(2)} LPA</div>
              <div>• Annual Performance Incentive: ₹{(variableBonus / 100000).toFixed(2)} LPA</div>
              <div>• ESOP Stock Value: ₹{(esopGrant / 100000).toFixed(2)} LPA (4-year vesting schedule)</div>
              <div>• Target Joining Date: <strong>{targetJoiningDate}</strong></div>
            </div>

            <p>
              This offer is contingent upon successful verification of your academic credentials and prior employment references.
            </p>

            <div className="pt-4 border-t border-zinc-800 flex justify-between font-sans text-[11px]">
              <div>
                <div className="text-zinc-400">Authorized Signatory:</div>
                <div className="font-bold mt-2">Meera Nair</div>
                <div className="text-zinc-500 text-[10px]">VP People, OFC360</div>
              </div>
              <div className="text-right">
                <div className="text-zinc-400">Accepted & Signed:</div>
                <div className="text-emerald-400 font-mono text-[10px] mt-2">Digital Signature Pending</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferPreview(false)}>
              Close
            </Button>
            <Button
              className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
              onClick={() => {
                toast.success("Offer Letter downloaded as PDF!");
                setShowOfferPreview(false);
              }}
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revision Modal */}
      <Dialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleReviseOffer}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Log Compensation Revision</DialogTitle>
              <DialogDescription>
                Record negotiation notes or adjusted salary parameters for audit.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-xs">Revision Reason / Counter-Offer Notes *</Label>
                <Textarea
                  className="mt-1 text-xs"
                  rows={4}
                  placeholder="e.g. Candidate countered with competing offer from Razorpay. Agreed to match base salary."
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRevisionModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Revision</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
