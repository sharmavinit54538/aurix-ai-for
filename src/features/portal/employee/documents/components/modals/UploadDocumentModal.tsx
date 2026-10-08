import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Upload } from "lucide-react";
import { CATEGORY_MAP } from "../../constants";

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadName: string;
  setUploadName: (name: string) => void;
  uploadCategory: string;
  handleCategoryChange: (category: string) => void;
  uploadType: string;
  setUploadType: (type: string) => void;
  uploadCustomType: string;
  setUploadCustomType: (type: string) => void;
  uploadExpiry: string;
  setUploadExpiry: (expiry: string) => void;
  uploadDesc: string;
  setUploadDesc: (desc: string) => void;
  setUploadFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isSubmittingUpload: boolean;
  handleUploadSubmit: (e: React.FormEvent) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onOpenChange,
  uploadName,
  setUploadName,
  uploadCategory,
  handleCategoryChange,
  uploadType,
  setUploadType,
  uploadCustomType,
  setUploadCustomType,
  uploadExpiry,
  setUploadExpiry,
  uploadDesc,
  setUploadDesc,
  setUploadFile,
  fileInputRef,
  isSubmittingUpload,
  handleUploadSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload your personal employment document. Once submitted, it will be marked as Pending
            Verification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          <div>
            <Label className="text-xs font-semibold">Document Name *</Label>
            <Input
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="e.g., Aadhaar Card Front & Back"
              className="mt-1 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Category *</Label>
              <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORY_MAP).map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Document Type *</Label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {(CATEGORY_MAP[uploadCategory] || ["Other"]).map((typ) => (
                    <SelectItem key={typ} value={typ} className="text-xs">
                      {typ}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other" className="text-xs">
                    Other Custom Type
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {uploadType === "Other" && (
            <div>
              <Label className="text-xs font-semibold">Specify Custom Type *</Label>
              <Input
                value={uploadCustomType}
                onChange={(e) => setUploadCustomType(e.target.value)}
                placeholder="e.g., Driver Certificate, Patent Copy"
                className="mt-1 text-xs"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Expiry Date (where applicable)</Label>
              <Input
                type="date"
                value={uploadExpiry}
                onChange={(e) => setUploadExpiry(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">File (PDF, PNG, JPG, JPEG) *</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setUploadFile(f);
                  if (f && !uploadName) {
                    setUploadName(f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                  }
                }}
                className="mt-1 text-xs cursor-pointer"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Optional Description / Notes</Label>
            <Textarea
              value={uploadDesc}
              onChange={(e) => setUploadDesc(e.target.value)}
              placeholder="Provide any additional details for HR verification..."
              rows={2}
              className="mt-1 text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmittingUpload}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground gap-1.5"
              disabled={isSubmittingUpload}
            >
              {isSubmittingUpload ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" /> Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
