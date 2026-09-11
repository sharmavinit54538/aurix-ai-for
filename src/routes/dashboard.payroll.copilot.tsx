import { createFileRoute } from "@tanstack/react-router";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  payrollCopilotApi,
  type CopilotMessage,
} from "@/services/payrollCopilotApi";

export const Route = createFileRoute("/dashboard/payroll/copilot")({
  head: () => ({ meta: [{ title: "AI Payroll Copilot — OFC360" }] }),
  component: PayrollCopilotPage,
});

function renderFormattedText(text: string) {
  // Strip any leftover hashtags
  const clean = text.replace(/^#+\s*/g, "");
  const parts = clean.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-white">
          {inner}
        </strong>
      );
    }
    return part;
  });
}

function FormattedMessageContent({ content }: { content: string }) {
  // Strip raw hashtags from line starts
  const cleaned = content.replace(/^#+\s*/gm, "");
  const lines = cleaned.split("\n");

  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header style for title lines (e.g., 📊 ... or 🧮 ... or 🛡️ ...)
        if (
          idx === 0 ||
          trimmed.startsWith("📊") ||
          trimmed.startsWith("🧮") ||
          trimmed.startsWith("🛡️") ||
          trimmed.startsWith("⚙️") ||
          trimmed.startsWith("💸") ||
          trimmed.startsWith("🤖")
        ) {
          return (
            <div key={idx} className="mb-2 text-sm font-bold text-white">
              {renderFormattedText(trimmed)}
            </div>
          );
        }

        // Bullet items
        if (trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.replace(/^([•\-\*]\s*)/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <div>{renderFormattedText(bulletText)}</div>
            </div>
          );
        }

        return <div key={idx}>{renderFormattedText(trimmed)}</div>;
      })}
    </div>
  );
}

function PayrollCopilotPage() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await payrollCopilotApi.getHistory();
        setMessages(history);
      } catch {
        toast.error("Failed to load payroll copilot history.");
      } finally {
        setIsBootstrapping(false);
      }
    }

    void loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isBootstrapping) {
      inputRef.current?.focus();
    }
  }, [isBootstrapping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const reply = await payrollCopilotApi.sendMessage(query, nextMessages);
      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      setMessages((prev) => prev.filter((message) => message.id !== userMessage.id));
      const message =
        error instanceof Error ? error.message : "Failed to connect to AI Payroll Copilot engine.";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClear = async () => {
    try {
      await payrollCopilotApi.clearHistory();
      setMessages([]);
      toast.info("Cleared Copilot chat session.");
    } catch {
      toast.error("Failed to clear payroll copilot session.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied message to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <PayrollBackButton />
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="AI Payroll Copilot & Compliance Assistant"
          description="Ask anything about salaries, statutory tax slabs, PF/ESI deductions, compliance, payslips, and payroll closing workflows."
        />

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleClear()}
            className="h-8 gap-1.5 self-start border-white/10 bg-white/[0.03] text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Session
          </Button>
        )}
      </div>

      <div className="flex h-[calc(100vh-210px)] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1526]/80 shadow-2xl backdrop-blur-xl">
        <div ref={scrollRef} className="sp-table-scroll flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {isBootstrapping ? (
            <div className="flex h-full items-center justify-center gap-2 text-xs text-indigo-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 text-indigo-400 shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                AI Payroll Copilot
              </h2>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">
                Ask a payroll or compliance question below to get started.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                    msg.role === "user"
                      ? "border-indigo-500/30 bg-indigo-600 text-white"
                      : "border-indigo-500/40 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 text-indigo-300 shadow-md shadow-indigo-500/20"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-indigo-300" />}
                </div>

                <div className="max-w-[88%] space-y-2">
                  <div
                    className={`relative rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-indigo-600/90 text-white"
                        : "rounded-tl-none border border-white/[0.08] bg-[#121a2f] text-slate-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="absolute right-2.5 top-2.5 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : null}

                    <FormattedMessageContent content={msg.content} />

                    {msg.metadata?.tableData ? (
                      <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-2">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="border-b border-white/10 font-bold text-indigo-300">
                              {msg.metadata.tableData.headers.map((header, index) => (
                                <th key={index} className="p-2">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {msg.metadata.tableData.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-white/5">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="p-2 font-mono text-slate-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-60">
                      <span>{msg.timestamp}</span>
                      {msg.role === "assistant" ? <span>OFC360 Copilot</span> : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading ? (
            <div className="flex max-w-xs items-center gap-2.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-xs text-indigo-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span>OFC360 Copilot is computing response...</span>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-end gap-2 border-t border-white/[0.08] bg-[#121a2f] p-3"
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ask about salary calculations, tax slabs, PF, ESI, or compliance..."
            rows={1}
            disabled={isBootstrapping}
            className="max-h-36 min-h-[44px] flex-1 resize-none rounded-xl border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-slate-500 focus:border-indigo-500/50"
          />

          <Button
            type="submit"
            disabled={isLoading || isBootstrapping || !input.trim()}
            className="h-11 border border-indigo-500/40 bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 disabled:opacity-40"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Send
          </Button>
        </form>
      </div>
    </div>
  );
}
