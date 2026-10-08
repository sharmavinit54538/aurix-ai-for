import React, { useState } from "react";
import {
  FileCode2,
  Plus,
  Copy,
  Edit,
  Power,
  Star,
  Eye,
  Search,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDocumentTemplates, AVAILABLE_TEMPLATE_VARIABLES } from "../../hooks/useDocumentTemplates";
import type { DocumentTemplate } from "../../lib/types";

export const TemplatesSection: React.FC = () => {
  const {
    templates,
    categories,
    isLoading,
    search,
    selectedCategory,
    setSearch,
    setSelectedCategory,
    createTemplate,
    editTemplate,
    duplicateTemplate,
    toggleActiveStatus,
    setDefaultTemplate,
  } = useDocumentTemplates();

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Joining & Employment");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  // Preview modal state
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setTitle("");
    setCategory("Joining & Employment");
    setCode(`TPL-${Math.floor(100 + Math.random() * 900)}`);
    setDescription("");
    setContent(`REF: OFC/TPL/{{employee_id}}/2026
DATE: {{effective_date}}

TO: {{employee_name}} (Employee ID: {{employee_id}})
{{designation}} – {{department}}

Dear {{employee_name}},

This official notification outlines the terms and details regarding your employment with {{company_name}} located at {{company_address}}.

Sincerely,

Authorized Signatory
{{company_name}}`);
    setModalOpen(true);
  };

  const openEditModal = (t: DocumentTemplate) => {
    setEditingTemplate(t);
    setTitle(t.title);
    setCategory(t.category);
    setCode(t.code);
    setDescription(t.description || "");
    setContent(t.content);
    setModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    if (editingTemplate) {
      editTemplate(editingTemplate.id, {
        title: title.trim(),
        category,
        code: code.trim(),
        description: description.trim() || undefined,
        content,
      });
    } else {
      await createTemplate({
        title: title.trim(),
        category,
        code: code.trim(),
        description: description.trim() || undefined,
        content,
      });
    }

    setModalOpen(false);
  };

  const insertVariableIntoContent = (varKey: string) => {
    const placeholder = `{{${varKey}}}`;
    setContent((prev) => `${prev} ${placeholder}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Document Template System</h2>
            <p className="text-xs text-muted-foreground">
              Create, configure, and maintain reusable document templates with dynamic variable placeholders.
            </p>
          </div>
        </div>

        <Button
          onClick={openCreateModal}
          size="sm"
          className="h-9 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Create New Template
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/40 border border-border">
        <div className="flex-1 min-w-[240px] max-w-sm relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by title or code..."
            className="pl-9 h-9 bg-background/50 border-border text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 min-w-[180px] text-xs bg-background/50 border-border cursor-pointer">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates Table */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold text-muted-foreground">Template Name</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Code</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Variables</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">Default</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <FileCode2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  No templates found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((tpl) => (
                <TableRow key={tpl.id} className="border-border hover:bg-accent/30 text-xs">
                  <TableCell className="font-semibold text-foreground max-w-[200px]">
                    <p className="truncate">{tpl.title}</p>
                    {tpl.description && (
                      <p className="text-[10px] text-muted-foreground truncate">{tpl.description}</p>
                    )}
                  </TableCell>

                  <TableCell className="font-mono text-muted-foreground">{tpl.code}</TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {tpl.category}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {tpl.variables.slice(0, 3).map((v) => (
                        <span key={v} className="px-1.5 py-0.5 rounded bg-muted/60 text-[9px] font-mono">
                          {`{{${v}}}`}
                        </span>
                      ))}
                      {tpl.variables.length > 3 && (
                        <span className="text-[9px] text-muted-foreground self-center">
                          +{tpl.variables.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`text-[10px] font-medium border-none shadow-none ${
                        tpl.isActive
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-neutral-500/10 text-neutral-500"
                      }`}
                    >
                      {tpl.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {tpl.isDefault ? (
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] px-1.5 py-0 gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" /> Default
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultTemplate(tpl.id)}
                        className="h-6 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer px-1.5"
                      >
                        Set Default
                      </Button>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewTemplate(tpl)}
                        className="h-7 w-7 p-0 cursor-pointer"
                        title="Preview Template"
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(tpl)}
                        className="h-7 w-7 p-0 cursor-pointer"
                        title="Edit Template"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateTemplate(tpl.id)}
                        className="h-7 w-7 p-0 cursor-pointer"
                        title="Duplicate Template"
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActiveStatus(tpl.id)}
                        className={`h-7 w-7 p-0 cursor-pointer ${
                          tpl.isActive ? "text-emerald-500 hover:text-rose-500" : "text-muted-foreground hover:text-emerald-500"
                        }`}
                        title={tpl.isActive ? "Deactivate" : "Activate"}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ════ Create / Edit Template Dialog ════ */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl bg-background border-border shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              {editingTemplate ? `Edit Template: ${editingTemplate.title}` : "Create Reusable Document Template"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define the template structure and insert variable tags to be dynamically populated with live employee records.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold">Template Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Executive Offer Letter"
                  className="h-8 text-xs bg-background/50 border-border"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Code *</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. TPL-OFFER-01"
                  className="h-8 text-xs bg-background/50 border-border font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 text-xs bg-background/50 border-border cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Joining & Employment">Joining & Employment</SelectItem>
                    <SelectItem value="Salary & Compensation">Salary & Compensation</SelectItem>
                    <SelectItem value="Employment Verification">Employment Verification</SelectItem>
                    <SelectItem value="Role & Transfer">Role & Transfer</SelectItem>
                    <SelectItem value="Exit & Separation">Exit & Separation</SelectItem>
                    <SelectItem value="General HR">General HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. For all permanent campus hires"
                  className="h-8 text-xs bg-background/50 border-border"
                />
              </div>
            </div>

            {/* Variable Placeholders Helper Palette */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Insert Dynamic Variables
                </span>
                <span className="text-[11px] text-muted-foreground">Click a variable tag to insert into text</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {AVAILABLE_TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariableIntoContent(v.key)}
                    className="px-2 py-1 rounded-md bg-card border border-border/80 hover:border-primary/50 text-[11px] font-mono text-foreground hover:bg-accent cursor-pointer transition-colors"
                    title={v.description}
                  >
                    {`{{${v.key}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Body Editor */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Template Content / Text *</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write template text here using {{variables}}..."
                className="min-h-[260px] font-mono text-xs bg-background/50 border-border leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveModal}
              disabled={!title.trim() || !content.trim()}
              className="h-8 text-xs bg-primary cursor-pointer"
            >
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════ Template Preview Modal ════ */}
      {previewTemplate && (
        <Dialog open={Boolean(previewTemplate)} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
          <DialogContent className="sm:max-w-2xl bg-background border-border shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Template Preview: {previewTemplate.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Code: {previewTemplate.code} • Category: {previewTemplate.category}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/80 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {previewTemplate.content}
            </div>

            <DialogFooter>
              <Button
                size="sm"
                onClick={() => setPreviewTemplate(null)}
                className="h-8 text-xs cursor-pointer"
              >
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
