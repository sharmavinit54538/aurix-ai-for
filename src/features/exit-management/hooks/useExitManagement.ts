import { useAurix } from "@/lib/aurix-store";
import { useExitData } from "./useExitData";
import { useExitFilters } from "./useExitFilters";
import { useExitModalForms } from "./useExitModalForms";
import { useExitActions } from "./useExitActions";

export function useExitManagement() {
  const authWs = useAurix();
  const data = useExitData();
  const filters = useExitFilters(data.exits);
  const forms = useExitModalForms();
  const actions = useExitActions({
    saveExit: data.saveExit,
    allAssets: data.allAssets,
    forms,
    authWs,
  });

  return {
    authWs,
    ...data,
    ...filters,
    ...forms,
    ...actions,
  };
}
