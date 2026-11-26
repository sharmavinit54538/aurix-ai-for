import {
  MoreVertical,
  Mail,
  Link2,
  UserMinus,
  UserCheck,
  Key,
  Eye,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Employee } from "../employeesTypes";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";

interface EmployeesTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onResendInvite: (id: string) => void;
  onResetPassword: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeesTable({
  employees,
  onView,
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
  onDelete,
}: EmployeesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="hidden md:table-cell px-4 py-3">Department</th>
            <th className="hidden lg:table-cell px-4 py-3">Designation</th>
            <th className="hidden xl:table-cell px-4 py-3">Joined</th>
            <th className="hidden xl:table-cell px-4 py-3">Shift</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              onView={onView}
              onEdit={onEdit}
              onResendInvite={onResendInvite}
              onResetPassword={onResetPassword}
              onDeactivate={onDeactivate}
              onActivate={onActivate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmployeeRow({
  employee,
  onView,
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
  onDelete,
}: {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onResendInvite: (id: string) => void;
  onResetPassword: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const status = getEmployeeStatusDetails(employee);
  const isInvited = status.text === "INVITED" || status.text === "EXPIRED";
  const isActive = status.text === "ACTIVE";
  const isDisabled = status.text === "DISABLED";

  function copyInviteLink() {
    const link = window.location.origin + "/onboarding?token=" + (employee.activationToken || "");
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard");
  }

  const initials = employee.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  return (
    <tr className="border-t border-border transition-colors hover:bg-accent/30 group">
      <td className="px-4 py-3.5">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onView(employee)}
        >
          {employee.profilePhotoUrl || employee.avatarUrl ? (
            <img
              src={employee.profilePhotoUrl || employee.avatarUrl}
              alt={employee.fullName}
              className="h-9 w-9 shrink-0 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div
              className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[160px] sm:max-w-[260px]"
              title={employee.fullName}
            >
              {employee.fullName}
            </div>
            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5 truncate max-w-[180px] sm:max-w-[300px]">
              <span className="truncate">{employee.email}</span>
              {employee.employeeId && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="font-mono text-xs text-muted-foreground">{employee.employeeId}</span>
                </>
              )}
            </div>
            {employee.department && (
              <div className="mt-0.5 text-xs text-muted-foreground md:hidden">
                {employee.department}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 text-foreground/90">{employee.department || "—"}</td>
      <td className="hidden lg:table-cell px-4 py-3.5 text-foreground/90">{employee.designation || "—"}</td>
      <td className="hidden xl:table-cell px-4 py-3.5 text-muted-foreground whitespace-nowrap">{employee.joiningDate || "—"}</td>
      <td className="hidden xl:table-cell px-4 py-3.5">
        <Badge variant="secondary" className="text-xs">{employee.shift}</Badge>
      </td>
      <td className="px-4 py-3.5">
        <EmployeeStatusBadge status={status} />
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="inline-flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(employee)}
            className="h-8 px-2.5 text-[13px] text-primary hover:text-primary"
          >
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                aria-label={`More actions for ${employee.fullName}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-card border border-border shadow-lg">
              <DropdownMenuItem onClick={() => onView(employee)} className="cursor-pointer gap-2 font-medium text-[13px]">
                <Eye className="h-4 w-4 text-primary" />
                <span>View Full Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(employee)} className="cursor-pointer gap-2 text-[13px]">
                <Edit3 className="h-4 w-4 text-muted-foreground" />
                <span>Edit Employee</span>
              </DropdownMenuItem>

              {isInvited && (
                <>
                  <DropdownMenuItem onClick={() => onResendInvite(employee.id)} className="cursor-pointer gap-2 text-[13px]">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Resend Invitation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyInviteLink} className="cursor-pointer gap-2 text-[13px]">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span>Copy Invite Link</span>
                  </DropdownMenuItem>
                </>
              )}

              {isActive && (
                <>
                  <DropdownMenuItem onClick={() => onResetPassword(employee.id)} className="cursor-pointer gap-2 text-[13px]">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span>Reset Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeactivate(employee.id)}
                    className="cursor-pointer gap-2 text-[13px] text-destructive focus:text-destructive"
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>Deactivate Employee</span>
                  </DropdownMenuItem>
                </>
              )}

              {isDisabled && (
                <DropdownMenuItem
                  onClick={() => onActivate(employee.id)}
                  className="cursor-pointer gap-2 text-[13px] text-emerald-700 dark:text-emerald-300 focus:text-emerald-700"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Activate Employee</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="border-t border-border" />
              <DropdownMenuItem
                onClick={() => onDelete(employee.id)}
                className="cursor-pointer gap-2 text-[13px] text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Employee</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

function EmployeeStatusBadge({ status }: { status: ReturnType<typeof getEmployeeStatusDetails> }) {
  return (
    <Badge
      variant={status.variant}
      className={
        status.text === "ACTIVE"
          ? "border border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800/60 dark:text-emerald-300"
          : status.text === "PENDING" || status.text === "INVITED"
            ? "border border-amber-300 bg-amber-500/10 text-amber-800 dark:border-amber-800/60 dark:text-amber-300"
            : status.text === "DISABLED" || status.text === "EXPIRED"
              ? "border border-rose-300 bg-rose-500/10 text-rose-700 dark:border-rose-800/60 dark:text-rose-300"
              : undefined
      }
    >
      {status.text}
    </Badge>
  );
}
