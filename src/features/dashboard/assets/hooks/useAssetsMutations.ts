import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";
import { formatApiError } from "../utils";

/**
 * All asset-related mutations in one place, each invalidating the shared
 * "assets" and "assets-analytics" queries on success.
 */
export function useAssetMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
  };

  const onError = (fallback: string) => (err: any) => {
    toast.error(formatApiError(err, fallback));
  };

  const uploadImage = async (file: File | null): Promise<string> => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("assets/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.image_url;
  };

  const createMutation = useMutation({
    mutationFn: (newAsset: any) => api.post("assets", newAsset),
    onSuccess: () => {
      invalidateAll();
      toast.success("Asset created successfully!");
    },
    onError: onError("Failed to create asset"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.put(`assets/${id}`, payload),
    onSuccess: () => {
      invalidateAll();
      toast.success("Asset specifications updated successfully.");
    },
    onError: onError("Failed to update asset specifications"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`assets/${id}`),
    onSuccess: () => {
      invalidateAll();
      toast.error("Asset record deleted successfully.");
    },
    onError: onError("Failed to delete asset"),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/assign`, payload),
    onSuccess: () => {
      invalidateAll();
      toast.success("Asset assigned successfully!");
    },
    onError: onError("Failed to assign asset"),
  });

  const transferMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/transfer`, payload),
    onSuccess: () => {
      invalidateAll();
      toast.success("Transferred asset successfully!");
    },
    onError: onError("Failed to transfer asset"),
  });

  const returnMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/return`),
    onSuccess: () => {
      invalidateAll();
      toast.success("Asset returned and checked back in.");
    },
    onError: onError("Failed to return asset"),
  });

  const lostMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/lost`),
    onSuccess: () => {
      invalidateAll();
      toast.warning("Asset has been flagged as lost.");
    },
    onError: onError("Failed to mark asset as lost"),
  });

  const retiredMutation = useMutation({
    mutationFn: (id: string) => api.post(`assets/${id}/retired`),
    onSuccess: () => {
      invalidateAll();
      toast.info("Asset decommissioned and retired.");
    },
    onError: onError("Failed to retire asset"),
  });

  const repairMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => api.post(`assets/${id}/maintenance`, payload),
    onSuccess: () => {
      invalidateAll();
      toast.info("Asset status set to Under Repair");
    },
    onError: onError("Failed to send asset for repair"),
  });

  /** Appends a note to an asset — used by the QR "Regenerate" actions. */
  const appendNoteMutation = useMutation({
    mutationFn: ({ id, existingNotes, note }: { id: string; existingNotes: string; note: string }) =>
      api.put(`assets/${id}`, { notes: `${existingNotes || ""}\n${note}` }),
    onSuccess: () => {
      invalidateAll();
      toast.success("Regenerated QR Code successfully.");
    },
    onError: onError("Failed to regenerate QR code"),
  });

  return {
    uploadImage,
    createMutation,
    editMutation,
    deleteMutation,
    assignMutation,
    transferMutation,
    returnMutation,
    lostMutation,
    retiredMutation,
    repairMutation,
    appendNoteMutation,
  };
}
