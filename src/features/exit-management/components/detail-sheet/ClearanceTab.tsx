import { TabsContent } from "@/components/ui/tabs";
import type { ExitCase } from "../../types";
import { ResignationSignoffBoxes } from "./clearance/ResignationSignoffBoxes";
import { AssignedAssetsTable } from "./clearance/AssignedAssetsTable";
import { DeptClearanceTable } from "./clearance/DeptClearanceTable";

interface ClearanceTabProps {
  detailCase: ExitCase;
  onApproval: (exit: ExitCase, stageType: "manager" | "hr") => void;
  onAssetReturnStatus: (
    exit: ExitCase,
    recordId: string,
    status: "returned" | "damaged" | "missing",
    remarks: string,
  ) => void;
  onDeptClearanceStatus: (
    exit: ExitCase,
    dept: "HR" | "IT" | "Finance" | "Admin" | "Manager",
    status: "approved" | "rejected",
    comments: string,
  ) => void;
}

export function ClearanceTab({
  detailCase,
  onApproval,
  onAssetReturnStatus,
  onDeptClearanceStatus,
}: ClearanceTabProps) {
  return (
    <TabsContent value="clearance" className="space-y-6 mt-0">
      <ResignationSignoffBoxes
        detailCase={detailCase}
        onApproval={onApproval}
      />
      <AssignedAssetsTable
        detailCase={detailCase}
        onAssetReturnStatus={onAssetReturnStatus}
      />
      <DeptClearanceTable
        detailCase={detailCase}
        onDeptClearanceStatus={onDeptClearanceStatus}
      />
    </TabsContent>
  );
}
