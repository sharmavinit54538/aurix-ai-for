import { createFileRoute } from "@tanstack/react-router";
import { Package, FileText, Receipt, Compass, Wrench } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/resources/")({
  head: () => ({ meta: [{ title: "Resources Hub — OFC360" }] }),
  component: ResourcesHubPage,
});

const RESOURCES_MODULES: ModuleItem[] = [
  {
    id: "assets",
    title: "IT & Office Assets",
    description: "Track laptops, hardware inventory, assignments, and maintenance status.",
    icon: Package,
    to: "/dashboard/assets",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "asset-management",
    title: "Enterprise Asset Lifecycle",
    description: "Procurement, depreciation, warranty tracking, and vendor management.",
    icon: Wrench,
    to: "/dashboard/asset-management",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
  {
    id: "documents",
    title: "Company & Employee Documents",
    description: "Centralized repository for policies, contracts, ID proofs, and compliance files.",
    icon: FileText,
    to: "/dashboard/documents",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "expenses",
    title: "Expense Reimbursements",
    description: "Submit receipts, review expense claims, and manage reimbursement approvals.",
    icon: Receipt,
    to: "/dashboard/expenses",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "travel",
    title: "Business Travel Desk",
    description: "Flight and hotel requests, travel itineraries, and per-diem allowances.",
    icon: Compass,
    to: "/dashboard/travel",
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
  },
];

function ResourcesHubPage() {
  return <ModuleHubView modules={RESOURCES_MODULES} />;
}
