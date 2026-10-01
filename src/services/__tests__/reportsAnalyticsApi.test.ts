import { describe, it, expect, vi, beforeEach } from "vitest";
import apiInstance from "@/api/apiInstance";
import { reportsAnalyticsApi } from "../reportsAnalyticsApi";

vi.mock("@/api/apiInstance", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("reportsAnalyticsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls /api/v2/reports/analytics/headcount with query params and returns typed data", async () => {
    const mockData = [
      { m: "2025-01", n: 120 },
      { m: "2025-02", n: 125 },
    ];
    vi.mocked(apiInstance.get).mockResolvedValueOnce({
      data: { success: true, data: mockData },
    });

    const params = { start_date: "2025-01-01", end_date: "2025-02-01", department: "Engineering" };
    const res = await reportsAnalyticsApi.getHeadcount(params);

    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/headcount", {
      params,
    });
    expect(res).toEqual(mockData);
  });

  it("calls /api/v2/reports/analytics/department with query params and returns typed data", async () => {
    const mockData = [
      { name: "Engineering", value: 50 },
      { name: "Sales", value: 30 },
    ];
    vi.mocked(apiInstance.get).mockResolvedValueOnce({
      data: { success: true, data: mockData },
    });

    const params = { start_date: "2024-01-01", end_date: "2025-01-01" };
    const res = await reportsAnalyticsApi.getDepartment(params);

    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/department", {
      params,
    });
    expect(res).toEqual(mockData);
  });

  it("calls /api/v2/reports/analytics/tenure with query params and returns typed data", async () => {
    const mockData = [
      { range: "< 1 year", n: 20 },
      { range: "1-3 years", n: 45 },
    ];
    vi.mocked(apiInstance.get).mockResolvedValueOnce({
      data: { success: true, data: mockData },
    });

    const res = await reportsAnalyticsApi.getTenure({ department: "Product" });

    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/tenure", {
      params: { department: "Product" },
    });
    expect(res).toEqual(mockData);
  });

  it("calls optional probed endpoints with correct /api/v2 routes", async () => {
    vi.mocked(apiInstance.get).mockResolvedValueOnce({ data: [{ period: "2025", rate: 5.2 }] });
    vi.mocked(apiInstance.get).mockResolvedValueOnce({ data: [{ m: "2025-01", cost: 500000 }] });
    vi.mocked(apiInstance.get).mockResolvedValueOnce({ data: [{ category: "Security", score: 98 }] });

    const turnover = await reportsAnalyticsApi.getTurnover();
    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/turnover", { params: undefined });
    expect(turnover).toHaveLength(1);

    const payroll = await reportsAnalyticsApi.getPayrollCost();
    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/payroll-cost", { params: undefined });
    expect(payroll).toHaveLength(1);

    const compliance = await reportsAnalyticsApi.getCompliance();
    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/compliance", { params: undefined });
    expect(compliance).toHaveLength(1);
  });

  it("calls exportCsv with format=csv and responseType blob", async () => {
    const mockBlob = new Blob(["col1,col2\nval1,val2"], { type: "text/csv" });
    vi.mocked(apiInstance.get).mockResolvedValueOnce({ data: mockBlob });

    const params = { start_date: "2024-01-01", end_date: "2025-01-01" };
    const blob = await reportsAnalyticsApi.exportCsv(params);

    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/reports/analytics/export", {
      params: { start_date: "2024-01-01", end_date: "2025-01-01", format: "csv" },
      responseType: "blob",
    });
    expect(blob).toBe(mockBlob);
  });
});
