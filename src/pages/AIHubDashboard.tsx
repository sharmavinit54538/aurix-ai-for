import { Link } from "@tanstack/react-router";
import { AI_MODULES_LIST, type AIModuleDef } from "./aiHubModules";

export type { AIModuleDef };
export { AI_MODULES_LIST };

// ----------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ----------------------------------------------------
export function AIHubDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_MODULES_LIST.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.to as any}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}
                  >
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
    </div>
  );
}

export default AIHubDashboard;
