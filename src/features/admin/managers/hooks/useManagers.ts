import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Manager } from "../types";
import {
  bulkDeleteManagers,
  bulkSetManagerStatus,
  createManager,
  deleteManager,
  fetchManagers,
  importManagers,
  updateManager,
} from "../managersThunk";

export function useManagers() {
  const dispatch = useAppDispatch();
  const { managers, loading, error } = useAppSelector((state) => state.managers);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  return {
    managers,
    loading,
    error,
    createManager: (manager: Manager) => dispatch(createManager(manager)),
    updateManager: (manager: Manager) => dispatch(updateManager(manager)),
    deleteManager: (id: string) => dispatch(deleteManager(id)),
    bulkDelete: (ids: string[]) => dispatch(bulkDeleteManagers(ids)),
    bulkSetStatus: (ids: string[], status: Manager["status"]) =>
      dispatch(bulkSetManagerStatus({ ids, status })),
    importManagers: (imported: Manager[]) => dispatch(importManagers(imported)),
  };
}
