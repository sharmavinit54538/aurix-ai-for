import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { connectApi } from "../connectApi";
import type { Colleague } from "../types";
import { Search, User, MessageSquare, Phone, Video, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { callManager } from "../stores/callStore";

interface ColleagueSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectColleague?: (colleague: Colleague) => void;
}

export function ColleagueSearchModal({
  open,
  onOpenChange,
  onSelectColleague,
}: ColleagueSearchModalProps) {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setLoading(true);
      connectApi
        .getColleagues()
        .then((items) => setColleagues(items))
        .catch(() => setColleagues([]))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const filtered = colleagues.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(query.toLowerCase())) ||
      (c.designation && c.designation.toLowerCase().includes(query.toLowerCase()))
  );

  const handleStartDm = async (colleague: Colleague) => {
    if (onSelectColleague) {
      onSelectColleague(colleague);
      onOpenChange(false);
      return;
    }

    try {
      const conv = await connectApi.createConversation(colleague.id);
      onOpenChange(false);
      navigate({
        to: "/dashboard/connect/dm/$conversationId",
        params: { conversationId: conv.id },
      });
    } catch {
      // Fallback
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
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
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
                    className="h-8 w-8 p-0 cursor-pointer"
                    title="Audio Call"
                    onClick={() => {
                      onOpenChange(false);
                      callManager.startCall(colleague, "audio");
                    }}
                  >
                    <Phone className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer"
                    title="Video Call"
                    onClick={() => {
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
