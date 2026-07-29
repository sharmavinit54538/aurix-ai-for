import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { ExecutiveTableRow } from "../types/executiveTypes";

export interface ExecutiveDataTableProps {
  title: string;
  description: string;
  headers: { key: string; label: string }[];
  rows: ExecutiveTableRow[];
}

export function ExecutiveDataTable({ title, description, headers, rows }: ExecutiveDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Extract categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [rows]);

  // Filter & Sort Logic
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [rows, searchTerm, categoryFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const valA = String(a[sortKey as keyof ExecutiveTableRow] || "").toLowerCase();
      const valB = String(b[sortKey as keyof ExecutiveTableRow] || "").toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.map((h) => h.label).join(","),
        ...rows.map((r) => headers.map((h) => `"${r[h.key as keyof ExecutiveTableRow] || ""}"`).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported CSV data report!");
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4 text-left shadow-md">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="pl-8 h-8 text-xs bg-muted/20 border-border/60"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-lg border border-border/60 bg-background px-2.5 text-xs font-medium text-foreground cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* CSV Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1.5 border-border/60 hover:bg-accent cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/50 uppercase tracking-wider text-[10px]">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => toggleSort(h.key)}
                  className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>{h.label}</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-muted-foreground">
                  No matching executive records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                  {headers.map((h) => {
                    const val = row[h.key as keyof ExecutiveTableRow];
                    if (h.key === "status") {
                      const isOk = String(val).toLowerCase().includes("track") || String(val).toLowerCase().includes("complete") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("healthy") || String(val).toLowerCase().includes("optimal") || String(val).toLowerCase().includes("active");
                      return (
                        <td key={h.key} className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isOk
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {isOk ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {String(val)}
                          </span>
                        </td>
                      );
                    }
                    if (h.key === "progress" && row.progress !== undefined) {
                      return (
                        <td key={h.key} className="px-4 py-3 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Progress value={row.progress} className="h-1.5 flex-1" />
                            <span className="font-mono text-[10px] text-muted-foreground">{row.progress}%</span>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={h.key} className="px-4 py-3 font-medium text-foreground">
                        {val ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {paginatedRows.length} of {sortedRows.length} entries
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-7 w-7 text-xs border-border/60 cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 font-mono font-semibold">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-7 w-7 text-xs border-border/60 cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
