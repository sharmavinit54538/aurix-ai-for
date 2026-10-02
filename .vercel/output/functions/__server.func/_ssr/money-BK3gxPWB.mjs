import { i as formatINR } from "./format-8CvzIoFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-BK3gxPWB.js
/**
* Integer Paise Precision Money Utilities.
* Guarantees zero floating point error in all payment batch calculations and reconciliation.
*/
/**
* Converts a currency string or numeric Rupee value to integer Paise.
* e.g. "125000.50" -> 12500050 paise
*/
function toPaise(val) {
	if (val === null || val === void 0 || val === "") return 0;
	const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
	if (isNaN(num)) return 0;
	return Math.round(num * 100);
}
/**
* Converts integer Paise to numeric Rupees.
*/
function toRupees(paise) {
	if (paise === null || paise === void 0) return 0;
	const n = typeof paise === "bigint" ? Number(paise) : Number(paise);
	if (isNaN(n)) return 0;
	return n / 100;
}
/**
* Formats integer paise into localized INR currency string.
*/
function formatPaiseToINR(paise) {
	if (paise === null || paise === void 0) return "₹0.00";
	return formatINR(toRupees(paise));
}
/**
* Safely adds integer paise values avoiding float overflow.
*/
function addPaise(...amounts) {
	return amounts.reduce((acc, curr) => {
		if (curr === null || curr === void 0) return acc;
		const n = typeof curr === "bigint" ? Number(curr) : Number(curr);
		return acc + (isNaN(n) ? 0 : Math.round(n));
	}, 0);
}
/**
* Safely subtracts subtrahend from minuend in integer paise.
*/
function subtractPaise(minuend, subtrahend) {
	const m = typeof minuend === "bigint" ? Number(minuend) : Number(minuend);
	const s = typeof subtrahend === "bigint" ? Number(subtrahend) : Number(subtrahend);
	return Math.round(m) - Math.round(s);
}
/**
* Formal mathematical reconciliation test:
* expectedPaise === (paidPaise + failedPaise + heldPaise + processingPaise)
*/
function evaluateReconciliation(expectedPaise, paidPaise, failedPaise, heldPaise, processingPaise = 0) {
	const accounted = addPaise(paidPaise, failedPaise, heldPaise, processingPaise);
	const mismatch = subtractPaise(expectedPaise, accounted);
	return {
		isReconciled: mismatch === 0,
		mismatchPaise: mismatch,
		totalAccountedPaise: accounted
	};
}
//#endregion
export { formatPaiseToINR as n, toPaise as r, evaluateReconciliation as t };
