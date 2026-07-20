import { createFileRoute } from "@tanstack/react-router";
import { Folder, Laptop, Wrench, FolderOpen } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/resources/")({
  head: () => ({ meta: [{ title: "Resources Hub — Aurix" }] }),
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
  },
  {
    id: "assets",
    title: "Asset Inventory",
    description: "IT hardware inventory, laptops, monitors, mobile devices, and warranty tracking.",
    icon: Laptop,
    to: "/dashboard/resources/assets",
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "asset-management",
    title: "Asset Management & QR",
    description: "Manage asset allocations, check-ins, return handovers, maintenance, and QR sticker generation.",
    icon: Wrench,
    to: "/dashboard/resources/asset-management",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
];

function ResourcesHubPage() {
  return (
    <ModuleHubView
      eyebrow="Resources & Asset Workspace"
      title="Resources & Assets"
      description="Manage enterprise document repositories, IT equipment inventories, hardware assignments, and maintenance logs."
      headerIcon={FolderOpen}
      modules={RESOURCES_MODULES}
    />
  );
}
