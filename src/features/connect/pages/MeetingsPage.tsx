import { useEffect, useState } from "react";
import { connectApi } from "../connectApi";
import type { MeetingSession } from "../types";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const items = await connectApi.listMeetings();
      setMeetings(items);
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      const newMeeting = await connectApi.createMeeting({
        title: title.trim(),
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        isInstant: !scheduledAt,
      });

      toast.success("Meeting created!");
      setCreateModalOpen(false);
      setTitle("");
      setScheduledAt("");

      navigate({
        to: "/dashboard/meetings/$meetingId",
        params: { meetingId: newMeeting.id },
      });
    } catch {
      toast.error("Failed to create meeting");
    } finally {
      setCreating(false);
    }
  };

  const handleStartInstant = async () => {
    try {
      const newMeeting = await connectApi.createMeeting({
        title: "Instant Huddle",
        isInstant: true,
      });
      navigate({
        to: "/dashboard/meetings/$meetingId",
        params: { meetingId: newMeeting.id },
      });
    } catch {
      toast.error("Could not start instant huddle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 cursor-pointer shadow-sm"
          onClick={handleStartInstant}
        >
          <Video className="h-4 w-4 text-brand" />
          <span>Instant Huddle</span>
        </Button>

        <Button
          size="sm"
          className="gap-1.5 cursor-pointer shadow-sm"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Meeting</span>
        </Button>
      </div>

      {/* Main Meetings Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
          <span className="text-sm">Loading team meetings...</span>
        </div>
      ) : meetings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-glow">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No Active Meetings</h3>
          <p className="mt-1 text-xs max-w-sm mx-auto">
            There are no meetings currently active or scheduled. Click below to start an instant huddle or schedule one.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button size="sm" onClick={handleStartInstant} className="cursor-pointer">
              Start Instant Huddle
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCreateModalOpen(true)}
              className="cursor-pointer"
            >
              Schedule Meeting
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-border/80 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      m.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{m.participants.length}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                  {m.title}
                </h3>

                <p className="text-xs text-muted-foreground">
                  Host: <span className="font-medium text-foreground">{m.hostName}</span>
                </p>

                {m.scheduledAt ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Clock className="h-3.5 w-3.5 text-brand" />
                    <span>
                      {new Date(m.scheduledAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Native WebRTC Mesh
                </span>

                <Button
                  size="sm"
                  className="gap-1.5 text-xs cursor-pointer shadow-sm"
                  onClick={() =>
                    navigate({
                      to: "/dashboard/meetings/$meetingId",
                      params: { meetingId: m.id },
                    })
                  }
                >
                  <span>Join</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" />
              Schedule Team Meeting
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateMeeting} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                placeholder="e.g. Sprint Planning & Sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                className="text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheduled-time">Scheduled Date & Time (Optional)</Label>
              <Input
                id="scheduled-time"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Leave empty to start immediately as an instant room.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating || !title.trim()}>
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create & Join
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
