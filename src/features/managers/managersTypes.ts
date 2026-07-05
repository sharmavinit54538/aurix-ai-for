import type { Manager } from "./types";

export type { Manager } from "./types";

export interface ManagersState {
  managers: Manager[];
  loading: boolean;
  error: string | null;
}
