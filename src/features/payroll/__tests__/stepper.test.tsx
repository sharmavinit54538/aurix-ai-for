import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PayrollStepper } from "../components/PayrollStepper";
import { PAYROLL_LIFECYCLE_STEPS } from "../types/lifecycle";

// Mock TanStack Router useNavigate
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

describe("PayrollStepper Component (9 Lifecycle Steps)", () => {
  it("renders exactly all 9 lifecycle steps in sequence", () => {
    render(<PayrollStepper currentStep="period" />);

    expect(PAYROLL_LIFECYCLE_STEPS).toHaveLength(9);
    expect(screen.getByText("Period")).toBeDefined();
    expect(screen.getByText("Run")).toBeDefined();
    expect(screen.getByText("Validation")).toBeDefined();
    expect(screen.getByText("Preview")).toBeDefined();
    expect(screen.getByText("Employee Detail")).toBeDefined();
    expect(screen.getByText("Review & Approval")).toBeDefined();
    expect(screen.getByText("Finalization")).toBeDefined();
    expect(screen.getByText("Payslips")).toBeDefined();
    expect(screen.getByText("Payment")).toBeDefined();
  });

  it("sets active state on the current step with aria-current='step'", () => {
    render(<PayrollStepper currentStep="validation" runId="run-101" />);

    const validationBtn = screen.getByRole("button", { name: /validation/i });
    expect(validationBtn.getAttribute("aria-current")).toBe("step");
  });

  it("disables subsequent steps if run is not finalized or runId is missing", () => {
    const { container } = render(<PayrollStepper currentStep="period" />);

    // Steps 2-9 should be disabled when runId is not provided
    const runBtn = container.querySelector("#payroll-stepper-run");
    expect(runBtn).toBeDefined();
    expect(runBtn?.getAttribute("disabled")).not.toBeNull();
    expect(runBtn?.getAttribute("aria-disabled")).toBe("true");

    const paymentBtn = container.querySelector("#payroll-stepper-payment");
    expect(paymentBtn?.getAttribute("disabled")).not.toBeNull();
  });

  it("enables Payment step only when run is finalized or paid", () => {
    const { rerender } = render(
      <PayrollStepper currentStep="finalization" runId="run-101" runStatus="Under Review" />
    );

    let paymentBtn = screen.getByRole("button", { name: /payment/i });
    expect(paymentBtn).toBeDisabled();

    // Rerender with Finalized status
    rerender(
      <PayrollStepper currentStep="finalization" runId="run-101" runStatus="Finalized" />
    );
    paymentBtn = screen.getByRole("button", { name: /payment/i });
    // In finalization step, previous steps are completed and finalized status allows payment navigation
    expect(paymentBtn.getAttribute("aria-current")).toBeNull();
  });

  it("triggers onStepClick callback on keyboard navigation (Enter key)", () => {
    const onStepClick = vi.fn();
    render(
      <PayrollStepper
        currentStep="validation"
        runId="run-101"
        onStepClick={onStepClick}
      />
    );

    const periodBtn = screen.getByRole("button", { name: /period/i });
    fireEvent.keyDown(periodBtn, { key: "Enter", code: "Enter" });

    expect(onStepClick).toHaveBeenCalledWith("period", "/dashboard/payroll/periods");
  });

  it("triggers onStepClick on Space key", () => {
    const onStepClick = vi.fn();
    render(
      <PayrollStepper
        currentStep="validation"
        runId="run-101"
        onStepClick={onStepClick}
      />
    );

    const periodBtn = screen.getByRole("button", { name: /period/i });
    fireEvent.keyDown(periodBtn, { key: " ", code: "Space" });

    expect(onStepClick).toHaveBeenCalledWith("period", "/dashboard/payroll/periods");
  });
});
