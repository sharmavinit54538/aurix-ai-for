import apiInstance from "@/api/apiInstance";
import type { BackendHierarchyNode, ReportingChainDetails } from "@/store/employeeHierarchy/employeeHierarchyTypes";

/**
 * Fetch complete organizational hierarchy tree from backend FastAPI endpoint.
 * GET /api/v1/hierarchy
 */
export async function fetchEmployeeHierarchyApi(): Promise<BackendHierarchyNode[]> {
  const res = await apiInstance.get("/hierarchy");
  if (res.data && res.data.success && Array.isArray(res.data.data)) {
    return res.data.data;
  }
  if (Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

/**
 * Lazy-load detailed reporting chain surroundings for an employee.
 * GET /api/v1/hierarchy/{employee_id}
 */
export async function fetchEmployeeReportingDetailsApi(employeeId: string): Promise<ReportingChainDetails> {
  const res = await apiInstance.get(`/hierarchy/${employeeId}`);
  if (res.data && res.data.success && res.data.data) {
    return res.data.data;
  }
  return res.data;
}
