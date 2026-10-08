import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusBadgeClass } from "@/lib/status-styles";
import type { ExitCase } from "../../../types";

interface ResignationSignoffBoxesProps {
  detailCase: ExitCase;
  onApproval: (exit: ExitCase, stageType: "manager" | "hr") => void;
}

export function ResignationSignoffBoxes({
  detailCase,
  onApproval,
}: ResignationSignoffBoxesProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Resignation Signoff Approvals
      </h4>
      <div className="grid grid-cols-2 gap-3 text-xs pt-1.5">
        {/* Manager approval box */}
        <div className="rounded-lg border border-border p-3 space-y-1">
          <span className="text-muted-foreground block text-[10px]">Reporting Manager</span>
          <strong className="text-foreground block">{detailCase.managerName || "—"}</strong>
          <div className="pt-2 flex items-center justify-between">
            {detailCase.managerApprovalStatus === "approved" ? (
              <Badge variant="outline" className={`text-[10px] ${statusBadgeClass("approved")}`}>
                Approved
              </Badge>
            ) : detailCase.managerApprovalStatus === "rejected" ? (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
                Rejected
              </Badge>
            ) : (
              <Badge variant="outline" className={`text-[10px] ${statusBadgeClass("warning")}`}>
                Pending Approval
              </Badge>
            )}
            {detailCase.managerApprovalStatus === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApproval(detailCase, "manager")}
                className="h-6 text-[10px] px-2 cursor-pointer"
              >
                Approve
              </Button>
            )}
          </div>
        </div>

        {/* HR approval box */}
        <div className="rounded-lg border border-border p-3 space-y-1">
          <span className="text-muted-foreground block text-[10px]">HR Business Partner</span>
          <strong className="text-foreground block">
            {(detailCase as any).hrApproverName || "HR Business Partner"}
          </strong>
          <div className="pt-2 flex items-center justify-between">
            {detailCase.hrApprovalStatus === "approved" ? (
              <Badge variant="outline" className={`text-[10px] ${statusBadgeClass("approved")}`}>
                Approved
              </Badge>
            ) : detailCase.hrApprovalStatus === "rejected" ? (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">
                Rejected
              </Badge>
            ) : (
              <Badge variant="outline" className={`text-[10px] ${statusBadgeClass("warning")}`}>
                Pending Approval
              </Badge>
            )}
            {detailCase.hrApprovalStatus === "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApproval(detailCase, "hr")}
                className="h-6 text-[10px] px-2 cursor-pointer"
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
