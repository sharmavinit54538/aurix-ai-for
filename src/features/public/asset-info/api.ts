const API_ORIGIN = import.meta.env.VITE_API_URL || "";

export interface PublicAssetInfo {
  tag: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serial: string;
  status: string;
  assignedTo?: string;
  department?: string;
  location?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  vendor?: string;
  warrantyUntil?: string;
  notes?: string;
}

export async function fetchPublicAssetInfo(id: string): Promise<PublicAssetInfo> {
  const res = await fetch(`${API_ORIGIN}/api/v1/assets/public/${encodeURIComponent(id)}`, {
    method: "GET",
    credentials: "omit",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.data ?? json;
}