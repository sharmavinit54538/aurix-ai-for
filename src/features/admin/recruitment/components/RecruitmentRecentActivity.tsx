import { Sparkles } from "lucide-react";
import { CandidateAvatar, fmtDate } from "./Bits";
import type { RecentActivityItem } from "../utils/dashboard";

interface RecruitmentRecentActivityProps {
  items: RecentActivityItem[];
}

export function RecruitmentRecentActivity({ items }: RecruitmentRecentActivityProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-display text-sm font-semibold">Recent Activity</div>
          <div className="text-xs text-muted-foreground">Latest pipeline events</div>
        </div>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <CandidateAvatar name={item.who} size={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">
                <span className="font-medium">{item.who}</span> — {item.title}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {item.jobTitle} · {fmtDate(item.at)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
