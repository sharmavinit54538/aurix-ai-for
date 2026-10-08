import { PowerOff, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { STAGE_BADGES, getExitBadge } from "../../constants";
import type { ExitCase } from "../../types";
import { OverviewTab } from "./OverviewTab";
import { ClearanceTab } from "./ClearanceTab";
import { SettlementTab } from "./SettlementTab";
import { InterviewTab } from "./InterviewTab";

interface ExitDetailSheetProps {
  detailCase: ExitCase | null;
  onClose: () => void;
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
  settleSalary: string;
  setSettleSalary: (val: string) => void;
  settleLeave: string;
  setSettleLeave: (val: string) => void;
  settleBonus: string;
  setSettleBonus: (val: string) => void;
  settleIncentive: string;
  setSettleIncentive: (val: string) => void;
  settleDeduction: string;
  setSettleDeduction: (val: string) => void;
  settleRecovery: string;
  setSettleRecovery: (val: string) => void;
  onUpdateSettlement: (exit: ExitCase) => void;
  onPaySettlement: (exit: ExitCase) => void;
  onPreviewLetter: (exit: ExitCase, docName: string) => void;
  onGenerateDoc: (exit: ExitCase, docName: string) => void;
  intReason: string;
  setIntReason: (val: string) => void;
  intRating: number;
  setIntRating: (val: number) => void;
  intMgrFeedback: string;
  setIntMgrFeedback: (val: string) => void;
  intCompFeedback: string;
  setIntCompFeedback: (val: string) => void;
  intSuggestions: string;
  setIntSuggestions: (val: string) => void;
  onSaveInterview: (exit: ExitCase) => void;
  onDeactivatePrompt: (exit: ExitCase) => void;
}

export function ExitDetailSheet({
  detailCase,
  onClose,
  onApproval,
  onAssetReturnStatus,
  onDeptClearanceStatus,
  settleSalary,
  setSettleSalary,
  settleLeave,
  setSettleLeave,
  settleBonus,
  setSettleBonus,
  settleIncentive,
  setSettleIncentive,
  settleDeduction,
  setSettleDeduction,
  settleRecovery,
  setSettleRecovery,
  onUpdateSettlement,
  onPaySettlement,
  onPreviewLetter,
  onGenerateDoc,
  intReason,
  setIntReason,
  intRating,
  setIntRating,
  intMgrFeedback,
  setIntMgrFeedback,
  intCompFeedback,
  setIntCompFeedback,
  intSuggestions,
  setIntSuggestions,
  onSaveInterview,
  onDeactivatePrompt,
}: ExitDetailSheetProps) {
  return (
    <Sheet open={!!detailCase} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
        {detailCase && (
          <>
            {/* Header */}
            <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold text-muted-foreground border-border"
                >
                  {detailCase.department || "Operations"}
                </Badge>
                {(() => {
                  const badge = STAGE_BADGES[detailCase.stage] || {
                    label: detailCase.stage,
                  };
                  return (
                    <Badge
                      className={`${getExitBadge(detailCase.stage)} border shadow-none text-xs font-bold`}
                    >
                      {badge.label}
                    </Badge>
                  );
                })()}
              </div>
              <SheetTitle
                className="font-display text-base font-bold text-foreground mt-2 truncate text-left"
                title={detailCase.employee}
              >
                {detailCase.employee} ({detailCase.employeeId})
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                Resigned Date: {detailCase.resignedAt} &bull; LWD: {detailCase.lastWorkingDay}
              </SheetDescription>
            </SheetHeader>

            {/* Body */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
              <div className="px-5 border-b border-border bg-muted/5 shrink-0">
                <TabsList className="bg-transparent border-none p-0 flex gap-2 h-10">
                  <TabsTrigger
                    value="overview"
                    className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="clearance"
                    className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer"
                  >
                    Clearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="settlement"
                    className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer"
                  >
                    Settlement
                  </TabsTrigger>
                  <TabsTrigger
                    value="interview"
                    className="text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer"
                  >
                    Interview
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1 p-5 min-h-0">
                <OverviewTab detailCase={detailCase} />
                <ClearanceTab
                  detailCase={detailCase}
                  onApproval={onApproval}
                  onAssetReturnStatus={onAssetReturnStatus}
                  onDeptClearanceStatus={onDeptClearanceStatus}
                />
                <SettlementTab
                  detailCase={detailCase}
                  settleSalary={settleSalary}
                  setSettleSalary={setSettleSalary}
                  settleLeave={settleLeave}
                  setSettleLeave={setSettleLeave}
                  settleBonus={settleBonus}
                  setSettleBonus={setSettleBonus}
                  settleIncentive={settleIncentive}
                  setSettleIncentive={setSettleIncentive}
                  settleDeduction={settleDeduction}
                  setSettleDeduction={setSettleDeduction}
                  settleRecovery={settleRecovery}
                  setSettleRecovery={setSettleRecovery}
                  onUpdateSettlement={onUpdateSettlement}
                  onPaySettlement={onPaySettlement}
                  onPreviewLetter={onPreviewLetter}
                  onGenerateDoc={onGenerateDoc}
                />
                <InterviewTab
                  detailCase={detailCase}
                  intReason={intReason}
                  setIntReason={setIntReason}
                  intRating={intRating}
                  setIntRating={setIntRating}
                  intMgrFeedback={intMgrFeedback}
                  setIntMgrFeedback={setIntMgrFeedback}
                  intCompFeedback={intCompFeedback}
                  setIntCompFeedback={setIntCompFeedback}
                  intSuggestions={intSuggestions}
                  setIntSuggestions={setIntSuggestions}
                  onSaveInterview={onSaveInterview}
                />
              </ScrollArea>

              {/* Footer buttons */}
              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {detailCase.stage !== "completed" && detailCase.stage !== "cancelled" && (
                  <Button
                    variant="outline"
                    onClick={() => onDeactivatePrompt(detailCase)}
                    className="h-9 text-xs border-border bg-transparent hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5"
                  >
                    <PowerOff className="h-3.5 w-3.5" />
                    Deactivate Login
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Exit report exported as PDF.");
                  }}
                  className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Print PDF Summary
                </Button>
              </div>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
