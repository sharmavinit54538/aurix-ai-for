import React from "react";
import { LogOut } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExitCase } from "../types";
import { ExitPipelineFilterBar } from "./pipeline/ExitPipelineFilterBar";
import { ExitPipelineTableRow } from "./pipeline/ExitPipelineTableRow";
import { ExitPipelinePagination } from "./pipeline/ExitPipelinePagination";

interface ExitRequestsPipelineProps {
  q: string;
  setQ: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedExits: ExitCase[];
  onRowClick: (exit: ExitCase) => void;
  onApprove: (exit: ExitCase, stageType: "manager" | "hr") => void;
  onReject: (exit: ExitCase) => void;
  onStartClearance: (exit: ExitCase) => void;
  onDeactivatePrompt: (exit: ExitCase) => void;
}

export function ExitRequestsPipeline({
  q,
  setQ,
  activeFilter,
  setActiveFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedExits,
  onRowClick,
  onApprove,
  onReject,
  onStartClearance,
  onDeactivatePrompt,
}: ExitRequestsPipelineProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card">
        <ExitPipelineFilterBar
          q={q}
          setQ={setQ}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onPageReset={() => setCurrentPage(1)}
        />

        {paginatedExits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
              <LogOut className="h-6 w-6" />
            </div>
            <p className="font-semibold text-foreground">No exits found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Adjust your filters or submit a resignation exit request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px] border-collapse">
              <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-3">Employee</TableHead>
                  <TableHead className="px-4 py-3">Employee ID</TableHead>
                  <TableHead className="px-4 py-3">Department</TableHead>
                  <TableHead className="px-4 py-3">Reporting Manager</TableHead>
                  <TableHead className="px-4 py-3">Resignation Date</TableHead>
                  <TableHead className="px-4 py-3">Last Working Day</TableHead>
                  <TableHead className="px-4 py-3 text-center">Notice Days</TableHead>
                  <TableHead className="px-4 py-3 text-center">Remaining Days</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                  <TableHead className="px-4 py-3 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExits.map((exit) => (
                  <ExitPipelineTableRow
                    key={exit.id}
                    exit={exit}
                    onRowClick={onRowClick}
                    onApprove={onApprove}
                    onReject={onReject}
                    onStartClearance={onStartClearance}
                    onDeactivatePrompt={onDeactivatePrompt}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ExitPipelinePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
