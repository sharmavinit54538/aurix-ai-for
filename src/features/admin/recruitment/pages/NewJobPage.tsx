import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, Briefcase, Building, MapPin, DollarSign, Users, 
  Calendar, Tag, Sparkles, Wand2, Maximize2, Minimize2, 
  ShieldCheck, Smile, Send, Plus, X, AlertCircle, 
  Check, Copy, Eye, Edit3, Loader2, Clock, Globe,
  HelpCircle, Trash2, Layers, CheckCircle2, ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { api } from "@/api";
import { toast } from "sonner";
import type { 
  Job, 
  EmploymentType, 
  WorkMode, 
  JobStatus 
} from "@/features/admin/recruitment/types";

// Standard departments list
const DEPARTMENTS = [
  "Engineering",
  "Product Management",
  "Design & Creative",
  "Sales & Business Dev",
  "Marketing & Growth",
  "Human Resources",
  "Finance & Accounting",
  "Operations",
  "Customer Support",
  "Legal & Compliance",
  "Data & AI Analytics",
  "Other",
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

const WORK_MODES: WorkMode[] = [
  "Remote",
  "Hybrid",
  "Onsite",
];

const EXPERIENCE_OPTIONS = [
  "0-1 yr (Entry Level)",
  "1-3 yrs (Junior)",
  "3-5 yrs (Mid-Level)",
  "5-8 yrs (Senior)",
  "8+ yrs (Lead / Principal)",
  "10+ yrs (Director / Executive)",
];

const SUGGESTED_SKILLS = [
  "React", "TypeScript", "Python", "FastAPI", 
  "PostgreSQL", "Docker", "AWS", "Figma", 
  "Node.js", "GraphQL", "Kubernetes", "Leadership", 
  "Product Strategy", "Machine Learning", "Excel"
];

const POPULAR_LOCATIONS = [
  "Remote", "Bangalore, India", "Hyderabad, India", 
  "Pune, India", "Mumbai, India", "Delhi NCR, India", 
  "San Francisco, USA", "New York, USA", "London, UK"
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

// Helper to render markdown safely
function MarkdownRenderer({ content }: { content: unknown }) {
  const text = typeof content === "string" 
    ? content 
    : content && typeof content === "object" && "description" in (content as any)
      ? String((content as any).description)
      : String(content || "");

  if (!text.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/70 rounded-xl">
        <Edit3 className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm font-medium">No description written yet.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Switch to the "Write" tab or use OFC360 to generate one.</p>
      </div>
    );
  }

  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-display font-bold text-foreground mt-6 mb-3 border-b border-border/80 pb-1.5">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-display font-bold text-foreground mt-5 mb-2.5">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h3>')
    .replace(/^\- (.*?)$/gm, '<li class="ml-5 list-disc text-sm text-muted-foreground my-1">$1</li>')
    .replace(/^\* (.*?)$/gm, '<li class="ml-5 list-disc text-sm text-muted-foreground my-1">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/90">$1</em>')
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p class="text-sm text-muted-foreground leading-relaxed my-2.5">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  return (
    <div 
      className="space-y-1 text-muted-foreground prose dark:prose-invert max-w-none text-sm leading-relaxed" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

export function NewJobPage() {
  const navigate = useNavigate();
  const { upsertJob } = useRecruitment();

  // Basic Details
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [customDepartment, setCustomDepartment] = useState("");
  const [location, setLocation] = useState("Remote");
  const [locationSearch, setLocationSearch] = useState("Remote");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [employmentType, setEmploymentType] = useState<EmploymentType>("Full-time");
  const [workMode, setWorkMode] = useState<WorkMode>("Remote");
  const [experience, setExperience] = useState("3-5 yrs (Mid-Level)");

  // Compensation & Openings
  const [vacancies, setVacancies] = useState<number>(1);
  const [currency, setCurrency] = useState("INR");
  const [salaryMin, setSalaryMin] = useState<string>("800000");
  const [salaryMax, setSalaryMax] = useState<string>("1600000");
  
  // Deadlines & Status
  const defaultDeadline = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, []);
  const [closingDate, setClosingDate] = useState<string>(defaultDeadline);
  const [jobStatus, setJobStatus] = useState<JobStatus>("active");

  // Skills
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [skillInput, setSkillInput] = useState("");

  // Responsibilities & Requirements Lists
  const [responsibilities, setResponsibilities] = useState<string[]>([
    "Architect, build, and maintain efficient, reusable, and reliable frontend code.",
    "Collaborate with product managers and designers to translate requirements into technical designs.",
    "Participate in code reviews, design discussions, and system architecture planning."
  ]);
  const [newRespInput, setNewRespInput] = useState("");

  const [requirements, setRequirements] = useState<string[]>([
    "Proven experience building production-grade web applications.",
    "Strong proficiency in modern JavaScript, TypeScript, and React frameworks.",
    "Familiarity with REST APIs, state management, and modern CSS tooling."
  ]);
  const [newReqInput, setNewReqInput] = useState("");

  // Job Description Content & Tab
  const [description, setDescription] = useState<string>(
    "### About The Role\nWe are looking for a dedicated and skilled professional to join our fast-paced enterprise platform team. In this role, you will lead development efforts, contribute to strategic architecture, and build mission-critical solutions.\n\n### What We Offer\n- Competitive compensation and performance bonuses\n- Comprehensive health insurance and wellness benefits\n- Flexible work arrangements and continuous learning opportunities"
  );
  const [editorTab, setEditorTab] = useState<"write" | "preview">("preview");

  // AI Generation States
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isRefiningAi, setIsRefiningAi] = useState(false);
  const [aiCustomInstruction, setAiCustomInstruction] = useState("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // Form Validation & Submission States
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return POPULAR_LOCATIONS;
    return POPULAR_LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  // Skill management
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      if (formErrors.skills) {
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated.skills;
          return updated;
        });
      }
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Responsibility list management
  const handleAddResponsibility = () => {
    if (newRespInput.trim()) {
      setResponsibilities(prev => [...prev, newRespInput.trim()]);
      setNewRespInput("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(prev => prev.filter((_, i) => i !== index));
  };

  // Requirements list management
  const handleAddRequirement = () => {
    if (newReqInput.trim()) {
      setRequirements(prev => [...prev, newReqInput.trim()]);
      setNewReqInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  // Copy JD text
  const handleCopyJd = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    toast.success("Job description copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Generation with defensive handling
  const handleGenerateJdWithAi = async () => {
    if (!title.trim()) {
      setFormErrors(prev => ({ ...prev, title: "Job Title is required before generating description with AI." }));
      toast.error("Please provide a Job Title first.");
      return;
    }

    setIsGeneratingAi(true);
    setSubmitError(null);
    toast.info("OFC360 is drafting job requirements...");

    const effectiveDept = department === "Other" && customDepartment ? customDepartment : department;

    try {
      const response = await api.post<any>("/jobs/generate-description", {
        title: title.trim(),
        department: effectiveDept,
        employment_type: employmentType,
        location: location.trim(),
        skills: skills.length > 0 ? skills : ["Problem Solving", "Collaboration"],
        experience: experience
      }, { timeout: 45000 });

      let generatedContent = "";
      if (typeof response === "string") {
        generatedContent = response;
      } else if (response && typeof response.data === "string") {
        generatedContent = response.data;
      } else if (response?.data?.description) {
        generatedContent = response.data.description;
      } else if (response?.description) {
        generatedContent = response.description;
      } else if (response?.data && typeof response.data === "object") {
        generatedContent = response.data.generated_jd || response.data.content || JSON.stringify(response.data, null, 2);
      }

      if (generatedContent && typeof generatedContent === "string") {
        setDescription(generatedContent);
        setEditorTab("preview");
        toast.success("AI generated job description loaded!");
      } else {
        throw new Error(response?.message || "AI returned empty content");
      }
    } catch (err: any) {
      console.warn("AI generation offline or unavailable:", err);
      toast.warning("AI service is currently offline or unreachable. You can continue writing manually.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Modification with defensive handling
  const handleModifyJdWithAi = async (
    action: "improve" | "expand" | "shorten" | "professional" | "casual" | "custom",
    customPrompt?: string
  ) => {
    if (!description.trim()) {
      toast.error("Please add some description text first.");
      return;
    }

    setIsRefiningAi(true);
    toast.info("OFC360 is refining description...");

    try {
      const response = await api.post<any>("/jobs/modify-description", {
        current_description: description,
        action: action,
        custom_instruction: customPrompt
      }, { timeout: 45000 });

      let refinedContent = "";
      if (typeof response === "string") {
        refinedContent = response;
      } else if (response && typeof response.data === "string") {
        refinedContent = response.data;
      } else if (response?.data?.description) {
        refinedContent = response.data.description;
      } else if (response?.description) {
        refinedContent = response.description;
      }

      if (refinedContent) {
        setDescription(refinedContent);
        if (action === "custom") {
          setAiCustomInstruction("");
        }
        toast.success("Job description updated with AI adjustments!");
      } else {
        throw new Error(response?.message || "Failed to refine description");
      }
    } catch (err: any) {
      console.warn("AI refinement error:", err);
      toast.warning("AI modification unavailable: " + (err.message || "service error"));
    } finally {
      setIsRefiningAi(false);
    }
  };

  // Validate form
  const validate = (targetStatus: JobStatus): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Job title is required.";
    }

    if (department === "Other" && !customDepartment.trim()) {
      errors.department = "Please specify the custom department name.";
    }

    if (!location.trim()) {
      errors.location = "Job location is required.";
    }

    if (skills.length === 0) {
      errors.skills = "At least one required skill must be added.";
    }

    if (!description.trim()) {
      errors.description = "Job description is required.";
    } else if (description.trim().length < 20) {
      errors.description = "Description is too short. Please provide at least 20 characters.";
    }

    const minNum = parseFloat(salaryMin);
    const maxNum = parseFloat(salaryMax);
    if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) {
      errors.salary = "Minimum salary cannot exceed maximum salary.";
    }

    if (vacancies < 1) {
      errors.vacancies = "Number of openings must be at least 1.";
    }

    // For active/publishing, require at least one responsibility and requirement
    if (targetStatus === "active") {
      if (responsibilities.length === 0) {
        errors.responsibilities = "Please add at least one key responsibility.";
      }
      if (requirements.length === 0) {
        errors.requirements = "Please add at least one qualification/requirement.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Job
  const handleSubmitJob = async (statusToSave: JobStatus) => {
    setSubmitError(null);

    if (!validate(statusToSave)) {
      toast.error("Please resolve the highlighted validation errors.");
      return;
    }

    setIsSubmitting(true);

    const effectiveDepartment = department === "Other" && customDepartment.trim() 
      ? customDepartment.trim() 
      : department;

    const minSal = parseFloat(salaryMin) || 0;
    const maxSal = parseFloat(salaryMax) || minSal;
    const nowIso = new Date().toISOString();
    const closeIso = closingDate 
      ? new Date(closingDate).toISOString() 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const jobPayload: Job = {
      id: "",
      title: title.trim(),
      department: effectiveDepartment,
      employmentType: employmentType,
      experience: experience,
      skills: skills,
      salaryMin: minSal,
      salaryMax: maxSal,
      currency: currency,
      vacancies: Number(vacancies) || 1,
      location: location.trim(),
      workMode: workMode,
      description: description.trim(),
      responsibilities: responsibilities,
      requirements: requirements,
      benefits: [
        "Health & Life Insurance",
        "Learning and Conference Budget",
        "Performance Bonus and Equity Options",
        "Flexible Remote Work Options"
      ],
      hiringManager: "Department Lead",
      recruiter: "Recruitment Operations",
      status: statusToSave,
      publishedAt: nowIso,
      closingAt: closeIso,
      applicants: 0,
    };

    try {
      const response = (await upsertJob(jobPayload)) as any;
      
      // Extract created ID defensively
      const createdId = response?.id || response?.data?.id || response?.data?.job?.id || response?.data;
      
      toast.success(
        statusToSave === "active" 
          ? "Job posting published successfully!" 
          : "Job draft saved successfully!"
      );

      if (typeof createdId === "string" && createdId.length > 5) {
        navigate({ 
          to: "/dashboard/recruitment/jobs/$jobId", 
          params: { jobId: createdId } 
        });
      } else {
        navigate({ to: "/dashboard/recruitment/jobs" });
      }
    } catch (err: any) {
      console.error("Job creation error:", err);
      const message = err.message || "Failed to create job posting. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28">
      {/* Top Navigation & Breadcrumbs */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link 
            to="/dashboard/recruitment" 
            className="hover:text-foreground transition-colors"
          >
            Recruitment
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <Link 
            to="/dashboard/recruitment/jobs" 
            className="hover:text-foreground transition-colors"
          >
            Jobs
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-foreground font-medium">New Position</span>
        </div>

      </div>

      <PageHeader 
        title="Create New Job Requisition" 
        description="Specify job requirements, role parameters, compensation, and let OFC360 assist in drafting job descriptions." 
      />

      {submitError && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Creation Error</p>
            <p className="text-xs text-destructive/80 mt-0.5">{submitError}</p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setSubmitError(null)}
            className="text-destructive hover:bg-destructive/20 h-7 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Form (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: ROLE OVERVIEW */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Basic Role Information
              </h2>
              <span className="text-xs text-muted-foreground">* Required fields</span>
            </div>

            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span>Job Title <span className="text-destructive">*</span></span>
                  {formErrors.title && <span className="text-xs text-destructive">{formErrors.title}</span>}
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formErrors.title) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.title;
                        return next;
                      });
                    }
                  }}
                  placeholder="e.g. Senior Full-Stack Engineer, Talent Acquisition Manager"
                  className={`h-11 rounded-xl bg-background/50 text-sm ${formErrors.title ? "border-destructive focus-visible:ring-destructive" : "border-border/80"}`}
                />
              </div>

              {/* Department & Experience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="department" className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span>Department <span className="text-destructive">*</span></span>
                    {formErrors.department && <span className="text-xs text-destructive">{formErrors.department}</span>}
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department" className="h-11 rounded-xl bg-background/50 border-border/80 text-sm">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {department === "Other" && (
                    <Input
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                      placeholder="Specify custom department"
                      className="mt-2 h-10 rounded-xl bg-background/50 border-border/80 text-sm"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="text-sm font-medium text-foreground">
                    Experience Level
                  </Label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger id="experience" className="h-11 rounded-xl bg-background/50 border-border/80 text-sm">
                      <SelectValue placeholder="Select Experience Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Employment Type & Work Mode Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="employmentType" className="text-sm font-medium text-foreground">
                    Employment Type <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={employmentType} 
                    onValueChange={(val) => setEmploymentType(val as EmploymentType)}
                  >
                    <SelectTrigger id="employmentType" className="h-11 rounded-xl bg-background/50 border-border/80 text-sm">
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="workMode" className="text-sm font-medium text-foreground">
                    Work Mode <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={workMode} 
                    onValueChange={(val) => setWorkMode(val as WorkMode)}
                  >
                    <SelectTrigger id="workMode" className="h-11 rounded-xl bg-background/50 border-border/80 text-sm">
                      <SelectValue placeholder="Select Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location Input with autocomplete suggestions */}
              <div className="space-y-1.5" ref={locationRef}>
                <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Office Location <span className="text-destructive">*</span>
                  </span>
                  {formErrors.location && <span className="text-xs text-destructive">{formErrors.location}</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setLocation(e.target.value);
                      setShowLocationSuggestions(true);
                      if (formErrors.location) {
                        setFormErrors(prev => {
                          const next = { ...prev };
                          delete next.location;
                          return next;
                        });
                      }
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    placeholder="e.g. Remote, Bangalore, San Francisco"
                    className="h-11 rounded-xl bg-background/50 border-border/80 text-sm"
                  />

                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-popover border border-border shadow-2xl rounded-xl z-50 overflow-hidden max-h-48 overflow-y-auto backdrop-blur-2xl">
                      {filteredLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setLocationSearch(loc);
                            setShowLocationSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2 border-b border-border/30 last:border-b-0"
                        >
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{loc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-muted-foreground self-center mr-1">Quick select:</span>
                  {POPULAR_LOCATIONS.slice(0, 5).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setLocation(loc);
                        setLocationSearch(loc);
                      }}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                        location === loc 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background/40 hover:bg-accent text-muted-foreground border-border/60"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: OPENINGS & COMPENSATION */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Compensation, Openings & Timeline
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Vacancies */}
              <div className="space-y-1.5">
                <Label htmlFor="vacancies" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  Openings <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="vacancies"
                  type="number"
                  min={1}
                  value={vacancies}
                  onChange={(e) => setVacancies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-11 rounded-xl bg-background/50 border-border/80 text-sm"
                />
              </div>

              {/* Currency */}
              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-sm font-medium text-foreground">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" className="h-11 rounded-xl bg-background/50 border-border/80 text-sm">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Application Deadline */}
              <div className="space-y-1.5">
                <Label htmlFor="closingDate" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Application Deadline
                </Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="h-11 rounded-xl bg-background/50 border-border/80 text-sm"
                />
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Annual Salary Range ({currency})
                </Label>
                {formErrors.salary && <span className="text-xs text-destructive">{formErrors.salary}</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Min
                  </span>
                  <Input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="e.g. 800000"
                    className="h-11 rounded-xl bg-background/50 border-border/80 pl-12 text-sm"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                    Max
                  </span>
                  <Input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="h-11 rounded-xl bg-background/50 border-border/80 pl-12 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SKILLS TAGGING */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Tag className="h-4 w-4 text-violet-500" />
                Required Skills & Competencies <span className="text-destructive">*</span>
              </h2>
              {formErrors.skills && <span className="text-xs text-destructive">{formErrors.skills}</span>}
            </div>

            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type a skill (e.g. Next.js, System Design) and press Enter"
                className="h-11 rounded-xl bg-background/50 border-border/80 text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddSkill(skillInput)}
                className="h-11 rounded-xl px-5 border border-border/80"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add
              </Button>
            </div>

            {/* Selected Skills Chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-background/40 rounded-xl border border-border/60">
                {skills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="py-1 px-2.5 text-xs rounded-lg flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/25"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="hover:text-destructive focus:outline-none transition-colors"
                      title={`Remove ${s}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggested Skills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-muted-foreground">Quick add suggested skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map((s) => {
                  const exists = skills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => exists ? handleRemoveSkill(s) : handleAddSkill(s)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        exists
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background/40 hover:bg-accent text-muted-foreground border-border/60"
                      }`}
                    >
                      {exists ? `✓ ${s}` : `+ ${s}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 4: RESPONSIBILITIES & REQUIREMENTS LISTS */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Responsibilities & Qualifications
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Outline explicit expectations and prerequisites for applicants.
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Key Responsibilities
                </Label>
                {formErrors.responsibilities && (
                  <span className="text-xs text-destructive">{formErrors.responsibilities}</span>
                )}
              </div>

              <div className="space-y-2">
                {responsibilities.map((resp, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 p-2.5 bg-background/40 rounded-xl border border-border/60 group"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground flex-1 leading-relaxed">{resp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                      title="Remove responsibility"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newRespInput}
                  onChange={(e) => setNewRespInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddResponsibility();
                    }
                  }}
                  placeholder="e.g. Design and implement microservices in Go or Python"
                  className="h-10 rounded-xl bg-background/50 border-border/80 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddResponsibility}
                  className="rounded-xl border-border/80 h-10 px-4 text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Qualifications / Requirements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Qualifications & Requirements
                </Label>
                {formErrors.requirements && (
                  <span className="text-xs text-destructive">{formErrors.requirements}</span>
                )}
              </div>

              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 p-2.5 bg-background/40 rounded-xl border border-border/60 group"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                    <span className="text-xs text-muted-foreground flex-1 leading-relaxed">{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                      title="Remove qualification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newReqInput}
                  onChange={(e) => setNewReqInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                  placeholder="e.g. Bachelor's degree in Computer Science or equivalent experience"
                  className="h-10 rounded-xl bg-background/50 border-border/80 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRequirement}
                  className="rounded-xl border-border/80 h-10 px-4 text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 5: JOB DESCRIPTION EDITOR */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-primary" />
                  Full Job Description <span className="text-destructive">*</span>
                </h2>
                {formErrors.description && (
                  <span className="text-xs text-destructive block mt-0.5">{formErrors.description}</span>
                )}
              </div>

              {/* Mode toggles & AI generator trigger */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleGenerateJdWithAi}
                  disabled={isGeneratingAi || isRefiningAi}
                  className="rounded-xl h-8 px-3 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 text-xs font-medium"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Drafting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Generate with AI
                    </>
                  )}
                </Button>

                <div className="flex rounded-xl bg-background/60 p-0.5 border border-border/80">
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      editorTab === "preview"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3 w-3 inline mr-1" /> Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("write")}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      editorTab === "write"
                        ? "bg-card text-foreground shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Edit3 className="h-3 w-3 inline mr-1" /> Write
                  </button>
                </div>
              </div>
            </div>

            {/* Description Editor / Preview */}
            <div className="min-h-[380px]">
              {editorTab === "write" ? (
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) {
                      setFormErrors(prev => {
                        const next = { ...prev };
                        delete next.description;
                        return next;
                      });
                    }
                  }}
                  rows={16}
                  placeholder="Write job description in markdown..."
                  className="w-full bg-background/40 border border-border/80 focus:border-primary/50 rounded-xl p-4 font-mono text-xs leading-relaxed resize-y"
                />
              ) : (
                <div className="p-4 bg-background/25 border border-border/60 rounded-xl min-h-[380px] max-h-[500px] overflow-y-auto">
                  <MarkdownRenderer content={description} />
                </div>
              )}
            </div>

            {/* Quick JD actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
              <span>Supports Markdown headings (#, ##), bullets (-), and bold (**text**).</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyJd}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy Description"}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Copilot & Status Settings (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI REQUISITION COPILOT CARD */}
          <div className="rounded-2xl border border-border bg-card/65 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden space-y-4 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-violet-500 before:via-primary before:to-fuchsia-500">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <div className="p-1 rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                OFC360 Copilot
              </h3>
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/5">
                Assisted
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Use generative AI to polish wording, reformat structure, or customize requirements based on your team needs.
            </p>

            {/* Custom Instruction Box */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                Custom AI Instruction
              </Label>
              <div className="relative">
                <Textarea
                  value={aiCustomInstruction}
                  onChange={(e) => setAiCustomInstruction(e.target.value)}
                  placeholder="e.g. Add 3 bonus qualifications or emphasize hybrid perks..."
                  disabled={isRefiningAi}
                  rows={3}
                  className="text-xs bg-background/50 border-border/80 rounded-xl pr-10 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (aiCustomInstruction.trim()) {
                        handleModifyJdWithAi("custom", aiCustomInstruction);
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (aiCustomInstruction.trim()) {
                      handleModifyJdWithAi("custom", aiCustomInstruction);
                    }
                  }}
                  disabled={isRefiningAi || !aiCustomInstruction.trim()}
                  className="absolute bottom-2 right-2 h-7 w-7 rounded-lg text-primary hover:bg-primary/20"
                  title="Apply instruction"
                >
                  {isRefiningAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
              </div>

              {/* Instruction Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Highlight startup perks",
                  "Require 4+ yrs experience",
                  "Include diversity clause",
                  "Focus on cloud engineering"
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={isRefiningAi}
                    onClick={() => setAiCustomInstruction(preset)}
                    className="text-[10px] font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2 py-0.5 rounded-full border border-border/40 transition-colors"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/50 my-3" />

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Quick Adjustments
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyJdWithAi("improve")}
                  disabled={isRefiningAi}
                  className="w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5"
                >
                  <Wand2 className="h-3.5 w-3.5 text-indigo-500 mr-2" />
                  Format & Polish Markdown
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyJdWithAi("expand")}
                  disabled={isRefiningAi}
                  className="w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                  Expand Detail & Expectations
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyJdWithAi("shorten")}
                  disabled={isRefiningAi}
                  className="w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5"
                >
                  <Minimize2 className="h-3.5 w-3.5 text-rose-500 mr-2" />
                  Shorten & Condense
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyJdWithAi("professional")}
                  disabled={isRefiningAi}
                  className="w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500 mr-2" />
                  Formal Corporate Tone
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyJdWithAi("casual")}
                  disabled={isRefiningAi}
                  className="w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5"
                >
                  <Smile className="h-3.5 w-3.5 text-amber-500 mr-2" />
                  Casual Startup Tone
                </Button>
              </div>
            </div>

            {isRefiningAi && (
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-muted/40 rounded-xl text-xs text-muted-foreground animate-pulse border border-border/50">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                OFC360 is working...
              </div>
            )}
          </div>

          {/* PUBLISHING SUMMARY CARD */}
          <div className="rounded-2xl border border-border bg-card/65 p-5 backdrop-blur-xl shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Requisition Summary
            </h3>

            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Role Title:</span>
                <span className="font-semibold text-foreground truncate max-w-[170px]">
                  {title || "Untitled Position"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Department:</span>
                <span className="font-semibold text-foreground">
                  {department === "Other" && customDepartment ? customDepartment : department}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Location:</span>
                <span className="font-semibold text-foreground truncate max-w-[170px]">
                  {location || "Unspecified"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Employment:</span>
                <span className="font-semibold text-foreground">{employmentType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Work Mode:</span>
                <span className="font-semibold text-foreground">{workMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span>Openings:</span>
                <span className="font-semibold text-foreground">{vacancies}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Application Deadline:</span>
                <span className="font-semibold text-foreground">{closingDate || "Open"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/85 backdrop-blur-xl border-t border-border px-6 py-4 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="rounded-xl border-border/80 text-xs hover:bg-accent/60"
            >
              <Link to="/dashboard/recruitment/jobs">
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Cancel
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmitJob("draft")}
              disabled={isSubmitting}
              className="rounded-xl font-medium border border-border text-xs h-10 px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => handleSubmitJob("active")}
              disabled={isSubmitting}
              className="rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 text-xs h-10 px-6 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  Publish Position
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewJobPage;
