import type { ExitCase } from "../types";
import type { useExitModalForms } from "./useExitModalForms";
import { useResignationActions } from "./actions/useResignationActions";
import { useClearanceActions } from "./actions/useClearanceActions";
import { useSettlementActions } from "./actions/useSettlementActions";

import type { Workspace } from "@/lib/aurix-store";

interface UseExitActionsProps {
  saveExit: (caseData: ExitCase) => Promise<void> | void;
  allAssets: any[];
  forms: ReturnType<typeof useExitModalForms>;
  authWs: Workspace;
}

export function useExitActions({ saveExit, allAssets, forms, authWs }: UseExitActionsProps) {
  const resignation = useResignationActions({ saveExit, allAssets, forms, authWs });
  const clearance = useClearanceActions({ saveExit, forms, authWs });
  const settlement = useSettlementActions({ saveExit, forms, authWs });

  return {
    ...resignation,
    ...clearance,
    ...settlement,
  };
}
