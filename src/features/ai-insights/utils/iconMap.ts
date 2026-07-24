import {
  AlertTriangle,
  Brain,
  Briefcase,
  CheckCircle2,
  Cpu,
  Flame,
  GraduationCap,
  HeartPulse,
  LineChart as LineChartIcon,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserMinus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const AI_INSIGHTS_ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  Sparkles,
  UserMinus,
  Zap,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Shield,
  TrendingUp,
  Target,
  GraduationCap,
  Cpu,
  Users,
  LineChart: LineChartIcon,
};

export function getAIInsightsIcon(name?: string, fallback: LucideIcon = Brain): LucideIcon {
  if (!name) return fallback;
  return AI_INSIGHTS_ICON_MAP[name] ?? fallback;
}
