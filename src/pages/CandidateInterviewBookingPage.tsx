import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
  CalendarPlus,
  RefreshCw,
  Building2,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  candidateBookingApi,
  type BookingDetails,
  type BookingSlot,
} from "@/services/candidateBookingApi";
import { downloadIcsFile } from "@/utils/calendarIcs";
import { toast } from "sonner";

export function CandidateInterviewBookingPage() {
  const params = useParams({ strict: false }) as { token?: string };
  const token = params.token || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);

  // Candidate timezone default
  const [selectedTz, setSelectedTz] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  });

  const loadBooking = useCallback(async () => {
    if (!token) {
      setError("No booking token provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await candidateBookingApi.getBookingDetails(token);
      setBookingData(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load interview booking details. The link may be invalid or expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  // Format date helper with explicit timezone
  const formatDateHeading = (isoString: string, tz: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const formatSlotTime = (isoStart: string, isoEnd: string, tz: string) => {
    try {
      const start = new Date(isoStart);
      const end = new Date(isoEnd);
      const timeFmt = new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });
      return `${timeFmt.format(start)} – ${timeFmt.format(end)}`;
    } catch {
      return `${isoStart} – ${isoEnd}`;
    }
  };

  const formatFullDateTime = (isoString: string, tz: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(d);
    } catch {
      return isoString;
    }
  };

  // Group slots by date in candidate's selected timezone
  const groupedSlots = useMemo(() => {
    if (!bookingData?.available_slots?.length) return {};
    const groups: Record<string, BookingSlot[]> = {};
    for (const slot of bookingData.available_slots) {
      const dateKey = formatDateHeading(slot.start_time, selectedTz);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    }
    return groups;
  }, [bookingData?.available_slots, selectedTz]);

  const handleConfirm = async () => {
    if (!selectedSlot || !token) return;
    setSubmitting(true);
    try {
      const res = await candidateBookingApi.confirmBooking(token, {
        slot_id: selectedSlot.slot_id,
        start_time: selectedSlot.start_time,
        timezone: selectedTz,
      });
      toast.success("Interview scheduled successfully!");
      setBookingData((prev) =>
        prev
          ? {
              ...prev,
              status: "BOOKED",
              booked_slot: res.booked_slot || {
                start_time: selectedSlot.start_time,
                end_time: selectedSlot.end_time,
                timezone: selectedTz,
              },
            }
          : null
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to confirm booking. Please try selecting a different slot.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!bookingData?.booked_slot) return;
    const start = bookingData.booked_slot.start_time;
    const end = bookingData.booked_slot.end_time;
    downloadIcsFile({
      title: `${bookingData.round_name || "Interview"} - ${bookingData.job_title} at ${bookingData.company_name || "OFC360"}`,
      description: `Interview with ${bookingData.interviewer_name || "the hiring team"} for ${bookingData.job_title}.`,
      location: bookingData.booked_slot.meeting_url || bookingData.booked_slot.office_address || "Online",
      startTime: start,
      endTime: end,
    });
    toast.success("Calendar invite downloaded (.ics)");
  };

  // Minimal Public Header
  const headerBar = (
    <header className="border-b border-border bg-card/60 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wider">
            360
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none text-foreground">
              {bookingData?.company_name || "OFC360"} Candidate Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Interview Scheduling Service</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          Secure Link
        </Badge>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <div className="space-y-3 pt-6">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-20">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Unable to Load Interview</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error || "Interview details not found."}</p>
            <div className="mt-6">
              <Button onClick={loadBooking} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State: EXPIRED or CANCELLED
  if (bookingData.status === "EXPIRED" || bookingData.status === "CANCELLED") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-20">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {bookingData.status === "EXPIRED" ? "Booking Link Expired" : "Interview Link Cancelled"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This scheduling invitation is no longer active. Please contact your hiring coordinator or recruiter to receive an updated interview link.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // State: ALREADY BOOKED
  if (bookingData.status === "BOOKED" && bookingData.booked_slot) {
    const slot = bookingData.booked_slot;
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Interview Confirmed!</h2>
                <p className="text-sm text-muted-foreground">
                  Hello {bookingData.candidate_name}, your session has been successfully scheduled.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-muted/40 p-4 border border-border/50 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block">Position</span>
                <span className="font-semibold text-foreground">{bookingData.job_title}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Round</span>
                <span className="font-semibold text-foreground">{bookingData.round_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Date & Time</span>
                <span className="font-semibold text-foreground">
                  {formatFullDateTime(slot.start_time, selectedTz)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Duration</span>
                <span className="font-semibold text-foreground">{bookingData.duration_minutes} minutes</span>
              </div>
              {bookingData.interviewer_name && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground text-xs block">Interviewer</span>
                  <span className="font-semibold text-foreground">{bookingData.interviewer_name}</span>
                </div>
              )}
            </div>

            {slot.meeting_url && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Online Meeting URL</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{slot.meeting_url}</p>
                  </div>
                </div>
                <a
                  href={slot.meeting_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Join Link <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {slot.office_address && (
              <div className="rounded-lg border border-border p-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Office Location</h4>
                  <p className="text-xs text-muted-foreground">{slot.office_address}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownloadCalendar}
                className="w-full gap-2 bg-primary text-primary-foreground"
              >
                <CalendarPlus className="h-4 w-4" /> Add to Calendar (.ics)
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State: PENDING (Choose a slot)
  const dateKeys = Object.keys(groupedSlots);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {headerBar}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 space-y-6">
        {/* Job and Interview Overview Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {bookingData.round_name}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {bookingData.duration_minutes} min
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-1.5">{bookingData.job_title}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Building2 className="h-3.5 w-3.5" /> {bookingData.company_name || "OFC360"}
                {bookingData.interviewer_name && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> with {bookingData.interviewer_name}
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Invited Candidate</span>
              <span className="text-sm font-semibold text-foreground">{bookingData.candidate_name}</span>
            </div>
          </div>

          {/* Timezone Preference */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/30 px-3.5 py-2.5 border border-border/40 text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Times shown in candidate timezone:
            </span>
            <div className="font-medium text-foreground">
              {selectedTz}
            </div>
          </div>
        </div>

        {/* Slot Selection Section */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Select an Available Time Slot</h3>
            <span className="text-xs text-muted-foreground">
              {bookingData.available_slots.length} options available
            </span>
          </div>

          {dateKeys.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No available interview slots found. Please reach out to your coordinator.
            </div>
          ) : (
            <div className="space-y-6">
              {dateKeys.map((dateHeading) => (
                <div key={dateHeading} className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {dateHeading}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {groupedSlots[dateHeading].map((slot) => {
                      const isSelected = selectedSlot?.start_time === slot.start_time;
                      return (
                        <button
                          key={slot.start_time}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex items-center justify-between rounded-lg border p-3.5 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                              : "border-border bg-card hover:border-border hover:bg-muted/30 text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            {formatSlotTime(slot.start_time, slot.end_time, selectedTz)}
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              {selectedSlot ? (
                <span>
                  Selected: <strong>{formatFullDateTime(selectedSlot.start_time, selectedTz)}</strong>
                </span>
              ) : (
                <span>Please select a time slot above to continue.</span>
              )}
            </div>
            <Button
              onClick={handleConfirm}
              disabled={!selectedSlot || submitting}
              className="w-full sm:w-auto gap-2 min-w-[160px]"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Scheduling...
                </>
              ) : (
                <>
                  Confirm Booking <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CandidateInterviewBookingPage;
