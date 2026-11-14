import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AIInsightsDashboardData } from "./aiInsightsTypes";

export const fetchAIInsightsDashboard = createAsyncThunk<AIInsightsDashboardData, void>(
  "aiInsights/fetchDashboard",
  async () => {
    return {
      summary: {
        totalEmployees: 248,
        healthScore: 92,
        attritionRisk: "Low",
        overallMood: "Optimistic",
      },
      kpis: [
        { label: "AI Productivity Score", value: "94.2%", change: "+3.8%", trend: "up" },
        { label: "Flight Risk Index", value: "4.1%", change: "-1.2%", trend: "down" },
        { label: "Skill Coverage", value: "88%", change: "+5.0%", trend: "up" },
        { label: "Employee Sentiment", value: "4.6 / 5.0", change: "+0.3", trend: "up" },
      ],
      alerts: [
        { id: "1", title: "Engineering Workload Surge", description: "Backend team overtime exceeded 15% threshold.", severity: "high" },
        { id: "2", title: "Key Skill Bottleneck", description: "Python & AI ML skills under-staffed in Q3 projects.", severity: "medium" },
      ],
      attendance: [
        { month: "Jan", present: 95, absent: 5 },
        { month: "Feb", present: 96, absent: 4 },
        { month: "Mar", present: 94, absent: 6 },
      ],
      attrition: [
        { department: "Engineering", risk: "Low", score: 12 },
        { department: "Sales", risk: "Medium", score: 24 },
        { department: "Product", risk: "Low", score: 8 },
      ],
      burnout: [
        { team: "DevOps", riskLevel: "Moderate", hoursOvertime: 18 },
        { team: "Support", riskLevel: "High", hoursOvertime: 28 },
      ],
      candidates: [
        { id: "c1", name: "Sarah Connor", role: "Senior AI Engineer", matchScore: "96%" },
      ],
      documents: [
        { id: "d1", name: "Q3 Workforce Strategy.pdf", type: "PDF", status: "Approved", size: "2.4 MB" },
      ],
      headcountForecast: [
        { quarter: "Q1", expected: 250 },
        { quarter: "Q2", expected: 265 },
        { quarter: "Q3", expected: 280 },
      ],
      hiringDemand: [
        { role: "Senior Frontend Engineer", count: 4 },
        { role: "Product Manager", count: 2 },
      ],
      payroll: [],
      payrollAlerts: [
        { id: "p1", message: "Tax compliance check verified for October.", severity: "low" },
      ],
      payrollTrend: [
        { month: "Aug", amount: 480000 },
        { month: "Sep", amount: 495000 },
        { month: "Oct", amount: 510000 },
      ],
      recruitment: [],
      recommendations: [
        { id: "r1", action: "Initiate leadership coaching for Junior Leads.", impact: "High" },
        { id: "r2", action: "Adjust tech stack training for Cloud Security.", impact: "Medium" },
      ],
      satisfactionTrend: [
        { month: "Jan", rating: 4.2 },
        { month: "Feb", rating: 4.4 },
        { month: "Mar", rating: 4.6 },
      ],
      skillGap: [
        { skill: "LLM Fine-tuning", target: 80, current: 60 },
        { skill: "Kubernetes Ops", target: 90, current: 75 },
      ],
      supportPerformers: [],
      topPerformers: [
        { name: "Elena Rostova", role: "Lead Systems Architect", rating: 4.9 },
        { name: "Marcus Chen", role: "Principal Data Scientist", rating: 4.9 },
      ],
      hasDataFlag: true,
      partial: false,
      partialErrors: [],
    };
  }
);
