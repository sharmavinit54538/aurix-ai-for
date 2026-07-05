import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import type { PerformanceReview } from "../types";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingReviews: PerformanceReview[];
  onImport: (imported: PerformanceReview[]) => void;
}

interface ParsedRow {
  rowNum: number;
  data: Partial<PerformanceReview>;
  errors: string[];
  warnings: string[];
  raw: Record<string, string>;
}

export function ImportDialog({
  open,
  onOpenChange,
  existingReviews,
  onImport,
}: ImportDialogProps) {
  const ws = useAurix();
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [hasErrors, setHasErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedRows([]);
    setHasErrors(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      processFile(droppedFile);
    } else {
      toast.error("Please upload a CSV template file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // CSV parsing
  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let insideQuote = false;
    let entry = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === "," && !insideQuote) {
        result.push(entry.trim());
        entry = "";
      } else {
        entry += char;
      }
    }
    result.push(entry.trim());
    return result;
  };

  const processFile = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast.error("Empty file or unreadable contents");
        return;
      }

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("File must include a header row and at least one data row");
        return;
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, "").toLowerCase().trim());
      
      const fieldMap: Record<string, keyof PerformanceReview | string> = {
        "employee id": "employeeIdCode",
        "employeeid": "employeeIdCode",
        "employee name": "employeeName",
        "employeename": "employeeName",
        "department": "department",
        "designation": "designation",
        "manager": "managerName",
        "manager name": "managerName",
        "overall rating": "overallRating",
        "overallrating": "overallRating",
        "rating": "overallRating",
        "kpi score": "kpiScore",
        "kpiscore": "kpiScore",
        "goal completion": "goalProgress",
        "goal completion %": "goalProgress",
        "goalprogress": "goalProgress",
        "status": "reviewStatus",
        "review status": "reviewStatus",
        "review date": "reviewDate",
        "reviewdate": "reviewDate",
      };

      const rows: ParsedRow[] = [];
      let globalError = false;

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());
        const raw: Record<string, string> = {};
        const draft: Partial<PerformanceReview> = {};

        headers.forEach((h, idx) => {
          const val = values[idx] || "";
          raw[h] = val;
          const key = fieldMap[h];
          if (key) {
            if (key === "overallRating") {
              draft.overallRating = val ? parseInt(val) : 3;
            } else if (key === "kpiScore") {
              draft.kpiScore = val ? parseInt(val) : 80;
            } else if (key === "goalProgress") {
              draft.goalProgress = val ? parseInt(val) : 50;
            } else {
              (draft as any)[key] = val;
            }
          }
        });

        // Validations
        const rowErrors: string[] = [];
        const rowWarnings: string[] = [];

        // Required Check
        if (!draft.employeeName) rowErrors.push("Employee Name is required");
        if (!draft.employeeIdCode) rowErrors.push("Employee ID code is required");
        if (!draft.managerName) rowErrors.push("Manager name is required");

        // Rating range checks (1-5)
        if (draft.overallRating !== undefined && (draft.overallRating < 1 || draft.overallRating > 5)) {
          rowErrors.push("Rating must be between 1 and 5");
        }

        // Date Checks
        if (draft.reviewDate) {
          const rDate = new Date(draft.reviewDate);
          const today = new Date("2026-06-26"); // Static time
          if (rDate > today) {
            rowErrors.push("Future review dates are not allowed");
          }
        } else {
          draft.reviewDate = new Date().toISOString().split("T")[0];
        }

        // Duplicate reviews check
        if (draft.employeeIdCode && draft.reviewDate) {
          const dupLocal = rows.find(
            (r) => r.data.employeeIdCode === draft.employeeIdCode && r.data.reviewDate === draft.reviewDate
          );
          const dupDb = existingReviews.find(
            (r) => r.employeeIdCode === draft.employeeIdCode && r.reviewDate === draft.reviewDate
          );
          if (dupLocal || dupDb) {
            rowErrors.push(`Duplicate Review: ${draft.employeeIdCode} has a review on ${draft.reviewDate}`);
          }
        }

        if (rowErrors.length > 0) {
          globalError = true;
        }

        rows.push({
          rowNum: i + 1,
          data: draft,
          errors: rowErrors,
          warnings: rowWarnings,
          raw,
        });
      }

      setParsedRows(rows);
      setHasErrors(globalError);
      if (globalError) {
        toast.warning("Validation errors found in spreadsheet. Clean columns before importing.");
      } else {
        toast.success(`Validated ${rows.length} rows successfully.`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (parsedRows.length === 0) {
      toast.error("No valid lines parsed to import");
      return;
    }
    if (hasErrors) {
      toast.error("Cannot import rows with errors. Upload a clean CSV template.");
      return;
    }

    const importedReviews: PerformanceReview[] = parsedRows.map((r, idx) => {
      const d = r.data;
      // Map to real employee ID if found in global store, otherwise mock it
      const matchedEmp = ws.employees.find(
        (e) => (e.employeeId || e.id).toLowerCase() === d.employeeIdCode?.toLowerCase()
      );
      
      const employeeId = matchedEmp ? matchedEmp.id : `emp_imported_${idx}`;
      const department = d.department || matchedEmp?.department || "Engineering";
      const designation = d.designation || matchedEmp?.designation || "Engineer";

      return {
        id: `rev_imported_${Math.random().toString(36).substr(2, 9)}`,
        employeeId,
        employeeName: d.employeeName || "Imported Employee",
        employeeIdCode: d.employeeIdCode || "EMP-IMP",
        department,
        designation,
        managerName: d.managerName || "Rohan Mehta",
        overallRating: d.overallRating || 3,
        kpiScore: d.kpiScore || 80,
        productivity: d.overallRating || 3,
        attendance: 4,
        communication: 3,
        leadership: 3,
        teamwork: 4,
        innovation: 3,
        problemSolving: 3,
        technicalSkills: 4,
        discipline: 4,
        goalProgress: d.goalProgress || 50,
        achievements: "Imported from batch CSV upload",
        challenges: "",
        feedback: "Continuous feedback imports",
        managerComments: "",
        promotionEligible: false,
        promotionStatus: "not_recommended",
        salaryIncrement: 0,
        bonusRecommendation: 0,
        reviewStatus: (d.reviewStatus as any) || "draft",
        reviewDate: d.reviewDate || new Date().toISOString().split("T")[0],
        lastReview: new Date().toISOString().split("T")[0],
        nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };
    });

    onImport(importedReviews);
    toast.success(`Batch Import Complete: ${importedReviews.length} performance reviews added`);
    resetState();
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const headers = "Employee ID,Employee Name,Department,Designation,Manager,Overall Rating,KPI Score,Goal Completion,Status,Review Date";
    const sample = "\nAUR-1042,Jordan Lee,Engineering,Senior Frontend Engineer,Rohan Mehta,5,95,90,completed,2026-06-25";
    const blob = new Blob([headers, sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "aurix_performance_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV spreadsheet template downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) resetState(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            📂 Import Performance Evaluations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Helper Banner */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Import Reviews Template</p>
              <p className="text-xs text-muted-foreground">
                Download the standardized CSV layout, add employee details, overall ratings (1-5), and KPI score percentage.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="text-xs font-semibold rounded-xl border-border bg-card hover:bg-muted"
            >
              📥 Download CSV Template
            </Button>
          </div>

          {/* Drag & Drop Zone */}
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-brand/60 rounded-2xl p-8 text-center cursor-pointer bg-card/20 hover:bg-card/40 transition-all duration-300 group flex flex-col items-center justify-center min-h-[180px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              <div className="h-12 w-12 rounded-2xl bg-muted group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center text-muted-foreground transition-colors mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Drag & drop your evaluations CSV, or <span className="text-brand hover:underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV formats (Max 5MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {parsedRows.length} reviews detected</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={resetState}
                  className="text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg"
                >
                  Remove File
                </Button>
              </div>

              {/* Validation errors */}
              {parsedRows.some((r) => r.errors.length > 0) && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4" />
                    Validation Errors Found in Spreadsheet
                  </div>
                  <ScrollArea className="max-h-[120px] pr-2">
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {parsedRows.map((row) => {
                        if (row.errors.length === 0) return null;
                        return (
                          <li key={row.rowNum} className="flex gap-2">
                            <span className="font-semibold text-foreground flex-shrink-0">Row {row.rowNum}:</span>
                            <span className="text-rose-500">{row.errors.join(", ")}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Preview Table */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Import Preview</p>
                <div className="rounded-xl border border-border/80 overflow-hidden bg-card/20">
                  <ScrollArea className="max-h-[220px]">
                    <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="w-[80px]">Row</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Manager</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>KPI Score</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow key={row.rowNum} className={row.errors.length > 0 ? "bg-rose-500/5" : ""}>
                            <TableCell className="font-mono text-xs">{row.rowNum}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {row.data.employeeIdCode || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {row.data.employeeName || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.data.managerName || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {row.data.overallRating ? `${row.data.overallRating} ★` : "3 ★"}
                            </TableCell>
                            <TableCell className="text-xs font-mono">{row.data.kpiScore || 80}%</TableCell>
                            <TableCell>
                              {row.errors.length > 0 ? (
                                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] px-1 py-0">
                                  Error
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] px-1 py-0">
                                  Valid
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button
            type="button"
            onClick={() => { onOpenChange(false); resetState(); }}
            className="rounded-xl border-border bg-card hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || hasErrors}
            className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Complete Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
