import { useNavigate, Link } from "@tanstack/react-router";

import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Copy, Check, Sparkles, Wand2, Maximize2, Minimize2, 
  Briefcase, MapPin, Tag, Plus, X, AlertCircle, RefreshCw, Send, Loader2,
  FileCheck2, ShieldCheck, Smile, MessageSquare
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { api } from "@/api";
import { toast } from "sonner";
import type { ID, Job, EmploymentType, WorkMode, JobStatus } from "@/features/admin/recruitment/types";

const SUGGESTED_SKILLS = [
  "React", "TypeScript", "FastAPI", "PostgreSQL", 
  "Docker", "Leadership", "Excel", "Python", 
  "Product Design", "Figma", "AWS", "Machine Learning"
];

const SUGGESTED_LOCATIONS = [
  "Remote", "Bangalore", "Jaipur", "Hyderabad", 
  "Noida", "Pune", "Mumbai", "San Francisco", "London"
];

// Helper to render markdown beautifully
function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;
  
  const html = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-display font-bold text-foreground mt-6 mb-3 border-b border-border pb-1.5">$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-display font-bold text-foreground mt-5 mb-2.5">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h3>')
    .replace(/^\- (.*?)$/gm, '<li class="ml-5 list-disc text-sm text-muted-foreground my-1">$1</li>')
    .replace(/^\* (.*?)$/gm, '<li class="ml-5 list-disc text-sm text-muted-foreground my-1">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('<h') || trimmed.startsWith('<li')) {
        return trimmed;
      }
      return `<p class="text-sm text-muted-foreground leading-relaxed my-3">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');
    
  return (
    <div 
      className="space-y-1 text-muted-foreground prose dark:prose-invert max-w-none" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

function getDepartmentFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("creative")) return "Design";
  if (t.includes("sales") || t.includes("account executive") || t.includes("sales executive")) return "Sales";
  if (t.includes("marketing") || t.includes("growth") || t.includes("seo") || t.includes("brand")) return "Marketing";
  if (t.includes("hr") || t.includes("recruiter") || t.includes("people") || t.includes("talent")) return "Human Resources";
  if (t.includes("finance") || t.includes("accountant") || t.includes("billing") || t.includes("tax")) return "Finance";
  if (t.includes("support") || t.includes("success") || t.includes("help")) return "Customer Support";
  return "Engineering"; // default
}

export function NewJobPage() {
  const navigate = useNavigate();
  const { upsertJob } = useRecruitment();
  
  // UI Steps: 0 = Setup Inputs, 1 = Generating Animation, 2 = Editor & Refine
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2>(0);
  
  // Input fields
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  // AI Generated / Refinement states
  const [description, setDescription] = useState("");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("preview");
  
  // Loading & Error states
  const [loadingMessage, setLoadingMessage] = useState("Analyzing role requirements...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  
  const locationRef = useRef<HTMLDivElement>(null);

  // Close location suggestion dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter locations suggestions based on input
  const filteredLocations = SUGGESTED_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Skills input helpers
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Generate JD
  const handleGenerateJd = async () => {
    if (!role.trim()) {
      setErrorMsg("Role is required.");
      return;
    }
    if (skills.length === 0) {
      setErrorMsg("Please specify at least one skill.");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Location is required.");
      return;
    }

    setErrorMsg(null);
    setCurrentStep(1);

    // Cycle through messages to show high-quality AI progress
    const messages = [
      "Analyzing role requirements...",
      "Drafting professional responsibilities...",
      "Suggesting required and preferred skills...",
      "Structuring the final job description...",
      "Polishing content for candidate engagement..."
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2000);

    try {
      const response = await api.post<any>("/jobs/generate-description", {
        title: role,
        department: getDepartmentFromTitle(role),
        employment_type: "Full-time",
        location: location,
        skills: skills,
        experience: null
      }, { timeout: 120000 });

      clearInterval(interval);

      if (response.success && response.data) {
        setDescription(response.data);
        setCurrentStep(2);
        setEditorTab("preview");
        toast.success("Job Description generated successfully!");
      } else {
        throw new Error(response.message || "Failed to generate description");
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || "Failed to generate description. Please check local Ollama service.");
      setCurrentStep(0);
      toast.error("Generation failed. Make sure your local backend and Ollama are active.");
    }
  };

  // Modify JD (improve, expand, shorten, professional, casual, custom)
  const handleModifyJd = async (
    action: "improve" | "expand" | "shorten" | "professional" | "casual" | "custom",
    customPrompt?: string
  ) => {
    setIsRefining(true);
    toast.info(`AI is rewriting job description...`);
    try {
      const response = await api.post<any>("/jobs/modify-description", {
        current_description: description,
        action: action,
        custom_instruction: customPrompt
      }, { timeout: 120000 });
      if (response.success && response.data) {
        setDescription(response.data);
        if (action === "custom") {
          setCustomInstruction("");
        }
        toast.success(`Job description refined!`);
      } else {
        throw new Error(response.message || "Failed to modify description.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to refine description.");
    } finally {
      setIsRefining(false);
    }
  };

  // Copy JD text
  const handleCopyJd = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    toast.success("Job Description copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Job (Draft or Published)
  const handleSubmitJob = async (status: JobStatus) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const today = new Date().toISOString();
    const close = new Date();
    close.setDate(close.getDate() + 30);

    // Heuristics for payload mapping
    const isRemote = location.toLowerCase().includes("remote");
    const workMode: WorkMode = isRemote ? "Remote" : "Onsite";

    // Standard draft payload
    const jobPayload: Job = {
      id: "", 
      title: role,
      department: getDepartmentFromTitle(role),
      employmentType: "Full-time",
      experience: "3-5 yrs",
      skills: skills,
      salaryMin: 0,
      salaryMax: 0,
      currency: "INR",
      vacancies: 1,
      location: location,
      workMode: workMode,
      description: description,
      responsibilities: [],
      requirements: [],
      benefits: [],
      hiringManager: "",
      recruiter: "",
      status: status,
      publishedAt: today,
      closingAt: close.toISOString(),
      applicants: 0,
    };

    try {
      const response = (await upsertJob(jobPayload)) as any;
      if (response && response.success && response.data) {
        toast.success(status === "active" ? "Job posted successfully!" : "Job draft saved!");
        navigate({ to: "/dashboard/recruitment/jobs/$jobId", params: { jobId: response.data.id } });
      } else {
        throw new Error(response?.message || "Failed to save job posting.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to complete job creation flow.");
      toast.error("Save failed. Please check connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader 
        title="Create Job with AI" 
        description="Fill minimal parameters and let Aurix AI craft a professional recruitment page." 
      />

      {/* STEP 0: SETUP FORM */}
      {currentStep === 0 && (
        <div className="max-w-3xl mx-auto mt-6">
          <div className="relative rounded-3xl border border-border bg-card/45 p-8 shadow-xl backdrop-blur-2xl overflow-hidden transition-all duration-300">
            {/* Glowing background decoration */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              AI Requisition Details
            </h2>

            <div className="space-y-6">
              {/* Field 1: Role Title */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Role Title <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="role"
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  placeholder="e.g., Senior Frontend Developer, HR Specialist, Python Developer" 
                  className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary text-base"
                />
                <p className="text-xs text-muted-foreground">What position are you hiring for?</p>
              </div>

              {/* Field 2: Skills Tag Input */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  Required Skills <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input 
                    id="skills"
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                    placeholder="Type a skill and press Enter" 
                    className="h-11 rounded-xl bg-background/50 border-border/80 text-base"
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => handleAddSkill(skillInput)}
                    className="h-11 rounded-xl px-4 border border-border"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {/* Selected skills tag panel */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 py-2 px-3 bg-background/30 rounded-2xl border border-border/50">
                    {skills.map((s) => (
                      <Badge 
                        key={s} 
                        variant="secondary" 
                        className="py-1 px-3 text-sm rounded-lg flex items-center gap-1 bg-primary/10 text-primary border border-primary/20"
                      >
                        {s}
                        <button 
                          onClick={() => handleRemoveSkill(s)} 
                          className="hover:text-destructive focus:outline-none transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Suggested skill tags */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Suggested popular skills:</p>
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
                              : "bg-background/40 hover:bg-accent/40 text-muted-foreground border-border/60"
                          }`}
                        >
                          {exists ? `✓ ${s}` : `+ ${s}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Field 3: Searchable Location Input */}
              <div className="space-y-2" ref={locationRef}>
                <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Office Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input 
                    id="location"
                    value={locationSearch} 
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setLocation(e.target.value);
                      setShowLocationSuggestions(true);
                    }} 
                    onFocus={() => setShowLocationSuggestions(true)}
                    placeholder="e.g. Remote, Bangalore, Hyderabad" 
                    className="h-11 rounded-xl bg-background/50 border-border/80 text-base"
                  />
                  
                  {/* Location Autocomplete Dropdown list */}
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-popover border border-border shadow-xl rounded-xl z-50 overflow-hidden max-h-48 overflow-y-auto backdrop-blur-xl">
                      {filteredLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setLocationSearch(loc);
                            setShowLocationSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/80 transition-colors flex items-center gap-2 border-b border-border/20 last:border-b-0"
                        >
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Type "Remote" or specify a city.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleGenerateJd} 
                className="w-full sm:w-auto h-11 px-8 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate with Aurix AI
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: GENERATING STATE */}
      {currentStep === 1 && (
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="rounded-3xl border border-border bg-card/50 p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
            {/* Glowing active animation background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-violet-500/5 to-fuchsia-500/5 animate-pulse" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-ping" />
              <div className="relative h-16 w-16 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-display text-foreground tracking-tight mb-2">
              Aurix AI is working
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm animate-pulse">
              {loadingMessage}
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: EDITOR & REFINE PANELS */}
      {currentStep === 2 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main workspace (Left 3 columns) */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="rounded-2xl border border-border bg-card/65 backdrop-blur-xl shadow-lg overflow-hidden">
              {/* Header Editor Tabs */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditorTab("preview")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      editorTab === "preview" 
                        ? "bg-background text-foreground shadow-sm border border-border" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Preview Mode
                  </button>
                  <button
                    onClick={() => setEditorTab("write")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      editorTab === "write" 
                        ? "bg-background text-foreground shadow-sm border border-border" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Edit Markdown
                  </button>
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                  Editable Document
                </div>
              </div>

              {/* Editable Area */}
              <div className="p-6 min-h-[480px]">
                {editorTab === "write" ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[520px] bg-background/40 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-xl p-4 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                    placeholder="Enter Job Description text..."
                  />
                ) : (
                  <div className="border border-transparent px-2 h-[520px] overflow-y-auto">
                    <MarkdownRenderer content={description} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Refinement Panel (Right 1 column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-md relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-violet-500 before:via-primary before:to-fuchsia-500">
              <h3 className="text-sm font-bold tracking-tight text-foreground mb-4 flex items-center gap-2">
                <div className="p-1 rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                Refine with Aurix AI
              </h3>

              {/* Custom Prompt Textarea Section */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="custom-instruction" className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Custom AI Instruction
                </Label>
                <div className="relative">
                  <textarea
                    id="custom-instruction"
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="e.g. Add key tech stack (React, Python) or highlight benefits..."
                    disabled={isRefining}
                    className="w-full min-h-[85px] bg-background/50 border border-border/80 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-xl p-3 text-xs leading-relaxed focus:outline-none resize-none pr-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (customInstruction.trim()) {
                          handleModifyJd("custom", customInstruction);
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (customInstruction.trim()) {
                        handleModifyJd("custom", customInstruction);
                      }
                    }}
                    disabled={isRefining || !customInstruction.trim()}
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-2 right-2 h-7.5 w-7.5 rounded-lg text-primary hover:text-primary-foreground hover:bg-primary/90 disabled:text-muted-foreground disabled:bg-transparent"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                {/* Suggestions / Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "Add remote work policy",
                    "List 5 cultural benefits",
                    "Add an EEOC statement",
                    "Require 3+ years experience",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={isRefining}
                      onClick={() => setCustomInstruction(preset)}
                      className="text-[10px] font-medium bg-muted/65 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2 py-0.5 rounded-full border border-border/40 hover:border-primary/20 transition-all text-left"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border/60 my-4" />

              {/* Quick Preset Actions */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">
                    Structure & Length
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Button
                      onClick={() => handleModifyJd("improve")}
                      disabled={isRefining}
                      variant="outline"
                      className="w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto"
                    >
                      <Wand2 className="h-3.5 w-3.5 text-indigo-500" />
                      Improve Formatting
                    </Button>
                    
                    <Button
                      onClick={() => handleModifyJd("expand")}
                      disabled={isRefining}
                      variant="outline"
                      className="w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto"
                    >
                      <Maximize2 className="h-3.5 w-3.5 text-emerald-500" />
                      Expand Content
                    </Button>
                    
                    <Button
                      onClick={() => handleModifyJd("shorten")}
                      disabled={isRefining}
                      variant="outline"
                      className="w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto"
                    >
                      <Minimize2 className="h-3.5 w-3.5 text-rose-500" />
                      Shorten JD
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">
                    Tone Adjustments
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Button
                      onClick={() => handleModifyJd("professional")}
                      disabled={isRefining}
                      variant="outline"
                      className="w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                      Professional Tone
                    </Button>

                    <Button
                      onClick={() => handleModifyJd("casual")}
                      disabled={isRefining}
                      variant="outline"
                      className="w-full justify-start rounded-xl py-3 px-3 hover:bg-primary/5 border-border/85 hover:text-primary hover:border-primary/20 transition-all font-medium text-xs flex gap-2 h-auto"
                    >
                      <Smile className="h-3.5 w-3.5 text-amber-500" />
                      Casual Startup Tone
                    </Button>
                  </div>
                </div>
              </div>

              {isRefining && (
                <div className="mt-4 flex items-center justify-center gap-2 py-2.5 px-3 bg-muted/40 rounded-xl text-xs text-muted-foreground animate-pulse border border-border/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                  Aurix AI is working...
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background/30 p-4 text-xs text-muted-foreground leading-relaxed">
              💡 **Tip:** Switch to the **Edit Markdown** tab if you want to make direct text edits to the document manually.
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border px-6 py-4 flex items-center justify-between z-40">
        <div className="flex gap-2">
          {currentStep === 2 ? (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(0)}
              disabled={isSubmitting || isRefining}
              className="rounded-xl border-border/80 hover:bg-accent/40"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="rounded-xl border-border/80 hover:bg-accent/40"
            >
              <Link to="/dashboard/recruitment/jobs">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Jobs
              </Link>
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              variant="ghost"
              onClick={handleGenerateJd}
              disabled={isSubmitting || isRefining}
              className="rounded-xl text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Generate Again
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentStep === 2 && (
            <>
              <Button
                variant="outline"
                onClick={handleCopyJd}
                disabled={isSubmitting}
                className="rounded-xl border-border/80 flex items-center gap-1.5 bg-background hover:bg-accent/40"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy JD"}
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => handleSubmitJob("draft")}
                disabled={isSubmitting}
                className="rounded-xl font-medium border border-border"
              >
                {isSubmitting ? "Saving..." : "Save Job"}
              </Button>
              
              <Button
                onClick={() => handleSubmitJob("active")}
                disabled={isSubmitting}
                className="rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 flex items-center gap-1.5"
              >
                {isSubmitting ? "Publishing..." : "Publish Job"}
                <Send className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

