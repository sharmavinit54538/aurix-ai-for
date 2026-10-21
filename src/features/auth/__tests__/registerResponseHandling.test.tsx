import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterPage } from "../pages/RegisterPage";
import { authService } from "@/api";
import { toast } from "sonner";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/api", () => ({
  authService: {
    register: vi.fn(),
  },
}));

describe("RegisterPage - API Response Null Safety & Optional Chaining", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function fillAndSubmitValidForm() {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Alice Smith" },
    });
    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: "Acme Corporation" },
    });
    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: "alice@acme.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "9876543210" },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    const submitBtn = screen.getByRole("button", { name: /create workspace/i });
    fireEvent.click(submitBtn);
  }

  it("handles null API response without throwing TypeError ('Cannot read properties of null (reading success)')", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce(null as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles undefined API response without throwing TypeError", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce(undefined as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles API response where response.data is null without crashing", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({ data: null } as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles successful response with flat { success: true, message: ... }", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      success: true,
      message: "Workspace created successfully!",
    } as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Workspace created successfully!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/verify-email" });
    });
  });

  it("handles successful response with nested { data: { success: true, message: ... } }", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      data: {
        success: true,
        message: "Welcome to your new workspace!",
      },
    } as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Welcome to your new workspace!");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/verify-email" });
    });
  });

  it("handles failure response with custom error message", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      success: false,
      message: "An organization with this work email already exists.",
    } as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("An organization with this work email already exists.");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("handles nested failure response in response.data", async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      data: {
        success: false,
        message: "Domain not permitted.",
      },
    } as any);

    await fillAndSubmitValidForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Domain not permitted.");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
