import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building,
  GraduationCap,
  Linkedin,
  Paperclip,
  Check,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/apply/$ukey")({
  head: () => ({
    meta: [
      { title: "Apply for Position — Careers" },
      { name: "description", content: "Submit your application and join our team." },
    ],
  }),
  component: JobApplyPage,
});

function JobApplyPage() {
  const { ukey } = Route.useParams();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  
  // Optional Fields
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const PUBLIC_API_URL = (import.meta.env.VITE_API_URL as string).replace(/\/$/, "") + "/api/public/careers";

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${PUBLIC_API_URL}/apply/${ukey}`);
        if (res.data && res.data.success && res.data.data) {
          setJob(res.data.data);
        } else {
          setError("Failed to fetch job details.");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Job posting not found or link has expired.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [ukey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
        toast.error("Only PDF, DOC, or DOCX files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size cannot exceed 5MB.");
        return;
      }
      setResumeFile(file);
      toast.success(`Resume uploaded: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your resume.");
      return;
    }
    if (!declarationChecked) {
      toast.error("You must accept the candidate declaration.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("resume_file", resumeFile);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("experience_years", experienceYears || "0");
      formData.append("declaration_checked", String(declarationChecked));

      // Optional values
      if (currentCompany) formData.append("current_company", currentCompany);
      if (currentDesignation) formData.append("current_designation", currentDesignation);
      if (currentCtc) formData.append("current_ctc", currentCtc);
      if (expectedCtc) formData.append("expected_ctc", expectedCtc);
      if (noticePeriod) formData.append("notice_period", noticePeriod);
      if (highestQualification) formData.append("highest_qualification", highestQualification);
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
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to submit application.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4">
        {/* Ambient background decoration */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />
        
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-400">Loading job detail profile...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 text-center sm:px-6 lg:px-8">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-rose-500/5 blur-[120px]" />
        
        <div className="relative z-10 max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="mx-auto rounded-2xl bg-rose-500/10 p-4 text-rose-400 w-fit">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-white">Job Posting Unavailable</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            {error || "The job posting you are looking for is closed, inactive, or does not exist."}
          </p>
          <div className="mt-6">
            <a 
              href="https://google.com" 
              className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-750 transition-all active:scale-[0.98]"
            >
              Back to Careers
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 py-12 px-4 text-center">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        
        <div className="relative z-10 max-w-lg bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
          <div className="mx-auto rounded-full bg-emerald-500/15 p-4 text-emerald-400 w-fit animate-pulse">
            <CheckCircle className="h-16 w-16" />
          </div>
          
          <h1 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
            Application Submitted!
          </h1>
          
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Thank you for applying to the <span className="font-bold text-indigo-400">{job.title}</span> position. We have successfully received your credentials.
          </p>
          
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 inline-block text-left w-full">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Next Steps</div>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>We sent a confirmation email to <span className="font-semibold text-slate-200">{email}</span>.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Our recruitment team will review your resume and skills mapping.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>If matched, we will contact you via email or phone for screening.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline" 
              className="border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden pb-16">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Main glass sticky top header */}
      <header className="border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/20">
            A
          </div>
          <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Aurix <span className="font-normal text-indigo-400/90 text-sm tracking-normal ml-1">Careers Portal</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 font-semibold text-xs py-1 px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2 animate-ping" /> Live Opening
          </Badge>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-12 relative z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <a href="https://google.com" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors group">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Back to job directory
          </a>
        </div>

        {/* Hero Section / Job Meta Card */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full">
                {job.department || "Engineering"}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white mb-3">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-400/80" />{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-indigo-400/80" />{job.employmentType || "Full-time"}</span>
              {job.salaryMin > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span className="inline-flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-indigo-400/80" />{(job.salaryMin / 1000).toFixed(0)}k - {(job.salaryMax / 1000).toFixed(0)}k USD</span>
                </>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <Button 
              onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/15"
            >
              Apply to Position <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Details and Apply Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Specifications */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Description Card */}
            {job.jobDescription && (
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <FileText className="h-4.5 w-4.5 text-indigo-400" /> Role Overview
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.jobDescription}
                </p>
              </div>
            )}

            {/* Skills Card */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" /> Core Skillsets Needed
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: any) => (
                    <Badge key={skill.id || skill} variant="secondary" className="bg-slate-850 text-slate-200 border-slate-700/40 hover:bg-slate-800 py-1 px-3 text-xs font-semibold rounded-lg">
                      {skill.skill_name || skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Key Responsibilities
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Briefcase className="h-4.5 w-4.5 text-indigo-400" /> Profile Requirements
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-base font-bold text-slate-100 mb-3.5 flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <DollarSign className="h-4.5 w-4.5 text-indigo-400" /> Perquisites & Benefits
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </p>
              </div>
            )}
          </div>

          {/* Right panel: Application Form Card */}
          <div id="apply-form" className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative shadow-indigo-500/5">
            <h2 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              Apply For This Position
            </h2>
            <p className="text-xs text-slate-500 mb-5 leading-normal">
              Provide your details below to sync your profile to our recruitment pipelines.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Resume dropzone */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Resume / CV <span className="text-rose-500">*</span>
                </label>
                
                <div className="relative border border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-4 transition-all bg-slate-950/60 text-center flex flex-col items-center justify-center min-h-[110px] group">
                  <input 
                    type="file" 
                    id="resume" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  {resumeFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <Paperclip className="h-7 w-7 text-indigo-400 animate-bounce" />
                      <span className="text-xs font-semibold text-slate-200 truncate max-w-[240px]">
                        {resumeFile.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {((resumeFile.size) / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <UploadCloud className="h-8 w-8 text-slate-550 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-xs font-semibold text-slate-300">
                        Drop resume here or click to browse
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Accepting PDF, DOCX (Max 5MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="firstName"
                    type="text" 
                    required 
                    value={firstName}
                    placeholder="Jane"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="lastName"
                    type="text" 
                    required 
                    value={lastName}
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="email"
                    type="email" 
                    required 
                    value={email}
                    placeholder="jane.doe@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="phone"
                    type="tel" 
                    required 
                    value={phone}
                    placeholder="+1 555 0199"
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
              </div>

              {/* Address details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="city" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="city"
                    type="text" 
                    required 
                    value={city}
                    placeholder="New York"
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9" 
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="state"
                    type="text" 
                    required 
                    value={state}
                    placeholder="NY"
                    onChange={(e) => setState(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9" 
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="country"
                    type="text" 
                    required 
                    value={country}
                    placeholder="USA"
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs h-9" 
                  />
                </div>
              </div>

              {/* Experience and qualification */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="exp" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Experience (Years) <span className="text-rose-500">*</span>
                  </label>
                  <Input 
                    id="exp"
                    type="number" 
                    min="0"
                    step="0.1"
                    required 
                    value={experienceYears}
                    placeholder="3.5"
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
                <div>
                  <label htmlFor="highestQual" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                    Qualification
                  </label>
                  <Input 
                    id="highestQual"
                    type="text" 
                    placeholder="B.S. Computer Science"
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl" 
                  />
                </div>
              </div>

              {/* Collapsible/Optional Section */}
              <div className="border border-slate-800/80 rounded-2xl p-3.5 bg-slate-950/20 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-800/50 pb-1">
                  Additional Details (Optional)
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="Current Company"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                  <Input 
                    placeholder="Current Designation"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input 
                    type="number"
                    placeholder="Current CTC"
                    value={currentCtc}
                    onChange={(e) => setCurrentCtc(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                  <Input 
                    type="number"
                    placeholder="Expected CTC"
                    value={expectedCtc}
                    onChange={(e) => setExpectedCtc(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                  <Input 
                    placeholder="Notice Period"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="LinkedIn Profile URL"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                  <Input 
                    placeholder="Portfolio URL"
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 text-xs h-8.5 rounded-xl" 
                  />
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label htmlFor="coverLetter" className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">
                  Cover Letter (Optional)
                </label>
                <Textarea 
                  id="coverLetter"
                  rows={3} 
                  placeholder="Tell us why this role appeals to you..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-indigo-600 rounded-xl text-xs" 
                />
              </div>

              {/* Candidate declaration */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox 
                  id="declaration" 
                  checked={declarationChecked}
                  onCheckedChange={(checked) => setDeclarationChecked(!!checked)}
                  className="bg-slate-955 border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 mt-0.5"
                />
                <label htmlFor="declaration" className="text-[10px] text-slate-450 leading-normal cursor-pointer select-none">
                  I hereby declare that all the information provided by me in this application is true, complete, and accurate to the best of my knowledge. <span className="text-rose-500">*</span>
                </label>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-650 hover:from-indigo-550 hover:to-purple-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-600/15 active:scale-[0.98] hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
