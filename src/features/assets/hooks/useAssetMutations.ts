import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";
import { showApiError } from "../utils/assetUtils";
import type { Asset } from "../types";

export function useAssetMutations(
  detailAsset: Asset | null,
  setDetailAsset: React.Dispatch<React.SetStateAction<Asset | null>>,
  targetAsset: Asset | null,
  closeModals: {
    setAddOpen: (open: boolean) => void;
    setEditOpen: (open: boolean) => void;
    setAssignOpen: (open: boolean) => void;
    setTransferOpen: (open: boolean) => void;
    setRepairOpen: (open: boolean) => void;
    setDeleteOpen: (open: boolean) => void;
  }
) {
  const queryClient = useQueryClient();

  const invalidateAssets = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
  };

  const createMutation = useMutation({
    mutationFn: (newAsset: any) => api.post("assets", newAsset),
    onSuccess: () => {
      invalidateAssets();
      toast.success("Asset created successfully!");
      closeModals.setAddOpen(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.put(`assets/${id}`, payload),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.success("Asset specifications updated successfully.");
      closeModals.setEditOpen(false);
      if (detailAsset?.id === res.data.id) {
        setDetailAsset(res.data);
      }
    },
    onError: (err: any) => {
      showApiError(err, "Failed to update asset specifications");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`assets/${id}`),
    onSuccess: () => {
      invalidateAssets();
      toast.error("Asset record deleted successfully.");
      closeModals.setDeleteOpen(false);
      if (detailAsset?.id === targetAsset?.id) setDetailAsset(null);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to delete asset");
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/assign`, payload),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.success(`Asset assigned successfully!`);
      closeModals.setAssignOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to assign asset");
    },
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/return`),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.success(`Asset returned and checked back in.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to return asset");
    },
  });

  const transferMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/transfer`, payload),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.success(`Transferred asset successfully!`);
      closeModals.setTransferOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to transfer asset");
    },
  });

  const lostMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/lost`),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.warning(`Asset has been flagged as lost.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to mark asset as lost");
    },
  });

  const retiredMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/retired`),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.info(`Asset decommissioned and retired.`);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to retire asset");
    },
  });

  const repairMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/maintenance`, payload),
    onSuccess: (res: any) => {
      invalidateAssets();
      toast.info(`Asset status set to Under Repair`);
      closeModals.setRepairOpen(false);
      if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
    },
    onError: (err: any) => {
      showApiError(err, "Failed to send asset for repair");
    },
  });

  return {
    createMutation,
    editMutation,
    deleteMutation,
    assignMutation,
    returnMutation,
    transferMutation,
    lostMutation,
    retiredMutation,
    repairMutation,
  };
}
