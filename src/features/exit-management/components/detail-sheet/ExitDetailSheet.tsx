import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ExitCase } from "../../types";
import { ExitDetailSheetHeader } from "./ExitDetailSheetHeader";
import { ExitDetailSheetFooter } from "./ExitDetailSheetFooter";
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
            <ExitDetailSheetHeader detailCase={detailCase} />

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

              <ExitDetailSheetFooter
                detailCase={detailCase}
                onDeactivatePrompt={onDeactivatePrompt}
              />
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
