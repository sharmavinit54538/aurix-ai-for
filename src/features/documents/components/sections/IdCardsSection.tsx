import React, { useState } from "react";
import {
  CreditCard,
  Printer,
  Download,
  RotateCw,
  Upload,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IdCardPreview } from "../idCard/IdCardPreview";
import { useIdCardGeneration } from "../../hooks/useIdCardGeneration";
import { ID_CARD_THEMES } from "../../lib/idCardTemplates";
import type { IdCardTheme, EmployeeIdCardData } from "../../lib/types";

export const IdCardsSection: React.FC = () => {
  const {
    employees,
    isLoadingEmployees,
    selectedEmployeeId,
    selectedEmployee,
    theme,
    isFlipped,
    bloodGroup,
    emergencyContact,
    employeePhone,
    customPhotoUrl,
    issueDate,
    expiryDate,
    currentCardData,
    issuedCards,
    setSelectedEmployeeId,
    setTheme,
    setIsFlipped,
    setBloodGroup,
    setEmergencyContact,
    setEmployeePhone,
    setIssueDate,
    setExpiryDate,
    handlePhotoUpload,
    handleGenerateCard,
    handlePrintCard,
    handleToggleCardStatus,
  } = useIdCardGeneration();

  const [previewModalCard, setPreviewModalCard] = useState<EmployeeIdCardData | null>(null);

  const handleDownloadCard = (card = currentCardData) => {
    // Generate text/badge metadata download
    const fileName = `${card.employeeName.replace(/\s+/g, "_")}_ID_Badge.txt`;
    const summary = `OFC360 EMPLOYEE ID BADGE
====================================
COMPANY: ${card.companyName}
EMPLOYEE: ${card.employeeName}
ID NUMBER: ${card.employeeCode}
ROLE: ${card.designation}
DEPARTMENT: ${card.department}
BLOOD GROUP: ${card.bloodGroup || "N/A"}
ISSUE DATE: ${card.issueDate}
EXPIRY DATE: ${card.expiryDate || "Indefinite"}
EMERGENCY CONTACT: ${card.emergencyContact}
STATUS: ${card.status}
AUTHENTICATION: Verified Digital ID
`;
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Employee Digital ID Cards</h2>
            <p className="text-xs text-muted-foreground">
              Generate CR80 security badges with dynamic QR verification, employee photos, and emergency contact details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> ISO/IEC 7810 ID-1 Standard (CR80)
          </Badge>
        </div>
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ════ Left Column: Customization Controls ════ */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Badge Personalization
              </CardTitle>
              <CardDescription className="text-xs">
                Select an employee and customize identity badge parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {/* Employee Selection */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Target Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                  disabled={isLoadingEmployees}
                >
                  <SelectTrigger className="h-9 text-xs bg-background/50 border-border cursor-pointer">
                    <SelectValue placeholder="Select employee..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.employeeId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Badge Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(ID_CARD_THEMES).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`h-9 px-3 rounded-lg border text-xs font-medium flex items-center justify-between cursor-pointer transition-all ${
                        theme === t.id
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                          : "border-border hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${t.frontBg}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Group & Emergency Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Emergency Contact</Label>
                  <Input
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="h-8 text-xs bg-background/50 border-border"
                  />
                </div>
              </div>

              {/* Photo Upload / Replacement */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Custom Badge Photo</Label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl border border-border overflow-hidden bg-muted/40 flex items-center justify-center shrink-0">
                    {customPhotoUrl ? (
                      <img src={customPhotoUrl} alt="Badge" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <div className="h-9 px-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-accent/40 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{customPhotoUrl ? "Replace Photo" : "Upload High-Res Photo"}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Issue & Expiry Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Issue Date</Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="h-8 text-xs bg-background/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Expiry Date</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-8 text-xs bg-background/50 border-border"
                  />
                </div>
              </div>

              {/* Action Trigger */}
              <Button
                onClick={handleGenerateCard}
                className="w-full h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold cursor-pointer shadow-md mt-2"
              >
                <Sparkles className="h-4 w-4" />
                Issue Official ID Card
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ════ Right Column: 3D Flip Card Interactive Preview ════ */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/20 border border-border/80">
          <IdCardPreview
            card={currentCardData}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onPrint={handlePrintCard}
            onDownload={() => handleDownloadCard(currentCardData)}
          />
        </div>
      </div>

      {/* ════ Issued Cards History Table ════ */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Active & Issued ID Cards Registry
          </CardTitle>
          <CardDescription className="text-xs">
            Registry of all corporate credentials, issue timestamps, and active status control.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {issuedCards.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              No ID cards issued yet. Generate the first badge using the designer above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs font-bold text-muted-foreground">Employee Name</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Employee ID</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Designation</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Issue Date</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Expiry Date</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Theme</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issuedCards.map((card) => (
                  <TableRow key={card.id} className="border-border hover:bg-accent/30 text-xs">
                    <TableCell className="font-semibold text-foreground">
                      {card.employeeName}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">{card.employeeCode}</TableCell>
                    <TableCell className="text-muted-foreground">{card.designation}</TableCell>
                    <TableCell className="text-muted-foreground">{card.issueDate}</TableCell>
                    <TableCell className="text-muted-foreground">{card.expiryDate || "Indefinite"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {card.theme}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-medium border-none shadow-none ${
                          card.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : card.status === "Replaced"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-neutral-500/10 text-neutral-500"
                        }`}
                      >
                        {card.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewModalCard(card)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          title="Preview Badge"
                        >
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadCard(card)}
                          className="h-7 w-7 p-0 cursor-pointer"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCardStatus(card.id, card.status)}
                          className="h-7 w-7 p-0 cursor-pointer text-indigo-500"
                          title={card.status === "Active" ? "Deactivate Card" : "Activate Card"}
                        >
                          <RotateCw className="h-3.5 w-3.5" />
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

      {/* Card Preview Modal */}
      {previewModalCard && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewModalCard(null)}
        >
          <div
            className="w-full max-w-md bg-background rounded-2xl border border-border p-6 shadow-2xl space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-base text-foreground">
                ID Badge — {previewModalCard.employeeName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewModalCard(null)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <IdCardPreview
              card={previewModalCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              onPrint={handlePrintCard}
              onDownload={() => handleDownloadCard(previewModalCard)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
