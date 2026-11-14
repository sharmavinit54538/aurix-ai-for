import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CalendarDays,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Users,
} from "lucide-react";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function QuickSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search employees, departments, requests, pages..." />
      <CommandList className="max-h-[350px] overflow-y-auto p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Navigation">
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Overview</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard/people" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Workforce & Employees</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard/announcements" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Company Announcements</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard/leaves" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Leaves & Attendance</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard/payroll" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <Banknote className="mr-2 h-4 w-4" />
            <span>Payroll Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              navigate({ to: "/dashboard/payroll/periods" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Payroll Periods</span>
          </CommandItem>
          <CommandItem
            value="AI Hub Gemini Assistant Artificial Intelligence"
            onSelect={() => {
              navigate({ to: "/dashboard/ai-hub" });
              onOpenChange(false);
            }}
            className="cursor-pointer group"
          >
            <GeminiIcon gradient className="mr-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>AI Hub</span>
          </CommandItem>
          <CommandItem
            value="Connect Chat Messages Video Calls Meetings"
            onSelect={() => {
              navigate({ to: "/dashboard/connect" });
              onOpenChange(false);
            }}
            className="cursor-pointer"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Connect / Team Chat</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default QuickSearchDialog;
