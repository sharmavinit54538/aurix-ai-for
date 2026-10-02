import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paymentApi-ymZ2k77q.js
/**
* Payment & Disbursement API Service.
* Implements contracts defined in docs/PAYROLL_BACKEND_CONTRACT.md.
*
* Rules:
* - Never fake successful responses when backend is unavailable (404/501).
* - Enforce Idempotency-Key on all mutations.
* - Set Cache-Control: no-store on sensitive financial endpoints.
*/
var paymentApi = {
	/**
	* Create a new payment batch from a finalized payroll run.
	*/
	async createPaymentBatch(runId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/runs/${runId}/payment-batches`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* List all payment batches associated with a specific run.
	*/
	async getPaymentBatchesForRun(runId) {
		return (await apiInstance.get(`/api/v2/payroll/runs/${runId}/payment-batches`, { headers: { "Cache-Control": "no-store" } })).data.data || [];
	},
	/**
	* List payment batches globally (for /dashboard/payroll/payments).
	*/
	async getPaymentBatches(params) {
		return (await apiInstance.get("/api/v2/payroll/payment-batches", {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	/**
	* Retrieve payment batch details and employee payment line items.
	*/
	async getPaymentBatch(batchId, params) {
		return (await apiInstance.get(`/api/v2/payroll/payment-batches/${batchId}`, {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	/**
	* Run bank account and IFSC validation across all employee records in the batch.
	*/
	async validatePaymentBatch(batchId, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/validate`, {}, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Approve payment batch (Maker-checker enforcement).
	*/
	async approvePaymentBatch(batchId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/approve`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Reject payment batch and return to draft.
	*/
	async rejectPaymentBatch(batchId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/reject`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Generate server-side bank payment file.
	*/
	async generateBankFile(batchId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/bank-file`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Download the generated bank file as a Blob.
	*/
	async downloadBankFile(batchId) {
		return (await apiInstance.get(`/api/v2/payroll/payment-batches/${batchId}/bank-file/download`, {
			responseType: "blob",
			headers: { "Cache-Control": "no-store" }
		})).data;
	},
	/**
	* Mark batch as submitted to bank portal.
	*/
	async submitPaymentBatch(batchId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/submit`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Upload bank disbursement response CSV for parsing and validation preview.
	*/
	async previewBankResponse(batchId, file) {
		const formData = new FormData();
		formData.append("file", file);
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/bank-response/preview`, formData, { headers: {
			"Content-Type": "multipart/form-data",
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Apply validated bank response to update employee payment statuses.
	*/
	async applyBankResponse(batchId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/bank-response/apply`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Formally reconcile payment batch using integer paise balance.
	*/
	async reconcilePaymentBatch(batchId, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/reconcile`, {}, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Hold an individual employee payment with mandatory reason.
	*/
	async holdPaymentItem(batchId, itemId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/hold`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Release a previously held employee payment.
	*/
	async releasePaymentItem(batchId, itemId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/release`, payload || {}, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Retry a failed employee payment.
	*/
	async retryPaymentItem(batchId, itemId, payload, idempotencyKey) {
		const key = idempotencyKey || generateIdempotencyKey();
		return (await apiInstance.post(`/api/v2/payroll/payment-batches/${batchId}/items/${itemId}/retry`, payload, { headers: {
			"Idempotency-Key": key,
			"Cache-Control": "no-store"
		} })).data.data;
	},
	/**
	* Get active company source bank accounts.
	*/
	async getCompanyBankAccounts(companyId) {
		return (await apiInstance.get(`/api/v2/payroll/companies/${companyId}/bank-accounts`, { headers: { "Cache-Control": "no-store" } })).data.data || [];
	},
	/**
	* Audited reveal of full employee bank account number.
	*/
	async revealEmployeeBankAccount(employeeId, reason) {
		return (await apiInstance.post(`/api/v2/payroll/employees/${employeeId}/reveal-bank-account`, { reason }, { headers: { "Cache-Control": "no-store" } })).data.data;
	}
};
//#endregion
export { paymentApi as t };
