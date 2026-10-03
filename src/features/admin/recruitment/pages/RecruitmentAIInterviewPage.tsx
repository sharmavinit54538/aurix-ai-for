import { useState } from "react";
import { Sparkles, Bot, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInterviewResultsTab } from "./AIInterviewResultsTab";
import { AIInterviewSimulatorPage } from "./AIInterviewSimulatorPage";

export function RecruitmentAIInterviewPage() {
  const [activeTab, setActiveTab] = useState<string>("results");

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
              AI Interview Bot
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Automated Assessments
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Send conversational AI interview invitations, review transcripts, assess integrity signals, and make hiring decisions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="results" className="gap-2 text-xs">
            <Bot className="h-3.5 w-3.5" /> Candidate Runs &amp; Results
          </TabsTrigger>
          <TabsTrigger value="simulator" className="gap-2 text-xs">
            <PlayCircle className="h-3.5 w-3.5" /> Practice Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-0">
          <AIInterviewResultsTab />
        </TabsContent>

        <TabsContent value="simulator" className="mt-0">
          <AIInterviewSimulatorPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RecruitmentAIInterviewPage;
