import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusBadgeClass } from "@/lib/status-styles";
import type { ExitCase } from "../../../types";

interface SettlementCalculationsFormProps {
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
}

export function SettlementCalculationsForm({
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
}: SettlementCalculationsFormProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4 text-left">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Final Settlement Calculations
        </h4>
        {detailCase.settlementDetails?.status === "paid" && (
          <Badge variant="outline" className={`font-bold ${statusBadgeClass("approved")}`}>
            PAID OUT
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Pending Salary ($)</Label>
          <Input
            type="number"
            value={settleSalary}
            onChange={(e) => setSettleSalary(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Leave Encashment ($)</Label>
          <Input
            type="number"
            value={settleLeave}
            onChange={(e) => setSettleLeave(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Bonus ($)</Label>
          <Input
            type="number"
            value={settleBonus}
            onChange={(e) => setSettleBonus(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Incentives ($)</Label>
          <Input
            type="number"
            value={settleIncentive}
            onChange={(e) => setSettleIncentive(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Deductions ($)</Label>
          <Input
            type="number"
            value={settleDeduction}
            onChange={(e) => setSettleDeduction(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Asset Recovery Charges ($)</Label>
          <Input
            type="number"
            value={settleRecovery}
            onChange={(e) => setSettleRecovery(e.target.value)}
            className="h-8 bg-background border-border text-xs"
          />
        </div>

        <div className="col-span-2 pt-2 border-t border-border flex justify-between items-center text-xs">
          <div>
            <span className="text-muted-foreground text-[10px] block">
              Calculated Settlement Payout
            </span>
            <strong className="text-lg text-foreground font-display font-semibold">
              ${detailCase.settlementDetails?.totalAmount || 0}
            </strong>
          </div>
          <div className="flex gap-1.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onUpdateSettlement(detailCase)}
              className="h-8 text-xs border-border bg-transparent cursor-pointer"
            >
              Update calculations
            </Button>
            {detailCase.settlementDetails &&
              detailCase.settlementDetails.status === "approved" && (
                <Button
                  type="button"
                  onClick={() => onPaySettlement(detailCase)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Pay Out Wire
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
