import { Eye, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusBadgeClass } from "@/lib/status-styles";
import { toast } from "sonner";
import type { ExitCase } from "../../types";

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
      {/* Calculations Form */}
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

      {/* Exit Documents Generation */}
      <div className="space-y-2 text-left">
        <Label className="text-xs font-semibold text-muted-foreground">
          Auto-generated offboarding certificates
        </Label>
        <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
          <Table className="text-xs border-collapse">
            <TableHeader className="bg-muted/10 border-b border-border">
              <TableRow>
                <TableHead className="px-3 py-2 w-[220px]">Certificate Title</TableHead>
                <TableHead className="px-3 py-2">Generation Status</TableHead>
                <TableHead className="px-3 py-2 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailCase.documents.map((doc) => (
                <TableRow key={doc.name} className="border-t border-border">
                  <TableCell className="px-3 py-2 font-bold">{doc.name}</TableCell>
                  <TableCell className="px-3 py-2">
                    {doc.issued ? (
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${statusBadgeClass("approved")}`}
                      >
                        Issued & Signed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${statusBadgeClass("warning")}`}
                      >
                        Not Generated
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onPreviewLetter(detailCase, doc.name)}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Preview template text"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {!doc.issued ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onGenerateDoc(detailCase, doc.name)}
                          className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted"
                        >
                          Generate
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            toast.success(
                              `Sent PDF document to ${detailCase.employee}'s personal email.`,
                            );
                          }}
                          className="h-6 w-6 text-primary hover:bg-primary/10 cursor-pointer"
                          title="Email PDF to employee"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TabsContent>
  );
}
