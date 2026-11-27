import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import axios, { AxiosError } from "axios";
import apiInstance, { API_TIMEOUTS, getEndpointTimeout } from "@/api/apiInstance";
import { formatMarkdownForRender } from "@/pages/ChatAssistantPage";
import { setTokens, clearTokens } from "@/api/tokens";
import { aiHubApi, normalizeAIError, AIRequestError } from "../aiHub.api";

describe("AI Hub Timeouts, Error Normalization, and SSE Streaming", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearTokens();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearTokens();
  });

  it("keeps standard global timeout at 15s and assigns endpoint-specific AI timeouts", () => {
    expect(apiInstance.defaults.timeout).toBe(15_000);
    expect(API_TIMEOUTS.standard).toBe(15_000);
    expect(API_TIMEOUTS.chatHistory).toBe(15_000);
    expect(API_TIMEOUTS.aiMessage).toBe(120_000);
    expect(API_TIMEOUTS.aiComplex).toBe(180_000);

    expect(getEndpointTimeout("/api/v1/employees")).toBe(15_000);
    expect(getEndpointTimeout("/api/v1/ai-hub/chat-assistant/conversations")).toBe(15_000);
    expect(getEndpointTimeout("/api/v1/ai-hub/chat-assistant/history/abc")).toBe(15_000);
    expect(getEndpointTimeout("/api/v1/ai-hub/chat-assistant/message")).toBe(120_000);
    expect(getEndpointTimeout("/api/v1/ai-hub/chat-assistant/stream")).toBe(120_000);
    expect(getEndpointTimeout("/api/v1/ai-hub/chat-assistant/report")).toBe(180_000);
    expect(getEndpointTimeout("/api/v1/ai/workforce/forecast")).toBe(180_000);
  });

  it("replaces raw timeout/network/HTTP technical errors with user-friendly messages", () => {
    const timeoutErr = new AxiosError("timeout of 15000ms exceeded", "ECONNABORTED");
    expect(normalizeAIError(timeoutErr).message).toBe(
      "The assistant is taking longer than expected.",
    );

    const networkErr = new AxiosError("Network Error", "ERR_NETWORK");
    expect(normalizeAIError(networkErr).message).toContain("Unable to connect");

    const err403 = { isAxiosError: true, response: { status: 403, data: {} } };
    vi.spyOn(axios, "isAxiosError").mockImplementation(
      (e) => Boolean((e as { isAxiosError?: boolean })?.isAxiosError),
    );
    expect(normalizeAIError(err403).message).toContain("permission");

    const err429 = { isAxiosError: true, response: { status: 429, headers: { "retry-after": "3" }, data: {} } };
    const norm429 = normalizeAIError(err429);
    expect(norm429.retryable).toBe(true);
    expect(norm429.retryAfterMs).toBe(3000);

    const err503 = { isAxiosError: true, response: { status: 503, data: {} } };
    expect(normalizeAIError(err503).message).toContain("temporarily unavailable");
  });

  it("parses real SSE status, incremental chunk, heartbeat, and complete events", async () => {
    const encoder = new TextEncoder();
    const ssePayload = [
      'event: status\ndata: {"status":"accepted","conversationId":"conv-1","clientMessageId":"cm-1"}\n\n',
      'event: heartbeat\ndata: {"ts":123}\n\n',
      'event: chunk\ndata: {"delta":"Hello ","content":"Hello ","conversationId":"conv-1","clientMessageId":"cm-1","model":"llama3.2:3b"}\n\n',
      'event: chunk\ndata: {"delta":"there!","content":"Hello there!","conversationId":"conv-1","clientMessageId":"cm-1","model":"llama3.2:3b"}\n\n',
      'event: complete\ndata: {"answer":"Hello there!","conversationId":"conv-1","messageId":"m-1","clientMessageId":"cm-1","status":"completed"}\n\n',
    ].join("");

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(ssePayload));
        controller.close();
      },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );

    const statuses: string[] = [];
    const chunks: string[] = [];
    const result = await aiHubApi.streamChatMessage(
      { conversationId: "conv-1", content: "hii", clientMessageId: "cm-1" },
      {
        onStatus: (evt) => statuses.push(evt.status),
        onChunk: (evt) => chunks.push(evt.content),
      },
    );

    expect(statuses).toEqual(["accepted"]);
    expect(chunks).toEqual(["Hello ", "Hello there!"]);
    expect(result.content).toBe("Hello there!");
    expect(result.status).toBe("completed");
    expect(result.conversationId).toBe("conv-1");
  });

  it("refreshes access token once on 401 and retries stream without duplicating", async () => {
    setTokens({ accessToken: "expired-token" });
    const encoder = new TextEncoder();
    const ssePayload =
      'event: complete\ndata: {"answer":"Recovered response","conversationId":"conv-9","messageId":"m-9","clientMessageId":"cm-401"}\n\n';

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: "Expired" }), { status: 401 }))
      .mockResolvedValueOnce(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(ssePayload));
              controller.close();
            },
          }),
          { status: 200, headers: { "Content-Type": "text/event-stream" } },
        ),
      );

    // refreshAccessToken calls axios.post directly to avoid interceptor recursion
    vi.spyOn(axios, "post").mockResolvedValueOnce({
      status: 200,
      data: { access_token: "fresh-token", refresh_token: "fresh-refresh" },
    } as never);

    const res = await aiHubApi.streamChatMessage(
      { conversationId: "conv-9", content: "hi", clientMessageId: "cm-401" },
      {},
    );

    expect(res.content).toBe("Recovered response");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reconciles status cleanly if stream disconnects after backend acceptance", async () => {
    const encoder = new TextEncoder();
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                'event: status\ndata: {"status":"accepted","conversationId":"conv-rec","clientMessageId":"cm-rec"}\n\n',
              ),
            );
            controller.close(); // Premature close before complete event
          },
        }),
        { status: 200, headers: { "Content-Type": "text/event-stream" } },
      ),
    );

    vi.spyOn(apiInstance, "get").mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          conversationId: "conv-rec",
          clientMessageId: "cm-rec",
          status: "completed",
          found: true,
          response: {
            answer: "Reconciled answer from DB",
            conversationId: "conv-rec",
            clientMessageId: "cm-rec",
          },
        },
      },
    } as never);

    const res = await aiHubApi.streamChatMessage(
      { conversationId: "conv-rec", content: "hii", clientMessageId: "cm-rec" },
      {},
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res.content).toBe("Reconciled answer from DB");
  });

  it("handles AbortController stop-generating cancellation cleanly", async () => {
    const abortCtrl = new AbortController();
    vi.spyOn(globalThis, "fetch").mockImplementationOnce((_url, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const promise = aiHubApi.streamChatMessage(
      { conversationId: "conv-stop", content: "long query", clientMessageId: "cm-stop" },
      {},
      { signal: abortCtrl.signal },
    );

    abortCtrl.abort();
    await expect(promise).rejects.toThrow(AIRequestError);
    await expect(promise).rejects.toMatchObject({ code: "cancelled" });
  });

  it("normalizes inline collapsed GFM markdown tables without splitting headers", () => {
    const inline =
      "Department Distribution: | Department | Number of Employees | | --- | --- | | Developer | 1 | | IT | 1 |";
    const formatted = formatMarkdownForRender(inline);
    expect(formatted).toBe(
      [
        "Department Distribution:",
        "",
        "| Department | Number of Employees |",
        "| --- | --- |",
        "| Developer | 1 |",
        "| IT | 1 |",
      ].join("\n"),
    );

    const headerOnly =
      "| Category | Value | | --- | --- | | Health Score | 40.0/100 |";
    expect(formatMarkdownForRender(headerOnly)).toBe(
      ["| Category | Value |", "| --- | --- |", "| Health Score | 40.0/100 |"].join("\n"),
    );
  });
});
