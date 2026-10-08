import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Trash2,
  Wand2,
  Send,
  CreditCard,
  FileCode2,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDocumentActivity } from "../../hooks/useDocumentActivity";
import { subscribeToAuditLog } from "../../lib/auditLogger";

export const ActivityAuditSection: React.FC = () => {
  const { activities, isLoading, refetch } = useDocumentActivity(1, 100);
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  // Re-fetch activities whenever local audit event occurs
  useEffect(() => {
    const unsub = subscribeToAuditLog(() => {
      refetch();
    });
    return unsub;
  }, [refetch]);

  const filteredActivities = activities.filter((act) => {
    const matchSearch =
      !search ||
      act.documentName.toLowerCase().includes(search.toLowerCase()) ||
      act.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      (act.employeeName && act.employeeName.toLowerCase().includes(search.toLowerCase())) ||
      (act.details && act.details.toLowerCase().includes(search.toLowerCase()));

    const matchAction =
      selectedAction === "all" ||
      act.action.toLowerCase().includes(selectedAction.toLowerCase());

    return matchSearch && matchAction;
  });

  const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes("upload")) return <Upload className="h-3 w-3 text-blue-500" />;
    if (a.includes("verif")) return <CheckCircle className="h-3 w-3 text-emerald-500" />;
    if (a.includes("reject")) return <XCircle className="h-3 w-3 text-rose-500" />;
    if (a.includes("re-upload")) return <RefreshCw className="h-3 w-3 text-amber-500" />;
    if (a.includes("delet")) return <Trash2 className="h-3 w-3 text-red-500" />;
    if (a.includes("letter") && a.includes("gen")) return <Wand2 className="h-3 w-3 text-indigo-500" />;
    if (a.includes("sent")) return <Send className="h-3 w-3 text-sky-500" />;
    if (a.includes("card")) return <CreditCard className="h-3 w-3 text-purple-500" />;
    if (a.includes("template")) return <FileCode2 className="h-3 w-3 text-cyan-500" />;
    if (a.includes("download")) return <Download className="h-3 w-3 text-teal-500" />;
    return <FileSpreadsheet className="h-3 w-3 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Document Activity & Audit Trail</h2>
            <p className="text-xs text-muted-foreground">
              Comprehensive immutable audit ledger capturing uploads, approvals, rejections, downloads, letter generation, and ID badge issuance.
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-semibold">
          {filteredActivities.length} Events Logged
        </Badge>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border">
        <div className="flex-1 min-w-[240px] max-w-sm relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, document, or recipient..."
            className="pl-9 h-8 bg-background/50 border-border text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="h-8 min-w-[180px] text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Action Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Action Types</SelectItem>
              <SelectItem value="upload">Document Uploaded</SelectItem>
              <SelectItem value="verif">Document Verified</SelectItem>
              <SelectItem value="reject">Document Rejected</SelectItem>
              <SelectItem value="re-upload">Document Re-uploaded</SelectItem>
              <SelectItem value="download">Document Downloaded</SelectItem>
              <SelectItem value="delet">Document Deleted</SelectItem>
              <SelectItem value="letter">Letter Generated / Sent</SelectItem>
              <SelectItem value="card">ID Card Issued</SelectItem>
              <SelectItem value="template">Template Changes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Table */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold text-muted-foreground">Action</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Document / Resource</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Subject / Employee</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Performed By</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Timestamp</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx} className="border-border animate-pulse">
                  <TableCell colSpan={6} className="py-4">
                    <div className="h-4 bg-muted/40 rounded w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  No audit activity recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((act) => (
                <TableRow key={act.id} className="border-border hover:bg-accent/30 text-xs">
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <span className="p-1 rounded-md bg-muted/60">{getActionIcon(act.action)}</span>
                      <span>{act.action}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                    {act.documentName}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {act.employeeName ? (
                      <span className="font-medium text-foreground">{act.employeeName}</span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </TableCell>

                  <TableCell className="font-semibold text-foreground">{act.performedBy}</TableCell>

                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(act.timestamp).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-[11px] max-w-[240px] truncate">
                    {act.details || "Standard operation executed."}
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
