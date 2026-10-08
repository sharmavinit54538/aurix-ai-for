import { TabsContent } from "@/components/ui/tabs";
import type { ExitCase } from "../../types";
import { SettlementCalculationsForm } from "./settlement/SettlementCalculationsForm";
import { OffboardingCertificatesTable } from "./settlement/OffboardingCertificatesTable";

interface SettlementTabProps {
  detailCase: ExitCase;
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
}

export function SettlementTab({
  detailCase,
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
}: SettlementTabProps) {
  return (
    <TabsContent value="settlement" className="space-y-6 mt-0">
      <SettlementCalculationsForm
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
      />
      <OffboardingCertificatesTable
        detailCase={detailCase}
        onPreviewLetter={onPreviewLetter}
        onGenerateDoc={onGenerateDoc}
      />
    </TabsContent>
  );
}
