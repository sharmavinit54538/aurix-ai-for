/**
 * Centralized endpoint definitions for OFC360 backend API.
 * All backend API routes exist under /api/v1/ on the remote backend.
 */
export const AUTH_ENDPOINTS = {
  login: "/api/v1/auth/login",
  refresh: "/api/v1/auth/refresh",
  logout: "/api/v1/auth/logout",
  me: "/api/v1/auth/me",
  register: "/api/v1/auth/register",
  verifyEmail: "/api/v1/auth/verify-email",
  verifyEmailOtp: "/api/v1/auth/verify-email-otp",
  resendOtp: "/api/v1/auth/resend-otp",
  resendEmailOtp: "/api/v1/auth/resend-email-otp",
  forgotPassword: "/api/v1/auth/forgot-password",
  verifyResetOtp: "/api/v1/auth/verify-reset-otp",
  resetPassword: "/api/v1/auth/reset-password",
  changePassword: "/api/v1/auth/change-password",
  status: "/api/v1/auth/status",
} as const;

export type AuthEndpointKey = keyof typeof AUTH_ENDPOINTS;
