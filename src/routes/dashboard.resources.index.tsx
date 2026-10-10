import { createFileRoute } from "@tanstack/react-router";
import { Folder, Laptop, Wrench, Receipt, Plane } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/resources/")({
  head: () => ({ meta: [{ title: "Resources Hub — OFC360" }] }),
  component: ResourcesHubPage,
});

const RESOURCES_MODULES: ModuleItem[] = [
  {
    id: "documents",
    title: "Document Vault",
    description: "Central repository for company policies, employee handbooks, contracts, and legal templates.",
    icon: Folder,
    to: "/dashboard/resources/documents",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30",
    permission: "resources.documents",
  },
  {
    id: "expenses",
    title: "Expense Management",
    description: "Submit, approve, and track employee expense claims with receipts and reimbursement workflows.",
    icon: Receipt,
    to: "/dashboard/resources/expenses",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    permission: "resources.expenses",
  },
  {
    id: "travel",
    title: "Travel Management",
    description: "Manage travel requests, itineraries, approvals, and travel expense reconciliation.",
    icon: Plane,
    to: "/dashboard/resources/travel",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    permission: "resources.travel",
  },
  {
    id: "assets",
    title: "Asset Inventory",
    description: "IT hardware inventory, laptops, monitors, mobile devices, and warranty tracking.",
    icon: Laptop,
    to: "/dashboard/assets",
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
    permission: "resources.assets",
  },
  {
    id: "asset-management",
    title: "Asset Management & QR",
    description: "Manage asset allocations, check-ins, return handovers, maintenance, and QR sticker generation.",
    icon: Wrench,
    to: "/dashboard/asset-management",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    permission: "resources.asset_management",
  },
];

function ResourcesHubPage() {
  return <ModuleHubView modules={RESOURCES_MODULES} />;
}