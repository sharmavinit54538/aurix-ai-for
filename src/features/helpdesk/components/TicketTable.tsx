import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Code,
  FileText,
  Banknote,
  Building,
  HelpCircle,
  Eye,
  Clock,
  UserCheck,
} from "lucide-react";
import { HelpdeskStatusBadge, HelpdeskPriorityBadge, HelpdeskSlaBadge } from "./HelpdeskBadges";
import { HelpdeskEmptyState } from "./HelpdeskStates";
import type { HelpdeskTicket, HelpdeskCategory, HelpdeskStatus, HelpdeskPriority } from "../types";

export function getCategoryIcon(category: string) {
  switch (category) {
    case "it_hardware":
      return <Laptop className="h-4 w-4 text-sky-500" />;
    case "it_software":
      return <Code className="h-4 w-4 text-purple-500" />;
    case "hr_policy":
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case "payroll":
      return <Banknote className="h-4 w-4 text-amber-500" />;
    case "facilities":
      return <Building className="h-4 w-4 text-orange-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-slate-500" />;
  }
}

export function formatCategoryLabel(category: string): string {
  switch (category) {
    case "it_hardware":
      return "IT Hardware";
    case "it_software":
      return "IT Software";
    case "hr_policy":
      return "HR Policy";
    case "payroll":
      return "Payroll";
    case "facilities":
      return "Facilities";
    default:
      return "General / Other";
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

interface TicketTableProps {
  tickets: HelpdeskTicket[];
  onSelectTicket: (ticket: HelpdeskTicket) => void;
  showRequesterColumn?: boolean;
  onCreateTicket?: () => void;
  isLoading?: boolean;
  filterDepartment?: "IT" | "HR" | "All";
}

export function TicketTable({
  tickets,
  onSelectTicket,
  showRequesterColumn = false,
  onCreateTicket,
  isLoading = false,
  filterDepartment = "All",
}: TicketTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter based on department context if applicable
  const departmentFiltered = useMemo(() => {
    if (filterDepartment === "HR") {
      return tickets.filter((t) => t.category === "hr_policy" || t.category === "payroll");
    }
    if (filterDepartment === "IT") {
      return tickets.filter((t) => t.category === "it_hardware" || t.category === "it_software" || t.category === "facilities");
    }
    return tickets;
  }, [tickets, filterDepartment]);

  // Apply search & interactive filters
  const filteredTickets = useMemo(() => {
    return departmentFiltered.filter((ticket) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = ticket.title.toLowerCase().includes(q);
        const matchesNum = (ticket.ticket_number || ticket.id).toLowerCase().includes(q);
        const matchesReq = (ticket.requester_name || "").toLowerCase().includes(q);
        const matchesDesc = (ticket.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesNum && !matchesReq && !matchesDesc) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "all" && ticket.category !== categoryFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [departmentFiltered, search, statusFilter, categoryFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket #, subject, or requester..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="waiting_on_employee">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Category: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="it_hardware">IT Hardware</SelectItem>
              <SelectItem value="it_software">IT Software</SelectItem>
              <SelectItem value="hr_policy">HR Policy</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select
            value={priorityFilter}
            onValueChange={(val) => {
              setPriorityFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px] h-9 text-xs">
              <SelectValue placeholder="Priority: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-8">
            <HelpdeskEmptyState
              title="No tickets found."
              description={
                search || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                  ? "No tickets match the selected filters. Try resetting search or filter criteria."
                  : "You currently have no open or past support tickets."
              }
              action={
                onCreateTicket ? (
                  <Button onClick={onCreateTicket} size="sm" className="gap-2">
                    Create Ticket
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] font-semibold">Ticket ID</TableHead>
                  <TableHead className="min-w-[220px] font-semibold">Subject</TableHead>
                  {showRequesterColumn && (
                    <TableHead className="min-w-[140px] font-semibold">Requester</TableHead>
                  )}
                  <TableHead className="w-[130px] font-semibold">Category</TableHead>
                  <TableHead className="w-[100px] font-semibold">Priority</TableHead>
                  <TableHead className="w-[110px] font-semibold">Status</TableHead>
                  <TableHead className="w-[130px] font-semibold">Assigned</TableHead>
                  <TableHead className="w-[110px] font-semibold">SLA</TableHead>
                  <TableHead className="w-[120px] font-semibold">Created</TableHead>
                  <TableHead className="w-[70px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className="cursor-pointer hover:bg-muted/40 transition-colors group"
                  >
                    {/* Ticket Number */}
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {ticket.ticket_number || ticket.id.slice(0, 8)}
                    </TableCell>

                    {/* Subject */}
                    <TableCell>
                      <div className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {ticket.title}
                      </div>
                      {ticket.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </div>
                      )}
                    </TableCell>

                    {/* Requester Column if needed */}
                    {showRequesterColumn && (
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground truncate max-w-[130px]">
                          {ticket.requester_name || "Employee"}
                        </div>
                        {ticket.department && (
                          <div className="text-muted-foreground text-[11px] truncate">
                            {ticket.department}
                          </div>
                        )}
                      </TableCell>
                    )}

                    {/* Category */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        {getCategoryIcon(ticket.category)}
                        <span>{formatCategoryLabel(ticket.category)}</span>
                      </div>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <HelpdeskPriorityBadge priority={ticket.priority} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <HelpdeskStatusBadge status={ticket.status} />
                    </TableCell>

                    {/* Assigned */}
                    <TableCell className="text-xs text-muted-foreground">
                      {ticket.assigned_agent_name ? (
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <UserCheck className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate max-w-[100px]">{ticket.assigned_agent_name}</span>
                        </div>
                      ) : ticket.assigned_team ? (
                        <span className="text-xs font-medium text-muted-foreground">{ticket.assigned_team}</span>
                      ) : (
                        <span className="text-xs italic text-muted-foreground/60">Unassigned</span>
                      )}
                    </TableCell>

                    {/* SLA Status */}
                    <TableCell>
                      <HelpdeskSlaBadge slaStatus={ticket.sla_status} />
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground/70" />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground group-hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Bar */}
        {filteredTickets.length > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredTickets.length)} of {filteredTickets.length} tickets
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
