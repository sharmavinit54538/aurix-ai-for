import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  ClipboardList,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileDown,
  FileSpreadsheet,
  History,
  Loader2,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Send,
  ShieldCheck,
  Trash2,
  Unlock,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { PaymentBatch } from "../types/payment";
import {
  groupPaymentActions,
  type PaymentActionGroup,
  type PaymentActionId,
  type ResolvedPaymentAction,
} from "../utils/paymentBatchActions";

export interface PaymentBatchActionMenuProps {
  batch: PaymentBatch;
  actions: ResolvedPaymentAction[];
  busyActionId?: PaymentActionId | null;
  onAction: (actionId: PaymentActionId, batch: PaymentBatch) => void;
}

const GROUP_TITLES: Record<PaymentActionGroup, string> = {
  management: "Batch & Employees",
  approval: "Approval Workflow",
  downloads: "Files & Reports",
  operations: "Payment Operations",
  history: "Audit & History",
  restricted: "Restricted",
};

function renderActionIcon(id: PaymentActionId, isSpinning: boolean) {
  if (isSpinning) {
    return <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />;
  }
  const cls = "h-4 w-4 shrink-0";
  switch (id) {
    case "view_details":
      return <Eye className={cls} aria-hidden="true" />;
    case "manage_batch":
      return <ExternalLink className={cls} aria-hidden="true" />;
    case "edit_batch":
      return <Pencil className={cls} aria-hidden="true" />;
    case "view_employees":
    case "view_successful_payments":
      return <Users className={cls} aria-hidden="true" />;
    case "view_failed_payments":
    case "view_failure_reason":
      return <AlertTriangle className={cls} aria-hidden="true" />;
    case "view_held_employees":
      return <UserX className={cls} aria-hidden="true" />;
    case "validate_batch":
      return <ShieldCheck className={cls} aria-hidden="true" />;
    case "submit_for_approval":
      return <Send className={cls} aria-hidden="true" />;
    case "approve_batch":
      return <CheckCircle2 className={cls} aria-hidden="true" />;
    case "reject_batch":
      return <XCircle className={cls} aria-hidden="true" />;
    case "generate_bank_file":
      return <FileSpreadsheet className={cls} aria-hidden="true" />;
    case "download_bank_file":
      return <Download className={cls} aria-hidden="true" />;
    case "export_report":
      return <FileDown className={cls} aria-hidden="true" />;
    case "download_reconciliation_report":
      return <FileCheck className={cls} aria-hidden="true" />;
    case "submit_to_bank":
      return <Send className={cls} aria-hidden="true" />;
    case "track_status":
      return <Activity className={cls} aria-hidden="true" />;
    case "view_transactions":
      return <ClipboardList className={cls} aria-hidden="true" />;
    case "reconcile_payment":
      return <CheckCircle2 className={cls} aria-hidden="true" />;
    case "retry_failed":
      return <RotateCcw className={cls} aria-hidden="true" />;
    case "release_held":
      return <Unlock className={cls} aria-hidden="true" />;
    case "view_approval_history":
    case "view_audit_log":
      return <History className={cls} aria-hidden="true" />;
    case "cancel_batch":
      return <Ban className={cls} aria-hidden="true" />;
    case "delete_draft":
      return <Trash2 className={cls} aria-hidden="true" />;
  }
}

export function PaymentBatchActionMenu({
  batch,
  actions,
  busyActionId,
  onAction,
}: PaymentBatchActionMenuProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 639px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (actions.length === 0) {
    return null;
  }

  const groups = groupPaymentActions(actions);
  const hasBusy = Boolean(busyActionId);

  const triggerButton = (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={hasBusy}
      aria-label={`Actions for batch ${batch.batchNumber}`}
      data-testid={`batch-actions-trigger-${batch.id}`}
      onClick={(e) => {
        e.stopPropagation();
        if (isMobile) {
          setMobileSheetOpen(true);
        }
      }}
      className="h-8 w-8 p-0 rounded-lg border border-border/60 bg-background/50 text-foreground/80 hover:text-foreground hover:bg-accent hover:border-border shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-primary"
    >
      {hasBusy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <div className="inline-flex justify-end" onClick={(e) => e.stopPropagation()}>
        {triggerButton}
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto px-4 pb-6 pt-5">
            <SheetHeader className="text-left pb-3 border-b border-border/60">
              <SheetTitle className="text-sm font-semibold font-mono">{batch.batchNumber}</SheetTitle>
              <SheetDescription className="text-xs">
                {batch.periodName} · {batch.paymentMode} · {batch.payableAmountFormatted}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-3 space-y-3">
              {groups.map((bucket, idx) => (
                <div key={bucket.group} className="space-y-1">
                  {idx > 0 && <div className="my-2 h-px bg-border/60" />}
                  <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {GROUP_TITLES[bucket.group]}
                  </div>
                  {bucket.items.map((item) => {
                    const isSpinning = busyActionId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={Boolean(item.disabled || hasBusy)}
                        onClick={() => {
                          setMobileSheetOpen(false);
                          onAction(item.id, batch);
                        }}
                        className={cn(
                          "w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center gap-3 text-left text-[13px] transition-colors",
                          item.destructive
                            ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                            : "text-foreground hover:bg-accent",
                          (item.disabled || hasBusy) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {renderActionIcon(item.id, isSpinning)}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{item.label}</div>
                          {item.disabled && item.disabledReason && (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {item.disabledReason}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="inline-flex justify-end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          collisionPadding={12}
          onClick={(e) => e.stopPropagation()}
          className="w-64 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-1.5 shadow-lg max-h-[75vh] overflow-y-auto"
        >
          {groups.map((bucket, idx) => (
            <React.Fragment key={bucket.group}>
              {idx > 0 && <DropdownMenuSeparator className="my-1 bg-border/60" />}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {GROUP_TITLES[bucket.group]}
                </DropdownMenuLabel>
                {bucket.items.map((item) => {
                  const isSpinning = busyActionId === item.id;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      disabled={Boolean(item.disabled || hasBusy)}
                      title={item.disabledReason}
                      onSelect={() => onAction(item.id, batch)}
                      className={cn(
                        "min-h-[36px] px-2.5 py-1.5 rounded-lg text-[13px] cursor-pointer gap-2.5 focus:bg-accent",
                        item.destructive &&
                          "text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 focus:bg-rose-500/10"
                      )}
                    >
                      {renderActionIcon(item.id, isSpinning)}
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{item.label}</div>
                        {item.disabled && item.disabledReason && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {item.disabledReason}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
