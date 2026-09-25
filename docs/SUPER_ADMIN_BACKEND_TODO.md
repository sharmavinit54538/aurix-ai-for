# SUPER ADMIN — BACKEND CONTRACT & TODO

Generated: 2026-09-25
Frontend scope: `/dashboard/super-admin/*` (`src/features/superAdmin/**`)
Backend: FastAPI repository `apiofc360`, router `app/api/super_admin.py` mounted at `/api/v1/super-admin`

---

## 1. Summary

The Super Admin frontend used to call `/api/super-admin/*`. In production those routes return **HTTP 404**, and every call
silently fell back to hard-coded users, organizations, audit logs, health metrics and browser-stored settings.

The frontend now calls the real router at **`/api/v1/super-admin/*`**. It consumes only values that are read from
PostgreSQL or measured, and it shows loading, empty, error (with retry) and access-denied states. It no longer falls back to
local data.

Production route existence was checked on 2026-09-25 without credentials: registered + protected routes answer
`401 Not authenticated` (or `405` for POST-only routes on GET), unregistered routes answer `404 Not Found`.

| Probe | Result |
| --- | --- |
| `GET /api/super-admin/overview` (old frontend path) | **404** |
| `GET /api/v1/super-admin/overview` | **404** (no such route) |
| `GET /api/v1/super-admin/{statistics,users,organizations,audit-logs,system-health,settings,security/sessions}` | 401 (exists) |
| `GET /api/v1/super-admin/users/{id}/activate` | 405 (POST route exists) |
| `GET /health` | 200 — `version: 1.0.0`, `environment: production` |
| `GET /health/ready` | 503 — `ready: false`, `llm.providers.ollama: false` |

## 2. Endpoints used by the frontend

All `/api/v1/super-admin/*` routes are protected by `require_super_admin` (`app/core/rbac.py`): role claim must be
`super_admin`, email claim must be the designated account, and the user is re-loaded from the DB and must be active.
The frontend layout additionally blocks every non-`super_admin` role before any request is made.

| Endpoint | Method | Params | Used by | Data source |
| --- | --- | --- | --- | --- |
| `/api/v1/super-admin/statistics` | GET | — | Overview, Users, Organizations, Analytics | `COUNT(*)` over `users`, `companies`, `employees`, `subscriptions` |
| `/api/v1/super-admin/users` | GET | `page`, `page_size` (≤200), `search`, `role`, `status`, `organization_id` | Overview, Users, Settings, Analytics | `users` + `companies` |
| `/api/v1/super-admin/users/{id}/activate` | POST | — | Users | `UPDATE users SET is_active = true` + audit row |
| `/api/v1/super-admin/users/{id}/deactivate` | POST | — | Users | `UPDATE users SET is_active = false` + audit row |
| `/api/v1/super-admin/organizations` | GET | `page`, `page_size`, `search`, `status` (`active` / `trial`) | Overview, Organizations, Audit Logs, Activity, Analytics | `companies`, `subscriptions`, grouped user/employee counts |
| `/api/v1/super-admin/audit-logs` | GET | `page`, `page_size`, `search` | Overview, Audit Logs, Activity | `audit_logs` |
| `/api/v1/super-admin/security/sessions` | GET | — | Activity | `refresh_tokens` (non-revoked, non-expired, newest 50) |
| `/api/v1/super-admin/system-health` | GET | — | Overview, Platform Configuration | `SELECT 1` latency (only the PostgreSQL entry is read) |
| `/api/v1/super-admin/settings` | GET / PATCH | PATCH body: changed keys only | Settings | in-memory dict (see §4) |
| `/health` | GET (public) | — | Overview, Platform Configuration | app version/environment + DB connectivity |
| `/health/ready` | GET (public) | — | Platform Configuration | DB + LLM provider health (503 = not ready) |

### Client-side aggregation (no server endpoint yet)

The Analytics screen builds monthly sign-up charts, sign-in recency buckets, role/plan distributions and the largest
tenants from the real `/users` and `/organizations` records. It pages through them (200 per request), stopping at
5,000 users or 2,000 organizations. When a cap is reached the screen says so explicitly. The endpoints in §5 would move
this work into SQL.

## 3. Backend fields the frontend deliberately ignores

These values are synthesized rather than measured, so the UI never displays them.

| Endpoint | Field(s) | Why ignored |
| --- | --- | --- |
| `/statistics` | `kpis.dau` | `int(active_users * 0.7)`, an estimate rather than telemetry |
| `/statistics` | `kpis.mau` | equals `total_users` |
| `/statistics` | `kpis.expired_organizations`, `financials.revenue_growth`, `financials.pending_payments`, `financials.failed_payments` | constant `0` |
| `/statistics` | `financials.total_revenue`, `charts.revenue_trend` | projection of current MRR over company creation months, not revenue actually collected; no currency |
| `/statistics` | `charts.subscription_distribution` | tenants without a plan are counted as `"Starter"` |
| `/statistics` | `kpis.active_security_incidents` | keyword match on actions, which includes routine events such as `SECURITY_POLICY_UPDATE` |
| `/organizations` | `storageUsedGb` | never written (always `0.0`) |
| `/organizations` | `industry` / `location` | default to `"General"` / `"Global"` |
| `/organizations` | `payment_status`, `access_*` | defaults applied when no subscription exists |
| `/organizations` | `mrr` | no currency |
| `/users` | `company_name` for users without a company | literal `"Global Platform"` |
| `/users` | `lastLogin` | literal `"Never"`; the frontend reads `last_login` instead |
| `/audit-logs` | `actorEmail` | defaults to `superadmin@ofc360.com` when no actor was recorded |
| `/audit-logs` | `ip`, `ip_address` | default to `127.0.0.1` |
| `/audit-logs` | `resource` | constant `PLATFORM_RESOURCE` |
| `/audit-logs` | `result` | derived from the action name |
| `/security/sessions` | `ipAddress`, `device` | default to `127.0.0.1` / `Desktop` |
| `/security/sessions` | `location`, `browser`, `os`, `lastActivity`, `status` | constant strings |
| `/system-health` | FastAPI / JWT / Storage entries | constant `14ms` / `0.8ms` / `32ms`, always `ONLINE` |
| `/security` | whole endpoint | `security_score` is a formula; `active_sessions_count` is `max(1, n)`; `failed_logins_24h` counts any action containing "fail" (logins are not audited) |
| `/analytics`, `/analytics/ai-usage`, `/plans`, `/entitlements`, `/payments`, `/announcements` | whole endpoints | hard-coded numbers, invoice numbers, gateway and currency, or seeded in-memory lists |

## 4. Backend fixes required

### P0 — correctness / security
- [ ] **Protect the platform owner.** `POST /users/{id}/deactivate`, `/toggle-status`, `DELETE /users/{id}` and
      `PATCH /users/{id}` can target the Super Admin account. Because `require_super_admin` rejects inactive users, this
      would lock the platform owner out. Reject these calls with 409/403 when the target is the designated Super Admin.
      The frontend already hides the action for Super Admin rows.
- [ ] **Record real audit metadata.** `record_super_admin_audit()` defaults `email="superadmin@ofc360.com"` and
      `ip_address="127.0.0.1"`. Pass the actor email from the JWT claims and the client IP from the request
      (`X-Forwarded-For` behind the proxy).
- [ ] **Stop swallowing errors.** `/users`, `/organizations`, `/audit-logs`, `/security/sessions`, `/onboarding`,
      `/subscriptions` and `/payments` wrap everything in `except Exception: return []`. A DB failure is then
      indistinguishable from "no data". Raise `HTTPException(500)` as `/statistics` does. Until then, the frontend flags an
      empty list whose statistics report records as a possible server failure.

### P1 — remove synthesized values
- [ ] `/audit-logs`: return `null` for unknown `actorEmail`/`ip`. Drop the constant `resource`, or store a real resource type.
- [ ] `/security/sessions`: return the real `refresh_tokens.ip_address` and `device` columns, or `null`. Drop the
      constant `location`/`browser`/`os`/`lastActivity`.
- [ ] `/system-health`: measure each listed dependency, or list only measured ones. Consider adding pool stats
      (`engine.pool.status()`) and Redis ping.
- [ ] `/statistics`: remove `dau`/`mau`, or compute them from real activity. Remove the constant financial fields and
      expose a currency with `mrr`. Report tenants without a plan as `null`.
- [ ] **Audit sign-ins.** Write `LOGIN_SUCCESS` / `LOGIN_FAILED` rows to `audit_logs`. Today only
      `users.last_login_at` and `failed_login_attempts` are updated, so security metrics cannot be computed.

### P1 — platform settings
- [ ] `GLOBAL_PLATFORM_SETTINGS` lives in process memory. It resets on restart and can diverge between workers. Persist
      it in a `platform_settings` table.
- [ ] None of the settings are enforced anywhere in the backend (grep finds no reader outside `super_admin.py`). Wire
      `maintenanceMode`, `allowNewRegistrations`, `enforceMfaGlobally` and `sessionTimeoutMinutes` into middleware and
      auth flows, or remove them. The Settings screen currently says this.

### P2 — API ergonomics
- [ ] Add pagination metadata (`total`, `page`, `page_size`) and `sort`/`order` parameters to list endpoints.
- [ ] `/organizations?status=`: `trial`, `suspended` and `deactivated` all map to `onboarding_completed = false`. Filter
      on subscription `access_status` instead. The UI exposes only the onboarding filter, which the backend applies
      correctly.
- [ ] Replace or remove the hard-coded `/analytics`, `/analytics/ai-usage`, `/plans`, `/entitlements`, `/payments` and
      the in-memory `/announcements`.

## 5. Proposed aggregation endpoints (reference implementation)

These replace the client-side aggregation in §2. Add them to `app/api/super_admin.py`; `require_super_admin` applies
automatically through the router dependency.

```python
def _month_start(now: datetime, months_back: int) -> datetime:
    year, month = now.year, now.month - months_back
    while month <= 0:
        month += 12
        year -= 1
    return now.replace(year=year, month=month, day=1, hour=0, minute=0, second=0, microsecond=0)


@router.get("/analytics/registrations")
async def get_registration_trend(
    months: int = Query(12, ge=1, le=36),
    db: AsyncSession = Depends(get_db_session),
) -> dict[str, Any]:
    """New users and organizations per calendar month (UTC), straight from PostgreSQL."""
    now = datetime.now(timezone.utc)
    since = _month_start(now, months - 1)

    user_month = func.date_trunc("month", User.created_at).label("month")
    user_rows = await db.execute(
        select(user_month, func.count(User.id))
        .where(User.created_at >= since, (User.is_deleted.is_(False) | User.is_deleted.is_(None)))
        .group_by(user_month)
    )
    org_month = func.date_trunc("month", Company.created_at).label("month")
    org_rows = await db.execute(
        select(org_month, func.count(Company.id)).where(Company.created_at >= since).group_by(org_month)
    )

    users_by_month = {m.strftime("%Y-%m"): c for m, c in user_rows.all()}
    orgs_by_month = {m.strftime("%Y-%m"): c for m, c in org_rows.all()}
    series = []
    for offset in range(months - 1, -1, -1):
        key = _month_start(now, offset).strftime("%Y-%m")
        series.append({"month": key, "users": users_by_month.get(key, 0), "organizations": orgs_by_month.get(key, 0)})
    return {"months": series}


@router.get("/analytics/sign-in-activity")
async def get_sign_in_activity(db: AsyncSession = Depends(get_db_session)) -> dict[str, Any]:
    """Mutually exclusive buckets by users.last_login_at across all non-deleted accounts."""
    now = datetime.now(timezone.utc)
    not_deleted = User.is_deleted.is_(False) | User.is_deleted.is_(None)
    last = User.last_login_at
    buckets = {
        "last_24h": last >= now - timedelta(days=1),
        "days_1_7": (last < now - timedelta(days=1)) & (last >= now - timedelta(days=7)),
        "days_8_30": (last < now - timedelta(days=7)) & (last >= now - timedelta(days=30)),
        "over_30_days": last < now - timedelta(days=30),
        "never": last.is_(None),
    }
    result = {}
    for key, condition in buckets.items():
        result[key] = (await db.execute(select(func.count(User.id)).where(not_deleted, condition))).scalar() or 0
    return result
```

Once deployed, `useAnalyticsDataset()` in `src/features/superAdmin/hooks.ts` can switch to these endpoints. The
client-side walk and its truncation notice would then no longer be needed.
