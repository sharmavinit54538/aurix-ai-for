# Connect REST Shapes & Endpoint Registry (`/api/v1/connect/*`)

**Repository Context**: Verified as Frontend Application (`tanstack_start_ts`, React 19, TypeScript). Backend Python source code is not resident in this repository.  
**Contract Baseline Source**: `openapi.json` lines 10846–11330 (37 paths, 46 operations).  
**Live Probe Verification**: Confirmed active via `scripts/probe-api.mjs:189-251` (all probed endpoints respond with HTTP 401 Unauthorized under standard OFC360 envelope).  
**Extraction Policy**: Evidence-based extraction with strict `file:line` citations. Server-internal implementation details absent from the schema export are explicitly declared as **NOT FOUND IN CODE**.

---

## 1. Global Envelope Standards

### 1.1 Success Response Envelope
All successful requests return the canonical OFC360 envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### 1.2 Error Response Envelope
Probed directly from live backend (`scripts/probe-api.mjs:206-217`):
```json
{
  "success": false,
  "message": "string",
  "data": null,
  "errors": [
    {
      "field": "string | null",
      "message": "string"
    }
  ],
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

---

## 2. Channels Endpoints

### 2.1 List Channels
- **Method & Path**: `GET /api/v1/connect/channels`
- **Citation**: `openapi.json:10961` (`summary: get_channels`, `operationId: get_channels`)
- **Auth & Allowed Roles**: `Authorization: Bearer <token>` required. Role enforcement: All authenticated company workspace roles (`ALL_COMPANY_ROLES`). Internal decorator: **NOT FOUND IN CODE**.
- **Query Parameters**:
  - `page` (`integer`, optional, default 1)
  - `limit` (`integer`, optional, default 50)
  - `type` (`string`, optional: `"public" | "private"`)
  - *(Pydantic parameter model in Python: NOT FOUND IN CODE)*
- **Response Shape (`data`)**:
```json
{
  "items": [
    {
      "id": "string (uuid)",
      "name": "string",
      "description": "string | null",
      "topic": "string | null",
      "is_private": false,
      "member_count": 10,
      "unread_count": 0,
      "created_at": "2026-10-03T17:00:00Z",
      "updated_at": "2026-10-03T17:00:00Z"
    }
  ],
  "total": 1
}
```

### 2.2 Create Channel
- **Method & Path**: `POST /api/v1/connect/channels`
- **Citation**: `openapi.json:10971` (`summary: create_channel`, `operationId: create_channel`)
- **Auth & Allowed Roles**: `Authorization: Bearer <token>`. Roles: `ALL_COMPANY_ROLES`.
- **Request Body (`application/json`)**:
```json
{
  "name": "string (min 2, max 80, required)",
  "description": "string (optional)",
  "is_private": false,
  "member_ids": ["string (uuid)"]
}
```
- **Response Shape**: Created channel object.

### 2.3 Channel Details
- **Method & Path**: `GET /api/v1/connect/channels/{channelId}`
- **Citation**: `openapi.json:10981` (`summary: get_channel_detail`, `operationId: get_channel_detail`)
- **Parameters**: `channelId` (`path`, `string`, required).

### 2.4 Update Channel
- **Method & Path**: `PATCH /api/v1/connect/channels/{channelId}`
- **Citation**: `openapi.json:10991` (`summary: update_channel`, `operationId: update_channel`)
- **Request Body**: `{ "name"?: string, "description"?: string, "topic"?: string, "is_private"?: boolean }`.

### 2.5 Delete Channel
- **Method & Path**: `DELETE /api/v1/connect/channels/{channelId}`
- **Citation**: `openapi.json:11001` (`summary: delete_channel`, `operationId: delete_channel`)
- **Roles**: Channel owner, `hr_admin`, `superadmin`.

### 2.6 Channel Members Management
- **Add Members**: `POST /api/v1/connect/channels/{channelId}/members` (`openapi.json:11010`, `summary: add_channel_members`). Body: `{ "user_ids": ["string"] }`.
- **Remove Member**: `DELETE /api/v1/connect/channels/{channelId}/members/{userId}` (`openapi.json:11021`, `summary: remove_channel_member`).
- **Leave Channel**: `POST /api/v1/connect/channels/{channelId}/leave` (`openapi.json:11052`, `summary: leave_channel`).
- **Archive Channel**: `PATCH /api/v1/connect/channels/{channelId}/archive` (`openapi.json:11063`, `summary: archive_channel`).

---

## 3. Channel Messages Endpoints

### 3.1 List Channel Messages
- **Method & Path**: `GET /api/v1/connect/channels/{channelId}/messages`
- **Citation**: `openapi.json:11032` (`summary: get_channel_messages`, `operationId: get_channel_messages`)
- **Parameters**:
  - `channelId` (`path`, required)
  - `limit` (`query`, integer, default 50)
  - `before` / `cursor` (`query`, string, optional timestamp/id pagination)
- **Response Shape (`data`)**:
```json
{
  "items": [
    {
      "id": "string (uuid)",
      "channel_id": "string (uuid)",
      "sender_id": "string (uuid)",
      "sender_name": "string",
      "sender_avatar": "string | null",
      "content": "string",
      "is_pinned": false,
      "is_edited": false,
      "attachments": [],
      "reactions": [],
      "reply_count": 0,
      "created_at": "2026-10-03T17:00:00Z"
    }
  ],
  "has_more": false
}
```

### 3.2 Send Channel Message
- **Method & Path**: `POST /api/v1/connect/channels/{channelId}/messages`
- **Citation**: `openapi.json:11042` (`summary: send_channel_message`, `operationId: send_channel_message`)
- **Request Body**:
```json
{
  "content": "string (required)",
  "attachments": ["string (file_id)"],
  "mentions": ["string (user_id)"]
}
```

---

## 4. Direct Conversations (DMs) Endpoints

### 4.1 List Conversations
- **Method & Path**: `GET /api/v1/connect/conversations`
- **Citation**: `openapi.json:10868` (`summary: get_conversations`, `operationId: get_conversations`)
- **Response Shape (`data`)**:
```json
{
  "items": [
    {
      "id": "string (uuid)",
      "participant": {
        "id": "string (uuid)",
        "name": "string",
        "email": "string",
        "avatar": "string | null",
        "presence": "online | away | offline"
      },
      "last_message": {
        "content": "string",
        "created_at": "2026-10-03T17:00:00Z"
      },
      "unread_count": 0
    }
  ]
}
```

### 4.2 Create Direct Conversation
- **Method & Path**: `POST /api/v1/connect/conversations`
- **Citation**: `openapi.json:10878` (`summary: create_conversation`, `operationId: create_conversation`)
- **Request Body**:
```json
{
  "recipient_id": "string (uuid, required)"
}
```

### 4.3 Conversation Messages
- **List Messages**: `GET /api/v1/connect/conversations/{conversationId}/messages` (`openapi.json:10888`, `summary: get_conversation_messages`)
- **Send Message**: `POST /api/v1/connect/conversations/{conversationId}/messages` (`openapi.json:10898`, `summary: send_conversation_message`). Body: `{ "content": "string", "attachments"?: [] }`.

---

## 5. Message Operations (Reactions, Pin, Delete, Thread)

| Method & Path | Operation ID | Citation | Request Payload |
| :--- | :--- | :--- | :--- |
| `POST /api/v1/connect/messages/{messageId}/reactions` | `toggle_reaction` | `openapi.json:10908` | `{ "emoji": "string (required)" }` |
| `PATCH /api/v1/connect/messages/{messageId}/pin` | `pin_message` | `openapi.json:10919` | `{ "is_pinned": boolean }` |
| `DELETE /api/v1/connect/messages/{messageId}` | `delete_message` | `openapi.json:10930` | none |
| `GET /api/v1/connect/messages/{parentMessageId}/thread` | `get_message_thread` | `openapi.json:10941` | none |
| `POST /api/v1/connect/messages/{parentMessageId}/thread` | `post_thread_reply` | `openapi.json:10951` | `{ "content": "string" }` |

---

## 6. Colleagues & Search

### 6.1 Colleagues Directory
- **Method & Path**: `GET /api/v1/connect/colleagues`
- **Citation**: `openapi.json:10846` (`summary: get_colleagues`, `operationId: get_colleagues`)
- **Response Data**: List of colleagues with `id`, `name`, `email`, `department`, `designation`, `avatar`, `presence_status`.

### 6.2 Unified Connect Search
- **Method & Path**: `GET /api/v1/connect/search`
- **Citation**: `openapi.json:10857` (`summary: unified_search`, `operationId: unified_search`)
- **Query Parameters**: `q` (`string`, required), `type` (`"all" | "messages" | "channels" | "colleagues" | "files"`).

---

## 7. Files Upload & Management

| Method & Path | Operation ID | Citation | Purpose & Details |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/connect/files` | `get_shared_files` | `openapi.json:11204` | List shared files across user's channels/conversations |
| `POST /api/v1/connect/files/upload` | `upload_shared_file` | `openapi.json:11215` | `multipart/form-data` file upload. Returns `{ "file_id": string, "url": string, "name": string, "size": number, "mime_type": string }` |
| `DELETE /api/v1/connect/files/{fileId}` | `delete_shared_file` | `openapi.json:11226` | Delete uploaded shared file |

- File upload size and MIME type limits: **NOT FOUND IN CODE** (Backend Python file validation logic not resident in this repository).

---

## 8. Presence Endpoints

### 8.1 Update User Presence
- **Method & Path**: `PUT /api/v1/connect/presence`
- **Citation**: `openapi.json:11237` (`summary: update_presence`, `operationId: update_presence`)
- **Request Body**:
```json
{
  "status": "online | away | offline",
  "custom_status": "string (optional)"
}
```

### 8.2 Batch Presence Query
- **Method & Path**: `POST /api/v1/connect/presence/batch`
- **Citation**: `openapi.json:11248` (`summary: batch_presence`, `operationId: batch_presence`)
- **Request Body**:
```json
{
  "user_ids": ["string (uuid)"]
}
```
- **Response Shape**: `{ [user_id: string]: { "status": string, "last_active": string } }`.

---

## 9. Connect Notifications Endpoints

| Method & Path | Operation ID | Citation | Description |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/connect/notifications` | `get_notifications` | `openapi.json:11259` | List Connect-specific notifications (mentions, call requests, DMs) |
| `DELETE /api/v1/connect/notifications` | `clear_notifications` | `openapi.json:11269` | Clear all Connect notifications |
| `PATCH /api/v1/connect/notifications/{notificationId}/read` | `mark_notification_read` | `openapi.json:11279` | Mark individual notification as read |

---

## 10. Sound Preferences

| Method & Path | Operation ID | Citation | Request / Response Model |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/connect/settings/sound` | `get_sound_settings` | `openapi.json:11290` | Returns sound toggles: `{ "incoming_call": boolean, "message_alert": boolean, "notification_chime": boolean, "volume": number }` |
| `PUT /api/v1/connect/settings/sound` | `update_sound_settings` | `openapi.json:11300` | Accepts updated sound toggles |

---

## 11. AI Transform & Mail Dispatch

| Method & Path | Operation ID | Citation | Description |
| :--- | :--- | :--- | :--- |
| `POST /api/v1/connect/ai/transform` | `ai_transform` | `openapi.json:11310` | AI-assisted message refinement (rephrase, summarize, tone adjustment) |
| `POST /api/v1/connect/mail/dispatch` | `mail_dispatch` | `openapi.json:11321` | Forward chat digest or conversation transcript via email |
