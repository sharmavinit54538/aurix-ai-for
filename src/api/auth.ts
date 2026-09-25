import { api } from "./client";
import { refreshAccessToken } from "./apiInstance";
import type { ApiResponse, AuthMeResponse, LoginResponse } from "./types";

import { AUTH_ENDPOINTS, type AuthEndpointKey } from "./endpoints";
export { AUTH_ENDPOINTS, type AuthEndpointKey };

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  company_name: string;
  [key: string]: unknown;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirm_password: string;
}

export interface GoogleAuthPayload {
  email: string;
  action?: string;
}

/**
 * Canonical authentication service client.
 * All components and background services must route authentication calls through this service
 * to ensure consistent base URLs, endpoint paths, credential forwarding, and diagnostic logging.
 */
export const authService = {
  /**
   * Logs in a user with email/identifier and password.
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse | unknown> {
    return api.post(AUTH_ENDPOINTS.login, credentials);
  },

  /**
   * Refreshes the session access token using the canonical refresh endpoint.
   * Sends in-memory refresh token if available and forwards HttpOnly cookies.
   */
  async refresh(): Promise<string> {
    return refreshAccessToken();
  },

  /**
   * Logs the user out on the remote backend and terminates the active session.
   */
  async logout(): Promise<unknown> {
    return api.post(AUTH_ENDPOINTS.logout);
  },

  /**
   * Fetches the currently authenticated user's profile and company details.
   */
  async getMe(): Promise<AuthMeResponse> {
    return api.get<AuthMeResponse>(AUTH_ENDPOINTS.me);
  },

  /**
   * Registers a new tenant administrator / organization.
   */
  async register(payload: RegisterPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.register, payload);
  },

  /**
   * Verifies the email address with a 6-digit OTP.
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.verifyEmail, payload);
  },

  /**
   * Resends verification OTP to the user's email.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.resendOtp, payload);
  },

  /**
   * Initiates password reset for the provided email address.
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.forgotPassword, payload);
  },

  /**
   * Verifies OTP code for password reset and returns a resetToken.
   */
  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<ApiResponse<{ resetToken: string }>> {
    return api.post<ApiResponse<{ resetToken: string }>>(AUTH_ENDPOINTS.verifyResetOtp, payload);
  },

  /**
   * Completes password reset using verified reset token.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.resetPassword, payload);
  },

  /**
   * Super Admin Google single sign-on / authentication.
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<unknown> {
    return api.post(AUTH_ENDPOINTS.google, payload);
  },
};
