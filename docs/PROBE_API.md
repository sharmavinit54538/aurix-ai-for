# API Shape Probe Diagnostic Tool (`scripts/probe-api.mjs`)

## Purpose
`scripts/probe-api.mjs` is an automated, developer-only diagnostic tool designed to discover and inspect backend response shapes from `api.ofc360.com` or local environments without violating security, privacy, or contract rules.

## Core Safety Constraints
1. **Zero Values / PII / Credentials**:
   - The tool extracts ONLY structural schemas (`typeof`, object key names, array counts, and header names).
   - Sensitive keys (`credential`, `password`, `token`, `secret`, `access_token`, `refresh_token`, `authorization`) are automatically redacted with `[REDACTED_TYPE: <type>]`.
   - Message contents, usernames, participant names, and ICE candidate strings are never printed.
2. **Read-Only Default**:
   - Strictly executes `GET` requests.
   - Any write method (`POST`, `PUT`, `PATCH`, `DELETE`) is hard-blocked unless `--allow-write` is explicitly passed.
3. **Automated Discovery**:
   - When probing `/api/v1/connect/channels`, if a channel ID is present, it automatically probes the nested `/api/v1/connect/channels/{id}/messages` endpoint.

## Running the Probe Tool

```bash
# Basic probe (unauthenticated / public probe)
node scripts/probe-api.mjs

# Probe with bearer token from browser DevTools
node scripts/probe-api.mjs --token "<jwt_token_from_network_tab>"

# Probe a single endpoint
node scripts/probe-api.mjs --endpoint "/api/v1/connect/calls/ice-servers" --token "<jwt>"

# Pointing to local backend
node scripts/probe-api.mjs --url "http://localhost:8000" --token "<jwt>"
```

## Sample Safe Output
```json
{
  "endpoint": "/api/v1/connect/channels",
  "status": 200,
  "headers": {
    "content-type": "application/json",
    "x-process-time": "12ms"
  },
  "responseShape": {
    "success": "boolean",
    "data": {
      "type": "Array",
      "length": 3,
      "sampleItemShape": {
        "id": "string",
        "name": "string",
        "topic": "string",
        "is_private": "boolean",
        "members_count": "number",
        "unread_count": "number"
      }
    }
  }
}
```
