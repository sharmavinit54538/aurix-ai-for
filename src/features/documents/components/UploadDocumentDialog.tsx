import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiInstance } from "@/api";
import { validateDocumentFile, validateDocumentDates, validateTitle } from "../lib/validation";
import { CATEGORY_GROUPS, type BackendCategory, type CategoryGroup } from "../lib/types";

interface EmployeeOption {
  id: string;
  fullName: string;
  employeeCode?: string;
}

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: BackendCategory[];
  groupedCategories: Record<CategoryGroup, BackendCategory[]>;
  currentEmployeeProfileId?: string;
  isEmployeeRole: boolean;
  onUploadEmployee: (payload: {
    file: File;
    employeeId: string;
    categoryId: string;
    title: string;
    description?: string;
    issueDate?: string;
    expiryDate?: string;
    visibility?: "PRIVATE" | "MANAGER_ONLY" | "HR_ONLY" | "COMPANY";
    statusField?: string;
    tags?: string;
  }) => Promise<unknown>;
  onUploadCompany: (payload: {
    file: File;
    categoryId: string;
    title: string;
    description?: string;
    department?: string;
    branch?: string;
    visibility?: string;
  }) => Promise<unknown>;
  isUploading: boolean;
}

export const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  categories: _categories,
  groupedCategories,
  currentEmployeeProfileId,
  isEmployeeRole,
  onUploadEmployee,
  onUploadCompany,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [selectedGroup, setSelectedGroup] = useState<CategoryGroup>(
    isEmployeeRole ? "Employee Documents" : "Employee Documents"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [description, setDescription] = useState("");
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSizeStr, setFileSizeStr] = useState("");

  // Target Employee selection for HR/admin
  const [targetEmployeeId, setTargetEmployeeId] = useState<string>("company");
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([]);
  const [_isSearchingEmployees, setIsSearchingEmployees] = useState(false);
  const [employeeSearch] = useState("");

  // Visibility selection
  const [visibility] = useState<string>(isEmployeeRole ? "PRIVATE" : "COMPANY");

  // Inline validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or initialize selected category when group changes
  useEffect(() => {
    const availableCategories = groupedCategories[selectedGroup] || [];
    if (availableCategories.length > 0) {
      // Pick first valid category
      if (!availableCategories.some((c) => c.id === selectedCategoryId)) {
        setSelectedCategoryId(availableCategories[0].id);
      }
    } else {
      setSelectedCategoryId("");
    }
  }, [selectedGroup, groupedCategories, selectedCategoryId]);

  // Lazy search for employees when dialog is opened (for HR/admin)
  useEffect(() => {
    if (open && !isEmployeeRole) {
      let isMounted = true;
      const fetchEmployees = async () => {
        setIsSearchingEmployees(true);
        try {
          const res = await apiInstance.get("/employees", {
            params: { search: employeeSearch.trim() || undefined, limit: 20 },
          });
          const rawItems = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
          if (Array.isArray(rawItems) && isMounted) {
            setEmployeeOptions(
              rawItems.map((e: Record<string, unknown>) => ({
                id: String(e.id),
                fullName:
                  [e.first_name, e.last_name].filter(Boolean).join(" ").trim() ||
                  String(e.full_name || "Employee"),
                employeeCode: String(e.employee_id || e.employee_code || ""),
              }))
            );
          }
        } catch {
          // Keep existing
        } finally {
          if (isMounted) setIsSearchingEmployees(false);
        }
      };

      const timer = setTimeout(fetchEmployees, 300);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [open, isEmployeeRole, employeeSearch]);

  // Handle file selection
  const handleSelectFile = (file: File) => {
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, file: validation.error || "Invalid file" }));
      toast.error(validation.error);
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });

    setSelectedFile(file);
    setFileName(file.name);

    // Auto-populate title with filename (without extension) if title is currently empty
    if (!title.trim()) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitle(nameWithoutExt);
    }

    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
    setFileSizeStr(sizeStr);
  };

  // Change file handler: clears all file states and resets the input value
  const handleChangeFile = () => {
    setSelectedFile(null);
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // 1. File validation
    const fileVal = validateDocumentFile(selectedFile);
    if (!fileVal.valid) {
      newErrors.file = fileVal.error || "File is required.";
    }

    // 2. Title validation
    const titleVal = validateTitle(title);
    if (!titleVal.valid) {
      newErrors.title = titleVal.error || "Title is required.";
    }

    // 3. Category validation
    if (!selectedCategoryId) {
      newErrors.category = "Please select a valid document category.";
    }

    // 4. Dates validation
    const datesVal = validateDocumentDates(issueDate, expiryDate);
    if (!datesVal.valid) {
      newErrors.expiryDate = datesVal.error || "Invalid expiry date.";
    }

    // 5. Employee target validation
    const isCompanyDoc =
      selectedGroup === "Company Documents" ||
      (!isEmployeeRole && targetEmployeeId === "company");

    if (!isCompanyDoc && isEmployeeRole && !currentEmployeeProfileId) {
      newErrors.employee = "Could not resolve your employee profile. Please refresh.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    try {
      if (isCompanyDoc) {
        // Company document upload
        await onUploadCompany({
          file: selectedFile!,
          categoryId: selectedCategoryId,
          title: title.trim(),
          description: description.trim() || undefined,
          visibility: isEmployeeRole ? "COMPANY" : visibility,
        });
      } else {
        // Employee document upload
        const empId = isEmployeeRole ? currentEmployeeProfileId! : targetEmployeeId;
        await onUploadEmployee({
          file: selectedFile!,
          employeeId: empId,
          categoryId: selectedCategoryId,
          title: title.trim(),
          documentNumber: documentNumber.trim() || undefined,
          description: description.trim() || undefined,
          issueDate: issueDate || undefined,
          expiryDate: expiryDate || undefined,
          visibility: isEmployeeRole ? "PRIVATE" : (visibility as "PRIVATE" | "MANAGER_ONLY" | "HR_ONLY" | "COMPANY"),
          statusField: "PENDING",
        });
      }

      onOpenChange(false);
      // Reset form
      handleChangeFile();
      setTitle("");
      setDocumentNumber("");
      setDescription("");
      setExpiryDate("");
      setErrors({});
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string; detail?: string } } })?.response;
      if (res?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          file: res.data?.message || "A document with this name or record already exists.",
        }));
      } else if (res?.status === 422) {
        setErrors((prev) => ({
          ...prev,
          general: res.data?.message || res.data?.detail || "Validation failed on the server. Please check the entered fields.",
        }));
      }
    }
  };

  const availableCategories = groupedCategories[selectedGroup] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0 bg-background border-border shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEmployeeRole
              ? "Upload verification documents, academic proofs, or identity certificates."
              : "Add employee verification documents, statutory certificates, or company policies."}
          </DialogDescription>
        </DialogHeader>

        {errors.general && (
          <div className="mx-6 mt-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Target Employee (Only for HR/Admin) */}
          {!isEmployeeRole && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Target Scope / Employee</Label>
              <Select value={targetEmployeeId} onValueChange={setTargetEmployeeId}>
                <SelectTrigger className="w-full bg-background/50 border-border text-xs">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent className="max-h-[220px]">
                  <SelectItem value="company">Company-wide (Company Document)</SelectItem>
                  {employeeOptions.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.fullName} {emp.employeeCode ? `(${emp.employeeCode})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category Group and Document Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Category Group</Label>
              <Select
                value={selectedGroup}
                onValueChange={(val) => setSelectedGroup(val as CategoryGroup)}
              >
                <SelectTrigger className="bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_GROUPS.map((grp) => (
                    <SelectItem key={grp} value={grp}>
                      {grp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Document Type</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={availableCategories.length === 0}
              >
                <SelectTrigger className="bg-background/50 border-border text-xs">
                  <SelectValue placeholder={availableCategories.length === 0 ? "No categories" : "Select type"} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-[11px] text-rose-500">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Editable Document Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Document Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.title;
                    return next;
                  });
                }
              }}
              placeholder="e.g. Aadhaar Card Front & Back"
              className="bg-background/50 border-border text-xs"
            />
            {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
          </div>

          {/* Document Number */}
          {selectedGroup !== "Company Documents" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Document Number / ID <span className="font-normal text-muted-foreground/70">(Optional)</span>
              </Label>
              <Input
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. 12-digit Aadhaar / PAN / Passport Number"
                className="bg-background/50 border-border text-xs"
              />
            </div>
          )}

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Issue Date</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="pl-9 bg-background/50 border-border text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    if (errors.expiryDate) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.expiryDate;
                        return next;
                      });
                    }
                  }}
                  className="pl-9 bg-background/50 border-border text-xs"
                />
              </div>
              {errors.expiryDate && (
                <p className="text-[11px] text-rose-500">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Description / Notes</Label>
            <Textarea
              placeholder="Specify compliance notes or additional document details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[50px] bg-background/50 border-border text-xs"
            />
          </div>

          {/* File Picker & Dropzone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Document File (PDF, PNG, JPG, JPEG, DOCX up to 10MB) <span className="text-rose-500">*</span>
            </Label>

            {fileName ? (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate max-w-[220px]">{fileName}</p>
                    <p className="text-[10px] text-muted-foreground">{fileSizeStr}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeFile}
                  className="h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer"
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label="Click to browse or drag and drop a file"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSelectFile(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs font-medium text-foreground">Click to browse or drag & drop a file here</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">Supports PDF, PNG, JPG, DOCX up to 10MB</p>
              </div>
            )}
            {errors.file && <p className="text-[11px] text-rose-500">{errors.file}</p>}
          </div>
          </div>

          <DialogFooter className="p-4 px-6 border-t border-border bg-card/40 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
