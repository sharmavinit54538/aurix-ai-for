import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Send,
  Star,
  User,
  UserCheck,
  UserX,
  Video,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruitment, newId } from "@/features/admin/recruitment/hooks/useRecruitment";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type {
  Interview,
  Interviewer,
  InterviewMode,
  InterviewRecommendation,
} from "@/features/admin/recruitment/types";

import {
  buildIsoFromLocal,
  formatLocalDate,
  formatLocalDateTime,
  formatLocalTime,
  isInterviewOverdue,
  userTimeZone,
} from "../utils/interviewUtils";

type TabType = "upcoming" | "pending" | "completed" | "cancelled" | "noshow" | "calendar";

export function InterviewsPage() {
  const {
    interviews,
    candidates,
    interviewers,
    interviewPagination,
    interviewLoading,
    interviewSubmitting,
    interviewError,
    fetchInterviews,
    fetchInterviewers,
    scheduleInterview,
    rescheduleInterview,
    cancelInterview,
    sendInterviewReminder,
    markInterviewNoShow,
    submitRoundFeedback,
    sendInterviewInvite,
    refreshAll,
  } = useRecruitment();

  const [tab, setTab] = useState<TabType>("upcoming");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedIv, setSelectedIv] = useState<Interview | null>(null);

  // Reminder cooldowns (scheduleId -> timestamp in ms until button re-enables)
  const [reminderCooldowns, setReminderCooldowns] = useState<Record<string, number>>({});
  const [, setCooldownTick] = useState(0);

  // Periodic tick for reminder cooldown countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar state: anchor date for navigable weeks
  const [calendarAnchor, setCalendarAnchor] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [showCancelledInCalendar, setShowCancelledInCalendar] = useState(false);

  // Forms
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Schedule form
  const [scheduleCandidateId, setScheduleCandidateId] = useState("");
  const [scheduleRound, setScheduleRound] = useState("Technical Round");
  const [scheduleInterviewerId, setScheduleInterviewerId] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("14:00");
  const [scheduleDuration, setScheduleDuration] = useState("45");
  const [scheduleMode, setScheduleMode] = useState<InterviewMode>("ONLINE");
  const [scheduleMeetingUrl, setScheduleMeetingUrl] = useState("");
  const [scheduleOfficeAddress, setScheduleOfficeAddress] = useState("");
  const [interviewerSearch, setInterviewerSearch] = useState("");

  // Reschedule form
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("14:00");
  const [rescheduleDuration, setRescheduleDuration] = useState("45");
  const [rescheduleReason, setRescheduleReason] = useState("");

  // Cancel form
  const [cancelReason, setCancelReason] = useState("");
  const [confirmCancelStep, setConfirmCancelStep] = useState(false);

  // Feedback form
  const [feedbackRecommendation, setFeedbackRecommendation] = useState<InterviewRecommendation>("PASS");
  const [feedbackRating, setFeedbackRating] = useState<number>(4);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [feedbackInterviewerName, setFeedbackInterviewerName] = useState("");
  const [confirmRejectFeedback, setConfirmRejectFeedback] = useState(false);

  // Initial fetch of interviews & interviewers
  const loadData = useCallback(async (page: number = 1) => {
    try {
      await fetchInterviews({ page, limit: pageSize });
      await fetchInterviewers();
    } catch {
      // Handled via interviewError in store
    }
  }, [fetchInterviews, fetchInterviewers]);

  useEffect(() => {
    if (interviews.length === 0) {
      loadData(currentPage);
    }
  }, [loadData, currentPage, interviews.length]);

  // Candidates eligible for scheduling:
  // Must have an application in PENDING_SCHEDULE or stage in "interview" / "screening"
  const eligibleCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const stageLower = (c.stage || "").toLowerCase();
      const hasPendingIv = interviews.some(
        (iv) =>
          (iv.candidateId === c.id || iv.applicationId === c.applicationId) &&
          iv.status.toUpperCase() === "PENDING_SCHEDULE",
      );
      return hasPendingIv || stageLower === "interview" || stageLower === "screening" || !c.stage;
    });
  }, [candidates, interviews]);

  // Filtered interviewers by search
  const filteredInterviewers = useMemo(() => {
    if (!interviewerSearch.trim()) return interviewers;
    const q = interviewerSearch.toLowerCase();
    return interviewers.filter(
      (inv) =>
        inv.name.toLowerCase().includes(q) ||
        (inv.email && inv.email.toLowerCase().includes(q)) ||
        (inv.role && inv.role.toLowerCase().includes(q)),
    );
  }, [interviewers, interviewerSearch]);

  // Categorized lists
  const upcomingInterviews = useMemo(() => {
    return interviews
      .filter((iv) => {
        const s = (iv.status || "").toUpperCase();
        return s === "SCHEDULED" || s === "SCHEDULE";
      })
      .sort((a, b) => {
        const aOverdue = isInterviewOverdue(a);
        const bOverdue = isInterviewOverdue(b);
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return aTime - bTime;
      });
  }, [interviews]);

  const pendingInterviews = useMemo(() => {
    return interviews.filter((iv) => {
      const s = (iv.status || "").toUpperCase();
      return s === "PENDING_SCHEDULE" || s === "PENDING";
    });
  }, [interviews]);

  const completedInterviews = useMemo(() => {
    return interviews
      .filter((iv) => {
        const s = (iv.status || "").toUpperCase();
        return s === "COMPLETED";
      })
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      });
  }, [interviews]);

  const cancelledInterviews = useMemo(() => {
    return interviews
      .filter((iv) => {
        const s = (iv.status || "").toUpperCase();
        return s === "CANCELLED";
      })
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      });
  }, [interviews]);

  const noshowInterviews = useMemo(() => {
    return interviews.filter((iv) => {
      const s = (iv.status || "").toUpperCase();
      return s === "NO_SHOW" || s === "NO-SHOW";
    });
  }, [interviews]);

  // Calendar week calculations (7 days based on calendarAnchor)
  const calendarDays = useMemo(() => {
    const startOfWeek = new Date(calendarAnchor);
    const dayOfWeek = startOfWeek.getDay(); // 0 is Sunday
    // Start week on Monday
    const distanceToMonday = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const days: { date: Date; items: Interview[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const items = interviews.filter((iv) => {
        if (!iv.date) return false;
        if (!showCancelledInCalendar && iv.status.toUpperCase() === "CANCELLED") return false;
        const ivDate = new Date(iv.date);
        return (
          ivDate.getFullYear() === d.getFullYear() &&
          ivDate.getMonth() === d.getMonth() &&
          ivDate.getDate() === d.getDate()
        );
      });
      days.push({ date: d, items });
    }
    return days;
  }, [calendarAnchor, interviews, showCancelledInCalendar]);

  // Navigate calendar
  const prevWeek = () => {
    setCalendarAnchor((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };
  const nextWeek = () => {
    setCalendarAnchor((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };
  const resetToToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setCalendarAnchor(now);
  };

  // Schedule Submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleCandidateId) {
      toast.error("Please select a candidate.");
      return;
    }
    if (!scheduleInterviewerId) {
      toast.error("Please select an interviewer from the list.");
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select date and time.");
      return;
    }

    const scheduledIso = buildIsoFromLocal(scheduleDate, scheduleTime);
    if (new Date(scheduledIso).getTime() < Date.now()) {
      toast.error("Interview time cannot be in the past.");
      return;
    }

    if (scheduleMode === "ONLINE" && !scheduleMeetingUrl.trim()) {
      toast.error("Meeting URL is required for online interviews.");
      return;
    }
    if (scheduleMode === "OFFLINE" && !scheduleOfficeAddress.trim()) {
      toast.error("Office address is required for offline interviews.");
      return;
    }

    const candidate = candidates.find((c) => c.id === scheduleCandidateId);
    if (!candidate) {
      toast.error("Selected candidate not found.");
      return;
    }

    // Check if candidate already has a pending interview record
    const pendingIv = interviews.find(
      (iv) =>
        (iv.candidateId === candidate.id || iv.applicationId === candidate.applicationId) &&
        iv.status.toUpperCase() === "PENDING_SCHEDULE",
    );

    const interviewId = pendingIv?.interviewId || pendingIv?.id || newId("iv");
    const roundId = pendingIv?.roundId || pendingIv?.id || newId("rnd");

    setIsSubmittingForm(true);
    try {
      await scheduleInterview({
        interviewId,
        roundId,
        payload: {
          interviewer_id: scheduleInterviewerId,
          scheduled_at: scheduledIso,
          duration_minutes: Number(scheduleDuration) || 45,
          mode: scheduleMode,
          meeting_url: scheduleMode === "ONLINE" ? scheduleMeetingUrl.trim() : undefined,
          office_address: scheduleMode === "OFFLINE" ? scheduleOfficeAddress.trim() : undefined,
          timezone: userTimeZone,
        },
      });

      toast.success(`Interview scheduled successfully for ${candidate.name}!`);
      setShowScheduleModal(false);
      setScheduleCandidateId("");
      setScheduleDate("");
      setScheduleMeetingUrl("");
      setScheduleOfficeAddress("");
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to schedule interview";
      toast.error(msg);
      // Keep dialog open on failure
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Reschedule Submit
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIv) return;
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please specify a valid date and time.");
      return;
    }

    const scheduledIso = buildIsoFromLocal(rescheduleDate, rescheduleTime);
    if (new Date(scheduledIso).getTime() < Date.now()) {
      toast.error("Rescheduled time cannot be in the past.");
      return;
    }

    const scheduleId = selectedIv.scheduleId || selectedIv.id;
    setIsSubmittingForm(true);
    try {
      await rescheduleInterview({
        scheduleId,
        payload: {
          scheduled_at: scheduledIso,
          duration_minutes: Number(rescheduleDuration) || selectedIv.durationMins || 45,
          reason: rescheduleReason.trim() || undefined,
        },
      });

      toast.success(`Interview with ${selectedIv.candidateName} rescheduled!`);
      setShowRescheduleModal(false);
      setSelectedIv(null);
      setRescheduleReason("");
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reschedule interview";
      toast.error(msg);
      // Keep dialog open on failure
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Cancel Submit
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIv) return;
    if (cancelReason.trim().length < 5) {
      toast.error("Cancellation reason must be at least 5 characters.");
      return;
    }

    if (!confirmCancelStep) {
      setConfirmCancelStep(true);
      return;
    }

    const scheduleId = selectedIv.scheduleId || selectedIv.id;
    setIsSubmittingForm(true);
    try {
      await cancelInterview({
        scheduleId,
        payload: {
          reason: cancelReason.trim(),
        },
      });

      toast.info(`Interview with ${selectedIv.candidateName} cancelled.`);
      setShowCancelModal(false);
      setSelectedIv(null);
      setCancelReason("");
      setConfirmCancelStep(false);
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel interview";
      toast.error(msg);
      // Keep dialog open on failure
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Feedback Submit
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIv) return;
    if (feedbackNotes.trim().length < 10) {
      toast.error("Feedback evaluation notes must be at least 10 characters.");
      return;
    }

    if (feedbackRecommendation === "REJECT" && !confirmRejectFeedback) {
      setConfirmRejectFeedback(true);
      return;
    }

    const roundId = selectedIv.roundId || selectedIv.id;
    setIsSubmittingForm(true);
    try {
      await submitRoundFeedback({
        roundId,
        action: feedbackRecommendation,
        payload: {
          feedback: feedbackNotes.trim(),
          score: feedbackRating,
          interviewer_name: feedbackInterviewerName.trim() || selectedIv.interviewer || undefined,
        },
      });

      toast.success(
        `Feedback submitted for ${selectedIv.candidateName} (${feedbackRecommendation})!`,
      );
      setShowFeedbackModal(false);
      setSelectedIv(null);
      setFeedbackNotes("");
      setConfirmRejectFeedback(false);
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit feedback";
      toast.error(msg);
      // Keep dialog open on failure
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Send Reminder
  const handleSendReminder = async (iv: Interview) => {
    const scheduleId = iv.scheduleId || iv.id;
    const now = Date.now();
    const cooldownEnd = reminderCooldowns[scheduleId];
    if (cooldownEnd && cooldownEnd > now) {
      const remainingSecs = Math.ceil((cooldownEnd - now) / 1000);
      toast.info(`Please wait ${remainingSecs}s before sending another reminder.`);
      return;
    }

    try {
      await sendInterviewReminder(scheduleId);
      toast.success(`Reminder sent to ${iv.candidateName}!`);
      setReminderCooldowns((prev) => ({
        ...prev,
        [scheduleId]: Date.now() + 60_000,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reminder";
      toast.error(msg);
    }
  };

  // Mark No-Show
  const handleMarkNoShow = async (iv: Interview) => {
    const scheduleId = iv.scheduleId || iv.id;
    try {
      await markInterviewNoShow(scheduleId);
      toast.info(`Marked interview with ${iv.candidateName} as no-show.`);
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to mark as no-show";
      toast.error(msg);
    }
  };

  // Send Invite
  const handleSendInvite = async (candidateId: string, roundName?: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate?.applicationId) {
      toast.error("Application ID missing for candidate.");
      return;
    }

    try {
      await sendInterviewInvite({
        applicationId: candidate.applicationId,
        roundNames: roundName || "Technical Round",
      });
      toast.success(`Interview invite dispatched to ${candidate.name}!`);
      await loadData(currentPage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send interview invite";
      toast.error(msg);
    }
  };

  const activeList =
    tab === "upcoming"
      ? upcomingInterviews
      : tab === "pending"
        ? pendingInterviews
        : tab === "completed"
          ? completedInterviews
          : tab === "cancelled"
            ? cancelledInterviews
            : tab === "noshow"
              ? noshowInterviews
              : [];

  const totalPages = interviewPagination ? Math.ceil(interviewPagination.total / pageSize) : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Interview Pipeline</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage scheduling, rounds, feedback evaluations, and candidate communications in local timezone ({userTimeZone}).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(currentPage)}
            disabled={interviewLoading}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${interviewLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // Pre-fill tomorrow's date at 10:00
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const yyyy = tomorrow.getFullYear();
              const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
              const dd = String(tomorrow.getDate()).padStart(2, "0");
              setScheduleDate(`${yyyy}-${mm}-${dd}`);
              setScheduleTime("10:00");
              setShowScheduleModal(true);
            }}
          >
            <CalendarIcon className="mr-1.5 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="inline-flex rounded-lg border border-border bg-card/60 p-1">
          {(
            [
              { k: "upcoming", l: "Upcoming", c: upcomingInterviews.length },
              { k: "pending", l: "Pending Schedule", c: pendingInterviews.length },
              { k: "completed", l: "Completed", c: completedInterviews.length },
              { k: "cancelled", l: "Cancelled", c: cancelledInterviews.length },
              { k: "noshow", l: "No-Show", c: noshowInterviews.length },
              { k: "calendar", l: "Calendar View", c: interviews.length },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => setTab(t.k)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                tab === t.k
                  ? "bg-accent text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.l}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                {t.c}
              </span>
            </button>
          ))}
        </div>

        {tab === "calendar" && (
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={showCancelledInCalendar}
                onChange={(e) => setShowCancelledInCalendar(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              Show Cancelled
            </label>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={prevWeek} title="Previous week">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={resetToToday}>
                Today
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7" onClick={nextWeek} title="Next week">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error state */}
      {interviewError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{interviewError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => loadData(currentPage)}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state skeleton */}
      {interviewLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content view */}
      {!interviewLoading && tab !== "calendar" && (
        <div className="space-y-3">
          {activeList.map((iv) => {
            const overdue = isInterviewOverdue(iv);
            const scheduleId = iv.scheduleId || iv.id;
            const cooldownRemaining = reminderCooldowns[scheduleId]
              ? Math.max(0, Math.ceil((reminderCooldowns[scheduleId] - Date.now()) / 1000))
              : 0;

            return (
              <div
                key={iv.id}
                className={`flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 backdrop-blur-xl transition-all ${
                  overdue ? "border-amber-500/50 bg-amber-500/5" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-[240px]">
                    <CandidateAvatar name={iv.candidateName} size={42} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/dashboard/recruitment/candidates/$candidateId"
                          params={{ candidateId: iv.candidateId }}
                          className="text-sm font-semibold hover:underline"
                        >
                          {iv.candidateName}
                        </Link>
                        {overdue && (
                          <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider">
                            Overdue
                          </Badge>
                        )}
                        {iv.recommendation && (
                          <Badge
                            variant={
                              iv.recommendation === "PASS"
                                ? "default"
                                : iv.recommendation === "REJECT"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px] font-semibold uppercase"
                          >
                            {iv.recommendation}
                          </Badge>
                        )}
                      </div>
                      <div className="truncate text-xs text-muted-foreground mt-0.5">
                        {iv.jobTitle} · <span className="font-medium text-foreground">{iv.round}</span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatLocalDateTime(iv.date)}</span>
                      {iv.durationMins > 0 && <span>({iv.durationMins}m)</span>}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>{iv.interviewer || "Unassigned"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {iv.mode === "ONLINE" ? (
                        <span className="inline-flex items-center gap-1 text-sky-500 font-medium">
                          <Video className="h-3.5 w-3.5" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-medium" title={iv.officeAddress || "On-site"}>
                          <MapPin className="h-3.5 w-3.5" />
                          Offline
                        </span>
                      )}
                    </div>

                    {iv.status.toUpperCase() === "COMPLETED" && typeof iv.rating === "number" && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-3 w-3 ${
                              j < (iv.rating ?? 0)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* SCHEDULED actions */}
                    {(iv.status.toUpperCase() === "SCHEDULED" || iv.status.toUpperCase() === "SCHEDULE") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5"
                          onClick={() => {
                            setSelectedIv(iv);
                            setFeedbackRecommendation("PASS");
                            setFeedbackRating(4);
                            setFeedbackNotes(iv.feedback || "");
                            setFeedbackInterviewerName(iv.interviewer !== "Unassigned" ? iv.interviewer : "");
                            setConfirmRejectFeedback(false);
                            setShowFeedbackModal(true);
                          }}
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
                          Feedback
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2.5"
                          onClick={() => {
                            setSelectedIv(iv);
                            if (iv.date) {
                              const d = new Date(iv.date);
                              const yyyy = d.getFullYear();
                              const mm = String(d.getMonth() + 1).padStart(2, "0");
                              const dd = String(d.getDate()).padStart(2, "0");
                              const hh = String(d.getHours()).padStart(2, "0");
                              const min = String(d.getMinutes()).padStart(2, "0");
                              setRescheduleDate(`${yyyy}-${mm}-${dd}`);
                              setRescheduleTime(`${hh}:${min}`);
                            }
                            setRescheduleDuration(String(iv.durationMins || 45));
                            setRescheduleReason("");
                            setShowRescheduleModal(true);
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-500/10"
                          onClick={() => {
                            setSelectedIv(iv);
                            setCancelReason("");
                            setConfirmCancelStep(false);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs px-2"
                          disabled={cooldownRemaining > 0}
                          onClick={() => handleSendReminder(iv)}
                          title="Send automated reminder email/SMS"
                        >
                          <Send className="mr-1 h-3 w-3 text-primary" />
                          {cooldownRemaining > 0 ? `Sent (${cooldownRemaining}s)` : "Reminder"}
                        </Button>
                        {overdue && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs px-2 text-amber-600 hover:bg-amber-500/10"
                            onClick={() => handleMarkNoShow(iv)}
                          >
                            <UserX className="mr-1 h-3 w-3" />
                            No-Show
                          </Button>
                        )}
                      </>
                    )}

                    {/* PENDING_SCHEDULE actions */}
                    {(iv.status.toUpperCase() === "PENDING_SCHEDULE" || iv.status.toUpperCase() === "PENDING") && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs px-2.5"
                          onClick={() => {
                            setScheduleCandidateId(iv.candidateId);
                            setScheduleRound(iv.round || "Technical Round");
                            if (iv.interviewerId) setScheduleInterviewerId(iv.interviewerId);
                            setShowScheduleModal(true);
                          }}
                        >
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Schedule Slot
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2"
                          onClick={() => handleSendInvite(iv.candidateId, iv.round)}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          Resend Invite
                        </Button>
                      </>
                    )}

                    {/* Join Button (ONLY for SCHEDULED + ONLINE + real URL) */}
                    {(iv.status.toUpperCase() === "SCHEDULED" || iv.status.toUpperCase() === "SCHEDULE") &&
                      iv.mode === "ONLINE" &&
                      iv.meetingLink &&
                      iv.meetingLink.trim().length > 0 &&
                      !iv.meetingLink.includes("abc-xyz-123") && (
                        <Button size="sm" variant="outline" className="h-7 text-xs px-2.5" asChild>
                          <a href={iv.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="mr-1 h-3 w-3 text-sky-500" />
                            Join
                          </a>
                        </Button>
                      )}

                    {/* NO_SHOW or CANCELLED actions */}
                    {(iv.status.toUpperCase() === "NO_SHOW" || iv.status.toUpperCase() === "CANCELLED") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5"
                        onClick={() => {
                          setScheduleCandidateId(iv.candidateId);
                          setScheduleRound(iv.round || "Technical Round");
                          setShowScheduleModal(true);
                        }}
                      >
                        Re-schedule
                      </Button>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                {iv.status.toUpperCase() === "COMPLETED" && iv.feedback && (
                  <div className="rounded-xl bg-background/50 p-3 text-xs text-muted-foreground border border-border/50">
                    <span className="font-semibold text-foreground block mb-0.5">Evaluation Feedback:</span>
                    {iv.feedback}
                  </div>
                )}

                {iv.status.toUpperCase() === "CANCELLED" && iv.cancelledReason && (
                  <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-2.5 text-xs text-rose-600">
                    <span className="font-semibold block mb-0.5">Cancellation Reason:</span>
                    {iv.cancelledReason}
                  </div>
                )}
              </div>
            );
          })}

          {activeList.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              {tab === "upcoming" && "No upcoming interviews scheduled."}
              {tab === "pending" && "No candidates pending interview scheduling."}
              {tab === "completed" && "No completed interviews recorded yet."}
              {tab === "cancelled" && "No cancelled interviews."}
              {tab === "noshow" && "No no-show interviews."}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
              <span>
                Showing page {interviewPagination?.page || currentPage} of {totalPages} ({interviewPagination?.total || 0} total)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage <= 1 || interviewLoading}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage >= totalPages || interviewLoading}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {!interviewLoading && tab === "calendar" && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
            <span>
              Week of {calendarDays[0]?.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} —{" "}
              {calendarDays[6]?.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-[11px]">Local timezone: {userTimeZone}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5">
            {calendarDays.map((d, i) => {
              const isToday =
                d.date.getFullYear() === new Date().getFullYear() &&
                d.date.getMonth() === new Date().getMonth() &&
                d.date.getDate() === new Date().getDate();

              return (
                <div
                  key={i}
                  className={`min-h-[160px] rounded-xl border bg-card/60 p-3 backdrop-blur-xl transition-all ${
                    isToday ? "border-primary/50 ring-1 ring-primary/20 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {d.date.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {d.date.getDate()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {d.items.map((iv) => {
                      const isCancelled = iv.status.toUpperCase() === "CANCELLED";
                      return (
                        <div
                          key={iv.id}
                          className={`rounded-lg px-2 py-1.5 text-[11px] border transition-colors ${
                            isCancelled
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-600 line-through"
                              : "bg-accent/60 border-border/60 hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>{formatLocalTime(iv.date)}</span>
                            {iv.mode === "ONLINE" ? (
                              <Video className="h-3 w-3 text-sky-500" />
                            ) : (
                              <MapPin className="h-3 w-3 text-emerald-500" />
                            )}
                          </div>
                          <Link
                            to="/dashboard/recruitment/candidates/$candidateId"
                            params={{ candidateId: iv.candidateId }}
                            className="font-medium hover:underline block truncate text-foreground"
                          >
                            {iv.candidateName}
                          </Link>
                          <div className="truncate text-[10px] text-muted-foreground">
                            {iv.interviewer} · {iv.round}
                          </div>
                        </div>
                      );
                    })}

                    {d.items.length === 0 && (
                      <div className="text-[10px] text-muted-foreground/60 italic pt-6 text-center">
                        No slots
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview Round</DialogTitle>
            <DialogDescription>
              Assign an interviewer, round, and time slot. Candidate will receive an automated invitation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleSubmit} className="space-y-3.5 pt-2 text-xs">
            {/* Candidate picker */}
            <div className="space-y-1">
              <Label htmlFor="sched-candidate" className="text-xs">Candidate *</Label>
              <select
                id="sched-candidate"
                value={scheduleCandidateId}
                onChange={(e) => setScheduleCandidateId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                required
              >
                <option value="">-- Choose Candidate --</option>
                {eligibleCandidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.appliedPosition || "No Position"})
                  </option>
                ))}
              </select>
              {eligibleCandidates.length === 0 && (
                <p className="text-[11px] text-amber-500 mt-1">
                  No candidates currently in interview or screening stages.
                </p>
              )}
            </div>

            {/* Round Name */}
            <div className="space-y-1">
              <Label htmlFor="sched-round" className="text-xs">Interview Round *</Label>
              <select
                id="sched-round"
                value={scheduleRound}
                onChange={(e) => setScheduleRound(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                required
              >
                <option value="Screening Round">Screening Round</option>
                <option value="Technical Round">Technical Round</option>
                <option value="Manager Round">Manager Round</option>
                <option value="HR Round">HR Round</option>
                <option value="System Design Round">System Design Round</option>
              </select>
            </div>

            {/* Interviewer Select from API */}
            <div className="space-y-1">
              <Label htmlFor="sched-interviewer" className="text-xs">Interviewer *</Label>
              <div className="relative mb-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter interviewers..."
                  value={interviewerSearch}
                  onChange={(e) => setInterviewerSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <select
                id="sched-interviewer"
                value={scheduleInterviewerId}
                onChange={(e) => setScheduleInterviewerId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                required
              >
                <option value="">-- Select Interviewer --</option>
                {filteredInterviewers.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} {inv.role ? `(${inv.role})` : ""} {inv.email ? `— ${inv.email}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sched-date" className="text-xs">Date *</Label>
                <Input
                  id="sched-date"
                  type="date"
                  value={scheduleDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sched-time" className="text-xs">Time * ({userTimeZone})</Label>
                <Input
                  id="sched-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Duration and Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sched-duration" className="text-xs">Duration (mins)</Label>
                <Input
                  id="sched-duration"
                  type="number"
                  min="15"
                  max="180"
                  value={scheduleDuration}
                  onChange={(e) => setScheduleDuration(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sched-mode" className="text-xs">Mode *</Label>
                <select
                  id="sched-mode"
                  value={scheduleMode}
                  onChange={(e) => setScheduleMode(e.target.value as InterviewMode)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="ONLINE">Online (Virtual)</option>
                  <option value="OFFLINE">Offline (In-Person)</option>
                </select>
              </div>
            </div>

            {/* Mode-specific input */}
            {scheduleMode === "ONLINE" ? (
              <div className="space-y-1">
                <Label htmlFor="sched-meeting-link" className="text-xs">Meeting Link (Google Meet / Zoom / Teams) *</Label>
                <Input
                  id="sched-meeting-link"
                  placeholder="https://meet.google.com/..."
                  value={scheduleMeetingUrl}
                  onChange={(e) => setScheduleMeetingUrl(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <Label htmlFor="sched-office-address" className="text-xs">Office Address *</Label>
                <Input
                  id="sched-office-address"
                  placeholder="e.g. Conference Room 3B, HQ Building"
                  value={scheduleOfficeAddress}
                  onChange={(e) => setScheduleOfficeAddress(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingForm || interviewSubmitting}>
                {isSubmittingForm ? "Scheduling..." : "Confirm Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleRescheduleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Reschedule Interview</DialogTitle>
              <DialogDescription>
                Select a new date and time for {selectedIv?.candidateName} ({selectedIv?.round}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="resched-date" className="text-xs">New Date *</Label>
                  <Input
                    id="resched-date"
                    type="date"
                    className="mt-1 h-9 text-xs"
                    min={new Date().toISOString().split("T")[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="resched-time" className="text-xs">New Time * ({userTimeZone})</Label>
                  <Input
                    id="resched-time"
                    type="time"
                    className="mt-1 h-9 text-xs"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="resched-duration" className="text-xs">Duration (mins)</Label>
                <Input
                  id="resched-duration"
                  type="number"
                  min="15"
                  max="180"
                  className="mt-1 h-9 text-xs"
                  value={rescheduleDuration}
                  onChange={(e) => setRescheduleDuration(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="resched-reason" className="text-xs">Reschedule Reason (optional)</Label>
                <Input
                  id="resched-reason"
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. Candidate requested later time slot"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRescheduleModal(false)}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingForm}>
                {isSubmittingForm ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCancelSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600">
                Cancel Interview Session
              </DialogTitle>
              <DialogDescription>
                State the reason for cancelling the interview with {selectedIv?.candidateName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <Label htmlFor="cancel-reason" className="text-xs">Cancellation Reason * (min 5 chars)</Label>
                <Textarea
                  id="cancel-reason"
                  className="mt-1 text-xs"
                  rows={3}
                  placeholder="e.g. Candidate accepted another role / Position placed on hold"
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (confirmCancelStep) setConfirmCancelStep(false);
                  }}
                  required
                />
              </div>

              {confirmCancelStep && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600">
                  <p className="font-semibold mb-1">Confirm Cancellation?</p>
                  <p>
                    This will cancel the session, notify the candidate, and update the interview status. This cannot be undone.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={isSubmittingForm}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmittingForm || cancelReason.trim().length < 5}
              >
                {isSubmittingForm
                  ? "Cancelling..."
                  : confirmCancelStep
                    ? "Yes, Confirm Cancellation"
                    : "Cancel Interview"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleFeedbackSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Submit Interview Feedback</DialogTitle>
              <DialogDescription>
                Record your evaluation, recommendation, and rating for {selectedIv?.candidateName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2 text-xs">
              <div className="space-y-1">
                <Label htmlFor="feed-interviewer" className="text-xs">Interviewer Name</Label>
                <Input
                  id="feed-interviewer"
                  placeholder="Interviewer name"
                  value={feedbackInterviewerName}
                  onChange={(e) => setFeedbackInterviewerName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="feed-recommendation" className="text-xs">Recommendation *</Label>
                  <select
                    id="feed-recommendation"
                    value={feedbackRecommendation}
                    onChange={(e) => {
                      setFeedbackRecommendation(e.target.value as InterviewRecommendation);
                      if (confirmRejectFeedback) setConfirmRejectFeedback(false);
                    }}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                    required
                  >
                    <option value="PASS">PASS (Advance)</option>
                    <option value="HOLD">HOLD (Review)</option>
                    <option value="REJECT">REJECT (Decline)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="feed-rating" className="text-xs">Rating (1 to 5 Stars) *</Label>
                  <select
                    id="feed-rating"
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(Number(e.target.value))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                    required
                  >
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Strong Match</option>
                    <option value="3">3 - Acceptable</option>
                    <option value="2">2 - Weak Match</option>
                    <option value="1">1 - Deficient</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="feed-notes" className="text-xs">Evaluation Notes * (min 10 chars)</Label>
                <Textarea
                  id="feed-notes"
                  placeholder="Detailed notes on key strengths, technical skills, areas of concern, culture fit..."
                  rows={4}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              {feedbackRecommendation === "REJECT" && confirmRejectFeedback && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <p className="font-semibold mb-1">Confirm REJECT decision?</p>
                  <p>
                    Are you sure you want to mark this round as REJECT? This will record a decline decision for {selectedIv?.candidateName}.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSubmittingForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={feedbackRecommendation === "REJECT" ? "destructive" : "default"}
                disabled={isSubmittingForm || feedbackNotes.trim().length < 10}
              >
                {isSubmittingForm
                  ? "Submitting..."
                  : feedbackRecommendation === "REJECT" && !confirmRejectFeedback
                    ? "Review & Confirm Reject"
                    : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InterviewsPage;
