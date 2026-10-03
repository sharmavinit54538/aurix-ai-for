import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  announcementsApi,
  type AnnouncementsListResult,
  type Announcement,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "@/services/announcementsApi";

export const ANNOUNCEMENTS_QUERY_KEY = ["announcements"] as const;

export function useAnnouncements(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<AnnouncementsListResult, Error>({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, params],
    queryFn: () => announcementsApi.getAnnouncements(params),
    staleTime: 60_000,
  });
}

export function useAnnouncement(id?: string) {
  return useQuery<Announcement, Error>({
    queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "detail", id],
    queryFn: () => {
      if (!id) throw new Error("Announcement ID is required");
      return announcementsApi.getAnnouncement(id);
    },
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, CreateAnnouncementInput>({
    mutationFn: (input) => announcementsApi.createAnnouncement(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, { id: string; input: UpdateAnnouncementInput }>({
    mutationFn: ({ id, input }) => announcementsApi.updateAnnouncement(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "detail", variables.id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (id) => announcementsApi.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
}

export function usePublishAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, string>({
    mutationFn: (id) => announcementsApi.publishAnnouncement(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "detail", id] });
    },
  });
}

export function useArchiveAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation<Announcement, Error, string>({
    mutationFn: (id) => announcementsApi.archiveAnnouncement(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ANNOUNCEMENTS_QUERY_KEY, "detail", id] });
    },
  });
}
