import React, { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAssetSettings, updateAssetSettings, isMissingApiError } from "../../api";
import type { AssetSettingsForm, AssetCategoryItem } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface AssetsSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const DEFAULT_ASSET_CATEGORIES: AssetCategoryItem[] = [
  {
    id: "cat_laptop",
    name: "Laptops & Notebooks",
    description: "Standard issue developer/office laptops",
    requiresSerialNumber: true,
    requiresWarrantyTracking: true,
  },
  {
    id: "cat_monitor",
    name: "External Displays",
    description: "24-inch and 27-inch desktop monitors",
    requiresSerialNumber: true,
    requiresWarrantyTracking: true,
  },
  {
    id: "cat_phone",
    name: "Mobile Devices & Tablets",
    description: "Company testing devices & SIM cards",
    requiresSerialNumber: true,
    requiresWarrantyTracking: true,
  },
  {
    id: "cat_periph",
    name: "Peripherals & Docking",
    description: "Keyboards, mice, headsets, adapters",
    requiresSerialNumber: false,
    requiresWarrantyTracking: false,
  },
  {
    id: "cat_furniture",
    name: "Ergonomic Chairs & Desks",
    description: "Office furniture & ergonomic equipment",
    requiresSerialNumber: false,
    requiresWarrantyTracking: false,
  },
];

export function AssetsSection({ canEdit, onDirtyChange }: AssetsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [missingNotice, setMissingNotice] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<AssetSettingsForm | null>(null);
  const [formData, setFormData] = useState<AssetSettingsForm>({
    categories: [],
    requireEmployeeAcknowledgment: true,
    mandatoryClearanceOnExit: true,
    notifyWarrantyExpiryDays: 30,
    notifyAssetReturnDays: 7,
  });

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMissingNotice(null);
    try {
      const data = await fetchAssetSettings();
      const combined = {
        ...data,
        categories: data.categories || [],
      };
      setInitialData(combined);
      setFormData(combined);
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        setInitialData(formData);
      } else {
        const msg = (err as { message?: string })?.message || "Failed to load asset settings.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCategory = () => {
    const newCat: AssetCategoryItem = {
      id: `cat_${Date.now()}`,
      name: "New Equipment Category",
      description: "Company hardware inventory",
      requiresSerialNumber: true,
      requiresWarrantyTracking: false,
    };
    setFormData({ ...formData, categories: [...formData.categories, newCat] });
  };

  const handleUpdateCategory = <K extends keyof AssetCategoryItem>(
    index: number,
    key: K,
    val: AssetCategoryItem[K],
  ) => {
    const updated = [...formData.categories];
    updated[index] = { ...updated[index], [key]: val };
    setFormData({ ...formData, categories: updated });
  };

  const handleDeleteCategory = (index: number) => {
    const updated = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: updated });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await updateAssetSettings(formData);
      setInitialData(formData);
      toast.success("Asset configuration saved successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        toast.error("Asset configuration API is not implemented on backend.");
      } else {
        const msg = (err as { message?: string })?.message || "Failed to update asset settings.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Categories Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Asset Categories
            </h3>
            <p className="text-xs text-muted-foreground">
              Classification schema for company-owned hardware and inventory.
            </p>
          </div>
          {canEdit && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddCategory}
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {formData.categories.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No asset categories configured. Click "Add Category" to create one.
            </div>
          ) : (
            formData.categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:grid-cols-12 sm:items-center"
              >
                <div className="space-y-1 sm:col-span-5">
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Category Name
                  </Label>
                  <Input
                    value={cat.name}
                    onChange={(e) => handleUpdateCategory(idx, "name", e.target.value)}
                    disabled={!canEdit}
                    className="h-8 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-4">
                  <Label className="text-[11px] font-medium text-muted-foreground">Description</Label>
                  <Input
                    value={cat.description || ""}
                    onChange={(e) => handleUpdateCategory(idx, "description", e.target.value)}
                    disabled={!canEdit}
                    placeholder="Category purpose"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-medium text-muted-foreground">
                      Require Serial
                    </Label>
                    <Switch
                      checked={cat.requiresSerialNumber}
                      onCheckedChange={(c) => handleUpdateCategory(idx, "requiresSerialNumber", c)}
                      disabled={!canEdit}
                    />
                  </div>
                </div>

                <div className="flex justify-end sm:col-span-1">
                  {canEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assignment & Return Rules Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Allocation & Return Governance
          </h3>
          <p className="text-xs text-muted-foreground">
            Compliance policies for device custody and exit clearance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Employee Custody Acknowledgment
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Require digital signature/consent when hardware is assigned.
              </p>
            </div>
            <Switch
              checked={formData.requireEmployeeAcknowledgment}
              onCheckedChange={(c) =>
                setFormData({ ...formData, requireEmployeeAcknowledgment: c })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Mandatory Exit Handover Clearance
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Block final settlement until all company assets are returned.
              </p>
            </div>
            <Switch
              checked={formData.mandatoryClearanceOnExit}
              onCheckedChange={(c) => setFormData({ ...formData, mandatoryClearanceOnExit: c })}
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="warranty-alert-days" className="text-xs font-medium">
              Warranty Expiry Alert (Days Prior)
            </Label>
            <Input
              id="warranty-alert-days"
              type="number"
              min={1}
              value={formData.notifyWarrantyExpiryDays}
              onChange={(e) =>
                setFormData({ ...formData, notifyWarrantyExpiryDays: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="return-reminder-days" className="text-xs font-medium">
              Return Reminder Notice (Days Prior to Exit)
            </Label>
            <Input
              id="return-reminder-days"
              type="number"
              min={1}
              value={formData.notifyAssetReturnDays}
              onChange={(e) =>
                setFormData({ ...formData, notifyAssetReturnDays: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initialData && setFormData(initialData)}
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Save Asset Settings"}
          </Button>
        </div>
      )}

      <UnsavedChangesBanner
        isDirty={isDirty}
        submitting={submitting}
        onReset={() => initialData && setFormData(initialData)}
        onSave={() => handleSave()}
      />
    </form>
  );
}
