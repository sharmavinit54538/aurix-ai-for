import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compensationApi-B-vb0VVg.js
/**
* Salary Structure & Compensation Management API.
* Handles Pay Component Master, Salary Structure Templates, Employee Compensation,
* Revisions with Maker-Checker, and Bulk Compensation Import.
*/
var compensationApi = {
	async getPayComponents() {
		return (await apiInstance.get("/api/v2/payroll/pay-components", { headers: { "Cache-Control": "no-store" } })).data.data || [];
	},
	async createPayComponent(payload) {
		return (await apiInstance.post("/api/v2/payroll/pay-components", payload, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async getSalaryStructures() {
		return (await apiInstance.get("/api/v2/payroll/salary-structures", { headers: { "Cache-Control": "no-store" } })).data.data || [];
	},
	async createSalaryStructure(payload) {
		const res = await apiInstance.post("/api/v2/payroll/salary-structures", payload, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} });
		return res.data.data || res.data;
	},
	async getEmployeeCompensations(params) {
		return (await apiInstance.get("/api/v2/payroll/compensations", {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	async getEmployeeCompensationDetail(employeeId) {
		return (await apiInstance.get(`/api/v2/payroll/employees/${employeeId}/compensation`, { headers: { "Cache-Control": "no-store" } })).data.data;
	},
	async proposeCompensationRevision(employeeId, payload) {
		return (await apiInstance.post(`/api/v2/payroll/employees/${employeeId}/compensation/revisions`, payload, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async approveCompensationRevision(revisionId, remarks) {
		return (await apiInstance.post(`/api/v2/payroll/compensation/revisions/${revisionId}/approve`, { remarks }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async rejectCompensationRevision(revisionId, reason) {
		return (await apiInstance.post(`/api/v2/payroll/compensation/revisions/${revisionId}/reject`, { reason }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async previewBulkCompensation(file) {
		const formData = new FormData();
		formData.append("file", file);
		return (await apiInstance.post("/api/v2/payroll/compensation/bulk-import/preview", formData, { headers: {
			"Content-Type": "multipart/form-data",
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async applyBulkCompensation(previewToken) {
		return (await apiInstance.post("/api/v2/payroll/compensation/bulk-import/apply", { previewToken }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	}
};
//#endregion
export { compensationApi as t };
