import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Manager } from "../types";
import {
  createManager,
  deleteManager,
  fetchManagerById,
  fetchManagers,
  importManagers,
  updateManager,
} from "../managersThunk";
import type { FetchManagersParams, ManagerApiPayload } from "../managersTypes";
import { clearSelectedManager } from "../managersSlice";

export function useManagers() {
  const dispatch = useAppDispatch();
  const {
    managers,
    loading,
    submitting,
    error,
    total,
    page,
    limit,
    totalPages,
    selectedManager,
    selectedManagerLoading,
    selectedManagerError,
    selectedManagerForm,
  } = useAppSelector((state) => state.managers);

  const fetchManagersList = useCallback(
    (params?: FetchManagersParams) => dispatch(fetchManagers(params)),
    [dispatch],
  );

  const fetchManagerByIdAction = useCallback(
    (id: string) => dispatch(fetchManagerById(id)),
    [dispatch],
  );

  const createManagerAction = useCallback(
    (payload: ManagerApiPayload) => dispatch(createManager(payload)),
    [dispatch],
  );

  const updateManagerAction = useCallback(
    (id: string, payload: ManagerApiPayload) => dispatch(updateManager({ id, payload })),
    [dispatch],
  );

  const deleteManagerAction = useCallback(
    (id: string) => dispatch(deleteManager(id)),
    [dispatch],
  );

  const importManagersAction = useCallback(
    (imported: Manager[]) => dispatch(importManagers(imported)),
    [dispatch],
  );

  const clearSelectedManagerAction = useCallback(
    () => dispatch(clearSelectedManager()),
    [dispatch],
  );

  return {
    managers,
    loading,
    submitting,
    error,
    total,
    page,
    limit,
    totalPages,
    selectedManager,
    selectedManagerLoading,
    selectedManagerError,
    selectedManagerForm,
    fetchManagers: fetchManagersList,
    fetchManagerById: fetchManagerByIdAction,
    createManager: createManagerAction,
    updateManager: updateManagerAction,
    deleteManager: deleteManagerAction,
    bulkDelete: async (_ids: string[]) => undefined,
    bulkSetStatus: async (_ids: string[], _status: Manager["status"]) => undefined,
    importManagers: importManagersAction,
    clearSelectedManager: clearSelectedManagerAction,
  };
}
