import { Clock, Moon, Sun, Users, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Shift } from "@/services/attendance/types";
import { WEEK_DAYS } from "@/lib/datetime";
import { formatHHmmTo12h } from "@/lib/datetime";

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onAssign: (shift: Shift) => void;
  onDelete: (shift: Shift) => void;
  canEdit: boolean;
}

export function ShiftCard({ shift, onEdit, onAssign, onDelete, canEdit }: ShiftCardProps) {
  const durationMinutes = shift.duration_minutes;
  const workHours = shift.work_hours;
  const isOvernight = shift.is_overnight;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 text-left">
      <div>
        {/* Header: Name, Code & Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-foreground text-base">{shift.name}</span>
              <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase">
                {shift.code}
              </Badge>
              {shift.is_default && (
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                  Default
                </Badge>
              )}
            </div>
            {shift.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{shift.description}</p>
            )}
          </div>
          <Badge
            variant={shift.is_active ? "secondary" : "outline"}
            className={`text-[10px] ${shift.is_active ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""}`}
          >
            {shift.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Timing Strip */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 border border-border/50 p-3">
          <div className="flex items-center gap-2.5">
            {shift.night_shift ? (
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/15 text-purple-400">
                <Moon className="h-4 w-4" />
              </div>
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
                <Sun className="h-4 w-4" />
              </div>
            )}
            <div>
              <div className="font-mono text-sm font-semibold tracking-tight text-foreground">
                {formatHHmmTo12h(shift.start_time)} – {formatHHmmTo12h(shift.end_time)}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {isOvernight ? "Overnight • " : ""}
                {workHours ? `${workHours}h total` : "—"}
                {durationMinutes && ` (${durationMinutes}min)`}
              </span>
            </div>
          </div>

          {shift.night_shift && shift.night_premium_percent > 0 && (
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
              +{shift.night_premium_percent}% Night Diff
            </Badge>
          )}
        </div>

        {/* Rules Pills */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
            <Clock className="h-3 w-3 text-amber-500" />
            {shift.grace_period_minutes}m grace
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
            <Clock className="h-3 w-3 text-sky-500" />
            {shift.break_duration_minutes}m break
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1">
            <Users className="h-3 w-3 text-emerald-500" />
            {shift.assigned_employees_count || 0} assigned
          </span>
        </div>

        {/* Working Days */}
        <div className="mt-3 flex items-center gap-1">
          {WEEK_DAYS.map((d) => {
            const isWorkDay = shift.working_days.includes(d);
            return (
              <span
                key={d}
                className={`grid h-6 w-6 place-items-center rounded text-[9px] font-semibold transition-colors ${
                  isWorkDay
                    ? "bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30"
                    : "bg-muted/30 text-muted-foreground/40"
                }`}
              >
                {d[0]}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssign(shift)}
            className="h-8 gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/40"
          >
            <Users className="h-3.5 w-3.5" />
            Assign Team
          </Button>
        )}

        <div className="flex items-center gap-1">
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(shift)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Edit Shift"
              aria-label="Edit shift"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(shift)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              title="Delete Shift"
              aria-label="Delete shift"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}