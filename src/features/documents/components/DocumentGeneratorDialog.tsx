import React, { useState } from "react";
import { Wand2, FileText, CreditCard, FileCode2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HrLettersSection } from "./sections/HrLettersSection";
import { IdCardsSection } from "./sections/IdCardsSection";
import { TemplatesSection } from "./sections/TemplatesSection";

interface DocumentGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "letters" | "id-cards" | "templates";
}

export const DocumentGeneratorDialog: React.FC<DocumentGeneratorDialogProps> = ({
  open,
  onOpenChange,
  defaultTab = "letters",
}) => {
  const [activeTab, setActiveTab] = useState<"letters" | "id-cards" | "templates">(defaultTab);

  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton={true}
        className="sm:max-w-6xl w-[96vw] max-h-[92vh] flex flex-col p-0 gap-0 bg-background border-border shadow-2xl overflow-hidden"
      >
        {/* Header with Title, Generator Buttons, and Close Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 px-6 border-b border-border bg-card/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Wand2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
                HR Letters & Digital Identity Suite
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Generate official employment letters, issue employee ID cards, and manage document templates.
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Generator Sections">
              <Button
                type="button"
                variant={activeTab === "letters" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("letters")}
                className={`h-9 px-3.5 text-xs font-semibold gap-2 transition-all cursor-pointer shadow-sm rounded-lg ${
                  activeTab === "letters"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ring-1 ring-primary/40"
                    : "border-border bg-card/70 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className={`h-4 w-4 ${activeTab === "letters" ? "text-primary-foreground" : "text-primary"}`} />
                <span>HR Letters</span>
              </Button>

              <Button
                type="button"
                variant={activeTab === "id-cards" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("id-cards")}
                className={`h-9 px-3.5 text-xs font-semibold gap-2 transition-all cursor-pointer shadow-sm rounded-lg ${
                  activeTab === "id-cards"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ring-1 ring-primary/40"
                    : "border-border bg-card/70 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard className={`h-4 w-4 ${activeTab === "id-cards" ? "text-primary-foreground" : "text-indigo-400"}`} />
                <span>Employee ID Cards</span>
              </Button>

              <Button
                type="button"
                variant={activeTab === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("templates")}
                className={`h-9 px-3.5 text-xs font-semibold gap-2 transition-all cursor-pointer shadow-sm rounded-lg ${
                  activeTab === "templates"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md ring-1 ring-primary/40"
                    : "border-border bg-card/70 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileCode2 className={`h-4 w-4 ${activeTab === "templates" ? "text-primary-foreground" : "text-amber-400"}`} />
                <span>Document Templates</span>
              </Button>
            </div>

            <div className="h-6 w-px bg-border/80 hidden sm:block" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-xl border border-border/70 bg-card/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground shadow-sm transition-all cursor-pointer shrink-0"
              title="Close (Esc)"
              aria-label="Close dialog"
            >
              <X className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Generator Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-card/10">
          {activeTab === "letters" && <HrLettersSection />}
          {activeTab === "id-cards" && <IdCardsSection />}
          {activeTab === "templates" && <TemplatesSection />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
