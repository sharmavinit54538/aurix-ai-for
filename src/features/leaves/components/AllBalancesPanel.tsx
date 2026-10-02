import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Users, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "@/api";
import { toast } from "sonner";
import type { LeaveEmployee, LeaveBalance } from "../types";
import { mapBalance } from "../mappers";

export function AllBalancesPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [employees, setEmployees] = useState<LeaveEmployee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [selectedEmp, setSelectedEmp] = useState<LeaveEmployee | null>(null);
  const [empBalances, setEmpBalances] = useState<LeaveBalance[]>([]);
  const [empBalancesLoading, setEmpBalancesLoading] = useState(false);

  // References to discard stale async responses
  const searchSeqRef = useRef(0);
  const activeEmpIdRef = useRef<string | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch employees list from GET /leaves/employees?q=
  const fetchEmployees = useCallback(async (query: string) => {
    const seq = ++searchSeqRef.current;
    setEmployeesLoading(true);
    setEmployeesError(null);

    try {
      const cleanQ = (query ?? "").trim();
      const res = await api.get<any>(
        `/leaves/employees?q=${encodeURIComponent(cleanQ)}`,
        { headers: { "x-skip-cache": "true" } }
      );

      // Discard if a newer search request has been triggered
      if (seq !== searchSeqRef.current) return;

      const rawList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];

      const mappedList: LeaveEmployee[] = rawList.map((e: any) => ({
        id: String(e.id ?? ""),
        employee_code: String(e.employee_code ?? e.employeeId ?? "—"),
        full_name: String(e.full_name ?? e.fullName ?? "Unnamed"),
        department: String(e.department ?? "—"),
        designation: String(e.designation ?? "—"),
      }));

      setEmployees(mappedList);
    } catch (err: any) {
      if (seq !== searchSeqRef.current) return;
      console.error("Error fetching employees for leave balances", err);
      setEmployeesError(err?.data?.message || err?.message || "Failed to load employees.");
    } finally {
      if (seq === searchSeqRef.current) {
        setEmployeesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchEmployees(debouncedQuery);
  }, [debouncedQuery, fetchEmployees]);

  // Fetch balances for a specific employee by UUID
  const handleSelectEmployee = async (emp: LeaveEmployee) => {
    setSelectedEmp(emp);
    setEmpBalances([]);
    setEmpBalancesLoading(true);
    activeEmpIdRef.current = emp.id;

    try {
      const res = await api.get<any>(`/leaves/balances/${emp.id}`, {
        headers: { "x-skip-cache": "true" },
      });

      // Ignore response if user has already clicked another employee
      if (activeEmpIdRef.current !== emp.id) return;

      if (res?.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : [];
        setEmpBalances(list.map(mapBalance));
      } else if (Array.isArray(res)) {
        setEmpBalances(res.map(mapBalance));
      } else {
        setEmpBalances([]);
      }
    } catch (err: any) {
      if (activeEmpIdRef.current !== emp.id) return;
      console.error("Error fetching employee balances", err);
      toast.error(err?.data?.message || err?.message || "Failed to load balances for selected employee.");
      setEmpBalances([]);
    } finally {
      if (activeEmpIdRef.current === emp.id) {
        setEmpBalancesLoading(false);
      }
    }
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
            className="pl-9 bg-background/50 border border-border"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: List of Employees */}
        <Card className="border border-border bg-card/50 backdrop-blur-md md:col-span-2 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/20">
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
                      <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                      <span>Loading employees...</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {employeesError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-xs">{employeesError}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchEmployees(debouncedQuery)}
                        className="text-xs gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!employeesLoading && !employeesError && employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className={`border-b border-border/80 hover:bg-muted/5 transition-all cursor-pointer ${
                    selectedEmp?.id === emp.id
                      ? "bg-indigo-500/5 hover:bg-indigo-500/5 border-l-2 border-l-indigo-500"
                      : ""
                  }`}
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
                      className="h-8 text-indigo-400"
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
        <Card className="border border-border bg-card/40 backdrop-blur-xl h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-indigo-500" />
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
                  <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                  <span className="text-xs text-muted-foreground">Fetching records...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {empBalances.map((b) => (
                    <div
                      key={b.leave_type}
                      className="border border-border/80 bg-background/50 rounded-lg p-3 space-y-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{b.leave_type}</span>
                        <Badge className="font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {b.remaining_days} remaining
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex justify-between pt-1">
                        <span>Total: {b.total_days} days</span>
                        <span>Used: {b.used_days} days</span>
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
