import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserPlus, Network, ListFilter, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeHierarchyView } from "@/features/admin/employees/components/EmployeeHierarchyView";



export interface PeopleModuleDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}

export const PEOPLE_MODULES_LIST: PeopleModuleDef[] = [
  {
    id: "employees",
    title: "Employees",
    description: "Manage employee profiles, emergency contacts, job details, and status logs.",
    icon: Users,
    to: "/dashboard/employees",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "managers",
    title: "Managers",
    description: "Assign direct reports, update department management, and review operations.",
    icon: UserPlus,
    to: "/dashboard/managers",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
];

export function PeopleHubPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "hierarchy">("directory");

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <Link
        to="/dashboard/workforce"
        className="group/back inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 hover:bg-accent/80 hover:border-primary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-xs backdrop-blur-md transition-all duration-200 hover:shadow-md hover:shadow-primary/5 cursor-pointer mb-2"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-background/80 border border-border/50 group-hover/back:border-primary/40 group-hover/back:bg-primary/10 text-muted-foreground group-hover/back:text-primary transition-all duration-200">
          <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
        </span>
        <span>Back to Workforce Hub</span>
      </Link> 
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Users className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">People & Organization</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your company workforce profiles, corporate hierarchies, and direct reporting structures.
          </p>
        </div>
        {/* TAB SWITCHER */}
        <div className="flex items-center rounded-lg border border-border/80 bg-card/65 p-0.5">
          <Button
            variant={activeTab === "directory" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("directory")}
            className="h-8 gap-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer"
          >
            <ListFilter className="h-3.5 w-3.5" />
            Employee Directory
          </Button>
          <Button
            variant={activeTab === "hierarchy" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("hierarchy")}
            className="h-8 gap-1.5 px-3 text-xs font-semibold rounded-md cursor-pointer"
          >
            <Network className="h-3.5 w-3.5 text-primary" />
            Employee Hierarchy
          </Button>
        </div>
      </div>

      {activeTab === "directory" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PEOPLE_MODULES_LIST.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to as any}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <EmployeeHierarchyView />
        </div>
      )}
    </div>
  );
}

export default PeopleHubPage;
