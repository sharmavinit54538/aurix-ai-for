import { createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/api/apiInstance";
import { organizationalGraphApi } from "@/services/organizationalGraphApi";
import type { BackendHierarchyNode } from "./employeeHierarchyTypes";
import type { OrganizationalGraphData } from "./organizationalGraphTypes";

export const fetchEmployeeHierarchy = createAsyncThunk<
  BackendHierarchyNode[],
  void
>("employeeHierarchy/fetchHierarchy", async () => {
  const res = await apiInstance.get("/hierarchy");
  const d = res.data?.data ?? res.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.roots)) return d.roots;
  if (Array.isArray(d?.items)) return d.items;
  return [];
});

export const fetchEmployeeReportingDetails = createAsyncThunk<any, string>(
  "employeeHierarchy/fetchReportingDetails",
  async (employeeId) => {
    const res = await apiInstance.get(
      `/hierarchy/${encodeURIComponent(employeeId)}`,
    );
    const d = res.data?.data ?? res.data ?? {};
    return {
      employeeId,
      directReports: Array.isArray(d.directReports ?? d.direct_reports)
        ? (d.directReports ?? d.direct_reports)
        : [],
      peers: Array.isArray(d.peers) ? d.peers : [],
      manager: d.manager ?? null,
    };
  },
);

export const fetchOrganizationalGraph = createAsyncThunk<
  OrganizationalGraphData,
  void
>("employeeHierarchy/fetchOrgGraph", async () => {
  return organizationalGraphApi.fetchOrganizationalGraph();
});
