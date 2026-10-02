import { a as api, n as AUTH_ENDPOINTS, u as refreshAccessToken } from "./apiInstance-C5A0vaLH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BRJn5RkQ.js
/**
* Canonical authentication service client.
* All components and background services must route authentication calls through this service
* to ensure consistent base URLs, endpoint paths, credential forwarding, and diagnostic logging.
*/
var authService = {
	/**
	* Logs in a user with email/identifier and password.
	*/
	async login(credentials) {
		return api.post(AUTH_ENDPOINTS.login, credentials);
	},
	/**
	* Refreshes the session access token using the canonical refresh endpoint.
	* Sends in-memory refresh token if available and forwards HttpOnly cookies.
	*/
	async refresh() {
		return refreshAccessToken();
	},
	/**
	* Changes the authenticated user's password using the canonical auth endpoint.
	*/
	async changePassword(payload) {
		return api.patch(AUTH_ENDPOINTS.changePassword, payload);
	},
	/**
	* Logs the user out on the remote backend and terminates the active session.
	*/
	async logout() {
		return api.post(AUTH_ENDPOINTS.logout);
	},
	/**
	* Fetches the currently authenticated user's profile and company details.
	*/
	async getMe() {
		return api.get(AUTH_ENDPOINTS.me);
	},
	/**
	* Registers a new tenant administrator / organization.
	*/
	async register(payload) {
		return api.post(AUTH_ENDPOINTS.register, payload);
	},
	/**
	* Verifies the email address with a 6-digit OTP.
	*/
	async verifyEmail(payload) {
		return api.post(AUTH_ENDPOINTS.verifyEmail, payload);
	},
	/**
	* Resends verification OTP to the user's email.
	*/
	async resendOtp(payload) {
		return api.post(AUTH_ENDPOINTS.resendOtp, payload);
	},
	/**
	* Initiates password reset for the provided email address.
	*/
	async forgotPassword(payload) {
		return api.post(AUTH_ENDPOINTS.forgotPassword, payload);
	},
	/**
	* Verifies OTP code for password reset and returns a resetToken.
	*/
	async verifyResetOtp(payload) {
		return api.post(AUTH_ENDPOINTS.verifyResetOtp, payload);
	},
	/**
	* Completes password reset using verified reset token.
	*/
	async resetPassword(payload) {
		return api.post(AUTH_ENDPOINTS.resetPassword, payload);
	},
	/**
	* Super Admin Google single sign-on / authentication.
	*/
	async googleAuth(payload) {
		return api.post(AUTH_ENDPOINTS.google, payload);
	}
};
//#endregion
export { authService as t };
