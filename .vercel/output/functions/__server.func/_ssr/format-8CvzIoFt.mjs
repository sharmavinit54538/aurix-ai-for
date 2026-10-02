//#region node_modules/.nitro/vite/services/ssr/assets/format-8CvzIoFt.js
/**
* Central Formatting Utilities for Currency, Banking, and Sensitive Identifiers.
* Strictly adheres to Indian Rupee (INR) conventions and data masking standards.
*/
/**
* Formats a Rupee value into Indian currency format (e.g. ₹1,25,000.00).
*/
function formatINR(val) {
	if (val === null || val === void 0 || val === "") return "₹0.00";
	const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
	if (isNaN(num)) return "₹0.00";
	try {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(num);
	} catch {
		return `₹${num.toFixed(2)}`;
	}
}
/**
* Formats integer counts with Indian comma grouping (e.g. 1,420).
*/
function formatCount(val) {
	if (val === null || val === void 0 || val === "") return "0";
	const num = typeof val === "number" ? val : parseInt(String(val), 10);
	if (isNaN(num)) return "0";
	return new Intl.NumberFormat("en-IN").format(num);
}
/**
* Formats a Date/ISO string to localized readable Indian format (e.g. "24 Sep 2026").
*/
function formatDate(val, options) {
	if (!val) return "—";
	try {
		const d = typeof val === "string" ? new Date(val) : val;
		if (isNaN(d.getTime())) return "—";
		const defaultOptions = {
			day: "2-digit",
			month: "short",
			year: "numeric",
			...options
		};
		return new Intl.DateTimeFormat("en-IN", defaultOptions).format(d);
	} catch {
		return String(val);
	}
}
/**
* Formats a Date/ISO string with time (e.g. "24 Sep 2026, 05:30 PM").
*/
function formatDateTime(val) {
	return formatDate(val, {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
}
/**
* Masks bank account number, displaying only the last 4 digits (e.g. ••••••••1234).
*/
function maskAccountNumber(acc) {
	if (!acc) return "—";
	const str = String(acc).trim();
	if (str.length <= 4) return str;
	return `••••••••${str.slice(-4)}`;
}
//#endregion
export { maskAccountNumber as a, formatINR as i, formatDate as n, formatDateTime as r, formatCount as t };
