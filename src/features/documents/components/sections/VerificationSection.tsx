import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Eye,
  FileCheck2,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DocumentItem, PaginationMeta } from "../../lib/types";

interface VerificationSectionProps {
  items: DocumentItem[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onVerify: (doc: DocumentItem) => void;
  onRejectPrompt: (doc: DocumentItem) => void;
  onRequestReuploadPrompt: (doc: DocumentItem) => void;
  onSelectPreview: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
  items,
  meta,
  isLoading,
  isError,
  onRetry,
  onVerify,
  onRejectPrompt,
  onRequestReuploadPrompt,
  onSelectPreview,
  onDownload,
}) => {
  const [filterTab, setFilterTab] = useState<"PENDING" | "VERIFIED" | "REJECTED" | "ALL">("PENDING");
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((d) => {
    // Only employee documents have verification workflows
    if (d.source !== "employee") return false;

    const matchesStatus =
      filterTab === "ALL" ||
      (filterTab === "PENDING" && d.status === "PENDING") ||
      (filterTab === "VERIFIED" && d.status === "VERIFIED") ||
      (filterTab === "REJECTED" && d.status === "REJECTED");

    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.employeeName && d.employeeName.toLowerCase().includes(search.toLowerCase())) ||
      (d.documentNumber && d.documentNumber.toLowerCase().includes(search.toLowerCase())) ||
      d.categoryName.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = items.filter((d) => d.source === "employee" && d.status === "PENDING").length;
  const verifiedCount = items.filter((d) => d.source === "employee" && d.status === "VERIFIED").length;
  const rejectedCount = items.filter((d) => d.source === "employee" && d.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Compliance Verification Queue</h2>
            <p className="text-xs text-muted-foreground">
              Review and certify submitted statutory, educational, and identity proofs for employee personnel files.
            </p>
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1">
            <Clock className="h-3 w-3 mr-1 animate-pulse" /> {pendingCount} Pending Review
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1">
            <CheckCircle className="h-3 w-3 mr-1" /> {verifiedCount} Verified
          </Badge>
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1">
            <XCircle className="h-3 w-3 mr-1" /> {rejectedCount} Rejected
          </Badge>
        </div>
      </div>

      {/* Sub-tabs & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border">
        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as "PENDING" | "VERIFIED" | "REJECTED" | "ALL")}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="PENDING" className="text-xs gap-1 cursor-pointer">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="VERIFIED" className="text-xs gap-1 cursor-pointer">
              Verified ({verifiedCount})
            </TabsTrigger>
            <TabsTrigger value="REJECTED" className="text-xs gap-1 cursor-pointer">
              Rejected ({rejectedCount})
            </TabsTrigger>
            <TabsTrigger value="ALL" className="text-xs gap-1 cursor-pointer">
              All Submissions
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 min-w-[200px] max-w-xs relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter queue by employee or title..."
            className="pl-9 h-8 bg-background/50 border-border text-xs"
          />
        </div>
      </div>

      {/* Verification Queue Table */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold text-muted-foreground">Document Title</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Employee</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Doc Number</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Submission Date</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Review Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx} className="border-border animate-pulse">
                  <TableCell colSpan={7} className="py-4">
                    <div className="h-4 bg-muted/40 rounded w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-semibold text-foreground text-sm">No documents found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Documents uploaded by employees or HR will appear here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((doc) => (
                <TableRow key={`${doc.source}:${doc.id}`} className="border-border hover:bg-accent/30 text-xs">
                  <TableCell className="font-semibold text-foreground max-w-[200px]">
                    <p className="truncate">{doc.title}</p>
                    {doc.rejectionReason && (
                      <p className="text-[10px] text-rose-500 truncate mt-0.5">
                        Reason: {doc.rejectionReason}
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-foreground">{doc.employeeName || "—"}</p>
                    {doc.employeeCode && (
                      <p className="text-[10px] text-muted-foreground font-mono">{doc.employeeCode}</p>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">{doc.categoryName}</TableCell>

                  <TableCell className="font-mono text-muted-foreground">
                    {doc.documentNumber || "—"}
                  </TableCell>

                  <TableCell className="text-muted-foreground">{doc.uploadedAt}</TableCell>

                  <TableCell>
                    <Badge
                      className={`text-[10px] font-medium border-none shadow-none ${
                        doc.status === "VERIFIED"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : doc.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-500"
                          : doc.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-neutral-500/10 text-neutral-500"
                      }`}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectPreview(doc)}
                        className="h-7 w-7 p-0 cursor-pointer"
                        title="Preview Document"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(doc)}
                        className="h-7 w-7 p-0 cursor-pointer"
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      {/* Fast Action Buttons */}
                      {doc.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onVerify(doc)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-2 gap-1"
                            title="Verify and Approve"
                          >
                            <CheckCircle className="h-3 w-3" /> Verify
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRejectPrompt(doc)}
                            className="h-7 text-xs border-rose-500/30 text-rose-600 hover:bg-rose-500/10 cursor-pointer px-2 gap-1"
                            title="Reject Document"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRequestReuploadPrompt(doc)}
                            className="h-7 text-xs text-amber-600 hover:bg-amber-500/10 cursor-pointer px-2 gap-1"
                            title="Request Re-upload"
                          >
                            <RefreshCw className="h-3 w-3" /> Re-upload
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
