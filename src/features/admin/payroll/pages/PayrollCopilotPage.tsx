import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopilotMessageBubble } from "../components/CopilotMessageBubble";

const SUGGESTIONS = [
  "Calculate net salary from gross 80,000 with standard deductions",
  "Explain TDS slabs for FY 2025-26",
  "Draft a payslip email to an employee",
  "Checklist to close this month's payroll",
];

export function PayrollCopilotPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: "payroll-copilot",
    transport: new DefaultChatTransport({ api: "/api/payroll-copilot" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  async function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
  }

  return (
    <>
      <PageHeader
        title="AI Payroll Copilot"
        description="Ask anything about salaries, tax, compliance, deductions and payroll workflows."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex h-[calc(100vh-220px)] flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div
                  className="mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg font-semibold">How can I help with payroll today?</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  I can compute salaries, explain compliance, draft messages, and walk you through any payroll task.
                </p>
                <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-lg border border-border bg-background/40 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => <CopilotMessageBubble key={m.id} message={m} />)
            )}
            {status === "submitted" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" /> Thinking…
              </div>
            ) : null}
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-end gap-2 border-t border-border bg-background/40 p-3"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask the Payroll Copilot…"
              rows={1}
              className="min-h-[44px] max-h-40 flex-1 resize-none"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </form>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <h3 className="mb-2 font-medium">What I can do</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Salary & net-pay calculations</li>
              <li>• Tax (TDS, PF, ESI) guidance</li>
              <li>• Compliance & filing checklists</li>
              <li>• Draft payslip / approval emails</li>
              <li>• Explain deductions, bonuses, overtime</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-4 text-xs text-muted-foreground">
            Responses are AI-generated. Verify figures before processing real payroll.
          </div>
        </aside>
      </div>
    </>
  );
}
