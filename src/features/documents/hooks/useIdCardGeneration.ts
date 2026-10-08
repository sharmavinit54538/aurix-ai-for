import { useState, useEffect, useMemo, useCallback } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { documentsApi } from "../api/documentsApi";
import {
  ID_CARD_THEMES,
  STANDARD_ID_CARD_TERMS,
  buildIdCardQrPayload,
} from "../lib/idCardTemplates";
import { logDocumentAuditEvent } from "../lib/auditLogger";
import type { EmployeeIdCardData, IdCardStatus, IdCardTheme } from "../lib/types";

const SAVED_ID_CARDS_KEY = "ofc360_issued_id_cards_history";

function getStoredIdCards(): EmployeeIdCardData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SAVED_ID_CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredIdCards(cards: EmployeeIdCardData[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SAVED_ID_CARDS_KEY, JSON.stringify(cards.slice(0, 50)));
  } catch {
    // Ignore storage errors
  }
}

export function useIdCardGeneration() {
  const ws = useAurix();
  const company = ws.company;

  // Active employees list from backend
  const [employees, setEmployees] = useState<Array<{
    id: string;
    fullName: string;
    employeeId: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    joiningDate: string;
    bloodGroup?: string;
    avatarUrl?: string;
  }>>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Selected Employee & Card Customization State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [theme, setTheme] = useState<IdCardTheme>("navy");
  const [isFlipped, setIsFlipped] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [employeePhone, setEmployeePhone] = useState<string>("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    return d.toISOString().split("T")[0];
  });

  // Issued cards history
  const [issuedCards, setIssuedCards] = useState<EmployeeIdCardData[]>(() => getStoredIdCards());

  // Load employees
  useEffect(() => {
    let isMounted = true;
    const fetchEmps = async () => {
      setIsLoadingEmployees(true);
      try {
        const live = await documentsApi.getEmployees();
        if (live.length > 0 && isMounted) {
          setEmployees(live);
          if (!selectedEmployeeId) setSelectedEmployeeId(live[0].id);
          return;
        }
      } catch {
        // Fallback to store
      }
      if (ws.employees.length > 0 && isMounted) {
        setEmployees(
          ws.employees.map((e) => ({
            id: e.id,
            fullName: e.fullName,
            employeeId: e.employeeId || e.id,
            email: e.email,
            phone: e.phone,
            designation: e.designation,
            department: e.department,
            joiningDate: e.joiningDate,
            bloodGroup: (e as any).bloodGroup || "",
          }))
        );
        if (!selectedEmployeeId) setSelectedEmployeeId(ws.employees[0].id);
      }
      setIsLoadingEmployees(false);
    };

    fetchEmps();
    return () => {
      isMounted = false;
    };
  }, [ws.employees, selectedEmployeeId]);

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId);
  }, [employees, selectedEmployeeId]);

  // Sync employee details into card inputs
  useEffect(() => {
    if (selectedEmployee) {
      if (selectedEmployee.bloodGroup) setBloodGroup(selectedEmployee.bloodGroup);
      if (selectedEmployee.phone) setEmployeePhone(selectedEmployee.phone);
      if (selectedEmployee.avatarUrl) setCustomPhotoUrl(selectedEmployee.avatarUrl);
      else setCustomPhotoUrl(null);
    }
  }, [selectedEmployee]);

  // Generate dynamic QR Code for the card back
  useEffect(() => {
    if (!selectedEmployee) return;
    const payload = buildIdCardQrPayload({
      employeeId: selectedEmployee.id,
      employeeCode: selectedEmployee.employeeId,
      employeeName: selectedEmployee.fullName,
      companyName: company?.name || "",
    });

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 140,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => setQrCodeDataUrl(""));
  }, [selectedEmployee, company]);

  // Build the complete ID Card Data object
  const currentCardData: EmployeeIdCardData = useMemo(() => {
    const companyName = company?.name || "";
    const companyAddress = company?.address
      ? [company.address, company.city, company.state, company.country].filter(Boolean).join(", ")
      : "";

    return {
      id: `card_${selectedEmployee?.id || "draft"}`,
      employeeId: selectedEmployee?.id || "",
      employeeCode: selectedEmployee?.employeeId || "",
      employeeName: selectedEmployee?.fullName || "",
      designation: selectedEmployee?.designation || "",
      department: selectedEmployee?.department || "",
      joiningDate: selectedEmployee?.joiningDate || "",
      bloodGroup: bloodGroup || selectedEmployee?.bloodGroup || "",
      photoUrl: customPhotoUrl || undefined,
      companyName,
      companyAddress,
      emergencyContact,
      employeeContact: employeePhone || selectedEmployee?.phone || "",
      email: selectedEmployee?.email || "",
      authorizedSignatoryName: "Authorized Signatory",
      qrPayload: qrCodeDataUrl,
      terms: STANDARD_ID_CARD_TERMS,
      theme,
      status: "Active",
      issueDate,
      expiryDate,
      generatedAt: new Date().toISOString(),
      cardVersion: 1,
    };
  }, [
    company,
    selectedEmployee,
    bloodGroup,
    customPhotoUrl,
    emergencyContact,
    employeePhone,
    qrCodeDataUrl,
    theme,
    issueDate,
    expiryDate,
  ]);

  // Handle Photo File Upload
  const handlePhotoUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      setCustomPhotoUrl(res);
      toast.success("Employee badge photo updated!");
    };
    reader.readAsDataURL(file);
  }, []);

  // Action: Generate ID Card
  const handleGenerateCard = useCallback(() => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    const newCard: EmployeeIdCardData = {
      ...currentCardData,
      id: `card_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: "Active",
      generatedAt: new Date().toISOString(),
    };

    // If an active card exists for this employee, mark previous as Replaced
    const updated = [
      newCard,
      ...issuedCards.map((c) =>
        c.employeeId === selectedEmployee.id && c.status === "Active"
          ? { ...c, status: "Replaced" as IdCardStatus }
          : c
      ),
    ];

    setIssuedCards(updated);
    saveStoredIdCards(updated);

    logDocumentAuditEvent({
      action: "ID Card Generated",
      documentName: `ID Card — ${selectedEmployee.fullName}`,
      employeeName: selectedEmployee.fullName,
      employeeId: selectedEmployee.id,
      details: `Issued ID Card (ID: ${selectedEmployee.employeeId}) with theme ${theme.toUpperCase()}`,
    });

    toast.success(`ID Card for ${selectedEmployee.fullName} successfully generated!`);
  }, [currentCardData, issuedCards, selectedEmployee, theme]);

  // Action: Print Card
  const handlePrintCard = useCallback(() => {
    window.print();
  }, []);

  // Action: Toggle Card Status
  const handleToggleCardStatus = useCallback((cardId: string, currentStatus: IdCardStatus) => {
    const nextStatus: IdCardStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setIssuedCards((prev) => {
      const updated = prev.map((c) => (c.id === cardId ? { ...c, status: nextStatus } : c));
      saveStoredIdCards(updated);
      return updated;
    });

    toast.success(`Card status changed to ${nextStatus}`);
  }, []);

  return {
    employees,
    isLoadingEmployees,
    selectedEmployeeId,
    selectedEmployee,
    theme,
    isFlipped,
    bloodGroup,
    emergencyContact,
    employeePhone,
    customPhotoUrl,
    qrCodeDataUrl,
    issueDate,
    expiryDate,
    currentCardData,
    issuedCards,
    setSelectedEmployeeId,
    setTheme,
    setIsFlipped,
    setBloodGroup,
    setEmergencyContact,
    setEmployeePhone,
    setIssueDate,
    setExpiryDate,
    handlePhotoUpload,
    handleGenerateCard,
    handlePrintCard,
    handleToggleCardStatus,
  };
}
