import type { ExecutiveDashboardData, ExecutiveRole } from "../types/executiveTypes";

export const EXECUTIVE_DATASETS: Record<ExecutiveRole, ExecutiveDashboardData> = {
  // ==========================================
  // 1. CEO DASHBOARD DATA
  // ==========================================
  ceo: {
    role: "ceo",
    title: "Chief Executive Officer Command Center",
    subtitle: "Enterprise Business Performance, ARR Growth, OKR Tracking & Strategic Health",
    healthScore: 94,
    kpis: [
      { id: "rev", title: "Annual Recurring Revenue", value: "₹ 48.2 Cr", change: "+18.4%", isPositive: true, subtext: "vs ₹ 40.7 Cr last fiscal", iconName: "TrendingUp", color: "text-emerald-400" },
      { id: "net_profit", title: "Net Profit Margin", value: "24.8%", change: "+3.2%", isPositive: true, subtext: "Q3 EBDITA target met", iconName: "DollarSign", color: "text-blue-400" },
      { id: "headcount", title: "Global Headcount", value: "348 Staff", change: "+24 new", isPositive: true, subtext: "96.4% retention rate", iconName: "Users", color: "text-purple-400" },
      { id: "attrition", title: "Annual Attrition Rate", value: "4.2%", change: "-1.8%", isPositive: true, subtext: "Industry benchmark: 9.5%", iconName: "UserCheck", color: "text-sky-400" },
      { id: "payroll", title: "Monthly Payroll Cost", value: "₹ 3.84 Cr", change: "+4.1%", isPositive: false, subtext: "84.2% budget allocation", iconName: "CreditCard", color: "text-amber-400" },
      { id: "okr", title: "Company OKR Progress", value: "87.5%", change: "+12%", isPositive: true, subtext: "14 of 16 key results hit", iconName: "Target", color: "text-indigo-400" },
    ],
    charts: [
      {
        title: "Revenue & Net Profit Trend (FY 2025-26)",
        description: "Monthly financial performance in Crores (₹)",
        type: "area",
        data: [
          { name: "Apr", revenue: 3.4, profit: 0.8 },
          { name: "May", revenue: 3.6, profit: 0.9 },
          { name: "Jun", revenue: 3.9, profit: 1.0 },
          { name: "Jul", revenue: 4.1, profit: 1.1 },
          { name: "Aug", revenue: 4.0, profit: 1.0 },
          { name: "Sep", revenue: 4.3, profit: 1.2 },
          { name: "Oct", revenue: 4.5, profit: 1.3 },
          { name: "Nov", revenue: 4.8, profit: 1.4 },
        ],
        dataKeys: [
          { key: "revenue", color: "#10b981", label: "Gross Revenue (₹ Cr)" },
          { key: "profit", color: "#3b82f6", label: "Net Profit (₹ Cr)" },
        ],
      },
      {
        title: "Headcount & Hiring Velocity",
        description: "Active workforce expansion vs monthly recruitment target",
        type: "bar",
        data: [
          { name: "Engineering", current: 142, target: 160 },
          { name: "Sales & Mktg", current: 78, target: 85 },
          { name: "Product & Design", current: 44, target: 48 },
          { name: "Operations", current: 52, target: 55 },
          { name: "HR & Admin", current: 32, target: 35 },
        ],
        dataKeys: [
          { key: "current", color: "#8b5cf6", label: "Active Staff" },
          { key: "target", color: "#ec4899", label: "Target Capacity" },
        ],
      },
    ],
    tableData: {
      title: "Strategic Corporate Projects & Strategic Initiatives",
      description: "High-priority enterprise initiatives monitored by executive committee",
      headers: [
        { key: "name", label: "Project Initiative" },
        { key: "category", label: "Business Unit" },
        { key: "owner", label: "Executive Sponsor" },
        { key: "value", label: "Budget / Impact" },
        { key: "status", label: "Status" },
        { key: "progress", label: "Completion" },
      ],
      rows: [
        { id: "p1", name: "AI Agentic Workflow Engine 2.0", category: "Engineering", owner: "CTO / Alex Chen", value: "₹ 2.4 Cr", status: "On Track", progress: 85 },
        { id: "p2", name: "EMEA Regional Expansion", category: "Global Sales", owner: "CEO / Sarah Jenkins", value: "₹ 5.0 Cr", status: "Completed", progress: 100 },
        { id: "p3", name: "SOC-2 Type II Security Certification", category: "IT & InfoSec", owner: "CIO / Marcus Vance", value: "₹ 80 Lakhs", status: "In Progress", progress: 68 },
        { id: "p4", name: "Q4 Enterprise Marketing Campaign", category: "Marketing", owner: "CMO / Priya Sharma", value: "₹ 1.2 Cr", status: "On Track", progress: 75 },
        { id: "p5", name: "Automated Payroll Engine V3", category: "Finance Ops", owner: "CFO / David Miller", value: "₹ 1.5 Cr", status: "Review", progress: 92 },
      ],
    },
    aiInsights: [
      { id: "ai1", title: "Revenue Velocity Acceleration", description: "ARR has grown 18.4% YoY. Enterprise contracts in EMEA are driving 42% of total new logo ARR.", severity: "success", category: "Strategic Growth", timestamp: "10 mins ago" },
      { id: "ai2", title: "Engineering Talent Attrition Warning", description: "Senior Frontend Engineering retention dropped slightly in Q3. Recommendation: Review equity vesting schedules.", severity: "medium", category: "Workforce Risk", timestamp: "1 hour ago" },
      { id: "ai3", title: "Q4 EBDITA Forecast Optimization", description: "Reallocating ₹ 40L from travel expenses to AI R&D will increase net margin forecast by +1.4%.", severity: "high", category: "Financial Insight", timestamp: "3 hours ago" },
    ],
    okrs: [
      { title: "Achieve ₹ 50 Cr ARR Benchmark", target: "₹ 50.0 Cr", current: 96, owner: "CEO / Sales" },
      { title: "Maintain Global Employee eNPS > 75", target: "78 Score", current: 92, owner: "Chief People Officer" },
      { title: "Launch AI Copilot Autonomous Suite", target: "100% Rollout", current: 88, owner: "CTO / Product" },
    ],
  },

  // ==========================================
  // 2. CTO DASHBOARD DATA
  // ==========================================
  cto: {
    role: "cto",
    title: "Chief Technology Officer Command Center",
    subtitle: "System Health, Engineering Velocity, Infrastructure Cost, CI/CD & AI Architecture",
    healthScore: 98,
    kpis: [
      { id: "uptime", title: "System Uptime SLA", value: "99.98%", change: "+0.02%", isPositive: true, subtext: "Zero critical downtime in 90d", iconName: "ShieldCheck", color: "text-emerald-400" },
      { id: "latency", title: "P99 API Response Time", value: "142 ms", change: "-18 ms", isPositive: true, subtext: "Target < 200ms across routes", iconName: "Zap", color: "text-blue-400" },
      { id: "devs", title: "Active Engineering Staff", value: "142 Devs", change: "+8 this month", isPositive: true, subtext: "28 Sprints completed", iconName: "Code", color: "text-purple-400" },
      { id: "deploy", title: "CI/CD Deploy Count", value: "482 Deploys", change: "+14%", isPositive: true, subtext: "99.2% build success rate", iconName: "GitPullRequest", color: "text-sky-400" },
      { id: "infra", title: "Cloud Infra Spend", value: "₹ 42.5 L / mo", change: "-5.4%", isPositive: true, subtext: "AWS & GCP cluster optimized", iconName: "Server", color: "text-emerald-400" },
      { id: "tech_debt", title: "Code Health Index", value: "92 / 100", change: "+4 pts", isPositive: true, subtext: "SonarQube Grade A+", iconName: "Cpu", color: "text-indigo-400" },
    ],
    charts: [
      {
        title: "API Performance & Latency Distribution",
        description: "Average latency (ms) vs Request Volume (k/min)",
        type: "area",
        data: [
          { name: "00:00", latency: 110, requests: 14 },
          { name: "04:00", latency: 105, requests: 8 },
          { name: "08:00", latency: 155, requests: 45 },
          { name: "12:00", latency: 180, requests: 62 },
          { name: "16:00", latency: 165, requests: 58 },
          { name: "20:00", latency: 125, requests: 28 },
        ],
        dataKeys: [
          { key: "latency", color: "#3b82f6", label: "P99 Latency (ms)" },
          { key: "requests", color: "#8b5cf6", label: "Requests (k/min)" },
        ],
      },
      {
        title: "Sprint Velocity & Bug Burndown",
        description: "Completed story points vs resolved bug tickets",
        type: "line",
        data: [
          { name: "Sprint 21", velocity: 145, bugsFixed: 32 },
          { name: "Sprint 22", velocity: 152, bugsFixed: 28 },
          { name: "Sprint 23", velocity: 168, bugsFixed: 40 },
          { name: "Sprint 24", velocity: 174, bugsFixed: 22 },
          { name: "Sprint 25", velocity: 185, bugsFixed: 18 },
        ],
        dataKeys: [
          { key: "velocity", color: "#10b981", label: "Story Points" },
          { key: "bugsFixed", color: "#f59e0b", label: "Resolved Bugs" },
        ],
      },
    ],
    tableData: {
      title: "Active Engineering Services & Microservice Status",
      description: "Health, latency, and error rate of production clusters",
      headers: [
        { key: "name", label: "Service Name" },
        { key: "category", label: "Cluster Host" },
        { key: "owner", label: "Tech Lead" },
        { key: "value", label: "P99 Latency" },
        { key: "status", label: "Status" },
        { key: "progress", label: "Uptime SLA" },
      ],
      rows: [
        { id: "s1", name: "Payroll Computation Engine", category: "EKS Prod-1", owner: "Vikram Mehta", value: "98 ms", status: "Healthy", progress: 100 },
        { id: "s2", name: "AI Resume Parser & OCR", category: "GCP AI Nodes", owner: "Neha Gupta", value: "320 ms", status: "Healthy", progress: 99 },
        { id: "s3", name: "Auth & Identity Provider", category: "AWS Global", owner: "Rohan Patel", value: "45 ms", status: "Healthy", progress: 100 },
        { id: "s4", name: "Attendance Realtime Websocket", category: "Redis Cluster", owner: "Ankit Sharma", value: "18 ms", status: "Degraded", progress: 98 },
        { id: "s5", name: "Document Intelligence API", category: "Lambda Serverless", owner: "Siddharth V", value: "140 ms", status: "Healthy", progress: 99 },
      ],
    },
    aiInsights: [
      { id: "cto1", title: "PostgreSQL Database Connection Pool Warning", description: "Connection pool utilization reached 84% during peak hours (14:00 UTC). Auto-scaling pool size recommended.", severity: "medium", category: "Database Health", timestamp: "5 mins ago" },
      { id: "cto2", title: "AWS Cost Optimization Detected", description: "Migrating inactive staging clusters to Graviton3 instances will cut monthly cloud bill by ₹ 6.2 Lakhs.", severity: "success", category: "Cloud Cost", timestamp: "2 hours ago" },
      { id: "cto3", title: "High Microservice Test Coverage", description: "Unit and integration test coverage across all microservices hit 94.2%, reducing regression risk.", severity: "low", category: "Code Quality", timestamp: "4 hours ago" },
    ],
  },

  // ==========================================
  // 3. CFO DASHBOARD DATA
  // ==========================================
  cfo: {
    role: "cfo",
    title: "Chief Financial Officer Command Center",
    subtitle: "Cash Flow, Financial Runway, Budget Utilization, Tax Compliance & Profitability Analytics",
    healthScore: 96,
    kpis: [
      { id: "cash", title: "Total Cash Reserves", value: "₹ 62.4 Cr", change: "+14.2%", isPositive: true, subtext: "18.4 months operational runway", iconName: "Wallet", color: "text-emerald-400" },
      { id: "runway", title: "Operating Expenses", value: "₹ 3.12 Cr / mo", change: "-2.1%", isPositive: true, subtext: "Within Q3 budgeted limits", iconName: "TrendingDown", color: "text-blue-400" },
      { id: "gross_margin", title: "Gross Profit Margin", value: "76.4%", change: "+2.8%", isPositive: true, subtext: "SaaS Industry Standard > 70%", iconName: "Percent", color: "text-purple-400" },
      { id: "payroll_pct", title: "Payroll % of Budget", value: "54.2%", change: "Optimized", isPositive: true, subtext: "Total monthly payout: ₹ 3.84 Cr", iconName: "CreditCard", color: "text-sky-400" },
      { id: "ar", title: "Accounts Receivable", value: "₹ 4.8 Cr", change: "-8.4%", isPositive: true, subtext: "DSO reduced to 28 days", iconName: "FileCheck", color: "text-emerald-400" },
      { id: "tax_comp", title: "Tax Compliance Audit", value: "100% Filed", change: "On Time", isPositive: true, subtext: "TDS, GST & PF compliance clear", iconName: "BadgeCheck", color: "text-indigo-400" },
    ],
    charts: [
      {
        title: "Cash Inflow vs Expense Breakdown",
        description: "Monthly collections vs operational disbursements (₹ Cr)",
        type: "area",
        data: [
          { name: "Apr", inflow: 4.2, outflow: 3.0 },
          { name: "May", inflow: 4.5, outflow: 3.1 },
          { name: "Jun", inflow: 4.8, outflow: 3.2 },
          { name: "Jul", inflow: 5.1, outflow: 3.1 },
          { name: "Aug", inflow: 5.0, outflow: 3.3 },
          { name: "Sep", inflow: 5.4, outflow: 3.2 },
        ],
        dataKeys: [
          { key: "inflow", color: "#10b981", label: "Cash Inflow (₹ Cr)" },
          { key: "outflow", color: "#ef4444", label: "Operating Outflow (₹ Cr)" },
        ],
      },
      {
        title: "Department Budget Utilization",
        description: "Allocated annual budget vs spent YTD (₹ Cr)",
        type: "bar",
        data: [
          { name: "Engineering", allocated: 18.0, spent: 12.4 },
          { name: "Sales & Mktg", allocated: 12.5, spent: 9.1 },
          { name: "Operations", allocated: 6.0, spent: 4.2 },
          { name: "G&A", allocated: 4.5, spent: 3.0 },
          { name: "R&D", allocated: 5.0, spent: 3.8 },
        ],
        dataKeys: [
          { key: "allocated", color: "#6366f1", label: "Budget Allocated" },
          { key: "spent", color: "#38bdf8", label: "YTD Spent" },
        ],
      },
    ],
    tableData: {
      title: "Vendor Payment Approvals & Invoice Audits",
      description: "High-value enterprise vendor invoices pending signoff",
      headers: [
        { key: "name", label: "Vendor Entity" },
        { key: "category", label: "Expense Category" },
        { key: "owner", label: "Approving Officer" },
        { key: "value", label: "Invoice Amount" },
        { key: "status", label: "Payment Status" },
        { key: "date", label: "Due Date" },
      ],
      rows: [
        { id: "v1", name: "Amazon Web Services EMEA", category: "Cloud Infrastructure", owner: "CTO / Alex", value: "₹ 38,40,000", status: "Approved", date: "2026-08-05" },
        { id: "v2", name: "Salesforce Global Inc", category: "CRM Subscriptions", owner: "CMO / Priya", value: "₹ 18,20,000", status: "Pending", date: "2026-08-10" },
        { id: "v3", name: "Deloitte Statutory Audit", category: "Professional Services", owner: "CFO / David", value: "₹ 25,00,000", status: "Approved", date: "2026-08-15" },
        { id: "v4", name: "Google Workspace & GCP", category: "SaaS Tools", owner: "CIO / Marcus", value: "₹ 14,50,000", status: "Approved", date: "2026-08-01" },
        { id: "v5", name: "WeWork Global Office Lease", category: "Real Estate", owner: "COO / Michael", value: "₹ 42,00,000", status: "Processing", date: "2026-08-02" },
      ],
    },
    aiInsights: [
      { id: "cfo1", title: "TDS Reconciliation Complete", description: "Quarterly TDS deductions of ₹ 42.8 Lakhs successfully matched against Form 26AS with zero variance.", severity: "success", category: "Tax Audit", timestamp: "15 mins ago" },
      { id: "cfo2", title: "Vendor Payment Early Bird Discount Alert", description: "Paying AWS invoice 7 days early yields a 2% prompt settlement discount (Saving ₹ 76,800).", severity: "high", category: "Cash Savings", timestamp: "1 hour ago" },
      { id: "cfo3", title: "Foreign Exchange Risk Hedge Recommendation", description: "USD currency fluctuations may impact European cloud bills by 3%. Hedging USD contract is advised.", severity: "medium", category: "Risk Mitigation", timestamp: "5 hours ago" },
    ],
  },

  // ==========================================
  // 4. CIO DASHBOARD DATA
  // ==========================================
  cio: {
    role: "cio",
    title: "Chief Information Officer Command Center",
    subtitle: "IT Asset Governance, Cyber Security Incidents, Cloud Licenses & Helpdesk Analytics",
    healthScore: 97,
    kpis: [
      { id: "assets", title: "Managed IT Assets", value: "1,248 Devices", change: "+42 assigned", isPositive: true, subtext: "100% MDM Compliant", iconName: "Laptop", color: "text-blue-400" },
      { id: "security_inc", title: "Security Incidents", value: "0 Critical", change: "Clean SLA", isPositive: true, subtext: "Zero data breaches in 365d", iconName: "ShieldAlert", color: "text-emerald-400" },
      { id: "tickets", title: "Open IT Helpdesk Tickets", value: "14 Tickets", change: "-28% reduction", isPositive: true, subtext: "Avg resolution: 1.8 hrs", iconName: "TicketCheck", color: "text-indigo-400" },
      { id: "saas_lic", title: "SaaS License Usage", value: "91.8%", change: "+3.4%", isPositive: true, subtext: "Zero dormant software seats", iconName: "PackageCheck", color: "text-purple-400" },
      { id: "backup", title: "Data Backup Verification", value: "100% Success", change: "Daily Sync", isPositive: true, subtext: "RTO < 15 mins, RPO < 5 mins", iconName: "Database", color: "text-sky-400" },
      { id: "soc2", title: "ISO 27001 Compliance", value: "Compliant", change: "Audited", isPositive: true, subtext: "Security policies active", iconName: "BadgeCheck", color: "text-emerald-400" },
    ],
    charts: [
      {
        title: "IT Helpdesk Ticket Resolution & SLA Metrics",
        description: "New tickets created vs resolved within SLA per week",
        type: "bar",
        data: [
          { name: "Week 1", created: 85, resolved: 82 },
          { name: "Week 2", created: 92, resolved: 90 },
          { name: "Week 3", created: 78, resolved: 78 },
          { name: "Week 4", created: 64, resolved: 64 },
        ],
        dataKeys: [
          { key: "created", color: "#f59e0b", label: "Tickets Received" },
          { key: "resolved", color: "#10b981", label: "Resolved in SLA" },
        ],
      },
      {
        title: "Asset Allocation across Workspaces",
        description: "Laptops, Workstations, Monitors & Peripherals",
        type: "pie",
        data: [
          { name: "MacBook Pro M3", value: 450 },
          { name: "Dell XPS Laptops", value: 320 },
          { name: "Monitors 4K", value: 280 },
          { name: "Mobile Test Devices", value: 198 },
        ],
        dataKeys: [
          { key: "value", color: "#6366f1", label: "Devices" },
        ],
      },
    ],
    tableData: {
      title: "IT Asset Inventory & MDM Enrollment Audit",
      description: "Live status of hardware equipment assigned to employees",
      headers: [
        { key: "name", label: "Asset Tag" },
        { key: "category", label: "Device Model" },
        { key: "owner", label: "Assigned User" },
        { key: "value", label: "Serial Number" },
        { key: "status", label: "MDM Status" },
        { key: "date", label: "Enrollment Date" },
      ],
      rows: [
        { id: "a1", name: "AST-2026-0891", category: "Apple MacBook Pro 16", owner: "Rohan Patel", value: "C02G9012MD6R", status: "Protected", date: "2026-01-12" },
        { id: "a2", name: "AST-2026-0422", category: "Dell Precision 5570", owner: "Kavita Shah", value: "DL78219001", status: "Protected", date: "2026-02-04" },
        { id: "a3", name: "AST-2026-0114", category: "Lenovo ThinkPad X1", owner: "Arjun Verma", value: "LN90123984", status: "Protected", date: "2026-03-18" },
        { id: "a4", name: "AST-2026-0902", category: "MacBook Air M2", owner: "Pooja Hegde", value: "C02H102981XX", status: "Protected", date: "2026-04-09" },
        { id: "a5", name: "AST-2026-0771", category: "Apple iPad Pro 12.9", owner: "Design Studio", value: "IPD89102938", status: "Protected", date: "2026-05-22" },
      ],
    },
    aiInsights: [
      { id: "cio1", title: "Unused Zoom & Figma Licenses Detected", description: "18 Figma seats have been dormant for > 60 days. Reclaiming seats will save ₹ 2.4 Lakhs annually.", severity: "success", category: "License Audit", timestamp: "20 mins ago" },
      { id: "cio2", title: "Automated Backup Health Pass", description: "All database instances, S3 buckets, and customer logs passed automated disaster recovery drill.", severity: "low", category: "Backup Integrity", timestamp: "2 hours ago" },
      { id: "cio3", title: "MDM Security Compliance Warning", description: "3 contractor laptops require OS patch update to v14.5. Automated push notification sent.", severity: "medium", category: "Endpoint Security", timestamp: "4 hours ago" },
    ],
  },

  // ==========================================
  // 5. COO DASHBOARD DATA
  // ==========================================
  coo: {
    role: "coo",
    title: "Chief Operating Officer Command Center",
    subtitle: "Operational Efficiency, Workforce Productivity, SLA Performance & Cross-Department Workflow",
    healthScore: 93,
    kpis: [
      { id: "eff", title: "Operational Efficiency", value: "94.6%", change: "+2.4%", isPositive: true, subtext: "Target 92% exceeded", iconName: "Workflow", color: "text-emerald-400" },
      { id: "prod", title: "Workforce Productivity", value: "98.2%", change: "+1.2%", isPositive: true, subtext: "Based on task completion", iconName: "TrendingUp", color: "text-blue-400" },
      { id: "sla", title: "SLA Adherence Rate", value: "99.1%", change: "On Target", isPositive: true, subtext: "Cross-functional SLAs met", iconName: "Clock", color: "text-purple-400" },
      { id: "attend", title: "Daily Attendance Rate", value: "96.8%", change: "+0.4%", isPositive: true, subtext: "338 of 348 present today", iconName: "UserCheck", color: "text-sky-400" },
      { id: "leave_bal", title: "Active Leave Utilization", value: "3.2%", change: "Normal", isPositive: true, subtext: "10 staff on approved leave", iconName: "Palmtree", color: "text-amber-400" },
      { id: "risks", title: "Operational Bottlenecks", value: "0 Critical", change: "-2 resolved", isPositive: true, subtext: "Processes running smoothly", iconName: "ShieldCheck", color: "text-indigo-400" },
    ],
    charts: [
      {
        title: "Productivity Index & SLA Performance Trend",
        description: "Weekly task completion rate vs client SLA adherence",
        type: "area",
        data: [
          { name: "Week 1", productivity: 94, sla: 98 },
          { name: "Week 2", productivity: 96, sla: 99 },
          { name: "Week 3", productivity: 97, sla: 99 },
          { name: "Week 4", productivity: 98, sla: 99 },
        ],
        dataKeys: [
          { key: "productivity", color: "#10b981", label: "Productivity Index (%)" },
          { key: "sla", color: "#6366f1", label: "SLA Adherence (%)" },
        ],
      },
      {
        title: "Department Resource Utilization",
        description: "Capacity vs active workload per department",
        type: "bar",
        data: [
          { name: "Customer Support", capacity: 100, workload: 92 },
          { name: "Implementation", capacity: 100, workload: 88 },
          { name: "HR Operations", capacity: 100, workload: 85 },
          { name: "Quality Assurance", capacity: 100, workload: 94 },
        ],
        dataKeys: [
          { key: "workload", color: "#38bdf8", label: "Active Workload (%)" },
        ],
      },
    ],
    tableData: {
      title: "Cross-Department Operational Processes & SLA Status",
      description: "Live monitoring of key organizational business workflows",
      headers: [
        { key: "name", label: "Workflow Process" },
        { key: "category", label: "Responsible Unit" },
        { key: "owner", label: "Process Lead" },
        { key: "value", label: "Avg Cycle Time" },
        { key: "status", label: "SLA Status" },
        { key: "progress", label: "Efficiency Score" },
      ],
      rows: [
        { id: "op1", name: "Employee Onboarding Provisioning", category: "HR Ops & IT", owner: "Meera Nair", value: "4.2 Hours", status: "Optimal", progress: 98 },
        { id: "op2", name: "Customer Contract Execution", category: "Legal & Sales", owner: "Sanjay Joshi", value: "1.8 Days", status: "Optimal", progress: 95 },
        { id: "op3", name: "Monthly Payroll Settlement", category: "Payroll Team", owner: "Karan Mehta", value: "6.0 Hours", status: "Optimal", progress: 99 },
        { id: "op4", name: "Expense Claim Audit & Payout", category: "Finance Ops", owner: "Anita Roy", value: "2.1 Days", status: "Optimal", progress: 92 },
        { id: "op5", name: "Asset Return & Offboarding", category: "IT Ops", owner: "Rajesh Kumar", value: "1.0 Day", status: "Optimal", progress: 96 },
      ],
    },
    aiInsights: [
      { id: "coo1", title: "Onboarding Cycle Time Reduced by 40%", description: "Automated digital signatures & IT asset pre-provisioning cut new hire setup time from 2 days to 4.2 hours.", severity: "success", category: "Process Optimization", timestamp: "30 mins ago" },
      { id: "coo2", title: "Implementation Team Capacity Warning", description: "Customer Implementation team workload is at 94%. Hiring 2 additional Specialists recommended for Q4.", severity: "medium", category: "Resource Capacity", timestamp: "1 hour ago" },
      { id: "coo3", title: "Zero SLA Breach Milestone", description: "All customer support tickets met SLA response time requirements for 60 consecutive days.", severity: "low", category: "SLA Performance", timestamp: "6 hours ago" },
    ],
  },

  // ==========================================
  // 6. CMO DASHBOARD DATA
  // ==========================================
  cmo: {
    role: "cmo",
    title: "Chief Marketing Officer Command Center",
    subtitle: "Lead Generation, Customer Acquisition Cost (CAC), Marketing ROI & Brand Traffic Analytics",
    healthScore: 95,
    kpis: [
      { id: "mql", title: "Monthly Qualified Leads", value: "1,420 MQLs", change: "+28.4%", isPositive: true, subtext: "Target: 1,200 leads", iconName: "Target", color: "text-emerald-400" },
      { id: "cac", title: "Customer Acquisition Cost", value: "₹ 14,200", change: "-12.5%", isPositive: true, subtext: "Reduced via organic SEO", iconName: "DollarSign", color: "text-blue-400" },
      { id: "roi", title: "Marketing Campaign ROI", value: "4.8x ROI", change: "+0.6x", isPositive: true, subtext: "₹ 4.80 return per ₹ 1 spent", iconName: "TrendingUp", color: "text-purple-400" },
      { id: "traffic", title: "Website Monthly Visitors", value: "248k Hits", change: "+34.2%", isPositive: true, subtext: "Organic search driving 62%", iconName: "Globe", color: "text-sky-400" },
      { id: "conv", title: "Funnel Conversion Rate", value: "4.85%", change: "+0.8%", isPositive: true, subtext: "Visitor to demo request", iconName: "Filter", color: "text-indigo-400" },
      { id: "spend", title: "Monthly Mktg Budget", value: "₹ 45.0 Lakhs", change: "On Budget", isPositive: true, subtext: "Paid Ads, Content & Events", iconName: "CreditCard", color: "text-amber-400" },
    ],
    charts: [
      {
        title: "Lead Acquisition Funnel & Conversion",
        description: "Website Visitors -> MQLs -> SQLs -> Closed Deals",
        type: "bar",
        data: [
          { name: "Apr", mql: 1100, sql: 380, closed: 92 },
          { name: "May", mql: 1220, sql: 420, closed: 104 },
          { name: "Jun", mql: 1310, sql: 460, closed: 118 },
          { name: "Jul", mql: 1420, sql: 510, closed: 134 },
        ],
        dataKeys: [
          { key: "mql", color: "#38bdf8", label: "MQL Leads" },
          { key: "sql", color: "#8b5cf6", label: "SQL Opportunities" },
          { key: "closed", color: "#10b981", label: "Won Enterprise Deals" },
        ],
      },
      {
        title: "Traffic Acquisition Channels",
        description: "Percentage distribution of incoming lead sources",
        type: "pie",
        data: [
          { name: "Organic Search (SEO)", value: 62 },
          { name: "Google & LinkedIn Ads", value: 22 },
          { name: "Direct & Referral", value: 10 },
          { name: "Events & Webinars", value: 6 },
        ],
        dataKeys: [
          { key: "value", color: "#10b981", label: "Share (%)" },
        ],
      },
    ],
    tableData: {
      title: "Active Growth Campaigns & Marketing ROI Track",
      description: "Performance metrics across active digital marketing campaigns",
      headers: [
        { key: "name", label: "Campaign Name" },
        { key: "category", label: "Channel" },
        { key: "owner", label: "Campaign Manager" },
        { key: "value", label: "Spend / ROI" },
        { key: "status", label: "Status" },
        { key: "progress", label: "Leads Generated" },
      ],
      rows: [
        { id: "m1", name: "Q3 AI HRMS Thought Leadership", category: "LinkedIn Ads", owner: "Priya Sharma", value: "₹ 12L / 5.2x", status: "Active", progress: 420 },
        { id: "m2", name: "Organic SEO Content Hub", category: "Content Marketing", owner: "Varun Malhotra", value: "₹ 4L / 8.4x", status: "Active", progress: 680 },
        { id: "m3", name: "Enterprise HR Tech Summit 2026", category: "Events & Webinars", owner: "Simran Kaur", value: "₹ 15L / 3.8x", status: "Completed", progress: 240 },
        { id: "m4", name: "Google Search Brand Intent", category: "Google PPC", owner: "Karan Patel", value: "₹ 8L / 4.1x", status: "Active", progress: 310 },
        { id: "m5", name: "Product Hunt AI Launch", category: "PR & Community", owner: "Riya Kapoor", value: "₹ 2L / 12.0x", status: "Completed", progress: 590 },
      ],
    },
    aiInsights: [
      { id: "cmo1", title: "High Organic SEO Growth", description: "Organic traffic increased by +34.2%. High-intent keywords like 'AI HRMS Software India' ranked #1.", severity: "success", category: "SEO Insight", timestamp: "10 mins ago" },
      { id: "cmo2", title: "LinkedIn Ads CAC Reduction", description: "Refining target audience filters to VP HRs and CTOs reduced Cost Per Lead from ₹ 3,200 to ₹ 2,100.", severity: "success", category: "Paid Ads", timestamp: "1 hour ago" },
      { id: "cmo3", title: "Webinar Lead Conversion Peak", description: "The 'AI Payroll Automation' webinar achieved a record 42% demo conversion rate from attendees.", severity: "medium", category: "Webinar Growth", timestamp: "3 hours ago" },
    ],
  },
};
