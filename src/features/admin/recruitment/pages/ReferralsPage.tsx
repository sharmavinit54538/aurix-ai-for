import { Link } from "@tanstack/react-router";

import { useEffect, useState, useMemo } from "react";
import { Award, Gift, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiInstance } from "@/api";

const COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)"];

export function ReferralsPage() {
  const [referralList, setReferralList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidates and jobs from recruitment store
  const candidates = useRecruitment((s) => s.candidates);
  const jobs = useRecruitment((s) => s.jobs);

  // Form states
  const [showReferModal, setShowReferModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [referForm, setReferForm] = useState({
    candidateId: "",
    employeeId: "",
    jobId: "",
    bonus: "3000",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [refRes, empRes] = await Promise.all([
          apiInstance.get("/referrals?limit=100"),
          apiInstance.get("/employees?limit=200"),
        ]);
        setReferralList(refRes.data?.data?.items || []);
        setEmployees(empRes.data?.data?.items || []);
      } catch (err) {
        toast.error("Failed to load employee referrals.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Resolve DB IDs to names, stages, dates dynamically
  const resolvedReferrals = useMemo(() => {
    return referralList.map((r) => {
      const cand = candidates.find((c) => c.id === r.candidate_id);
      const job = jobs.find((j) => j.id === r.job_id);
      const emp = employees.find((e) => String(e.id) === String(r.employee_id));

      return {
        id: r.id,
        candidateId: r.candidate_id,
        candidateName: cand ? cand.name : "Candidate",
        jobTitle: job ? job.title : "Requisition",
        referrerName: emp ? `${emp.first_name || ""} ${emp.last_name || ""}`.trim() : "Referrer",
        department: emp ? emp.department || "General" : "General",
        stage: (r.status || "submitted").toLowerCase(),
        bonus: Number(r.reward_amount || 0),
        rewardStatus: r.reward_status || "pending",
        submittedAt: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "",
      };
    });
  }, [referralList, candidates, jobs, employees]);

  const totalBonus = useMemo(() => resolvedReferrals.filter((r) => r.stage === "hired").reduce((a, r) => a + r.bonus, 0), [resolvedReferrals]);
  const conversion = useMemo(() => resolvedReferrals.length ? Math.round((resolvedReferrals.filter((r) => r.stage === "hired").length / resolvedReferrals.length) * 100) : 0, [resolvedReferrals]);

  const byDept = useMemo(() => {
    const map = resolvedReferrals.reduce<Record<string, number>>((a, r) => ({ ...a, [r.department]: (a[r.department] || 0) + 1 }), {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [resolvedReferrals]);

  const leaderboard = useMemo(() => {
    const map = resolvedReferrals.reduce<Record<string, { count: number; hired: number }>>((a, r) => {
      const k = r.referrerName;
      a[k] = a[k] || { count: 0, hired: 0 };
      a[k].count += 1;
      if (r.stage === "hired") a[k].hired += 1;
      return a;
    }, {});
    return Object.entries(map).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.hired - a.hired || b.count - a.count);
  }, [resolvedReferrals]);

  const handleUpdateStatus = async (id: string, newStage: string) => {
    try {
      const rewardStatus = newStage === "hired" ? "approved" : "pending";
      await apiInstance.put(`/referrals/${id}/status`, {
        status: newStage.toUpperCase(),
        reward_status: rewardStatus.toUpperCase(),
      });
      toast.success("Referral status updated successfully!");
      
      // Reload referrals list
      const response = await apiInstance.get("/referrals?limit=100");
      setReferralList(response.data?.data?.items || []);
    } catch (err) {
      toast.error("Failed to update referral status.");
    }
  };

  const handleReferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referForm.candidateId || !referForm.employeeId) {
      toast.error("Candidate and Referrer Employee are required.");
      return;
    }

    setSubmitting(true);
    try {
      await apiInstance.post("/referrals", {
        candidate_id: referForm.candidateId,
        employee_id: referForm.employeeId,
        job_id: referForm.jobId || null,
        reward_amount: Number(referForm.bonus) || 0,
      });

      toast.success("Referral submitted successfully!");
      setShowReferModal(false);
      setReferForm({
        candidateId: "",
        employeeId: "",
        jobId: "",
        bonus: "3000",
      });
      
      // Reload referrals list
      const response = await apiInstance.get("/referrals?limit=100");
      setReferralList(response.data?.data?.items || []);
    } catch (err) {
      toast.error("Failed to submit referral. Make sure the candidate is not already referred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Employee Referrals"
        description="Track referrals, payouts and the people growing your team."
        actions={<Button onClick={() => setShowReferModal(true)}><Gift className="mr-2 h-4 w-4" />Refer Someone</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Referrals", value: resolvedReferrals.length, icon: Users },
          { label: "Hired", value: resolvedReferrals.filter((r) => r.stage === "hired").length, icon: Award },
          { label: "Conversion", value: `${conversion}%`, icon: TrendingUp },
          { label: "Bonuses Paid", value: `$${totalBonus.toLocaleString()}`, icon: Gift },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-foreground">{k.value}</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60"><Icon className="h-4 w-4" /></div>
              </div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading employee referrals database...</div>
      ) : resolvedReferrals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40 mt-4">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Users className="h-5 w-5" />
          </div>
          <p className="font-medium text-foreground">No referrals recorded yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Submit candidate referrals to start tracking reward payouts.
          </p>
          <Button onClick={() => setShowReferModal(true)} className="mt-4">
            <Gift className="mr-2 h-4 w-4" /> Refer Someone
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
              <div className="mb-2 text-sm font-semibold text-foreground">Referrers Leaderboard</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={leaderboard} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                  <XAxis dataKey="name" className="text-[10px] text-muted-foreground" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="count" fill={COLORS[0]} name="Total Referred" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="hired" fill={COLORS[2]} name="Successfully Hired" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="mb-2 text-sm font-semibold text-foreground">Referrals by Department</div>
              {byDept.length === 0 ? (
                <div className="grid place-items-center h-[260px] text-xs text-muted-foreground">No department data.</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={byDept} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3}>
                      {byDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <table className="w-full text-sm">
              <thead className="bg-accent/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Candidate</th><th className="p-3">Role</th><th className="p-3">Referrer</th>
                  <th className="p-3">Stage / Status</th><th className="p-3">Bonus</th><th className="p-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {resolvedReferrals.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-accent/10 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <CandidateAvatar name={r.candidateName} size={28} />
                        <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: r.candidateId }} className="hover:underline font-medium text-foreground">
                          {r.candidateName}
                        </Link>
                      </div>
                    </td>
                    <td className="p-3 text-foreground">{r.jobTitle}</td>
                    <td className="p-3 text-muted-foreground">{r.referrerName}</td>
                    <td className="p-3">
                      <select
                        value={r.stage}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                        className="bg-background text-xs outline-none cursor-pointer border border-border rounded px-2 py-1 text-foreground"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-3 text-foreground">
                      {r.bonus ? `$${r.bonus.toLocaleString()}` : <Badge variant="secondary">—</Badge>}
                      {r.stage === "hired" && <span className="text-[10px] ml-1 text-emerald-500 font-semibold block capitalize">({r.rewardStatus})</span>}
                    </td>
                    <td className="p-3 text-muted-foreground">{r.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Refer Someone Dialog Modal */}
      <Dialog open={showReferModal} onOpenChange={setShowReferModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Employee Referral</DialogTitle>
            <DialogDescription>Refer a candidate for a position and track their application progress.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReferSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ref-cand">Candidate *</Label>
              <select
                id="ref-cand"
                value={referForm.candidateId}
                onChange={(e) => setReferForm({ ...referForm, candidateId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">-- Select Candidate --</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ref-emp">Referrer Employee *</Label>
              <select
                id="ref-emp"
                value={referForm.employeeId}
                onChange={(e) => setReferForm({ ...referForm, employeeId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">-- Select Referrer --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name} ({e.department || "General"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ref-job">Associated Requisition</Label>
              <select
                id="ref-job"
                value={referForm.jobId}
                onChange={(e) => setReferForm({ ...referForm, jobId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">-- None / General Pool --</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ref-bonus">Bonus Reward Amount (USD) *</Label>
              <Input
                id="ref-bonus"
                type="number"
                min="0"
                value={referForm.bonus}
                onChange={(e) => setReferForm({ ...referForm, bonus: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowReferModal(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting Referral..." : "Submit Referral"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

