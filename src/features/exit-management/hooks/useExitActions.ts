import type { ExitCase } from "../types";
import type { useExitModalForms } from "./useExitModalForms";
import { useResignationActions } from "./actions/useResignationActions";
import { useClearanceActions } from "./actions/useClearanceActions";
import { useSettlementActions } from "./actions/useSettlementActions";

interface UseExitActionsProps {
  saveExit: (caseData: ExitCase) => Promise<void> | void;
  allAssets: any[];
  forms: ReturnType<typeof useExitModalForms>;
  authWs: {
    user?: { fullName?: string };
    employees: Array<{
      id: string;
      fullName: string;
      employeeId: string;
      department?: string;
      designation?: string;
      joiningDate?: string;
      managerName?: string;
    }>;
  };
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
