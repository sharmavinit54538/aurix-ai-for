import React, { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PerformanceReview, Goal, Feedback360, Reward, TrainingCourse } from "../types";
import { GOAL_STATUS_OPTIONS, GOAL_PRIORITY_OPTIONS } from "../constants";
import {
  Mail,
  Calendar,
  Building,
  User,
  CheckCircle2,
  Clock,
  Trophy,
  Briefcase,
  MapPin,
  Plus,
  BookOpen,
  LineChart,
  Award,
  Sparkles,
  Zap,
  Target,
  FileText,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { fmtDate } from "../utils";
import { toast } from "sonner";
import { useMounted } from "@/lib/aurix-store";

interface EmployeePerformanceProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: PerformanceReview | null;
  goals: Goal[];
  feedbackList: Feedback360[];
  rewards: Reward[];
  courses: TrainingCourse[];
  onAssignGoal: (employeeId: string, title: string, description: string, priority: Goal["priority"], dueDate: string) => void;
  onCompleteGoal: (id: string) => void;
  onAssignTraining: (employeeId: string, courseName: string) => void;
  onUpdateTrainingStatus: (id: string, status: TrainingCourse["status"]) => void;
  onAddReward: (reward: Reward) => void;
}

export function EmployeePerformanceProfile({
  open,
  onOpenChange,
  review,
  goals,
  feedbackList,
  rewards,
  courses,
  onAssignGoal,
  onCompleteGoal,
  onAssignTraining,
  onUpdateTrainingStatus,
  onAddReward,
}: EmployeePerformanceProfileProps) {
  const mounted = useMounted();
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Goals Form States
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalPriority, setGoalPriority] = useState<Goal["priority"]>("medium");
  const [goalDueDate, setGoalDueDate] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Training Form States
  const [courseName, setCourseName] = useState("");
  const [isAssigningTraining, setIsAssigningTraining] = useState(false);

  // Reward Form States
  const [rewardName, setRewardName] = useState("");
  const [rewardType, setRewardType] = useState<Reward["type"]>("award");
  const [rewardValue, setRewardValue] = useState("");
  const [isAddingReward, setIsAddingReward] = useState(false);

  if (!review) return null;

  const employeeId = review.employeeId;

  // Filter lists for this employee
  const employeeGoals = goals.filter((g) => g.employeeId === employeeId);
  const employeeFeedback = feedbackList.filter((f) => f.employeeId === employeeId);
  const employeeRewards = rewards.filter((r) => r.employeeId === employeeId);
  const employeeCourses = courses.filter((c) => c.employeeId === employeeId);

  const initials = review.employeeName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const hue = Array.from(review.employeeName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  // Competency metrics mapped for Recharts Radar Diagram
  const radarData = [
    { subject: "Productivity", value: review.productivity * 20 },
    { subject: "Teamwork", value: review.teamwork * 20 },
    { subject: "Innovation", value: review.innovation * 20 },
    { subject: "Problem Solving", value: review.problemSolving * 20 },
    { subject: "Technical Skills", value: review.technicalSkills * 20 },
    { subject: "Discipline", value: review.discipline * 20 },
  ];

  // Strengths & Weaknesses auto-calculation
  const strengths = useMemo(() => {
    const list: string[] = [];
    if (review.productivity >= 4) list.push("Productivity");
    if (review.teamwork >= 4) list.push("Team Collaboration");
    if (review.innovation >= 4) list.push("Creative Innovation");
    if (review.problemSolving >= 4) list.push("Logical Problem Solving");
    if (review.technicalSkills >= 4) list.push("Technical Knowledge");
    if (review.discipline >= 4) list.push("Professional Discipline");
    if (review.communication >= 4) list.push("Clear Communications");
    if (list.length === 0) list.push("General Work Ethic");
    return list;
  }, [review]);

  const weaknesses = useMemo(() => {
    const list: string[] = [];
    if (review.productivity <= 2) list.push("Work Productivity Velocity");
    if (review.teamwork <= 2) list.push("Inter-team Collaboration");
    if (review.innovation <= 2) list.push("Independent Idea Sourcing");
    if (review.problemSolving <= 2) list.push("Structured Problem Analysis");
    if (review.technicalSkills <= 2) list.push("Specific Technical Training");
    if (review.discipline <= 2) list.push("Timely Attendance & Discipline");
    if (review.communication <= 2) list.push("Proactive Communications");
    if (list.length === 0) list.push("None Identified");
    return list;
  }, [review]);

  // Goal assignment
  const handleAssignGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !goalDueDate) {
      toast.error("Goal Title and Due Date are required");
      return;
    }
    onAssignGoal(employeeId, goalTitle.trim(), goalDesc.trim(), goalPriority, goalDueDate);
    toast.success("OKR Target Goal Assigned Successfully");
    setGoalTitle("");
    setGoalDesc("");
    setGoalPriority("medium");
    setGoalDueDate("");
    setIsAddingGoal(false);
  };

  // Training recommendation
  const handleAssignTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      toast.error("Course Name is required");
      return;
    }
    onAssignTraining(employeeId, courseName.trim());
    toast.success("Training Course Recommended Successfully");
    setCourseName("");
    setIsAssigningTraining(false);
  };

  // Reward tracking
  const handleAddRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardName.trim()) {
      toast.error("Reward Award Name is required");
      return;
    }
    const nextReward: Reward = {
      id: `r_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      awardName: rewardName.trim(),
      type: rewardType,
      value: rewardValue.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    onAddReward(nextReward);
    toast.success("Corporate Recognition Reward Logged Successfully");
    setRewardName("");
    setRewardValue("");
    setRewardType("award");
    setIsAddingReward(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-xl border-l border-border bg-card/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full z-45">
        
        {/* Drawer Header */}
        <SheetHeader className="p-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white shadow-inner text-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))`,
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-bold truncate text-foreground flex items-center gap-2">
                {review.employeeName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground truncate">{review.designation} • {review.department}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold">
                  {review.employeeIdCode}
                </Badge>
                <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium text-brand bg-brand/5 border-brand/20">
                  Manager: {review.managerName}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Tab Selection */}
        <div className="border-b border-border/60 px-6 bg-muted/10">
          <TabsList className="bg-transparent h-9 p-0 flex justify-between gap-1 w-full overflow-x-auto select-none">
            {["overview", "goals", "feedback", "development", "rewards"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`py-2 text-xs font-semibold border-b-2 cursor-pointer transition-all duration-200 capitalize flex-1 text-center truncate ${
                  activeSubTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "development" ? "L&D / Training" : tab}
              </button>
            ))}
          </TabsList>
        </div>

        {/* Scrollable details */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 pb-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeSubTab === "overview" && (
              <div className="space-y-6">
                
                {/* Competency Spider Chart */}
                <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <LineChart className="h-4 w-4 text-brand" /> Competency Profile (%)
                  </h4>
                  <div className="h-[200px] w-full">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={9} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} />
                          <Radar name="Employee" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-muted/10 rounded-2xl animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Overall performance Score Progress block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-brand" /> Overall Score
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{review.overallRating} / 5</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Rating criteria benchmarked</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-500" /> KPI Index
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{review.kpiScore}%</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Project deliveries quota</p>
                    </div>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Strengths
                    </h5>
                    <ul className="text-xs text-foreground/80 list-disc pl-4 space-y-0.5">
                      {strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-orange-500/25 bg-orange-500/5 p-4 space-y-1.5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Growth Gaps
                    </h5>
                    <ul className="text-xs text-foreground/80 list-disc pl-4 space-y-0.5">
                      {weaknesses.map((weak, idx) => (
                        <li key={idx}>{weak}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Manager Written feedback summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Assessment Summary
                  </h4>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Achievements logged</p>
                      <p className="text-xs text-foreground mt-0.5 leading-relaxed">{review.achievements || "No notes logged."}</p>
                    </div>
                    <hr className="border-border/60" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Manager continuous feedback</p>
                      <p className="text-xs text-foreground mt-0.5 leading-relaxed">{review.feedback || "No notes logged."}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: OKR GOALS */}
            {activeSubTab === "goals" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4" /> Core Goals OKRs ({employeeGoals.length})
                  </h4>
                  <Button
                    onClick={() => setIsAddingGoal(!isAddingGoal)}
                    className="h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Assign OKR
                  </Button>
                </div>

                {/* Goal Assign form */}
                {isAddingGoal && (
                  <form onSubmit={handleAssignGoalSubmit} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-xs font-bold text-foreground">Assign New Target Objective</p>
                    <div className="space-y-1.5">
                      <Label htmlFor="gTitle" className="text-[10px] uppercase font-bold">Goal Title</Label>
                      <Input id="gTitle" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="e.g. Optimize server loads" className="h-8 text-xs bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="gDesc" className="text-[10px] uppercase font-bold">Objective Description</Label>
                      <Input id="gDesc" value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} placeholder="e.g. Code split frontend routes..." className="h-8 text-xs bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold">Priority</Label>
                        <Select value={goalPriority} onValueChange={(val) => setGoalPriority(val as Goal["priority"])}>
                          <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="gDue" className="text-[10px] uppercase font-bold">Due Date</Label>
                        <Input id="gDue" type="date" value={goalDueDate} onChange={(e) => setGoalDueDate(e.target.value)} className="h-8 text-xs bg-background px-2" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingGoal(false)} className="h-7 text-[11px] rounded-lg">Cancel</Button>
                      <Button type="submit" size="sm" className="h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow">Assign Goal</Button>
                    </div>
                  </form>
                )}

                {/* Goals Progress list */}
                <div className="space-y-3">
                  {employeeGoals.length > 0 ? (
                    employeeGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{goal.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{goal.description}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 items-center flex-shrink-0">
                            <Badge variant="outline" className="text-[9px] uppercase tracking-wider px-1.5 py-0 font-bold border-border/80">
                              {goal.priority} Priority
                            </Badge>
                            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-1.5 py-0 font-semibold bg-muted text-foreground">
                              {goal.status.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>

                        {/* Progress slider bar */}
                        <div className="flex items-center gap-3">
                          <Progress value={goal.progress} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-bold text-foreground font-mono">{goal.progress}%</span>
                        </div>

                        {/* Objective complete actions */}
                        {goal.status !== "completed" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onCompleteGoal(goal.id);
                                toast.success("OKR Target objective completed!");
                              }}
                              className="h-6 text-[10px] rounded-md border-border bg-card hover:bg-muted text-foreground gap-1 font-semibold cursor-pointer"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              Mark Complete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl">
                      No target goals configured for Jordan Lee.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: 360 FEEDBACK */}
            {activeSubTab === "feedback" && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> 360° Peer & Manager reviews ({employeeFeedback.length})
                </h4>

                <div className="space-y-4">
                  {employeeFeedback.length > 0 ? (
                    employeeFeedback.map((fb) => (
                      <div key={fb.id} className="p-4 rounded-xl border border-border bg-card/50 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-[9px] text-brand-foreground font-bold font-mono">
                              {fb.reviewerName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-foreground">{fb.reviewerName}</p>
                              <p className="text-[9px] text-muted-foreground font-semibold uppercase">{fb.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-bold border-brand/20 text-brand bg-brand/5">
                            {fb.rating} ★ Rating
                          </Badge>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed italic">
                          "{fb.feedbackText}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl">
                      No peer feedback collected recently.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: L&D / TRAINING */}
            {activeSubTab === "development" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Recommended Training & Courses ({employeeCourses.length})
                  </h4>
                  <Button
                    onClick={() => setIsAssigningTraining(!isAssigningTraining)}
                    className="h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Recommend Course
                  </Button>
                </div>

                {/* Course recommend form */}
                {isAssigningTraining && (
                  <form onSubmit={handleAssignTrainingSubmit} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-xs font-bold text-foreground">Recommend L&D Course</p>
                    <div className="space-y-1.5">
                      <Label htmlFor="cName" className="text-[10px] uppercase font-bold">Course Title</Label>
                      <Input id="cName" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. React Server Components Design" className="h-8 text-xs bg-background" />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setIsAssigningTraining(false)} className="h-7 text-[11px] rounded-lg">Cancel</Button>
                      <Button type="submit" size="sm" className="h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow">Recommend</Button>
                    </div>
                  </form>
                )}

                {/* Course lists */}
                <div className="space-y-2.5">
                  {employeeCourses.length > 0 ? (
                    employeeCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/10"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{course.courseName}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            Assigned on {fmtDate(course.assignedDate)}
                            {course.completionDate && ` • Completed ${fmtDate(course.completionDate)}`}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {course.status !== "completed" ? (
                            <>
                              <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-amber-500/5 text-amber-500 border-amber-500/10">
                                Pending
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => {
                                  onUpdateTrainingStatus(course.id, "completed");
                                  toast.success("Course completion logged!");
                                }}
                                className="h-6 text-[9px] rounded-md bg-emerald-500 text-white hover:bg-emerald-600 px-2 cursor-pointer font-semibold"
                              >
                                Mark Done
                              </Button>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                              ✓ Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl">
                      No training courses recommended yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: REWARDS */}
            {activeSubTab === "rewards" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Trophy className="h-4 w-4" /> Recognition, Awards & Bonuses ({employeeRewards.length})
                  </h4>
                  <Button
                    onClick={() => setIsAddingReward(!isAddingReward)}
                    className="h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Log Recognition
                  </Button>
                </div>

                {/* Reward Logger Form */}
                {isAddingReward && (
                  <form onSubmit={handleAddRewardSubmit} className="rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-xs font-bold text-foreground">Log Reward & Award</p>
                    <div className="space-y-1.5">
                      <Label htmlFor="rName" className="text-[10px] uppercase font-bold">Award Title</Label>
                      <Input id="rName" value={rewardName} onChange={(e) => setRewardName(e.target.value)} placeholder="e.g. Employee of the Quarter" className="h-8 text-xs bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold">Award Type</Label>
                        <Select value={rewardType} onValueChange={(val) => setRewardType(val as Reward["type"])}>
                          <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee_of_month">Employee of the Month</SelectItem>
                            <SelectItem value="award">Special Award</SelectItem>
                            <SelectItem value="achievement">Corporate Achievement</SelectItem>
                            <SelectItem value="certificate">Certification Value</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rValue" className="text-[10px] uppercase font-bold">Incentive / Value</Label>
                        <Input id="rValue" value={rewardValue} onChange={(e) => setRewardValue(e.target.value)} placeholder="e.g. $1,000 Bonus" className="h-8 text-xs bg-background" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingReward(false)} className="h-7 text-[11px] rounded-lg">Cancel</Button>
                      <Button type="submit" size="sm" className="h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow">Log Reward</Button>
                    </div>
                  </form>
                )}

                {/* Rewards / Recognitions list */}
                <div className="space-y-2.5">
                  {employeeRewards.length > 0 ? (
                    employeeRewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                            <Award className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{reward.awardName}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-semibold">{reward.type.replace(/_/g, " ")}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-brand font-mono">{reward.value || "Citation"}</p>
                          <p className="text-[9px] text-muted-foreground">{fmtDate(reward.date)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl">
                      No corporate recognitions awarded to Jordan Lee yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
