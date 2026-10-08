import { toast } from "sonner";
import type { Asset, AssetCategory } from "../types";

// Collision-resistant asset tag generator (Prefix + timestamp suffix + 4-digit random integer)
export const generateAssetTag = (category: AssetCategory): string => {
  const tagPrefix = {
    laptop: "LAP",
    desktop: "DKT",
    monitor: "MON",
    phone: "PHN",
    accessory: "ACC",
    vehicle: "VEH",
    other: "AST",
  }[category] || "AST";
  const timePart = Date.now().toString().slice(-5);
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `${tagPrefix}-${timePart}${randPart}`;
};

export const exportAssetsCsv = (assets: Asset[]) => {
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
  const rows = assets.map(a =>
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
      .map(v => `"${v.replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `OFC360_Assets_Inventory_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("Inventory exported as CSV");
};

export const showApiError = (err: any, fallback: string) => {
  let msg = err?.message || fallback;
  if (err?.data && err.data.detail && Array.isArray(err.data.detail)) {
    const details = err.data.detail.map((d: any) => `${d.loc.slice(1).join(".")} : ${d.msg}`).join(", ");
    msg = `Validation error: ${details}`;
  } else if (err?.data && err.data.errors && Array.isArray(err.data.errors)) {
    msg = err.data.errors.map((e: any) => e.message).join(", ");
  }
  toast.error(msg);
};
