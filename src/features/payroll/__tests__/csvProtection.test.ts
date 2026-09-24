import { describe, it, expect } from "vitest";
import { sanitizeCsvCell, sanitizeCsvRow, buildSafeCsv } from "../utils/csvProtection";

describe("CSV Formula Injection Protection (DDE Mitigation)", () => {
  it("prefixes dangerous characters with a single quote", () => {
    expect(sanitizeCsvCell("=CMD('calc')")).toBe("'=CMD('calc')");
    expect(sanitizeCsvCell("+1234")).toBe("'+1234");
    expect(sanitizeCsvCell("-5678")).toBe("'-5678");
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    expect(sanitizeCsvCell("\tTabInjected")).toBe("'\tTabInjected");
    expect(sanitizeCsvCell("\rCarriageReturn")).toBe("'\rCarriageReturn");
  });

  it("leaves normal safe strings, numbers, and null/undefined intact", () => {
    expect(sanitizeCsvCell("Rahul Sharma")).toBe("Rahul Sharma");
    expect(sanitizeCsvCell("EMP-1029")).toBe("EMP-1029");
    expect(sanitizeCsvCell("HDFC0000060")).toBe("HDFC0000060");
    expect(sanitizeCsvCell(125000)).toBe("125000");
    expect(sanitizeCsvCell(null)).toBe("");
    expect(sanitizeCsvCell(undefined)).toBe("");
  });

  it("sanitizes an entire row array", () => {
    const row = ["EMP-001", "Vinit", "=SUM(B1:B10)", "85000"];
    const sanitized = sanitizeCsvRow(row);
    expect(sanitized).toEqual(["EMP-001", "Vinit", "'=SUM(B1:B10)", "85000"]);
  });

  it("builds a safe CSV string with escaped quotes and RFC carriage returns", () => {
    const headers = ["Employee Code", "Name", "Formula Attempt", "Net Pay"];
    const rows = [
      ["EMP-1", 'John "Jack" Doe', "=2+2", "50000"],
      ["EMP-2", "Jane Smith", "@DDE", "60000"],
    ];

    const csv = buildSafeCsv(headers, rows);
    expect(csv).toContain('"Employee Code","Name","Formula Attempt","Net Pay"');
    expect(csv).toContain('"EMP-1","John ""Jack"" Doe","\'=2+2","50000"');
    expect(csv).toContain('"EMP-2","Jane Smith","\'@DDE","60000"');
  });
});
