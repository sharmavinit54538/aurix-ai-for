import { useMemo } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Heart,
  Layers,
  MapPin,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  normalizeJobDescription,
  type NormalizedJobDescription,
} from "@/features/admin/recruitment/utils/normalizeJobDescription";

// ─── Section wrapper ────────────────────────────────────────────────────────

function JDSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
      <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary/70" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Bullet list ────────────────────────────────────────────────────────────

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Skill chips ────────────────────────────────────────────────────────────

function SkillChips({
  skills,
  variant = "default",
}: {
  skills: string[];
  variant?: "default" | "outline";
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <Badge
          key={i}
          variant={variant}
          className={`text-[11px] font-medium px-2.5 py-1 transition-colors ${
            variant === "default"
              ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
              : "border-border bg-background/50 text-muted-foreground hover:bg-accent/40"
          }`}
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}

// ─── Benefit card ───────────────────────────────────────────────────────────

const BENEFIT_ICONS: Record<string, string> = {
  compensation: "💰",
  salary: "💰",
  bonus: "💰",
  health: "❤️",
  medical: "❤️",
  wellness: "❤️",
  remote: "🏠",
  flexible: "🏠",
  hybrid: "🏠",
  learning: "📚",
  growth: "📚",
  professional: "📚",
  insurance: "🛡️",
  vacation: "🏖️",
  leave: "🏖️",
  retirement: "💎",
  stock: "📈",
  equity: "📈",
};

function getBenefitIcon(text: string): string {
  const lower = text.toLowerCase();
  for (const [keyword, icon] of Object.entries(BENEFIT_ICONS)) {
    if (lower.includes(keyword)) return icon;
  }
  return "✨";
}

function BenefitsList({ benefits }: { benefits: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {benefits.map((benefit, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3.5 transition-colors hover:bg-accent/20"
        >
          <span className="text-base leading-none">{getBenefitIcon(benefit)}</span>
          <span className="text-xs leading-relaxed text-muted-foreground">
            {benefit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Job details grid ───────────────────────────────────────────────────────

function JobDetailsGrid({ jd }: { jd: NormalizedJobDescription }) {
  const details = [
    { label: "Location", value: jd.location, icon: MapPin },
    { label: "Work Mode", value: jd.workMode, icon: Building },
    { label: "Employment Type", value: jd.employmentType, icon: Calendar },
    { label: "Department", value: jd.department, icon: Layers },
    { label: "Seniority", value: jd.seniorityLevel, icon: TrendingUp },
    {
      label: "Experience",
      value: jd.experience?.text ??
        (jd.experience?.minYears != null && jd.experience?.maxYears != null
          ? `${jd.experience.minYears}–${jd.experience.maxYears} years`
          : undefined),
      icon: Award,
    },
  ].filter((d) => d.value);

  if (details.length === 0) return null;

  return (
    <JDSection title="Job Details" icon={Briefcase}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((d) => {
          const I = d.icon;
          return (
            <div
              key={d.label}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                <I className="h-4 w-4 text-primary/70" />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  {d.label}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {d.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </JDSection>
  );
}

// ─── Hiring process timeline ────────────────────────────────────────────────

function HiringTimeline({ steps }: { steps: string[] }) {
  return (
    <div className="relative flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
          {/* Vertical connector line */}
          {i < steps.length - 1 && (
            <div className="absolute left-[15px] top-[32px] h-[calc(100%-20px)] w-px bg-gradient-to-b from-primary/40 to-primary/10" />
          )}
          {/* Step number */}
          <div className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-2 ring-primary/20">
            {String(i + 1).padStart(2, "0")}
          </div>
          {/* Step content */}
          <div className="min-h-[32px] flex items-center pt-1.5">
            <span className="text-xs leading-relaxed text-muted-foreground">{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Salary display ─────────────────────────────────────────────────────────

function SalaryDisplay({
  salary,
}: {
  salary: NonNullable<NormalizedJobDescription["salaryRange"]>;
}) {
  const label =
    salary.text ??
    (salary.min != null && salary.max != null
      ? `${salary.currency || "₹"}${salary.min.toLocaleString()} – ${salary.currency || "₹"}${salary.max.toLocaleString()}`
      : salary.min
        ? `From ${salary.currency || "₹"}${salary.min.toLocaleString()}`
        : salary.max
          ? `Up to ${salary.currency || "₹"}${salary.max.toLocaleString()}`
          : null);

  if (!label) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-4 text-center">
      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        Salary Range
      </span>
      <span className="text-lg font-bold text-foreground">{label}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════

interface JobDescriptionViewProps {
  /**
   * The raw `description` field from the Job object.
   * May be a JSON string containing a structured JD, or plain text.
   */
  description: string;
  /**
   * Supplementary data from the Job object itself, used as fallback
   * when the structured JD doesn't include certain fields.
   */
  fallback?: {
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    location?: string;
    workMode?: string;
    employmentType?: string;
    department?: string;
    experience?: string;
    skills?: string[];
  };
}

export function JobDescriptionView({ description, fallback }: JobDescriptionViewProps) {
  const jd = useMemo(() => normalizeJobDescription(description), [description]);

  // ── Plain text fallback ────────────────────────────────────────────────
  if (!jd.isStructured) {
    // The description is plain text – render it readably with any
    // supplementary data from the Job object.
    return (
      <div className="space-y-6">
        {jd.plainText && (
          <JDSection title="Job Description" icon={Briefcase}>
            <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
              {jd.plainText}
            </p>
          </JDSection>
        )}

        {fallback?.responsibilities && fallback.responsibilities.length > 0 && (
          <JDSection title="Key Responsibilities" icon={Target}>
            <BulletList items={fallback.responsibilities} />
          </JDSection>
        )}

        {fallback?.requirements && fallback.requirements.length > 0 && (
          <JDSection title="Qualifications & Requirements" icon={BookOpen}>
            <BulletList items={fallback.requirements} />
          </JDSection>
        )}

        {fallback?.skills && fallback.skills.length > 0 && (
          <JDSection title="Required Skills" icon={Zap}>
            <SkillChips skills={fallback.skills} />
          </JDSection>
        )}

        {fallback?.benefits && fallback.benefits.length > 0 && (
          <JDSection title="Benefits" icon={Heart}>
            <BenefitsList benefits={fallback.benefits} />
          </JDSection>
        )}
      </div>
    );
  }

  // ── Structured JD rendering ────────────────────────────────────────────

  // Merge structured data with fallback
  const responsibilities = jd.responsibilities ?? fallback?.responsibilities;
  const requiredSkills = jd.requiredSkills ?? fallback?.skills;
  const benefits = jd.benefits ?? fallback?.benefits;
  const qualifications = jd.qualifications ?? fallback?.requirements;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {jd.summary && (
        <JDSection title="Job Summary" icon={Briefcase}>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jd.summary}
          </p>
        </JDSection>
      )}

      {/* About the Role */}
      {jd.aboutRole && (
        <JDSection title="About the Role" icon={Star}>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {jd.aboutRole}
          </p>
        </JDSection>
      )}

      {/* Job Details Grid */}
      <JobDetailsGrid
        jd={{
          ...jd,
          location: jd.location ?? fallback?.location,
          workMode: jd.workMode ?? fallback?.workMode,
          employmentType: jd.employmentType ?? fallback?.employmentType,
          department: jd.department ?? fallback?.department,
          experience: jd.experience ?? (fallback?.experience ? { text: fallback.experience } : undefined),
        }}
      />

      {/* Key Responsibilities */}
      {responsibilities && responsibilities.length > 0 && (
        <JDSection title="Key Responsibilities" icon={Target}>
          <BulletList items={responsibilities} />
        </JDSection>
      )}

      {/* Required Skills */}
      {requiredSkills && requiredSkills.length > 0 && (
        <JDSection title="Required Skills" icon={Zap}>
          <SkillChips skills={requiredSkills} />
        </JDSection>
      )}

      {/* Preferred Skills */}
      {jd.preferredSkills && jd.preferredSkills.length > 0 && (
        <JDSection title="Preferred Skills" icon={Sparkles}>
          <SkillChips skills={jd.preferredSkills} variant="outline" />
        </JDSection>
      )}

      {/* Experience */}
      {jd.experience && (jd.experience.text || jd.experience.minYears != null) && (
        <JDSection title="Experience" icon={Award}>
          <div className="rounded-xl border border-border/50 bg-background/40 p-4 text-center">
            <span className="text-lg font-bold text-foreground">
              {jd.experience.text ??
                `${jd.experience.minYears ?? 0}–${jd.experience.maxYears ?? "?"} Years`}
            </span>
          </div>
        </JDSection>
      )}

      {/* Education */}
      {jd.education && jd.education.length > 0 && (
        <JDSection title="Education" icon={GraduationCap}>
          <BulletList items={jd.education} />
        </JDSection>
      )}

      {/* Qualifications */}
      {qualifications && qualifications.length > 0 && (
        <JDSection title="Qualifications" icon={BookOpen}>
          <BulletList items={qualifications} />
        </JDSection>
      )}

      {/* Nice to Have */}
      {jd.niceToHave && jd.niceToHave.length > 0 && (
        <JDSection title="Nice to Have" icon={Sparkles}>
          <BulletList items={jd.niceToHave} />
        </JDSection>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <JDSection title="Benefits" icon={Heart}>
          <BenefitsList benefits={benefits} />
        </JDSection>
      )}

      {/* Salary Range */}
      {jd.salaryRange && <SalaryDisplay salary={jd.salaryRange} />}

      {/* ATS Keywords */}
      {jd.atsKeywords && jd.atsKeywords.length > 0 && (
        <JDSection title="ATS Keywords" icon={Target}>
          <SkillChips skills={jd.atsKeywords} variant="outline" />
        </JDSection>
      )}

      {/* Hiring Process */}
      {jd.hiringProcess && jd.hiringProcess.length > 0 && (
        <JDSection title="Hiring Process" icon={TrendingUp}>
          <HiringTimeline steps={jd.hiringProcess} />
        </JDSection>
      )}
    </div>
  );
}
