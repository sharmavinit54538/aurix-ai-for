import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Briefcase, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface ExperienceStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
  refetchData: () => void;
}

interface ExperienceRecord {
  company_name: string;
  designation: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  ctc: number;
  manager_name: string;
  reason_for_leaving: string;
  experience_certificate_url?: string;
  relieving_letter_url?: string;
  salary_slip_url?: string;
}

export function ExperienceStep({ initialData, onNext, onPrev, refetchData }: ExperienceStepProps) {
  const [records, setRecords] = useState<ExperienceRecord[]>(
    initialData?.experience?.length > 0
      ? initialData.experience
      : [
          { company_name: "", designation: "", employment_type: "FULL_TIME", start_date: "", end_date: "", is_current: false, description: "", ctc: 0, manager_name: "", reason_for_leaving: "" }
        ]
  );
  
  const [uploadingDoc, setUploadingDoc] = useState<{ index: number; field: string } | null>(null);

  const handleAddField = () => {
    setRecords([
      ...records,
      { company_name: "", designation: "", employment_type: "FULL_TIME", start_date: "", end_date: "", is_current: false, description: "", ctc: 0, manager_name: "", reason_for_leaving: "" }
    ]);
  };

  const handleRemoveField = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof ExperienceRecord, value: any) => {
    const updated = [...records];
    updated[index] = { ...updated[index], [field]: value };
    setRecords(updated);
  };

  const handleDocumentUpload = async (index: number, field: "experience_certificate_url" | "relieving_letter_url" | "salary_slip_url", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc({ index, field });
    try {
      const response = await employeeOnboardingApi.uploadFile(file, `EXPERIENCE_${field.toUpperCase()}_${index}`);
      if (response.success && response.data?.url) {
        handleInputChange(index, field, response.data.url);
        toast.success("Document uploaded successfully.");
        refetchData();
      } else {
        toast.error("Failed to upload document.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSave = async () => {
    // Validate empty fields
    for (const r of records) {
      if (!r.company_name || !r.designation || !r.start_date) {
        toast.error("Please fill in Company Name, Designation, and Start Date for all entries.");
        return;
      }
      if (!r.is_current && !r.end_date) {
        toast.error("Please specify End Date for previous companies.");
        return;
      }
    }

    try {
      const response = await employeeOnboardingApi.saveStep5({ experience_records: records });
      if (response.success) {
        toast.success("Professional experience saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save experience details.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {records.map((record, index) => (
          <div key={index} className="relative rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-foreground">Experience Record #{index + 1}</h4>
              </div>
              {records.length > 1 && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleRemoveField(index)}>
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Company Name *</Label>
                <Input
                  value={record.company_name}
                  onChange={(e) => handleInputChange(index, "company_name", e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Designation *</Label>
                <Input
                  value={record.designation}
                  onChange={(e) => handleInputChange(index, "designation", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Annual CTC *</Label>
                <Input
                  type="number"
                  value={record.ctc}
                  onChange={(e) => handleInputChange(index, "ctc", parseFloat(e.target.value))}
                  placeholder="CTC in INR"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Start Date *</Label>
                <Input
                  type="date"
                  value={record.start_date}
                  onChange={(e) => handleInputChange(index, "start_date", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">End Date</Label>
                <Input
                  type="date"
                  value={record.end_date}
                  disabled={record.is_current}
                  onChange={(e) => handleInputChange(index, "end_date", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  id={`current_${index}`}
                  checked={record.is_current}
                  onCheckedChange={(checked) => {
                    handleInputChange(index, "is_current", !!checked);
                    if (checked) handleInputChange(index, "end_date", "");
                  }}
                />
                <Label htmlFor={`current_${index}`} className="text-sm font-medium cursor-pointer">
                  Currently working here
                </Label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Manager Name</Label>
                <Input
                  value={record.manager_name}
                  onChange={(e) => handleInputChange(index, "manager_name", e.target.value)}
                  placeholder="Reporting Manager's Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Reason for Leaving</Label>
                <Input
                  value={record.reason_for_leaving}
                  onChange={(e) => handleInputChange(index, "reason_for_leaving", e.target.value)}
                  placeholder="e.g. Better Opportunity"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-2">
              {/* Experience Certificate */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Experience Certificate</Label>
                {record.experience_certificate_url ? (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted/40 rounded-md border border-border/60">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate flex-1">Uploaded</span>
                    <a href={record.experience_certificate_url} target="_blank" rel="noreferrer">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" type="button">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10"
                      type="button"
                      onClick={() => document.getElementById(`exp_cert_${index}`)?.click()}
                    >
                      Choose File <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id={`exp_cert_${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(index, "experience_certificate_url", e)}
                    />
                  </div>
                )}
              </div>

              {/* Relieving Letter */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Relieving Letter</Label>
                {record.relieving_letter_url ? (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted/40 rounded-md border border-border/60">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate flex-1">Uploaded</span>
                    <a href={record.relieving_letter_url} target="_blank" rel="noreferrer">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" type="button">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10"
                      type="button"
                      onClick={() => document.getElementById(`rel_let_${index}`)?.click()}
                    >
                      Choose File <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id={`rel_let_${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(index, "relieving_letter_url", e)}
                    />
                  </div>
                )}
              </div>

              {/* Salary Slip */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">Latest Salary Slip</Label>
                {record.salary_slip_url ? (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted/40 rounded-md border border-border/60">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate flex-1">Uploaded</span>
                    <a href={record.salary_slip_url} target="_blank" rel="noreferrer">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" type="button">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10"
                      type="button"
                      onClick={() => document.getElementById(`sal_slip_${index}`)?.click()}
                    >
                      Choose File <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      id={`sal_slip_${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload(index, "salary_slip_url", e)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <Button variant="outline" type="button" onClick={handleAddField} className="gap-2">
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" onClick={handleSave}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
