import apiInstance from "@/api/apiInstance";

export interface BookingSlot {
  id?: string;
  start_time: string;
  end_time: string;
  timezone?: string;
  meeting_url?: string;
  office_address?: string;
}

export interface BookingDetails {
  token: string;
  candidate_name: string;
  candidate_email?: string;
  job_title: string;
  company_name?: string;
  round_name?: string;
  interviewer_name?: string;
  duration_minutes?: number;
  mode?: "ONLINE" | "OFFLINE" | string;
  status: "PENDING" | "BOOKED" | "EXPIRED" | "CANCELLED" | string;
  available_slots: BookingSlot[];
  booked_slot?: BookingSlot | null;
}

export const candidateBookingApi = {
  getBookingDetails: async (token: string): Promise<BookingDetails> => {
    const res = await apiInstance.get(
      `/recruitment/interview-booking/${encodeURIComponent(token)}`,
    );
    return res.data?.data ?? res.data;
  },
  confirmBooking: async (
    token: string,
    payload: { start_time: string; timezone?: string },
  ) => {
    const res = await apiInstance.post(
      `/recruitment/interview-booking/${encodeURIComponent(token)}/confirm`,
      payload,
    );
    return res.data?.data ?? res.data;
  },
  getBookingInfo: async (token: string) => {
    const res = await apiInstance.get(
      `/recruitment/interview-booking/${encodeURIComponent(token)}`,
    );
    return res.data?.data ?? res.data;
  },
  bookSlot: async (token: string, slotId: string) => {
    const res = await apiInstance.post(
      `/recruitment/interview-booking/${encodeURIComponent(token)}/book`,
      { slot_id: slotId },
    );
    return res.data?.data ?? res.data;
  },
};

export default candidateBookingApi;
