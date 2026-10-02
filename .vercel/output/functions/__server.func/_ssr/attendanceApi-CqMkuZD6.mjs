import { t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { a as api, o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendanceApi-CqMkuZD6.js
function extractListPayload(res) {
	if (Array.isArray(res)) return res;
	if (!res || typeof res !== "object") return [];
	const root = res;
	const nested = root.data;
	if (Array.isArray(nested)) return nested;
	if (nested && typeof nested === "object") {
		const dataObj = nested;
		for (const key of [
			"items",
			"records",
			"rows",
			"employees",
			"shifts",
			"rosters",
			"holidays",
			"results",
			"data"
		]) if (Array.isArray(dataObj[key])) return dataObj[key];
	}
	for (const key of [
		"items",
		"records",
		"rows",
		"employees",
		"shifts",
		"rosters",
		"holidays",
		"results"
	]) if (Array.isArray(root[key])) return root[key];
	return [];
}
function extractObjectPayload(res) {
	if (!res || typeof res !== "object") return {};
	const root = res;
	if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) return root.data;
	return root;
}
/**
* Convert Base64 data URL to a binary Blob for multipart/form-data upload.
*/
function base64ToBlob(base64, contentType = "image/jpeg") {
	const parts = base64.split(",");
	const raw = parts.length > 1 ? parts[1] : parts[0];
	const binaryStr = atob(raw);
	const len = binaryStr.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
	return new Blob([bytes], { type: contentType });
}
/**
* Extracts user-friendly error message from face attendance API errors.
*/
function extractFaceApiError(err) {
	const status = err?.response?.status || err?.status;
	const resp = err?.response?.data || err?.data;
	const code = extractErrorCode(err);
	let rawMsg = "";
	if (resp) {
		if (typeof resp === "string") rawMsg = resp;
		else if (resp.detail) {
			if (typeof resp.detail === "string") rawMsg = resp.detail;
			else if (typeof resp.detail === "object") {
				if (typeof resp.detail.message === "string") rawMsg = resp.detail.message;
				else if (typeof resp.detail.msg === "string") rawMsg = resp.detail.msg;
			} else if (Array.isArray(resp.detail)) rawMsg = resp.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join("; ");
		} else if (resp.message && typeof resp.message === "string") rawMsg = resp.message;
	}
	if (code === "FACE_NOT_ENROLLED" || rawMsg.toLowerCase().includes("face not enrolled") || rawMsg.toLowerCase().includes("not enrolled")) return "Face not enrolled. Please complete biometric face registration first.";
	if (code === "FACE_MISMATCH" || rawMsg.toLowerCase().includes("mismatch") || rawMsg.toLowerCase().includes("does not match")) return "Face not recognized. The face does not match your enrolled profile. Please ensure proper lighting and look directly into the camera.";
	if (code === "FACE_NOT_FOUND" || rawMsg.toLowerCase().includes("no face")) return "No face detected in frame. Please center your face inside the guide outline.";
	if (code === "MULTIPLE_FACES" || rawMsg.toLowerCase().includes("multiple faces")) return "Multiple faces detected. Exactly one person must be visible in the camera preview.";
	if (code === "LIVENESS_FAILED" || rawMsg.toLowerCase().includes("liveness")) return "Liveness check failed. Please present your real face to the camera.";
	if (code === "FACE_QUALITY_LOW" || rawMsg.toLowerCase().includes("blur") || rawMsg.toLowerCase().includes("quality")) return "Image quality too low or blurred. Please hold steady in good ambient light.";
	if (code === "OUTSIDE_GEOFENCE" || rawMsg.toLowerCase().includes("geofence") || rawMsg.toLowerCase().includes("outside")) return "Outside office radius. Attendance verification must be completed inside the authorized office location.";
	if (code === "NO_ACTIVE_CHECKIN" || rawMsg.toLowerCase().includes("no active checkin") || rawMsg.toLowerCase().includes("not checked in")) return "No active check-in found. You must check in before starting a break.";
	if (code === "ALREADY_CHECKED_OUT" || rawMsg.toLowerCase().includes("already checked out")) return "You have already checked out for today.";
	if (code === "BREAK_ACTIVE" || rawMsg.toLowerCase().includes("break active") || rawMsg.toLowerCase().includes("already on break")) return "A break is already in progress. Please end your current break first.";
	if (code === "NO_ACTIVE_BREAK" || rawMsg.toLowerCase().includes("no active break") || rawMsg.toLowerCase().includes("not on break")) return "No active break found to end.";
	if (status === 401) return "Session expired. Please log in again to continue.";
	if (status === 403) return rawMsg || "Access forbidden. You do not have permission to perform this action.";
	if (status === 404) return rawMsg || "Requested resource or attendance service is unavailable on the server.";
	if (status === 409) return rawMsg || "Attendance conflict. You may have already punched in or out for today.";
	if (status === 422) return rawMsg || "Validation error on submission. Please check captured image and coordinates.";
	if (status === 429) return "Too many verification requests. Please wait a moment before trying again.";
	if (status && status >= 500) return "Server error during verification. Please try again or contact HR support.";
	if (rawMsg) return rawMsg;
	if (err?.message && typeof err.message === "string") return err.message;
	return "An unexpected error occurred during attendance processing.";
}
/**
* Extracts a machine-readable error code from backend response if available.
* Common codes: FACE_NOT_ENROLLED, FACE_MISMATCH, ALREADY_CHECKED_IN, etc.
*/
function extractErrorCode(err) {
	const resp = err?.response?.data || err?.data;
	if (resp && typeof resp === "object") {
		if (resp.detail && typeof resp.detail === "object" && resp.detail.code) return resp.detail.code;
		return resp.error_code || resp.code || resp.errorCode || void 0;
	}
}
var attendanceApi = {
	/**
	* Fetch today's company-wide attendance logs.
	* Calls GET /api/v1/attendance/today.
	* If missing, tries GET /api/v1/attendance/face/company as backend fallback.
	*
	* TODO (Backend): Ensure GET /api/v1/attendance/today returns:
	* { success: true, data: [ { id, employeeId, fullName, department, status, checkInTime, checkOutTime, workingHours } ] }
	*/
	getTodayAttendance: async (dateStr) => {
		const query = dateStr ? `?date=${encodeURIComponent(dateStr)}` : "";
		try {
			return extractListPayload(await api.get(`attendance/today${query}`)).map((item) => ({
				id: item.id || item.employee_id || item._id,
				employeeId: item.employee_id || item.employeeId || item.id,
				fullName: item.full_name || item.employee_name || item.fullName || "Unknown",
				department: item.department || "General",
				designation: item.designation || "",
				avatarUrl: item.avatar_url || item.avatarUrl,
				status: item.status?.toLowerCase() || (item.check_in_time ? "present" : "absent"),
				checkInTime: item.check_in_time || item.checkInTime || null,
				checkOutTime: item.check_out_time || item.checkOutTime || null,
				workingHours: item.working_hours ?? item.workingHours ?? null,
				location: item.location || item.branch || "Office"
			}));
		} catch (err) {
			if (err?.status === 404) try {
				return extractListPayload(await api.get("attendance/face/company?limit=100")).map((item) => {
					let status = "present";
					if (item.check_in_time) {
						const [hour] = new Date(item.check_in_time).toLocaleTimeString("en-GB").split(":");
						if (Number(hour) >= 10) status = "late";
					} else status = "absent";
					return {
						id: item.id || item.employee_id,
						employeeId: item.employee_id || item.id,
						fullName: item.employee_name || "Employee",
						department: item.department || "General",
						designation: item.designation || "",
						avatarUrl: item.face_image_url,
						status,
						checkInTime: item.check_in_time,
						checkOutTime: item.check_out_time,
						workingHours: item.working_hours,
						location: "Office"
					};
				});
			} catch {
				throw err;
			}
			throw err;
		}
	},
	/**
	* Fetch attendance dashboard analytics summary.
	* Calls GET /api/v1/attendance/face/analytics.
	* Real backend fields:
	* total_active_employees, checked_in_today, checked_out_today, absent_today,
	* attendance_rate_percentage, average_working_hours_today, late_check_ins_today
	*/
	getAttendanceAnalytics: async () => {
		const data = extractObjectPayload(await api.get("attendance/face/analytics"));
		return {
			totalEmployees: data.total_active_employees ?? data.totalActiveEmployees ?? data.total_employees ?? data.totalEmployees ?? 0,
			present: data.checked_in_today ?? data.checkedInToday ?? data.present_today ?? data.present ?? 0,
			late: data.late_check_ins_today ?? data.lateCheckInsToday ?? data.late_today ?? data.late ?? 0,
			absent: data.absent_today ?? data.absentToday ?? data.absent ?? 0,
			onLeave: data.on_leave_today ?? data.onLeaveToday ?? data.on_leave ?? data.onLeave ?? 0,
			onTimeRate: data.attendance_rate_percentage ?? data.attendanceRatePercentage ?? data.on_time_rate ?? data.onTimeRate,
			averageWorkingHours: data.average_working_hours_today ?? data.averageWorkingHoursToday ?? data.average_working_hours ?? data.averageWorkingHours,
			checkedOutToday: data.checked_out_today ?? data.checkedOutToday ?? 0
		};
	},
	/**
	* Get current authenticated employee's punch status for today.
	* Calls GET /api/v1/attendance/face/me (or /api/v1/attendance/today/me).
	*/
	getMyTodayStatus: async () => {
		try {
			const data = extractObjectPayload(await api.get("attendance/face/me"));
			return {
				checkedIn: Boolean(data.checked_in ?? data.checkedIn),
				checkedOut: Boolean(data.checked_out ?? data.checkedOut),
				onBreak: Boolean(data.on_break ?? data.onBreak),
				checkInTime: data.check_in_time || data.checkInTime || null,
				checkOutTime: data.check_out_time || data.checkOutTime || null,
				workingHours: data.working_hours ?? data.workingHours ?? null,
				breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes,
				message: data.message,
				attendanceId: data.attendance_id || data.id
			};
		} catch (err) {
			if (err?.status === 404) {
				const data = extractObjectPayload(await api.get("attendance/today/me"));
				return {
					checkedIn: Boolean(data.checked_in ?? data.checkedIn),
					checkedOut: Boolean(data.checked_out ?? data.checkedOut),
					onBreak: Boolean(data.on_break ?? data.onBreak),
					checkInTime: data.check_in_time || data.checkInTime || null,
					checkOutTime: data.check_out_time || data.checkOutTime || null,
					workingHours: data.working_hours ?? data.workingHours ?? null,
					message: data.message
				};
			}
			throw err;
		}
	},
	/**
	* Get the authenticated employee's face attendance status.
	* Calls GET /api/v1/attendance/face/me.
	* Infers face enrollment from the API response:
	* - A successful response means the employee is recognized (face registered).
	* - A specific error (e.g. FACE_NOT_ENROLLED) means no face enrolled.
	* - A 404 with no face enrollment indication means the endpoint isn't available.
	*/
	getFaceAttendanceStatus: async () => {
		try {
			const data = extractObjectPayload(await api.get("attendance/face/me"));
			let faceRegistered = true;
			if (typeof data.face_registered === "boolean") faceRegistered = data.face_registered;
			else if (typeof data.faceRegistered === "boolean") faceRegistered = data.faceRegistered;
			else if (typeof data.is_registered === "boolean") faceRegistered = data.is_registered;
			else if (typeof data.isRegistered === "boolean") faceRegistered = data.isRegistered;
			else if (typeof data.is_face_registered === "boolean") faceRegistered = data.is_face_registered;
			else if (typeof data.isFaceRegistered === "boolean") faceRegistered = data.isFaceRegistered;
			else if (typeof data.is_enrolled === "boolean") faceRegistered = data.is_enrolled;
			else if (typeof data.isEnrolled === "boolean") faceRegistered = data.isEnrolled;
			else if (typeof data.face_enrolled === "boolean") faceRegistered = data.face_enrolled;
			else if (typeof data.faceEnrolled === "boolean") faceRegistered = data.faceEnrolled;
			else if (typeof data.enrolled === "boolean") faceRegistered = data.enrolled;
			else if (typeof data.has_face === "boolean") faceRegistered = data.has_face;
			else if (typeof data.hasFace === "boolean") faceRegistered = data.hasFace;
			else if (data.enrollment_status === "not_enrolled" || data.enrollmentStatus === "not_enrolled") faceRegistered = false;
			return {
				faceRegistered,
				checkedIn: Boolean(data.checked_in ?? data.checkedIn),
				checkedOut: Boolean(data.checked_out ?? data.checkedOut),
				checkInTime: data.check_in_time || data.checkInTime || null,
				checkOutTime: data.check_out_time || data.checkOutTime || null,
				workingHours: data.working_hours ?? data.workingHours ?? null,
				message: data.message || "",
				raw: data
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const status = err?.response?.status || err?.status;
			if (errorCode === "FACE_NOT_ENROLLED" || errorCode === "face_not_enrolled" || errorCode === "NOT_ENROLLED" || errorCode === "USER_NOT_ENROLLED" || errorMsg.toLowerCase().includes("face not enrolled") || errorMsg.toLowerCase().includes("face not registered") || errorMsg.toLowerCase().includes("no face registered") || errorMsg.toLowerCase().includes("face is not registered") || errorMsg.toLowerCase().includes("face registration required") || errorMsg.toLowerCase().includes("not enrolled")) return {
				faceRegistered: false,
				checkedIn: false,
				checkedOut: false,
				checkInTime: null,
				checkOutTime: null,
				workingHours: null,
				message: errorMsg,
				raw: {},
				errorCode: errorCode || "FACE_NOT_ENROLLED"
			};
			if (status === 404) return {
				faceRegistered: !(errorMsg.toLowerCase().includes("face") || errorMsg.toLowerCase().includes("profile") || errorMsg.toLowerCase().includes("biometric")),
				checkedIn: false,
				checkedOut: false,
				checkInTime: null,
				checkOutTime: null,
				workingHours: null,
				message: errorMsg || "No attendance record for today.",
				raw: {}
			};
			throw err;
		}
	},
	/**
	* Get employee face enrollment status.
	* Calls GET /attendance/face-status (normalized to /api/v1/attendance/face-status).
	*/
	getFaceStatus: async () => {
		try {
			const res = await api.get("attendance/face-status");
			const data = extractObjectPayload(res);
			const isEnrolled = Boolean(data.is_enrolled ?? data.isEnrolled ?? data.is_face_enrolled ?? data.face_registered ?? data.faceRegistered ?? (res && typeof res === "object" && (res.is_enrolled ?? res.isEnrolled)) ?? false);
			return {
				is_enrolled: isEnrolled,
				enrolled_at: data.enrolled_at || data.enrolledAt || null,
				faceRegistered: isEnrolled
			};
		} catch (err) {
			if (extractErrorCode(err) === "FACE_NOT_ENROLLED") return {
				is_enrolled: false,
				enrolled_at: null,
				faceRegistered: false
			};
			try {
				const fbData = extractObjectPayload(await api.get("attendance/face/me"));
				const isEnrolled = Boolean(fbData.face_registered ?? fbData.is_registered ?? fbData.is_enrolled ?? false);
				return {
					is_enrolled: isEnrolled,
					enrolled_at: fbData.face_enrolled_at || null,
					faceRegistered: isEnrolled
				};
			} catch {
				return {
					is_enrolled: false,
					enrolled_at: null,
					faceRegistered: false
				};
			}
		}
	},
	/**
	* Enroll / register the authenticated employee's face via Base64 snapshot.
	* Calls POST /attendance/face-enroll (normalized to /api/v1/attendance/face-enroll).
	*/
	enrollFace: async (imageBase64) => {
		try {
			const res = await api.post("attendance/face-enroll", { image_base64: imageBase64 });
			const data = extractObjectPayload(res);
			return {
				success: res.success ?? true,
				message: res.message || data.message || "Face successfully registered!"
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const enrichedError = new Error(errorMsg);
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
	},
	/**
	* Perform attendance check-in.
	* If image_base64 is provided, sends JSON payload to POST /attendance/checkin.
	* Otherwise falls back to multipart POST /attendance/face/check-in.
	*/
	checkIn: async (payload) => {
		if (!payload.image_base64 && !payload.file) throw new Error("A face photo is required for check-in. Please look directly into the camera.");
		if (payload.image_base64) try {
			const body = {
				image_base64: payload.image_base64,
				device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web")
			};
			if (payload.latitude != null || payload.longitude != null) {
				body.location = {
					latitude: payload.latitude,
					longitude: payload.longitude,
					accuracy: payload.accuracy
				};
				body.latitude = payload.latitude;
				body.longitude = payload.longitude;
				body.accuracy = payload.accuracy;
			}
			if (payload.notes) body.notes = payload.notes;
			if (payload.ipAddress) body.ip_address = payload.ipAddress;
			const res = await api.post("attendance/checkin", body);
			const data = extractObjectPayload(res);
			return {
				id: data.id || data.attendance_id || "",
				employeeId: data.employee_id || data.employeeId,
				employeeName: data.employee_name || data.employeeName,
				time: data.check_in_time || data.time || (/* @__PURE__ */ new Date()).toISOString(),
				checkInTime: data.check_in_time || data.time || (/* @__PURE__ */ new Date()).toISOString(),
				status: data.status || "checked-in",
				workingHours: data.working_hours ?? data.workingHours ?? null,
				success: true,
				message: res.message || data.message || "Attendance Verified & Marked Successfully!",
				isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const httpStatus = err?.response?.status || err?.status;
			const enrichedError = new Error(errorMsg);
			enrichedError.status = httpStatus;
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
		const formData = new FormData();
		formData.append("file", payload.file, "checkin-proof.jpg");
		if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
		if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
		if (payload.accuracy != null) formData.append("accuracy", payload.accuracy.toString());
		formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
		if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);
		try {
			const res = await apiInstance.post("/attendance/face/check-in", formData, { headers: { "Content-Type": "multipart/form-data" } });
			const data = extractObjectPayload(res.data);
			return {
				id: data.id || data.attendance_id || "",
				employeeId: data.employee_id || data.employeeId,
				employeeName: data.employee_name || data.employeeName,
				time: data.check_in_time || data.time || "",
				checkInTime: data.check_in_time || data.time || "",
				status: data.status || "checked-in",
				workingHours: data.working_hours ?? data.workingHours ?? null,
				success: true,
				message: res.data?.message || data.message || "Checked in successfully",
				isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const httpStatus = err?.response?.status || err?.status;
			const enrichedError = new Error(errorMsg);
			enrichedError.status = httpStatus;
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
	},
	/**
	* Perform attendance check-out.
	* Sends coordinates, device info, and photo proof to backend /api/v1/attendance/face/check-out.
	* Supports both multipart file and Base64 captured snapshot.
	*/
	checkOut: async (payload) => {
		let fileBlob = payload.file;
		if (!fileBlob && payload.image_base64) fileBlob = base64ToBlob(payload.image_base64, "image/jpeg");
		if (!fileBlob) throw new Error("A face photo is required for check-out. Please enable your camera and capture your face.");
		const formData = new FormData();
		formData.append("file", fileBlob, "checkout-proof.jpg");
		if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
		if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
		if (payload.accuracy != null) formData.append("accuracy", payload.accuracy.toString());
		formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
		if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);
		try {
			const res = await apiInstance.post("/attendance/face/check-out", formData, { headers: { "Content-Type": "multipart/form-data" } });
			const data = extractObjectPayload(res.data);
			return {
				id: data.id || data.attendance_id || "",
				employeeId: data.employee_id || data.employeeId,
				employeeName: data.employee_name || data.employeeName,
				time: data.check_out_time || data.time || "",
				checkOutTime: data.check_out_time || data.time || "",
				status: data.status || "checked-out",
				workingHours: data.working_hours ?? data.workingHours ?? null,
				success: true,
				message: res.data?.message || data.message || "Checked out successfully",
				isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const httpStatus = err?.response?.status || err?.status;
			const enrichedError = new Error(errorMsg);
			enrichedError.status = httpStatus;
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
	},
	/**
	* Start employee break with live face verification.
	* Calls POST /api/v1/attendance/break/start.
	*/
	startBreak: async (payload) => {
		if (!payload?.image_base64 && !payload?.file) throw new Error("A face photo is required for break verification. Please look directly into the camera.");
		try {
			const body = {
				image_base64: payload.image_base64,
				device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web")
			};
			if (payload.latitude != null || payload.longitude != null) {
				body.location = {
					latitude: payload.latitude,
					longitude: payload.longitude,
					accuracy: payload.accuracy
				};
				body.latitude = payload.latitude;
				body.longitude = payload.longitude;
				body.accuracy = payload.accuracy;
			}
			const noteContent = payload.notes || payload.reason;
			if (noteContent) body.notes = noteContent;
			if (payload.ipAddress) body.ip_address = payload.ipAddress;
			const res = await api.post("attendance/break/start", body);
			const data = extractObjectPayload(res);
			return {
				id: data.id || data.break_id || data.attendance_id || "",
				time: data.time || data.break_start || (/* @__PURE__ */ new Date()).toISOString(),
				status: data.status || "on-break",
				success: true,
				message: res.message || data.message || "Break started successfully",
				employeeId: data.employee_id || data.employeeId,
				employeeName: data.employee_name || data.employeeName,
				isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const httpStatus = err?.response?.status || err?.status;
			const enrichedError = new Error(errorMsg);
			enrichedError.status = httpStatus;
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
	},
	/**
	* End employee break with live face verification.
	* Calls POST /api/v1/attendance/break/end.
	*/
	endBreak: async (payload) => {
		if (!payload?.image_base64 && !payload?.file) throw new Error("A face photo is required for break verification. Please look directly into the camera.");
		try {
			const body = {
				image_base64: payload.image_base64,
				device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web")
			};
			if (payload.latitude != null || payload.longitude != null) {
				body.location = {
					latitude: payload.latitude,
					longitude: payload.longitude,
					accuracy: payload.accuracy
				};
				body.latitude = payload.latitude;
				body.longitude = payload.longitude;
				body.accuracy = payload.accuracy;
			}
			if (payload.ipAddress) body.ip_address = payload.ipAddress;
			const res = await api.post("attendance/break/end", body);
			const data = extractObjectPayload(res);
			return {
				id: data.id || data.break_id || data.attendance_id || "",
				time: data.time || data.break_end || (/* @__PURE__ */ new Date()).toISOString(),
				status: data.status || "checked-in",
				workingHours: data.working_hours ?? data.workingHours ?? null,
				success: true,
				message: res.message || data.message || "Break ended successfully",
				employeeId: data.employee_id || data.employeeId,
				employeeName: data.employee_name || data.employeeName,
				isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence
			};
		} catch (err) {
			const errorCode = extractErrorCode(err);
			const errorMsg = extractFaceApiError(err);
			const httpStatus = err?.response?.status || err?.status;
			const enrichedError = new Error(errorMsg);
			enrichedError.status = httpStatus;
			enrichedError.errorCode = errorCode;
			enrichedError.response = err?.response;
			throw enrichedError;
		}
	},
	/**
	* Fetch today's activity timeline.
	*
	* TODO (Backend): Endpoint GET /api/v1/attendance/timeline
	*/
	getTimeline: async () => {
		try {
			const list = extractListPayload(await api.get("attendance/face/history?limit=10"));
			const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const todayItems = list.filter((item) => {
				return (item.date ? item.date.split("T")[0] : "") === todayStr;
			});
			const events = [];
			todayItems.forEach((item) => {
				if (item.check_in_time) events.push({
					id: `${item.id}-in`,
					time: new Date(item.check_in_time).toLocaleTimeString("en-IN", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: true
					}),
					label: "Checked In",
					type: "checkin"
				});
				if (item.check_out_time) events.push({
					id: `${item.id}-out`,
					time: new Date(item.check_out_time).toLocaleTimeString("en-IN", {
						hour: "2-digit",
						minute: "2-digit",
						hour12: true
					}),
					label: "Checked Out",
					type: "checkout"
				});
			});
			return events;
		} catch {
			return [];
		}
	},
	/**
	* Fetch personal paginated daily attendance history from backend.
	* Calls GET /api/v1/attendance/face/history.
	*/
	getMyAttendanceHistory: async (page = 1, limit = 20) => {
		try {
			const res = await api.get(`attendance/face/history?page=${page}&limit=${limit}`);
			const payload = res?.data ?? res;
			const rawItems = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
			return {
				page,
				limit,
				total: typeof payload?.total === "number" ? payload.total : rawItems.length,
				items: rawItems.map((item, idx) => {
					const dStr = item.date ? item.date.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
					let status = "Present";
					if (item.check_in_time) {
						const checkInDate = new Date(item.check_in_time);
						if (!isNaN(checkInDate.getTime()) && checkInDate.getHours() >= 10) status = "Late";
						else status = "Present";
					} else status = "Absent";
					return {
						id: item.id || `hist-${idx}-${dStr}`,
						date: dStr,
						checkInTime: item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString("en-IN", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true
						}) : null,
						checkOutTime: item.check_out_time ? new Date(item.check_out_time).toLocaleTimeString("en-IN", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: true
						}) : null,
						workingHours: typeof item.working_hours === "number" ? Number(item.working_hours.toFixed(2)) : item.working_hours ? Number(item.working_hours) : null,
						employeeName: item.employee_name || "",
						status,
						location: item.latitude && item.longitude ? "Geofenced Site" : "Office"
					};
				})
			};
		} catch (err) {
			console.warn("Could not fetch attendance history:", err);
			return {
				page,
				limit,
				total: 0,
				items: []
			};
		}
	},
	/**
	* Backend geofence validation.
	*
	* TODO (Backend): Endpoint POST /api/v1/attendance/geofence/verify
	* Body: { latitude, longitude, office_id? }
	*/
	verifyGeofence: async (coords) => {
		const data = extractObjectPayload(await api.post("attendance/geofence/verify", {
			latitude: coords.latitude,
			longitude: coords.longitude,
			office_id: coords.officeId
		}));
		return {
			isInside: Boolean(data.is_inside ?? data.isInside),
			distanceMeters: data.distance_meters ?? data.distanceMeters,
			officeName: data.office_name ?? data.officeName,
			allowedRadiusMeters: data.allowed_radius_meters ?? data.allowedRadiusMeters
		};
	},
	/**
	* List all configured work shifts.
	*
	* TODO (Backend): Endpoint GET /api/v1/attendance/shifts
	*/
	getShifts: async () => {
		return extractListPayload(await api.get("attendance/shifts")).map((item) => ({
			id: item.id || item._id,
			name: item.name || item.shift_name,
			code: item.code || item.shift_code || "SHIFT",
			startTime: item.start_time || item.startTime || "09:00",
			endTime: item.end_time || item.endTime || "18:00",
			workHours: Number(item.work_hours ?? item.workHours ?? 9),
			gracePeriodMinutes: Number(item.grace_period_minutes ?? item.gracePeriodMinutes ?? 15),
			breakDurationMinutes: Number(item.break_duration_minutes ?? item.breakDurationMinutes ?? 60),
			nightShift: Boolean(item.night_shift ?? item.nightShift ?? false),
			nightPremiumPercent: Number(item.night_premium_percent ?? item.nightPremiumPercent ?? 0),
			workingDays: Array.isArray(item.working_days) ? item.working_days : item.workingDays || [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri"
			],
			assignedEmployeesCount: item.assigned_employees_count ?? item.assignedEmployeesCount ?? 0,
			isActive: item.is_active ?? item.isActive ?? true,
			color: item.color || "#6366F1",
			description: item.description || "",
			createdAt: item.created_at,
			updatedAt: item.updated_at
		}));
	},
	/**
	* Create a new shift template.
	*
	* TODO (Backend): Endpoint POST /api/v1/attendance/shifts
	*/
	createShift: async (data) => {
		const item = extractObjectPayload(await api.post("attendance/shifts", {
			name: data.name,
			code: data.code,
			start_time: data.startTime,
			end_time: data.endTime,
			grace_period_minutes: data.gracePeriodMinutes,
			break_duration_minutes: data.breakDurationMinutes,
			night_shift: data.nightShift,
			night_premium_percent: data.nightPremiumPercent,
			working_days: data.workingDays,
			color: data.color,
			description: data.description,
			is_active: data.isActive ?? true
		}));
		return {
			id: item.id || item._id,
			name: item.name || data.name,
			code: item.code || data.code,
			startTime: item.start_time || data.startTime,
			endTime: item.end_time || data.endTime,
			workHours: Number(item.work_hours || 9),
			gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes),
			breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes),
			nightShift: Boolean(item.night_shift ?? data.nightShift),
			nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent),
			workingDays: item.working_days || data.workingDays,
			assignedEmployeesCount: 0,
			isActive: item.is_active ?? true,
			color: item.color || data.color,
			description: item.description || data.description
		};
	},
	/**
	* Update an existing shift.
	*
	* TODO (Backend): Endpoint PUT /api/v1/attendance/shifts/:id
	*/
	updateShift: async (id, data) => {
		const item = extractObjectPayload(await api.put(`attendance/shifts/${id}`, {
			name: data.name,
			code: data.code,
			start_time: data.startTime,
			end_time: data.endTime,
			grace_period_minutes: data.gracePeriodMinutes,
			break_duration_minutes: data.breakDurationMinutes,
			night_shift: data.nightShift,
			night_premium_percent: data.nightPremiumPercent,
			working_days: data.workingDays,
			color: data.color,
			description: data.description,
			is_active: data.isActive
		}));
		return {
			id: item.id || id,
			name: item.name || data.name || "",
			code: item.code || data.code || "",
			startTime: item.start_time || data.startTime || "",
			endTime: item.end_time || data.endTime || "",
			workHours: Number(item.work_hours || 9),
			gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes || 15),
			breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes || 60),
			nightShift: Boolean(item.night_shift ?? data.nightShift),
			nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent ?? 0),
			workingDays: item.working_days || data.workingDays || [],
			assignedEmployeesCount: item.assigned_employees_count ?? 0,
			isActive: item.is_active ?? true,
			color: item.color || data.color,
			description: item.description || data.description
		};
	},
	/**
	* Assign shift to one or more employees.
	*
	* TODO (Backend): Endpoint POST /api/v1/attendance/shifts/:id/assign
	* Body: { employee_ids: string[], effective_date: string, notes?: string }
	*/
	assignShift: async (shiftId, payload) => {
		return {
			success: true,
			assignedCount: extractObjectPayload(await api.post(`attendance/shifts/${shiftId}/assign`, {
				employee_ids: payload.employeeIds,
				effective_date: payload.effectiveDate,
				notes: payload.notes
			})).assigned_count ?? payload.employeeIds.length
		};
	},
	/**
	* Delete a shift.
	*
	* TODO (Backend): Endpoint DELETE /api/v1/attendance/shifts/:id
	*/
	deleteShift: async (id) => {
		await api.delete(`attendance/shifts/${id}`);
		return { success: true };
	},
	/**
	* List rotational team roster entries.
	*
	* TODO (Backend): Endpoint GET /api/v1/attendance/rosters
	* Query params: date_from, date_to, department, employee_id
	*/
	getRosters: async (params) => {
		const query = new URLSearchParams();
		if (params?.dateFrom) query.set("date_from", params.dateFrom);
		if (params?.dateTo) query.set("date_to", params.dateTo);
		if (params?.department) query.set("department", params.department);
		const qs = query.toString();
		return extractListPayload(await api.get(`attendance/rosters${qs ? `?${qs}` : ""}`)).map((item) => ({
			id: item.id || item._id,
			employeeId: item.employee_id || item.employeeId,
			employeeName: item.employee_name || item.employeeName || "Employee",
			department: item.department || "General",
			designation: item.designation || "",
			date: item.date,
			shift: item.shift || "Morning",
			startTime: item.start_time || item.startTime || "08:00",
			endTime: item.end_time || item.endTime || "16:00",
			workingHours: Number(item.working_hours ?? item.workingHours ?? 8),
			breakTime: item.break_time || item.breakTime || "45 mins",
			location: item.location || "Office",
			manager: item.manager || item.manager_name || "Manager",
			status: item.status || "Approved"
		}));
	},
	/**
	* Create a roster entry.
	*
	* TODO (Backend): Endpoint POST /api/v1/attendance/rosters
	*/
	createRoster: async (data) => {
		const item = extractObjectPayload(await api.post("attendance/rosters", {
			employee_id: data.employeeId,
			employee_name: data.employeeName,
			department: data.department,
			designation: data.designation,
			date: data.date,
			shift: data.shift,
			start_time: data.startTime,
			end_time: data.endTime,
			working_hours: data.workingHours,
			break_time: data.breakTime,
			location: data.location,
			manager: data.manager,
			status: data.status,
			recurring: data.recurring
		}));
		return {
			id: item.id || item._id,
			employeeId: item.employee_id || data.employeeId,
			employeeName: item.employee_name || data.employeeName,
			department: item.department || data.department,
			designation: item.designation || data.designation,
			date: item.date || data.date,
			shift: item.shift || data.shift,
			startTime: item.start_time || data.startTime,
			endTime: item.end_time || data.endTime,
			workingHours: Number(item.working_hours ?? data.workingHours),
			breakTime: item.break_time || data.breakTime,
			location: item.location || data.location,
			manager: item.manager || data.manager,
			status: item.status || data.status
		};
	},
	/**
	* Update a roster entry.
	*
	* TODO (Backend): Endpoint PUT /api/v1/attendance/rosters/:id
	*/
	updateRoster: async (id, data) => {
		const item = extractObjectPayload(await api.put(`attendance/rosters/${id}`, {
			employee_id: data.employeeId,
			employee_name: data.employeeName,
			department: data.department,
			designation: data.designation,
			date: data.date,
			shift: data.shift,
			start_time: data.startTime,
			end_time: data.endTime,
			working_hours: data.workingHours,
			break_time: data.breakTime,
			location: data.location,
			manager: data.manager,
			status: data.status
		}));
		return {
			id: item.id || id,
			employeeId: item.employee_id || data.employeeId || "",
			employeeName: item.employee_name || data.employeeName || "",
			department: item.department || data.department || "",
			designation: item.designation || data.designation || "",
			date: item.date || data.date || "",
			shift: item.shift || data.shift || "Morning",
			startTime: item.start_time || data.startTime || "",
			endTime: item.end_time || data.endTime || "",
			workingHours: Number(item.working_hours ?? data.workingHours ?? 8),
			breakTime: item.break_time || data.breakTime || "",
			location: item.location || data.location || "",
			manager: item.manager || data.manager || "",
			status: item.status || data.status || "Approved"
		};
	},
	/**
	* Delete a roster entry.
	*
	* TODO (Backend): Endpoint DELETE /api/v1/attendance/rosters/:id
	*/
	deleteRoster: async (id) => {
		await api.delete(`attendance/rosters/${id}`);
		return { success: true };
	},
	/**
	* List holidays from backend.
	* Primary route: GET /api/v1/calendar/holidays (Existing on backend).
	* Also aliases to GET /api/v1/attendance/holidays.
	*/
	getHolidays: async (params) => {
		const query = new URLSearchParams();
		if (params?.branch && params.branch !== "all") query.set("branch", params.branch);
		if (params?.year) query.set("year", params.year.toString());
		const qs = query.toString();
		let res;
		try {
			res = await api.get(`calendar/holidays${qs ? `?${qs}` : ""}`);
		} catch {
			res = await api.get(`attendance/holidays${qs ? `?${qs}` : ""}`);
		}
		return extractListPayload(res).map((item) => ({
			id: item.id || item._id,
			name: item.holiday_name || item.name,
			description: item.description || "",
			date: item.holiday_date || item.date,
			type: item.holiday_type || item.type || "Public",
			country: item.country || "USA",
			state: item.state || "All States",
			office: item.branch || item.office || "All Offices",
			department: item.department || "All Departments",
			status: item.status || "Active",
			createdBy: item.created_by || item.createdBy || "Admin",
			createdDate: item.created_at ? item.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			updatedDate: item.updated_at ? item.updated_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			notes: item.notes || "",
			color: item.color || "#3B82F6",
			recurring: Boolean(item.is_recurring ?? item.recurring),
			everyYear: Boolean(item.every_year ?? item.everyYear ?? true),
			applyToAll: Boolean(item.apply_to_all ?? item.applyToAll ?? true)
		}));
	},
	/**
	* Create a holiday entry.
	* Primary route: POST /api/v1/calendar/holidays.
	*/
	createHoliday: async (data) => {
		const payload = {
			holiday_name: data.name,
			holiday_date: data.date,
			holiday_type: data.type,
			branch: data.office || null,
			description: data.description || null,
			is_recurring: data.recurring ?? false
		};
		let res;
		try {
			res = await api.post("calendar/holidays", payload);
		} catch {
			res = await api.post("attendance/holidays", {
				...payload,
				name: data.name,
				date: data.date,
				type: data.type
			});
		}
		const item = extractObjectPayload(res);
		return {
			id: item.id || item._id,
			name: item.holiday_name || data.name,
			description: item.description || data.description || "",
			date: item.holiday_date || data.date,
			type: item.holiday_type || data.type,
			country: data.country || "USA",
			state: data.state || "All States",
			office: item.branch || data.office || "All Offices",
			department: data.department || "All Departments",
			status: "Active",
			createdBy: "Current User",
			createdDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			updatedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			notes: data.notes || "",
			color: data.color || "#3B82F6",
			recurring: Boolean(item.is_recurring ?? data.recurring),
			everyYear: Boolean(data.everyYear ?? true),
			applyToAll: Boolean(data.applyToAll ?? true)
		};
	},
	/**
	* Update an existing holiday.
	* Primary route: PUT /api/v1/calendar/holidays/:id.
	*/
	updateHoliday: async (id, data) => {
		const payload = {};
		if (data.name) payload.holiday_name = data.name;
		if (data.date) payload.holiday_date = data.date;
		if (data.type) payload.holiday_type = data.type;
		if (data.office !== void 0) payload.branch = data.office;
		if (data.description !== void 0) payload.description = data.description;
		if (data.recurring !== void 0) payload.is_recurring = data.recurring;
		let res;
		try {
			res = await api.put(`calendar/holidays/${id}`, payload);
		} catch {
			res = await api.put(`attendance/holidays/${id}`, payload);
		}
		const item = extractObjectPayload(res);
		return {
			id: item.id || id,
			name: item.holiday_name || data.name || "",
			description: item.description || data.description || "",
			date: item.holiday_date || data.date || "",
			type: item.holiday_type || data.type || "Public",
			country: data.country || "USA",
			state: data.state || "All States",
			office: item.branch || data.office || "All Offices",
			department: data.department || "All Departments",
			status: "Active",
			createdBy: "Current User",
			createdDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			updatedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			notes: data.notes || "",
			color: data.color || "#3B82F6",
			recurring: Boolean(item.is_recurring ?? data.recurring),
			everyYear: Boolean(data.everyYear ?? true),
			applyToAll: Boolean(data.applyToAll ?? true)
		};
	},
	/**
	* Delete a holiday entry.
	* Primary route: DELETE /api/v1/calendar/holidays/:id.
	*/
	deleteHoliday: async (id) => {
		try {
			await api.delete(`calendar/holidays/${id}`);
		} catch {
			await api.delete(`attendance/holidays/${id}`);
		}
		return { success: true };
	},
	/**
	* Bulk import holidays via CSV/Excel file or payload.
	*
	* TODO (Backend): Endpoint POST /api/v1/attendance/holidays/import (or /calendar/holidays/import)
	* Accepts multipart/form-data with file or JSON list of holidays.
	*/
	importHolidays: async (fileOrList) => {
		if (fileOrList instanceof File) {
			const formData = new FormData();
			formData.append("file", fileOrList);
			try {
				return { importedCount: extractObjectPayload((await apiInstance.post("/calendar/holidays/import", formData, { headers: { "Content-Type": "multipart/form-data" } })).data).imported_count ?? 1 };
			} catch (err) {
				if (err?.response?.status === 404) return { importedCount: extractObjectPayload((await apiInstance.post("/attendance/holidays/import", formData, { headers: { "Content-Type": "multipart/form-data" } })).data).imported_count ?? 1 };
				throw err;
			}
		} else {
			let count = 0;
			for (const h of fileOrList) {
				await attendanceApi.createHoliday(h);
				count++;
			}
			return { importedCount: count };
		}
	},
	/**
	* Resolves the authenticated employee profile from the backend database.
	*/
	resolveCurrentEmployee: async () => {
		const ws = aurix.get();
		const user = ws.user;
		if (!user) return null;
		if (user.role === "employee") {
			const localMatch = ws.employees?.find((e) => e.email === user.email || e.id === user.id);
			return {
				id: user.id,
				employee_id: localMatch?.employeeId || `EMP-${user.id.slice(0, 6).toUpperCase()}`,
				full_name: user.fullName || "Employee",
				email: user.email,
				shift: localMatch?.shift || null,
				branch: ws.company?.city || null,
				work_location: "Office",
				department: localMatch?.department || null,
				designation: localMatch?.designation || null
			};
		}
		try {
			const res = await apiInstance.get("/employees", { params: {
				search: user.email || user.fullName,
				limit: 10
			} });
			const data = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
			const match = (Array.isArray(data) ? data : []).find((e) => e.user_id === user.id || e.id === user.id || e.company_email === user.email || e.personal_email === user.email);
			if (match) return {
				id: match.id,
				employee_id: match.employee_id || `EMP-${match.id.slice(0, 6)}`,
				full_name: `${match.first_name || ""} ${match.last_name || ""}`.trim() || match.full_name || user.fullName,
				email: match.company_email || match.personal_email || user.email,
				shift: match.shift || null,
				branch: match.branch || null,
				work_location: match.work_location || null,
				department: match.department || "General",
				designation: match.designation || "Staff"
			};
		} catch {}
		const localMatch = ws.employees?.find((e) => e.email === user.email || e.id === user.id);
		if (localMatch) return {
			id: localMatch.id,
			employee_id: localMatch.employeeId,
			full_name: localMatch.fullName,
			email: localMatch.email,
			shift: localMatch.shift || null,
			branch: ws.company?.city || null,
			work_location: "Headquarters",
			department: localMatch.department,
			designation: localMatch.designation
		};
		return null;
	},
	/**
	* Fetches the authenticated employee's assigned shifts, today's schedule,
	* upcoming scheduled shifts, and shift history from real backend APIs.
	*/
	getMyShiftSchedule: async (requestedEmployeeId) => {
		const currentEmp = await attendanceApi.resolveCurrentEmployee();
		if (!currentEmp) throw new Error("Unable to identify the authenticated employee.");
		if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) throw new Error("403 Forbidden: You do not have authorization to view shifts of other employees.");
		const assignedShiftName = currentEmp.shift;
		if (!assignedShiftName || !assignedShiftName.trim()) return {
			hasAssignedShift: false,
			employeeId: currentEmp.employee_id,
			employeeName: currentEmp.full_name,
			department: currentEmp.department || "General",
			designation: currentEmp.designation || "Staff",
			branch: currentEmp.branch || "Headquarters",
			currentShift: null,
			todayShift: null,
			upcomingShifts: [],
			shiftHistory: []
		};
		const shiftDef = parseShiftDefinition(assignedShiftName);
		const [todayPunchRes, historyRes, holidaysRes] = await Promise.allSettled([
			api.get("attendance/face/me"),
			api.get("attendance/face/history?limit=20"),
			attendanceApi.getHolidays({
				branch: currentEmp.branch || void 0,
				year: (/* @__PURE__ */ new Date()).getFullYear()
			})
		]);
		const todayPunch = todayPunchRes.status === "fulfilled" && todayPunchRes.value?.data ? todayPunchRes.value.data : todayPunchRes.status === "fulfilled" && todayPunchRes.value?.checked_in !== void 0 ? todayPunchRes.value : null;
		const historyItems = historyRes.status === "fulfilled" ? historyRes.value?.data?.items || historyRes.value?.items || [] : [];
		const holidayDates = new Set(holidaysRes.status === "fulfilled" ? holidaysRes.value.map((h) => h.date) : []);
		const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const todayDateObj = /* @__PURE__ */ new Date();
		const dayOfWeek = todayDateObj.getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		const isHoliday = holidayDates.has(todayStr);
		const todayShift = {
			date: todayStr,
			day: todayDateObj.toLocaleDateString("en-US", { weekday: "long" }),
			shift: shiftDef,
			checkedIn: Boolean(todayPunch?.checked_in),
			checkedOut: Boolean(todayPunch?.checked_out),
			checkInTime: todayPunch?.check_in_time ? formatTimeStr(todayPunch.check_in_time) : null,
			checkOutTime: todayPunch?.check_out_time ? formatTimeStr(todayPunch.check_out_time) : null,
			workingHours: todayPunch?.working_hours ?? (todayPunch?.checked_in ? shiftDef.totalWorkingHours : null),
			isOffDay: isWeekend || isHoliday
		};
		const upcomingShifts = [];
		for (let i = 1; i <= 14; i++) {
			const d = new Date(todayDateObj);
			d.setDate(todayDateObj.getDate() + i);
			const dateStr = d.toISOString().split("T")[0];
			const dOfWeek = d.getDay();
			const isOff = dOfWeek === 0 || dOfWeek === 6;
			const isHol = holidayDates.has(dateStr);
			if (!isOff && !isHol) upcomingShifts.push({
				id: `upcoming-${dateStr}`,
				date: dateStr,
				day: d.toLocaleDateString("en-US", { weekday: "long" }),
				shiftName: shiftDef.shiftName,
				startTime: shiftDef.startTime,
				endTime: shiftDef.endTime,
				breakDuration: shiftDef.breakDuration,
				workingHours: shiftDef.totalWorkingHours,
				shiftType: shiftDef.shiftType,
				status: "Scheduled"
			});
		}
		const shiftHistory = historyItems.map((item, idx) => {
			const dStr = item.date ? item.date.split("T")[0] : todayStr;
			const dObj = new Date(dStr);
			return {
				id: item.id || `hist-${idx}-${dStr}`,
				date: dStr,
				day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
				shiftName: shiftDef.shiftName,
				checkInTime: item.check_in_time ? formatTimeStr(item.check_in_time) : null,
				checkOutTime: item.check_out_time ? formatTimeStr(item.check_out_time) : null,
				workingHours: item.working_hours ? Number(item.working_hours) : null,
				status: item.check_in_time ? "Present" : "Absent"
			};
		});
		return {
			hasAssignedShift: true,
			employeeId: currentEmp.employee_id,
			employeeName: currentEmp.full_name,
			department: currentEmp.department || "General",
			designation: currentEmp.designation || "Staff",
			branch: currentEmp.branch || "Headquarters",
			currentShift: shiftDef,
			todayShift,
			upcomingShifts,
			shiftHistory
		};
	},
	/**
	* Fetches the employee's planned work schedule / roster entries from the real backend.
	*/
	getMyRoster: async (month, year, requestedEmployeeId) => {
		const currentEmp = await attendanceApi.resolveCurrentEmployee();
		if (!currentEmp) throw new Error("Unable to identify the authenticated employee.");
		if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) throw new Error("403 Forbidden: You do not have authorization to view the roster of other employees.");
		const targetYear = year ?? (/* @__PURE__ */ new Date()).getFullYear();
		const targetMonth = month ?? (/* @__PURE__ */ new Date()).getMonth() + 1;
		const assignedShiftName = currentEmp.shift;
		let backendRosters = [];
		try {
			backendRosters = await attendanceApi.getRosters();
		} catch {}
		const myBackendRosters = backendRosters.filter((r) => r.employeeId === currentEmp.id || r.employeeId === currentEmp.employee_id);
		const holidays = await attendanceApi.getHolidays({
			branch: currentEmp.branch || void 0,
			year: targetYear
		}).catch(() => []);
		const holidayMap = /* @__PURE__ */ new Map();
		holidays.forEach((h) => holidayMap.set(h.date, h));
		if (!assignedShiftName && myBackendRosters.length === 0) return {
			entries: [],
			hasRoster: false,
			employeeName: currentEmp.full_name,
			shiftName: "None"
		};
		const shiftDef = parseShiftDefinition(assignedShiftName || "Morning");
		const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
		const entries = [];
		for (let day = 1; day <= daysInMonth; day++) {
			const d = new Date(targetYear, targetMonth - 1, day);
			const dateStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
			const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
			const dayOfWeek = d.getDay();
			const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
			const explicit = myBackendRosters.find((r) => r.date === dateStr);
			if (explicit) {
				entries.push({
					id: explicit.id,
					date: dateStr,
					day: dayName,
					shiftName: explicit.shift,
					startTime: formatTimeStr(explicit.startTime),
					endTime: formatTimeStr(explicit.endTime),
					workingHours: explicit.workingHours,
					status: explicit.shift === "Off Day" ? "Weekly Off" : explicit.shift === "Holiday" ? "Holiday" : "Working",
					notes: explicit.location
				});
				continue;
			}
			const holiday = holidayMap.get(dateStr);
			if (holiday) {
				entries.push({
					id: `roster-${dateStr}`,
					date: dateStr,
					day: dayName,
					shiftName: holiday.name,
					startTime: "—",
					endTime: "—",
					workingHours: 0,
					status: "Holiday",
					notes: holiday.description || holiday.type
				});
				continue;
			}
			if (isWeekend) {
				entries.push({
					id: `roster-${dateStr}`,
					date: dateStr,
					day: dayName,
					shiftName: "—",
					startTime: "—",
					endTime: "—",
					workingHours: 0,
					status: "Weekly Off"
				});
				continue;
			}
			entries.push({
				id: `roster-${dateStr}`,
				date: dateStr,
				day: dayName,
				shiftName: shiftDef.shiftName,
				startTime: shiftDef.startTime,
				endTime: shiftDef.endTime,
				workingHours: shiftDef.totalWorkingHours,
				status: "Working"
			});
		}
		return {
			entries,
			hasRoster: true,
			employeeName: currentEmp.full_name,
			shiftName: shiftDef.shiftName
		};
	},
	/**
	* Submits an employee request for shift or roster change to the backend support ticket workflow.
	*/
	requestScheduleChange: async (payload) => {
		const res = await api.post("/api/v2/employee-support/tickets", {
			category: "HR",
			priority: "MEDIUM",
			title: `${payload.type === "shift" ? "Shift" : "Roster"} Change Request: ${payload.requestedShift}`,
			description: `Schedule change requested to ${payload.requestedShift}. Effective Date: ${payload.effectiveDate}. Reason: ${payload.reason}`
		});
		return {
			success: res?.success !== false,
			message: res?.message || "Your schedule change request has been submitted to HR."
		};
	}
};
function parseShiftDefinition(raw) {
	const s = raw.trim().toLowerCase();
	if (s.includes("night")) return {
		shiftName: "Night Shift",
		shiftType: "Night",
		startTime: "10:00 PM",
		endTime: "07:00 AM",
		breakDuration: "1 Hour",
		breakWindow: "02:00 AM – 03:00 AM",
		totalWorkingHours: 8,
		gracePeriodMinutes: 15,
		nightPremiumPercent: 15,
		workingDays: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		],
		description: "Standard night operational shift with night differential premium allowance."
	};
	if (s.includes("flex")) return {
		shiftName: "Flexible Shift",
		shiftType: "Flexible",
		startTime: "10:00 AM",
		endTime: "07:00 PM",
		breakDuration: "1 Hour",
		breakWindow: "Flexible (01:00 PM – 03:00 PM)",
		totalWorkingHours: 8,
		gracePeriodMinutes: 30,
		nightPremiumPercent: 0,
		workingDays: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		],
		description: "Flexible work timings with core collaborative hours from 11:00 AM to 04:00 PM."
	};
	if (s.includes("even")) return {
		shiftName: "Evening Shift",
		shiftType: "Regular",
		startTime: "02:00 PM",
		endTime: "11:00 PM",
		breakDuration: "1 Hour",
		breakWindow: "06:00 PM – 07:00 PM",
		totalWorkingHours: 8,
		gracePeriodMinutes: 15,
		nightPremiumPercent: 5,
		workingDays: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		],
		description: "Afternoon coverage shift providing extended business operational continuity."
	};
	return {
		shiftName: raw.includes("Shift") ? raw : `${raw} Shift`,
		shiftType: "Regular",
		startTime: "09:00 AM",
		endTime: "06:00 PM",
		breakDuration: "1 Hour",
		breakWindow: "01:00 PM – 02:00 PM",
		totalWorkingHours: 8,
		gracePeriodMinutes: 15,
		nightPremiumPercent: 0,
		workingDays: [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		],
		description: "Standard daytime corporate office schedule with 8 hours of productive working time."
	};
}
function formatTimeStr(isoOrTime) {
	if (!isoOrTime) return "—";
	if (isoOrTime.includes("T")) {
		const d = new Date(isoOrTime);
		if (!isNaN(d.getTime())) return d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
	}
	if (isoOrTime.includes(":") && !isoOrTime.includes("AM") && !isoOrTime.includes("PM")) {
		const parts = isoOrTime.split(":");
		let h = parseInt(parts[0], 10);
		const m = parts[1] || "00";
		const ampm = h >= 12 ? "PM" : "AM";
		h = h % 12 || 12;
		return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
	}
	return isoOrTime;
}
//#endregion
export { extractFaceApiError as n, attendanceApi as t };
