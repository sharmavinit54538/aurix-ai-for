import apiInstance from "@/api/apiInstance";
import { ApiError } from "@/api/client";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// 1. Core Evidence-Backed Zod Schemas
// ─────────────────────────────────────────────────────────────

/**
 * Raw announcement item schema validated against evidence.
 * Required: `id` and `title` (proven by superAdmin types and timeline/dashboard).
 * All other fields are optional/nullable.
 */
export const RawAnnouncementItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    title: z.string().min(1, "Announcement title is required"),
    content: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
    target_audience: z.string().nullable().optional(),
    targetAudience: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    updatedAt: z.string().nullable().optional(),
    author_name: z.string().nullable().optional(),
    authorName: z.string().nullable().optional(),
    author: z.string().nullable().optional(),
    is_pinned: z.boolean().nullable().optional(),
    isPinned: z.boolean().nullable().optional(),
    pinned: z.boolean().nullable().optional(),
    status: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    published_at: z.string().nullable().optional(),
    publishedAt: z.string().nullable().optional(),
    expires_at: z.string().nullable().optional(),
    expiresAt: z.string().nullable().optional(),
  })
  .passthrough();

export type RawAnnouncementItem = z.infer<typeof RawAnnouncementItemSchema>;

/**
 * Normalized presentation type consumed by UI components.
 * Guarantees zero invented defaults: missing fields remain `null`.
 */
export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  targetAudience: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  authorName: string | null;
  isPinned: boolean;
  status: string | null;
  priority: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
}

export function normalizeAnnouncement(raw: RawAnnouncementItem): Announcement {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content ?? null,
    summary: raw.summary ?? null,
    targetAudience: raw.target_audience ?? raw.targetAudience ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
    authorName: raw.author_name ?? raw.authorName ?? raw.author ?? null,
    isPinned: Boolean(raw.is_pinned ?? raw.isPinned ?? raw.pinned ?? false),
    status: raw.status ?? null,
    priority: raw.priority ?? null,
    publishedAt: raw.published_at ?? raw.publishedAt ?? null,
    expiresAt: raw.expires_at ?? raw.expiresAt ?? null,
  };
}

export interface AnnouncementsListResult {
  items: Announcement[];
  total: number;
}

export interface CreateAnnouncementInput {
  title: string;
  content?: string;
  target_audience?: string;
  priority?: "low" | "normal" | "high" | "urgent" | string;
  is_pinned?: boolean;
}

export interface UpdateAnnouncementInput {
  title?: string;
  content?: string;
  target_audience?: string;
  priority?: "low" | "normal" | "high" | "urgent" | string;
  is_pinned?: boolean;
}

// ─────────────────────────────────────────────────────────────
// 2. Dev-Only Debug & Envelope Parsing
// ─────────────────────────────────────────────────────────────

function logDevShapeWarning(endpoint: string, data: unknown): void {
  if (import.meta.env.DEV) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      console.warn(
        `[announcementsApi] Unexpected response shape from ${endpoint}. Top-level keys:`,
        Object.keys(data),
      );
    } else {
      console.warn(
        `[announcementsApi] Unexpected response shape from ${endpoint}. Type received:`,
        typeof data,
      );
    }
  }
}

/**
 * Parses single announcement item safely through Zod.
 * Throws ApiError if required fields (`id`, `title`) are missing.
 */
export function parseAnnouncementItem(rawItem: unknown, endpoint: string): Announcement {
  const result = RawAnnouncementItemSchema.safeParse(rawItem);
  if (!result.success) {
    logDevShapeWarning(endpoint, rawItem);
    throw new ApiError(
      `Unexpected announcement format received from ${endpoint}. Missing required fields.`,
      200,
      rawItem,
    );
  }
  return normalizeAnnouncement(result.data);
}

/**
 * Extracts and parses list of announcements according to OFC360 conventions.
 * Accepts:
 *  - `{ success: true, data: { items: [...], total: n } }`
 *  - `{ data: [...] }`
 *  - `{ items: [...], total: n }`
 *  - Raw array `[...]`
 */
export function parseAnnouncementsList(resData: unknown, endpoint: string): AnnouncementsListResult {
  let itemsCandidate: unknown = null;
  let totalCandidate: number | null = null;

  if (Array.isArray(resData)) {
    itemsCandidate = resData;
    totalCandidate = resData.length;
  } else if (resData && typeof resData === "object") {
    const record = resData as Record<string, unknown>;

    // Check envelope unwrap
    const unwrapped =
      typeof record.data === "object" && record.data !== null ? (record.data as Record<string, unknown>) : record;

    if (Array.isArray(unwrapped)) {
      itemsCandidate = unwrapped;
      totalCandidate = unwrapped.length;
    } else if (unwrapped && typeof unwrapped === "object") {
      if (Array.isArray(unwrapped.items)) {
        itemsCandidate = unwrapped.items;
        totalCandidate = typeof unwrapped.total === "number" ? unwrapped.total : unwrapped.items.length;
      } else if (Array.isArray(unwrapped.announcements)) {
        itemsCandidate = unwrapped.announcements;
        totalCandidate =
          typeof unwrapped.total === "number" ? unwrapped.total : unwrapped.announcements.length;
      } else if (Array.isArray(record.items)) {
        itemsCandidate = record.items;
        totalCandidate = typeof record.total === "number" ? record.total : record.items.length;
      }
    }
  }

  if (!Array.isArray(itemsCandidate)) {
    logDevShapeWarning(endpoint, resData);
    throw new ApiError(
      `Unexpected response format from ${endpoint}. Expected announcement items list.`,
      200,
      resData,
    );
  }

  const items = itemsCandidate.map((raw) => parseAnnouncementItem(raw, endpoint));
  return {
    items,
    total: totalCandidate ?? items.length,
  };
}

/**
 * Extracts field-level validation errors from FastAPI 422 or standard error responses.
 */
export function extractValidationErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (!error || typeof error !== "object") return fieldErrors;

  const errObj = error as { response?: { data?: unknown }; data?: unknown };
  const data = errObj.response?.data ?? errObj.data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    // FastAPI 422: detail array
    if (Array.isArray(record.detail)) {
      for (const item of record.detail) {
        if (item && typeof item === "object") {
          const loc = (item as { loc?: unknown[] }).loc;
          const msg = (item as { msg?: string }).msg;
          if (Array.isArray(loc) && loc.length > 0 && typeof msg === "string") {
            const field = String(loc[loc.length - 1]);
            fieldErrors[field] = msg;
          }
        }
      }
    }

    // OFC360 custom errors array
    if (Array.isArray(record.errors)) {
      for (const item of record.errors) {
        if (item && typeof item === "object") {
          const field = (item as { field?: string }).field;
          const msg = (item as { message?: string }).message;
          if (field && msg) {
            fieldErrors[field] = msg;
          }
        }
      }
    }
  }

  return fieldErrors;
}

// ─────────────────────────────────────────────────────────────
// 3. API Service Methods
// ─────────────────────────────────────────────────────────────

export const announcementsApi = {
  /**
   * GET /api/v1/announcements
   * Retrieves list of announcements.
   */
  async getAnnouncements(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<AnnouncementsListResult> {
    const res = await apiInstance.get("/api/v1/announcements", { params });
    return parseAnnouncementsList(res.data, "GET /api/v1/announcements");
  },

  /**
   * GET /api/v1/announcements/{id}
   * Retrieves single announcement detail by ID.
   */
  async getAnnouncement(id: string): Promise<Announcement> {
    const res = await apiInstance.get(`/api/v1/announcements/${encodeURIComponent(id)}`);
    const payload = res.data?.data ?? res.data;
    return parseAnnouncementItem(payload, `GET /api/v1/announcements/${id}`);
  },

  /**
   * POST /api/v1/announcements
   * Creates a new announcement draft.
   */
  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const res = await apiInstance.post("/api/v1/announcements", input);
    const payload = res.data?.data?.announcement ?? res.data?.announcement ?? res.data?.data ?? res.data;
    return parseAnnouncementItem(payload, "POST /api/v1/announcements");
  },

  /**
   * PUT /api/v1/announcements/{id}
   * Updates existing announcement.
   */
  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    const res = await apiInstance.put(`/api/v1/announcements/${encodeURIComponent(id)}`, input);
    const payload = res.data?.data?.announcement ?? res.data?.announcement ?? res.data?.data ?? res.data;
    return parseAnnouncementItem(payload, `PUT /api/v1/announcements/${id}`);
  },

  /**
   * DELETE /api/v1/announcements/{id}
   * Deletes an announcement.
   */
  async deleteAnnouncement(id: string): Promise<{ success: boolean; message: string }> {
    const res = await apiInstance.delete(`/api/v1/announcements/${encodeURIComponent(id)}`);
    return {
      success: true,
      message: res.data?.message ?? "Announcement deleted successfully.",
    };
  },

  /**
   * PATCH /api/v1/announcements/{id}/publish
   * Publishes an announcement.
   */
  async publishAnnouncement(id: string): Promise<Announcement> {
    const res = await apiInstance.patch(`/api/v1/announcements/${encodeURIComponent(id)}/publish`);
    const payload = res.data?.data?.announcement ?? res.data?.announcement ?? res.data?.data ?? res.data;
    return parseAnnouncementItem(payload, `PATCH /api/v1/announcements/${id}/publish`);
  },

  /**
   * PATCH /api/v1/announcements/{id}/archive
   * Archives an announcement.
   */
  async archiveAnnouncement(id: string): Promise<Announcement> {
    const res = await apiInstance.patch(`/api/v1/announcements/${encodeURIComponent(id)}/archive`);
    const payload = res.data?.data?.announcement ?? res.data?.announcement ?? res.data?.data ?? res.data;
    return parseAnnouncementItem(payload, `PATCH /api/v1/announcements/${id}/archive`);
  },
};
