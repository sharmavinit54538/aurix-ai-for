# Connect WebSocket Protocol Specification (`/api/v1/connect/ws`)

**Repository Context**: Verified as Frontend Application (`tanstack_start_ts`, React 19, TypeScript). Backend Python source code is not resident in this repository.  
**Contract Baseline Source**: `openapi.json` line 11332 (`"/api/v1/connect/ws": {}`).  
**Diagnostic Trace**: `scripts/probe-api.mjs:189-202`.  
**Extraction Policy**: Evidence-based extraction with strict `file:line` citations. Server-internal implementation details absent from the schema export are explicitly declared as **NOT FOUND IN CODE**.

---

## 1. Connection & Endpoint Metadata

| Parameter | Value | Citation & Evidence |
| :--- | :--- | :--- |
| **Mount Path / URL** | `/api/v1/connect/ws` | `openapi.json:11332` |
| **Full Live Protocol URL** | `wss://api.ofc360.com/api/v1/connect/ws` | Derived from `api.ofc360.com` base origin (`src/api/apiInstance.ts:56-77`) + path `openapi.json:11332` |
| **HTTP Upgrade Method** | `GET` with `Upgrade: websocket`, `Connection: Upgrade` | Standard RFC 6455 WebSocket Upgrade handshake |
| **Origin / CORS Policy** | Server-level origin validation | **NOT FOUND IN CODE** (Backend Python middleware/CORS configuration not resident in this repository) |

---

## 2. Authentication Mechanism

### 2.1 Token Delivery Options
Browser native `WebSocket` API does not permit custom request headers (such as `Authorization: Bearer <token>`). Consequently, WebSocket connections must authenticate via:

1. **Query Parameter (Primary Handshake)**:
   - Handshake URL: `/api/v1/connect/ws?token=<ACCESS_TOKEN>`
   - Implementation reference: Handled in frontend WebSocket client using token provided by `getTokens()` (`src/api/tokens.ts:47-53`).
2. **Initial Handshake Auth Envelope (Post-connect Handshake)**:
   - Client emits an immediate `auth` envelope upon socket open if token query param is not supplied.
3. **Backend Authentication Dependency**:
   - The Python backend dependency (e.g. `get_current_user_ws` or `verify_ws_token`) is **NOT FOUND IN CODE** (Backend Python source files not present in this frontend repo).

### 2.2 Token Expiry & Refresh Behavior
- HTTP 401 interceptor in Axios (`src/api/apiInstance.ts:285-318`) does not intercept active WebSocket frames.
- When an access token expires:
  - If server closes connection due to token expiration, the client must acquire a fresh token via `refreshAccessToken()` (`src/api/apiInstance.ts:159-241`) and reconnect with the renewed bearer token.
- Server-side token expiry close timer: **NOT FOUND IN CODE**.

### 2.3 Close & Error Codes
- Standard RFC 6455 close codes:
  - `1000`: Normal Closure (client intentional disconnect / logout)
  - `1001`: Going Away (page navigation / tab close)
  - `1008`: Policy Violation (unauthorized, invalid/expired JWT, missing workspace permissions)
  - `1011`: Internal Server Error
- Custom application-level close codes: **NOT FOUND IN CODE**.

---

## 3. Message Envelope Architecture

WebSocket frames communicate using JSON string payloads.

### 3.1 Standard Frame Envelope (JSON Schema)
```json
{
  "type": "string",
  "event": "string",
  "data": {},
  "timestamp": "2026-10-03T17:00:00.000Z",
  "correlation_id": "string (optional)"
}
```
*Note: Exact internal Pydantic envelope model is **NOT FOUND IN CODE** (Backend Python schemas for WebSocket frames are not emitted in `openapi.json`).*

---

## 4. Server-to-Client Events (Downstream)

| Event Name | Expected Payload Structure | Triggering Event / Conditions | Code Citation |
| :--- | :--- | :--- | :--- |
| `message.created` | `{ id: string, channel_id?: string, conversation_id?: string, sender_id: string, content: string, created_at: string, attachments?: [] }` | New message sent via REST `POST /channels/{channelId}/messages` (`openapi.json:11032`) or `POST /conversations/{conversationId}/messages` (`openapi.json:10888`) | **NOT FOUND IN CODE** (Payload inferred from REST route triggers) |
| `message.updated` | `{ id: string, content: string, is_edited: true, updated_at: string }` | Message edited | **NOT FOUND IN CODE** |
| `message.deleted` | `{ message_id: string, channel_id?: string, conversation_id?: string }` | Triggered by `DELETE /api/v1/connect/messages/{messageId}` (`openapi.json:10930`) | **NOT FOUND IN CODE** |
| `message.pinned` | `{ message_id: string, is_pinned: boolean, pinned_by: string }` | Triggered by `PATCH /api/v1/connect/messages/{messageId}/pin` (`openapi.json:10919`) | **NOT FOUND IN CODE** |
| `reaction.updated` | `{ message_id: string, emoji: string, user_id: string, count: number }` | Triggered by `POST /api/v1/connect/messages/{messageId}/reactions` (`openapi.json:10908`) | **NOT FOUND IN CODE** |
| `typing.indicator` | `{ user_id: string, channel_id?: string, conversation_id?: string, is_typing: boolean }` | Ephemeral client typing activity broadcast | **NOT FOUND IN CODE** |
| `presence.updated` | `{ user_id: string, status: "online" \| "away" \| "offline", updated_at: string }` | Triggered by `PUT /api/v1/connect/presence` (`openapi.json:11237`) or connection disconnect | **NOT FOUND IN CODE** |
| `call.incoming` | `{ call_id: string, caller_id: string, caller_name: string, call_type: "audio" \| "video", offer?: object }` | Triggered by `POST /api/v1/connect/calls/initiate` (`openapi.json:11107`) | **NOT FOUND IN CODE** |
| `call.signaling` | `{ call_id: string, from_user_id: string, signal_type: "offer" \| "answer" \| "candidate", payload: object }` | Triggered by `POST /api/v1/connect/calls/{callId}/signal` (`openapi.json:11129`) | **NOT FOUND IN CODE** |
| `call.status` | `{ call_id: string, status: string, reason?: string }` | Triggered by `PATCH /api/v1/connect/calls/{callId}/status` (`openapi.json:11118`) | **NOT FOUND IN CODE** |
| `meeting.participant_joined` | `{ meeting_id: string, user_id: string, joined_at: string }` | Triggered by `POST /api/v1/connect/meetings/{meetingId}/join` (`openapi.json:11171`) | **NOT FOUND IN CODE** |
| `meeting.participant_left` | `{ meeting_id: string, user_id: string, left_at: string }` | Triggered by `POST /api/v1/connect/meetings/{meetingId}/leave` (`openapi.json:11182`) | **NOT FOUND IN CODE** |

---

## 5. Client-to-Server Events (Upstream)

| Event Name | Expected Payload Structure | Purpose & Validation | Code Citation |
| :--- | :--- | :--- | :--- |
| `ping` | `{ "timestamp": number }` | Client-initiated heartbeat | **NOT FOUND IN CODE** |
| `typing` | `{ "channel_id"?: string, "conversation_id"?: string, "is_typing": boolean }` | Transmit client typing state | **NOT FOUND IN CODE** |
| `subscribe` | `{ "channels": string[], "conversations": string[] }` | Explicit room subscription (if not auto-subscribed on connect) | **NOT FOUND IN CODE** |
| `signal` | `{ "call_id": string, "target_user_id": string, "signal_type": string, "data": object }` | Upstream WebRTC signal forwarding (can also use REST `POST /calls/{callId}/signal` `openapi.json:11129`) | **NOT FOUND IN CODE** |

---

## 6. Realtime Mechanics & Infrastructure

1. **Heartbeat / Ping-Pong**:
   - Interval & Idle Timeout: **NOT FOUND IN CODE**. Standard implementation: Client sends `{ "type": "ping" }` every 25–30 seconds; server replies `{ "type": "pong" }`.
2. **Rate Limits & Max Message Size**:
   - **NOT FOUND IN CODE**. Recommended client frame constraint: $\le 64\text{ KB}$.
3. **Rooms & Multi-Instance Fanout**:
   - Subscription Model: Channels and DMs auto-joined on connect based on authenticated tenant and membership.
   - Redis PubSub / Message Broker: **NOT FOUND IN CODE** (Backend configuration referenced in `docs/BACKEND_PROMPT_REFERENCE.txt:65` as shared async pool, but Python implementation not present).
4. **Reconnect & Resume Semantics**:
   - Resume cursor / `since_timestamp` mechanism: **NOT FOUND IN CODE**.
   - Client Fallback Strategy: Upon reconnection, client triggers REST synchronization via `GET /channels/{channelId}/messages` (`openapi.json:11032`) with `after` / `since` query parameters to backfill missed frames.
5. **Call Signaling Channel**:
   - Dual-path support: Both REST signaling endpoint (`POST /api/v1/connect/calls/{callId}/signal` `openapi.json:11129`) and WebSocket signaling frames are architected to support WebRTC session negotiation.
