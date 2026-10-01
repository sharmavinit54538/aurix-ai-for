import React, { useState, useEffect } from "react";
import { Wand2, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiInstance } from "@/api";
import { useAurix } from "@/lib/aurix-store";
import { RelievingLetterPreview } from "./letters/RelievingLetterPreview";
import { OfferLetterPreview } from "./letters/OfferLetterPreview";
import { NDAPreview } from "./letters/NDAPreview";
import { HandbookAcknowledgmentPreview } from "./letters/HandbookAcknowledgmentPreview";
import type { DocumentTemplateConfig } from "../lib/types";

interface EmployeeOption {
  id: string;
  fullName: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  location?: string;
  joiningDate?: string;
}

interface DocumentGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TEMPLATES: DocumentTemplateConfig[] = [
  {
    id: "offer",
    title: "Offer Letter",
    categoryGroup: "Employment",
    fields: [
      { key: "Role", label: "Role / Designation", placeholder: "e.g. Software Engineer", required: true },
      { key: "Salary (LPA)", label: "Salary (LPA)", placeholder: "e.g. 12.0", required: true },
      { key: "Start Date", label: "Anticipated Start Date", placeholder: "YYYY-MM-DD", required: true },
    ],
  },
  {
    id: "relieving",
    title: "Relieving Letter",
    categoryGroup: "Employment",
    fields: [
      { key: "Role", label: "Separating Designation", placeholder: "e.g. Senior Developer", required: true },
      { key: "Last Working Day", label: "Last Working Day", placeholder: "YYYY-MM-DD", required: true },
      { key: "Reason for Leaving", label: "Reason for Leaving", placeholder: "e.g. Better Career Prospects", required: false },
    ],
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    categoryGroup: "Company Documents",
    fields: [
      { key: "Recipient Name", label: "Recipient Name", placeholder: "Recipient or Contractor Name", required: true },
      { key: "Witness Name", label: "Witness Name", placeholder: "e.g. Corporate Legal Counsel", required: false },
      { key: "Duration (Years)", label: "Duration (Years)", placeholder: "e.g. 2", required: true },
    ],
  },
  {
    id: "handbook",
    title: "Company Handbook Acknowledgment",
    categoryGroup: "Company Documents",
    fields: [
      { key: "Version Date", label: "Handbook Version Date", placeholder: "YYYY-MM-DD", required: true },
      { key: "Signee Designation", label: "Signee Designation", placeholder: "e.g. Associate", required: false },
    ],
  },
];

export const DocumentGeneratorDialog: React.FC<DocumentGeneratorDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const ws = useAurix();
  const company = ws.company;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("offer");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("general");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [_isSearchingEmployees, setIsSearchingEmployees] = useState(false);
  const [employeeQuery] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ isOfficial: boolean } | null>(null);

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Lazy search for employees
  useEffect(() => {
    if (open) {
      let isMounted = true;
      const fetchEmps = async () => {
        setIsSearchingEmployees(true);
        try {
          const res = await apiInstance.get("/employees", {
            params: { search: employeeQuery.trim() || undefined, limit: 20 },
          });
          const raw = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
          if (Array.isArray(raw) && isMounted) {
            setEmployees(
              raw.map((e: Record<string, unknown>) => ({
                id: String(e.id),
                fullName:
                  [e.first_name, e.last_name].filter(Boolean).join(" ").trim() ||
                  String(e.full_name || "Employee"),
                employeeId: String(e.employee_id || e.employee_code || ""),
                department: String(e.department || ""),
                designation: String(e.designation || ""),
                location: String(e.work_location || ""),
                joiningDate: String(e.joining_date || ""),
              }))
            );
          }
        } catch {
          // Keep existing
        } finally {
          if (isMounted) setIsSearchingEmployees(false);
        }
      };

      const timer = setTimeout(fetchEmps, 300);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [open, employeeQuery]);

  const selectedEmployee =
    selectedEmployeeId === "general"
      ? null
      : employees.find((e) => e.id === selectedEmployeeId) || null;

  // Auto-fill available employee details into fields
  const handleAutoFill = () => {
    if (!selectedEmployee) return;
    const updated: Record<string, string> = { ...fields };
    if (selectedEmployee.designation) {
      updated["Role"] = selectedEmployee.designation;
      updated["Signee Designation"] = selectedEmployee.designation;
    }
    if (selectedEmployee.fullName) {
      updated["Recipient Name"] = selectedEmployee.fullName;
    }
    setFields(updated);
  };

  // Validate required fields
  const areRequiredFieldsFilled = currentTemplate.fields
    .filter((f) => f.required)
    .every((f) => (fields[f.key] || "").trim().length > 0);

  const handleGenerate = async () => {
    if (!areRequiredFieldsFilled) {
      toast.error("Please fill in all required template parameters.");
      return;
    }

    setIsGenerating(true);
    try {
      // Attempt backend generate endpoint if available
      try {
        await apiInstance.post("/documents/generate", {
          template_id: selectedTemplateId,
          employee_id: selectedEmployeeId === "general" ? undefined : selectedEmployeeId,
          parameters: fields,
        });
        setGeneratedResult({ isOfficial: true });
        toast.success("Document generated successfully!");
      } catch {
        // Backend /documents/generate is not wired yet. Fall back gracefully to client draft preview.
        setGeneratedResult({ isOfficial: false });
        toast.info("Draft preview ready (Official generation endpoint pending backend wiring).");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-background border-border shadow-2xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-5 h-[680px] divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Left Configuration Panel */}
          <div className="md:col-span-2 p-5 flex flex-col justify-between h-full bg-card/40">
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold flex items-center gap-1.5">
                  <Wand2 className="h-4 w-4 text-indigo-500" />
                  AI Document Generator
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Generate compliant contracts & HR documents.
                </p>
              </div>

              {/* Template Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Document Template</Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={(val) => {
                    setSelectedTemplateId(val);
                    setFields({});
                    setGeneratedResult(null);
                  }}
                >
                  <SelectTrigger className="h-8 bg-background border-border text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATES.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">For Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={(val) => {
                    setSelectedEmployeeId(val);
                    setGeneratedResult(null);
                  }}
                >
                  <SelectTrigger className="h-8 bg-background border-border text-xs">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="general">General / Standard Template</SelectItem>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName} {emp.employeeId ? `(${emp.employeeId})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Parameters */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Parameters
                  </span>
                  {selectedEmployee && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAutoFill}
                      className="h-6 text-[10px] text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-2 cursor-pointer"
                    >
                      ✨ Auto-Fill Known
                    </Button>
                  )}
                </div>

                {currentTemplate.fields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-[11px] text-foreground/80">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </Label>
                    <Input
                      value={fields[f.key] || ""}
                      onChange={(e) =>
                        setFields({ ...fields, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      className="h-8 bg-background border-border text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !areRequiredFieldsFilled}
                className="w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Wand2 className="h-3.5 w-3.5" />
                {isGenerating ? "Drafting..." : "Generate Document"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>

          {/* Right Preview Panel */}
          <div className="md:col-span-3 p-5 flex flex-col justify-between h-full bg-background overflow-hidden">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Live Document Preview
                </span>
                <Badge
                  variant="outline"
                  className={`text-[9px] ${
                    generatedResult?.isOfficial
                      ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                      : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                  }`}
                >
                  {generatedResult?.isOfficial
                    ? "Official Document"
                    : "Draft Preview (Not Official)"}
                </Badge>
              </div>

              <div className="flex-1 overflow-auto p-1 mt-3">
                {selectedTemplateId === "relieving" && (
                  <RelievingLetterPreview
                    company={company}
                    employee={selectedEmployee}
                    fields={fields}
                    isOfficial={generatedResult?.isOfficial}
                  />
                )}
                {selectedTemplateId === "offer" && (
                  <OfferLetterPreview
                    company={company}
                    employee={selectedEmployee}
                    fields={fields}
                    isOfficial={generatedResult?.isOfficial}
                  />
                )}
                {selectedTemplateId === "nda" && (
                  <NDAPreview
                    company={company}
                    employee={selectedEmployee}
                    fields={fields}
                    isOfficial={generatedResult?.isOfficial}
                  />
                )}
                {selectedTemplateId === "handbook" && (
                  <HandbookAcknowledgmentPreview
                    company={company}
                    employee={selectedEmployee}
                    fields={fields}
                    isOfficial={generatedResult?.isOfficial}
                  />
                )}
              </div>
            </div>

            {/* Bottom Status & Save */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px]">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                {!generatedResult?.isOfficial
                  ? "Save to Vault disabled until backend generator is wired."
                  : "Official document ready."}
              </span>
              <Button
                size="sm"
                disabled={!generatedResult?.isOfficial}
                title="Save to Vault disabled until official backend endpoint is wired"
                className="h-8 text-xs cursor-pointer"
              >
                Save to Vault
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
