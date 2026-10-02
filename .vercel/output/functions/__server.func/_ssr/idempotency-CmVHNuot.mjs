//#region node_modules/.nitro/vite/services/ssr/assets/idempotency-CmVHNuot.js
/**
* Idempotency Key Management for Financial Mutations.
* Generates and validates cryptographic UUIDv4 tokens to prevent duplicate payment submissions.
*/
function generateIdempotencyKey() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0;
		return (c === "x" ? r : r & 3 | 8).toString(16);
	});
}
//#endregion
export { generateIdempotencyKey as t };
