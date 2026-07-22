import { useState } from "react";
import { AssetFormValues, DEFAULT_ASSET_FORM_VALUES } from "../components/AssetsFormFields";
import type { Asset } from "@/lib/hrms/types";

export function useAssetForm() {
  const [values, setValues] = useState<AssetFormValues>(DEFAULT_ASSET_FORM_VALUES);

  const setField = <K extends keyof AssetFormValues>(field: K, value: AssetFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => setValues(DEFAULT_ASSET_FORM_VALUES);

  const loadFromAsset = (asset: Asset) => {
    setValues({
      assetName: asset.name,
      assetCategory: asset.category,
      brand: asset.brand || "",
      model: asset.model || "",
      serial: asset.serial,
      purchaseDate: asset.purchaseDate,
      purchaseCost: asset.purchaseCost?.toString() || "",
      vendor: asset.vendor,
      warrantyUntil: asset.warrantyUntil,
      location: asset.location || "",
      notes: asset.notes || "",
    });
  };

  return { values, setField, reset, loadFromAsset };
}
