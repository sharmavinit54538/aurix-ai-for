import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  LifeBuoy,
  MessageSquare,
  PhoneCall,
  Video,
  UserCheck,
  Laptop,
  Ticket,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpSliderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface HelpActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
  onClick: (navigate: ReturnType<typeof useNavigate>, close: () => void) => void;
}

const HELP_ACTIONS: HelpActionItem[] = [
  {
    id: "chat",
    title: "Chat",
    description: "Real-time direct messages, group chats, and team discussions",
    icon: MessageSquare,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    badge: "Connect",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/connect" });
      close();
    },
  },
  {
    id: "calls",
    title: "Calls",
    description: "One-on-one voice and video calls with team members",
    icon: PhoneCall,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Voice & Video",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/calls" });
      close();
    },
  },
  {
    id: "meetings",
    title: "Meetings",
    description: "Schedule conferences, join live rooms, and view calendar",
    icon: Video,
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
    badge: "Conferencing",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/meetings" });
      close();
    },
  },
  {
    id: "hr-support",
    title: "HR Support",
    description: "Assistance for leave, payroll queries, attendance & policies",
    icon: UserCheck,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    badge: "HR Helpdesk",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/helpdesk", search: { dept: "hr" } as never });
      close();
    },
  },
  {
    id: "it-support",
    title: "IT Support",
    description: "Hardware diagnostics, software access, VPN & IT requests",
    icon: Laptop,
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
    badge: "IT Helpdesk",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/helpdesk", search: { dept: "it" } as never });
      close();
    },
  },
  {
    id: "tickets",
    title: "Tickets",
    description: "Track submitted service requests, ticket statuses & SLAs",
    icon: Ticket,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
    badge: "Overview",
    onClick: (navigate, close) => {
      navigate({ to: "/dashboard/helpdesk" });
      close();
    },
  },
];

export function HelpSlider({ open, onOpenChange }: HelpSliderProps) {
  const navigate = useNavigate();

  const handleClose = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] md:max-w-[580px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/80 shadow-2xl z-[60]"
      >
        {/* Header */}
        <SheetHeader className="p-5 sm:p-6 border-b border-border/60 bg-card/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/30 shadow-xs">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div className="text-left">
              <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                Help & Support
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3 w-3" /> Quick Hub
                </span>
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Instant access to communication, conferencing, and service desk
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Action Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HELP_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => action.onClick(navigate, handleClose)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/50 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-card/90 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden backdrop-blur-xs min-h-[140px]"
                >
                  {/* Top: Icon + Badge + Arrow */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br border shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 ${action.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {action.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground border border-border/60 transition-colors group-hover:border-indigo-500/30 group-hover:text-foreground">
                            {action.badge}
                          </span>
                        )}
                        <div className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-200 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle ambient hover glow */}
                  <div className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-indigo-500/5 blur-xl transition-all duration-300 group-hover:bg-indigo-500/15" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 bg-card/30 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate({ to: "/dashboard/helpdesk" });
              handleClose();
            }}
            className="w-full text-xs font-semibold gap-2 border-border/80 hover:bg-accent/80"
          >
            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            Open Full Helpdesk Center
            <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
