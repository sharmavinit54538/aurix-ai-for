import React, { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Users, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { LeaveEmployee, LeaveBalance } from "../types";
import { mapBalance } from "../mappers";
import { cn } from "@/lib/utils";
import { useCompanyEmployees, useEmployeeLeaveBalances } from "@/hooks/useLeaves";

export function AllBalancesPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: employeesData, isLoading: employeesLoading, isError: employeesError, refetch: refetchEmployees } = useCompanyEmployees(debouncedQuery, 1, 50);
  const employees = employeesData?.items || [];

  const [selectedEmp, setSelectedEmp] = useState<LeaveEmployee | null>(null);
  const { data: empBalances = [], isLoading: empBalancesLoading, refetch: refetchEmpBalances } = useEmployeeLeaveBalances(selectedEmp?.id ?? null);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    refetchEmployees();
  }, [debouncedQuery, refetchEmployees]);

  const handleSelectEmployee = (emp: LeaveEmployee) => {
    setSelectedEmp(emp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Organizational Leave Allocations</h3>
          <p className="text-sm text-muted-foreground">
            Select any employee to view their detailed leave balances from database.
          </p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {employeesLoading && employees.length > 0 && (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-primary animate-spin" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: List of Employees */}
        <Card className="border border-border bg-card md:col-span-2 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6 py-4">Employee ID</TableHead>
                <TableHead className="py-4">Name</TableHead>
                <TableHead className="py-4">Department</TableHead>
                <TableHead className="py-4">Designation</TableHead>
                <TableHead className="pr-6 py-4 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesLoading && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                      <span>Loading employees...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {employeesError && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-xs">Failed to load employees</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetchEmployees()}
                        className="text-xs gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/50 transition-colors cursor-pointer",
                    selectedEmp?.id === emp.id && "bg-muted border-l-2 border-l-primary",
                    employeesLoading && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <TableCell className="pl-6 py-4 font-mono text-xs">{emp.employee_code}</TableCell>
                  <TableCell className="py-4 font-semibold text-foreground">{emp.full_name}</TableCell>
                  <TableCell className="py-4 text-muted-foreground text-xs">{emp.department}</TableCell>
                  <TableCell className="py-4 text-muted-foreground text-xs">{emp.designation}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectEmployee(emp);
                      }}
                    >
                      View Balances
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {!employeesLoading && !employeesError && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No employees match search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Right Column: Selected Employee Balances */}
        <Card className="border border-border bg-card h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Detailed Balances
            </CardTitle>
            <CardDescription>
              {selectedEmp
                ? `Viewing balances for ${selectedEmp.full_name}`
                : "Select an employee from the table"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedEmp ? (
              empBalancesLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Fetching records...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {empBalances.map((b, index) => (
                    <div
                      key={`${b.leave_type}-${index}`}
                      className="border border-border bg-muted/50 rounded-lg p-3 space-y-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{b.leave_type}</span>
                        <Badge
                          variant="outline"
                          className="font-semibold bg-primary/10 text-primary border-primary/20"
                        >
                          {b.remaining_days} remaining
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between pt-1">
                        <span>Total: {b.total_days} days</span>
                        <span>Used: {b.used_days} days</span>
                        {b.pending_days !== undefined && <span>Pending: {b.pending_days} days</span>}
                        {b.available_days !== undefined && <span>Available: {b.available_days} days</span>}
                      </div>
                    </div>
                  ))}
                  {empBalances.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No balances registered for this user.
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Users className="h-8 w-8 mb-2 stroke-1" />
                <p className="text-xs">Select an employee profile to query database balances.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}