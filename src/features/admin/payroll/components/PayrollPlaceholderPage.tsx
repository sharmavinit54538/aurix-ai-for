import type { LucideIcon } from "lucide-react";
import { ComingSoon, PageHeader } from "@/components/aurix/DashboardShell";

interface PayrollPlaceholderPageProps {
  title: string;
  description: string;
  comingSoonTitle: string;
  comingSoonDescription: string;
  icon: LucideIcon;
}

export function PayrollPlaceholderPage({
  title,
  description,
  comingSoonTitle,
  comingSoonDescription,
  icon,
}: PayrollPlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <ComingSoon title={comingSoonTitle} description={comingSoonDescription} icon={icon} />
    </>
  );
}
