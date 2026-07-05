import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PerformanceReview, ReviewStatus, PromotionStatus } from "../types";
import { REVIEW_STATUS_OPTIONS, PROMOTION_STATUS_OPTIONS } from "../constants";
import { validatePerformanceReviewForm } from "../utils";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

interface PerformanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: PerformanceReview | null; // null for add, Review for edit
  existingReviews: PerformanceReview[];
  onSave: (review: PerformanceReview) => void;
}

export function PerformanceFormDialog({
  open,
  onOpenChange,
  review,
  existingReviews,
  onSave,
}: PerformanceFormDialogProps) {
  const ws = useAurix();
  const isEdit = !!review;

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeIdCode, setEmployeeIdCode] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [managerName, setManagerName] = useState("");

  // Ratings (1-5)
  const [overallRating, setOverallRating] = useState("3");
  const [kpiScore, setKpiScore] = useState("80");
  const [productivity, setProductivity] = useState("3");
  const [attendance, setAttendance] = useState("3");
  const [communication, setCommunication] = useState("3");
  const [leadership, setLeadership] = useState("3");
  const [teamwork, setTeamwork] = useState("3");
  const [innovation, setInnovation] = useState("3");
  const [problemSolving, setProblemSolving] = useState("3");
  const [technicalSkills, setTechnicalSkills] = useState("3");
  const [discipline, setDiscipline] = useState("3");

  // OKRs / Goals
  const [goalProgress, setGoalProgress] = useState("50");
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [feedback, setFeedback] = useState("");
  const [managerComments, setManagerComments] = useState("");

  // Promotion
  const [promotionEligible, setPromotionEligible] = useState(false);
  const [promotionStatus, setPromotionStatus] = useState<PromotionStatus>("not_recommended");
  const [salaryIncrement, setSalaryIncrement] = useState("");
  const [bonusRecommendation, setBonusRecommendation] = useState("");

  // Audit
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("draft");
  const [reviewDate, setReviewDate] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-populate when employee selection changes
  const handleEmployeeChange = (empId: string) => {
    setEmployeeId(empId);
    const emp = ws.employees.find((e) => e.id === empId);
    if (emp) {
      setEmployeeName(emp.fullName);
      setEmployeeIdCode(emp.employeeId || emp.id);
      setDepartment(emp.department || "Engineering");
      setDesignation(emp.designation || "Software Developer");
      setManagerName(emp.managerName || "Rohan Mehta");
    }
  };

  // Load Review values on edit / reset on add
  useEffect(() => {
    if (open) {
      setErrors({});
      if (review) {
        setEmployeeId(review.employeeId);
        setEmployeeName(review.employeeName);
        setEmployeeIdCode(review.employeeIdCode);
        setDepartment(review.department);
        setDesignation(review.designation);
        setManagerName(review.managerName);

        setOverallRating(String(review.overallRating));
        setKpiScore(String(review.kpiScore));
        setProductivity(String(review.productivity));
        setAttendance(String(review.attendance));
        setCommunication(String(review.communication));
        setLeadership(String(review.leadership));
        setTeamwork(String(review.teamwork));
        setInnovation(String(review.innovation));
        setProblemSolving(String(review.problemSolving));
        setTechnicalSkills(String(review.technicalSkills));
        setDiscipline(String(review.discipline));

        setGoalProgress(String(review.goalProgress));
        setAchievements(review.achievements);
        setChallenges(review.challenges);
        setFeedback(review.feedback);
        setManagerComments(review.managerComments);

        setPromotionEligible(review.promotionEligible);
        setPromotionStatus(review.promotionStatus);
        setSalaryIncrement(String(review.salaryIncrement));
        setBonusRecommendation(String(review.bonusRecommendation));

        setReviewStatus(review.reviewStatus);
        setReviewDate(review.reviewDate);
      } else {
        // Find first employee as default selection if any
        if (ws.employees.length > 0) {
          handleEmployeeChange(ws.employees[0].id);
        } else {
          setEmployeeId("");
          setEmployeeName("");
          setEmployeeIdCode("");
          setDepartment("");
          setDesignation("");
          setManagerName("");
        }

        setOverallRating("3");
        setKpiScore("80");
        setProductivity("3");
        setAttendance("4");
        setCommunication("3");
        setLeadership("3");
        setTeamwork("4");
        setInnovation("3");
        setProblemSolving("3");
        setTechnicalSkills("3");
        setDiscipline("4");

        setGoalProgress("50");
        setAchievements("");
        setChallenges("");
        setFeedback("");
        setManagerComments("");

        setPromotionEligible(false);
        setPromotionStatus("not_recommended");
        setSalaryIncrement("");
        setBonusRecommendation("");

        setReviewStatus("draft");
        setReviewDate(new Date().toISOString().split("T")[0]);
      }
    }
  }, [open, review, ws.employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const draft: Partial<PerformanceReview> = {
      id: review?.id,
      employeeId,
      employeeName,
      employeeIdCode,
      department,
      designation,
      managerName,
      overallRating: parseInt(overallRating) || 3,
      kpiScore: parseInt(kpiScore) || 80,
      productivity: parseInt(productivity) || 3,
      attendance: parseInt(attendance) || 3,
      communication: parseInt(communication) || 3,
      leadership: parseInt(leadership) || 3,
      teamwork: parseInt(teamwork) || 3,
      innovation: parseInt(innovation) || 3,
      problemSolving: parseInt(problemSolving) || 3,
      technicalSkills: parseInt(technicalSkills) || 3,
      discipline: parseInt(discipline) || 3,
      goalProgress: parseInt(goalProgress) || 50,
      achievements: achievements.trim(),
      challenges: challenges.trim(),
      feedback: feedback.trim(),
      managerComments: managerComments.trim(),
      promotionEligible,
      promotionStatus: promotionEligible ? (promotionStatus === "not_recommended" ? "eligible" : promotionStatus) : "not_recommended",
      salaryIncrement: salaryIncrement ? parseFloat(salaryIncrement) : 0,
      bonusRecommendation: bonusRecommendation ? parseFloat(bonusRecommendation) : 0,
      reviewStatus,
      reviewDate,
    };

    const val = validatePerformanceReviewForm(draft, existingReviews, isEdit);

    if (!val.valid) {
      setErrors(val.errors);
      toast.error("Please resolve validation errors in the form.");
      return;
    }

    // Build the final Performance Review object
    const finalReview: PerformanceReview = {
      id: review?.id || `rev_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      employeeName,
      employeeIdCode,
      department,
      designation,
      managerName,
      overallRating: parseInt(overallRating),
      kpiScore: parseInt(kpiScore),
      productivity: parseInt(productivity),
      attendance: parseInt(attendance),
      communication: parseInt(communication),
      leadership: parseInt(leadership),
      teamwork: parseInt(teamwork),
      innovation: parseInt(innovation),
      problemSolving: parseInt(problemSolving),
      technicalSkills: parseInt(technicalSkills),
      discipline: parseInt(discipline),
      goalProgress: parseInt(goalProgress),
      achievements: achievements.trim(),
      challenges: challenges.trim(),
      feedback: feedback.trim(),
      managerComments: managerComments.trim(),
      promotionEligible,
      promotionStatus: promotionEligible ? (promotionStatus === "not_recommended" ? "eligible" : promotionStatus) : "not_recommended",
      salaryIncrement: salaryIncrement ? parseFloat(salaryIncrement) : 0,
      bonusRecommendation: bonusRecommendation ? parseFloat(bonusRecommendation) : 0,
      reviewStatus,
      reviewDate,
      lastReview: review?.lastReview || new Date().toISOString().split("T")[0],
      nextReview: review?.nextReview || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      createdAt: review?.createdAt || new Date().toISOString(),
    };

    onSave(finalReview);
    toast.success(isEdit ? "Review Updated Successfully" : "Review Created Successfully");
    onOpenChange(false);
  };

  const scoreValues = ["1", "2", "3", "4", "5"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "✏️ Edit Performance Review" : "➕ New Performance Review"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Section 1: Employee Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Employee Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="employee" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Select Employee</Label>
                {isEdit ? (
                  <Input id="employee" value={employeeName} disabled className="bg-muted/30 cursor-not-allowed" />
                ) : (
                  <Select value={employeeId} onValueChange={handleEmployeeChange}>
                    <SelectTrigger id="employee" className={errors.employeeId ? "border-rose-500" : ""}>
                      <SelectValue placeholder="Choose Employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ws.employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.fullName} ({e.employeeId || e.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.employeeId && <p className="text-[10px] text-rose-500">{errors.employeeId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={department} disabled className="bg-muted/20 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={designation} disabled className="bg-muted/20 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Reporting Manager</Label>
                <Input id="manager" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                {errors.managerName && <p className="text-[10px] text-rose-500">{errors.managerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewDate" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Review Cycle Date</Label>
                <Input
                  id="reviewDate"
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className={errors.reviewDate ? "border-rose-500" : ""}
                />
                {errors.reviewDate && <p className="text-[10px] text-rose-500">{errors.reviewDate}</p>}
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 2: Ratings & Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Performance Scores & Core Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {/* Overall Rating */}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="overallRating" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Overall Score (1-5)</Label>
                <Select value={overallRating} onValueChange={setOverallRating}>
                  <SelectTrigger id="overallRating" className={errors.overallRating ? "border-rose-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 ★ Excellent</SelectItem>
                    <SelectItem value="4">4 ★ Good</SelectItem>
                    <SelectItem value="3">3 ★ Average</SelectItem>
                    <SelectItem value="2">2 ★ Needs Improvement</SelectItem>
                    <SelectItem value="1">1 ★ Poor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.overallRating && <p className="text-[10px] text-rose-500">{errors.overallRating}</p>}
              </div>

              {/* KPI Score */}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="kpiScore" className="after:content-['*'] after:text-rose-500 after:ml-0.5">KPI Completion Score (0-100)</Label>
                <Input
                  id="kpiScore"
                  type="number"
                  value={kpiScore}
                  onChange={(e) => setKpiScore(e.target.value)}
                  className={errors.kpiScore ? "border-rose-500" : ""}
                />
                {errors.kpiScore && <p className="text-[10px] text-rose-500">{errors.kpiScore}</p>}
              </div>

              {/* Goal Completion */}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="goalProgress" className="after:content-['*'] after:text-rose-500 after:ml-0.5">Goal Completion Progress %</Label>
                <Input
                  id="goalProgress"
                  type="number"
                  value={goalProgress}
                  onChange={(e) => setGoalProgress(e.target.value)}
                  className={errors.goalProgress ? "border-rose-500" : ""}
                />
                {errors.goalProgress && <p className="text-[10px] text-rose-500">{errors.goalProgress}</p>}
              </div>

              {/* Productivity */}
              <div className="space-y-1.5">
                <Label htmlFor="prod">Productivity</Label>
                <Select value={productivity} onValueChange={setProductivity}>
                  <SelectTrigger id="prod"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Attendance */}
              <div className="space-y-1.5">
                <Label htmlFor="att">Attendance</Label>
                <Select value={attendance} onValueChange={setAttendance}>
                  <SelectTrigger id="att"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Communication */}
              <div className="space-y-1.5">
                <Label htmlFor="comm">Communication</Label>
                <Select value={communication} onValueChange={setCommunication}>
                  <SelectTrigger id="comm"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Leadership */}
              <div className="space-y-1.5">
                <Label htmlFor="lead">Leadership</Label>
                <Select value={leadership} onValueChange={setLeadership}>
                  <SelectTrigger id="lead"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Teamwork */}
              <div className="space-y-1.5">
                <Label htmlFor="team">Teamwork</Label>
                <Select value={teamwork} onValueChange={setTeamwork}>
                  <SelectTrigger id="team"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Innovation */}
              <div className="space-y-1.5">
                <Label htmlFor="inno">Innovation</Label>
                <Select value={innovation} onValueChange={setInnovation}>
                  <SelectTrigger id="inno"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Problem Solving */}
              <div className="space-y-1.5">
                <Label htmlFor="prob">Prob Solving</Label>
                <Select value={problemSolving} onValueChange={setProblemSolving}>
                  <SelectTrigger id="prob"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Technical Skills */}
              <div className="space-y-1.5">
                <Label htmlFor="tech">Tech Skills</Label>
                <Select value={technicalSkills} onValueChange={setTechnicalSkills}>
                  <SelectTrigger id="tech"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {/* Discipline */}
              <div className="space-y-1.5">
                <Label htmlFor="disc">Discipline</Label>
                <Select value={discipline} onValueChange={setDiscipline}>
                  <SelectTrigger id="disc"><SelectValue /></SelectTrigger>
                  <SelectContent>{scoreValues.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 3: Achievements & Feedback */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Core Achievements & Feedback
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="achieve">Key Achievements</Label>
                <Textarea
                  id="achieve"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Summarize the core project achievements and deliverables completed..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challs">Encountered Challenges</Label>
                <Textarea
                  id="challs"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  placeholder="Outline any roadblocks, resource dependencies, or skill gaps encountered..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedb">360° Feedback / Self Review Notes</Label>
                <Textarea
                  id="feedb"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide brief notes summarizing peer inputs and continuous feedback indicators..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mComments">Manager Comments & Next Action</Label>
                <Textarea
                  id="mComments"
                  value={managerComments}
                  onChange={(e) => setManagerComments(e.target.value)}
                  placeholder="Managers notes regarding development targets, goals alignments, and promotions..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 4: Promotion & Increment */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Promotions & Financial Recommendations
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
              <div className="flex items-center space-x-2 rounded-xl border border-border/40 p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                <Checkbox
                  id="promoEligible"
                  checked={promotionEligible}
                  onCheckedChange={(checked) => setPromotionEligible(!!checked)}
                  className="cursor-pointer"
                />
                <Label htmlFor="promoEligible" className="text-xs font-semibold cursor-pointer leading-tight select-none">
                  Promotion Eligible Candidate
                </Label>
              </div>

              {promotionEligible && (
                <div className="space-y-1.5">
                  <Label htmlFor="promoStatus">Recommended Status</Label>
                  <Select
                    value={promotionStatus}
                    onValueChange={(val) => setPromotionStatus(val as PromotionStatus)}
                  >
                    <SelectTrigger id="promoStatus"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROMOTION_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="salaryInc">Salary Increment %</Label>
                <Input
                  id="salaryInc"
                  type="number"
                  value={salaryIncrement}
                  onChange={(e) => setSalaryIncrement(e.target.value)}
                  placeholder="e.g. 10 (for 10% raise)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bonusRecommendation">Bonus Recommendation %</Label>
                <Input
                  id="bonusRecommendation"
                  type="number"
                  value={bonusRecommendation}
                  onChange={(e) => setBonusRecommendation(e.target.value)}
                  placeholder="e.g. 5 (for 5% cash bonus)"
                />
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Section 5: Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reviewStatus">Review Status</Label>
              <Select value={reviewStatus} onValueChange={(val) => setReviewStatus(val as ReviewStatus)}>
                <SelectTrigger id="reviewStatus">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {REVIEW_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-6 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border bg-card hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              Save Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
