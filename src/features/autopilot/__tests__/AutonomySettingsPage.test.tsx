import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import AutonomySettingsPage from "../pages/AutonomySettingsPage";
import { mapAutonomySettingsFromBackend } from "../utils/mappers";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: () => <span>Select value</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

describe("AutonomySettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders workflow settings and immutable human boundaries", async () => {
    const mockSettings = mapAutonomySettingsFromBackend({});
    vi.mocked(autopilotApi.getSettings).mockResolvedValueOnce(mockSettings);

    render(<AutonomySettingsPage />);

    expect(
      await screen.findByText("Immutable Human Verification Boundaries"),
    ).toBeInTheDocument();
    expect(screen.getByText("Termination of Employment")).toBeInTheDocument();
    expect(screen.getByText("Salary & Compensation Revision")).toBeInTheDocument();
    expect(screen.getByText("Payroll Final Approval & Release")).toBeInTheDocument();
    expect(screen.getByText("Leave Requests")).toBeInTheDocument();
    expect(screen.getByText("Expense Reimbursements")).toBeInTheDocument();
  });

  it("displays warning banner when full auto mode is enabled on a workflow", async () => {
    const mockSettings = mapAutonomySettingsFromBackend({});
    mockSettings.workflows.leave.level = "full_auto";
    vi.mocked(autopilotApi.getSettings).mockResolvedValueOnce(mockSettings);

    render(<AutonomySettingsPage />);

    expect(await screen.findByText("Full Auto Autonomy Active")).toBeInTheDocument();
  });

  it("opens confirm modal before saving settings", async () => {
    const mockSettings = mapAutonomySettingsFromBackend({});
    vi.mocked(autopilotApi.getSettings).mockResolvedValueOnce(mockSettings);
    vi.mocked(autopilotApi.updateSettings).mockResolvedValueOnce(mockSettings);

    render(<AutonomySettingsPage />);

    const saveBtn = await screen.findByRole("button", { name: /save policy/i });
    fireEvent.click(saveBtn);

    expect(
      await screen.findByText("Confirm Autonomy Policy Update"),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /confirm and apply/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(autopilotApi.updateSettings).toHaveBeenCalled();
    });
  });

  it("gracefully handles 404 response without disruptive error banner", async () => {
    const error404: any = new Error("Not Found");
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getSettings).mockRejectedValueOnce(error404);

    render(<AutonomySettingsPage />);

    expect(
      screen.queryByText("Feature unavailable — backend pending"),
    ).not.toBeInTheDocument();
  });
});
