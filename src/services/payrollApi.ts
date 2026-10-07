// This file is kept for backward compatibility.
// It re-exports everything from the new payroll folder structure.

export * from "./payroll";

import { payrollApi } from "./payroll";

export { payrollApi };
export default payrollApi;