import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import type { ExitCase } from "../../types";

interface InterviewTabProps {
  detailCase: ExitCase;
  intReason: string;
  setIntReason: (val: string) => void;
  intRating: number;
  setIntRating: (val: number) => void;
  intMgrFeedback: string;
  setIntMgrFeedback: (val: string) => void;
  intCompFeedback: string;
  setIntCompFeedback: (val: string) => void;
  intSuggestions: string;
  setIntSuggestions: (val: string) => void;
  onSaveInterview: (exit: ExitCase) => void;
}

export function InterviewTab({
  detailCase,
  intReason,
  setIntReason,
  intRating,
  setIntRating,
  intMgrFeedback,
  setIntMgrFeedback,
  intCompFeedback,
  setIntCompFeedback,
  intSuggestions,
  setIntSuggestions,
  onSaveInterview,
}: InterviewTabProps) {
  return (
    <TabsContent value="interview" className="space-y-4 mt-0 text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Exit Interview Feedback Report
      </h4>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Reason for departure</Label>
        <Input
          value={intReason}
          onChange={(e) => setIntReason(e.target.value)}
          className="bg-background/50 border-border text-xs h-8"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Work Experience Rating (1-5)</Label>
        <div className="flex gap-1.5 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setIntRating(star)} className="cursor-pointer">
              <Star
                className={`h-5 w-5 ${
                  star <= intRating ? "text-primary fill-primary" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Reporting Manager Feedback</Label>
        <Textarea
          value={intMgrFeedback}
          onChange={(e) => setIntMgrFeedback(e.target.value)}
          placeholder="Review management and transitions..."
          className="min-h-[50px] bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Company Work Environment Feedback</Label>
        <Textarea
          value={intCompFeedback}
          onChange={(e) => setIntCompFeedback(e.target.value)}
          placeholder="Review culture, growth opportunities..."
          className="min-h-[50px] bg-background/50 border-border text-xs"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Suggestions for Improvement</Label>
        <Textarea
          value={intSuggestions}
          onChange={(e) => setIntSuggestions(e.target.value)}
          placeholder="How can OFC360 retain talent better?"
          className="min-h-[50px] bg-background/50 border-border text-xs"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="button"
          onClick={() => onSaveInterview(detailCase)}
          className="h-8 text-xs cursor-pointer"
        >
          Save Interview Responses
        </Button>
      </div>
    </TabsContent>
  );
}
