import React, { useState } from "react";
import { Wand2, FileText, CreditCard, FileCode2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <DialogContent className="sm:max-w-6xl w-[96vw] max-h-[92vh] flex flex-col p-0 gap-0 bg-background border-border shadow-2xl overflow-hidden">
        {/* Header with Title and Generator Tabs */}
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

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "letters" | "id-cards" | "templates")}
          >
            <TabsList className="bg-background/90 border border-border h-9 p-1">
              <TabsTrigger value="letters" className="text-xs gap-1.5 px-3 cursor-pointer">
                <FileText className="h-3.5 w-3.5 text-primary" />
                HR Letters
              </TabsTrigger>
              <TabsTrigger value="id-cards" className="text-xs gap-1.5 px-3 cursor-pointer">
                <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
                Employee ID Cards
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs gap-1.5 px-3 cursor-pointer">
                <FileCode2 className="h-3.5 w-3.5 text-amber-500" />
                Document Templates
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
