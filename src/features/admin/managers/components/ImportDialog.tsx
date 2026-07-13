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
import { Loader } from "@/components/aurix/Loader";
import type { Manager } from "../types";
import { validateEmail, validatePhone } from "../utils";
import { toast } from "sonner";
import { DEPARTMENTS, OFFICES, SHIFTS, DEFAULT_PERMISSIONS } from "../constants";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingManagers: Manager[];
  submitting?: boolean;
  onImport: (imported: Manager[]) => void | Promise<void>;
}

interface ParsedRow {
  rowNum: number;
  data: Partial<Manager>;
  errors: string[];
  warnings: string[];
  raw: Record<string, string>;
}

export function ImportDialog({
  open,
  onOpenChange,
  existingManagers,
  submitting = false,
  onImport,
}: ImportDialogProps) {
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
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) {
      processFile(droppedFile);
    } else {
      toast.error("Please upload a CSV or Excel template file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // CSV Parsing helper (supports quotes and commas)
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
      
      // Expected header map to normalize fields
      const fieldMap: Record<string, keyof Manager | string> = {
        "employee id": "employeeId",
        "employeeid": "employeeId",
        "first name": "firstName",
        "firstname": "firstName",
        "last name": "lastName",
        "lastname": "lastName",
        "email": "email",
        "phone": "phone",
        "department": "department",
        "designation": "designation",
        "office": "office",
        "status": "status",
        "role": "managerRole",
        "managerrole": "managerRole",
        "reporting manager": "reportingManagerName",
        "reportingmanager": "reportingManagerName",
        "joining date": "joiningDate",
        "joiningdate": "joiningDate",
        "salary": "salary",
      };

      const rows: ParsedRow[] = [];
      let globalError = false;

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());
        const raw: Record<string, string> = {};
        const draft: Partial<Manager> = {};
        
        headers.forEach((h, idx) => {
          const val = values[idx] || "";
          raw[h] = val;
          const key = fieldMap[h];
          if (key) {
            if (key === "salary") {
              draft.salary = val ? parseFloat(val) : undefined;
            } else {
              (draft as any)[key] = val;
            }
          }
        });

        // Validations
        const rowErrors: string[] = [];
        const rowWarnings: string[] = [];

        // Required Check
        if (!draft.employeeId) rowErrors.push("Employee ID is required");
        if (!draft.firstName) rowErrors.push("First name is required");
        if (!draft.lastName) rowErrors.push("Last name is required");
        if (!draft.email) rowErrors.push("Email is required");
        if (!draft.phone) rowErrors.push("Phone is required");
        if (!draft.department) rowErrors.push("Department is required");

        // Format checks
        if (draft.email && !validateEmail(draft.email)) {
          rowErrors.push("Invalid email format");
        }
        if (draft.phone && !validatePhone(draft.phone)) {
          rowWarnings.push("Phone number may be too short");
        }

        // Duplicate checks within uploaded list and existing database
        if (draft.employeeId) {
          const dupLocal = rows.find((r) => r.data.employeeId === draft.employeeId);
          const dupDb = existingManagers.find((m) => m.employeeId === draft.employeeId);
          if (dupLocal || dupDb) {
            rowErrors.push(`Duplicate Employee ID: ${draft.employeeId}`);
          }
        }

        if (draft.email) {
          const dupLocal = rows.find((r) => r.data.email?.toLowerCase() === draft.email?.toLowerCase());
          const dupDb = existingManagers.find((m) => m.email.toLowerCase() === draft.email?.toLowerCase());
          if (dupLocal || dupDb) {
            rowErrors.push(`Duplicate Email Address: ${draft.email}`);
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
        toast.warning("Validation errors found. Correct them before importing.");
      } else {
        toast.success(`Validated ${rows.length} rows. Ready for import.`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) {
      toast.error("No valid data parsed to import");
      return;
    }
    if (hasErrors) {
      toast.error("Cannot import with validation errors. Please re-upload a clean file.");
      return;
    }

    // Map drafts to fully qualified Manager objects
    const importedManagers: Manager[] = parsedRows.map((r, idx) => {
      const d = r.data;
      const firstName = d.firstName || "Imported";
      const lastName = d.lastName || "User";
      const office = OFFICES.includes(d.office || "") ? (d.office as string) : OFFICES[0];
      const department = DEPARTMENTS.includes(d.department || "") ? (d.department as string) : DEPARTMENTS[0];

      return {
        id: `mgr_imported_${Math.random().toString(36).substr(2, 9)}`,
        managerId: d.employeeId || `MGR-IMP-${idx + 1}`,
        employeeId: d.employeeId || `EMP-IMP-${idx + 1}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: d.email || `imported.${idx}@aurix.com`,
        phone: d.phone || "+91 99999 99999",
        dob: "1990-01-01",
        gender: "prefer_not_to_say",
        department,
        designation: d.designation || "Manager",
        managerRole: (d.managerRole as any) || "team_lead",
        reportingManagerId: null,
        reportingManagerCode: "",
        reportingManagerName: d.reportingManagerName || "None",
        office,
        workLocation: "hybrid",
        joiningDate: d.joiningDate || new Date().toISOString().split("T")[0],
        employmentType: "full_time",
        shift: SHIFTS[0],
        salary: d.salary,
        status: (d.status as any) || "active",
        teamSize: 0,
        teamIds: [],
        permissions: { ...DEFAULT_PERMISSIONS },
        lastActive: new Date().toISOString(),
        attendanceSummary: { present: 20, absent: 0, late: 0, leave: 0 },
        leaveBalance: { annual: 12, sick: 6, casual: 4 },
        performanceScore: 85,
        recentActivity: [
          { id: `act_imp_${Date.now()}`, action: "Imported via CSV upload", timestamp: new Date().toISOString() },
        ],
      };
    });

    await onImport(importedManagers);
    toast.success(`Import Successful: ${importedManagers.length} managers added`);
    resetState();
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const headers = "Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Office,Status,Role,Reporting Manager,Joining Date,Salary";
    const sampleRow = "\nEMP-1100,Raj,Malhotra,raj.malhotra@aurix.com,+91 98989 89898,Engineering,Engineering Manager,Bengaluru Tech Park,active,team_lead,Rohan Mehta,2026-06-01,110000";
    const blob = new Blob([headers, sampleRow], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "aurix_managers_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Import template downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) resetState(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            📂 Import Managers Directory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Instructions and Template Download */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Upload CSV or Excel Template</p>
              <p className="text-xs text-muted-foreground">
                Download our standardized CSV template structure, fill out the employee credentials, and drag and drop it below.
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
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              <div className="h-12 w-12 rounded-2xl bg-muted group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center text-muted-foreground transition-colors mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Drag & drop your directory spreadsheet, or <span className="text-brand hover:underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV, XLSX, or XLS formats (Max 5MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File details banner */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {parsedRows.length} Rows Detected</p>
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

              {/* Warnings / Errors Log */}
              {parsedRows.some((r) => r.errors.length > 0 || r.warnings.length > 0) && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4" />
                    Validation Concerns Found in Document
                  </div>
                  <ScrollArea className="max-h-[120px] pr-2">
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {parsedRows.map((row) => {
                        if (row.errors.length === 0 && row.warnings.length === 0) return null;
                        return (
                          <li key={row.rowNum} className="flex gap-2">
                            <span className="font-semibold text-foreground flex-shrink-0">Row {row.rowNum}:</span>
                            <span className="text-rose-500">{row.errors.join(", ")}</span>
                            {row.warnings.length > 0 && <span className="text-amber-500">({row.warnings.join(", ")})</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Visual Preview Table */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Import Preview</p>
                <div className="rounded-xl border border-border/80 overflow-hidden bg-card/20">
                  <ScrollArea className="max-h-[220px]">
                    <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="w-[80px]">Row</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Designation</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow key={row.rowNum} className={row.errors.length > 0 ? "bg-rose-500/5" : ""}>
                            <TableCell className="font-mono text-xs">{row.rowNum}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {row.data.employeeId || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {row.data.firstName || row.data.lastName ? (
                                `${row.data.firstName || ""} ${row.data.lastName || ""}`.trim()
                              ) : (
                                <span className="text-rose-500 italic">Missing</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.data.email || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.data.department || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs">{row.data.designation || "Manager"}</TableCell>
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
            variant="outline"
            onClick={() => { onOpenChange(false); resetState(); }}
            disabled={submitting}
            className="rounded-xl border-border bg-card hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || hasErrors || submitting}
            className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 disabled:opacity-50"
          >
            {submitting ? (
              <Loader label="Importing..." size="sm" className="text-brand-foreground" />
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
