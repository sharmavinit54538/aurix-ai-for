import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Send,
  Sparkles,
  FileText,
  Briefcase,
  CalendarDays,
  Banknote,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  askPolicyQuestion,
  fetchPolicyAssistantDashboard,
} from "@/store/policyAssistant/policyAssistantThunk";
import {
  selectPolicyAssistantAsking,
  selectPolicyAssistantError,
  selectPolicyAssistantLoading,
  selectPolicyAssistantMessages,
  selectPolicyAssistantSummary,
} from "@/store/policyAssistant/policyAssistantSelectors";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ai/policy-assistant")({
  head: () => ({ meta: [{ title: "AI Policy Assistant — OFC360" }] }),
  component: Page,
});

const SUGGESTIONS = [
  { icon: CalendarDays, q: "How many casual leaves are allowed per year?" },
  { icon: Briefcase, q: "What's the notice period for senior roles?" },
  { icon: Banknote, q: "When is payroll processed each month?" },
  { icon: FileText, q: "What documents are needed for reimbursement?" },
];

function Page() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectPolicyAssistantLoading);
  const asking = useAppSelector(selectPolicyAssistantAsking);
  const error = useAppSelector(selectPolicyAssistantError);
  const msgs = useAppSelector(selectPolicyAssistantMessages);
  const summary = useAppSelector(selectPolicyAssistantSummary);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchPolicyAssistantDashboard());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, asking]);

  function ask(q: string) {
    if (!q.trim() || asking) return;
    dispatch(askPolicyQuestion(q.trim()));
    setInput("");
  }

  if (loading && (!msgs || msgs.length === 0) && !summary) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-[520px] rounded-2xl lg:col-span-2" />
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AIHero
        icon={BookOpen}
        eyebrow="AI Policy Assistant"
        title="Your company knowledge base, on tap"
        description="Ask questions about HR, leave, attendance, payroll and policy — get instant, sourced answers."
        lastAnalysis={summary?.lastAnalysis ?? "Live Knowledge Base"}
      />

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchPolicyAssistantDashboard())}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex h-[520px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl lg:col-span-2">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-accent text-foreground"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 border-t border-border/40 pt-1 text-[11px] text-muted-foreground">
                      <span className="font-semibold">Sources:</span>
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="rounded bg-background/50 px-1 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {asking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Searching company policies…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={input}
              disabled={asking}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about leave, payroll, HR policy…"
            />
            <Button type="submit" disabled={asking || !input.trim()} className="gap-1.5">
              {asking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" /> Try asking
          </div>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.q}
                  type="button"
                  disabled={asking}
                  onClick={() => ask(s.q)}
                  className="flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-sm transition-colors hover:border-foreground/20 hover:bg-accent/60 disabled:opacity-50"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span>{s.q}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
