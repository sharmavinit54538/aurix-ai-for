import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  BookOpen, Zap, BadgeCheck, ClipboardCheck, TrendingUp,
  Sparkles, Award, PlayCircle, Plus, Info, RefreshCw, CheckCircle2
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

export const Route = createFileRoute("/dashboard/learning")({
  head: () => ({ meta: [{ title: "Learning & Development — Aurix" }] }),
  component: LearningPage,
});

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  progress: number;
  status: "active" | "completed" | "recommended";
}

function LearningPage() {
  const ws = useAurix();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [aiCourses, setAiCourses] = useState<Course[]>([]);
  const [aiPrograms, setAiPrograms] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  // Cert Form State
  const [certTitle, setCertTitle] = useState("");
  const [certProvider, setCertProvider] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certs, setCerts] = useState<any[]>([]);

  const handleUpdateCourseProgress = (id: string, nextProgress: number) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const p = Math.min(100, Math.max(0, nextProgress));
        return { ...c, progress: p, status: p === 100 ? "completed" as const : "active" as const };
      }
      return c;
    }));
    toast.success("Course progress updated!");
  };

  const loadAIRecommendations = async () => {
    try {
      const res = await api.get<any>("../../v2/learning/recommendations");
      if (res?.success && res.data && res.data.length > 0) {
        const latest = res.data[0];
        
        const recCourses: Course[] = latest.courses.map((courseName: string, index: number) => ({
          id: `rec-c-${index}`,
          title: courseName,
          provider: "AI Recommendation",
          duration: "10-20 hours",
          progress: 0,
          status: "recommended" as const
        }));
        
        const recPrograms = latest.internal_training.map((tName: string, index: number) => ({
          name: tName,
          desc: "Mandatory corporate alignment program.",
          status: "pending"
        }));

        setAiCourses(recCourses);
        setAiPrograms(recPrograms);
      }
    } catch (err) {
      console.error("Error loading AI recommendations", err);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const payload = {
        company_id: ws.user?.companyId || "00000000-0000-0000-0000-000000000000",
        employee_id: ws.user?.id || "00000000-0000-0000-0000-000000000000",
        employee_name: ws.user?.fullName || "Employee",
        skill_gaps: ["React", "System Architecture", "Cloud Deployments"],
      };

      const res = await api.post<any>("../../v2/learning/recommend", payload);
      if (res?.success) {
        toast.success("AI Learning roadmap generated successfully!");
        await loadAIRecommendations();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate AI recommendations.");
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const loadCertifications = async () => {
    try {
      let cats = categories;
      if (cats.length === 0) {
        const catsRes = await api.get<any>("/documents/categories");
        if (catsRes?.success && catsRes.data) {
          cats = catsRes.data;
          setCategories(cats);
        }
      }

      const educationCat = cats.find(c => c.name === "Education");
      const catId = educationCat ? educationCat.id : "";

      const res = await api.get<any>(`/documents/employees?category_id=${catId}`);
      if (res?.success && res.data) {
        const mappedCerts = res.data.map((d: any) => ({
          id: d.id,
          title: d.title || d.file_name || "Certification",
          provider: d.description || "Issuing Provider",
          date: d.issue_date || (d.created_at ? d.created_at.split("T")[0] : ""),
          status: d.status === "APPROVED" ? "verified" : d.status === "REJECTED" ? "rejected" : "pending"
        }));
        setCerts(mappedCerts);
      }
    } catch (err) {
      console.error("Error loading certifications", err);
    }
  };

  useEffect(() => {
    loadCertifications();
    loadAIRecommendations();
  }, []);

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certProvider.trim()) {
      toast.error("Please fill in certification title and issuing provider.");
      return;
    }

    try {
      const formData = new FormData();
      const blob = new Blob(["mock cert certificate"], { type: "application/pdf" });
      const fileName = `${certTitle.replace(/\s+/g, "_")}.pdf`;
      formData.append("file", blob, fileName);

      const educationCat = categories.find(c => c.name === "Education");
      const catId = educationCat ? educationCat.id : "";

      formData.append("employee_id", ws.user?.id || "");
      formData.append("category_id", catId);
      formData.append("title", certTitle);
      formData.append("description", certProvider);
      formData.append("issue_date", certDate || new Date().toISOString().split("T")[0]);
      formData.append("visibility", "PRIVATE");
      formData.append("status_field", "PENDING");

      const res = await api.post<any>("/documents/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res?.success) {
        toast.success("Certification submitted for HR verification!");
        setCertTitle("");
        setCertProvider("");
        setCertDate("");
        await loadCertifications();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit certification.");
    }
  };

  const displayCourses = useMemo(() => {
    return [...courses, ...aiCourses];
  }, [courses, aiCourses]);

  const displayPrograms = useMemo(() => {
    return [...aiPrograms];
  }, [aiPrograms]);

  const stats = useMemo(() => {
    const active = displayCourses.filter(c => c.status === "active").length;
    const completed = displayCourses.filter(c => c.status === "completed").length;
    const hours = completed * 10;
    return { active, completed, hours };
  }, [displayCourses]);

  const employeeTabs = [
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "programs", label: "Training Programs", icon: Zap },
    { id: "certifications", label: "Certifications", icon: BadgeCheck },
    { id: "assessments", label: "Assessments", icon: ClipboardCheck },
    { id: "progress", label: "Learning Progress", icon: TrendingUp },
  ];

  return (
    <>
      <PageHeader
        title="Learning & Professional Development"
        description="Access training programs, upgrade your skillsets, file verified certifications, and monitor assessments."
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
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-base font-semibold">Active & Recommended Courses</h3>
                <Button 
                  onClick={handleGenerateRoadmap} 
                  disabled={generatingRoadmap}
                  size="sm"
                  className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Sparkles className="h-4 w-4" /> {generatingRoadmap ? "Generating..." : "Ask AI for Recommendations"}
                </Button>
              </div>
              
              {displayCourses.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No courses enrolled or recommended yet. Use "Ask AI for Recommendations" above to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {displayCourses.map((c) => (
                    <div key={c.id} className="border border-border bg-card/30 rounded-xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{c.title}</div>
                          <div className="text-muted-foreground mt-0.5">Provider: {c.provider} | Duration: {c.duration}</div>
                        </div>
                        <Badge variant={c.status === "completed" ? "secondary" : c.status === "active" ? "default" : "outline"} className="capitalize">
                          {c.status}
                        </Badge>
                      </div>

                      {c.status !== "recommended" && (
                        <div className="flex items-center gap-4">
                          <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleUpdateCourseProgress(c.id, c.progress - 10)}>-</Button>
                            <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleUpdateCourseProgress(c.id, c.progress + 10)}>+</Button>
                          </div>
                        </div>
                      )}

                      {c.status === "recommended" && (
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => {
                          setCourses([...courses, { ...c, status: "active", progress: 0 }]);
                          setAiCourses(aiCourses.filter(x => x.id !== c.id));
                          toast.success("Enrolled in course!");
                        }}>
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "programs" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Mandatory Corporate Training</h3>
              <div className="space-y-3">
                {displayPrograms.map((item, i) => (
                  <div key={i} className="border bg-card/30 rounded-xl p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <Badge variant={item.status === "completed" ? "secondary" : "outline"} className="capitalize">
                      {item.status}
                    </Badge>
                  </div>
                ))}
                {displayPrograms.length === 0 && (
                  <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                    No corporate training programs assigned yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="grid gap-6 md:grid-cols-2">
              <form onSubmit={handleAddCert} className="space-y-4 text-xs">
                <h3 className="text-base font-semibold border-b pb-2">Claim Professional Certification</h3>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Certification Title</Label>
                  <Input
                    required
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect Associate"
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Issuing Authority</Label>
                  <Input
                    required
                    value={certProvider}
                    onChange={(e) => setCertProvider(e.target.value)}
                    placeholder="e.g. Amazon Web Services (AWS)"
                    className="bg-background/50 border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Issue Date</Label>
                  <Input
                    type="date"
                    required
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="bg-background/50 border"
                  />
                </div>

                <Button type="submit">Submit Certificate</Button>
              </form>

              <div className="space-y-4">
                <h3 className="text-base font-semibold border-b pb-2">My Certifications</h3>
                <div className="space-y-2">
                  {certs.map((c, i) => (
                    <div key={i} className="border bg-card/30 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{c.provider} | Issued: {c.date}</div>
                      </div>
                      <Badge variant={c.status === "verified" ? "secondary" : "outline"} className="capitalize">{c.status}</Badge>
                    </div>
                  ))}
                  {certs.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground border border-dashed rounded-xl">
                      No certifications claimed yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Completed Assessments Scores</h3>
              {assessments.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-xl text-muted-foreground text-sm bg-card/20">
                  No completed assessments recorded yet.
                </div>
              ) : (
                <Card className="border overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/20">
                      <TableRow>
                        <TableHead className="pl-6 py-4">Assessment Name</TableHead>
                        <TableHead className="py-4">Date Completed</TableHead>
                        <TableHead className="py-4 text-right">Score</TableHead>
                        <TableHead className="pr-6 py-4">Result Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="pl-6 py-4 font-semibold">{item.name}</TableCell>
                          <TableCell className="py-4 text-muted-foreground">{item.date}</TableCell>
                          <TableCell className="py-4 text-right font-bold font-mono">{item.score}</TableCell>
                          <TableCell className="pr-6 py-4">
                            <Badge variant="secondary" className="capitalize">{item.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-6 max-w-md">
              <h3 className="text-base font-semibold border-b pb-2">Skills Tracker Dashboard</h3>
              <div className="space-y-4 border rounded-xl p-5 bg-background/40 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Learning hours completed:</span>
                  <span className="font-bold text-indigo-500">{stats.hours} Hours</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Completed Courses:</span>
                  <span className="font-semibold text-foreground">{stats.completed} {stats.completed === 1 ? "Course" : "Courses"}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Active Subscribed Courses:</span>
                  <span className="font-semibold text-foreground">{stats.active} {stats.active === 1 ? "Course" : "Courses"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
