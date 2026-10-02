import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import { ReportsPage } from "../ReportsPage";
import reportsAnalyticsApi from "@/services/reportsAnalyticsApi";

const { mockApi } = vi.hoisted(() => {
  const mockApi = {
    getHeadcount: vi.fn().mockResolvedValue([]),
    getDepartment: vi.fn().mockResolvedValue([]),
    getTenure: vi.fn().mockResolvedValue([]),
    getTurnover: vi.fn().mockRejectedValue({ response: { status: 404 } }),
    getPayrollCost: vi.fn().mockRejectedValue({ response: { status: 404 } }),
    getCompliance: vi.fn().mockRejectedValue({ response: { status: 404 } }),
    exportCsv: vi.fn().mockResolvedValue(new Blob([])),
  };
  return { mockApi };
});

vi.mock("@/services/reportsAnalyticsApi", () => ({
  reportsAnalyticsApi: mockApi,
  default: mockApi,
}));

vi.mock("@/lib/roles", () => ({
  useCurrentRole: vi.fn(() => "hr_admin"),
  normalizeRole: (r: string) => r,
}));

vi.mock("@/api/apiInstance", () => ({
  default: {
    get: vi.fn().mockRejectedValue({ response: { status: 404 } }),
  },
}));

vi.mock("recharts", async () => {
  const actual: any = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe("ReportsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially while fetching reports", () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockReturnValue(new Promise(() => {}));
    vi.mocked(reportsAnalyticsApi.getDepartment).mockReturnValue(new Promise(() => {}));
    vi.mocked(reportsAnalyticsApi.getTenure).mockReturnValue(new Promise(() => {}));

    render(<ReportsPage />);
    expect(screen.getByText("Headcount over time")).toBeInTheDocument();
    expect(screen.getByText("By department")).toBeInTheDocument();
    expect(screen.getByText("Tenure distribution")).toBeInTheDocument();

  });

  it("renders charts with real data when calls succeed", async () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockResolvedValue([
      { m: "2025-01", n: 100 },
      { m: "2025-02", n: 110 },
    ]);
    vi.mocked(reportsAnalyticsApi.getDepartment).mockResolvedValue([
      { name: "Engineering", value: 60 },
      { name: "Marketing", value: 40 },
    ]);
    vi.mocked(reportsAnalyticsApi.getTenure).mockResolvedValue([
      { range: "0-1 yr", n: 30 },
      { range: "1-3 yrs", n: 70 },
    ]);

    render(<ReportsPage />);

    await waitFor(() => {
      const containers = screen.getAllByTestId("responsive-container");
      expect(containers.length).toBeGreaterThanOrEqual(3);
    });

    expect(screen.queryByText("Not enough data yet")).not.toBeInTheDocument();
  });

  it("shows 'Not enough data yet' ONLY when API succeeded and returned empty array", async () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockResolvedValue([]);
    vi.mocked(reportsAnalyticsApi.getDepartment).mockResolvedValue([]);
    vi.mocked(reportsAnalyticsApi.getTenure).mockResolvedValue([]);

    render(<ReportsPage />);

    await waitFor(() => {
      const emptyStates = screen.getAllByText("Not enough data yet");
      expect(emptyStates.length).toBe(3);
    });

    // Make sure no error banner is displayed
    expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument();
  });

  it("shows error card with message and Retry button when a chart fails, retrying only that chart", async () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockRejectedValueOnce(
      new Error("Database connection timed out")
    );
    vi.mocked(reportsAnalyticsApi.getDepartment).mockResolvedValue([
      { name: "Engineering", value: 50 },
    ]);
    vi.mocked(reportsAnalyticsApi.getTenure).mockResolvedValue([
      { range: "1-2 yrs", n: 25 },
    ]);

    render(<ReportsPage />);

    // Headcount error should be visible
    await waitFor(() => {
      expect(screen.getByText("Database connection timed out")).toBeInTheDocument();
    });

    // The retry button for headcount should be present
    const retryButtons = screen.getAllByRole("button", { name: /retry/i });
    expect(retryButtons.length).toBe(1);

    // Mock success for retry
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockResolvedValueOnce([
      { m: "2025-01", n: 100 },
    ]);

    // Click retry
    fireEvent.click(retryButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Database connection timed out")).not.toBeInTheDocument();
    });
  });

  it("shows distinct 403 error message when user lacks access", async () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockRejectedValueOnce({
      response: { status: 403 },
    });
    vi.mocked(reportsAnalyticsApi.getDepartment).mockResolvedValue([]);
    vi.mocked(reportsAnalyticsApi.getTenure).mockResolvedValue([]);

    render(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByText("You do not have access to this report")).toBeInTheDocument();
    });
  });

  it("validates start_date <= end_date and blocks querying with invalid range", async () => {
    vi.mocked(reportsAnalyticsApi.getHeadcount).mockResolvedValue([]);
    vi.mocked(reportsAnalyticsApi.getDepartment).mockResolvedValue([]);
    vi.mocked(reportsAnalyticsApi.getTenure).mockResolvedValue([]);

    render(<ReportsPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getAllByText("Not enough data yet").length).toBe(3);
    });

    // Inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBe(2);

    // Set start date > end date
    fireEvent.change(dateInputs[0], { target: { value: "2025-12-31" } });
    fireEvent.change(dateInputs[1], { target: { value: "2025-01-01" } });

    await waitFor(() => {
      expect(
        screen.getByText("Start date must be before or equal to End date.")
      ).toBeInTheDocument();
    });
  });
});
