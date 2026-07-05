import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getAgent } from "@/lib/ai/agents";
import { hrTools } from "@/lib/ai/hr-tools";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

interface BrainRequestBody {
  messages?: UIMessage[];
  agentId?: string;
  model?: string;
}

const ALLOWED_MODELS = new Set([
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "openai/gpt-5",
  "openai/gpt-5-mini",
]);

export const Route = createFileRoute("/api/ai-brain")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as BrainRequestBody;
        const { messages, agentId, model: modelOverride } = body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const agent = getAgent(agentId);
        const modelName =
          modelOverride && ALLOWED_MODELS.has(modelOverride)
            ? modelOverride
            : "google/gemini-3-flash-preview";

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway(modelName),
            system: agent.system,
            messages: await convertToModelMessages(messages),
            tools: hrTools,
            stopWhen: stepCountIs(50),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            headers: {
              "X-Aurix-Agent": agent.id,
              "X-Aurix-Model": modelName,
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          return new Response(
            JSON.stringify({ error: "AI Brain stream failed", detail: message }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});