import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { connectApi } from "../connectApi";
import type { Colleague } from "../types";
import { Search, User, MessageSquare, Phone, Video, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { callManager } from "../stores/callStore";
import { useIsRealtimeOpen } from "../services/realtimeClient";
import { toast } from "sonner";

interface ColleagueSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectColleague?: (colleague: Colleague) => void;
}

function formatErrorDetails(err: unknown): { status?: number | string; message: string } {
  if (err && typeof err === "object") {
    const e = err as {
      response?: { status?: number; data?: { message?: string; detail?: string; error?: string } };
      message?: string;
    };
    const status = e.response?.status;
    const backendMessage =
      e.response?.data?.message ||
      e.response?.data?.detail ||
      e.response?.data?.error ||
      e.message ||
      "Failed to load directory";
    return { status, message: String(backendMessage) };
  }
  return { message: "Failed to load directory" };
}

export function ColleagueSearchModal({
  open,
  onOpenChange,
  onSelectColleague,
}: ColleagueSearchModalProps) {
  const isRealtimeOpen = useIsRealtimeOpen();
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ status?: number | string; message: string } | null>(null);
  const navigate = useNavigate();

  const loadColleagues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await connectApi.getColleagues();
      setColleagues(items);
    } catch (err: unknown) {
      setError(formatErrorDetails(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadColleagues();
    }
  }, [open, loadColleagues]);

  const filtered = colleagues.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(query.toLowerCase())) ||
      (c.designation && c.designation.toLowerCase().includes(query.toLowerCase()))
  );

  const [isStartingDm, setIsStartingDm] = useState(false);

  const handleStartDm = async (colleague: Colleague) => {
    if (onSelectColleague) {
      onSelectColleague(colleague);
      onOpenChange(false);
      return;
    }

    if (isStartingDm) return;
    setIsStartingDm(true);

    try {
      // Check if conversation already exists to prevent duplicate creation
      const existingConvs = await connectApi.listConversations();
      const existing = existingConvs.find((c) => c.participant.id === colleague.id);
      if (existing) {
        onOpenChange(false);
        navigate({
          to: "/dashboard/connect/dm/$conversationId",
          params: { conversationId: existing.id },
        });
        return;
      }

      const conv = await connectApi.createConversation(colleague.id);
      onOpenChange(false);
      navigate({
        to: "/dashboard/connect/dm/$conversationId",
        params: { conversationId: conv.id },
      });
    } catch (err: unknown) {
      const errInfo = formatErrorDetails(err);
      toast.error(
        errInfo.status
          ? `[HTTP ${errInfo.status}] ${errInfo.message}`
          : errInfo.message || "Failed to start direct conversation"
      );
      // NOTE: Modal stays open on error
    } finally {
      setIsStartingDm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            Directory & New Message
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, department..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 text-sm"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/40">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Loading colleagues...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-6 text-center gap-3" data-testid="colleagues-error">
              <div className="rounded-full bg-destructive/10 p-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Failed to load directory
                </p>
                <p className="text-xs text-muted-foreground max-w-[280px]">
                  {error.status ? `[HTTP ${error.status}] ` : ""}{error.message}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={loadColleagues}
                className="gap-1.5 h-8 text-xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground" data-testid="colleagues-empty">
              {query ? "No colleagues matching your search." : "No colleagues found."}
            </div>
          ) : (
            filtered.map((colleague) => (
              <div
                key={colleague.id}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                    {colleague.avatar ? (
                      <img
                        src={colleague.avatar}
                        alt={colleague.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    {colleague.presence ? (
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
                          colleague.presence === "online"
                            ? "bg-emerald-500"
                            : colleague.presence === "away"
                            ? "bg-amber-500"
                            : "bg-neutral-400"
                        }`}
                        title={colleague.presence}
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {colleague.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {colleague.designation || colleague.department || colleague.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!isRealtimeOpen}
                    title={isRealtimeOpen ? "Audio Call" : "Realtime connection not available"}
                    onClick={() => {
                      if (!isRealtimeOpen) return;
                      onOpenChange(false);
                      callManager.startCall(colleague, "audio");
                    }}
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!isRealtimeOpen}
                    title={isRealtimeOpen ? "Video Call" : "Realtime connection not available"}
                    onClick={() => {
                      if (!isRealtimeOpen) return;
                      onOpenChange(false);
                      callManager.startCall(colleague, "video");
                    }}
                  >
                    <Video className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-2.5 text-xs cursor-pointer ml-1"
                    onClick={() => handleStartDm(colleague)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
