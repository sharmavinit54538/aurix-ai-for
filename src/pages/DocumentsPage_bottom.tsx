
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        (d.employeeName && d.employeeName.toLowerCase().includes(q.toLowerCase())) ||
        d.category.toLowerCase().includes(q.toLowerCase()) ||
        d.type.toLowerCase().includes(q.toLowerCase());

      let matchesTab = true;
      if (activeFilter === "Employee Documents") {
        matchesTab = d.category === "Employee Documents" || d.category === "Education" || d.category === "Employment";
      } else if (activeFilter === "Company Documents") {
        matchesTab = d.category === "Company Documents";
      } else if (activeFilter === "HR Templates") {
        matchesTab = d.category === "Company Documents" && (d.type === "NDA" || d.type === "HR Policy" || d.type === "Company Handbook");
      } else if (activeFilter === "Pending") {
        matchesTab = d.status === "Pending";
      } else if (activeFilter === "Verified") {
        matchesTab = d.status === "Verified";
      } else if (activeFilter === "Rejected") {
        matchesTab = d.status === "Rejected";
      }

      return matchesQ && matchesTab;
    });
  }, [docs, q, activeFilter, isEmployee, ws.user]);

  // Table Sorting
  const sortedDocs = useMemo(() => {
    const sorted = [...filteredDocs];
    sorted.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDocs, sortField, sortOrder]);

  // Paginated elements
  const paginatedDocs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDocs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDocs, currentPage]);

  const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);

  const handleSort = (field: keyof HRDocument) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title={isEmployee ? "My Documents & Vault" : "Documents"}
        description={
          isEmployee
            ? "View your personal verification documents, certificates, and company policies."
            : "Securely store, verify, and generate employee records and company templates."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            {!isEmployee && (
              <Button
                onClick={() => setGenerateOpen(true)}
                className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
              >
                <Wand2 className="h-4 w-4" />
                AI Document Generator
              </Button>
            )}
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATS_CARDS.map(card => {
          const value = stats[card.key as keyof typeof stats];
          return (
            <Card key={card.key} className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Folder className={`h-4 w-4 ${card.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">{value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. NOTIFICATION ALERTS */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.slice(0, 3).map(alert => (
            <div key={alert.id} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs ${
              alert.type === "warning" ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400" :
              alert.type === "error" ? "border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400" :
              "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
            }`}>
              {alert.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> :
               alert.type === "error" ? <XCircle className="h-3.5 w-3.5 shrink-0" /> :
               <Info className="h-3.5 w-3.5 shrink-0" />}
              <span className="flex-1">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. FILTER TABS + SEARCH */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["all", "Employee Documents", "Company Documents", "HR Templates", "Pending", "Verified", "Rejected"].map(tab => (
            <Button
              key={tab}
              variant={activeFilter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveFilter(tab); setCurrentPage(1); }}
              className={`h-8 text-xs cursor-pointer ${activeFilter === tab ? "bg-gradient-brand text-brand-foreground" : "border-border bg-card/60 hover:bg-accent/60"}`}
            >
              {tab === "all" ? "All Documents" : tab}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={q}
            onChange={e => { setQ(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-9 bg-card/60 border-border text-xs"
          />
        </div>
      </div>

      {/* 5. DATA TABLE */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              {[
                { key: "name", label: "Document" },
                { key: "employeeName", label: "Employee" },
                { key: "category", label: "Category" },
                { key: "type", label: "Type" },
                { key: "uploadDate", label: "Uploaded" },
                { key: "status", label: "Status" },
              ].map(col => (
                <TableHead
                  key={col.key}
                  onClick={() => handleSort(col.key as keyof HRDocument)}
                  className="text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  {col.label}
                  {sortField === col.key && (sortOrder === "asc" ? " ↑" : " ↓")}
                </TableHead>
              ))}
              <TableHead className="text-xs font-bold text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  No documents found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocs.map(doc => (
                <TableRow key={doc.id} className="border-border hover:bg-accent/30 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                  <TableCell className="text-xs font-medium text-foreground max-w-[180px] truncate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.employeeName || "Company"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.type}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{doc.uploadDate}</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] font-medium border-none shadow-none ${
                      doc.status === "Verified" ? "bg-emerald-500/10 text-emerald-500" :
                      doc.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                      doc.status === "Rejected" ? "bg-rose-500/10 text-rose-500" :
                      "bg-neutral-500/10 text-neutral-500"
                    }`}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(doc)} className="h-7 w-7 p-0 cursor-pointer"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} className="h-7 w-7 p-0 cursor-pointer"><Download className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      {!isEmployee && (<Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(doc)} className="h-7 w-7 p-0 cursor-pointer"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-[11px] text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, sortedDocs.length)} of {sortedDocs.length}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-xs cursor-pointer">Prev</Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-xs cursor-pointer">Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* 6. RECENT ACTIVITY LOG */}
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-sm font-bold flex items-center gap-1.5"><FileSpreadsheet className="h-4 w-4 text-indigo-500" />Recent Document Activity</CardTitle>
          <CardDescription className="text-[11px] text-muted-foreground">Live audit trail of document events across the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {activities.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-b-0">
                <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0 ${
                  act.action === "Uploaded" ? "bg-blue-500/10 text-blue-500" :
                  act.action === "Verified" ? "bg-emerald-500/10 text-emerald-500" :
                  act.action === "Rejected" ? "bg-rose-500/10 text-rose-500" :
                  act.action === "Downloaded" ? "bg-purple-500/10 text-purple-500" :
                  "bg-amber-500/10 text-amber-500"
                }`}>
                  {act.action === "Uploaded" ? <Upload className="h-2.5 w-2.5" /> :
                   act.action === "Verified" ? <CheckCircle className="h-2.5 w-2.5" /> :
                   act.action === "Rejected" ? <XCircle className="h-2.5 w-2.5" /> :
                   act.action === "Downloaded" ? <Download className="h-2.5 w-2.5" /> :
                   <RefreshCw className="h-2.5 w-2.5" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground"><strong className="font-semibold">{act.performedBy}</strong> {act.action.toLowerCase()} <strong className="font-semibold truncate">{act.documentName}</strong></p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{act.details}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
            {activities.length === 0 && (<p className="text-xs text-muted-foreground text-center py-4">No recent document activity.</p>)}
          </div>
        </CardContent>
      </Card>

      {/* UPLOAD DOCUMENT MODAL */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold flex items-center gap-2"><Upload className="h-5 w-5 text-primary" />Upload New Document</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Add employee verification documents, statutory certificates, or company policies.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-3">
            {!isEmployee && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Target Employee</Label>
                <Select value={uploadEmployee} onValueChange={setUploadEmployee}>
                  <SelectTrigger className="w-full bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="company">Company-wide (No specific employee)</SelectItem>
                    {ws.employees.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Document Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="bg-background/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{(CATEGORY_TYPES[uploadCategory] || []).map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" value={uploadExpiry} onChange={e => setUploadExpiry(e.target.value)} className="pl-9 bg-background/50 border-border text-xs" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Description / Notes</Label>
              <Textarea placeholder="Specify file details or compliance requirements" value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} className="min-h-[60px] bg-background/50 border-border text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Upload File (PDF, JPG, PNG, DOCX)</Label>
              {uploadFileName ? (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[200px]">{uploadFileName}</p>
                      <p className="text-[10px] text-muted-foreground">{uploadFileSize}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setUploadFileName(""); setUploadFileSize(""); }} className="h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer">Change File</Button>
                </div>
              ) : (
                <div onClick={handleMockFileDrop} className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer">
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Click to simulate dragging & dropping a file</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Supports PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            <DialogFooter className="pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={isUploading} className="h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer">{isUploading ? "Uploading..." : "Upload File"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI DOCUMENT GENERATOR MODAL */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-2xl bg-background border-border shadow-2xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 h-[580px] divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="md:col-span-2 p-5 flex flex-col justify-between h-full bg-muted/10">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold flex items-center gap-1.5"><Wand2 className="h-4 w-4 text-indigo-500 animate-pulse" />AI Letter Generator</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Generate compliant contracts and documents.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Document Template</Label>
                  <Select value={genTemplateId} onValueChange={val => { setGenTemplateId(val); setGenFields({}); setGeneratedDraft(null); }}>
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{DOCUMENT_TEMPLATES.map(t => (<SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">For Employee</Label>
                  <Select value={genEmployee} onValueChange={setGenEmployee}>
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs"><SelectValue placeholder="Select Employee" /></SelectTrigger>
                    <SelectContent>{ws.employees.map(emp => (<SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Template Parameters</div>
                  {DOCUMENT_TEMPLATES.find(x => x.id === genTemplateId)?.fields.map(field => (
                    <div key={field} className="space-y-1">
                      <Label className="text-[11px] text-foreground/80">{field}</Label>
                      <Input value={genFields[field] || ""} onChange={e => setGenFields({ ...genFields, [field]: e.target.value })} className="h-8 bg-background/50 border-border text-xs" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button onClick={handleGenerateAI} disabled={isGenerating || !genEmployee} className="w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer"><Wand2 className="h-3.5 w-3.5" />{isGenerating ? "Drafting with AI..." : "Generate Draft"}</Button>
                <Button variant="ghost" onClick={() => setGenerateOpen(false)} className="h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer">Cancel</Button>
              </div>
            </div>
            <div className="md:col-span-3 p-5 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground">Document Draft Preview</span>
                  <Badge variant="outline" className="text-[9px] border-indigo-500/20 text-indigo-500 bg-indigo-500/5">Ready to Save</Badge>
                </div>
                <div className="flex-1 overflow-auto bg-muted/20 border border-border rounded-xl p-4 mt-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                      <p className="font-semibold">AI Assistant drafting letter...</p>
                      <p className="text-[10px] text-muted-foreground/85">Formatting with official templates & clauses</p>
                    </div>
                  ) : generatedDraft ? (generatedDraft) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Wand2 className="h-6 w-6 text-muted-foreground/50 mb-2" />
                      <p className="font-semibold">No Draft Available</p>
                      <p className="text-[10px]">Select an employee, configure parameters, and generate the contract.</p>
                    </div>
                  )}
                </div>
              </div>
              {generatedDraft && (
                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setGeneratedDraft(null)} className="h-9 text-xs border-border bg-transparent cursor-pointer">Clear Draft</Button>
                  <Button onClick={handleSaveGenerated} className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"><CheckCircle className="h-3.5 w-3.5" />Save & Verify Document</Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* REJECT DOCUMENT REASON DIALOG */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500 flex items-center gap-1.5"><AlertTriangle className="h-5 w-5" />Reject Document Compliance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">Please state the reason for rejecting <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>. The employee will see this feedback.</p>
            <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="e.g. Signature cut off, document blur, expired date, wrong employee ID..." className="min-h-[100px] border-border text-xs" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setTargetDoc(null); }} className="h-9 border-border bg-transparent cursor-pointer">Cancel</Button>
            <Button onClick={handleRejectSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DOCUMENT CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground">Delete Document</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">Are you sure you want to permanently delete <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>? This action will wipe the file and remove it from audit history.</div>
          <DialogFooter className="gap-1.5">
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setTargetDoc(null); }} className="h-9 border-border bg-transparent cursor-pointer">Cancel</Button>
            <Button onClick={handleDeleteSubmit} className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer">Delete File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SLIDE-OUT PREVIEW PANEL SHEET */}
      <Sheet open={!!previewDoc} onOpenChange={open => !open && setPreviewDoc(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {previewDoc && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide border-border">{previewDoc.category}</Badge>
                  {previewDoc.status === "Verified" && (<Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border-none shadow-none font-medium text-xs">Verified</Badge>)}
                  {previewDoc.status === "Pending" && (<Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border-none shadow-none font-medium text-xs">Pending Review</Badge>)}
                  {previewDoc.status === "Rejected" && (<Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border-none shadow-none font-medium text-xs">Rejected</Badge>)}
                  {previewDoc.status === "Expired" && (<Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 border-none shadow-none font-medium text-xs">Expired</Badge>)}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={previewDoc.name}>{previewDoc.name}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">Type: {previewDoc.type} &bull; Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadDate}</SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-6">
                  {/* CANVAS GRAPHICAL VISUAL MOCKUP PREVIEW */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Inline Verification View</Label>
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 aspect-[4/3] relative flex items-center justify-center p-4">
                      {previewDoc.type === "Aadhaar Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-sky-50 dark:bg-sky-950/20 border border-sky-300/40 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[7px] font-bold text-sky-800 dark:text-sky-400 uppercase leading-none">Government of India</p>
                              <p className="text-[5px] text-sky-600/80 leading-none">Unique Identification Authority of India</p>
                            </div>
                            <span className="h-5 w-5 bg-sky-200 dark:bg-sky-800 rounded-full opacity-60" />
                          </div>
                          <div className="flex gap-2.5 my-2">
                            <div className="w-12 h-14 bg-sky-200 dark:bg-sky-900 border border-sky-400/20 rounded flex items-center justify-center shrink-0"><User className="h-6 w-6 text-sky-600 dark:text-sky-400" /></div>
                            <div className="text-[6px] space-y-1 text-sky-900 dark:text-sky-200 text-left">
                              <p><strong className="font-semibold text-[8px]">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>DOB: 12/04/1996</p>
                              <p>Gender: Male</p>
                              <p className="mt-1 leading-relaxed text-[5px] opacity-75 text-left">Address: 12th Cross Rd, Indiranagar, Bangalore, 560038</p>
                            </div>
                          </div>
                          <div className="border-t border-sky-400/20 pt-1.5 flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-sky-900 dark:text-sky-100 tracking-wider">1984 0122 1042</span>
                            <span className="text-[5px] uppercase font-bold text-sky-800 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-1 py-0.5 rounded">Mera Aadhaar</span>
                          </div>
                        </div>
                      ) : previewDoc.type === "PAN Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-emerald-400/30 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-center border-b border-emerald-500/20 pb-1.5">
                            <span className="text-[6px] uppercase font-bold text-emerald-800 dark:text-emerald-400 leading-none">Income Tax Department</span>
                            <span className="text-[6px] text-emerald-600 font-medium leading-none">GOVT OF INDIA</span>
                          </div>
                          <div className="flex gap-3 my-2.5">
                            <div className="w-10 h-12 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 rounded flex items-center justify-center shrink-0"><User className="h-6 w-6 text-emerald-600" /></div>
                            <div className="text-[6px] space-y-1 text-emerald-900 dark:text-emerald-100 text-left">
                              <p>Name: <strong className="font-semibold">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>Father's Name: K. M. Lee</p>
                              <p>Date of Birth: 12/04/1996</p>
                              <p className="mt-1 font-mono text-[9px] font-bold text-emerald-900 dark:text-emerald-100 tracking-wide">ABCDE1042F</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[5px]">
                            <span className="italic border-b border-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-mono">{previewDoc.employeeName?.split(" ")[0] || "Jordan"}</span>
                            <span className="h-4 w-4 bg-yellow-400/40 dark:bg-yellow-500/20 rounded-full" />
                          </div>
                        </div>
                      ) : previewDoc.type === "Passport" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start border-b border-slate-700 pb-1">
                            <span className="text-[6px] uppercase font-bold tracking-widest text-slate-400">Republic of India</span>
                            <span className="text-[6px] uppercase font-bold text-slate-400">PASSPORT</span>
                          </div>
                          <div className="flex gap-3.5 my-2">
                            <div className="w-12 h-14 bg-slate-800 border border-slate-700 rounded flex items-center justify-center shrink-0"><User className="h-6 w-6 text-slate-400" /></div>
                            <div className="text-[6px] space-y-0.5 text-slate-300 text-left">
                              <p>Surname: <strong className="font-semibold text-slate-100 uppercase">{previewDoc.employeeName?.split(" ").pop() || "LEE"}</strong></p>
                              <p>Given Names: <strong className="font-semibold text-slate-100">{previewDoc.employeeName?.split(" ")[0] || "JORDAN"}</strong></p>
                              <p>Nationality: Indian</p>
                              <p>Passport No: <span className="font-mono font-bold text-yellow-400">Z3210452</span></p>
                              <p>Expiry: {previewDoc.expiryDate || "2030-01-01"}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[4px] font-mono text-slate-500 tracking-wider">P&lt;IND&lt;&lt;JORDAN&lt;LEE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                        </div>
                      ) : (previewDoc.category === "Company Documents" || previewDoc.type === "Resume" || previewDoc.type === "Offer Letter" || previewDoc.type === "Relieving Letter") ? (
                        <div className="w-[300px] h-[200px] bg-white text-slate-800 border border-slate-300 rounded shadow-md p-4 relative flex flex-col justify-between overflow-hidden select-none">
                          <div className="border-b border-slate-300 pb-2">
                            <p className="text-[7px] font-bold text-slate-900 tracking-wide flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5 text-indigo-600" />AURIX TALENT LABS</p>
                            <p className="text-[5px] text-slate-400 leading-none">Internal Compliance & Human Resources Vault</p>
                          </div>
                          <div className="my-2 text-left space-y-1.5">
                            <p className="text-[8px] font-bold text-slate-900 underline truncate">{previewDoc.name}</p>
                            <p className="text-[5px] text-slate-500 leading-relaxed max-w-full">This document stands as an official record of Aurix HR Talent Labs. Details contained herein are confidential under corporate NDAs and data processing regulations.</p>
                            <p className="text-[5px] text-slate-600 italic">Category: {previewDoc.category} &bull; Type: {previewDoc.type}</p>
                          </div>
                          <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[5px] text-slate-400">
                            <span>Verification Hash: SHA-256</span>
                            <span className="h-3 w-10 bg-indigo-500/10 rounded flex items-center justify-center font-bold text-indigo-600 text-[4px]">SECURE DOC</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[300px] aspect-[4/3] bg-card border border-border rounded flex flex-col items-center justify-center p-4">
                          <FileText className="h-10 w-10 text-muted-foreground/60 mb-2" />
                          <p className="text-xs font-semibold text-foreground text-center truncate w-full">{previewDoc.name}</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1">Generic binary layout view</p>
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">{previewDoc.fileType}</span>
                    </div>
                  </div>

                  {previewDoc.status === "Rejected" && previewDoc.rejectionReason && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold"><AlertCircle className="h-4 w-4 shrink-0" />Rejection Compliance Remarks:</div>
                      <p className="leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left">"{previewDoc.rejectionReason}"</p>
                    </div>
                  )}

                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Document Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div><span className="text-muted-foreground block text-[10px]">Employee Owner</span><strong className="text-foreground mt-0.5 block">{previewDoc.employeeName || "Company-wide"}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">Verification Type</span><strong className="text-foreground mt-0.5 block">{previewDoc.type}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">File Size</span><strong className="text-foreground mt-0.5 block">{previewDoc.fileSize}</strong></div>
                      <div><span className="text-muted-foreground block text-[10px]">Expiry Date</span><strong className="text-foreground mt-0.5 block">{previewDoc.expiryDate || "No expiration date"}</strong></div>
                      <div className="col-span-2"><span className="text-muted-foreground block text-[10px]">Internal Description</span><p className="text-foreground mt-0.5 leading-relaxed">{previewDoc.description || "No description provided."}</p></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Verification Audit Timeline</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0"><CheckCircle className="h-2.5 w-2.5 animate-bounce" /></span>
                        <div><p className="font-bold text-foreground">Uploaded & Saved</p><p className="text-[10px] text-muted-foreground mt-0.5">By {previewDoc.uploadedBy} on {previewDoc.uploadDate}</p></div>
                      </div>
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"}`}>
                          {previewDoc.status === "Pending" ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                        </span>
                        <div><p className="font-bold text-foreground">Compliance Review</p><p className="text-[10px] text-muted-foreground mt-0.5">{previewDoc.status === "Pending" ? "Awaiting review from Human Resources" : "Reviewed by People Ops Officer"}</p></div>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "border border-border text-muted-foreground bg-muted" : previewDoc.status === "Verified" ? "bg-emerald-500 text-white" : previewDoc.status === "Rejected" ? "bg-rose-500 text-white" : "bg-slate-500 text-white"}`}>
                          {previewDoc.status === "Verified" ? (<CheckCircle className="h-2.5 w-2.5" />) : previewDoc.status === "Rejected" ? (<XCircle className="h-2.5 w-2.5" />) : (<Clock className="h-2.5 w-2.5" />)}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Final Compliance Status</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {previewDoc.status === "Verified" && `Verified & Approved`}
                            {previewDoc.status === "Rejected" && `Rejected: ${previewDoc.rejectionReason}`}
                            {previewDoc.status === "Pending" && `Decision pending`}
                            {previewDoc.status === "Expired" && `Expired`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <h5 className="font-bold flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-indigo-500" />Smart Verification Gateways</h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">This component is modularized to support direct APIs for DigiLocker, Aadhaar ID checks, PAN Tax validations, and E-Signatures.</p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {previewDoc.status === "Pending" && (
                  <>
                    <Button variant="outline" onClick={() => handleRequestReupload(previewDoc)} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"><RefreshCw className="h-3.5 w-3.5 text-amber-500" />Request Re-upload</Button>
                    <Button onClick={() => handleRejectPrompt(previewDoc)} className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1.5 cursor-pointer"><XCircle className="h-3.5 w-3.5" />Reject Document</Button>
                    <Button onClick={() => handleVerify(previewDoc)} className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"><CheckCircle className="h-3.5 w-3.5" />Verify & Approve</Button>
                  </>
                )}
                {previewDoc.status !== "Pending" && (
                  <Button variant="outline" onClick={() => { const updatedDocs = docs.map(d => { if (d.id === previewDoc.id) return { ...d, status: "Pending" as const, rejectionReason: undefined }; return d; }); aurix.set({ documents: updatedDocs }); setPreviewDoc({ ...previewDoc, status: "Pending" as const, rejectionReason: undefined }); toast.info("Document reset to Pending review state"); }} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer">Reset Status to Review</Button>
                )}
                <Button variant="outline" onClick={() => handleDownload(previewDoc)} className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"><Download className="h-3.5 w-3.5" />Download</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default DocumentsPage;
