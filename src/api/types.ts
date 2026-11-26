import type { Role } from "@/lib/aurix-store";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown> | null;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string | null; message: string }>;
  detail?: string;
}

export interface AuthUserPayload {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  is_verified: boolean;
  is_email_verified?: boolean;
  email_verified?: boolean;
  email_verified_at?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  company_id?: string | number;
  company_name?: string;
  companyName?: string;
  company?: { id?: string | number; name?: string; company_name?: string };
  organization?: { id?: string | number; name?: string; company_name?: string };
  document_verification_status?: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "FAILED";
  documentVerificationStatus?: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "FAILED";
  documents_verified?: boolean;
  documentsVerified?: boolean;
  documents_verified_at?: string;
  documentsVerifiedAt?: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUserPayload;
}

export interface RegisterResponseData {
  user: AuthUserPayload;
}

export interface VerifyEmailResponseData {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: AuthUserPayload;
}

export interface LoginChallengeResponse {
  requires_email_verification: boolean;
  verification_id: string;
  masked_email: string;
  message?: string;
}

export interface RefreshTokenResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ForgotPasswordResponseData {
  message?: string;
}

export interface VerifyResetOtpResponseData {
  email: string;
  reset_token: string;
}

export interface ResetPasswordResponseData {
  message?: string;
}

export interface ChangePasswordResponseData {
  message?: string;
}

export interface ChangeEmailResponseData {
  message?: string;
}

export interface VerifyNewEmailResponseData {
  message?: string;
}

export interface ChangePhoneResponseData {
  message?: string;
}

export interface AuthStatusResponseData {
  authenticated: boolean;
  user?: AuthUserPayload;
}

export type AuthMeResponse = ApiResponse<AuthUserPayload>;
export type LoginResponse = ApiResponse<LoginData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type VerifyEmailResponse = ApiResponse<VerifyEmailResponseData | null>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
export type ForgotPasswordResponse = ApiResponse<ForgotPasswordResponseData>;
export type VerifyResetOtpResponse = ApiResponse<VerifyResetOtpResponseData>;
export type ResetPasswordResponse = ApiResponse<ResetPasswordResponseData>;
export type ChangePasswordResponse = ApiResponse<ChangePasswordResponseData>;
export type ChangeEmailResponse = ApiResponse<ChangeEmailResponseData>;
export type VerifyNewEmailResponse = ApiResponse<VerifyNewEmailResponseData>;
export type ChangePhoneResponse = ApiResponse<ChangePhoneResponseData>;
export type AuthStatusResponse = ApiResponse<AuthStatusResponseData>;
export type LogoutResponse = ApiResponse<{ message?: string }>;
