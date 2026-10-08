import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { documentsApi } from "../api/documentsApi";
import { DEFAULT_LETTER_TEMPLATES } from "../lib/letterTemplates";
import { logDocumentAuditEvent } from "../lib/auditLogger";
import type { DocumentTemplate, TemplatePlaceholder } from "../lib/types";

const LOCAL_TEMPLATES_KEY = "ofc360_custom_document_templates";

export const AVAILABLE_TEMPLATE_VARIABLES: TemplatePlaceholder[] = [
  { key: "employee_name", label: "Employee Name", description: "Full name of the employee", example: "John Doe" },
  { key: "employee_id", label: "Employee ID", description: "Official company employee code", example: "EMP-1042" },
  { key: "designation", label: "Designation", description: "Official job role or title", example: "Senior Systems Engineer" },
  { key: "department", label: "Department", description: "Assigned business department", example: "Product Engineering" },
  { key: "joining_date", label: "Joining Date", description: "Date employee commenced service", example: "2024-03-01" },
  { key: "confirmation_date", label: "Confirmation Date", description: "Date probation was successfully completed", example: "2024-09-01" },
  { key: "manager_name", label: "Reporting Manager", description: "Full name of direct reporting lead", example: "Priya Menon" },
  { key: "company_name", label: "Company Name", description: "Registered enterprise name", example: "OFC360 Enterprise Systems" },
  { key: "company_address", label: "Company Address", description: "Registered office headquarters address", example: "Cyber City, Bengaluru" },
  { key: "salary", label: "Base Salary", description: "Fixed annual base salary", example: "12,00,000" },
  { key: "ctc", label: "Annual CTC", description: "Total Cost to Company", example: "15,00,000" },
  { key: "effective_date", label: "Effective Date", description: "Start or implementation date of letter terms", example: "2026-10-15" },
  { key: "last_working_date", label: "Last Working Date", description: "Official separation or relieving date", example: "2026-11-30" },
  { key: "location", label: "Work Location", description: "Office campus or branch city", example: "Bengaluru, India" },
  { key: "email", label: "Email Address", description: "Official or personal email address", example: "john.doe@ofc360.com" },
  { key: "phone", label: "Phone Number", description: "Contact mobile number", example: "+91 98765 43210" },
];

function getInitialTemplates(): DocumentTemplate[] {
  const seedTemplates: DocumentTemplate[] = Object.entries(DEFAULT_LETTER_TEMPLATES).map(
    ([id, tpl], idx) => ({
      id,
      title: tpl.title,
      category: id.includes("offer") || id.includes("appointment") || id.includes("confirmation")
        ? "Joining & Employment"
        : id.includes("salary")
        ? "Salary & Compensation"
        : id.includes("experience") || id.includes("relieving")
        ? "Exit & Separation"
        : "General HR",
      code: `TPL-${100 + idx}`,
      description: `Official enterprise template for ${tpl.title}`,
      content: tpl.content,
      variables: [
        "employee_name",
        "employee_id",
        "designation",
        "department",
        "company_name",
        "effective_date",
      ],
      isActive: true,
      isDefault: true,
      createdAt: new Date().toISOString(),
    })
  );

  if (typeof window === "undefined") return seedTemplates;

  try {
    const raw = localStorage.getItem(LOCAL_TEMPLATES_KEY);
    if (!raw) return seedTemplates;
    const custom: DocumentTemplate[] = JSON.parse(raw);
    const existingIds = new Set(custom.map((c) => c.id));
    return [...custom, ...seedTemplates.filter((s) => !existingIds.has(s.id))];
  } catch {
    return seedTemplates;
  }
}

function saveLocalTemplates(templates: DocumentTemplate[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_TEMPLATES_KEY, JSON.stringify(templates));
  } catch {
    // Ignore storage errors
  }
}

export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(() => getInitialTemplates());
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch remote templates and merge
  useEffect(() => {
    let isMounted = true;
    const fetchRemote = async () => {
      setIsLoading(true);
      try {
        const remote = await documentsApi.listTemplates();
        if (remote.length > 0 && isMounted) {
          setTemplates((prev) => {
            const seen = new Set(remote.map((r) => r.id));
            const merged = [...remote, ...prev.filter((p) => !seen.has(p.id))];
            saveLocalTemplates(merged);
            return merged;
          });
        }
      } catch {
        // Fall back to local seed
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRemote();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = selectedCategory === "all" || t.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [templates, search, selectedCategory]);

  // Create Template
  const createTemplate = useCallback(
    async (payload: {
      title: string;
      category: string;
      code: string;
      content: string;
      description?: string;
      subject?: string;
      variables?: string[];
      isDefault?: boolean;
    }) => {
      const newTemplate: DocumentTemplate = {
        id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: payload.title,
        category: payload.category,
        code: payload.code.toUpperCase(),
        description: payload.description,
        subject: payload.subject,
        content: payload.content,
        variables: payload.variables || [],
        isActive: true,
        isDefault: Boolean(payload.isDefault),
        createdAt: new Date().toISOString(),
      };

      try {
        // Try persisting via backend
        await documentsApi.createTemplate({
          title: payload.title,
          category: payload.category,
          code: payload.code,
          content: payload.content,
          description: payload.description,
          subject: payload.subject,
          variables: payload.variables,
          is_active: true,
          is_default: payload.isDefault,
        });
      } catch {
        // Continue with local save
      }

      setTemplates((prev) => {
        const updated = [newTemplate, ...prev];
        saveLocalTemplates(updated);
        return updated;
      });

      logDocumentAuditEvent({
        action: "Template Created",
        documentName: payload.title,
        documentId: newTemplate.id,
        details: `Created new template ${payload.code} in category ${payload.category}`,
      });

      toast.success(`Template "${payload.title}" created successfully!`);
      return newTemplate;
    },
    []
  );

  // Edit Template
  const editTemplate = useCallback(
    (id: string, updates: Partial<DocumentTemplate>) => {
      setTemplates((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        );
        saveLocalTemplates(updated);
        return updated;
      });

      logDocumentAuditEvent({
        action: "Template Updated",
        documentName: updates.title || "Template",
        documentId: id,
        details: "Modified template content / metadata",
      });

      toast.success("Template updated successfully!");
    },
    []
  );

  // Duplicate Template
  const duplicateTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const original = prev.find((t) => t.id === id);
      if (!original) return prev;

      const dup: DocumentTemplate = {
        ...original,
        id: `tpl_dup_${Date.now()}`,
        title: `${original.title} (Copy)`,
        code: `${original.code}-COPY`,
        isDefault: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [dup, ...prev];
      saveLocalTemplates(updated);
      toast.success(`Duplicated "${original.title}"`);
      return updated;
    });
  }, []);

  // Toggle Active Status
  const toggleActiveStatus = useCallback((id: string) => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      );
      saveLocalTemplates(updated);
      return updated;
    });
  }, []);

  // Set as Default
  const setDefaultTemplate = useCallback((id: string) => {
    setTemplates((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      const updated = prev.map((t) => {
        if (t.category === target.category) {
          return { ...t, isDefault: t.id === id };
        }
        return t;
      });

      saveLocalTemplates(updated);
      toast.success(`Set as default template for ${target.category}`);
      return updated;
    });
  }, []);

  return {
    templates: filteredTemplates,
    allTemplates: templates,
    categories,
    isLoading,
    search,
    selectedCategory,
    setSearch,
    setSelectedCategory,
    createTemplate,
    editTemplate,
    duplicateTemplate,
    toggleActiveStatus,
    setDefaultTemplate,
  };
}
