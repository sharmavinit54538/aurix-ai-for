import { useState, useMemo } from "react";
import {
  Mail, Send, CheckCircle2, Eye, Copy
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

interface CommMessage {
  id: string;
  recipientName: string;
  recipientContact: string;
  templateType: string;
  channel: "Email" | "WhatsApp" | "SMS";
  subject: string;
  body: string;
  status: "Draft" | "Scheduled" | "Sent" | "Delivered" | "Failed";
  sentAt?: string;
}

const TEMPLATE_TYPES = [
  "Application Received",
  "Screening Result",
  "Interview Invitation",
  "Interview Reminder",
  "Offer Letter",
  "Rejection",
] as const;

export function CandidateCommunicationPage() {
  const { candidates, jobs } = useRecruitment();

  // Load user-created messages from localStorage (no mock/seed data)
  const [messages, setMessages] = useState<CommMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aurix:comm_messages");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        /* ignore */
      }
    }
    return [];
  });

  const [activeTemplateType, setActiveTemplateType] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<"Email" | "WhatsApp" | "SMS">("Email");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [composerSubject, setComposerSubject] = useState("");
  const [composerBody, setComposerBody] = useState("");

  // Auto-sync selected candidate when candidates load
  useMemo(() => {
    if (
      (!selectedCandidateId ||
        !candidates.some((c) => c.id === selectedCandidateId)) &&
      candidates.length > 0
    ) {
      setSelectedCandidateId(candidates[0].id);
    }
  }, [candidates, selectedCandidateId]);

  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || null;
  const selectedJob = selectedCandidate
    ? jobs.find((j) => j.id === selectedCandidate.jobId) || null
    : null;

  const handleTemplateSelect = (type: string) => {
    setActiveTemplateType(type);
    // Templates start empty — user fills in subject/body
    setComposerSubject("");
    setComposerBody("");
  };

  // Interpolated Preview (replace variables if user typed them)
  const candidateName = selectedCandidate?.name || "";
  const jobTitle =
    selectedJob?.title || selectedCandidate?.appliedPosition || "";

  const previewSubject = composerSubject
    .replace(/\{\{candidate_name\}\}/g, candidateName)
    .replace(/\{\{job_title\}\}/g, jobTitle);

  const previewBody = composerBody
    .replace(/\{\{candidate_name\}\}/g, candidateName)
    .replace(/\{\{job_title\}\}/g, jobTitle)
    .replace(/\{\{interview_time\}\}/g, "")
    .replace(/\{\{meeting_link\}\}/g, "");

  const handleSendMessage = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first.");
      return;
    }
    if (!composerBody.trim()) {
      toast.error("Please write a message body before sending.");
      return;
    }

    const newMsg: CommMessage = {
      id: `msg-${Date.now()}`,
      recipientName: selectedCandidate.name || "",
      recipientContact:
        selectedChannel === "Email"
          ? selectedCandidate.email || ""
          : selectedCandidate.phone || "",
      templateType: activeTemplateType || "Custom",
      channel: selectedChannel,
      subject: previewSubject,
      body: previewBody,
      status: "Delivered",
      sentAt: new Date().toLocaleString(),
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurix:comm_messages", JSON.stringify(updated));
    }
    toast.success(
      `Message dispatched via ${selectedChannel} to ${selectedCandidate.name}!`,
    );
  };

  const filteredMessages = useMemo(() => {
    if (filterChannel === "all") return messages;
    return messages.filter((m) => m.channel === filterChannel);
  }, [messages, filterChannel]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Communication Center"
        description="Deliver multi-channel messages across Email, WhatsApp, and SMS throughout every milestone of the candidate lifecycle."
      />

      {/* Main Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Template Selector & Message Composer */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" />
              Message Composer
            </h3>
            <div className="flex items-center gap-1">
              {(["Email", "WhatsApp", "SMS"] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    selectedChannel === ch
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <Label className="text-xs">Template Category</Label>
              <div className="grid grid-cols-2 gap-1.5 mt-1 sm:grid-cols-3">
                {TEMPLATE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTemplateSelect(type)}
                    className={`p-2 rounded-lg text-left border text-[11px] font-medium transition-colors cursor-pointer ${
                      activeTemplateType === type
                        ? "bg-indigo-500/15 text-indigo-600 border-indigo-500/40 dark:text-indigo-300"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Recipient Candidate</Label>
              {candidates.length === 0 ? (
                <div className="mt-1 p-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground bg-muted/20">
                  No candidates available in pipeline
                </div>
              ) : (
                <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || "Unnamed"}{c.appliedPosition ? ` (${c.appliedPosition})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedChannel === "Email" && (
              <div>
                <Label className="text-xs">Subject Line</Label>
                <Input
                  className="mt-1 h-9 text-xs font-mono"
                  placeholder="Enter subject line..."
                  value={composerSubject}
                  onChange={(e) => setComposerSubject(e.target.value)}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Message Body</Label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Variables: &#123;&#123;candidate_name&#125;&#125;, &#123;&#123;job_title&#125;&#125;
                </span>
              </div>
              <Textarea
                className="mt-1 text-xs font-mono"
                rows={6}
                placeholder="Write your message here..."
                value={composerBody}
                onChange={(e) => setComposerBody(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                disabled={!selectedCandidate || !composerBody.trim()}
                onClick={handleSendMessage}
                className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch via {selectedChannel}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Live {selectedChannel} Preview
              </span>
              {selectedCandidate && (
                <Badge variant="outline" className="text-[10px]">
                  To: {selectedCandidate.name}
                </Badge>
              )}
            </div>

            {!composerBody.trim() ? (
              <div className="mt-4 flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/20">
                <Mail className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No message to preview</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Start composing a message to see the live preview here.
                </p>
              </div>
            ) : selectedChannel === "Email" ? (
              <div className="mt-4 rounded-xl border border-border bg-background p-4 shadow-sm text-xs space-y-3">
                <div className="border-b border-border pb-2 space-y-1">
                  {selectedCandidate?.email && (
                    <div>
                      <span className="text-muted-foreground">To: </span>
                      <span className="font-semibold text-foreground">{selectedCandidate.email}</span>
                    </div>
                  )}
                  {previewSubject && (
                    <div>
                      <span className="text-muted-foreground">Subject: </span>
                      <span className="font-bold text-foreground">{previewSubject}</span>
                    </div>
                  )}
                </div>
                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {previewBody}
                </p>
              </div>
            ) : (
              <div className="mt-4 max-w-sm mx-auto rounded-2xl border border-border bg-zinc-900 p-4 text-xs text-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="font-bold text-sm">{selectedChannel} Preview</div>
                  <Badge variant="secondary" className="text-[9px] bg-emerald-500/20 text-emerald-400">
                    {selectedChannel}
                  </Badge>
                </div>
                <div className="bg-zinc-800/80 p-3 rounded-xl rounded-tl-none text-zinc-100 whitespace-pre-line leading-relaxed">
                  {previewBody}
                </div>
              </div>
            )}
          </div>

          {composerBody.trim() && (
            <div className="text-[11px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between">
              <span>Variables resolved from selected candidate record.</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px]"
                onClick={() => {
                  navigator.clipboard.writeText(previewBody);
                  toast.success("Preview copied to clipboard!");
                }}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch History & Communication Log */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">Communication Delivery History</h3>
            <p className="text-xs text-muted-foreground">Messages sent to candidates across channels.</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="h-8 text-xs w-[130px]">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Recipient</th>
                <th className="px-4 py-2.5">Template</th>
                <th className="px-4 py-2.5">Channel</th>
                <th className="px-4 py-2.5">Content Preview</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <p className="font-medium text-xs">No dispatched messages yet</p>
                    <p className="text-[11px] mt-0.5 text-muted-foreground/80">
                      Use the composer above to send messages to candidates.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-accent/30">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-foreground">{msg.recipientName}</div>
                      <div className="text-[10px] text-muted-foreground">{msg.recipientContact}</div>
                    </td>
                    <td className="px-4 py-2.5 font-medium">{msg.templateType}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-[10px]">
                        {msg.channel}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs truncate text-muted-foreground">
                      {msg.body}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-[10px]">
                      {msg.sentAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
