import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { parseApiError } from "@/api/utils";
import { autopilotApi } from "../services/autopilotApi";
import type { AgentChatMessage, AgentToolCall } from "../types";

export const AGENT_SUGGESTIONS = [
  "Apply 2 days casual leave from Monday",
  "Send my last payslip to my email",
  "I need an experience letter generated",
  "Regularize attendance for missed check-in yesterday",
  "Submit ₹2,400 client dinner travel expense",
];

const INITIAL_WELCOME: AgentChatMessage = {
  id: "msg-welcome",
  role: "assistant",
  content:
    "Hello! I am your OneHR Agent. Unlike basic chatbots that only give advice, I can autonomously perform HR tasks for you — like applying leaves, pulling payslips, generating employment letters, or regularizing attendance.\n\nTell me what you need done, and I will prepare the action for your confirmation.",
  timestamp: new Date().toISOString(),
};

export function useAgentChat() {
  const [messages, setMessages] = useState<AgentChatMessage[]>([INITIAL_WELCOME]);
  const [isSending, setIsSending] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationIdRef = useRef<string>(`conv-${Date.now()}`);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError(null);
    const userMsg: AgentChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const response = await autopilotApi.sendAgentMessage({
        message: trimmed,
        conversationId: conversationIdRef.current,
      });

      // Handle stream or JSON response
      let assistantContent = "";
      let toolCall: AgentToolCall | undefined;

      if (response && typeof response === "object") {
        if ("content" in response && typeof response.content === "string") {
          assistantContent = response.content || "";
        }
        if ("toolCall" in response && response.toolCall) {
          toolCall = response.toolCall;
        } else if ("tool_call" in response && response.tool_call) {
          const raw = response.tool_call;
          toolCall = {
            id: raw.id || `tc-${Date.now()}`,
            tool: raw.tool || raw.action,
            action: raw.action,
            parameters: raw.parameters || {},
            expectedEffect: raw.expected_effect || raw.expectedEffect || "",
            status: "proposed",
          };
        }
      }

      // If backend gave neither, fallback to a sensible text response
      if (!assistantContent && !toolCall) {
        assistantContent = "I have received your request and am verifying the applicable HR policies.";
      }

      const assistantMsg: AgentChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toISOString(),
        toolCall,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setBackendUnavailable(false);
    } catch (err: unknown) {
      const { status, message: msg } = parseApiError(err, "Failed to send message to agent");
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        // Render system notice without fake responses
        const pendingMsg: AgentChatMessage = {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content:
            "Feature unavailable — backend pending (/api/v2/autopilot/agent/chat). The autonomous agent backend endpoint is scheduled for deployment. See docs/AUTOPILOT_BACKEND_CONTRACT.md for the API contract.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, pendingMsg]);
      } else {
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setIsSending(false);
    }
  }, []);

  const confirmAction = useCallback(async (toolCallId: string) => {
    // Optimistically update toolCall status to running
    setMessages((prev) =>
      prev.map((m) =>
        m.toolCall?.id === toolCallId
          ? { ...m, toolCall: { ...m.toolCall, status: "running" } }
          : m,
      ),
    );

    try {
      const result = await autopilotApi.confirmAgentAction(toolCallId);
      setMessages((prev) =>
        prev.map((m) =>
          m.toolCall?.id === toolCallId
            ? {
                ...m,
                toolCall: {
                  ...m.toolCall,
                  status: "done",
                  result: {
                    success: result.success,
                    recordId: result.recordId,
                    recordType: result.recordType,
                    recordUrl: result.recordUrl,
                    message: result.message || "Action executed successfully.",
                    canUndo: result.canUndo ?? true,
                    undoActionId: result.undoActionId,
                  },
                },
              }
            : m,
        ),
      );
      toast.success(result.message || "Action executed successfully.");
    } catch (err: unknown) {
      const { status, message } = parseApiError(err, "Action execution failed");
      const errMsg =
        status === 404 || status === 501
          ? "Feature unavailable — backend pending (/api/v2/autopilot/agent/actions/confirm)"
          : message;

      setMessages((prev) =>
        prev.map((m) =>
          m.toolCall?.id === toolCallId
            ? {
                ...m,
                toolCall: {
                  ...m.toolCall,
                  status: "failed",
                  error: errMsg,
                },
              }
            : m,
        ),
      );
      toast.error(errMsg);
    }
  }, []);

  const cancelAction = useCallback(async (toolCallId: string) => {
    try {
      await autopilotApi.cancelAgentAction(toolCallId);
    } catch {
      // Graceful local cancellation even if backend is pending
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.toolCall?.id === toolCallId
          ? {
              ...m,
              toolCall: {
                ...m.toolCall,
                status: "failed",
                error: "Action cancelled by user.",
              },
            }
          : m,
      ),
    );
    toast.info("Action cancelled");
  }, []);

  const undoAction = useCallback(async (actionId: string, reason: string) => {
    try {
      const res = await autopilotApi.undoAuditAction(actionId, reason);
      toast.success(res.message || "Action undone successfully");
      // Update the toolCall in messages to reflect undone
      setMessages((prev) =>
        prev.map((m) =>
          m.toolCall?.result?.undoActionId === actionId || m.toolCall?.id === actionId
            ? {
                ...m,
                toolCall: {
                  ...m.toolCall,
                  status: "done",
                  result: {
                    ...m.toolCall.result!,
                    canUndo: false,
                    message: `Undone: ${reason}`,
                  },
                },
              }
            : m,
        ),
      );
    } catch (err: unknown) {
      const { status, message } = parseApiError(err, "Failed to undo action");
      if (status === 404 || status === 501) {
        toast.error("Feature unavailable — backend pending");
      } else {
        toast.error(message);
      }
    }
  }, []);

  const resetChat = useCallback(() => {
    conversationIdRef.current = `conv-${Date.now()}`;
    setMessages([INITIAL_WELCOME]);
    setError(null);
    setBackendUnavailable(false);
  }, []);

  return {
    messages,
    isSending,
    backendUnavailable,
    error,
    sendMessage,
    confirmAction,
    cancelAction,
    undoAction,
    resetChat,
  };
}
