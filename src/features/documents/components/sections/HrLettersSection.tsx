import React, { useState } from "react";
import {
  FileText,
  Wand2,
  Send,
  Download,
  History,
  Eye,
  User,
  Calendar,
  FileCheck,
  Edit3,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LetterPreview } from "../letters/LetterPreview";
import { useLetterGeneration } from "../../hooks/useLetterGeneration";
import { HR_LETTER_CATEGORIES, LETTER_TYPES } from "../../lib/letterTemplates";
import { formatINR } from "../../lib/salaryConfig";
import { useCurrentRole } from "@/lib/use-current-role";
import { isHrAdmin, isSuperAdmin, isExecutive } from "@/lib/roles";
import type { HrLetterCategory, GeneratedLetterRecord } from "../../lib/types";

export const HrLettersSection: React.FC = () => {
  const role = useCurrentRole();
  const canViewSalary = isSuperAdmin(role) || isHrAdmin(role) || isExecutive(role);

  const {
    employees,
    isLoadingEmployees,
    employeeError,
    isLoadingDetails,
    refetchEmployees,
    selectedLetterTypeId,
    selectedLetterType,
    selectedEmployeeId,
    selectedEmployee,
    customFields,
    variableContext,
    previewContent,
    editedContent,
    isEditingContent,
    isGenerating,
    isSavingToDocs,
    history,
    setSelectedEmployeeId,
    handleSelectLetterType,
    handleFieldChange,
    setEditedContent,
    setIsEditingContent,
    handleGenerate,
    handleDownloadPdf,
    handlePrint,
    handleSendToEmployee,
    handleSaveToEmployeeDocs,
  } = useLetterGeneration();

  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");
  const [selectedCategory, setSelectedCategory] = useState<HrLetterCategory>("JOINING & EMPLOYMENT");
  const [viewHistoryRecord, setViewHistoryRecord] = useState<GeneratedLetterRecord | null>(null);

  const categoryLetterTypes = LETTER_TYPES.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generator" | "history")}>
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="generator" className="gap-1.5 text-xs font-semibold cursor-pointer">
              <Wand2 className="h-3.5 w-3.5" /> Letter Generator
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 text-xs font-semibold cursor-pointer">
              <History className="h-3.5 w-3.5" /> Generation History
              {history.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                  {history.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          44 official corporate templates across 8 categories
        </span>
      </div>

      {activeTab === "generator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ════ Left Column: Letter Configuration ════ */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Recipient Employee Selection */}
            <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    1. Select Recipient Employee
                  </span>
                  {isLoadingDetails && (
                    <span className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Syncing details...
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  Pulls employee details, title, compensation, and reporting structure automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {employeeError ? (
                  <div className="p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-xs text-destructive space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Failed to load employees from directory
                    </div>
                    <p className="text-[11px] text-destructive/80 pl-6">{employeeError}</p>
                    <div className="pl-6 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={refetchEmployees}
                        className="h-7 text-xs border-destructive/30 hover:bg-destructive/20 text-destructive cursor-pointer gap-1.5"
                      >
                        <RefreshCw className="h-3 w-3" /> Retry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Select
                      value={selectedEmployeeId}
                      onValueChange={setSelectedEmployeeId}
                      disabled={isLoadingEmployees}
                    >
                      <SelectTrigger className="h-9 text-xs bg-background/50 border-border cursor-pointer">
                        {isLoadingEmployees ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Loading employees...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select an active employee..." />
                        )}
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {employees.length === 0 ? (
                          <div className="py-4 text-center text-xs text-muted-foreground">
                            No active employees found.
                          </div>
                        ) : (
                          employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.fullName} ({emp.employeeId}) — {emp.designation || "Staff"}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    {selectedEmployee && (
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Employee ID:</span>
                          <span className="font-mono font-semibold">{selectedEmployee.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Department:</span>
                          <span className="font-semibold">{selectedEmployee.department || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Designation:</span>
                          <span className="font-semibold">{selectedEmployee.designation || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Joining Date:</span>
                          <span className="font-semibold">{selectedEmployee.joiningDate || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Official Email:</span>
                          <span className="font-mono text-[11px]">{selectedEmployee.email || "—"}</span>
                        </div>
                        {selectedEmployee.managerName && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reporting To:</span>
                            <span className="font-semibold text-primary">{selectedEmployee.managerName}</span>
                          </div>
                        )}
                        {canViewSalary && selectedEmployee.ctc && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual CTC:</span>
                            <span className="font-semibold text-emerald-500">₹{formatINR(selectedEmployee.ctc)}</span>
                          </div>
                        )}
                        {selectedEmployee.location && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Work Location:</span>
                            <span className="font-semibold">{selectedEmployee.location}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* 2. Letter Category & Type Selection */}
            <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  2. Select Letter Category & Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Category Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Letter Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(val) => {
                      const cat = val as HrLetterCategory;
                      setSelectedCategory(cat);
                      const firstInCat = LETTER_TYPES.find((t) => t.category === cat);
                      if (firstInCat) handleSelectLetterType(firstInCat.id);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HR_LETTER_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Letter Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Letter Type</Label>
                  <Select
                    value={selectedLetterTypeId}
                    onValueChange={handleSelectLetterType}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {categoryLetterTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground pt-1">
                    {selectedLetterType.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Letter Specific Fields */}
            {selectedLetterType.requiredFields.length > 0 && (
              <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    3. Letter Specific Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedLetterType.requiredFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          value={customFields[field.key] || field.defaultValue || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="min-h-[60px] bg-background/50 border-border text-xs"
                        />
                      ) : (
                        <Input
                          type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                          placeholder={field.placeholder}
                          value={customFields[field.key] || field.defaultValue || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="h-8 bg-background/50 border-border text-xs"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Generate Trigger */}
            <div className="pt-2">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedEmployee}
                className="w-full h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer shadow-md"
              >
                <Wand2 className="h-4 w-4" />
                {isGenerating ? "Generating Official Letter..." : `Generate ${selectedLetterType.title}`}
              </Button>
            </div>
          </div>

          {/* ════ Right Column: Live Letter Preview & Editor ════ */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-500" />
                Live Document Preview
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!isEditingContent) {
                    setEditedContent(previewContent);
                  }
                  setIsEditingContent(!isEditingContent);
                }}
                className="h-7 text-xs gap-1 border-border cursor-pointer hover:bg-accent/60"
              >
                <Edit3 className="h-3 w-3" />
                {isEditingContent ? "Finish Editing" : "Edit Letter Text"}
              </Button>
            </div>

            {isEditingContent ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent ?? previewContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[500px] font-sans text-xs bg-card border-border leading-relaxed p-4"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditedContent(null);
                      setIsEditingContent(false);
                    }}
                    className="h-7 text-xs cursor-pointer"
                  >
                    Reset to Default
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsEditingContent(false)}
                    className="h-7 text-xs bg-primary cursor-pointer"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            ) : (
              <LetterPreview
                title={selectedLetterType.title}
                category={selectedCategory}
                content={previewContent}
                recipientName={variableContext.employee_name}
                recipientDesignation={variableContext.designation}
                recipientDepartment={variableContext.department}
                effectiveDate={variableContext.effective_date}
                onDownload={() => handleDownloadPdf()}
                onPrint={handlePrint}
                onSend={() => handleSendToEmployee()}
                onSaveToDocs={() => handleSaveToEmployeeDocs()}
                isSaving={isSavingToDocs}
              />
            )}
          </div>
        </div>
      ) : (
        /* ════ History Tab: Tracking Generation Logs ════ */
        <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              Document Generation Audit Trail
            </CardTitle>
            <CardDescription className="text-xs">
              Every HR letter generated, downloaded, or dispatched is tracked for corporate governance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                No letters have been generated yet in this session.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-muted-foreground">Document Title</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground">Recipient</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground">Category</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground">Generated Date</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground">Issued By</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="border-border hover:bg-accent/30 text-xs">
                      <TableCell className="font-semibold text-foreground">
                        {record.letterTitle}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{record.employeeName}</p>
                        {record.employeeCode && (
                          <p className="text-[10px] text-muted-foreground font-mono">{record.employeeCode}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {record.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.generatedAt.split("T")[0]}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.generatedBy}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-medium border-none shadow-none ${
                            record.status === "Sent"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewHistoryRecord(record)}
                            className="h-7 w-7 p-0 cursor-pointer"
                            title="Preview Letter"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPdf(record.content, record.letterTitle)}
                            className="h-7 w-7 p-0 cursor-pointer"
                            title="Download Copy"
                          >
                            <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendToEmployee(record.id)}
                            className="h-7 w-7 p-0 cursor-pointer text-blue-500"
                            title="Send to Employee"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* History Record Preview Modal */}
      {viewHistoryRecord && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setViewHistoryRecord(null)}
        >
          <div
            className="w-full max-w-3xl bg-background rounded-2xl border border-border p-6 shadow-2xl space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground">
                {viewHistoryRecord.letterTitle} — {viewHistoryRecord.employeeName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewHistoryRecord(null)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <LetterPreview
              title={viewHistoryRecord.letterTitle}
              category={viewHistoryRecord.category}
              content={viewHistoryRecord.content}
              recipientName={viewHistoryRecord.employeeName}
              onDownload={() => handleDownloadPdf(viewHistoryRecord.content, viewHistoryRecord.letterTitle)}
              onPrint={handlePrint}
              onSend={() => handleSendToEmployee(viewHistoryRecord.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
