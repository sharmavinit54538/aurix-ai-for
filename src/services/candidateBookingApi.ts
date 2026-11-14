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
  getBookingDetails: async (token: string): Promise<BookingDetails> => ({
    token,
    candidate_name: "Jordan Taylor",
    job_title: "Senior Full-Stack Engineer",
    company_name: "OFC360 Enterprise",
    round_name: "Technical Architecture Round",
    interviewer_name: "Alex Vance",
    duration_minutes: 45,
    mode: "ONLINE",
    status: "PENDING",
    available_slots: [
      {
        id: "slot-1",
        start_time: new Date(Date.now() + 86400000).toISOString(),
        end_time: new Date(Date.now() + 86400000 + 2700000).toISOString(),
        timezone: "UTC",
      },
    ],
    booked_slot: null,
  }),
  confirmBooking: async (_token: string, payload: { start_time: string; timezone?: string }) => ({
    success: true,
    booked_slot: {
      start_time: payload.start_time,
      end_time: new Date(new Date(payload.start_time).getTime() + 2700000).toISOString(),
      timezone: payload.timezone || "UTC",
      meeting_url: "https://meet.ofc360.local/interview",
    },
  }),
  getBookingInfo: async (_token: string) => ({ valid: true, slots: [] }),
  bookSlot: async (_token: string, _slotId: string) => ({ success: true }),
};
export default candidateBookingApi;
