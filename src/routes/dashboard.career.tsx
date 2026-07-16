import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Briefcase, Gift, TrendingUp, Award,
  Sparkles, Plus, Info, RefreshCw, CheckCircle2, UserPlus
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { api } from "@/api";

export const Route = createFileRoute("/dashboard/career")({
  head: () => ({ meta: [{ title: "Career & Referrals — Aurix" }] }),
  component: CareerPage,
});

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  minExperience: string;
}

function CareerPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("openings");
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Referral states
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateRole, setCandidateRole] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);

  // AI career predictions
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [predictingCareer, setPredictingCareer] = useState(false);
  const [promotionHistory, setPromotionHistory] = useState<any[]>([]);

  const loadOpenings = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get<any>("/public/careers/jobs");
      if (res?.success && res.data) {
        // Handle paginated data response or plain array
        const list = Array.isArray(res.data) ? res.data : (res.data.items || []);
        const mapped = list.map((job: any) => ({
          id: String(job.id),
          title: job.title,
          department: job.department,
          location: job.location,
          minExperience: job.experience_required || `${job.min_experience}+ years`,
        }));
        setJobs(mapped);
        if (mapped.length > 0) {
          setCandidateRole(mapped[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadCareerPaths = async () => {
    try {
      const res = await api.get<any>("../../v2/career-path/predictions");
      if (res?.success && res.data) {
        setCareerPaths(res.data);
      }
    } catch (err) {
      console.error("Error loading career paths", err);
    }
  };

  useEffect(() => {
    loadOpenings();
    loadCareerPaths();
  }, []);

  const handleApplyInternal = (jobTitle: string) => {
    toast.success(`Successfully submitted internal application for: ${jobTitle}`);
  };

  const handleReferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast.error("Please fill in candidate details.");
      return;
    }
    const roleName = jobs.find(j => j.id === candidateRole)?.title || "Software Engineer";
    setReferrals([
      ...referrals,
      { name: candidateName, email: candidateEmail, role: roleName, status: "submitted" }
    ]);
    toast.success("Candidate referred successfully! HR will review shortly.");
    setCandidateName("");
    setCandidateEmail("");
  };

  const handlePredictCareer = async () => {
    setPredictingCareer(true);
    try {
      const payload = {
        company_id: ws.user?.companyId || "00000000-0000-0000-0000-000000000000",
        employee_id: ws.user?.id || "00000000-0000-0000-0000-000000000000",
        employee_profile: {
          skills: ["React", "TypeScript", "Node.js"],
          experience_years: 5,
          current_designation: ws.user?.role || "Software Engineer",
          performance_rating: 4.5
        }
      };

      const res = await api.post<any>("../../v2/career-path/predict", payload);
      if (res?.success) {
        toast.success("AI Career path predicted successfully!");
        await loadCareerPaths();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to predict career path with AI.");
    } finally {
      setPredictingCareer(false);
    }
  };

  const employeeTabs = [
    { id: "openings", label: "Internal Openings", icon: Briefcase },
    { id: "referrals", label: "Referral Program", icon: Gift },
    { id: "growth", label: "Career Growth", icon: TrendingUp },
    { id: "promotions", label: "Promotion History", icon: Award },
  ];

  return (
    <>
      <PageHeader
        title="Career Hub & Referrals"
        description="Explore active internal opportunities, refer top talents to open roles, and track your promotion history."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {employeeTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {activeTab === "openings" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">Internal Job Opportunities</h3>
              {loadingJobs ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Loading jobs...
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No internal job opportunities listed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-border bg-card/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs hover:bg-muted/5 transition-all">
                      <div>
                        <div className="font-semibold text-sm">{job.title}</div>
                        <div className="text-muted-foreground mt-0.5">{job.department} | {job.location}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Required Experience: {job.minExperience}</div>
                      </div>
                      <Button size="sm" onClick={() => handleApplyInternal(job.title)}>Apply Internally</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "referrals" && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handleReferSubmit} className="space-y-4 text-xs">
                <h3 className="text-base font-semibold border-b pb-2">Refer a Candidate</h3>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Candidate Full Name</Label>
                  <Input
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Candidate Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Target Job Role</Label>
                  <select
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground bg-background/50"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id} className="bg-background text-foreground">{j.title}</option>
                    ))}
                    {jobs.length === 0 && (
                      <option value="">No roles available</option>
                    )}
                  </select>
                </div>

                <Button type="submit">Submit Referral</Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">Submitted Referrals Log</h3>
                <div className="space-y-2">
                  {referrals.map((ref, i) => (
                    <div key={i} className="border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold">{ref.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{ref.role} | {ref.email}</div>
                      </div>
                      <Badge variant={ref.status === "interviewing" ? "secondary" : "outline"} className="capitalize">{ref.status}</Badge>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground border border-dashed rounded-xl">
                      No referrals submitted yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "growth" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-base font-semibold">AI Career Path Generator</h3>
                <Button 
                  onClick={handlePredictCareer} 
                  disabled={predictingCareer}
                  size="sm"
                  className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Sparkles className="h-4 w-4" /> {predictingCareer ? "Generating..." : "Generate AI Career Path"}
                </Button>
              </div>

              {careerPaths.length > 0 ? (
                <div className="space-y-4">
                  {careerPaths.map((cp, idx) => (
                    <div key={idx} className="border bg-card/30 rounded-xl p-5 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-foreground">Predicted Next Role: {cp.predicted_next_role}</span>
                        <Badge variant="secondary">Timeline: {cp.promotion_timeline_months} Months</Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{cp.career_growth_narrative}</p>
                      <div className="text-[10px] text-muted-foreground border-t pt-2">
                        Predicted on: {cp.created_at.split("T")[0]}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No career path predicted yet. Click "Generate AI Career Path" to predict your growth narrative!
                </div>
              )}
            </div>
          )}

          {activeTab === "promotions" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Promotion & Career Timeline</h3>
              {promotionHistory.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No promotion or career timeline recorded yet.
                </div>
              ) : (
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Designation Level</TableHead>
                        <TableHead className="py-4">Effective Date</TableHead>
                        <TableHead className="pr-6 py-4 text-right">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotionHistory.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="pl-6 py-4 font-semibold">{item.title}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{item.date}</TableCell>
                          <TableCell className="pr-6 py-4 text-right">{item.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
