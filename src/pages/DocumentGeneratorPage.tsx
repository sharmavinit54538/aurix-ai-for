import { useState, useEffect, useCallback } from "react";
import { FilePlus2, FileText, Download, Wand2, Briefcase, Award, AlertTriangle, LogOut, XCircle, Loader2, User } from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiInstance from "@/api/apiInstance";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

const TEMPLATES = [
  { id: "offer", title: "Offer Letter", icon: FileText, tone: "from-sky-500/20 to-cyan-500/10" },
  { id: "appointment", title: "Appointment Letter", icon: Briefcase, tone: "from-violet-500/20 to-purple-500/10" },
  { id: "experience", title: "Experience Letter", icon: FileText, tone: "from-emerald-500/20 to-teal-500/10" },
  { id: "promotion", title: "Promotion Letter", icon: Award, tone: "from-amber-500/20 to-orange-500/10" },
  { id: "warning", title: "Warning Letter", icon: AlertTriangle, tone: "from-rose-500/20 to-red-500/10" },
  { id: "relieving", title: "Relieving Letter", icon: LogOut, tone: "from-indigo-500/20 to-blue-500/10" },
  { id: "termination", title: "Termination Letter", icon: XCircle, tone: "from-rose-500/20 to-red-500/10" },
];

export default function DocumentGeneratorPage() {
  const ws = useAurix();
  const [employees, setEmployees] = useState<Array<{ id: string; name: string; role: string }>>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState("offer");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  // Fetch live employees
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await apiInstance.get("/api/v1/employees");
      const raw = res.data?.data ?? res.data;
      const items = raw?.items ?? (Array.isArray(raw) ? raw : []);
      if (items.length > 0) {
        setEmployees(
          items.map((e: any) => ({
            id: String(e.id || e.employee_id || ""),
            name: e.full_name || e.fullName || e.name || "",
            role: e.designation || e.role || "",
          }))
        );
        return;
      }
    } catch {
      // Fallback to store employees if endpoint is pending
    }
    if (ws.employees.length > 0) {
      setEmployees(
        ws.employees.map((e) => ({
          id: e.id,
          name: e.fullName,
          role: e.designation,
        }))
      );
    }
  }, [ws.employees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setName(emp.name);
      setRole(emp.role);
    }
  };

  async function generate() {
    if (!name.trim()) {
      toast.error("Please enter or select an employee recipient");
      return;
    }
    const t = TEMPLATES.find((x) => x.id === selectedTemplate)!;
    setGenerating(true);
    const companyName = ws.company?.name || "Company";
    try {
      const res = await apiInstance.post("/api/v1/documents/generate", {
        employee_id: selectedEmpId || undefined,
        employee_name: name.trim(),
        role: role.trim(),
        template_id: t.id,
        template_title: t.title,
      });
      const generatedText = res.data?.data?.content || res.data?.content || res.data?.data?.document;
      if (generatedText) {
        setDraft(generatedText);
      } else {
        // Formatted standard legal template from API response contract
        setDraft(
`${t.title.toUpperCase()}

Date: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
To: ${name.trim()}
Designation: ${role.trim() || "—"}
Organization: ${companyName}

Dear ${name.trim()},

This official communication confirms the execution and terms of your ${t.title.toLowerCase()} with ${companyName}.

The terms and provisions outlined herein have been recorded within the enterprise human resources management system and are binding as per organizational governance policy.

For any queries regarding this documentation, please contact the People Operations Department.

Sincerely,

People Operations & HR Management Office
${companyName}`
        );
      }
      toast.success(`${t.title} generated successfully`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to generate document via AI";
      toast.error(msg);
      // Fallback template display with visible notice
      setDraft(
`${t.title.toUpperCase()} (DRAFT)

Date: ${new Date().toLocaleDateString()}
Recipient: ${name.trim()}
Role: ${role.trim() || "—"}

Notice: Document generated in local offline mode. Re-run when network service is restored.`
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!draft) return;
    const t = TEMPLATES.find((x) => x.id === selectedTemplate);
    const filename = `${name.replace(/\s+/g, "_")}_${t?.id || "document"}.txt`;
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  }

  return (
    <div>
      <AIHero
        icon={FilePlus2}
        eyebrow="AI Document Generator"
        title="Draft HR documents in seconds"
        description="Generate offers, appointment, experience, promotion, warning, relieving and termination letters."
        lastAnalysis="Live Contract Service"
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 text-sm font-semibold">Select template</div>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                const active = selectedTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 text-left text-sm transition-colors ${
                      active ? "border-foreground/30 bg-accent" : "border-border bg-background/40 hover:bg-accent/60"
                    }`}
                  >
                    <span className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${t.tone} blur-2xl`} />
                    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative font-medium">{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 text-sm font-semibold">Recipient</div>
            <div className="space-y-3">
              {employees.length > 0 && (
                <div>
                  <Label className="text-xs">Select from Active Employees</Label>
                  <Select value={selectedEmpId} onValueChange={handleSelectEmployee}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose an employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name} ({e.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label className="text-xs">Full name</Label>
                <Input
                  placeholder="Enter employee full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Role</Label>
                <Input
                  placeholder="Enter role or designation"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <Button
                onClick={generate}
                disabled={generating || !name.trim()}
                className="w-full gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" /> Generate with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="text-sm font-semibold">Preview</div>
              <Button
                variant="outline"
                size="sm"
                disabled={!draft}
                onClick={handleDownload}
                className="gap-1.5"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {draft ? (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground bg-muted/20 p-4 rounded-xl border border-border/50">
                  {draft}
                </pre>
              ) : (
                <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                  <div>
                    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-accent">
                      <FileText className="h-5 w-5" />
                    </div>
                    Select an employee, choose a template and click{" "}
                    <span className="font-medium text-foreground">Generate with AI</span> to draft a document.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
