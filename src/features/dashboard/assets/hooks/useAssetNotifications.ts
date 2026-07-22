import { useMemo } from "react";
import type { Asset } from "@/lib/hrms/types";
import { REFERENCE_NOW, THIRTY_DAYS_MS } from "../constants";

export interface AssetAlert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  asset?: Asset;
}

export function useAssetNotifications(assets: Asset[]): AssetAlert[] {
  return useMemo(() => {
    const alerts: AssetAlert[] = [];
    const thirtyDaysLimit = REFERENCE_NOW + THIRTY_DAYS_MS;

    assets.forEach((a) => {
      if (a.warrantyUntil) {
        const wTime = new Date(a.warrantyUntil).getTime();
        if (wTime > 0 && wTime < REFERENCE_NOW) {
          alerts.push({
            id: `war_exp_${a.id}`,
            type: "error",
            message: `Warranty expired for ${a.tag} (${a.name}) on ${a.warrantyUntil}.`,
            asset: a,
          });
        } else if (wTime >= REFERENCE_NOW && wTime <= thirtyDaysLimit) {
          alerts.push({
            id: `war_soon_${a.id}`,
            type: "warning",
            message: `Warranty expiring soon for ${a.tag} on ${a.warrantyUntil}.`,
            asset: a,
          });
        }
      }
      if (a.status === "lost") {
        alerts.push({
          id: `lost_${a.id}`,
          type: "error",
          message: `Audit flagged: Asset ${a.tag} is lost. Pending replacement.`,
          asset: a,
        });
      }
      if (a.status === "under-repair") {
        alerts.push({
          id: `rep_${a.id}`,
          type: "info",
          message: `${a.tag} is currently in repair at vendor.`,
          asset: a,
        });
      }
    });

    return alerts;
  }, [assets]);
}
