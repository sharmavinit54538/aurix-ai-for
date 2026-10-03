import { apiInstance } from "@/api";

export interface BookingSlot {
  slot_id?: string;
  start_time: string; // UTC ISO string
  end_time: string;   // UTC ISO string
}

export interface BookedSlotDetails {
  start_time: string;
  end_time: string;
  meeting_url?: string;
  office_address?: string;
  timezone?: string;
}

export interface BookingDetails {
  token: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  company_name?: string;
  round_name: string;
  duration_minutes: number;
  interviewer_name?: string;
  status: "PENDING" | "BOOKED" | "EXPIRED" | "CANCELLED";
  available_slots: BookingSlot[];
  booked_slot?: BookedSlotDetails | null;
}

export interface ConfirmBookingPayload {
  slot_id?: string;
  start_time: string; // UTC ISO string
  timezone?: string;
}

export interface ConfirmBookingResponse {
  status: "BOOKED";
  booked_slot: BookedSlotDetails;
  message?: string;
}

export const candidateBookingApi = {
  getBookingDetails: async (token: string): Promise<BookingDetails> => {
    const response = await apiInstance.get(`/interviews/book/${encodeURIComponent(token)}`);
    return response.data?.data || response.data;
  },

  confirmBooking: async (token: string, payload: ConfirmBookingPayload): Promise<ConfirmBookingResponse> => {
    const response = await apiInstance.post(`/interviews/book/${encodeURIComponent(token)}`, payload);
    return response.data?.data || response.data;
  },
};
