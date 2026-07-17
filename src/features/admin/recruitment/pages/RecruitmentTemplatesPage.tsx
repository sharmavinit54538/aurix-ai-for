
import { useState } from "react";
import { Copy, Mail, Plus, Sparkles, Trash2, Check } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiInstance } from "@/api";

interface Template {
  id: string;
  name: string;
  category: "Outreach" | "Interview" | "Offer" | "Rejection" | "Onboarding";
  subject: string;
  body: string;
  usage: number;
}

const seed: Template[] = [
  {
    id: "t_outreach_1",
    name: "Outreach - Initial Contact",
    category: "Outreach",
    subject: "Opportunities at Aurix - {{candidate.first_name}}",
    body: "Hi {{candidate.first_name}},\n\nI came across your profile and was really impressed by your background in software engineering. We are looking for talented people to join our team at Aurix.\n\nWould you be open to a quick 15-minute introductory call this week to discuss potential opportunities?\n\nBest regards,\nRecruitment Team, Aurix",
    usage: 14,
  },
  {
    id: "t_interview_1",
    name: "Interview - Schedule Confirmation",
    category: "Interview",
    subject: "Interview Scheduled with Aurix - {{candidate.first_name}}",
    body: "Hi {{candidate.first_name}},\n\nThank you for scheduling your interview round. Here are the details of your upcoming slot:\n\n- Date/Time: {{interview.date}} at {{interview.time}}\n- Meeting Link: {{interview.meeting_url}}\n\nIf you have any questions or need to reschedule, please let us know at least 24 hours in advance.\n\nLooking forward to speaking with you!\n\nBest regards,\nRecruitment Team, Aurix",
    usage: 32,
  },
  {
    id: "t_offer_1",
    name: "Offer - Formal Offer Letter",
    category: "Offer",
    subject: "Job Offer from Aurix - {{candidate.first_name}}",
    body: "Dear {{candidate.first_name}},\n\nWe are absolutely thrilled to offer you the position of {{job.title}} at Aurix! The entire team was incredibly impressed by your interviews, and we believe you will be a fantastic addition.\n\nAttached is the formal offer letter specifying your compensation details and target joining date.\n\nPlease review and sign the document to confirm your acceptance.\n\nWarm regards,\nRecruitment Team, Aurix",
    usage: 5,
  },
  {
    id: "t_rejection_1",
    name: "Rejection - Application Outcome",
    category: "Rejection",
    subject: "Update on your application with Aurix",
    body: "Dear {{candidate.first_name}},\n\nThank you for taking the time to apply and interview for the {{job.title}} role at Aurix. We truly appreciate the opportunity to review your qualifications.\n\nWhile our team was impressed by your skills, we have decided to move forward with another candidate whose experience matches the position's requirements more closely at this time.\n\nWe will keep your profile in our Talent Pool and reach out if other matching roles open up in the future. We wish you the very best in your search.\n\nSincerely,\nRecruitment Team, Aurix",
    usage: 21,
  },
  {
    id: "t_onboarding_1",
    name: "Onboarding - Welcome Day 1",
    category: "Onboarding",
    subject: "Welcome to Aurix! Day 1 Prep & Details - {{candidate.first_name}}",
    body: "Hi {{candidate.first_name}},\n\nWelcome to Aurix! We are excited to have you join us next week.\n\nTo help you prepare for Day 1, here is some key information:\n\n- Start Time: 9:30 AM\n- Location: Bengaluru HQ Office\n- Dress Code: Smart Casual\n\nYour laptop and IT accounts have been set up and will be handed over to you during your onboarding session. Let us know if you need any assistance beforehand!\n\nWelcome aboard!\n\nBest regards,\nHR Operations Team, Aurix",
    usage: 8,
  },
];

const CAT_TONE: Record<Template["category"], string> = {
  Outreach: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  Interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  Offer: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  Rejection: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
  Onboarding: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
};

export function RecruitmentTemplatesPage() {
  const [items, setItems] = useState<Template[]>(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("aurix.recruitment.templates");
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // ignore
        }
      }
    }
    return seed;
  });

  const [active, setActive] = useState<string>("t_outreach_1");
  const current = items.find((t) => t.id === active) ?? items[0] ?? null;

  // AI Draft Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({
    name: "AI Generated Template",
    category: "Outreach" as Template["category"],
    prompt: "Write a warm, engaging initial outreach email inviting the candidate to chat about open software engineer roles.",
  });

  const saveItems = (newItems: Template[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aurix.recruitment.templates", JSON.stringify(newItems));
    }
  };

  const update = (patch: Partial<Template>) => {
    if (!current) return;
    const next = items.map((t) => (t.id === current.id ? { ...t, ...patch } : t));
    saveItems(next);
  };

  const handleDuplicate = () => {
    if (!current) return;
    const newTId = `t_${Date.now()}`;
    const newT: Template = {
      ...current,
      id: newTId,
      name: `${current.name} (Copy)`,
      usage: 0,
    };
    saveItems([...items, newT]);
    setActive(newTId);
    toast.success("Template duplicated successfully!");
  };

  const handleDelete = () => {
    if (!current) return;
    const next = items.filter((t) => t.id !== current.id);
    saveItems(next);
    setActive(next[0]?.id || "");
    toast.success("Template deleted successfully!");
  };

  function createTemplate() {
    const newTId = `t_${Date.now()}`;
    const newT: Template = {
      id: newTId,
      name: "New Email Template",
      category: "Outreach",
      subject: "Greetings {{candidate.first_name}}",
      body: "Hi {{candidate.first_name}},\n\n",
      usage: 0
    };
    saveItems([...items, newT]);
    setActive(newTId);
    toast.success("New template created!");
  }

  const handleAiDraftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiForm.prompt) {
      toast.error("Please enter a prompt or instruction.");
      return;
    }

    setGenerating(true);
    try {
      const response = await apiInstance.post("/ai/copilot", {
        tool: "email",
        user_input: `${aiForm.prompt} (Format the response as: Subject: [Subject Line] followed by the Body content)`,
      });

      const text = response.data?.data || "";
      if (text) {
        let subject = `Opportunities at Aurix`;
        let body = text;

        const subjectMatch = text.match(/Subject:\s*(.*)/i);
        if (subjectMatch) {
          subject = subjectMatch[1].trim();
          body = text.replace(/Subject:\s*(.*)/i, "").trim();
        }

        const newTId = `t_${Date.now()}`;
        const newT: Template = {
          id: newTId,
          name: aiForm.name,
          category: aiForm.category,
          subject: subject,
          body: body,
          usage: 0,
        };

        saveItems([...items, newT]);
        setActive(newTId);
        toast.success("AI draft generated and added to templates!");
        setShowAiModal(false);
      } else {
        toast.error("AI returned an empty response.");
      }
    } catch (err) {
      toast.error("Failed to generate AI draft. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Email Templates"
        description="Reusable, branded messages used across the hiring pipeline."
        actions={
          <>
            <Button variant="outline" onClick={() => setShowAiModal(true)}><Sparkles className="mr-2 h-4 w-4" />AI Draft</Button>
            <Button onClick={createTemplate}><Plus className="mr-2 h-4 w-4" />New Template</Button>
          </>
        }
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-medium">No email templates available</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create standard message templates for outreach, interviews, and offers.
          </p>
          <Button onClick={createTemplate} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {items.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all backdrop-blur-xl cursor-pointer ${
                  current && current.id === t.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"
                }`}
              >
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium text-foreground">{t.name}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ring-1 ${CAT_TONE[t.category]}`}>{t.category}</span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{t.subject}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">Used {t.usage} times</div>
                </div>
              </button>
            ))}
          </div>

          {current && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <Input value={current.name} onChange={(e) => update({ name: e.target.value })} className="max-w-md text-base font-semibold" />
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={handleDuplicate}><Copy className="mr-1 h-3.5 w-3.5" />Duplicate</Button>
                  <Button size="sm" variant="outline" onClick={handleDelete} className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40">
                    <Trash2 className="mr-1 h-3.5 w-3.5" />Delete
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Category</label>
                  <select
                    value={current.category}
                    onChange={(e) => update({ category: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Outreach" className="bg-background text-foreground">Outreach</option>
                    <option value="Interview" className="bg-background text-foreground">Interview</option>
                    <option value="Offer" className="bg-background text-foreground">Offer</option>
                    <option value="Rejection" className="bg-background text-foreground">Rejection</option>
                    <option value="Onboarding" className="bg-background text-foreground">Onboarding</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Subject Line</label>
                  <Input value={current.subject} onChange={(e) => update({ subject: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Email Body</label>
                  <Textarea value={current.body} onChange={(e) => update({ body: e.target.value })} className="mt-1 min-h-[250px] font-mono text-sm leading-relaxed" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Draft Template Modal */}
      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Email Template Generator</DialogTitle>
            <DialogDescription>Draft professional templates using the AI recruiting assistant copilot.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAiDraftSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="ai-name">Template Name *</Label>
              <Input
                id="ai-name"
                value={aiForm.name}
                onChange={(e) => setAiForm({ ...aiForm, name: e.target.value })}
                placeholder="e.g. Outreach - Senior Frontend"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ai-category">Category *</Label>
              <select
                id="ai-category"
                value={aiForm.category}
                onChange={(e) => setAiForm({ ...aiForm, category: e.target.value as any })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="Outreach">Outreach</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejection">Rejection</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ai-prompt">Instructions for AI *</Label>
              <Textarea
                id="ai-prompt"
                value={aiForm.prompt}
                onChange={(e) => setAiForm({ ...aiForm, prompt: e.target.value })}
                placeholder="Describe what the email should say and its tone..."
                rows={4}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAiModal(false)}>Cancel</Button>
              <Button type="submit" disabled={generating}>
                {generating ? "Drafting with AI..." : "Generate Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

