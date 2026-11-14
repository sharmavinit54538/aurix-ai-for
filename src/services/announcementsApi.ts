export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: "low" | "normal" | "high" | "urgent" | string;
  author_name: string;
  created_at: string;
  is_pinned?: boolean;
  acknowledged?: boolean;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  category?: string;
  priority?: string;
  is_pinned?: boolean;
  target_departments?: string[];
  target_roles?: string[];
}

export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

export interface AnnouncementsListResult {
  items: AnnouncementItem[];
  total: number;
  page?: number;
  limit?: number;
}

export function extractValidationErrors(_err: unknown): Record<string, string> {
  return {};
}

const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Q4 Strategic Townhall & Product Roadmap",
    content: "Join us this Friday for our quarterly company-wide townhall covering AI product milestones and team recognitions.",
    category: "Company News",
    priority: "high",
    author_name: "Alex Vance",
    created_at: new Date().toISOString(),
    is_pinned: true,
    acknowledged: true,
  },
];

export const getAnnouncements = async (): Promise<AnnouncementsListResult> => ({
  items: MOCK_ANNOUNCEMENTS,
  total: 1,
});
export const getAnnouncementById = async (id: string): Promise<AnnouncementItem> => ({
  ...MOCK_ANNOUNCEMENTS[0],
  id,
});
export const createAnnouncement = async (data: Partial<AnnouncementItem>): Promise<AnnouncementItem> => ({
  ...MOCK_ANNOUNCEMENTS[0],
  ...data,
  id: `ann-${Date.now()}`,
});
export const updateAnnouncement = async (id: string, data: Partial<AnnouncementItem>): Promise<AnnouncementItem> => ({
  ...MOCK_ANNOUNCEMENTS[0],
  ...data,
  id,
});
export const deleteAnnouncement = async (_id: string) => ({ success: true });
export const acknowledgeAnnouncement = async (_id: string) => ({ success: true });

export const announcementsApi = {
  getAnnouncements,
  list: getAnnouncements,
  getAnnouncementById,
  getById: getAnnouncementById,
  createAnnouncement,
  create: createAnnouncement,
  updateAnnouncement,
  update: updateAnnouncement,
  deleteAnnouncement,
  delete: deleteAnnouncement,
  acknowledgeAnnouncement,
  acknowledge: acknowledgeAnnouncement,
};

export default announcementsApi;
