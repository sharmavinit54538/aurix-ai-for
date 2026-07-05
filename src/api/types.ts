import type { Role } from "@/lib/aurix-store";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthUserPayload {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  is_verified: boolean;
  onboarding_completed?: boolean;
  created_at?: string;
  company_id?: string | number;
  company_name?: string;
}

export interface LoginData {
  access_token: string;
  refresh_token: string;
  user: AuthUserPayload;
}

export type AuthMeResponse = ApiResponse<AuthUserPayload>;
export type LoginResponse = ApiResponse<LoginData>;
