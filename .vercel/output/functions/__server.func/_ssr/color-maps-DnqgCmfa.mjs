//#region node_modules/.nitro/vite/services/ssr/assets/color-maps-DnqgCmfa.js
/**
* Shared category color dot mappings for the application.
* Distinguishes categories ONLY by an 8px dot (h-2 w-2 rounded-full).
*/
var LEAVE_TYPE_DOT = {
	sick: "bg-amber-500",
	"sick leave": "bg-amber-500",
	casual: "bg-emerald-500",
	"casual leave": "bg-emerald-500",
	vacation: "bg-primary",
	"vacation leave": "bg-primary"
};
var getLeaveTypeDot = (type) => LEAVE_TYPE_DOT[(type ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";
var TONE_DOT = {
	crit: "bg-destructive",
	critical: "bg-destructive",
	high: "bg-destructive",
	warn: "bg-amber-500",
	warning: "bg-amber-500",
	medium: "bg-amber-500",
	ok: "bg-emerald-500",
	positive: "bg-emerald-500",
	success: "bg-emerald-500",
	low: "bg-muted-foreground",
	info: "bg-muted-foreground"
};
var getToneDot = (tone) => TONE_DOT[(tone ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";
var EVENT_TYPE_DOT = {
	meeting: "bg-primary",
	holiday: "bg-emerald-500",
	birthday: "bg-amber-500",
	interview: "bg-primary",
	payroll: "bg-emerald-500",
	event: "bg-muted-foreground"
};
var getEventTypeDot = (type) => EVENT_TYPE_DOT[(type ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";
var SHIFT_TYPE_DOT = {
	morning: "bg-primary",
	evening: "bg-amber-500",
	night: "bg-primary",
	"off day": "bg-muted-foreground",
	leave: "bg-destructive",
	holiday: "bg-emerald-500",
	training: "bg-primary",
	wfh: "bg-emerald-500",
	overtime: "bg-amber-500"
};
var getShiftTypeDot = (shift) => SHIFT_TYPE_DOT[(shift ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";
//#endregion
export { getToneDot as i, getLeaveTypeDot as n, getShiftTypeDot as r, getEventTypeDot as t };
