import type { ExecutiveDashboardData, ExecutiveRole } from "../types/executiveTypes";

const createEmptyRoleData = (
  role: ExecutiveRole,
  title: string,
  subtitle: string,
  tableTitle: string,
  tableDesc: string,
): ExecutiveDashboardData => ({
  role,
  title,
  subtitle,
  healthScore: 0,
  kpis: [],
  charts: [],
  tableData: {
    title: tableTitle,
    description: tableDesc,
    headers: [
      { key: "name", label: "Initiative / Project" },
      { key: "category", label: "Business Unit" },
      { key: "owner", label: "Executive Sponsor" },
      { key: "value", label: "Impact / Budget" },
      { key: "status", label: "Status" },
      { key: "progress", label: "Completion" },
    ],
    rows: [],
  },
  aiInsights: [],
  okrs: [],
});

export const EXECUTIVE_DATASETS: Record<ExecutiveRole, ExecutiveDashboardData> = {
  ceo: createEmptyRoleData(
    "ceo",
    "Chief Executive Officer Command Center",
    "Enterprise Business Performance, ARR Growth, OKR Tracking & Strategic Health",
    "Strategic Corporate Projects & Initiatives",
    "High-priority enterprise initiatives monitored by executive committee",
  ),
  cto: createEmptyRoleData(
    "cto",
    "Chief Technology Officer Command Center",
    "System Health, Engineering Velocity, Infrastructure Cost, CI/CD & AI Architecture",
    "Engineering Milestones & Critical Infrastructure Deliverables",
    "Strategic engineering initiatives and core platform roadmap deliverables",
  ),
  cfo: createEmptyRoleData(
    "cfo",
    "Chief Financial Officer Command Center",
    "Corporate Financials, Runway, Cash Flow, OPEX & Department Budget Allocations",
    "Capital Expenditures & Department Budget Allocations",
    "Enterprise financial outlays, capital expenditures and department burn monitoring",
  ),
  cio: createEmptyRoleData(
    "cio",
    "Chief Information Officer Command Center",
    "Enterprise IT Operations, Global Infrastructure, Cybersecurity & Compliance",
    "IT Projects, System Migrations & Compliance Audits",
    "Enterprise technology deployments, security assessments and infrastructure lifecycle",
  ),
  coo: createEmptyRoleData(
    "coo",
    "Chief Operating Officer Command Center",
    "Workforce Productivity, Operational Bottlenecks, Facility SLA & Supply Chain",
    "Operational Efficiency & Process Optimization Initiatives",
    "Enterprise operations, SLA compliance and business continuity programs",
  ),
  cmo: createEmptyRoleData(
    "cmo",
    "Chief Marketing Officer Command Center",
    "Brand Presence, Customer Acquisition Cost, Pipeline Generation & Marketing ROI",
    "Strategic Marketing Campaigns & Brand Growth Initiatives",
    "Global customer acquisition campaigns, brand equity and go-to-market initiatives",
  ),
};
