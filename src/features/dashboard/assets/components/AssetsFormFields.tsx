import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "../constants";
import type { AssetCategory } from "@/lib/hrms/types";

export interface AssetFormValues {
  assetName: string;
  assetCategory: AssetCategory;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  purchaseCost: string;
  vendor: string;
  warrantyUntil: string;
  location: string;
  notes: string;
}

interface AssetFormFieldsProps {
  values: AssetFormValues;
  onChange: <K extends keyof AssetFormValues>(field: K, value: AssetFormValues[K]) => void;
}

/** The specification fields shared by the Add Asset and Edit Asset dialogs. */
export function AssetFormFields({ values, onChange }: AssetFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-1.5 lg:col-span-2">
        <Label className="text-xs font-semibold text-muted-foreground">Asset Name</Label>
        <Input
          value={values.assetName}
          onChange={(e) => onChange("assetName", e.target.value)}
          placeholder="e.g. MacBook Pro M3"
          className="bg-background/50 border-border"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
        <Select value={values.assetCategory} onValueChange={(val: AssetCategory) => onChange("assetCategory", val)}>
          <SelectTrigger className="bg-background/50 border-border text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Serial Number</Label>
        <Input
          value={values.serial}
          onChange={(e) => onChange("serial", e.target.value)}
          placeholder="C02XJ192"
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Brand</Label>
        <Input
          value={values.brand}
          onChange={(e) => onChange("brand", e.target.value)}
          placeholder="e.g. Apple"
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Model Specification</Label>
        <Input
          value={values.model}
          onChange={(e) => onChange("model", e.target.value)}
          placeholder="e.g. Pro 14 M3 16GB"
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Vendor</Label>
        <Input
          value={values.vendor}
          onChange={(e) => onChange("vendor", e.target.value)}
          placeholder="e.g. Apple Authorized Reseller"
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Purchase Cost ($)</Label>
        <Input
          type="number"
          value={values.purchaseCost}
          onChange={(e) => onChange("purchaseCost", e.target.value)}
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Purchase Date</Label>
        <Input
          type="date"
          value={values.purchaseDate}
          onChange={(e) => onChange("purchaseDate", e.target.value)}
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">Warranty Expiry</Label>
        <Input
          type="date"
          value={values.warrantyUntil}
          onChange={(e) => onChange("warrantyUntil", e.target.value)}
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label className="text-xs font-semibold text-muted-foreground">Current Location / Room</Label>
        <Input
          value={values.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="e.g. Bangalore Floor 3 Store Room"
          className="bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label className="text-xs font-semibold text-muted-foreground">Description Notes</Label>
        <Textarea
          value={values.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Condition, initial checks, setup requirements..."
          className="min-h-[60px] bg-background/50 border-border text-xs"
        />
      </div>
    </div>
  );
}

export const DEFAULT_ASSET_FORM_VALUES: AssetFormValues = {
  assetName: "",
  assetCategory: "laptop",
  brand: "",
  model: "",
  serial: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  purchaseCost: "1200",
  vendor: "",
  warrantyUntil: "",
  location: "",
  notes: "",
};
