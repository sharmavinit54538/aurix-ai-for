import { useState, useEffect, useCallback } from "react";
import apiInstance from "@/api/apiInstance";
import { exitsApi } from "@/services/exitsApi";
import type { ExitCase } from "../types";
import { toast } from "sonner";

export function useExitData() {
  const [exits, setExits] = useState<ExitCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await exitsApi.getExits();
      setExits(res.items);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load exit records";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExits();
  }, [loadExits]);

  const saveExit = async (caseData: ExitCase) => {
    setExits((prev) => {
      const idx = prev.findIndex((x) => x.id === caseData.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = caseData;
        return copy;
      }
      return [caseData, ...prev];
    });
    try {
      if (caseData.id && !caseData.id.startsWith("ex-")) {
        await exitsApi.updateExit(caseData.id, caseData);
      } else {
        await exitsApi.createExit(caseData);
      }
    } catch {
      // Optimistic state is preserved
    }
  };

  const [allAssets, setAllAssets] = useState<any[]>([]);

  useEffect(() => {
    apiInstance
      .get("/assets", { params: { limit: 100 } })
      .then((res) => {
        const items = res.data?.data?.items || res.data?.items || [];
        setAllAssets(items);
      })
      .catch(() => {
        toast.error("Failed to load inventory assets for exit clearance");
        setAllAssets([]);
      });
  }, []);

  return { exits, setExits, loading, error, loadExits, saveExit, allAssets };
}
