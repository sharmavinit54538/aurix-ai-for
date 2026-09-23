import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Mail,
  Plus,
  Trash2,
  Check,
  CalendarDays,
  FileCheck,
  UserX,
  Package,
  FileSearch,
  Eye,
  Edit3,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type TemplateCategory =
  | "Outreach"
  | "Interview"
  | "Offer"
  | "Rejection"
  | "Onboarding"
  | "Assessment";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  subject: string;
  body: string;
}

interface CategoryConfig {
  id: TemplateCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CATEGORY_CONFIG: Record<TemplateCategory, CategoryConfig> = {
  Outreach: {
    id: "Outreach",
    label: "Outreach",
    icon: Mail,
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
  },
  Interview: {
    id: "Interview",
    label: "Interview",
    icon: CalendarDays,
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  Offer: {
    id: "Offer",
    label: "Offer",
    icon: FileCheck,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  Rejection: {
    id: "Rejection",
    label: "Rejection",
    icon: UserX,
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  },
  Onboarding: {
    id: "Onboarding",
    label: "Onboarding",
    icon: Package,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  Assessment: {
    id: "Assessment",
    label: "Assessment",
    icon: FileSearch,
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
};

const LOCAL_STORAGE_KEY = "aurix.recruitment.templates";

const MERGE_TAGS = [
  { tag: "{{candidate.first_name}}", label: "First Name" },
  { tag: "{{candidate.last_name}}", label: "Last Name" },
  { tag: "{{job.title}}", label: "Job Title" },
  { tag: "{{company.name}}", label: "Company" },
  { tag: "{{interview.date}}", label: "Interview Date" },
  { tag: "{{interview.time}}", label: "Interview Time" },
  { tag: "{{interview.meeting_url}}", label: "Meeting Link" },
  { tag: "{{joining.date}}", label: "Joining Date" },
  { tag: "{{sender.name}}", label: "Sender Name" },
];

export function RecruitmentTemplatesPage() {
  const [items, setItems] = useState<Template[]>(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Filter out any mock/seed templates and 'New Template' placeholders
            return parsed.filter(
              (item) =>
                !item.id?.startsWith("t_") &&
                !item.id?.startsWith("tmpl_") &&
                item.name !== "New Template"
            );
          }
        } catch {
          // ignore error
        }
      }
    }
    return [];
  });

  // Permanently purge any old mock data from browser localStorage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const cleanTemplates = parsed.filter(
              (item) =>
                !item.id?.startsWith("t_") &&
                !item.id?.startsWith("tmpl_") &&
                item.name !== "New Template"
            );
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanTemplates));
            setItems(cleanTemplates);
          }
        } catch {
          window.localStorage.removeItem(LOCAL_STORAGE_KEY);
          setItems([]);
        }
      }
    }
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [testEmailRecipient, setTestEmailRecipient] = useState("candidate@example.com");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveItems = (newItems: Template[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const currentTemplate = items.find((t) => t.id === selectedId) || null;

  const updateCurrent = (patch: Partial<Template>) => {
    if (!currentTemplate) return;
    const next = items.map((t) => (t.id === currentTemplate.id ? { ...t, ...patch } : t));
    saveItems(next);
  };

  const handleDuplicate = (templateToDup: Template) => {
    const newTId = `template_${Date.now()}`;
    const newT: Template = {
      ...templateToDup,
      id: newTId,
      name: `${templateToDup.name} (Copy)`,
    };
    const next = [newT, ...items];
    saveItems(next);
    setSelectedId(newTId);
    toast.success("Template duplicated successfully!");
  };

  const handleDelete = (idToDelete: string) => {
    const next = items.filter((t) => t.id !== idToDelete);
    saveItems(next);
    if (selectedId === idToDelete) {
      setSelectedId(null);
    }
    toast.success("Template deleted successfully!");
  };

  const createTemplate = () => {
    const newTId = `template_${Date.now()}`;
    const newT: Template = {
      id: newTId,
      name: "Custom Template",
      category: "Outreach",
      description: "Custom template for recruiting communications.",
      subject: "",
      body: "",
    };
    saveItems([newT, ...items]);
    setSelectedId(newTId);
  };

  const handleInsertTag = (tag: string) => {
    if (!currentTemplate) return;
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const originalText = currentTemplate.body;
      const newBody = originalText.substring(0, start) + tag + originalText.substring(end);
      updateCurrent({ body: newBody });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      updateCurrent({ body: `${currentTemplate.body} ${tag}` });
    }
  };

  const handleSendTestEmail = () => {
    if (!testEmailRecipient) {
      toast.error("Please provide a valid recipient email.");
      return;
    }
    toast.success(`Test email dispatched to ${testEmailRecipient}!`);
  };

  const resolvePreviewContent = (template: Template) => {
    let subject = template.subject || "(No subject)";
    let body = template.body || "(No message body)";

    const sampleData: Record<string, string> = {
      "{{candidate.first_name}}": "Alex",
      "{{candidate.last_name}}": "Johnson",
      "{{job.title}}": "Senior Engineer",
      "{{company.name}}": "OFC360",
      "{{interview.date}}": "Thursday, Oct 12",
      "{{interview.time}}": "03:00 PM IST",
      "{{interview.meeting_url}}": "https://meet.google.com/ofc-round",
      "{{joining.date}}": "Monday, Nov 6, 2026",
      "{{sender.name}}": "Recruiting Team",
    };

    Object.entries(sampleData).forEach(([token, value]) => {
      subject = subject.replaceAll(token, value);
      body = body.replaceAll(token, value);
    });

    return { subject, body };
  };

  return (
    <div className="space-y-6">
      {/* ── 1. SETTINGS CARD GRID VIEW ──────────────────────────────── */}
      {!selectedId ? (
        <div className="space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-2xl bg-card/30">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">No templates available</h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Create a communication template for your recruitment workflow.
              </p>
              <Button onClick={createTemplate} size="sm" className="mt-4">
                <Plus className="mr-1.5 h-4 w-4" /> Create Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((template) => {
                const meta =
                  CATEGORY_CONFIG[template.category] || CATEGORY_CONFIG.Outreach;
                const Icon = meta.icon;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedId(template.id)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${meta.color} transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {template.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {template.description || template.subject}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ── 2. DETAIL / EDITOR VIEW ─────────────────────────────────── */
        currentTemplate && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-border bg-card/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("edit")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === "edit"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      viewMode === "preview"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" /> Live Preview
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicate(currentTemplate)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(currentTemplate.id)}
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success("Template saved successfully!");
                    setSelectedId(null);
                  }}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </div>

            {/* Template Header Card */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br border ${
                    CATEGORY_CONFIG[currentTemplate.category]?.color ||
                    CATEGORY_CONFIG.Outreach.color
                  }`}
                >
                  {(() => {
                    const Icon =
                      CATEGORY_CONFIG[currentTemplate.category]?.icon || Mail;
                    return <Icon className="h-5 w-5" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {currentTemplate.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentTemplate.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Mode Content */}
            {viewMode === "edit" ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Form Fields */}
                <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <Label htmlFor="t-name" className="text-xs font-medium text-muted-foreground">
                        Template Name *
                      </Label>
                      <Input
                        id="t-name"
                        value={currentTemplate.name}
                        onChange={(e) => updateCurrent({ name: e.target.value })}
                        className="mt-1 font-semibold"
                        placeholder="Template Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="t-cat" className="text-xs font-medium text-muted-foreground">
                        Category *
                      </Label>
                      <select
                        id="t-cat"
                        value={currentTemplate.category}
                        onChange={(e) =>
                          updateCurrent({ category: e.target.value as TemplateCategory })
                        }
                        className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Outreach" className="bg-background text-foreground">
                          Outreach
                        </option>
                        <option value="Interview" className="bg-background text-foreground">
                          Interview
                        </option>
                        <option value="Offer" className="bg-background text-foreground">
                          Offer
                        </option>
                        <option value="Rejection" className="bg-background text-foreground">
                          Rejection
                        </option>
                        <option value="Onboarding" className="bg-background text-foreground">
                          Onboarding
                        </option>
                        <option value="Assessment" className="bg-background text-foreground">
                          Assessment
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="t-desc" className="text-xs font-medium text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      id="t-desc"
                      value={currentTemplate.description}
                      onChange={(e) => updateCurrent({ description: e.target.value })}
                      className="mt-1"
                      placeholder="Brief overview of when this template is used..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="t-subject" className="text-xs font-medium text-muted-foreground">
                      Subject Line *
                    </Label>
                    <Input
                      id="t-subject"
                      value={currentTemplate.subject}
                      onChange={(e) => updateCurrent({ subject: e.target.value })}
                      className="mt-1"
                      placeholder="Subject line"
                    />
                  </div>

                  {/* Merge Tag Chips */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Dynamic Merge Variables (click to insert into body)
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        Replaced with candidate info
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {MERGE_TAGS.map((tag) => (
                        <button
                          key={tag.tag}
                          type="button"
                          onClick={() => handleInsertTag(tag.tag)}
                          className="rounded-md border border-border/80 bg-accent/40 px-2 py-1 text-[11px] font-mono font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 cursor-pointer"
                        >
                          {tag.tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="t-body" className="text-xs font-medium text-muted-foreground">
                      Email Body Content *
                    </Label>
                    <Textarea
                      ref={textareaRef}
                      id="t-body"
                      value={currentTemplate.body}
                      onChange={(e) => updateCurrent({ body: e.target.value })}
                      className="mt-1 min-h-[300px] font-mono text-sm leading-relaxed"
                      placeholder="Type your message here..."
                    />
                  </div>
                </div>

                {/* Quick Preview Panel */}
                <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs lg:col-span-1">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Eye className="h-4 w-4 text-primary" /> Candidate Preview
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is how the email appears with sample candidate placeholders resolved.
                  </p>

                  <div className="rounded-xl border border-border/80 bg-background/60 p-4 text-xs space-y-3">
                    <div className="border-b border-border/40 pb-2 space-y-1">
                      <div className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">From:</span> OFC360 Talent &lt;recruiting@ofc360.com&gt;
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">To:</span> Alex Johnson &lt;alex.johnson@example.com&gt;
                      </div>
                      <div className="text-[11px] font-medium text-foreground">
                        <span className="font-semibold text-muted-foreground">Subject:</span>{" "}
                        {resolvePreviewContent(currentTemplate).subject}
                      </div>
                    </div>
                    <div className="whitespace-pre-line text-foreground/90 font-sans text-xs leading-relaxed max-h-[300px] overflow-y-auto">
                      {resolvePreviewContent(currentTemplate).body}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Test Dispatch
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        placeholder="test@company.com"
                        className="text-xs h-8"
                      />
                      <Button size="sm" variant="outline" className="h-8 shrink-0" onClick={handleSendTestEmail}>
                        <Send className="mr-1 h-3 w-3" /> Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Full Live Preview Mode */
              <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl shadow-xs max-w-3xl mx-auto space-y-6">
                <div className="border-b border-border pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Simulated Candidate Inbox
                    </span>
                    <span className="text-xs text-muted-foreground">Today at 09:41 AM</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {resolvePreviewContent(currentTemplate).subject}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <div className="h-7 w-7 rounded-full bg-primary/20 text-primary grid place-items-center font-bold text-xs">
                      OF
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">OFC360 Talent Acquisition</span>{" "}
                      &lt;recruiting@ofc360.com&gt;
                    </div>
                  </div>
                </div>

                <div className="whitespace-pre-line text-sm text-foreground/90 leading-relaxed font-sans min-h-[200px]">
                  {resolvePreviewContent(currentTemplate).body}
                </div>

                <div className="pt-6 border-t border-border flex items-center justify-between">
                  <Button variant="outline" onClick={() => setViewMode("edit")}>
                    <Edit3 className="mr-1.5 h-4 w-4" /> Back to Edit
                  </Button>
                  <Button onClick={handleSendTestEmail}>
                    <Send className="mr-1.5 h-4 w-4" /> Send Test Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
