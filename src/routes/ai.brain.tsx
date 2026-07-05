import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Send, Sparkles, Loader2, Wrench, ChevronDown, ChevronRight,
  Briefcase, Video, User, Users, Gauge, AlertTriangle, Target, Banknote,
  ShieldCheck, BookOpen, Mail, FileText, BarChart3, Workflow, Library, Crown,
  CheckCircle2, Square, RotateCcw,
} from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AGENT_LIST, AGENTS, type AgentId, type AgentDef } from "@/lib/ai/agents";

export const Route = createFileRoute("/ai/brain")({
  head: () => ({
    meta: [
      { title: "AI Insight 2.0 — Autonomous HR Brain | Aurix" },
      { name: "description", content: "An autonomous AI HR brain: 15+ specialist agents that recruit, evaluate, predict attrition, run payroll, draft letters and more." },
    ],
  }),
  component: BrainPage,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Briefcase, Video, User, Users, Gauge, AlertTriangle, Target, Banknote,
  ShieldCheck, BookOpen, Mail, FileText, BarChart3, Workflow, Library, Crown,
};

const MODELS = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash · fast" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro · reasoning" },
  { id: "openai/gpt-5-mini", label: "GPT-5 mini" },
  { id: "openai/gpt-5", label: "GPT-5 · premium" },
];

function BrainPage() {
  const [agentId, setAgentId] = useState<AgentId>("router");
  const [model, setModel] = useState(MODELS[0].id);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const agent = AGENTS[agentId];

  // Re-create the chat instance when the agent or model changes so the body
  // params are picked up on the next request.
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai-brain", body: { agentId, model } }),
    [agentId, model],
  );

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: `brain:${agentId}:${model}`,
    transport,
    onError: (err) => console.error("[AI Brain]", err),
  });

  const isBusy = status === "submitted" || status === "streaming";
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { inputRef.current?.focus(); }, [agentId, status]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function clear() {
    setMessages([]);
  }

  return (
    <div>
      <AIHero
        icon={Brain}
        eyebrow="AI Insight 2.0"
        title="Autonomous HR Brain"
        description="A multi-agent system that screens, predicts, drafts and recommends across every HR workflow — with human approval gates on anything sensitive."
        lastAnalysis="Live"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        {/* Agent rail */}
        <aside className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl">
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Specialist agents
            </div>
            <div className="max-h-[480px] space-y-1 overflow-y-auto pr-1">
              {AGENT_LIST.map((a) => {
                const Icon = ICONS[a.icon] ?? Brain;
                const active = a.id === agentId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAgentId(a.id)}
                    className={`group flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                      active
                        ? "border-foreground/30 bg-accent shadow-glow"
                        : "border-transparent hover:border-border hover:bg-accent/50"
                    }`}
                  >
                    <div
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${a.accent} text-foreground`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-semibold tracking-tight">
                          {a.name}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-[11px] text-muted-foreground">
                        {a.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Model
            </div>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Streamed via the Lovable AI Gateway. Switch models any time — the
              next message uses the new one.
            </p>
          </div>
        </aside>

        {/* Conversation */}
        <section className="flex h-[640px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <AgentBadge agent={agent} />
              <div>
                <div className="text-sm font-semibold tracking-tight">{agent.name}</div>
                <div className="text-[11px] text-muted-foreground">{agent.tagline}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isBusy && (
                <Button size="sm" variant="outline" onClick={() => stop()} className="gap-1.5">
                  <Square className="h-3 w-3" /> Stop
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={clear} className="gap-1.5 text-muted-foreground">
                <RotateCcw className="h-3 w-3" /> New
              </Button>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-5">
              {messages.length === 0 && (
                <EmptyState agent={agent} onPick={submit} />
              )}
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} agent={agent} />
                ))}
              </AnimatePresence>
              {status === "submitted" && <ThinkingBubble agent={agent} />}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <form
            onSubmit={(e) => { e.preventDefault(); submit(input); }}
            className="border-t border-border p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-foreground/30">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                placeholder={`Ask ${agent.name}…  (Shift+Enter for newline)`}
                rows={1}
                className="min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isBusy}
                className="h-9 gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"
              >
                {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Send
              </Button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3" />
              Actions that mutate data, send communication or affect compensation
              are returned as <em>Proposed actions</em> for human approval.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

function AgentBadge({ agent }: { agent: AgentDef }) {
  const Icon = ICONS[agent.icon] ?? Brain;
  return (
    <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${agent.accent} text-foreground shadow-glow`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function EmptyState({ agent, onPick }: { agent: AgentDef; onPick: (q: string) => void }) {
  return (
    <div className="grid place-items-center py-8 text-center">
      <AgentBadge agent={agent} />
      <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
        Talk to the {agent.name}
      </h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{agent.tagline}</p>
      <div className="mt-5 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {agent.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-card/60 p-3 text-left text-xs text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-glow"
          >
            <Sparkles className="mb-1.5 h-3 w-3 text-muted-foreground" />
            <div className="leading-relaxed">{s}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ThinkingBubble({ agent }: { agent: AgentDef }) {
  return (
    <div className="flex items-start gap-3">
      <AgentBadge agent={agent} />
      <div className="rounded-2xl bg-accent px-4 py-2.5 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {agent.name} is thinking…
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ message, agent }: { message: UIMessage; agent: AgentDef }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <AgentBadge agent={agent} />}
      <div className={`max-w-[78%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {message.parts.map((part, idx) => {
          if (part.type === "text") {
            return (
              <div
                key={idx}
                className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-foreground text-background"
                    : "bg-accent text-foreground"
                }`}
              >
                {part.text}
              </div>
            );
          }
          if (part.type.startsWith("tool-")) {
            return <ToolCard key={idx} part={part as ToolPartLike} />;
          }
          return null;
        })}
      </div>
      {isUser && (
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

interface ToolPartLike {
  type: string;
  toolName?: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}

function ToolCard({ part }: { part: ToolPartLike }) {
  const [open, setOpen] = useState(false);
  const toolName = part.toolName ?? part.type.replace(/^tool-/, "");
  const done = part.state === "output-available" || part.state === "result";
  const failed = part.state === "output-error" || !!part.errorText;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs"
      >
        <span className="flex min-w-0 items-center gap-2">
          {failed ? (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          ) : done ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
          <span className="flex items-center gap-1.5">
            <Wrench className="h-3 w-3 text-muted-foreground" />
            <code className="truncate font-mono text-[12px] text-foreground">{toolName}</code>
          </span>
          <Badge variant="secondary" className="ml-1 text-[10px]">
            {failed ? "error" : done ? "done" : "running"}
          </Badge>
        </span>
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="space-y-2 border-t border-border bg-muted/30 p-3">
          {part.input !== undefined && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Input
              </div>
              <pre className="overflow-x-auto rounded-md bg-background p-2 text-[11px] leading-snug">
                {safeStringify(part.input)}
              </pre>
            </div>
          )}
          {part.output !== undefined && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Output
              </div>
              <pre className="overflow-x-auto rounded-md bg-background p-2 text-[11px] leading-snug">
                {safeStringify(part.output)}
              </pre>
            </div>
          )}
          {part.errorText && (
            <div className="rounded-md bg-destructive/10 p-2 text-[11px] text-destructive">
              {part.errorText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
