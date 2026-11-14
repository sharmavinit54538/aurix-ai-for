import { createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/api/apiInstance";
import type { BackendHierarchyNode } from "./employeeHierarchyTypes";
import type { OrganizationalGraphData } from "./organizationalGraphTypes";

export const fetchEmployeeHierarchy = createAsyncThunk<
  BackendHierarchyNode[],
  void
>("employeeHierarchy/fetchHierarchy", async () => {
  const res = await apiInstance.get("/employees/hierarchy");
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
      `/employees/${encodeURIComponent(employeeId)}/reporting`,
    );
    const d = res.data?.data ?? res.data ?? {};
    return {
      employeeId,
      directReports: Array.isArray(d.directReports) ? d.directReports : [],
      peers: Array.isArray(d.peers) ? d.peers : [],
      manager: d.manager ?? null,
    };
  },
);

export const fetchOrganizationalGraph = createAsyncThunk<
  OrganizationalGraphData,
  void
>("employeeHierarchy/fetchOrgGraph", async () => {
  const res = await apiInstance.get("/employees/org-graph");
  const d = res.data?.data ?? res.data ?? {};
  return {
    nodes: Array.isArray(d.nodes) ? d.nodes : [],
    edges: Array.isArray(d.edges) ? d.edges : [],
    metrics: d.metrics ?? {
      spanOfControlAvg: 0,
      maxDepth: 0,
      unassignedCount: 0,
      healthScore: 0,
    },
  };
});
