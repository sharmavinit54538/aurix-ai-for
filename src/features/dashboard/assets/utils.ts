import type { Asset, AssetCategory } from "@/lib/hrms/types";
import { ASSET_TAG_PREFIX, REFERENCE_NOW, THIRTY_DAYS_MS } from "./constants";

/** Turns an API/axios-style error into a readable toast message. */
export function formatApiError(err: any, fallback: string): string {
  if (err?.data?.detail && Array.isArray(err.data.detail)) {
    return `Validation error: ${err.data.detail
      .map((d: any) => `${d.loc.slice(1).join(".")} : ${d.msg}`)
      .join(", ")}`;
  }
  if (err?.data?.errors && Array.isArray(err.data.errors)) {
    return err.data.errors.map((e: any) => e.message).join(", ");
  }
  return err?.message || fallback;
}

/** Generates a human-friendly asset tag, e.g. LAP-4213 */
export function generateAssetTag(category: AssetCategory): string {
  const prefix = ASSET_TAG_PREFIX[category] || "AST";
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function isWarrantyExpired(warrantyUntil?: string | null): boolean {
  if (!warrantyUntil) return false;
  return new Date(warrantyUntil).getTime() < REFERENCE_NOW;
}

export function isWarrantyExpiringSoon(warrantyUntil?: string | null): boolean {
  if (!warrantyUntil) return false;
  const t = new Date(warrantyUntil).getTime();
  return t >= REFERENCE_NOW && t <= REFERENCE_NOW + THIRTY_DAYS_MS;
}

/** Builds and downloads a CSV export of the given assets. */
export function exportAssetsToCsv(assets: Asset[]) {
  const headers = [
    "Asset Tag",
    "Asset Name",
    "Category",
    "Brand",
    "Model",
    "Serial",
    "Purchase Cost",
    "Purchase Date",
    "Status",
    "Assigned Employee",
  ];
  const rows = assets.map((a) =>
    [
      a.tag,
      a.name,
      a.category,
      a.brand || "",
      a.model || "",
      a.serial,
      (a.purchaseCost || 0).toString(),
      a.purchaseDate,
      a.status,
      a.assignedTo || "Unassigned",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `Aurix_Assets_Inventory_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function fullName(emp: { first_name: string; last_name: string }): string {
  return `${emp.first_name} ${emp.last_name}`;
}

/**
 * The URL a QR sticker should encode so that scanning it opens a public,
 * read-only info page for this asset — no dashboard login required.
 * Uses the asset's internal id (not its tag) so scanned links aren't
 * sequentially guessable — LAP-7994, LAP-7995... would be trivial to
 * enumerate if the tag were used instead.
 * Points at the /asset-info/$id route, which fetches from a public
 * (unauthenticated) API endpoint. See src/features/public/asset-info/.
 */
export function buildAssetScanUrl(asset: { id: string; tag: string }): string {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return `${base}/asset-info/${encodeURIComponent(asset.id)}`;
}

/**
 * Sums the repair/maintenance cost for an asset, tolerating a few API shape
 * variants so a naming mismatch doesn't silently render as $0:
 *  - a precomputed total on the asset itself (totalRepairCost / total_repair_cost)
 *  - a history array under maintenanceHistory OR maintenance_history
 *  - a per-record cost field named cost, repair_cost, or amount
 * If you confirm the actual API shape, this can be simplified back down to
 * a plain `.reduce((sum, r) => sum + r.cost, 0)`.
 */
export function getAssetRepairCost(asset: any): number {
  if (asset?.totalRepairCost != null) return Number(asset.totalRepairCost) || 0;
  if (asset?.total_repair_cost != null) return Number(asset.total_repair_cost) || 0;

  const history = asset?.maintenanceHistory ?? asset?.maintenance_history ?? [];
  if (!Array.isArray(history)) return 0;

  return history.reduce((sum: number, record: any) => {
    const cost = record?.cost ?? record?.repair_cost ?? record?.amount ?? 0;
    return sum + (Number(cost) || 0);
  }, 0);
}
