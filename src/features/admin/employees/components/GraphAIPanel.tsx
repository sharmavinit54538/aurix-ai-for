import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Brain,
  AlertTriangle,
  Network,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OrganizationalGraphData } from "@/store/employeeHierarchy/organizationalGraphTypes";

interface GraphAIPanelProps {
  graphData: OrganizationalGraphData | null;
  messages: { role: "user" | "assistant"; content: string; timestamp: string }[];
  processing: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

// ── Local AI that queries graph data. READ-ONLY. ──────────────────
function queryGraphData(query: string, graphData: OrganizationalGraphData | null): string {
  if (!graphData || graphData.nodes.length === 0) {
    return "Organizational graph data is not available. Please ensure employees and organizational data exist in the system.";
  }

  const q = query.toLowerCase().trim();
  const nodes = graphData.nodes;
  const rels = graphData.relationships;

  // "Who reports to [name]?"
  const reportsToMatch = q.match(/who\s+reports?\s+to\s+(.+?)[\?]?$/);
  if (reportsToMatch) {
    const name = reportsToMatch[1].trim().toLowerCase();
    const manager = nodes.find(
      (n) => (n.type === "employee" || n.type === "manager") && n.label.toLowerCase().includes(name)
    );
    if (!manager) return `No employee matching "${reportsToMatch[1].trim()}" found in the organizational data.`;

    const reportRels = rels.filter((r) => r.type === "REPORTS_TO" && r.targetNodeId === manager.id);
    if (reportRels.length === 0) return `No direct reports found for ${manager.label}.`;

    const reporters = reportRels
      .map((r) => nodes.find((n) => n.id === r.sourceNodeId))
      .filter(Boolean);
    return `${manager.label} has ${reporters.length} direct report(s):\n\n${reporters
      .map((r) => `• ${r!.label} — ${r!.subtitle || r!.type}`)
      .join("\n")}`;
  }

  // "Which projects are connected to [name]?"
  const projectMatch = q.match(/(?:which|what)\s+projects?\s+(?:are|is)\s+(?:connected|assigned|related)\s+to\s+(.+?)[\?]?$/);
  if (projectMatch) {
    const name = projectMatch[1].trim().toLowerCase();
    const emp = nodes.find(
      (n) => (n.type === "employee" || n.type === "manager") && n.label.toLowerCase().includes(name)
    );
    if (!emp) return `No employee matching "${projectMatch[1].trim()}" found.`;

    const projectRels = rels.filter(
      (r) =>
        (r.type === "ASSIGNED_TO" || r.type === "WORKS_ON") &&
        (r.sourceNodeId === emp.id || r.targetNodeId === emp.id)
    );
    if (projectRels.length === 0) return `No project relationships configured for ${emp.label}. Relationship data is not available.`;

    const projects = projectRels
      .map((r) => {
        const id = r.sourceNodeId === emp.id ? r.targetNodeId : r.sourceNodeId;
        return nodes.find((n) => n.id === id);
      })
      .filter(Boolean);
    return `Projects connected to ${emp.label}:\n\n${projects
      .map((p) => `• ${p!.label}`)
      .join("\n")}`;
  }

  // "Which skills are available in [team/department]?"
  const skillsMatch = q.match(/(?:which|what)\s+skills?\s+(?:are|is)\s+(?:available|present)\s+(?:in|for)\s+(.+?)[\?]?$/);
  if (skillsMatch) {
    const name = skillsMatch[1].trim().toLowerCase();
    // Find department
    const dept = nodes.find(
      (n) => n.type === "department" && n.label.toLowerCase().includes(name)
    );
    if (!dept) return `No department matching "${skillsMatch[1].trim()}" found.`;

    // Find members
    const memberRels = rels.filter((r) => r.type === "MEMBER_OF" && r.targetNodeId === dept.id);
    const memberIds = new Set(memberRels.map((r) => r.sourceNodeId));

    // Find skills of members
    const skillRels = rels.filter((r) => r.type === "HAS_SKILL" && memberIds.has(r.sourceNodeId));
    if (skillRels.length === 0) return `No skill data available for ${dept.label} team members.`;

    const skills = new Set(
      skillRels
        .map((r) => nodes.find((n) => n.id === r.targetNodeId))
        .filter(Boolean)
        .map((n) => n!.label)
    );
    return `Skills available in ${dept.label} (${memberIds.size} members):\n\n${Array.from(skills)
      .map((s) => `• ${s}`)
      .join("\n")}`;
  }

  // "How many employees?"
  if (q.includes("how many employees") || q.includes("total workforce") || q.includes("total employees")) {
    const empCount = nodes.filter((n) => n.type === "employee" || n.type === "manager").length;
    const mgrCount = nodes.filter((n) => n.type === "manager").length;
    const deptCount = nodes.filter((n) => n.type === "department").length;
    return `Organizational Overview:\n\n• Total Workforce: ${empCount} employees\n• Managers: ${mgrCount}\n• Departments: ${deptCount}\n• Skills tracked: ${nodes.filter((n) => n.type === "skill").length}\n• Total relationships: ${rels.length}`;
  }

  // "Show departments" or "list departments"
  if (q.includes("department") && (q.includes("show") || q.includes("list") || q.includes("which"))) {
    const depts = nodes.filter((n) => n.type === "department");
    if (depts.length === 0) return "No departments found in the organizational data.";
    return `Departments (${depts.length}):\n\n${depts.map((d) => `• ${d.label}`).join("\n")}`;
  }

  // "Who is [name]?"
  const whoIsMatch = q.match(/(?:who\s+is|find|search|show)\s+(.+?)[\?]?$/);
  if (whoIsMatch) {
    const name = whoIsMatch[1].trim().toLowerCase();
    const found = nodes.filter(
      (n) => n.label.toLowerCase().includes(name) || 
             (n.metadata?.employeeId && String(n.metadata.employeeId).toLowerCase().includes(name))
    );
    if (found.length === 0) return `No matching entity found for "${whoIsMatch[1].trim()}" in the organizational data.`;
    
    return found.slice(0, 5).map((n) => {
      const info = [`**${n.label}** (${n.type})`];
      if (n.subtitle) info.push(`Designation: ${n.subtitle}`);
      if (n.description) info.push(`Department: ${n.description}`);
      if (n.metadata?.employeeId) info.push(`ID: ${n.metadata.employeeId}`);
      
      const nodeRels = rels.filter((r) => r.sourceNodeId === n.id || r.targetNodeId === n.id);
      info.push(`Connections: ${nodeRels.length} relationship(s)`);
      
      return info.join("\n");
    }).join("\n\n---\n\n");
  }

  // Default
  return `I can help you explore the organizational graph. Try questions like:\n\n• "Who reports to [manager name]?"\n• "How many employees?"\n• "Which skills are available in [department]?"\n• "Who is [employee name]?"\n• "Show departments"\n\nNote: I can only answer questions based on available organizational data. If a relationship has not been configured, I will indicate that the data is not available.`;
}

export function GraphAIPanel({
  graphData,
  messages,
  processing,
  onSendMessage,
  onClose,
}: GraphAIPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (directMessage?: string) => {
    const msg = (directMessage || input).trim();
    if (!msg) return;
    setInput("");

    // Send user message
    onSendMessage(msg);

    // Generate AI response from graph data (READ-ONLY)
    setTimeout(() => {
      const response = queryGraphData(msg, graphData);
      onSendMessage(`__AI_RESPONSE__${response}`);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQueries = [
    "How many employees?",
    "Show departments",
    "Who reports to the CEO?",
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-6 left-6 z-40 w-[400px] max-w-[calc(100vw-48px)] rounded-2xl border border-brand/30 bg-card/95 shadow-2xl backdrop-blur-xl flex flex-col max-h-[70vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 p-3 pb-2 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-xs font-bold text-foreground">Organizational Intelligence</h3>
              <p className="text-[10px] text-muted-foreground">Read-only analysis • Real data only</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3 min-h-[200px]">
          {messages.length === 0 && (
            <div className="text-center py-4 space-y-3">
              <Sparkles className="h-8 w-8 mx-auto text-brand/50" />
              <p className="text-[11px] text-muted-foreground">
                Ask questions about your organizational structure. I analyze only real data — never inventing relationships.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {suggestedQueries.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand/15 text-foreground border border-brand/20"
                    : "bg-accent/40 text-foreground border border-border/50"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1 text-[9px] text-brand font-semibold mb-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Analysis
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}

          {processing && (
            <div className="flex justify-start">
              <div className="rounded-xl px-3 py-2 bg-accent/40 border border-border/50">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about organizational relationships..."
              className="text-xs h-8 bg-muted/20 border-border/60"
            />
            <Button
              variant="default"
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || processing}
              className="h-8 w-8 shrink-0 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <AlertTriangle className="h-2.5 w-2.5 text-amber-400" />
            <span className="text-[9px] text-muted-foreground">
              Read-only analysis. Cannot modify data. Respects RBAC boundaries.
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
