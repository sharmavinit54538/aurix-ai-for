import { useState, useMemo } from "react";
import {
  Mail, MessageSquare, Phone, Send, CheckCircle2, Clock, AlertCircle,
  Eye, Copy, Sparkles, Filter, Users, ChevronRight, FileText, Check
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  templateType: "Application Received" | "Screening Result" | "Interview Invitation" | "Interview Reminder" | "Rejection" | "Offer Letter";
  channel: "Email" | "WhatsApp" | "SMS";
  subject: string;
  body: string;
  status: "Draft" | "Scheduled" | "Sent" | "Delivered" | "Failed";
  sentAt?: string;
}

const DEFAULT_TEMPLATES: Record<string, { subject: string; body: string }> = {
  "Application Received": {
    subject: "We received your application for {{job_title}} at OFC360",
    body: "Hi {{candidate_name}},\n\nThank you for applying for the {{job_title}} position at OFC360. Our recruitment team is currently reviewing your application.\n\nYou can expect an update on your candidacy within 3 business days.\n\nBest regards,\nOFC360 Talent Acquisition Team",
  },
  "Screening Result": {
    subject: "Update on your application for {{job_title}} — OFC360",
    body: "Dear {{candidate_name}},\n\nGreat news! Your qualifications and background have passed our initial AI screening review for {{job_title}}.\n\nWe would like to invite you to complete a 15-minute technical assessment round.\n\nWarm regards,\nOFC360 Recruitment Team",
  },
  "Interview Invitation": {
    subject: "Interview Invitation: {{job_title}} round with OFC360",
    body: "Hi {{candidate_name}},\n\nYou are invited to attend an interview for {{job_title}} on {{interview_time}}.\n\nGoogle Meet Link: {{meeting_link}}\n\nPlease confirm your availability by replying to this message.\n\nLooking forward to speaking with you!\n\nBest regards,\nOFC360 Team",
  },
  "Interview Reminder": {
    subject: "Reminder: Your upcoming interview tomorrow with OFC360",
    body: "Hi {{candidate_name}},\n\nThis is a quick reminder about your scheduled interview for {{job_title}} tomorrow at {{interview_time}}.\n\nMeeting link: {{meeting_link}}\n\nPlease let us know if you have any questions.\n\nBest of luck!",
  },
  "Offer Letter": {
    subject: "Congratulations! Formal Job Offer from OFC360 — {{job_title}}",
    body: "Dear {{candidate_name}},\n\nWe are absolutely delighted to offer you the position of {{job_title}} at OFC360!\n\nAttached is your formal employment agreement detailing compensation, joining date, and benefits.\n\nPlease review and electronically sign before the expiration date.\n\nWelcome to OFC360!\n\nSincerely,\nLeadership Team, OFC360",
  },
  "Rejection": {
    subject: "Update regarding your application for {{job_title}} at OFC360",
    body: "Dear {{candidate_name}},\n\nThank you for taking the time to meet with our team for the {{job_title}} position. While your background is impressive, we have decided to move forward with candidates whose current skillsets align more closely with our immediate requirements.\n\nWe will keep your resume in our talent pool for future opportunities.\n\nSincerely,\nOFC360 Talent Team",
  },
};

export function CandidateCommunicationPage() {
  const { candidates, jobs } = useRecruitment();

  // Load user dispatched messages with permanent mock purge
  const [messages, setMessages] = useState<CommMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ofc360:comm_messages");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Purge mock message IDs msg-101 to msg-103
            const clean = parsed.filter(
              (m: CommMessage) =>
                !["msg-101", "msg-102", "msg-103"].includes(m.id) &&
                ![
                  "Siddharth Nambiar",
                  "Priyanka Deshmukh",
                  "Aditya Roy",
                ].includes(m.recipientName),
            );
            if (clean.length !== parsed.length) {
              localStorage.setItem("ofc360:comm_messages", JSON.stringify(clean));
            }
            return clean;
          }
        }
      } catch {
        /* ignore */
      }
    }
    return [];
  });

  const [activeTemplateType, setActiveTemplateType] =
    useState<keyof typeof DEFAULT_TEMPLATES>("Interview Invitation");
  const [selectedChannel, setSelectedChannel] = useState<
    "Email" | "WhatsApp" | "SMS"
  >("Email");
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    candidates[0]?.id || "",
  );
  const [filterChannel, setFilterChannel] = useState("all");

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

  const [composerSubject, setComposerSubject] = useState(
    DEFAULT_TEMPLATES["Interview Invitation"].subject,
  );
  const [composerBody, setComposerBody] = useState(
    DEFAULT_TEMPLATES["Interview Invitation"].body,
  );

  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const selectedJob =
    jobs.find((j) => j.id === selectedCandidate?.jobId) || jobs[0];

  const handleTemplateSelect = (type: keyof typeof DEFAULT_TEMPLATES) => {
    setActiveTemplateType(type);
    setComposerSubject(DEFAULT_TEMPLATES[type].subject);
    setComposerBody(DEFAULT_TEMPLATES[type].body);
  };

  // Interpolated Preview
  const previewSubject = composerSubject
    .replace(/{{candidate_name}}/g, selectedCandidate?.name || "Candidate")
    .replace(
      /{{job_title}}/g,
      selectedJob?.title ||
        selectedCandidate?.appliedPosition ||
        "Position",
    );

  const previewBody = composerBody
    .replace(/{{candidate_name}}/g, selectedCandidate?.name || "Candidate")
    .replace(
      /{{job_title}}/g,
      selectedJob?.title ||
        selectedCandidate?.appliedPosition ||
        "Position",
    )
    .replace(/{{interview_time}}/g, "upcoming scheduled time")
    .replace(/{{meeting_link}}/g, "https://meet.google.com/ofc-360-call");

  const handleSendMessage = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate first.");
      return;
    }

    const newMsg: CommMessage = {
      id: `msg-${Date.now()}`,
      recipientName: selectedCandidate.name || "Candidate",
      recipientContact:
        selectedChannel === "Email"
          ? selectedCandidate.email || "candidate@example.com"
          : selectedCandidate.phone || "+91 98000 00000",
      templateType: activeTemplateType as any,
      channel: selectedChannel,
      subject: previewSubject,
      body: previewBody,
      status: "Delivered",
      sentAt: new Date().toLocaleString(),
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ofc360:comm_messages", JSON.stringify(updated));
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
        description="Deliver automated multi-channel messages across Email, WhatsApp, and SMS throughout every milestone of the candidate lifecycle."
      />

      {/* Main Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Template Selector & Message Composer */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" />
              Message Template Composer
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
              <Label className="text-xs">Recruiter Template Preset</Label>
              <div className="grid grid-cols-2 gap-1.5 mt-1 sm:grid-cols-3">
                {Object.keys(DEFAULT_TEMPLATES).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTemplateSelect(type as any)}
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
              <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.appliedPosition})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedChannel === "Email" && (
              <div>
                <Label className="text-xs">Subject Line (Template with variables)</Label>
                <Input
                  className="mt-1 h-9 text-xs font-mono"
                  value={composerSubject}
                  onChange={(e) => setComposerSubject(e.target.value)}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Message Template Body</Label>
                <span className="text-[10px] text-muted-foreground font-mono">&#123;&#123;candidate_name&#125;&#125;, &#123;&#123;job_title&#125;&#125;</span>
              </div>
              <Textarea
                className="mt-1 text-xs font-mono"
                rows={6}
                value={composerBody}
                onChange={(e) => setComposerBody(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch via {selectedChannel}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview in Realistic Client Simulator */}
        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Live {selectedChannel} Render Preview
              </span>
              <Badge variant="outline" className="text-[10px]">
                To: {selectedCandidate?.name}
              </Badge>
            </div>

            {selectedChannel === "Email" ? (
              <div className="mt-4 rounded-xl border border-border bg-background p-4 shadow-sm text-xs space-y-3">
                <div className="border-b border-border pb-2 space-y-1">
                  <div>
                    <span className="text-muted-foreground">From: </span>
                    <span className="font-semibold text-foreground">OFC360 Talent &lt;careers@ofc360.com&gt;</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">To: </span>
                    <span className="font-semibold text-foreground">{selectedCandidate?.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Subject: </span>
                    <span className="font-bold text-foreground">{previewSubject}</span>
                  </div>
                </div>

                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {previewBody}
                </p>
              </div>
            ) : (
              <div className="mt-4 max-w-sm mx-auto rounded-2xl border border-border bg-zinc-900 p-4 text-xs text-white space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="font-bold text-sm">OFC360 Verified Account</div>
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

          <div className="text-[11px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between">
            <span>Variables resolved dynamically from selected candidate record.</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => {
                navigator.clipboard.writeText(previewBody);
                toast.success("Preview copied to clipboard!");
              }}
            >
              <Copy className="h-3 w-3 mr-1" /> Copy Text
            </Button>
          </div>
        </div>
      </div>

      {/* Dispatch History & Communication Log */}
      <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">Communication Delivery History</h3>
            <p className="text-xs text-muted-foreground">Recent messages sent to candidates across channels.</p>
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
                    <p className="font-medium text-xs">No dispatched messages found</p>
                    <p className="text-[11px] mt-0.5 text-muted-foreground/80">
                      Use the template composer above to dispatch outreach messages to candidates.
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
