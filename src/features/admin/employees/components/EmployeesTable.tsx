import {
  MoreVertical,
  Mail,
  Link2,
  UserMinus,
  UserCheck,
  Key,
  Eye,
  Trash2,
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
  onEdit: (id: string) => void;
  onResendInvite: (id: string) => void;
  onResetPassword: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeesTable({
  employees,
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
        <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Designation</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Shift</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
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
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
  onDelete,
}: {
  employee: Employee;
  onEdit: (id: string) => void;
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

  return (
    <tr className="border-t border-border transition-colors hover:bg-accent/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
            {employee.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="font-medium">{employee.fullName}</div>
            <div className="text-xs text-muted-foreground">{employee.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">{employee.department || "—"}</td>
      <td className="px-4 py-3">{employee.designation || "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{employee.joiningDate || "—"}</td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{employee.shift}</Badge>
      </td>
      <td className="px-4 py-3">
        <EmployeeStatusBadge status={status} />
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border border-border">
            <DropdownMenuItem onClick={() => onEdit(employee.id)} className="cursor-pointer gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>View / Edit Profile</span>
            </DropdownMenuItem>

            {isInvited && (
              <>
                <DropdownMenuItem onClick={() => onResendInvite(employee.id)} className="cursor-pointer gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Resend Invitation</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyInviteLink} className="cursor-pointer gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span>Copy Invite Link</span>
                </DropdownMenuItem>
              </>
            )}

            {isActive && (
              <>
                <DropdownMenuItem onClick={() => onResetPassword(employee.id)} className="cursor-pointer gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>Reset Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeactivate(employee.id)}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Deactivate Employee</span>
                </DropdownMenuItem>
              </>
            )}

            {isDisabled && (
              <DropdownMenuItem
                onClick={() => onActivate(employee.id)}
                className="cursor-pointer gap-2 text-emerald-500 focus:text-emerald-500"
              >
                <UserCheck className="h-4 w-4" />
                <span>Activate Employee</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="border-t border-border" />
            <DropdownMenuItem
              onClick={() => onDelete(employee.id)}
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Employee</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
          : status.text === "PENDING"
            ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
            : undefined
      }
    >
      {status.text}
    </Badge>
  );
}
