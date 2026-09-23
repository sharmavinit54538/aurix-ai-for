import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  IndianRupee,
  CheckCircle2,
  AlertCircle, 
  UploadCloud, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building2,
  GraduationCap,
  Linkedin,
  Check,
  ChevronRight,
  Sparkles,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Award,
  Send,
  ArrowLeft,
  FileCheck,
  ExternalLink,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";


const COUNTRY_CODES = [
  { code: "+91", label: "+91 (India)", flag: "🇮🇳" },
  { code: "+1", label: "+1 (US/Canada)", flag: "🇺🇸" },
  { code: "+44", label: "+44 (UK)", flag: "🇬🇧" },
  { code: "+65", label: "+65 (Singapore)", flag: "🇸🇬" },
  { code: "+971", label: "+971 (UAE)", flag: "🇦🇪" },
  { code: "+49", label: "+49 (Germany)", flag: "🇩🇪" },
  { code: "+61", label: "+61 (Australia)", flag: "🇦🇺" },
];

const QUALIFICATION_OPTIONS = [
  "B.Tech / B.E. (Computer Science / IT)",
  "B.Sc / BCA / Information Technology",
  "M.Tech / M.S. (Computer Science / Data Science)",
  "MCA / Master of Computer Applications",
  "Bachelor's Degree (Any Discipline)",
  "Master's Degree / MBA",
  "Doctorate / Ph.D.",
  "Diploma / Associate Degree",
  "Self-Taught / Bootcamp Graduate",
];

const NOTICE_PERIOD_OPTIONS = [
  "Immediate (Serving Notice / Ready to Join)",
  "15 Days or Less",
  "30 Days (1 Month)",
  "45 Days",
  "60 Days (2 Months)",
  "90 Days (3 Months)",
];

const getPublicCareersApiUrl = () => {
  let rawApiUrl = ((import.meta.env.VITE_API_URL as string) || "https://api.ofc360.com").trim().replace(/\/$/, "");
  if (!rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://")) {
    rawApiUrl = `https://${rawApiUrl}`;
  }
  rawApiUrl = rawApiUrl.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
  return `${rawApiUrl}/api/public/careers`;
};

const PUBLIC_API_URL = getPublicCareersApiUrl();

export default function JobApplyPage() {
  const { ukey } = useParams({ strict: false }) as { ukey?: string };
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Fields - Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");

  // Location
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  // Professional Details
  const [experienceYears, setExperienceYears] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDesignation, setCurrentDesignation] = useState("");

  // Compensation & Notice
  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");

  // Online Profiles & Note
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  // File & State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchJobDetails() {
      if (!ukey) {
        setError("Invalid job application link.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${PUBLIC_API_URL}/apply/${ukey}`);
        if (res.data && res.data.success && res.data.data) {
          const apiData = res.data.data;
          setJob({
            ...apiData,
            skills: apiData.skills || [],
            responsibilities: apiData.responsibilities || [],
            requirements: apiData.requirements || [],
            benefits: apiData.benefits || [],
            aboutCompany: apiData.aboutCompany || "",
          });
        } else {
          setError(res.data?.message || "Job position not found or no longer active.");
          setJob(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Job position not found or unavailable.");
        setJob(null);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [ukey]);

  const formattedSalary = useMemo(() => {
    const min = typeof job?.salaryMin === "number" ? job.salaryMin : Number(job?.salaryMin) || 0;
    const max = typeof job?.salaryMax === "number" ? job.salaryMax : Number(job?.salaryMax) || 0;
    if (!min && !max) return null;

    const formatAmount = (num: number) => {
      if (!num) return "";
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return `${num}L`;
    };

    if (min && max) {
      return `₹${formatAmount(min)} - ₹${formatAmount(max)} CTC`;
    }
    if (min) {
      return `₹${formatAmount(min)}+ CTC`;
    }
    return null;
  }, [job?.salaryMin, job?.salaryMax]);

  const responsibilitiesList: string[] = useMemo(() => {
    if (Array.isArray(job?.responsibilities)) return job.responsibilities;
    if (typeof job?.responsibilities === "string") {
      return job.responsibilities.split("\n").filter((s: string) => s.trim().length > 0);
    }
    return [];
  }, [job?.responsibilities]);

  const requirementsList: string[] = useMemo(() => {
    if (Array.isArray(job?.requirements)) return job.requirements;
    if (typeof job?.requirements === "string") {
      return job.requirements.split("\n").filter((s: string) => s.trim().length > 0);
    }
    return [];
  }, [job?.requirements]);

  const benefitsList: string[] = useMemo(() => {
    if (Array.isArray(job?.benefits)) return job.benefits;
    if (typeof job?.benefits === "string") {
      return job.benefits.split("\n").filter((s: string) => s.trim().length > 0);
    }
    return [];
  }, [job?.benefits]);

  const validateFile = (file: File): boolean => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
      toast.error("Invalid file format. Only PDF, DOC, or DOCX are permitted.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setResumeFile(file);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.resume;
          return next;
        });
        toast.success(`Resume attached: ${file.name}`);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setResumeFile(file);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.resume;
          return next;
        });
        toast.success(`Resume uploaded: ${file.name}`);
      }
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Resume removed. Please upload an updated file.");
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!resumeFile) {
      newErrors.resume = "Resume is required (PDF, DOC, DOCX up to 5MB)";
    }
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "Please enter a valid phone number (minimum 7 digits)";
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
    }
    if (!state.trim()) {
      newErrors.state = "State is required";
    }
    if (!country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!experienceYears.trim()) {
      newErrors.experienceYears = "Experience is required";
    }
    if (!highestQualification.trim()) {
      newErrors.highestQualification = "Please select highest qualification";
    }
    if (!declarationChecked) {
      newErrors.declaration = "You must accept the candidate declaration to submit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      country: true,
      experienceYears: true,
      highestQualification: true,
      declaration: true,
      resume: true,
    });

    if (!validateForm()) {
      toast.error("Please fill out all mandatory fields marked with an asterisk (*).");
      return;
    }

    setSubmitting(true);
    try {
      const fullPhone = `${countryCode} ${phone}`.trim();
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      }
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", fullPhone);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("experience_years", experienceYears || "0");
      formData.append("declaration_checked", String(declarationChecked));

      if (highestQualification) formData.append("highest_qualification", highestQualification);
      if (currentCompany) formData.append("current_company", currentCompany);
      if (currentDesignation) formData.append("current_designation", currentDesignation);
      if (currentCtc) formData.append("current_ctc", currentCtc);
      if (expectedCtc) formData.append("expected_ctc", expectedCtc);
      if (noticePeriod) formData.append("notice_period", noticePeriod);
      if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);
      if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);
      if (coverLetter) formData.append("cover_letter", coverLetter);

      const res = await axios.post(`${PUBLIC_API_URL}/apply/${ukey}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.success) {
        setSuccess(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(res.data?.message || "Failed to submit application. Please review your details.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An error occurred while submitting your application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] py-12 px-4">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800/80" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-white tracking-wide">Loading position details...</p>
            <p className="text-xs text-slate-400">Fetching opportunities from OFC360 Talent Network</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] py-12 px-4 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[140px] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full bg-[#111726]/90 border border-slate-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl">
          <div className="mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 p-4 text-rose-400 w-fit">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            Position Not Available
          </h1>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {error || "This job opening does not exist or is no longer accepting applications."}
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 text-xs font-semibold cursor-pointer"
            >
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B0F19] py-12 px-4 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg w-full bg-[#111726]/90 border border-slate-800/80 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-black/50">
          <div className="mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-emerald-400 w-fit shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          
          <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Application Submitted!
          </h1>
          
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Thank you for applying for the <span className="font-semibold text-indigo-400">{job?.title}</span> role at OFC360. Your profile is now with our hiring committee.
          </p>
          
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left w-full space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Submission Receipt</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">Active Review</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Candidate Name:</span>
                <span className="font-semibold text-white">{firstName} {lastName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-white">{email}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Role:</span>
                <span className="font-semibold text-indigo-300">{job?.title}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Resume Attached:</span>
                <span className="font-semibold text-emerald-400 truncate max-w-[200px] flex items-center gap-1">
                  <FileCheck className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{resumeFile?.name}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              className="border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl h-11 px-6 text-xs font-semibold"
            >
              Submit Another Application
            </Button>
            <Button 
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl h-11 px-6 text-xs font-bold shadow-lg shadow-indigo-600/20"
            >
              <Link to="/dashboard">
                Go to Platform Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <Sheet>
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden pb-24">
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/15 via-purple-600/5 to-transparent pointer-events-none" />
        <div className="absolute top-[30%] right-[-15%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-15%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none" />

        {/* Top Header Navigation */}
        <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center hover:opacity-90 transition-opacity" title="OFC360">
              <img
                src="/favicon.svg"
                alt="OFC360"
                className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
              />
            </Link>
          </div>
        </header>

        {/* Slide-out Role Details Drawer */}
        <SheetContent 
          side="left" 
          className="w-full sm:max-w-xl bg-[#0B0F19]/98 border-r border-slate-800 text-slate-100 p-0 flex flex-col z-50 overflow-hidden shadow-2xl"
        >
          <div className="p-5 sm:p-6 border-b border-slate-800/90 bg-slate-900/50 backdrop-blur-md">
            <SheetHeader className="text-left space-y-1">
              <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                {job?.title || "Role Details & Requirements"}
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400">
                Detailed role description, responsibilities, requirements, and benefits at OFC360.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* 1. About the Role */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2.5">
                <FileText className="h-4 w-4 text-indigo-400" /> About the Role
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
                {job?.jobDescription || "No detailed description provided for this position."}
              </p>
            </div>

            {/* 2. Core Skillsets Needed */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Core Skillsets Needed
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {(job?.skills || []).length} Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(job?.skills || []).length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No specific skill requirements listed.</span>
                ) : (
                  (job?.skills || []).map((skill: any, idx: number) => {
                    const skillName = typeof skill === "string" ? skill : skill.skill_name || `Skill ${idx + 1}`;
                    return (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="bg-slate-850 text-slate-200 border border-slate-750 hover:border-indigo-500/40 py-1.5 px-3 text-xs font-semibold rounded-lg"
                      >
                        {skillName}
                      </Badge>
                    );
                  })
                )}
              </div>
            </div>

            {/* 3. Key Responsibilities */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Key Responsibilities
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {responsibilitiesList.length} Items
                </span>
              </div>
              <ul className="space-y-2.5 pt-1">
                {responsibilitiesList.map((resp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Role Requirements */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" /> Role Requirements
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {requirementsList.length} Items
                </span>
              </div>
              <ul className="space-y-2.5 pt-1">
                {requirementsList.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-purple-500/15 text-purple-400 mt-0.5">
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Benefits & Perks */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" /> Perquisites & Benefits
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {benefitsList.length} Perks
                </span>
              </div>
              <ul className="space-y-2.5 pt-1">
                {benefitsList.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SheetContent>

        {/* Main Application Container */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10 relative z-10 space-y-6">
          
          {/* Enhanced Job Header Card */}
          <section 
            aria-label="Job Overview"
            className="rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#131B2E] via-[#101626] to-[#0D1220] p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/40 relative overflow-hidden"
          >
            {/* Ambient accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-3 flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                  {job?.title || "Senior Full Stack Cloud Engineer"}
                </h1>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-200 shadow-xs">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{job?.location || "Bangalore, India (Hybrid)"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-200 shadow-xs">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{job?.employmentType || "Full-time"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-200 shadow-xs">
                    <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>{job?.experienceRequired || "4 - 8 Years"}</span>
                  </div>
                  {formattedSalary && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold shadow-xs">
                      <IndianRupee className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{formattedSalary}</span>
                    </div>
                  )}
                </div>
              </div>

              <SheetTrigger asChild>
                <button 
                  type="button"
                  className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 hover:border-indigo-500/60 px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm hover:shadow-indigo-500/10 active:scale-95 group/btn"
                >
                  <FileText className="h-4 w-4 text-indigo-400 group-hover/btn:text-indigo-300 transition-colors" />
                  <span>View Full Details</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400/80 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </SheetTrigger>
            </div>
          </section>

          {/* Form Container */}
          <div 
            id="apply-form" 
            className="w-full rounded-3xl border border-slate-800/90 bg-[#111726]/85 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl relative shadow-indigo-500/5"
          >
            <div className="mb-8 pb-5 border-b border-slate-800/80">
              <h2 className="text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
                Candidate Application Form
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please complete the form below. Fields marked with <span className="text-rose-400 font-bold">*</span> are required for committee review.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              
              {/* ── SECTION 1: Resume / CV Upload ──────────────────── */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="resume" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span>Upload Resume / Curriculum Vitae</span>
                    <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">PDF, DOC, DOCX (Max 5MB)</span>
                </div>

                {resumeFile ? (
                  /* Attached File Card with size and Change/Remove actions */
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-md shadow-emerald-500/5">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-md">
                          {resumeFile.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span>{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span className="h-1 w-1 rounded-full bg-slate-600" />
                          <span className="text-emerald-400 font-medium">Ready for parsing</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label 
                        htmlFor="resume-change"
                        className="cursor-pointer text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 border border-indigo-500/30"
                      >
                        <RefreshCw className="h-3 w-3" /> Change
                      </label>
                      <input 
                        type="file" 
                        id="resume-change" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={removeResumeFile}
                        className="cursor-pointer text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2 rounded-xl transition-colors"
                        title="Remove resume"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Premium Drag & Drop Upload Zone */
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all text-center flex flex-col items-center justify-center min-h-[140px] group cursor-pointer ${
                      isDragging 
                        ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" 
                        : errors.resume && touched.resume
                        ? "border-rose-500/60 bg-rose-500/5 hover:border-rose-500"
                        : "border-slate-800 hover:border-indigo-500/60 bg-slate-950/60 hover:bg-slate-950/90"
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      id="resume" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 border border-indigo-500/25 group-hover:bg-indigo-500/20 text-indigo-400 transition-all group-hover:scale-110">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          <span className="text-indigo-400 underline underline-offset-4 decoration-indigo-500/40">Click to upload</span> or drag and drop your resume
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supported formats: PDF, DOC, DOCX up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {errors.resume && touched.resume && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.resume}</span>
                  </p>
                )}
              </div>

              {/* ── SECTION 2: Personal Information ────────────────── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 text-[11px] font-bold">1</span>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="block text-xs font-medium text-slate-300">
                      First Name <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        id="firstName"
                        type="text" 
                        required 
                        value={firstName}
                        placeholder="e.g. Vikram"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (errors.firstName) {
                            setErrors((p) => { const n = { ...p }; delete n.firstName; return n; });
                          }
                        }}
                        onBlur={() => handleBlur("firstName")}
                        className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                          errors.firstName && touched.firstName ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.firstName && touched.firstName && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="block text-xs font-medium text-slate-300">
                      Last Name <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Input 
                        id="lastName"
                        type="text" 
                        required 
                        value={lastName}
                        placeholder="e.g. Malhotra"
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (errors.lastName) {
                            setErrors((p) => { const n = { ...p }; delete n.lastName; return n; });
                          }
                        }}
                        onBlur={() => handleBlur("lastName")}
                        className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                          errors.lastName && touched.lastName ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                        }`}
                      />
                    </div>
                    {errors.lastName && touched.lastName && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.lastName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-medium text-slate-300">
                    Email Address <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                    <Input 
                      id="email"
                      type="email" 
                      required 
                      value={email}
                      placeholder="vikram.malhotra@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((p) => { const n = { ...p }; delete n.email; return n; });
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                      className={`pl-10 bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                        errors.email && touched.email ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number with country selector */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-medium text-slate-300">
                    Phone Number <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="flex gap-2.5">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[125px] shrink-0 bg-slate-950/70 border-slate-800 text-slate-200 text-xs h-11 rounded-xl focus:ring-2 focus:ring-indigo-500/30 px-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs rounded-xl shadow-2xl">
                        {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="phone"
                        type="tel" 
                        required 
                        value={phone}
                        placeholder="98765 43210"
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) {
                            setErrors((p) => { const n = { ...p }; delete n.phone; return n; });
                          }
                        }}
                        onBlur={() => handleBlur("phone")}
                        className={`pl-10 bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                          errors.phone && touched.phone ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                        }`}
                      />
                    </div>
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* ── SECTION 3: Current Location ────────────────────── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 text-[11px] font-bold">2</span>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Current Location
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* City */}
                  <div className="space-y-1.5">
                    <label htmlFor="city" className="block text-xs font-medium text-slate-300">
                      City <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <Input 
                      id="city"
                      type="text" 
                      required 
                      value={city}
                      placeholder="e.g. Bangalore"
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) {
                          setErrors((p) => { const n = { ...p }; delete n.city; return n; });
                        }
                      }}
                      onBlur={() => handleBlur("city")}
                      className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                        errors.city && touched.city ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                      }`}
                    />
                    {errors.city && touched.city && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label htmlFor="state" className="block text-xs font-medium text-slate-300">
                      State / Province <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <Input 
                      id="state"
                      type="text" 
                      required 
                      value={state}
                      placeholder="e.g. Karnataka"
                      onChange={(e) => {
                        setState(e.target.value);
                        if (errors.state) {
                          setErrors((p) => { const n = { ...p }; delete n.state; return n; });
                        }
                      }}
                      onBlur={() => handleBlur("state")}
                      className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                        errors.state && touched.state ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                      }`}
                    />
                    {errors.state && touched.state && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label htmlFor="country" className="block text-xs font-medium text-slate-300">
                      Country <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <Input 
                      id="country"
                      type="text" 
                      required 
                      value={country}
                      placeholder="e.g. India"
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (errors.country) {
                          setErrors((p) => { const n = { ...p }; delete n.country; return n; });
                        }
                      }}
                      onBlur={() => handleBlur("country")}
                      className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                        errors.country && touched.country ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                      }`}
                    />
                    {errors.country && touched.country && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.country}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: Professional Details ─────────────────── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 text-[11px] font-bold">3</span>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Professional Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label htmlFor="exp" className="block text-xs font-medium text-slate-300">
                      Total Experience (Years) <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <Input 
                      id="exp"
                      type="number" 
                      min="0"
                      step="0.5"
                      required 
                      value={experienceYears}
                      placeholder="e.g. 5.5"
                      onChange={(e) => {
                        setExperienceYears(e.target.value);
                        if (errors.experienceYears) {
                          setErrors((p) => { const n = { ...p }; delete n.experienceYears; return n; });
                        }
                      }}
                      onBlur={() => handleBlur("experienceYears")}
                      className={`bg-slate-950/70 border text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 px-4 focus-visible:ring-2 focus-visible:ring-indigo-500/30 transition-all ${
                        errors.experienceYears && touched.experienceYears ? "border-rose-500/80" : "border-slate-800 focus-visible:border-indigo-500"
                      }`}
                    />
                    {errors.experienceYears && touched.experienceYears && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.experienceYears}</span>
                      </p>
                    )}
                  </div>

                  {/* Highest Qualification */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Highest Qualification <span className="text-rose-400 font-bold">*</span>
                    </label>
                    <Select 
                      value={highestQualification} 
                      onValueChange={(val) => {
                        setHighestQualification(val);
                        if (errors.highestQualification) {
                          setErrors((p) => { const n = { ...p }; delete n.highestQualification; return n; });
                        }
                      }}
                    >
                      <SelectTrigger className={`w-full bg-slate-950/70 border text-slate-200 text-sm h-11 rounded-xl focus:ring-2 focus:ring-indigo-500/30 px-4 ${
                        errors.highestQualification && touched.highestQualification ? "border-rose-500/80" : "border-slate-800"
                      }`}>
                        <SelectValue placeholder="Select degree / qualification" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs max-h-60 rounded-xl shadow-2xl">
                        {QUALIFICATION_OPTIONS.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.highestQualification && touched.highestQualification && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.highestQualification}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Company */}
                  <div className="space-y-1.5">
                    <label htmlFor="company" className="block text-xs font-medium text-slate-300">
                      Current / Most Recent Company
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="company"
                        placeholder="e.g. Razorpay / Microsoft"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Current Designation */}
                  <div className="space-y-1.5">
                    <label htmlFor="designation" className="block text-xs font-medium text-slate-300">
                      Current Designation / Job Title
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="designation"
                        placeholder="e.g. Senior Software Engineer"
                        value={currentDesignation}
                        onChange={(e) => setCurrentDesignation(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: Compensation & Notice Period ─────────── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 text-[11px] font-bold">4</span>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Compensation & Availability
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current CTC */}
                  <div className="space-y-1.5">
                    <label htmlFor="currentCtc" className="block text-xs font-medium text-slate-300">
                      Current CTC (Annual INR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="currentCtc"
                        type="number"
                        placeholder="e.g. 2400000"
                        value={currentCtc}
                        onChange={(e) => setCurrentCtc(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Expected CTC */}
                  <div className="space-y-1.5">
                    <label htmlFor="expectedCtc" className="block text-xs font-medium text-slate-300">
                      Expected CTC (Annual INR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="expectedCtc"
                        type="number"
                        placeholder="e.g. 3200000"
                        value={expectedCtc}
                        onChange={(e) => setExpectedCtc(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Notice Period */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Notice Period / Joining Availability
                  </label>
                  <Select value={noticePeriod} onValueChange={setNoticePeriod}>
                    <SelectTrigger className="w-full bg-slate-950/70 border-slate-800 text-slate-200 text-sm h-11 rounded-xl focus:ring-2 focus:ring-indigo-500/30 px-4">
                      <SelectValue placeholder="Select current notice period" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs rounded-xl shadow-2xl">
                      {NOTICE_PERIOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ── SECTION 6: Online Profiles & Cover Letter ───────── */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/15 text-indigo-400 text-[11px] font-bold">5</span>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Online Profiles & Note
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label htmlFor="linkedin" className="block text-xs font-medium text-slate-300">
                      LinkedIn Profile URL
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="linkedin"
                        placeholder="https://linkedin.com/in/username"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Portfolio / GitHub */}
                  <div className="space-y-1.5">
                    <label htmlFor="portfolio" className="block text-xs font-medium text-slate-300">
                      GitHub / Portfolio URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <Input 
                        id="portfolio"
                        placeholder="https://github.com/username"
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="pl-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm h-11 focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5">
                  <label htmlFor="coverLetter" className="block text-xs font-medium text-slate-300">
                    Cover Letter or Introduction <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <Textarea 
                    id="coverLetter"
                    rows={3} 
                    placeholder="Tell us about relevant projects, architecture experience, or what excites you about building at OFC360..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm p-3.5 leading-relaxed focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* ── SECTION 7: Declaration & Checkbox ──────────────── */}
              <div className="pt-2">
                <label 
                  htmlFor="declaration" 
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    errors.declaration && touched.declaration 
                      ? "border-rose-500/60 bg-rose-500/5 hover:border-rose-500" 
                      : declarationChecked
                      ? "border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500/60"
                      : "border-slate-800/90 bg-slate-950/60 hover:border-slate-700/80 hover:bg-slate-950"
                  }`}
                >
                  <Checkbox 
                    id="declaration" 
                    checked={declarationChecked}
                    onCheckedChange={(checked) => {
                      setDeclarationChecked(!!checked);
                      if (errors.declaration) {
                        setErrors((p) => { const n = { ...p }; delete n.declaration; return n; });
                      }
                    }}
                    className="bg-slate-950 border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mt-0.5 h-4 w-4 rounded-md"
                  />
                  <div className="space-y-0.5 text-xs">
                    <span className="text-slate-200 font-medium leading-relaxed block">
                      I certify that all details provided in this application are accurate and complete to the best of my knowledge. <span className="text-rose-400 font-bold">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 leading-normal block">
                      By submitting, you agree to our candidate privacy policy and processing of your application for talent evaluation.
                    </span>
                  </div>
                </label>
                {errors.declaration && touched.declaration && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5 ml-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.declaration}</span>
                  </p>
                )}
              </div>

              {/* ── SECTION 8: Submit Action Button ─────────────────── */}
              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="w-auto h-10 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </Sheet>
  );
}
