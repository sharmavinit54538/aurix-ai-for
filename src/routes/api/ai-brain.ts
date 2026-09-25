import { createAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getAgent } from "@/lib/ai/agents";
import { createHrTools } from "@/lib/ai/hr-tools";
import { requireAuth } from "@/lib/require-auth.server";
import { checkRateLimit } from "@/lib/rate-limiter.server";
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

const MAX_PAYLOAD_BYTES = 100 * 1024; // 100KB
const MAX_MESSAGES_COUNT = 40;

export const Route = createFileRoute("/api/ai-brain")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // ── 1. Authentication Guard ─────────────────────────────────
        const auth = await requireAuth(request);
        if (auth.error) {
          return auth.error;
        }

        // ── 2. Rate Limiting (per authenticated user) ───────────────
        const rateLimit = checkRateLimit(auth.user.id);
        if (!rateLimit.allowed) {
          return new Response(
            JSON.stringify({
              error: rateLimit.reason || "Too Many Requests",
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(rateLimit.retryAfterSeconds ?? 60),
                "X-RateLimit-Limit": String(rateLimit.limit ?? 20),
                "X-RateLimit-Remaining": "0",
              },
            },
          );
        }

        // ── 3. Payload Extraction & Parsing with Size Check ─────────
        let body: BrainRequestBody;
        try {
          const rawText = await request.text();
          if (rawText.length > MAX_PAYLOAD_BYTES) {
            return new Response(
              JSON.stringify({ error: "Payload too large (maximum allowed size is 100KB)" }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          body = JSON.parse(rawText) as BrainRequestBody;
        } catch {
          return new Response(
            JSON.stringify({ error: "Malformed or invalid JSON in request body" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const { messages, agentId, model: modelOverride } = body;

        // ── 4. Message Validation ───────────────────────────────────
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(
            JSON.stringify({ error: "Messages array is required and must not be empty" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        if (messages.length > MAX_MESSAGES_COUNT) {
          return new Response(
            JSON.stringify({
              error: `Too many messages in conversation (maximum allowed is ${MAX_MESSAGES_COUNT})`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const key = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
        if (!key) {
          return new Response(
            JSON.stringify({ error: "AI service is temporarily unavailable" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        const agent = getAgent(agentId);
        const modelName =
          modelOverride && ALLOWED_MODELS.has(modelOverride)
            ? modelOverride
            : "google/gemini-3-flash-preview";

        const gateway = createAiGatewayProvider(key);

        // Scope HR tools with the user's verified token and role
        const tools = createHrTools({
          token: auth.token,
          role: auth.user.role || undefined,
        });

        try {
          const result = streamText({
            model: gateway(modelName),
            system: agent.system,
            messages: await convertToModelMessages(messages),
            tools,
            stopWhen: stepCountIs(8),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            headers: {
              "X-OFC360-Agent": agent.id,
              "X-OFC360-Model": modelName,
            },
          });
        } catch (err) {
          // Log internal error on server; never leak stack traces or internal errors to client
          console.error("[ai-brain] Streaming execution error:", err);
          return new Response(
            JSON.stringify({ error: "AI Brain processing failed. Please try again later." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});