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
import type { Department } from "../types";
import { OFFICES } from "../constants";
import { toast } from "sonner";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingDepartments: Department[];
  onImport: (imported: Department[]) => void;
}

interface ParsedRow {
  rowNum: number;
  data: Partial<Department>;
  errors: string[];
  warnings: string[];
  raw: Record<string, string>;
}

export function ImportDialog({
  open,
  onOpenChange,
  existingDepartments,
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
        toast.error("Unreadable or empty file structure");
        return;
      }

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        toast.error("CSV must contain a header row and at least one data row");
        return;
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, "").toLowerCase().trim());
      
      const fieldMap: Record<string, keyof Department | string> = {
        "department name": "name",
        "departmentname": "name",
        "name": "name",
        "code": "code",
        "dept code": "code",
        "deptcode": "code",
        "description": "description",
        "department head": "departmentHeadName",
        "departmenthead": "departmentHeadName",
        "head": "departmentHeadName",
        "reporting to": "reportingManagerName",
        "reportingmanager": "reportingManagerName",
        "office": "office",
        "office location": "office",
        "officelocation": "office",
        "budget": "budget",
        "annual budget": "budget",
        "cost center": "costCenter",
        "costcenter": "costCenter",
        "capacity": "employeeCapacity",
        "capacity limit": "employeeCapacity",
        "status": "status",
      };

      const rows: ParsedRow[] = [];
      let globalError = false;

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());
        const raw: Record<string, string> = {};
        const draft: Partial<Department> = {};

        headers.forEach((h, idx) => {
          const val = values[idx] || "";
          raw[h] = val;
          const key = fieldMap[h];
          if (key) {
            if (key === "budget") {
              draft.budget = val ? parseFloat(val) : 0;
            } else if (key === "employeeCapacity") {
              draft.employeeCapacity = val ? parseInt(val) : 30;
            } else {
              (draft as any)[key] = val;
            }
          }
        });

        // Validations
        const rowErrors: string[] = [];
        const rowWarnings: string[] = [];

        // Required
        if (!draft.name) rowErrors.push("Department name is required");
        if (!draft.code) rowErrors.push("Department code is required");
        if (!draft.office) rowErrors.push("Office location is required");
        if (!draft.departmentHeadName) rowErrors.push("Department head is required");

        // Numeric checks
        if (draft.budget !== undefined && draft.budget < 0) {
          rowErrors.push("Budget must be positive");
        }
        if (draft.employeeCapacity !== undefined && draft.employeeCapacity < 0) {
          rowErrors.push("Capacity cannot be negative");
        }

        // Duplicate Name & Code checks
        if (draft.name) {
          const dupLocal = rows.find((r) => r.data.name?.toLowerCase() === draft.name?.toLowerCase());
          const dupDb = existingDepartments.find((d) => d.name.toLowerCase() === draft.name!.toLowerCase());
          if (dupLocal || dupDb) {
            rowErrors.push(`Duplicate Name: ${draft.name}`);
          }
        }
        if (draft.code) {
          const dupLocal = rows.find((r) => r.data.code?.toUpperCase() === draft.code?.toUpperCase());
          const dupDb = existingDepartments.find((d) => (d.code || d.department_code || "").toUpperCase() === draft.code!.toUpperCase());
          if (dupLocal || dupDb) {
            rowErrors.push(`Duplicate Code: ${draft.code}`);
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

    const importedDepartments: Department[] = parsedRows.map((r, idx) => {
      const d = r.data;
      const office = OFFICES.includes(d.office || "") ? (d.office as string) : OFFICES[0];

      return {
        id: `dept_imported_${Math.random().toString(36).substr(2, 9)}`,
        name: d.name || "Imported Department",
        department_code: (d.code || "IMP").toUpperCase(),
        code: (d.code || "IMP").toUpperCase(),
        description: d.description || "Uploaded via batch importer",
        departmentHeadId: null,
        departmentHeadName: d.departmentHeadName || "Unassigned",
        reportingManagerId: null,
        reportingManagerName: d.reportingManagerName || "None",
        office,
        budget: d.budget || 0,
        cost_center: d.costCenter || `CC-IMP-${idx + 1}`,
        costCenter: d.costCenter || `CC-IMP-${idx + 1}`,
        employeeCapacity: d.employeeCapacity || 30,
        currentEmployeeCount: 0,
        extensionNumber: d.extensionNumber || "",
        status: (d.status as any) || "active",
        themeColor: "#64748b",
        iconName: "Building2",
        parentId: null,
        parentName: "None",
        createdDate: new Date().toISOString().split("T")[0],
        employeeIds: [],
        openPositions: 0,
        performanceScore: 0,
        attendanceScore: 0,
        hiringStatus: "closed",
        recentActivity: [],
        documents: [],
      };
    });

    onImport(importedDepartments);
    toast.success(`Batch Import Complete: ${importedDepartments.length} departments added`);
    resetState();
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const headers = "Department Name,Code,Description,Department Head,Reporting To,Office Location,Budget,Cost Center,Capacity,Status";
    const sample = "\nLogistics & Supply,LSC,Handles supplier pipelines,Ali Hassan,None,Dubai Office,150000,CC-OPS-500,25,active";
    const blob = new Blob([headers, sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "aurix_departments_import_template.csv");
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
            ðŸ“‚ Import Departments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Helper Banner */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Import Departments Template</p>
              <p className="text-xs text-muted-foreground">
                Download the standardized CSV layout, add department specifics, budget ranges, capacity caps, and drop it.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={downloadTemplate}
              className="text-xs font-semibold rounded-xl border-border bg-card hover:bg-muted"
            >
              ðŸ“¥ Download CSV Template
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
                Drag & drop your departments CSV, or <span className="text-brand hover:underline">browse files</span>
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
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB â€¢ {parsedRows.length} departments detected</p>
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
                          <TableHead>Dept Code</TableHead>
                          <TableHead>Department Name</TableHead>
                          <TableHead>Head Manager</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Office</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow key={row.rowNum} className={row.errors.length > 0 ? "bg-rose-500/5" : ""}>
                            <TableCell className="font-mono text-xs">{row.rowNum}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {row.data.code || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {row.data.name || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs">
                              {row.data.departmentHeadName || <span className="text-rose-500 italic">Missing</span>}
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {row.data.budget ? `$${row.data.budget.toLocaleString()}` : "$0"}
                            </TableCell>
                            <TableCell className="text-xs">{row.data.office || "Bengaluru HQ"}</TableCell>
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
