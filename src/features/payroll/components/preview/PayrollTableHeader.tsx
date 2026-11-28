import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PayrollTableHeader({
  onSort,
}: {
  onSort: (field: string) => void;
}) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/40 text-xs">
        <TableHead className="cursor-pointer select-none" onClick={() => onSort("name")}>
          <div className="flex items-center gap-1">
            <span>Employee</span>
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => onSort("employeeCode")}>
          <div className="flex items-center gap-1">
            <span>Employee ID</span>
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell cursor-pointer select-none" onClick={() => onSort("department")}>
          <div className="flex items-center gap-1">
            <span>Department</span>
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell text-right cursor-pointer select-none" onClick={() => onSort("grossSalary")}>
          <div className="flex items-center justify-end gap-1">
            <span>Gross Earnings</span>
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead className="hidden lg:table-cell text-right">Total Deductions</TableHead>
        <TableHead className="text-right cursor-pointer select-none" onClick={() => onSort("netSalary")}>
          <div className="flex items-center justify-end gap-1">
            <span>Net Pay</span>
            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableRow>
    </TableHeader>
  );
}