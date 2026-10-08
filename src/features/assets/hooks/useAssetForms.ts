import { useState } from "react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { generateAssetTag, showApiError } from "../utils/assetUtils";
import { useAssetMutations } from "./useAssetMutations";
import type { Asset, AssetCategory } from "../types";

export function useAssetForms(
  assets: Asset[],
  detailAsset: Asset | null,
  setDetailAsset: React.Dispatch<React.SetStateAction<Asset | null>>
) {
  const authWs = useAurix();

  // Dialog open states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [repairOpen, setRepairOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);

  // Targets
  const [targetAsset, setTargetAsset] = useState<Asset | null>(null);
  const [scannedAssetTag, setScannedAssetTag] = useState("");

  // Mutations instance
  const mutations = useAssetMutations(detailAsset, setDetailAsset, targetAsset, {
    setAddOpen,
    setEditOpen,
    setAssignOpen,
    setTransferOpen,
    setRepairOpen,
    setDeleteOpen,
  });

  // Add/Edit Form State
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState<AssetCategory>("laptop");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [purchaseCost, setPurchaseCost] = useState("");
  const [vendor, setVendor] = useState("");
  const [warrantyUntil, setWarrantyUntil] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Assignment Form State
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignReturnDate, setAssignReturnDate] = useState("");
  const [assignNotes, setAssignNotes] = useState("");

  // Transfer Form State
  const [transferEmpId, setTransferEmpId] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  // Repair Form State
  const [repairVendor, setRepairVendor] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [repairNotes, setRepairNotes] = useState("");

  // 1. Create Asset Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !serial || !brand) {
      toast.error("Please fill in Asset Name, Brand, and Serial Number.");
      return;
    }

    const costNum = purchaseCost ? parseFloat(purchaseCost) : 0;
    const basePayload = {
      name: assetName,
      category: assetCategory,
      serial: serial,
      vendor: vendor || "Unknown Vendor",
      purchase_date: purchaseDate,
      warranty_until: warrantyUntil ? warrantyUntil : null,
      brand: brand,
      model: model,
      purchase_cost: costNum,
      location: location || "HQ IT Desk",
      notes: notes,
    };

    const maxAttempts = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const assetTag = generateAssetTag(assetCategory);
      try {
        await mutations.createMutation.mutateAsync({
          ...basePayload,
          tag: assetTag,
        });
        // Reset form on success
        setAssetName("");
        setBrand("");
        setModel("");
        setSerial("");
        setPurchaseCost("");
        setVendor("");
        setWarrantyUntil("");
        setNotes("");
        setLocation("");
        return;
      } catch (err: any) {
        lastError = err;
        const errDetail = (err?.message || err?.data?.detail || JSON.stringify(err?.data || "")).toLowerCase();
        const isCollision =
          errDetail.includes("tag already exists") ||
          errDetail.includes("asset tag") ||
          (errDetail.includes("tag") && errDetail.includes("already exists")) ||
          (errDetail.includes("tag") && errDetail.includes("exists")) ||
          errDetail.includes("duplicate");

        if (isCollision && attempt < maxAttempts) {
          continue;
        }
        break;
      }
    }

    const errDetail = (lastError?.message || lastError?.data?.detail || JSON.stringify(lastError?.data || "")).toLowerCase();
    if (
      errDetail.includes("tag already exists") ||
      errDetail.includes("asset tag") ||
      (errDetail.includes("tag") && errDetail.includes("exists"))
    ) {
      toast.error("Failed to generate a unique asset tag after 3 attempts. Please try again.");
    } else {
      showApiError(lastError, "Failed to create asset");
    }
  };

  // 2. Edit Asset
  const handleEditOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setAssetName(asset.name);
    setAssetCategory(asset.category);
    setBrand(asset.brand || "");
    setModel(asset.model || "");
    setSerial(asset.serial);
    setPurchaseDate(asset.purchaseDate);
    setPurchaseCost(asset.purchaseCost?.toString() || "");
    setVendor(asset.vendor);
    setWarrantyUntil(asset.warrantyUntil);
    setLocation(asset.location || "");
    setNotes(asset.notes || "");
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset) return;

    mutations.editMutation.mutate({
      id: targetAsset.id,
      payload: {
        name: assetName,
        category: assetCategory,
        brand,
        model,
        serial,
        purchase_date: purchaseDate,
        purchase_cost: parseFloat(purchaseCost) || 0,
        vendor,
        warranty_until: warrantyUntil,
        location,
        notes,
      },
    });
  };

  // 3. Delete Asset
  const handleDeleteSubmit = () => {
    if (!targetAsset) return;
    mutations.deleteMutation.mutate(targetAsset.id);
  };

  // 4. Assign Asset
  const handleAssignOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setAssignNotes("");
    setAssignReturnDate("");
    if (authWs.employees.length > 0) {
      setAssignEmpId(authWs.employees[0].id);
    } else {
      setAssignEmpId("");
    }
    setAssignOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset || !assignEmpId) return;

    const emp = authWs.employees.find(x => x.id === assignEmpId || x.employeeId === assignEmpId);
    if (!emp) {
      toast.error("Please select a valid employee.");
      return;
    }

    mutations.assignMutation.mutate({
      id: targetAsset.id,
      payload: {
        employee_id: emp.id,
        employee_code: emp.employeeId,
        employee_name: emp.fullName,
        department: emp.department || "General Operations",
        expected_return_date: assignReturnDate || null,
        notes: assignNotes,
      },
    });
  };

  // 5. Return Asset
  const handleReturnAsset = (asset: Asset) => {
    mutations.returnMutation.mutate(asset.id);
  };

  // 6. Transfer Asset
  const handleTransferOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setTransferNotes("");
    const assignedId = (asset as any)?.assignedToId || (asset as any)?.employeeId || (asset as any)?.employee_id;
    const eligibleEmployees = authWs.employees.filter(emp =>
      assignedId
        ? emp.id !== assignedId && emp.employeeId !== assignedId
        : emp.fullName !== asset.assignedTo
    );
    if (eligibleEmployees.length > 0) {
      setTransferEmpId(eligibleEmployees[0].id);
    } else {
      setTransferEmpId("");
    }
    setTransferOpen(true);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset || !transferEmpId) return;

    const emp = authWs.employees.find(x => x.id === transferEmpId || x.employeeId === transferEmpId);
    if (!emp) {
      toast.error("Please select a valid employee to transfer to.");
      return;
    }

    mutations.transferMutation.mutate({
      id: targetAsset.id,
      payload: {
        employee_id: emp.id,
        employee_code: emp.employeeId,
        employee_name: emp.fullName,
        department: emp.department || "Operations",
        notes: transferNotes,
      },
    });
  };

  // 7. Mark Lost & Retired
  const handleMarkLost = (asset: Asset) => {
    mutations.lostMutation.mutate(asset.id);
  };

  const handleMarkRetired = (asset: Asset) => {
    mutations.retiredMutation.mutate(asset.id);
  };

  // 8. Maintenance / Repairs
  const handleRepairOpen = (asset: Asset) => {
    setTargetAsset(asset);
    setRepairVendor("");
    setRepairCost("");
    setRepairNotes("");
    setRepairOpen(true);
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAsset) return;

    mutations.repairMutation.mutate({
      id: targetAsset.id,
      payload: {
        vendor: repairVendor || "Authorized Service Partner",
        cost: repairCost ? parseFloat(repairCost) : 0,
        notes: repairNotes,
      },
    });
  };

  // 9. Scan simulation
  const handleScanSimulation = () => {
    if (!scannedAssetTag) return;
    const matched = assets.find(a => a.tag === scannedAssetTag || a.id === scannedAssetTag);
    if (matched) {
      setDetailAsset(matched);
      setScanOpen(false);
      toast.success(`Scanned QR tag: ${matched.tag}`);
    } else {
      toast.error("No asset matching this scanned tag found.");
    }
  };

  return {
    addOpen, setAddOpen,
    editOpen, setEditOpen,
    assignOpen, setAssignOpen,
    transferOpen, setTransferOpen,
    repairOpen, setRepairOpen,
    deleteOpen, setDeleteOpen,
    qrOpen, setQrOpen,
    scanOpen, setScanOpen,
    targetAsset, setTargetAsset,
    scannedAssetTag, setScannedAssetTag,
    assetName, setAssetName,
    assetCategory, setAssetCategory,
    brand, setBrand,
    model, setModel,
    serial, setSerial,
    purchaseDate, setPurchaseDate,
    purchaseCost, setPurchaseCost,
    vendor, setVendor,
    warrantyUntil, setWarrantyUntil,
    location, setLocation,
    notes, setNotes,
    assignEmpId, setAssignEmpId,
    assignReturnDate, setAssignReturnDate,
    assignNotes, setAssignNotes,
    transferEmpId, setTransferEmpId,
    transferNotes, setTransferNotes,
    repairVendor, setRepairVendor,
    repairCost, setRepairCost,
    repairNotes, setRepairNotes,
    mutations,
    handleAddSubmit,
    handleEditOpen,
    handleEditSubmit,
    handleDeleteSubmit,
    handleAssignOpen,
    handleAssignSubmit,
    handleReturnAsset,
    handleTransferOpen,
    handleTransferSubmit,
    handleMarkLost,
    handleMarkRetired,
    handleRepairOpen,
    handleRepairSubmit,
    handleScanSimulation,
  };
}
