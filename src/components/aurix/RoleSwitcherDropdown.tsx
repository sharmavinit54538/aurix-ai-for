import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, UserCog, ShieldCheck, Briefcase, Video, User, Sparkles } from "lucide-react";
import { AVAILABLE_ROLES, type Role, type RoleConfig } from "@/lib/aurix-store";

interface RoleSwitcherDropdownProps {
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
}

const ROLE_ICONS: Record<Role, any> = {
  admin: ShieldCheck,
  hr: Briefcase,
  manager: UserCog,
  interviewer: Video,
  employee: User,
  candidate: Sparkles,
  ceo: ShieldCheck,
  cto: ShieldCheck,
  cio: ShieldCheck,
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  hr: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  manager: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  interviewer: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  employee: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  candidate: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  ceo: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cto: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  cio: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

export function RoleSwitcherDropdown({ currentRole, onSwitchRole }: RoleSwitcherDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = AVAILABLE_ROLES.find((r) => r.role === currentRole) || {
    role: currentRole,
    label: currentRole.toUpperCase(),
    badge: "Active",
    description: "Current active workspace role",
    defaultPath: "/dashboard",
  };

  const Icon = ROLE_ICONS[currentRole] || UserCog;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (role: Role) => {
    setIsOpen(false);
    if (role !== currentRole) {
      onSwitchRole(role);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-border/70 bg-card/60 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:border-border transition-all cursor-pointer shadow-sm"
        title="Switch user role & persona preview"
        aria-label="Switch user persona"
        aria-expanded={isOpen}
      >
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex items-center gap-1.5 text-left">
          <span className="hidden sm:inline text-muted-foreground text-[11px] font-normal">Role:</span>
          <span className="font-semibold text-foreground truncate max-w-[110px]">{activeConfig.label}</span>
        </div>
        <span
          className={`hidden md:inline-flex rounded px-1.5 py-0.2 text-[9px] font-semibold border ${
            ROLE_BADGE_COLORS[currentRole] || "bg-muted text-muted-foreground"
          }`}
        >
          {activeConfig.badge}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 origin-top-left rounded-xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-2.5 py-2 border-b border-border/50">
            <div className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Persona Switcher</div>
            <div className="text-[11px] text-muted-foreground">
              Preview OFC360 from different employee & stakeholder roles
            </div>
          </div>

          <div className="py-1 space-y-0.5 max-h-[320px] overflow-y-auto">
            {AVAILABLE_ROLES.map((cfg) => {
              const RoleIcon = ROLE_ICONS[cfg.role] || User;
              const isSelected = cfg.role === currentRole;

              return (
                <button
                  key={cfg.role}
                  onClick={() => handleSelect(cfg.role)}
                  className={`w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-foreground hover:bg-accent/60"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                      ROLE_BADGE_COLORS[cfg.role] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    <RoleIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-foreground truncate">{cfg.label}</span>
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.2 rounded border shrink-0 ${
                          ROLE_BADGE_COLORS[cfg.role] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {cfg.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{cfg.description}</p>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary self-center ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
