/**
 * CSV Formula Injection (DDE) Mitigation Utility.
 * Prevents Excel/Sheets execution of arbitrary formulas by prefixing dangerous characters with a single quote.
 */

const DANGEROUS_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Sanitizes a single cell string against CSV formula injection.
 */
export function sanitizeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return "";
  const str = String(cell);
  if (str.length === 0) return "";

  const firstChar = str.charAt(0);
  if (DANGEROUS_PREFIXES.includes(firstChar)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Sanitizes a row array of cell values.
 */
export function sanitizeCsvRow(row: unknown[]): string[] {
  return row.map((cell) => sanitizeCsvCell(cell));
}

/**
 * Generates an RFC-compliant CSV string from rows with automatic sanitization and escaping.
 */
export function buildSafeCsv(headers: string[], rows: unknown[][]): string {
  const safeHeaders = sanitizeCsvRow(headers);
  const safeRows = rows.map((r) => sanitizeCsvRow(r));

  const formatLine = (items: string[]) =>
    items
      .map((item) => {
        // Escape quotes
        const escaped = item.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(",");

  return [formatLine(safeHeaders), ...safeRows.map(formatLine)].join("\r\n");
}
