import { createAsyncThunk } from "@reduxjs/toolkit";
import type { BackendHierarchyNode } from "./employeeHierarchyTypes";
import type { OrganizationalGraphData } from "./organizationalGraphTypes";

export const fetchEmployeeHierarchy = createAsyncThunk<BackendHierarchyNode[], void>(
  "employeeHierarchy/fetchHierarchy",
  async () => {
    return [
      {
        id: "emp-1",
        name: "Sarah Jenkins",
        role: "Chief Executive Officer",
        department: "Executive",
        email: "sarah.jenkins@aurix.ai",
        avatar: "https://picsum.photos/seed/sarah/200/200",
        directReportsCount: 4,
        reports: [
          {
            id: "emp-2",
            name: "Alex Vance",
            role: "VP of Engineering",
            department: "Engineering",
            email: "alex.vance@aurix.ai",
            avatar: "https://picsum.photos/seed/alex/200/200",
            managerId: "emp-1",
            directReportsCount: 12,
          },
          {
            id: "emp-3",
            name: "Maya Lin",
            role: "Chief Product Officer",
            department: "Product",
            email: "maya.lin@aurix.ai",
            avatar: "https://picsum.photos/seed/maya/200/200",
            managerId: "emp-1",
            directReportsCount: 6,
          },
        ],
      },
    ];
  }
);

export const fetchEmployeeReportingDetails = createAsyncThunk<any, string>(
  "employeeHierarchy/fetchReportingDetails",
  async (employeeId) => {
    return {
      employeeId,
      directReports: [],
      peers: [],
      manager: null,
    };
  }
);

export const fetchOrganizationalGraph = createAsyncThunk<OrganizationalGraphData, void>(
  "employeeHierarchy/fetchOrgGraph",
  async () => {
    return {
      nodes: [
        { id: "emp-1", label: "Sarah Jenkins", department: "Executive", role: "CEO" },
        { id: "emp-2", label: "Alex Vance", department: "Engineering", role: "VP Eng" },
        { id: "emp-3", label: "Maya Lin", department: "Product", role: "CPO" },
      ],
      edges: [
        { id: "e1-2", source: "emp-1", target: "emp-2", label: "Manages" },
        { id: "e1-3", source: "emp-1", target: "emp-3", label: "Manages" },
      ],
      metrics: {
        spanOfControlAvg: 4.2,
        maxDepth: 4,
        unassignedCount: 0,
        healthScore: 96,
      },
    };
  }
);
