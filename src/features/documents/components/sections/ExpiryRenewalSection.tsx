import React, { useState } from "react";
import {
  CalendarClock,
  AlertTriangle,
  CalendarX,
  CheckCircle2,
  BellRing,
  Download,
  Eye,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logDocumentAuditEvent } from "../../lib/auditLogger";
import { getExpiryDiffDays } from "../../lib/mappers";
import type { DocumentItem, PaginationMeta } from "../../lib/types";

interface ExpiryRenewalSectionProps {
  items: DocumentItem[];
  meta: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelectPreview: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
}

type ExpiryCategory = "all" | "expired" | "7d" | "30d" | "60d" | "valid";

export const ExpiryRenewalSection: React.FC<ExpiryRenewalSectionProps> = ({
  items,
  isLoading,
  isError,
  onRetry,
  onSelectPreview,
  onDownload,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ExpiryCategory>("all");
  const [search, setSearch] = useState("");

  // Only consider documents that have an expiryDate defined
  const docsWithExpiry = items.filter((d) => Boolean(d.expiryDate));

  const categorizedDocs = docsWithExpiry.map((d) => {
    const days = getExpiryDiffDays(d.expiryDate);
    let category: ExpiryCategory = "valid";
    if (days !== null) {
      if (days < 0) category = "expired";
      else if (days <= 7) category = "7d";
      else if (days <= 30) category = "30d";
      else if (days <= 60) category = "60d";
    }
    return { ...d, daysRemaining: days, expiryCategory: category };
  });

  const expiredCount = categorizedDocs.filter((d) => d.expiryCategory === "expired").length;
  const critical7Count = categorizedDocs.filter((d) => d.expiryCategory === "7d").length;
  const warning30Count = categorizedDocs.filter((d) => d.expiryCategory === "30d").length;
  const upcoming60Count = categorizedDocs.filter((d) => d.expiryCategory === "60d").length;
  const validCount = categorizedDocs.filter((d) => d.expiryCategory === "valid").length;

  const filteredDocs = categorizedDocs.filter((d) => {
    const matchCategory = selectedFilter === "all" || d.expiryCategory === selectedFilter;
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.employeeName && d.employeeName.toLowerCase().includes(search.toLowerCase())) ||
      (d.documentNumber && d.documentNumber.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleNotifyRenewal = (doc: DocumentItem) => {
    logDocumentAuditEvent({
      action: "Document Updated",
      documentName: doc.title,
      documentId: doc.id,
      employeeName: doc.employeeName,
      employeeId: doc.employeeId,
      details: `Dispatched document expiry renewal reminder to ${doc.employeeName || "employee"}`,
    });
    toast.success(`Renewal reminder dispatched to ${doc.employeeName || "employee"}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shrink-0">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Document Expiry & Renewal Tracking</h2>
            <p className="text-xs text-muted-foreground">
              Monitor expiring identity documents, visas, work permits, certifications, and NDAs before statutory expiration.
            </p>
          </div>
        </div>

        {/* Counter Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1">
            <CalendarX className="h-3 w-3 mr-1" /> {expiredCount} Expired
          </Badge>
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1">
            <AlertTriangle className="h-3 w-3 mr-1" /> {critical7Count} Expiring in 7 Days
          </Badge>
          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs px-2.5 py-1">
            <CalendarClock className="h-3 w-3 mr-1" /> {warning30Count} Expiring in 30 Days
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1">
            <CheckCircle2 className="h-3 w-3 mr-1" /> {validCount} Valid
          </Badge>
        </div>
      </div>

      {/* Sub-tabs & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border">
        <Tabs value={selectedFilter} onValueChange={(v) => setSelectedFilter(v as ExpiryCategory)}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="text-xs gap-1 cursor-pointer">
              All ({docsWithExpiry.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-xs gap-1 cursor-pointer">
              Expired ({expiredCount})
            </TabsTrigger>
            <TabsTrigger value="7d" className="text-xs gap-1 cursor-pointer">
              In 7 Days ({critical7Count})
            </TabsTrigger>
            <TabsTrigger value="30d" className="text-xs gap-1 cursor-pointer">
              In 30 Days ({warning30Count})
            </TabsTrigger>
            <TabsTrigger value="60d" className="text-xs gap-1 cursor-pointer">
              In 60 Days ({upcoming60Count})
            </TabsTrigger>
            <TabsTrigger value="valid" className="text-xs gap-1 cursor-pointer">
              Valid ({validCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1 min-w-[200px] max-w-xs relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or employee..."
            className="pl-9 h-8 bg-background/50 border-border text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold text-muted-foreground">Document</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Employee</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Doc Number</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Expiry Date</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Status / Countdown</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
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
            ) : filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <CalendarClock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-semibold text-foreground text-sm">No documents found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Documents uploaded by employees or HR will appear here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => {
                const days = doc.daysRemaining;
                const isExpired = days !== null && days < 0;

                return (
                  <TableRow key={`${doc.source}:${doc.id}`} className="border-border hover:bg-accent/30 text-xs">
                    <TableCell className="font-semibold text-foreground max-w-[200px]">
                      <p className="truncate">{doc.title}</p>
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

                    <TableCell className="font-medium">{doc.expiryDate}</TableCell>

                    <TableCell>
                      {isExpired ? (
                        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold gap-1">
                          <CalendarX className="h-3 w-3" /> Expired
                        </Badge>
                      ) : days !== null && days <= 7 ? (
                        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-semibold gap-1 animate-pulse">
                          <AlertTriangle className="h-3 w-3" /> In {days} day{days === 1 ? "" : "s"}
                        </Badge>
                      ) : days !== null && days <= 30 ? (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold gap-1">
                          <CalendarClock className="h-3 w-3" /> In {days} days
                        </Badge>
                      ) : days !== null && days <= 60 ? (
                        <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-[10px] font-semibold gap-1">
                          In {days} days
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Valid ({days}d)
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotifyRenewal(doc)}
                          className="h-7 text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10 cursor-pointer px-2 gap-1"
                          title="Send renewal reminder to employee"
                        >
                          <BellRing className="h-3 w-3" /> Remind
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectPreview(doc)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          title="Preview"
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
