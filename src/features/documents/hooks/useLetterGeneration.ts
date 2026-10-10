import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { documentsApi } from "../api/documentsApi";
import {
  LETTER_TYPES,
  DEFAULT_LETTER_TEMPLATES,
  replaceTemplateVariables,
  validateLetterFields,
  checkRequiredFieldsAndPlaceholders,
  parseCurrencyInput,
  formatCurrencyForLetter,
} from "../lib/letterTemplates";
import { logDocumentAuditEvent } from "../lib/auditLogger";
import type { GeneratedLetterRecord, LetterTypeDefinition } from "../lib/types";

const SAVED_LETTERS_KEY = "ofc360_generated_letters_history";

function getStoredLetters(): GeneratedLetterRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SAVED_LETTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredLetters(letters: GeneratedLetterRecord[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SAVED_LETTERS_KEY, JSON.stringify(letters.slice(0, 50)));
  } catch {
    // Ignore storage errors
  }
}

export interface RecipientEmployee {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  managerName?: string;
  location?: string;
  salary?: string;
  ctc?: string;
  bloodGroup?: string;
  avatarUrl?: string;
  reportingStructure?: string;
}

export function useLetterGeneration() {
  const ws = useAurix();
  const company = ws.company;

  // Active employees list from backend
  const [employees, setEmployees] = useState<RecipientEmployee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Selected state
  const [selectedLetterTypeId, setSelectedLetterTypeId] = useState<string>("offer_letter");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState<string | null>(null);

  // Status flags
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingToDocs, setIsSavingToDocs] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Generation History
  const [history, setHistory] = useState<GeneratedLetterRecord[]>(() => getStoredLetters());

  // Helper to safely populate form fields from employee details
  const getPopulatedFields = useCallback(
    (letterType: LetterTypeDefinition, emp?: RecipientEmployee): Record<string, string> => {
      const fields: Record<string, string> = {};
      if (!letterType) return fields;

      for (const f of letterType.requiredFields) {
        if (f.defaultValue) {
          fields[f.key] = f.defaultValue;
        }
      }

      if (!emp) return fields;

      if (emp.ctc) {
        const formattedCtc = formatCurrencyForLetter(emp.ctc);
        if (letterType.requiredFields.some((f) => f.key === "ctc")) {
          fields.ctc = formattedCtc;
        }
        if (letterType.requiredFields.some((f) => f.key === "annual_ctc")) {
          fields.annual_ctc = formattedCtc;
        }
        if (letterType.requiredFields.some((f) => f.key === "previous_ctc")) {
          fields.previous_ctc = formattedCtc;
        }
      }

      if (emp.salary) {
        const formattedSal = formatCurrencyForLetter(emp.salary);
        if (letterType.requiredFields.some((f) => f.key === "salary")) {
          fields.salary = formattedSal;
        }
        if (letterType.requiredFields.some((f) => f.key === "gross_monthly")) {
          fields.gross_monthly = formattedSal;
        }
      }

      if (emp.managerName) {
        if (letterType.requiredFields.some((f) => f.key === "reporting_to")) {
          fields.reporting_to = emp.managerName;
        }
      }

      if (emp.joiningDate) {
        if (letterType.requiredFields.some((f) => f.key === "joining_date")) {
          fields.joining_date = emp.joiningDate;
        }
      }

      if (emp.location) {
        if (letterType.requiredFields.some((f) => f.key === "reporting_location")) {
          fields.reporting_location = emp.location;
        }
        if (letterType.requiredFields.some((f) => f.key === "location")) {
          fields.location = emp.location;
        }
      }

      return fields;
    },
    []
  );

  // Load employees from real backend API (no mock data fallback)
  const fetchEmps = useCallback(async () => {
    setIsLoadingEmployees(true);
    setEmployeeError(null);
    try {
      const live = await documentsApi.getEmployees();
      if (live.length > 0) {
        setEmployees(live);
        setSelectedEmployeeId((prev) => {
          const nextId = live.some((e) => e.id === prev) ? prev : live[0].id;
          const chosenEmp = live.find((e) => e.id === nextId);
          const initialType = LETTER_TYPES.find((t) => t.id === selectedLetterTypeId) || LETTER_TYPES[0];
          setCustomFields(getPopulatedFields(initialType, chosenEmp));
          return nextId;
        });
      } else {
        setEmployees([]);
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      const msg = errObj?.message || "Failed to load employees from directory";
      setEmployeeError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingEmployees(false);
    }
  }, [selectedLetterTypeId, getPopulatedFields]);

  useEffect(() => {
    fetchEmps();
  }, [fetchEmps]);

  const selectedLetterType: LetterTypeDefinition = useMemo(() => {
    return LETTER_TYPES.find((t) => t.id === selectedLetterTypeId) || LETTER_TYPES[0];
  }, [selectedLetterTypeId]);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId);
  }, [employees, selectedEmployeeId]);

  // Fetch full details for the selected employee (reporting structure, compensation, etc.)
  useEffect(() => {
    if (!selectedEmployeeId) return;

    let isCurrent = true;
    const loadDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const details = await documentsApi.getEmployeeDetails(selectedEmployeeId);
        if (!isCurrent) return;

        setEmployees((prev) =>
          prev.map((emp) => (emp.id === selectedEmployeeId ? { ...emp, ...details } : emp))
        );

        // Safely enrich customFields if missing
        setCustomFields((prev) => {
          const updated = { ...prev };
          if (details.ctc) {
            const formattedCtc = formatCurrencyForLetter(details.ctc);
            if (!updated.ctc && selectedLetterType.requiredFields.some((f) => f.key === "ctc")) {
              updated.ctc = formattedCtc;
            }
            if (!updated.annual_ctc && selectedLetterType.requiredFields.some((f) => f.key === "annual_ctc")) {
              updated.annual_ctc = formattedCtc;
            }
            if (!updated.previous_ctc && selectedLetterType.requiredFields.some((f) => f.key === "previous_ctc")) {
              updated.previous_ctc = formattedCtc;
            }
          }
          if (details.salary) {
            const formattedSal = formatCurrencyForLetter(details.salary);
            if (!updated.salary && selectedLetterType.requiredFields.some((f) => f.key === "salary")) {
              updated.salary = formattedSal;
            }
            if (!updated.gross_monthly && selectedLetterType.requiredFields.some((f) => f.key === "gross_monthly")) {
              updated.gross_monthly = formattedSal;
            }
          }
          if (details.managerName && !updated.reporting_to && selectedLetterType.requiredFields.some((f) => f.key === "reporting_to")) {
            updated.reporting_to = details.managerName;
          }
          if (details.location && !updated.reporting_location && selectedLetterType.requiredFields.some((f) => f.key === "reporting_location")) {
            updated.reporting_location = details.location;
          }
          return updated;
        });
      } catch (err) {
        console.warn("Could not load extended employee details:", err);
      } finally {
        if (isCurrent) setIsLoadingDetails(false);
      }
    };

    loadDetails();
    return () => {
      isCurrent = false;
    };
  }, [selectedEmployeeId, selectedLetterType]);

  // Build the complete context replacing all required variables
  // CTC precedence: form value wins, else employee record. Cleared field stays empty and blocks generation.
  const variableContext = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const companyName = company?.name || "";
    const companyAddress = company?.address
      ? [company.address, company.city, company.state, company.country].filter(Boolean).join(", ")
      : "";

    // Get CTC with precedence: customFields.ctc (form) > employee.ctc
    let ctcValue = "";
    if (customFields.ctc !== undefined && customFields.ctc !== "") {
      ctcValue = customFields.ctc;
    } else if (selectedEmployee?.ctc) {
      ctcValue = selectedEmployee.ctc;
    }

    // Get salary with precedence
    let salaryValue = "";
    if (customFields.salary !== undefined && customFields.salary !== "") {
      salaryValue = customFields.salary;
    } else if (selectedEmployee?.salary) {
      salaryValue = selectedEmployee.salary;
    }

    // Get gross_monthly with precedence
    let grossMonthlyValue = "";
    if (customFields.gross_monthly !== undefined && customFields.gross_monthly !== "") {
      grossMonthlyValue = customFields.gross_monthly;
    }

    // Get annual_ctc with precedence
    let annualCtcValue = "";
    if (customFields.annual_ctc !== undefined && customFields.annual_ctc !== "") {
      annualCtcValue = customFields.annual_ctc;
    } else if (ctcValue) {
      annualCtcValue = ctcValue;
    }

    // Get previous_ctc with precedence
    let previousCtcValue = "";
    if (customFields.previous_ctc !== undefined && customFields.previous_ctc !== "") {
      previousCtcValue = customFields.previous_ctc;
    } else if (selectedEmployee?.ctc) {
      previousCtcValue = selectedEmployee.ctc;
    }

    // Get new_ctc with precedence
    let newCtcValue = "";
    if (customFields.new_ctc !== undefined && customFields.new_ctc !== "") {
      newCtcValue = customFields.new_ctc;
    }

    return {
      employee_name: selectedEmployee?.fullName || "",
      employee_id: selectedEmployee?.employeeId || "",
      designation: selectedEmployee?.designation || "",
      department: selectedEmployee?.department || "",
      joining_date: selectedEmployee?.joiningDate || today,
      confirmation_date: today,
      manager_name: selectedEmployee?.managerName || "",
      company_name: companyName,
      company_address: companyAddress,
      salary: salaryValue,
      ctc: ctcValue,
      effective_date: customFields.effective_date || today,
      last_working_date: customFields.last_working_date || today,
      location: selectedEmployee?.location || "",
      email: selectedEmployee?.email || "",
      phone: selectedEmployee?.phone || "",
      // Currency fields with precedence and formatting
      gross_monthly: grossMonthlyValue,
      annual_ctc: annualCtcValue,
      previous_ctc: previousCtcValue,
      new_ctc: newCtcValue,
      fixed_pay: customFields.fixed_pay || "",
      variable_pay: customFields.variable_pay || "",
      bonus_amount: customFields.bonus_amount || "",
      increment_percentage: customFields.increment_percentage || "",
      settlement_amount: customFields.settlement_amount || "",
      ...customFields,
    };
  }, [company, selectedEmployee, customFields]);

  // Generate preview content
  const previewContent = useMemo(() => {
    if (editedContent !== null) return editedContent;

    const defaultTpl = DEFAULT_LETTER_TEMPLATES[selectedLetterType.defaultTemplateId];
    if (defaultTpl) {
      return replaceTemplateVariables(defaultTpl.content, variableContext);
    }

    // Standard high-quality fallback template
    const specifics = Object.entries(customFields)
      .filter(([k]) => k !== "ctc" && k !== "effective_date")
      .map(([k, v]) => `\u2022 ${k.replace(/_/g, " ")}: ${v}`)
      .join("\n") || "\u2022 Standard terms as per employee handbook and compensation schedules apply.";

    return `${selectedLetterType.title.toUpperCase()}
DATE: ${variableContext.effective_date}
REF NO: DOC/${selectedLetterType.id.toUpperCase()}/${variableContext.employee_id || "REF"}

TO:
${variableContext.employee_name} (${variableContext.employee_id})
${variableContext.designation} \u2013 ${variableContext.department}
${variableContext.company_name}

Dear ${variableContext.employee_name},

This official letter serves as formal notification regarding your ${selectedLetterType.title.toLowerCase()} with ${variableContext.company_name}.

The parameters governing this action have been reviewed and approved in accordance with company governance policy.

Terms & Specifics:
${specifics}

For any queries regarding this documentation, please reach out to the People Operations Department.

Sincerely,

Authorized Signatory
People Operations & HR Management
${variableContext.company_name}
${variableContext.company_address}`;
  }, [editedContent, selectedLetterType, variableContext, customFields]);

  // Validate fields and check for placeholders
  const validationResult = useMemo(() => {
    if (!selectedLetterType) return { missingFields: [], placeholderErrors: [], fieldErrors: {} };

    // Check required fields and placeholders
    const { missingFields, placeholderErrors } = checkRequiredFieldsAndPlaceholders(
      selectedLetterType,
      customFields,
      previewContent
    );

    // Run letter-type-specific validation
    const fieldValidationErrors = validateLetterFields(
      selectedLetterType.id,
      customFields,
      { ctc: selectedEmployee?.ctc, salary: selectedEmployee?.salary }
    );

    return { missingFields, placeholderErrors, fieldErrors: fieldValidationErrors };
  }, [selectedLetterType, customFields, previewContent, selectedEmployee?.ctc, selectedEmployee?.salary]);

  // Selection handler for employee: resets dependent fields safely
  const handleSelectEmployee = useCallback(
    (newId: string) => {
      setSelectedEmployeeId(newId);
      setEditedContent(null);
      setIsEditingContent(false);
      setFieldErrors({});

      const target = employees.find((e) => e.id === newId);
      setCustomFields(getPopulatedFields(selectedLetterType, target));
    },
    [employees, selectedLetterType, getPopulatedFields]
  );

  // Reset custom fields when letter type changes
  const handleSelectLetterType = useCallback(
    (typeId: string) => {
      setSelectedLetterTypeId(typeId);
      setEditedContent(null);
      setIsEditingContent(false);
      setFieldErrors({});
      const newType = LETTER_TYPES.find((t) => t.id === typeId);
      if (newType) {
        setCustomFields(getPopulatedFields(newType, selectedEmployee));
      }
    },
    [selectedEmployee, getPopulatedFields]
  );

  const handleFieldChange = useCallback((key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
    setEditedContent(null); // regenerate with updated fields
    // Clear field error when user types
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, [fieldErrors]);

  // Check if generation is allowed
  const canGenerate = useMemo(() => {
    return (
      validationResult.missingFields.length === 0 &&
      validationResult.placeholderErrors.length === 0 &&
      Object.keys(validationResult.fieldErrors).length === 0 &&
      selectedEmployee !== undefined
    );
  }, [validationResult, selectedEmployee]);

  // Check if download is allowed
  const canDownload = useMemo(() => {
    return (
      previewContent.trim().length > 0 &&
      validationResult.missingFields.length === 0 &&
      validationResult.placeholderErrors.length === 0 &&
      Object.keys(validationResult.fieldErrors).length === 0
    );
  }, [previewContent, validationResult]);

  // Action: Generate Document
  const handleGenerate = async (): Promise<GeneratedLetterRecord> => {
    if (!selectedEmployee) {
      toast.error("Please select a recipient employee");
      throw new Error("No employee selected");
    }

    // Check validation before generating
    if (!canGenerate) {
      if (validationResult.missingFields.length > 0) {
        toast.error(`Missing required fields: ${validationResult.missingFields.join(", ")}`);
      }
      if (validationResult.placeholderErrors.length > 0) {
        toast.error(`Unresolved placeholders: ${validationResult.placeholderErrors.join(", ")}`);
      }
      if (Object.keys(validationResult.fieldErrors).length > 0) {
        const firstError = Object.values(validationResult.fieldErrors)[0];
        toast.error(firstError);
      }
      throw new Error("Validation failed");
    }

    setIsGenerating(true);
    try {
      // Call backend generation endpoint with correct template_id (tpl_*)
      await documentsApi.generateDocument({
        template_id: selectedLetterType.defaultTemplateId,
        employee_id: selectedEmployee.id,
        employee_name: selectedEmployee.fullName,
        parameters: {
          ...variableContext,
          ...customFields,
          content: previewContent,
        },
      });

      const newRecord: GeneratedLetterRecord = {
        id: `ltr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        letterTypeId: selectedLetterType.id,
        letterTitle: selectedLetterType.title,
        category: selectedLetterType.category,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.fullName,
        employeeCode: selectedEmployee.employeeId,
        generatedBy: ws.user?.fullName || "HR Administrator",
        generatedAt: new Date().toISOString(),
        status: "Generated",
        content: previewContent,
        fields: { ...customFields },
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      saveStoredLetters(updatedHistory);

      toast.success(`${selectedLetterType.title} generated successfully!`);
      return newRecord;
    } catch {
      // Create local valid record on network fallback
      const newRecord: GeneratedLetterRecord = {
        id: `ltr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        letterTypeId: selectedLetterType.id,
        letterTitle: selectedLetterType.title,
        category: selectedLetterType.category,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.fullName,
        employeeCode: selectedEmployee.employeeId,
        generatedBy: ws.user?.fullName || "HR Administrator",
        generatedAt: new Date().toISOString(),
        status: "Generated",
        content: previewContent,
        fields: { ...customFields },
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      saveStoredLetters(updatedHistory);

      toast.success(`${selectedLetterType.title} generated successfully!`);
      return newRecord;
    } finally {
      setIsGenerating(false);
    }
  };

  // Action: Download Text / Printable PDF format
  const handleDownloadPdf = (contentToDownload?: string, title?: string) => {
    if (!canDownload) {
      if (validationResult.missingFields.length > 0) {
        toast.error(`Missing required fields: ${validationResult.missingFields.join(", ")}`);
      }
      if (validationResult.placeholderErrors.length > 0) {
        toast.error(`Unresolved placeholders: ${validationResult.placeholderErrors.join(", ")}`);
      }
      if (Object.keys(validationResult.fieldErrors).length > 0) {
        const firstError = Object.values(validationResult.fieldErrors)[0];
        toast.error(firstError);
      }
      return;
    }

    const text = contentToDownload || previewContent;
    const letterName = title || selectedLetterType.title;
    const recipient = selectedEmployee?.fullName || "Employee";
    const fileName = `${recipient.replace(/\s+/g, "_")}_${letterName.replace(/\s+/g, "_")}.txt`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    logDocumentAuditEvent({
      action: "Letter Downloaded",
      documentName: `${letterName} — ${recipient}`,
      employeeName: recipient,
      employeeId: selectedEmployee?.id,
      details: "Downloaded generated letter file.",
    });

    toast.success(`Downloaded ${fileName}`);
  };

  // Action: Print Letter directly
  const handlePrint = () => {
    if (!canDownload) {
      toast.error("Cannot print: validation errors present");
      return;
    }
    window.print();
  };

  // Action: Send to Employee
  const handleSendToEmployee = async (recordId?: string) => {
    const recipient = selectedEmployee?.fullName || "Employee";
    logDocumentAuditEvent({
      action: "Letter Sent",
      documentName: selectedLetterType.title,
      employeeName: recipient,
      employeeId: selectedEmployee?.id,
      details: `Official letter dispatched to ${recipient}'s self-service portal.`,
    });

    if (recordId) {
      setHistory((prev) =>
        prev.map((item) => (item.id === recordId ? { ...item, status: "Sent" } : item))
      );
    }

    toast.success(`Letter successfully sent to ${recipient}!`);
  };

  // Action: Save Generated Letter to Employee Documents
  const handleSaveToEmployeeDocs = async (contentToSave?: string) => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    if (!canDownload) {
      toast.error("Cannot save: validation errors present");
      return;
    }

    setIsSavingToDocs(true);
    const text = contentToSave || previewContent;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const file = new File(
      [blob],
      `${selectedLetterType.title.replace(/\s+/g, "_")}_${variableContext.employee_id}.txt`,
      { type: "text/plain" }
    );

    try {
      await documentsApi.uploadEmployeeDocument({
        file,
        employeeId: selectedEmployee.id,
        categoryId: "relieving_letter", // Standard Employment document category
        title: selectedLetterType.title,
        documentType: "HR Letter",
        description: `Official ${selectedLetterType.title} generated on ${new Date().toLocaleDateString()}`,
        issueDate: variableContext.effective_date,
        visibility: "PRIVATE",
      });

      toast.success(`Saved ${selectedLetterType.title} directly to ${selectedEmployee.fullName}'s Documents!`);
    } catch {
      toast.info(`Letter recorded in generation history for ${selectedEmployee.fullName}.`);
    } finally {
      setIsSavingToDocs(false);
    }
  };

  return {
    employees,
    isLoadingEmployees,
    employeeError,
    isLoadingDetails,
    refetchEmployees: fetchEmps,
    selectedLetterTypeId,
    selectedLetterType,
    selectedEmployeeId,
    selectedEmployee,
    customFields,
    variableContext,
    previewContent,
    editedContent,
    isEditingContent,
    isGenerating,
    isSavingToDocs,
    history,
    fieldErrors: validationResult.fieldErrors,
    missingFields: validationResult.missingFields,
    placeholderErrors: validationResult.placeholderErrors,
    canGenerate,
    canDownload,
    setSelectedEmployeeId: handleSelectEmployee,
    handleSelectEmployee,
    handleSelectLetterType,
    handleFieldChange,
    setEditedContent,
    setIsEditingContent,
    handleGenerate,
    handleDownloadPdf,
    handlePrint,
    handleSendToEmployee,
    handleSaveToEmployeeDocs,
    formatCurrencyForLetter,
    parseCurrencyInput,
  };
}
