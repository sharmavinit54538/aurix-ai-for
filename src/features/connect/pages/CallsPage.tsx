import { useEffect, useState } from "react";
import { connectApi } from "../connectApi";
import { callManager } from "../stores/callStore";
import { useIsRealtimeOpen } from "../services/realtimeClient";
import { ColleagueSearchModal } from "../components/ColleagueSearchModal";
import type { CallType, Colleague } from "../types";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Plus,
  Clock,
  Calendar,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CallsPage() {
  const isRealtimeOpen = useIsRealtimeOpen();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedCallType, setSelectedCallType] = useState<CallType>("audio");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await connectApi.getCallHistory();
      setHistory(items);
    } catch {
      toast.error("Failed to load call history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStartCallWithColleague = (colleague: Colleague) => {
    if (!isRealtimeOpen) return;
    callManager.startCall(colleague, selectedCallType).catch((err) => {
      toast.error(err?.message || `Could not initiate ${selectedCallType} call`);
    });
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return "0s";
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    if (mins === 0) return `${remaining}s`;
    return `${mins}m ${remaining}s`;
  };

  const getStatusIcon = (status: string, isCaller: boolean) => {
    if (status === "missed") {
      return <PhoneMissed className="h-4 w-4 text-destructive" />;
    }
    if (isCaller) {
      return <PhoneOutgoing className="h-4 w-4 text-emerald-500" />;
    }
    return <PhoneIncoming className="h-4 w-4 text-brand" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isRealtimeOpen}
          title={isRealtimeOpen ? "Start Audio Call" : "Realtime connection not available"}
          onClick={() => {
            if (!isRealtimeOpen) return;
            setSelectedCallType("audio");
            setSearchModalOpen(true);
          }}
        >
          <Phone className="h-4 w-4 text-brand" />
          <span>Audio Call</span>
        </Button>

        <Button
          size="sm"
          className="gap-1.5 cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isRealtimeOpen}
          title={isRealtimeOpen ? "Start Video Call" : "Realtime connection not available"}
          onClick={() => {
            if (!isRealtimeOpen) return;
            setSelectedCallType("video");
            setSearchModalOpen(true);
          }}
        >
          <Video className="h-4 w-4" />
          <span>Video Call</span>
        </Button>
      </div>

      {/* Main Call History Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            Recent Calls
          </h2>
          <span className="text-xs text-muted-foreground">{history.length} record(s)</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
            <span className="text-sm">Loading call logs...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
            <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No Call History</h3>
            <p className="mt-1 text-xs max-w-sm">
              You haven't made or received any calls yet. Use the buttons above to start a voice or video call with a teammate.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {history.map((item, idx) => {
              const otherParty = item.recipient || item.caller || { name: "Colleague" };
              const isCaller = item.caller_id === "me";

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {otherParty.avatar ? (
                        <img
                          src={otherParty.avatar}
                          alt={otherParty.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {otherParty.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {getStatusIcon(item.status, isCaller)}
                        <span className="capitalize">{item.status}</span>
                        <span>•</span>
                        <span>{item.call_type === "video" ? "Video" : "Audio"}</span>
                        <span>•</span>
                        <span>{formatDuration(item.duration_seconds)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {item.started_at
                        ? new Date(item.started_at).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recent"}
                    </span>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 cursor-pointer ml-2 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={!isRealtimeOpen}
                      title={isRealtimeOpen ? "Call Again" : "Realtime connection not available"}
                      onClick={() => {
                        if (!isRealtimeOpen) return;
                        callManager.startCall(otherParty, item.call_type || "audio").catch((err) => {
                          toast.error(err?.message || `Could not initiate ${item.call_type || "audio"} call`);
                        });
                      }}
                    >
                      <Phone className="h-3.5 w-3.5 text-brand" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ColleagueSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        onSelectColleague={handleStartCallWithColleague}
      />
    </div>
  );
}
