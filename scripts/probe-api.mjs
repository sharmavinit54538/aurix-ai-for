#!/usr/bin/env node
/**
 * scripts/probe-api.mjs
 * Dev diagnostic tool to inspect API response shapes WITHOUT printing sensitive values or tokens.
 *
 * Usage:
 *   node scripts/probe-api.mjs [--token <jwt>] [--url <baseUrl>] [--endpoint <path>] [--allow-write]
 *
 * Rules:
 *   - Strictly GET by default; write operations blocked unless --allow-write is passed.
 *   - Only outputs data types, object keys, array lengths, and response headers.
 *   - Zero values or credentials (STUN/TURN credentials, auth tokens, message texts) are ever output.
 */

import fs from "fs";
import path from "path";

// ── 1. Read environment and CLI flags ─────────────────────────────
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        envVars[key] = val;
      }
    }
  }
  return envVars;
}

const env = loadEnv();
const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

const hasFlag = (name) => args.includes(name);

if (hasFlag("--help") || hasFlag("-h")) {
  console.log(`
OFC360 API Probe Tool (Read-Only Shape Inspector)
=================================================
Inspects backend endpoints and prints their structural schema without logging values or PII.

Options:
  --token <jwt>        Bearer authentication token (or set ACCESS_TOKEN env variable)
  --url <url>          Base URL (default: from .env VITE_API_URL or https://api.ofc360.com)
  --endpoint <path>    Probe a single specific endpoint (e.g. /api/v1/connect/channels)
  --allow-write        Required if probing any non-GET endpoint (safety guard)
  --help, -h           Show this help message
`);
  process.exit(0);
}

const BASE_URL = (getArg("--url") || process.env.API_BASE_URL || env.VITE_API_URL || "https://api.ofc360.com").replace(/\/+$/, "");
const TOKEN = getArg("--token") || process.env.ACCESS_TOKEN || env.VITE_ACCESS_TOKEN || "";
const ALLOW_WRITE = hasFlag("--allow-write");
const SINGLE_ENDPOINT = getArg("--endpoint");

// ── 2. Safe Structural Shape Extractor ────────────────────────────
const SENSITIVE_KEYS = new Set([
  "credential",
  "password",
  "token",
  "secret",
  "access_token",
  "refresh_token",
  "authorization",
]);

function extractShape(val, depth = 0) {
  if (depth > 6) return "[MaxDepthReached]";
  if (val === null) return "null";
  if (val === undefined) return "undefined";

  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === "symbol") {
    return t;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return "Array<empty>";
    return {
      type: "Array",
      length: val.length,
      sampleItemShape: extractShape(val[0], depth + 1),
    };
  }

  if (t === "object") {
    const shape = {};
    for (const [k, v] of Object.entries(val)) {
      if (SENSITIVE_KEYS.has(k.toLowerCase())) {
        shape[k] = `[REDACTED_TYPE: ${typeof v}]`;
      } else {
        shape[k] = extractShape(v, depth + 1);
      }
    }
    return shape;
  }

  return t;
}

// ── 3. Request Runner ─────────────────────────────────────────────
async function probeEndpoint(endpointPath, method = "GET") {
  if (method !== "GET" && !ALLOW_WRITE) {
    return {
      endpoint: endpointPath,
      method,
      error: "Write operations blocked. Pass --allow-write flag to enable non-GET probing.",
    };
  }

  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`;
  const fullUrl = `${BASE_URL}${cleanPath}`;

  const headers = {
    Accept: "application/json",
  };
  if (TOKEN) {
    headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
    });

    const relevantHeaders = {};
    for (const [k, v] of res.headers.entries()) {
      if (
        k.startsWith("x-") ||
        k.includes("content-type") ||
        k.includes("pagination") ||
        k.includes("total")
      ) {
        relevantHeaders[k] = v;
      }
    }

    let bodyData = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      bodyData = await res.json();
    } else {
      const text = await res.text();
      bodyData = `[Non-JSON Content: length ${text.length}]`;
    }

    return {
      endpoint: endpointPath,
      status: res.status,
      statusText: res.statusText,
      headers: relevantHeaders,
      shape: extractShape(bodyData),
      rawBodyForIdExtraction: typeof bodyData === "object" ? bodyData : null,
    };
  } catch (err) {
    return {
      endpoint: endpointPath,
      status: 0,
      error: err.message,
    };
  }
}

// ── 4. Main Probe Runner ──────────────────────────────────────────
async function main() {
  console.log(`\n======================================================`);
  console.log(`[PROBE] Target API Base: ${BASE_URL}`);
  console.log(`[PROBE] Auth Token: ${TOKEN ? "Configured (Bearer ****)" : "NOT CONFIGURED (Public/Unauthenticated)"}`);
  console.log(`[PROBE] Mode: ${ALLOW_WRITE ? "Read/Write Allowed" : "Strictly Read-Only (GET only)"}`);
  console.log(`======================================================\n`);

  const endpointsToProbe = SINGLE_ENDPOINT
    ? [SINGLE_ENDPOINT]
    : [
        "/api/v1/connect/channels",
        "/api/v1/connect/conversations",
        "/api/v1/connect/colleagues",
        "/api/v1/connect/files",
        "/api/v1/connect/notifications",
        "/api/v1/connect/calls/ice-servers",
        "/api/v1/connect/calls/history",
        "/api/v1/connect/meetings",
        "/api/v1/connect/settings/sound",
      ];

  let discoveredChannelId = null;

  for (const ep of endpointsToProbe) {
    process.stdout.write(`Probing ${ep} ... `);
    const result = await probeEndpoint(ep);
    console.log(`HTTP ${result.status} ${result.statusText || ""}`);

    console.log(JSON.stringify({
      endpoint: result.endpoint,
      status: result.status,
      headers: result.headers,
      responseShape: result.shape,
      ...(result.error ? { error: result.error } : {}),
    }, null, 2));
    console.log("------------------------------------------------------\n");

    // Attempt channel ID discovery for nested message probe
    if (ep === "/api/v1/connect/channels" && result.rawBodyForIdExtraction && !discoveredChannelId) {
      const body = result.rawBodyForIdExtraction;
      const items = Array.isArray(body)
        ? body
        : Array.isArray(body.items)
        ? body.items
        : Array.isArray(body.data?.items)
        ? body.data.items
        : Array.isArray(body.data)
        ? body.data
        : [];

      if (items.length > 0 && items[0]?.id) {
        discoveredChannelId = items[0].id;
      }
    }
  }

  // Nested probe if a channel ID was discovered
  if (!SINGLE_ENDPOINT && discoveredChannelId) {
    const messagesEp = `/api/v1/connect/channels/${discoveredChannelId}/messages`;
    process.stdout.write(`Discovered channel ID. Probing ${messagesEp} ... `);
    const result = await probeEndpoint(messagesEp);
    console.log(`HTTP ${result.status} ${result.statusText || ""}`);
    console.log(JSON.stringify({
      endpoint: result.endpoint,
      status: result.status,
      headers: result.headers,
      responseShape: result.shape,
    }, null, 2));
    console.log("------------------------------------------------------\n");
  }

  console.log(`[PROBE] Run complete.\n`);
}

main();
