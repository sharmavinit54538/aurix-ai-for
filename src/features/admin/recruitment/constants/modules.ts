import {
  Briefcase,
  CalendarClock,
  FileSignature,
  FileText,
  Folder,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type RecruitmentModule = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
};

export const RECRUITMENT_MODULES_LIST: RecruitmentModule[] = [
  {
    id: "requisitions",
    title: "Requisitions",
    description: "Manage open headcount requests, budget allocations, and review pending approval workflows.",
    icon: FileSignature,
    to: "/dashboard/recruitment/requisitions",
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "jobs",
    title: "All Jobs",
    description: "Post, edit, and publish active career listings and track active application pipelines.",
    icon: Briefcase,
    to: "/dashboard/recruitment/jobs",
    color: "from-blue-500/20 to-sky-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "candidates",
    title: "Candidates",
    description: "Track candidate profiles, stage progressions, screening scores, and BGV checks.",
    icon: Users,
    to: "/dashboard/recruitment/candidates",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "interviews",
    title: "Interviews",
    description: "Coordinate scheduler calendars, assign panel members, and manage candidate scorecards.",
    icon: CalendarClock,
    to: "/dashboard/recruitment/interviews",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "copilot",
    title: "AI Recruiter Copilot",
    description: "Screen resume batches, evaluate candidate scores, and generate inclusive job descriptions with AI.",
    icon: Sparkles,
    to: "/dashboard/recruitment/copilot",
    color: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30",
  },
  {
    id: "offers",
    title: "Offers & Contracts",
    description: "Generate customized offer letters, manage salary models, and track accepts.",
    icon: FileText,
    to: "/dashboard/recruitment/offers",
    color: "from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Prepare welcome checklists, verify candidate documentation, and assign onboarding buddies.",
    icon: UserPlus,
    to: "/dashboard/recruitment/onboarding",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "crm",
    title: "Candidate CRM",
    description: "Nurture relationships with email templates, pipeline triggers, and updates.",
    icon: MessageSquare,
    to: "/dashboard/recruitment/crm",
    color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
  },
  {
    id: "talent-pool",
    title: "Talent Pool",
    description: "Access secondary candidate profiles, skills inventories, and past applications repository.",
    icon: Folder,
    to: "/dashboard/recruitment/talent-pool",
    color: "from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "analytics",
    title: "Recruitment Analytics",
    description: "Monitor hiring pipeline conversion statistics, recruitment cost sources, and KPIs.",
    icon: TrendingUp,
    to: "/dashboard/recruitment/analytics",
    color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "automation",
    title: "Automation & Workflows",
    description: "Design trigger rules to auto-generate letters, update stages, and notify managers.",
    icon: Workflow,
    to: "/dashboard/recruitment/automation",
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "settings",
    title: "Recruitment Settings",
    description: "Configure candidate pipeline columns, career pages, and feedback templates.",
    icon: Settings,
    to: "/dashboard/recruitment/templates",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
  },
];
