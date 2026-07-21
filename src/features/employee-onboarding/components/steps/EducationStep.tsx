import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GraduationCap, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface EducationStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
  refetchData: () => void;
}

interface EducationRecord {
  degree: string;
  institution: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
  grade: string;
  certificate_url?: string;
}

export function EducationStep({ initialData, onNext, onPrev, refetchData }: EducationStepProps) {
  const [records, setRecords] = useState<EducationRecord[]>(
    initialData?.education?.length > 0
      ? initialData.education
      : [
          { degree: "10th Standard", institution: "", field_of_study: "General", start_year: 2016, end_year: 2017, grade: "" },
          { degree: "12th Standard / Diploma", institution: "", field_of_study: "Science", start_year: 2018, end_year: 2019, grade: "" },
          { degree: "Graduation (Bachelor's)", institution: "", field_of_study: "Computer Science", start_year: 2019, end_year: 2023, grade: "" }
        ]
  );
  
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddField = () => {
    setRecords([
      ...records,
      { degree: "", institution: "", field_of_study: "", start_year: new Date().getFullYear() - 4, end_year: new Date().getFullYear(), grade: "" }
    ]);
  };

  const handleRemoveField = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: keyof EducationRecord, value: any) => {
    const updated = [...records];
    updated[index] = { ...updated[index], [field]: value };
    setRecords(updated);
  };

  const handleCertificateUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const response = await employeeOnboardingApi.uploadFile(file, `EDUCATION_CERTIFICATE_${index}`);
      if (response.success && response.data?.url) {
        handleInputChange(index, "certificate_url", response.data.url);
        toast.success("Certificate uploaded successfully.");
        refetchData();
      } else {
        toast.error("Failed to upload certificate.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    // Validate empty fields
    for (const r of records) {
      if (!r.degree || !r.institution || !r.grade) {
        toast.error("Please fill in the Degree, Institution, and Percentage/CGPA for all entries.");
        return;
      }
    }

    try {
      const response = await employeeOnboardingApi.saveStep4({ education_records: records });
      if (response.success) {
        toast.success("Educational details saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save details.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {records.map((record, index) => (
          <div key={index} className="relative rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-foreground">Qualification #{index + 1}</h4>
              </div>
              {records.length > 1 && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleRemoveField(index)}>
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Degree / Standard *</Label>
                <Input
                  value={record.degree}
                  onChange={(e) => handleInputChange(index, "degree", e.target.value)}
                  placeholder="e.g. 10th, 12th, B.Tech, MBA"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Institution / University *</Label>
                <Input
                  value={record.institution}
                  onChange={(e) => handleInputChange(index, "institution", e.target.value)}
                  placeholder="e.g. St. Xavier's, IIT Delhi"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Field of Study</Label>
                <Input
                  value={record.field_of_study}
                  onChange={(e) => handleInputChange(index, "field_of_study", e.target.value)}
                  placeholder="e.g. Computer Science, Arts"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Start Year *</Label>
                <Input
                  type="number"
                  value={record.start_year}
                  onChange={(e) => handleInputChange(index, "start_year", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Passing Year *</Label>
                <Input
                  type="number"
                  value={record.end_year}
                  onChange={(e) => handleInputChange(index, "end_year", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Percentage / CGPA *</Label>
                <Input
                  value={record.grade}
                  onChange={(e) => handleInputChange(index, "grade", e.target.value)}
                  placeholder="e.g. 85%, 8.5 CGPA"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-foreground">Certificate Upload</Label>
                {record.certificate_url ? (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted/40 rounded-md border border-border/60">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate flex-1">
                      Uploaded
                    </span>
                    <a href={record.certificate_url} target="_blank" rel="noreferrer">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" type="button">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      type="button"
                      onClick={() => handleInputChange(index, "certificate_url", "")}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-between h-10"
                      type="button"
                      onClick={() => document.getElementById(`cert_input_${index}`)?.click()}
                      disabled={uploadingIndex === index}
                    >
                      {uploadingIndex === index ? "Uploading..." : <>Choose File <Upload className="h-4 w-4" /></>}
                    </Button>
                    <input
                      id={`cert_input_${index}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleCertificateUpload(index, e)}
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
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
          <Plus className="h-4 w-4" /> Add Education
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
