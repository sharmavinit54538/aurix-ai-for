import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OneHRIcon } from "../OneHRIcon";

describe("OneHRIcon", () => {
  it("renders with default gradient mode", () => {
    const { container } = render(<OneHRIcon className="h-6 w-6" data-testid="onehr-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("h-6 w-6");
    expect(container.querySelector("linearGradient")).toBeInTheDocument();
  });

  it("renders with gradient=false using currentColor", () => {
    const { container } = render(<OneHRIcon gradient={false} className="h-4 w-4" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(container.querySelector("linearGradient")).toBeNull();
  });
});
