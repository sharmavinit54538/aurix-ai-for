import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import type { ExitCase } from "../../types";

interface OverviewTabProps {
  detailCase: ExitCase;
}

export function OverviewTab({ detailCase }: OverviewTabProps) {
  return (
    <TabsContent value="overview" className="space-y-5 mt-0">
      {/* Progress tracker */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span>Notice Period Progress</span>
          <span>{detailCase.remainingDays || 0} days remaining</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all bg-primary"
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  ((detailCase.noticeDays - (detailCase.remainingDays || 0)) /
                    detailCase.noticeDays) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Start: {detailCase.resignedAt}</span>
          <span>End: {detailCase.lastWorkingDay}</span>
        </div>
      </div>

      {/* Employee specifications */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Employee Profile
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Joining Date</span>
            <strong className="text-foreground mt-0.5 block">
              {detailCase.joiningDate || "—"}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">
              Designation Designation
            </span>
            <strong className="text-foreground mt-0.5 block">
              {detailCase.designation || detailCase.role}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Reporting Manager</span>
            <strong className="text-foreground mt-0.5 block">
              {detailCase.managerName || "—"}
            </strong>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[10px]">
              Statement Reason for leaving
            </span>
            <p className="text-foreground mt-0.5 leading-relaxed italic">
              "{detailCase.reason || "No reason specified."}"
            </p>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-2 text-left">
        <Label className="text-xs font-semibold text-muted-foreground">
          Resignation timeline logs
        </Label>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3.5">
          {(detailCase.timeline || []).length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No timelines logged for this exit.
            </p>
          ) : (
            (detailCase.timeline || []).map((tl, idx) => (
              <div
                key={tl.id}
                className={`flex gap-3 text-xs relative ${
                  idx < (detailCase.timeline || []).length - 1
                    ? "before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3"
                    : ""
                }`}
              >
                <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Check className="h-2 w-2" />
                </span>
                <div className="text-left">
                  <p className="font-bold text-foreground capitalize">{tl.event}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    By {tl.performedBy} on {new Date(tl.timestamp).toLocaleString()}
                  </p>
                  {tl.notes && (
                    <p className="text-[10px] text-foreground/80 mt-1">{tl.notes}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TabsContent>
  );
}
