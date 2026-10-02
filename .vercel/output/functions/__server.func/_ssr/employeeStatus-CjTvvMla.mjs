//#region node_modules/.nitro/vite/services/ssr/assets/employeeStatus-CjTvvMla.js
function getEmployeeStatusDetails(emp) {
	const status = emp.status?.toUpperCase() || "INVITED";
	if ((status === "INVITED" || status === "CREATED") && emp.activationTokenExpiresAt) {
		const expires = new Date(emp.activationTokenExpiresAt);
		if (/* @__PURE__ */ new Date() > expires) return {
			text: "EXPIRED",
			variant: "destructive",
			isExpired: true
		};
	}
	switch (status) {
		case "ACTIVE": return {
			text: "ACTIVE",
			variant: "default",
			isExpired: false
		};
		case "PENDING": return {
			text: "PENDING",
			variant: "secondary",
			isExpired: false
		};
		case "DISABLED":
		case "INACTIVE": return {
			text: "DISABLED",
			variant: "destructive",
			isExpired: false
		};
		default: return {
			text: "INVITED",
			variant: "secondary",
			isExpired: false
		};
	}
}
function exportEmployeesCsv(employees) {
	const headers = [
		"Employee ID",
		"Full Name",
		"Email",
		"Phone",
		"Department",
		"Designation",
		"Joining Date",
		"Shift"
	];
	const rows = employees.map((e) => [
		e.employeeId,
		e.fullName,
		e.email,
		e.phone,
		e.department,
		e.designation,
		e.joiningDate,
		e.shift
	].map((v) => `"${(v ?? "").toString().replace(/"/g, "\"\"")}"`).join(","));
	const csv = [headers.join(","), ...rows].join("\n");
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = "employees.csv";
	a.click();
	URL.revokeObjectURL(url);
}
function createEmptyEmployee() {
	return {
		id: "",
		employeeId: "",
		fullName: "",
		email: "",
		phone: "",
		department: "",
		designation: "",
		joiningDate: "",
		managerName: "",
		shift: "General"
	};
}
//#endregion
export { exportEmployeesCsv as n, getEmployeeStatusDetails as r, createEmptyEmployee as t };
