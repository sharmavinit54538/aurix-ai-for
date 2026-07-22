import React from "react";
import { Search, RotateCcw, Filter, Bookmark, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalaryStructureFilters as FilterType } from "./salaryStructureTypes";

interface SalaryStructureFiltersProps {
  filters: FilterType;
  onChange: (updated: Partial<FilterType>) => void;
  onReset: () => void;
}

export const SalaryStructureFilters: React.FC<SalaryStructureFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/60 border border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search structures by name, code, grade, designation, or department..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
          />
        </div>

        {/* Saved Views & Reset */}
        <div className="flex items-center gap-2">
          <Select
            value="default"
            onValueChange={(val) => {
              if (val === "tech") {
                onChange({ department: "Engineering", status: "ACTIVE" });
              } else if (val === "drafts") {
                onChange({ status: "DRAFT" });
              } else if (val === "exec") {
                onChange({ employmentType: "EXECUTIVE" });
              }
            }}
          >
            <SelectTrigger className="w-40 bg-slate-950/60 border-white/10 text-xs h-9 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                <SelectValue placeholder="Saved Views" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
              <SelectItem value="default">All Structures View</SelectItem>
              <SelectItem value="tech">Engineering Active</SelectItem>
              <SelectItem value="drafts">Pending & Drafts</SelectItem>
              <SelectItem value="exec">Executive Bands</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-white/10 bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white h-9 text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-2 pt-2 border-t border-white/5 text-xs">
        {/* Department Filter */}
        <Select
          value={filters.department || "all"}
          onValueChange={(val) => onChange({ department: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Depts</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales & BD">Sales & BD</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="HR">Human Resources</SelectItem>
            <SelectItem value="Executive Board">Executive Board</SelectItem>
          </SelectContent>
        </Select>

        {/* Designation Filter */}
        <Select
          value={filters.designation || "all"}
          onValueChange={(val) => onChange({ designation: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Principal Software Engineer">Principal Engineer</SelectItem>
            <SelectItem value="Enterprise Account Executive">Account Executive</SelectItem>
            <SelectItem value="Operations Executive">Ops Executive</SelectItem>
            <SelectItem value="Chief Technology Officer / VP">VP / CTO</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select
          value={filters.location || "all"}
          onValueChange={(val) => onChange({ location: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Global">Global / All India</SelectItem>
            <SelectItem value="Bangalore">Bangalore HQ</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad Tech Park</SelectItem>
            <SelectItem value="Mumbai">Mumbai Office</SelectItem>
            <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
          </SelectContent>
        </Select>

        {/* Employment Type Filter */}
        <Select
          value={filters.employmentType || "all"}
          onValueChange={(val) => onChange({ employmentType: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Emp Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FULL_TIME">Full Time Regular</SelectItem>
            <SelectItem value="CONTRACT">Contractual</SelectItem>
            <SelectItem value="INTERN">Intern</SelectItem>
            <SelectItem value="EXECUTIVE">Executive CXO</SelectItem>
          </SelectContent>
        </Select>

        {/* Salary Grade Filter */}
        <Select
          value={filters.salaryGrade || "all"}
          onValueChange={(val) => onChange({ salaryGrade: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Salary Grade" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="L5 - Principal Architect">L5 - Principal</SelectItem>
            <SelectItem value="L3 - Senior Manager">L3 - Manager</SelectItem>
            <SelectItem value="L1 - Associate">L1 - Specialist</SelectItem>
            <SelectItem value="E1 - Executive Committee">E1 - Executive</SelectItem>
          </SelectContent>
        </Select>

        {/* Salary Band Filter */}
        <Select
          value={filters.salaryBand || "all"}
          onValueChange={(val) => onChange({ salaryBand: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Salary Band" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="all">All Bands</SelectItem>
            <SelectItem value="Band 5 (CXO / VP)">Band 5 (CXO)</SelectItem>
            <SelectItem value="Band 4 (Senior Management)">Band 4 (Senior)</SelectItem>
            <SelectItem value="Band 3 (Mid Management)">Band 3 (Mid)</SelectItem>
            <SelectItem value="Band 1 (Junior Level)">Band 1 (Junior)</SelectItem>
          </SelectContent>
        </Select>

        {/* Financial Year Filter */}
        <Select
          value={filters.financialYear || "FY26-27"}
          onValueChange={(val) => onChange({ financialYear: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Fin Year" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="FY26-27">FY 2026-2027</SelectItem>
            <SelectItem value="FY25-26">FY 2025-2026</SelectItem>
            <SelectItem value="FY24-25">FY 2024-2025</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) => onChange({ status: val })}
        >
          <SelectTrigger className="bg-slate-950/40 border-white/10 text-xs h-8 text-slate-300">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-xs text-slate-200">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active Only</SelectItem>
            <SelectItem value="DRAFT">Draft Only</SelectItem>
            <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
