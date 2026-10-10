import { useAurix } from "./aurix-store";
import { normalizeRole, type AppRole } from "./roles";

export function useCurrentRole(): AppRole | null {
  const ws = useAurix();
  return normalizeRole(ws.user?.role);
}
