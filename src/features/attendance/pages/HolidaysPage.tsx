import { useState, useMemo, useEffect, useRef } from "react";
import {
  Palmtree,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Archive,
  Eye,
  Calendar,
  CalendarDays,
  List,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Globe,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Holiday {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  status: "Active" | "Archived";
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  notes?: string;
  color?: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
}

const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: "h1",
    name: "New Year's Day",
    description: "Start of the new calendar year celebrated globally.",
    date: "2026-01-01",
    type: "Public",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    status: "Active",
    createdBy: "System Admin",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6",
    notes: "Global holiday across all branch offices."
  },
  {
    id: "h2",
    name: "Republic Day",
    description: "Honors the date on which the Constitution of India came into effect.",
    date: "2026-01-26",
    type: "Public",
    country: "India",
    state: "All States",
    office: "Bengaluru Tech Park",
    department: "All Departments",
    status: "Active",
    createdBy: "HR Team",
    createdDate: "2025-12-15",
    updatedDate: "2025-12-15",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6",
    notes: "Mandatory public holiday for India offices."
  },
  {
    id: "h3",
    name: "Holi Festival",
    description: "Spring festival of colors celebrating the victory of good over evil.",
    date: "2026-03-08",
    type: "Regional",
    country: "India",
    state: "Delhi",
    office: "Bengaluru Tech Park",
    department: "All Departments",
    status: "Active",
    createdBy: "HR Team",
    createdDate: "2026-01-10",
    updatedDate: "2026-01-10",
    recurring: false,
    everyYear: false,
    applyToAll: true,
    color: "#F59E0B"
  },
  {
    id: "h4",
    name: "Good Friday",
    description: "Christian holiday commemorating the crucifixion of Jesus Christ.",
    date: "2026-04-03",
    type: "Public",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    status: "Active",
    createdBy: "System Admin",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6"
  },
  {
    id: "h5",
    name: "Mid-Year Strategy Day",
    description: "Company-wide alignment and annual planning session.",
    date: "2026-06-15",
    type: "Company",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    status: "Active",
    createdBy: "Executive Team",
    createdDate: "2026-05-01",
    updatedDate: "2026-05-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#10B981",
    notes: "No external clients meetings scheduled."
  },
  {
    id: "h6",
    name: "Juneteenth",
    description: "Federal holiday commemorating the emancipation of enslaved African Americans.",
    date: "2026-06-19",
    type: "Public",
    country: "USA",
    state: "All States",
    office: "San Francisco HQ",
    department: "All Departments",
    status: "Active",
    createdBy: "System Admin",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6"
  },
  {
    id: "h7",
    name: "Summer Wellness Fest",
    description: "Annual company wellness retreat, mental health awareness, and team bonding day.",
    date: "2026-06-26",
    type: "Company",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    status: "Active",
    createdBy: "People Ops",
    createdDate: "2026-05-20",
    updatedDate: "2026-05-20",
    recurring: false,
    everyYear: false,
    applyToAll: true,
    color: "#10B981",
    notes: "Fun activities planned. Remote employees travel covered."
  },
  {
    id: "h8",
    name: "Independence Day",
    description: "Commemorates the Declaration of Independence of the United States.",
    date: "2026-07-04",
    type: "Public",
    country: "USA",
    state: "All States",
    office: "San Francisco HQ",
    department: "All Departments",
    status: "Active",
    createdBy: "System Admin",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6"
  },
  {
    id: "h9",
    name: "Optional Floating Holiday",
    description: "Employee-discretionary floating holiday for personal or cultural observances.",
    date: "2026-07-10",
    type: "Optional",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "Engineering",
    status: "Active",
    createdBy: "People Ops",
    createdDate: "2026-02-15",
    updatedDate: "2026-02-15",
    recurring: false,
    everyYear: false,
    applyToAll: false,
    color: "#8B5CF6"
  },
  {
    id: "h10",
    name: "Independence Day",
    description: "Commemorates India's independence from the United Kingdom.",
    date: "2026-08-15",
    type: "Public",
    country: "India",
    state: "All States",
    office: "Bengaluru Tech Park",
    department: "All Departments",
    status: "Active",
    createdBy: "HR Team",
    createdDate: "2025-12-15",
    updatedDate: "2025-12-15",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6"
  },
  {
    id: "h11",
    name: "Thanksgiving Day",
    description: "National holiday celebrated on the fourth Thursday of November.",
    date: "2026-11-26",
    type: "Public",
    country: "USA",
    state: "All States",
    office: "San Francisco HQ",
    department: "All Departments",
    status: "Active",
    createdBy: "System Admin",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#3B82F6"
  },
  {
    id: "h12",
    name: "Christmas Eve",
    description: "Half-day paid company holiday prior to Christmas Day.",
    date: "2026-12-24",
    type: "Company",
    country: "Global",
    state: "All States",
    office: "All Offices",
    department: "All Departments",
    status: "Active",
    createdBy: "Executive Team",
    createdDate: "2025-12-01",
    updatedDate: "2025-12-01",
    recurring: true,
    everyYear: true,
    applyToAll: true,
    color: "#10B981"
  }
];

const PRESET_COLORS = [
  { value: "#3B82F6", label: "Blue (Public)" },
  { value: "#10B981", label: "Green (Company)" },
  { value: "#F59E0B", label: "Amber (Regional)" },
  { value: "#8B5CF6", label: "Purple (Optional)" },
  { value: "#EC4899", label: "Pink" },
  { value: "#EF4444", label: "Red" }
];

// Deterministic short date formatter — always uses en-US locale (SSR-safe)
function fmtShortDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deterministic weekday formatter — always uses en-US locale (SSR-safe)
function fmtWeekday(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Filters
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2026");

  // Selection & Details Drawers
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Add / Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "duplicate">("add");
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDate, setFormDate] = useState("2026-06-25");
  const [formCountry, setFormCountry] = useState("USA");
  const [formState, setFormState] = useState("All States");
  const [formOffice, setFormOffice] = useState("All Offices");
  const [formDepartment, setFormDepartment] = useState("All Departments");
  const [formType, setFormType] = useState<"Public" | "Company" | "Regional" | "Optional">("Public");
  const [formColor, setFormColor] = useState("#3B82F6");
  const [formRecurring, setFormRecurring] = useState(false);
  const [formEveryYear, setFormEveryYear] = useState(true);
  const [formApplyToAll, setFormApplyToAll] = useState(true);
  const [formNotes, setFormNotes] = useState("");

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);

  // Calendar Navigation
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed)

  // Static system date — no Date.now() during render (SSR-safe)
  const sysYear = 2026;
  const sysMonth = 5; // June
  const sysDay = 25;

  useEffect(() => {
    if (yearFilter !== "all") {
      setCalendarYear(parseInt(yearFilter, 10));
    }
  }, [yearFilter]);

  const resetFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setStateFilter("all");
    setOfficeFilter("all");
    setDepartmentFilter("all");
    setTypeFilter("all");
    setYearFilter("2026");
    toast.success("Filters reset successfully");
  };

  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => {
      if (
        search &&
        !h.name.toLowerCase().includes(search.toLowerCase()) &&
        !h.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (countryFilter !== "all" && h.country !== "Global" && h.country.toLowerCase() !== countryFilter.toLowerCase()) {
        return false;
      }
      if (stateFilter !== "all" && h.state !== "All States" && h.state.toLowerCase() !== stateFilter.toLowerCase()) {
        return false;
      }
      if (officeFilter !== "all" && h.office !== "All Offices" && h.office.toLowerCase() !== officeFilter.toLowerCase()) {
        return false;
      }
      if (
        departmentFilter !== "all" &&
        h.department !== "All Departments" &&
        h.department.toLowerCase() !== departmentFilter.toLowerCase()
      ) {
        return false;
      }
      if (typeFilter !== "all" && h.type.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }
      if (yearFilter !== "all") {
        const holidayYear = h.date.split("-")[0];
        if (holidayYear !== yearFilter) return false;
      }
      return true;
    });
  }, [holidays, search, countryFilter, stateFilter, officeFilter, departmentFilter, typeFilter, yearFilter]);

  const stats = useMemo(() => {
    const active = holidays.filter((h) => h.status === "Active");
    const upcoming = active.filter((h) => {
      const [y, m, d] = h.date.split("-").map(Number);
      if (y > sysYear) return true;
      if (y === sysYear && m - 1 > sysMonth) return true;
      if (y === sysYear && m - 1 === sysMonth && d >= sysDay) return true;
      return false;
    });
    const publicH = active.filter((h) => h.type === "Public");
    const companyH = active.filter((h) => h.type === "Company");
    const optionalH = active.filter((h) => h.type === "Optional");
    return {
      total: active.length,
      upcoming: upcoming.length,
      public: publicH.length,
      company: companyH.length,
      optional: optionalH.length,
    };
  }, [holidays]);

  const timelineHolidays = useMemo(() => {
    const active = holidays.filter((h) => h.status === "Active");
    const upcoming = active.filter((h) => {
      const [y, m, d] = h.date.split("-").map(Number);
      if (y > sysYear) return true;
      if (y === sysYear && m - 1 > sysMonth) return true;
      if (y === sysYear && m - 1 === sysMonth && d >= sysDay) return true;
      return false;
    });
    upcoming.sort((a, b) => a.date.localeCompare(b.date));

    const todayList: Holiday[] = [];
    const tomorrowList: Holiday[] = [];
    const nextWeekList: Holiday[] = [];
    const nextMonthList: Holiday[] = [];
    const laterList: Holiday[] = [];

    upcoming.forEach((h) => {
      const [hY, hM, hD] = h.date.split("-").map(Number);
      const hDate = new Date(hY, hM - 1, hD);
      const sysDate = new Date(sysYear, sysMonth, sysDay);
      const diffDays = Math.ceil((hDate.getTime() - sysDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) todayList.push(h);
      else if (diffDays === 1) tomorrowList.push(h);
      else if (diffDays <= 7) nextWeekList.push(h);
      else if (diffDays <= 30) nextMonthList.push(h);
      else laterList.push(h);
    });

    return { today: todayList, tomorrow: tomorrowList, nextWeek: nextWeekList, nextMonth: nextMonthList, later: laterList };
  }, [holidays]);

  const categoryCounts = useMemo(() => {
    const active = holidays.filter((h) => h.status === "Active");
    return {
      Public: active.filter((h) => h.type === "Public").length,
      Company: active.filter((h) => h.type === "Company").length,
      Regional: active.filter((h) => h.type === "Regional").length,
      Optional: active.filter((h) => h.type === "Optional").length,
    };
  }, [holidays]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarCells = useMemo(() => {
    const totalDays = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
    const prevCells = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      prevCells.push({ day: prevMonthDays - i, month: prevMonth, year: prevYear, isPadding: true });
    }
    const currentCells = [];
    for (let i = 1; i <= totalDays; i++) {
      currentCells.push({ day: i, month: calendarMonth, year: calendarYear, isPadding: false });
    }
    const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    const nextCellsCount = 42 - prevCells.length - currentCells.length;
    const nextCells = [];
    for (let i = 1; i <= nextCellsCount; i++) {
      nextCells.push({ day: i, month: nextMonth, year: nextYear, isPadding: true });
    }
    return [...prevCells, ...currentCells, ...nextCells];
  }, [calendarYear, calendarMonth]);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };

  const isSameDay = (dateStr: string, cellYear: number, cellMonth: number, cellDay: number) => {
    const [hYear, hMonth, hDay] = dateStr.split("-").map(Number);
    return hYear === cellYear && hMonth - 1 === cellMonth && hDay === cellDay;
  };

  const openHolidayDetails = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDetailsOpen(true);
  };

  const openAddModal = (mode: "add" | "edit" | "duplicate", holiday?: Holiday) => {
    setModalMode(mode);
    if (mode === "add") {
      setEditingHolidayId(null);
      setFormName(""); setFormDescription(""); setFormDate("2026-06-25");
      setFormCountry("USA"); setFormState("All States"); setFormOffice("All Offices");
      setFormDepartment("All Departments"); setFormType("Public"); setFormColor("#3B82F6");
      setFormRecurring(false); setFormEveryYear(true); setFormApplyToAll(true); setFormNotes("");
    } else if (holiday) {
      setEditingHolidayId(holiday.id);
      setFormName(holiday.name); setFormDescription(holiday.description);
      setFormDate(holiday.date); setFormCountry(holiday.country); setFormState(holiday.state);
      setFormOffice(holiday.office); setFormDepartment(holiday.department); setFormType(holiday.type);
      setFormColor(holiday.color || "#3B82F6"); setFormRecurring(holiday.recurring);
      setFormEveryYear(holiday.everyYear); setFormApplyToAll(holiday.applyToAll); setFormNotes(holiday.notes || "");
    }
    setIsAddModalOpen(true);
  };

  // All new Date() calls are in event handlers — safe (client-only)
  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) { toast.error("Holiday name is required"); return; }
    if (!formDate) { toast.error("Holiday date is required"); return; }

    if (modalMode === "add" || modalMode === "duplicate") {
      const newHoliday: Holiday = {
        id: "h" + (holidays.length + 1) + "_" + Math.random().toString(36).substr(2, 4),
        name: formName, description: formDescription, date: formDate, type: formType,
        country: formCountry, state: formState, office: formOffice, department: formDepartment,
        status: "Active", createdBy: "Current User",
        createdDate: new Date().toISOString().split("T")[0],
        updatedDate: new Date().toISOString().split("T")[0],
        color: formColor, recurring: formRecurring, everyYear: formEveryYear,
        applyToAll: formApplyToAll, notes: formNotes
      };
      setHolidays((prev) => [newHoliday, ...prev]);
      toast.success(`Holiday "${formName}" created successfully`);
    } else if (modalMode === "edit" && editingHolidayId) {
      setHolidays((prev) =>
        prev.map((h) =>
          h.id === editingHolidayId
            ? {
                ...h, name: formName, description: formDescription, date: formDate, type: formType,
                country: formCountry, state: formState, office: formOffice, department: formDepartment,
                color: formColor, recurring: formRecurring, everyYear: formEveryYear,
                applyToAll: formApplyToAll, notes: formNotes,
                updatedDate: new Date().toISOString().split("T")[0],
              }
            : h
        )
      );
      toast.success(`Holiday "${formName}" updated successfully`);
    }
    setIsAddModalOpen(false);
  };

  const triggerDeleteHoliday = (holiday: Holiday) => {
    setHolidayToDelete(holiday);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteHoliday = () => {
    if (!holidayToDelete) return;
    setHolidays((prev) => prev.filter((h) => h.id !== holidayToDelete.id));
    setIsDeleteConfirmOpen(false);
    setIsDetailsOpen(false);
    toast.success(`Deleted holiday "${holidayToDelete.name}"`, {
      action: {
        label: "Undo",
        onClick: () => {
          setHolidays((prev) => [holidayToDelete, ...prev]);
          toast.success(`Restored holiday "${holidayToDelete.name}"`);
        },
      },
    });
  };

  const toggleArchiveHoliday = (holiday: Holiday) => {
    const nextStatus = holiday.status === "Active" ? "Archived" : "Active";
    setHolidays((prev) => prev.map((h) => (h.id === holiday.id ? { ...h, status: nextStatus } : h)));
    toast.success(`Holiday "${holiday.name}" has been ${nextStatus === "Archived" ? "archived" : "unarchived"}`);
    setIsDetailsOpen(false);
  };

  // Export — all new Date() here is in event handler (client-only)
  const exportHolidaysCSV = () => {
    const headers = "ID,Name,Date,Type,Country,Region/State,Office,Department,Status,CreatedBy,CreatedDate\n";
    const rows = filteredHolidays.map(
      (h) => `"${h.id}","${h.name}","${h.date}","${h.type}","${h.country}","${h.state}","${h.office}","${h.department}","${h.status}","${h.createdBy}","${h.createdDate}"`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `aurix_holidays_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export started successfully!");
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processImportedFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processImportedFile(e.target.files[0]);
  };

  const processImportedFile = (file: File) => {
    setImportedFile(file);
    const mockPreviewRows = [
      { name: "Labor Day", date: "2026-09-07", type: "Public", country: "USA", state: "All States", office: "San Francisco HQ", department: "All Departments", description: "National holiday honors the labor movement." },
      { name: "Veterans Day", date: "2026-11-11", type: "Public", country: "USA", state: "All States", office: "San Francisco HQ", department: "All Departments", description: "Honors military veterans of the United States Armed Forces." },
      { name: "Diwali Fest", date: "2026-11-08", type: "Regional", country: "India", state: "Karnataka", office: "Bengaluru Tech Park", department: "All Departments", description: "Festival of lights celebrated regionally." }
    ];
    setImportPreviewData(mockPreviewRows);
    toast.success(`File "${file.name}" loaded for preview`);
  };

  const handleConfirmImport = () => {
    if (importPreviewData.length === 0) { toast.error("No data available to import"); return; }
    // Math.random() only in event handler — safe
    const importedHolidays: Holiday[] = importPreviewData.map((row, idx) => ({
      id: "imp_" + idx + "_" + Math.random().toString(36).substr(2, 4),
      name: row.name, description: row.description, date: row.date, type: row.type,
      country: row.country, state: row.state, office: row.office, department: row.department,
      status: "Active", createdBy: "CSV Import",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      color: row.type === "Public" ? "#3B82F6" : row.type === "Company" ? "#10B981" : "#F59E0B",
      recurring: true, everyYear: true, applyToAll: true,
    }));
    setHolidays((prev) => [...importedHolidays, ...prev]);
    setIsImportModalOpen(false);
    setImportedFile(null);
    setImportPreviewData([]);
    toast.success(`Successfully imported ${importedHolidays.length} holidays`);
  };

  const highlightText = (text: string, searchStr: string) => {
    if (!searchStr) return text;
    const parts = text.split(new RegExp(`(${searchStr})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === searchStr.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/35 text-amber-200 px-0.5 rounded">{part}</mark>
          ) : (part)
        )}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Holidays"
        description="Manage public, regional, and company holidays."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)} className="h-9 border-border bg-card/40 text-xs hover:bg-accent/60">
              <Upload className="mr-2 h-3.5 w-3.5" /> Import Holidays
            </Button>
            <Button variant="outline" size="sm" onClick={exportHolidaysCSV} className="h-9 border-border bg-card/40 text-xs hover:bg-accent/60">
              <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button size="sm" onClick={() => openAddModal("add")} className="h-9 bg-primary text-xs text-primary-foreground shadow-glow hover:bg-primary/95">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Holiday
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Total Holidays", value: stats.total, trend: "All active", icon: Palmtree, color: "text-blue-500 bg-blue-500/10" },
          { label: "Upcoming", value: stats.upcoming, trend: "Next 12 months", icon: CalendarDays, color: "text-indigo-500 bg-indigo-500/10" },
          { label: "Public Holidays", value: stats.public, trend: "National / Federal", icon: Globe, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Company Holidays", value: stats.company, trend: "Internal paid", icon: Building2, color: "text-purple-500 bg-purple-500/10" },
          { label: "Optional / Floating", value: stats.optional, trend: "Discretionary", icon: Sparkles, color: "text-amber-500 bg-amber-500/10" },
        ].map((c, i) => {
          const IconComponent = c.icon;
          return (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/75 hover:shadow-elegant">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</span>
                <div className={`rounded-lg p-1.5 ${c.color}`}><IconComponent className="h-4 w-4" /></div>
              </div>
              <div className="mt-3"><span className="font-display text-2xl font-bold tracking-tight text-foreground">{c.value}</span></div>
              <p className="mt-1 text-[11px] text-muted-foreground group-hover:text-foreground/80 transition-colors">{c.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Filter and View mode Panel */}
      <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[200px] flex-1 md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search holiday name/info…" className="h-9 pl-9 border-border text-xs focus:ring-1 focus:ring-ring focus:border-border" />
            </div>

            {[
              { icon: Filter, label: "Country", value: countryFilter, set: setCountryFilter, opts: [["all","All Countries"],["usa","USA"],["india","India"],["global","Global"]] },
              { icon: MapPin, label: "State", value: stateFilter, set: setStateFilter, opts: [["all","All States"],["delhi","Delhi"],["california","California"],["karnataka","Karnataka"]] },
              { icon: Building2, label: "Office", value: officeFilter, set: setOfficeFilter, opts: [["all","All Offices"],["san francisco hq","San Francisco HQ"],["bengaluru tech park","Bengaluru Tech Park"]] },
            ].map(({ icon: Icon, label, value, set, opts }) => (
              <div key={label} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
                <Icon className="h-3 w-3" />
                <span>{label}:</span>
                <select value={value} onChange={(e) => set(e.target.value)} className="bg-transparent font-medium text-foreground outline-none cursor-pointer">
                  {opts.map(([v, l]) => <option key={v} value={v} className="bg-background">{l}</option>)}
                </select>
              </div>
            ))}

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span>Type:</span>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent font-medium text-foreground outline-none cursor-pointer">
                <option value="all" className="bg-background">All Types</option>
                <option value="public" className="bg-background">Public</option>
                <option value="company" className="bg-background">Company</option>
                <option value="regional" className="bg-background">Regional</option>
                <option value="optional" className="bg-background">Optional</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground">
              <span>Year:</span>
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="bg-transparent font-medium text-foreground outline-none cursor-pointer">
                <option value="all" className="bg-background">All Years</option>
                <option value="2026" className="bg-background">2026</option>
                <option value="2025" className="bg-background">2025</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted">
              <RefreshCw className="mr-1.5 h-3 w-3" /> Reset Filters
            </Button>
          </div>

          <div className="flex border border-border rounded-lg bg-card/80 p-0.5 overflow-hidden">
            <button onClick={() => setViewMode("calendar")} className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "calendar" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`} aria-label="Calendar view">
              <Calendar className="h-3.5 w-3.5" /> Calendar
            </button>
            <button onClick={() => setViewMode("list")} className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`} aria-label="List view">
              <List className="h-3.5 w-3.5" /> List View
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          {filteredHolidays.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground/80">
                <Palmtree className="h-6 w-6 animate-pulse" />
              </div>
              <h2 className="font-display text-lg font-semibold tracking-tight">No holidays found</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">No holidays match your current filter settings.</p>
              <div className="mt-6 flex justify-center gap-2">
                <Button size="sm" onClick={resetFilters} className="h-9 text-xs border border-border bg-card/60" variant="outline">Clear Filters</Button>
                <Button size="sm" onClick={() => openAddModal("add")} className="h-9 text-xs bg-primary text-primary-foreground shadow-glow hover:bg-primary/95">Create First Holiday</Button>
              </div>
            </div>
          ) : viewMode === "calendar" ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant">
              <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </h3>
                  <Badge variant="outline" className="text-[10px] py-0.5 px-2 text-muted-foreground border-border">
                    {filteredHolidays.length} active in view
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handlePrevMonth} className="rounded-lg border border-border bg-card/50 p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setCalendarMonth(sysMonth); setCalendarYear(sysYear); }} className="rounded-lg border border-border bg-card/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">Today</button>
                  <button onClick={handleNextMonth} className="rounded-lg border border-border bg-card/50 p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-border bg-muted/10 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground py-2.5">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 bg-border/5">
                {calendarCells.map((cell, idx) => {
                  const isToday = cell.year === sysYear && cell.month === sysMonth && cell.day === sysDay;
                  const isWeekend = new Date(cell.year, cell.month, cell.day).getDay() === 0 || new Date(cell.year, cell.month, cell.day).getDay() === 6;
                  const cellHolidays = filteredHolidays.filter((h) => isSameDay(h.date, cell.year, cell.month, cell.day));

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (cellHolidays.length > 0) openHolidayDetails(cellHolidays[0]);
                        else {
                          const monthStr = String(cell.month + 1).padStart(2, "0");
                          const dayStr = String(cell.day).padStart(2, "0");
                          setFormDate(`${cell.year}-${monthStr}-${dayStr}`);
                          openAddModal("add");
                        }
                      }}
                      className={`group relative min-h-[92px] border-b border-r border-border p-2 transition-all hover:bg-accent/15 cursor-pointer ${cell.isPadding ? "text-muted-foreground/35" : "text-foreground"} ${isWeekend ? "bg-muted/10" : "bg-card/30"} ${isToday ? "ring-1 ring-inset ring-blue-500/80 bg-blue-500/5" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${isToday ? "bg-blue-600 text-white font-bold shadow-glow" : ""}`}>{cell.day}</span>
                        {isToday && <span className="text-[9px] font-medium tracking-tight text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded">Today</span>}
                      </div>
                      <div className="mt-1.5 space-y-1 overflow-hidden">
                        {cellHolidays.slice(0, 2).map((h) => (
                          <div key={h.id} title={h.name} onClick={(e) => { e.stopPropagation(); openHolidayDetails(h); }}
                            style={{ borderLeftColor: h.color || "#3B82F6", backgroundColor: `${h.color}15` || "rgba(59,130,246,0.1)", color: h.color || "#3B82F6" }}
                            className="hidden md:block truncate rounded px-1.5 py-0.5 text-[9px] font-semibold border-l-2 leading-normal transition-all hover:scale-[1.02] hover:shadow">
                            {h.name}
                          </div>
                        ))}
                        {cellHolidays.length > 0 && (
                          <div className="flex justify-center gap-0.5 mt-1.5 md:hidden">
                            {cellHolidays.map((h) => <span key={h.id} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: h.color || "#3B82F6" }} />)}
                          </div>
                        )}
                        {cellHolidays.length > 2 && <div className="hidden md:block text-[8px] font-semibold text-muted-foreground pl-1.5">+ {cellHolidays.length - 2} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-elegant">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-5 py-3">Holiday Name</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Day</th>
                      <th className="px-5 py-3">Holiday Type</th>
                      <th className="px-5 py-3">Country</th>
                      <th className="px-5 py-3">Office Scope</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Created By</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHolidays.map((h) => {
                      // Use deterministic locale-fixed formatter (SSR-safe)
                      const dayName = fmtWeekday(h.date);
                      const isArchived = h.status === "Archived";
                      const typeBadge = {
                        Public: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                        Company: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                        Regional: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                        Optional: "bg-purple-500/10 text-purple-400 border-purple-500/30",
                      }[h.type];

                      return (
                        <tr key={h.id} className="border-b border-border transition-colors hover:bg-muted/10 group">
                          <td className="px-5 py-3.5 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: h.color || "#3B82F6" }} />
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs leading-normal">{highlightText(h.name, search)}</span>
                                <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px] mt-0.5">{highlightText(h.description, search)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">{h.date}</td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{dayName}</td>
                          <td className="px-5 py-3.5"><Badge variant="outline" className={`text-[10px] font-semibold py-0.5 px-2 ${typeBadge}`}>{h.type}</Badge></td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{h.country}</td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground"><span className="truncate max-w-[120px] inline-block" title={h.office}>{h.office}</span></td>
                          <td className="px-5 py-3.5">
                            <Badge variant={isArchived ? "outline" : "secondary"} className={`text-[9px] py-0.5 px-1.5 capitalize font-medium ${isArchived ? "text-muted-foreground border-border bg-muted/15" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>{h.status}</Badge>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <div className="h-4 w-4 rounded-full bg-accent/60 grid place-items-center text-[9px] text-foreground font-semibold">{h.createdBy.charAt(0)}</div>
                              <span className="text-[11px] truncate max-w-[90px]">{h.createdBy}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openHolidayDetails(h)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" title="View Details"><Eye className="h-3.5 w-3.5" /></button>
                              <button onClick={() => openAddModal("edit", h)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                              <button onClick={() => openAddModal("duplicate", h)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" title="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                              <button onClick={() => toggleArchiveHoliday(h)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground" title={isArchived ? "Activate" : "Archive"}><Archive className="h-3.5 w-3.5" /></button>
                              <button onClick={() => triggerDeleteHoliday(h)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: "Add Holiday", color: "text-blue-500", onClick: () => openAddModal("add") },
                { icon: Upload, label: "Import Holidays", color: "text-emerald-500", onClick: () => setIsImportModalOpen(true) },
                { icon: Download, label: "Export CSV", color: "text-purple-500", onClick: exportHolidaysCSV },
                { icon: Printer, label: "Print List", color: "text-amber-500", onClick: () => window.print() },
                { icon: CheckCircle2, label: "Sync Calendar", color: "text-blue-400", onClick: () => { navigator.clipboard.writeText(window.location.href); toast.success("Calendar link copied to clipboard"); } },
              ].map(({ icon: Icon, label, color, onClick }) => (
                <Button key={label} variant="outline" onClick={onClick} className="w-full h-10 justify-start text-xs border-border bg-card/30 hover:bg-accent gap-2.5 px-3">
                  <Icon className={`h-4 w-4 ${color} shrink-0`} />
                  <span className="truncate">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground mb-4">Upcoming Holidays</h3>
            <div className="space-y-4">
              {[
                { label: "Today", list: timelineHolidays.today },
                { label: "Tomorrow", list: timelineHolidays.tomorrow },
                { label: "Next Week", list: timelineHolidays.nextWeek },
                { label: "Next Month", list: timelineHolidays.nextMonth },
                { label: "Later", list: timelineHolidays.later.slice(0, 2) },
              ].map((timegroup, idx) => {
                if (timegroup.list.length === 0) return null;
                return (
                  <div key={idx} className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{timegroup.label}</span>
                    <div className="space-y-1.5 border-l border-border/80 pl-3 ml-1.5">
                      {timegroup.list.map((h) => (
                        <div key={h.id} onClick={() => openHolidayDetails(h)} className="group/item flex items-start justify-between cursor-pointer rounded p-1 hover:bg-muted/15">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-semibold text-foreground group-hover/item:text-primary transition-colors">{h.name}</h4>
                            {/* Use deterministic en-US locale formatter — SSR-safe */}
                            <p className="text-[10px] text-muted-foreground">{fmtShortDate(h.date)}</p>
                          </div>
                          <Badge className="text-[9px] scale-90 px-1 py-0 border-none font-semibold text-white" style={{ backgroundColor: h.color || "#3B82F6" }}>{h.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {stats.upcoming === 0 && <div className="p-4 text-center text-xs text-muted-foreground bg-muted/10 rounded-xl">No upcoming holidays.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-elegant">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground mb-4">Holiday Categories</h3>
            <div className="space-y-3.5">
              {[
                { label: "Public Holidays", desc: "National or federal statutory paid off.", count: categoryCounts.Public, color: "bg-blue-500" },
                { label: "Company Holidays", desc: "Strategic operations days off by Aurix.", count: categoryCounts.Company, color: "bg-emerald-500" },
                { label: "Regional Holidays", desc: "State or territory level local festivals.", count: categoryCounts.Regional, color: "bg-amber-500" },
                { label: "Optional / Floating", desc: "Personal cultural or religious choices.", count: categoryCounts.Optional, color: "bg-purple-500" },
              ].map((cat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${cat.color}`} />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span>{cat.label}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5">{cat.count}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-full border-l border-border bg-card/95 backdrop-blur-xl sm:max-w-md p-6">
          <SheetHeader className="pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-semibold text-white px-2 py-0.5 border-none" style={{ backgroundColor: selectedHoliday?.color || "#3B82F6" }}>
                {selectedHoliday?.type}
              </Badge>
              <div className="flex items-center gap-1.5">
                <button onClick={() => selectedHoliday && openAddModal("edit", selectedHoliday)} className="rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent" title="Edit Holiday"><Edit className="h-4 w-4" /></button>
                <button onClick={() => selectedHoliday && openAddModal("duplicate", selectedHoliday)} className="rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent" title="Duplicate Holiday"><Copy className="h-4 w-4" /></button>
                <button onClick={() => selectedHoliday && toggleArchiveHoliday(selectedHoliday)} className="rounded p-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent" title={selectedHoliday?.status === "Active" ? "Archive" : "Unarchive"}><Archive className="h-4 w-4" /></button>
                <button onClick={() => selectedHoliday && triggerDeleteHoliday(selectedHoliday)} className="rounded p-1.5 border border-destructive/20 text-destructive/80 hover:bg-destructive/10 hover:text-destructive" title="Delete Holiday"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <SheetTitle className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">{selectedHoliday?.name}</SheetTitle>
            <SheetDescription className="mt-1.5 text-xs text-muted-foreground">{selectedHoliday?.description}</SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4 text-xs overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="grid grid-cols-2 gap-4 border-b border-border/80 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Holiday Date</span>
                <p className="mt-1 font-semibold text-foreground font-mono">{selectedHoliday?.date}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Day of Week</span>
                {/* Use deterministic en-US locale — SSR-safe */}
                <p className="mt-1 font-semibold text-foreground">{selectedHoliday?.date ? fmtWeekday(selectedHoliday.date) : "—"}</p>
              </div>
            </div>

            <div className="space-y-3.5 border-b border-border/80 pb-4">
              {[
                ["Country Scope", selectedHoliday?.country],
                ["Region / State", selectedHoliday?.state],
                ["Office Location", selectedHoliday?.office],
                ["Department", selectedHoliday?.department],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-border/80 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recurring Every Year</span>
                <Badge variant="outline" className="text-[10px] py-0 px-2">{selectedHoliday?.recurring ? "Yes" : "No"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Apply to All Employees</span>
                <Badge variant="outline" className="text-[10px] py-0 px-2">{selectedHoliday?.applyToAll ? "Yes" : "No"}</Badge>
              </div>
            </div>

            <div className="space-y-2 border-b border-border/80 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Notes & Special Instructions</span>
              <p className="text-muted-foreground leading-normal italic">{selectedHoliday?.notes || "No special notes configured for this holiday."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground pt-2">
              <div><span>Created By:</span><p className="font-medium text-foreground/80 mt-0.5">{selectedHoliday?.createdBy}</p></div>
              <div><span>Last Updated:</span><p className="font-medium text-foreground/80 mt-0.5">{selectedHoliday?.updatedDate}</p></div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add / Edit / Duplicate Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-semibold tracking-tight text-foreground">
              {modalMode === "add" ? "Add New Holiday" : modalMode === "edit" ? "Edit Holiday Details" : "Duplicate Holiday"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Configure parameters to define the operational holiday scope.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveHoliday} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Holiday Name *</label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Independence Day" required className="h-9 text-xs border-border" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Description</label>
                <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Briefly state significance of this day off…" className="h-9 text-xs border-border" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Date *</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Holiday Type</label>
                <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="Public">Public Holiday</option>
                  <option value="Company">Company Holiday</option>
                  <option value="Regional">Regional Holiday</option>
                  <option value="Optional">Optional Holiday</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Country</label>
                <select value={formCountry} onChange={(e) => setFormCountry(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="Global">Global / Universal</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">State / Region</label>
                <select value={formState} onChange={(e) => setFormState(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="All States">All States</option>
                  <option value="California">California</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Office Location</label>
                <select value={formOffice} onChange={(e) => setFormOffice(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="All Offices">All Offices</option>
                  <option value="San Francisco HQ">San Francisco HQ</option>
                  <option value="Bengaluru Tech Park">Bengaluru Tech Park</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Department Scope</label>
                <select value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring">
                  <option value="All Departments">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR & Ops</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="font-semibold text-muted-foreground">Calendar Color Theme</label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button key={c.value} type="button" onClick={() => setFormColor(c.value)} style={{ backgroundColor: c.value }} className={`h-6 w-6 rounded-full border transition-all ${formColor === c.value ? "ring-2 ring-white ring-offset-2 scale-110 border-white" : "border-transparent opacity-85 hover:opacity-100"}`} title={c.label} />
                  ))}
                  <input type="color" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="h-6 w-8 rounded bg-transparent border-0 cursor-pointer" />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3 py-1 bg-muted/10 rounded-xl px-3 border border-border">
                {[
                  { label: "Recurring Holiday", id: "recurring", value: formRecurring, set: setFormRecurring },
                  { label: "Every Year", id: "everyYear", value: formEveryYear, set: setFormEveryYear },
                ].map(({ label, id, value, set }) => (
                  <div key={id} className="flex items-center justify-between">
                    <label className="font-medium text-foreground cursor-pointer" htmlFor={id}>{label}</label>
                    <input type="checkbox" id={id} checked={value} onChange={(e) => set(e.target.checked)} className="h-3.5 w-3.5 rounded text-primary focus:ring-primary accent-primary" />
                  </div>
                ))}
                <div className="flex items-center justify-between col-span-2 border-t border-border pt-2 mt-1">
                  <label className="font-medium text-foreground cursor-pointer" htmlFor="applyAll">Apply to All Employees</label>
                  <input type="checkbox" id="applyAll" checked={formApplyToAll} onChange={(e) => setFormApplyToAll(e.target.checked)} className="h-3.5 w-3.5 rounded text-primary focus:ring-primary accent-primary" />
                </div>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Special Notes</label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Any operational guidelines…" rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-muted-foreground">Upload Holiday Icon (Optional)</label>
                <div className="flex items-center gap-2 border border-dashed border-border rounded-lg px-3 py-2 bg-muted/5">
                  <Palmtree className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground flex-1">Upload SVG/PNG icon for custom visual lists</span>
                  <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] border-border bg-card" onClick={() => toast.info("Custom icon asset uploaded successfully (simulation)")}>Select file</Button>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t border-border gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="h-9 border-border bg-transparent hover:bg-muted text-xs">Cancel</Button>
              <Button type="submit" className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-xl border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-semibold tracking-tight text-foreground">Import Holidays from CSV/Excel</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Bulk upload public and custom regional holidays instantly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs">
            <div onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/80 rounded-2xl bg-muted/5 p-8 text-center cursor-pointer hover:bg-muted/15 transition-all flex flex-col items-center justify-center space-y-2 group">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.xlsx,.xls" className="hidden" />
              <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground/80 grid place-items-center group-hover:scale-105 transition-transform"><FileSpreadsheet className="h-5 w-5 text-emerald-500" /></div>
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground">{importedFile ? importedFile.name : "Drag & drop CSV/Excel here"}</span>
                <p className="text-[10px] text-muted-foreground">or click to select file from your system (Max 10MB)</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] text-muted-foreground">Follow sample layout parameters for clean import.</span>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.success("Sample template downloaded"); }} className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                <Download className="h-2.5 w-2.5" /> Download sample template
              </a>
            </div>
            {importPreviewData.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">File Data Preview ({importPreviewData.length} records found)</span>
                <div className="max-h-[140px] overflow-y-auto rounded-lg border border-border bg-card/60">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-muted/20 text-muted-foreground border-b border-border sticky top-0">
                      <tr><th className="px-3 py-1.5">Name</th><th className="px-3 py-1.5">Date</th><th className="px-3 py-1.5">Type</th><th className="px-3 py-1.5">Scope</th></tr>
                    </thead>
                    <tbody>
                      {importPreviewData.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/60 hover:bg-muted/10">
                          <td className="px-3 py-1.5 font-medium text-foreground">{row.name}</td>
                          <td className="px-3 py-1.5 font-mono text-muted-foreground">{row.date}</td>
                          <td className="px-3 py-1.5"><span className="text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-foreground font-semibold">{row.type}</span></td>
                          <td className="px-3 py-1.5 text-muted-foreground">{row.country} - {row.office}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <DialogFooter className="pt-2 border-t border-border gap-2">
              <Button type="button" variant="ghost" onClick={() => { setIsImportModalOpen(false); setImportedFile(null); setImportPreviewData([]); }} className="h-9 border-border bg-transparent text-xs">Cancel</Button>
              <Button type="button" onClick={handleConfirmImport} disabled={importPreviewData.length === 0} className="h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs disabled:opacity-50">Import {importPreviewData.length} Holidays</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md border border-border bg-card p-6 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
          <DialogHeader className="flex flex-row items-start gap-4">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive shrink-0 mt-1"><AlertTriangle className="h-5 w-5" /></div>
            <div className="space-y-1">
              <DialogTitle className="font-display text-base font-semibold tracking-tight text-foreground">Delete Holiday Confirmation</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Are you sure you want to permanently delete the holiday <span className="font-bold text-foreground">"{holidayToDelete?.name}"</span>?</DialogDescription>
            </div>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-normal px-1">This action will remove the holiday from calendar schedules and operation timesheets.</p>
          <DialogFooter className="pt-2 border-t border-border gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)} className="h-9 border-border bg-transparent text-xs">Cancel</Button>
            <Button type="button" onClick={confirmDeleteHoliday} className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs">Delete Holiday</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
