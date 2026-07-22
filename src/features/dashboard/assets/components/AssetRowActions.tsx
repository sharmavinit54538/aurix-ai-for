import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/hrms/types";

interface AssetRowActionsProps {
  asset: Asset;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onTransfer: (asset: Asset) => void;
  onRepair: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDeleteRequest: (asset: Asset) => void;
}

export function AssetRowActions({
  asset,
  onAssign,
  onReturn,
  onTransfer,
  onRepair,
  onEdit,
  onDeleteRequest,
}: AssetRowActionsProps) {
  return (
    <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
      {asset.status === "available" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAssign(asset)}
          className="h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/65"
        >
          Assign
        </Button>
      )}
      {asset.status === "assigned" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReturn(asset)}
            className="h-7 text-[10px] px-2 text-emerald-600 border-border cursor-pointer hover:bg-emerald-500/10"
          >
            Return
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTransfer(asset)}
            className="h-7 text-[10px] px-2 text-indigo-500 border-border cursor-pointer hover:bg-indigo-500/10"
          >
            Transfer
          </Button>
        </>
      )}
      {asset.status !== "under-repair" && asset.status !== "retired" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRepair(asset)}
          className="h-7 text-[10px] px-2 text-amber-600 border-border cursor-pointer hover:bg-amber-500/10"
        >
          Repair
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onEdit(asset)}
        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDeleteRequest(asset)}
        className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
