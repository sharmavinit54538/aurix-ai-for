import { api } from "./client";
import { refreshAccessToken } from "./tokens";
import type {
  ApiResponse,
  AuthMeResponse,
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
  RefreshTokenResponse,
  ForgotPasswordResponse,
  VerifyResetOtpResponse,
  ResetPasswordResponse,
  ChangePasswordResponse,
  LogoutResponse,
  ChangeEmailResponse,
  VerifyNewEmailResponse,
  ChangePhoneResponse,
} from "./types";

import { AUTH_ENDPOINTS, type AuthEndpointKey } from "./endpoints";
export { AUTH_ENDPOINTS, type AuthEndpointKey };

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  company_name: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface LoginOtpChallengePayload {
  verification_id: string;
  otp: string;
}

export interface ResendLoginOtpPayload {
  verification_id: string;
  email: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangeEmailPayload {
  new_email: string;
}

export interface VerifyNewEmailPayload {
  email: string;
  otp: string;
}

export interface ChangePhonePayload {
  new_phone: string;
  otp?: string;
}

/**
 * Canonical authentication service client.
 * All components and background services must route authentication calls through this service
 * to ensure consistent base URLs, endpoint paths, credential forwarding, and diagnostic logging.
 */
export const authService = {
  /**
   * Logs in a user with email/identifier and password.
   * Returns either authenticated login data or a verification challenge.
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.post<LoginResponse>(AUTH_ENDPOINTS.login, credentials);
  },

  /**
   * Verifies login OTP challenge (email verification required during login).
   */
  async verifyLoginOtp(payload: LoginOtpChallengePayload): Promise<LoginResponse> {
    return api.post<LoginResponse>(AUTH_ENDPOINTS.verifyEmailOtp, payload);
  },

  /**
   * Resends login OTP challenge.
   */
  async resendLoginOtp(payload: ResendLoginOtpPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.resendEmailOtp, payload);
  },

  /**
   * Refreshes the session access token using the refresh-token endpoint.
   * Accepts refresh token in request body and returns new access/refresh tokens.
   */
  async refreshToken(payload: RefreshTokenPayload): Promise<RefreshTokenResponse> {
    return api.post<RefreshTokenResponse>(AUTH_ENDPOINTS.refreshToken, payload);
  },

  /**
   * Refreshes the session access token using the canonical refresh endpoint.
   * Sends request with HttpOnly refresh cookie (withCredentials: true).
   */
  async refresh(options?: { silent?: boolean }): Promise<string> {
    return refreshAccessToken(options);
  },

  /**
   * Changes the authenticated user's password using the canonical auth endpoint.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
    return api.patch<ChangePasswordResponse>(AUTH_ENDPOINTS.changePassword, payload);
  },

  /**
   * Logs the user out on the remote backend and terminates the active session.
   */
  async logout(): Promise<LogoutResponse> {
    return api.post<LogoutResponse>(AUTH_ENDPOINTS.logout);
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
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return api.post<RegisterResponse>(AUTH_ENDPOINTS.register, payload);
  },

  /**
   * Verifies the email address with a 6-digit OTP (registration verification).
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<VerifyEmailResponse> {
    return api.post<VerifyEmailResponse>(AUTH_ENDPOINTS.verifyEmail, payload);
  },

  /**
   * Resends registration verification OTP to the user's email.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.resendOtp, payload);
  },

  /**
   * Resends the email verification link to the user's email.
   * Used when the verification email was not received or the link has expired.
   */
  async resendVerification(payload: ResendVerificationPayload): Promise<ApiResponse> {
    return api.post<ApiResponse>(AUTH_ENDPOINTS.resendVerification, payload);
  },

  /**
   * Initiates password reset for the provided identifier (email or phone).
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, payload);
  },

  /**
   * Verifies OTP code for password reset and returns a reset_token.
   */
  async verifyResetOtp(payload: VerifyResetOtpPayload): Promise<VerifyResetOtpResponse> {
    return api.post<VerifyResetOtpResponse>(AUTH_ENDPOINTS.verifyResetOtp, payload);
  },

  /**
   * Completes password reset using verified reset token.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
    return api.post<ResetPasswordResponse>(AUTH_ENDPOINTS.resetPassword, payload);
  },

  /**
   * Gets authentication status (lightweight check).
   */
  async getStatus(): Promise<AuthMeResponse> {
    return api.get<AuthMeResponse>(AUTH_ENDPOINTS.me);
  },

  /**
   * Changes the authenticated user's email address.
   * Requires verification of the new email address.
   */
  async changeEmail(payload: ChangeEmailPayload): Promise<ChangeEmailResponse> {
    return api.patch<ChangeEmailResponse>(AUTH_ENDPOINTS.changeEmail, payload);
  },

  /**
   * Verifies the new email address with OTP.
   */
  async verifyNewEmail(payload: VerifyNewEmailPayload): Promise<VerifyNewEmailResponse> {
    return api.post<VerifyNewEmailResponse>(AUTH_ENDPOINTS.verifyNewEmail, payload);
  },

  /**
   * Changes the authenticated user's phone number.
   * May require OTP verification depending on backend policy.
   */
  async changePhone(payload: ChangePhonePayload): Promise<ChangePhoneResponse> {
    return api.patch<ChangePhoneResponse>(AUTH_ENDPOINTS.changePhone, payload);
  },
};
