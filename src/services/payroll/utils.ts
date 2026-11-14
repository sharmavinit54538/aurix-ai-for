export function getDownloadFilename(responseHeaders: Record<string, string>, fallback: string): string {
  const contentDisposition = responseHeaders["content-disposition"] || responseHeaders["Content-Disposition"];
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }
  }
  return fallback;
}

export function parseContentType(responseHeaders: Record<string, string>): string {
  return responseHeaders["content-type"] || responseHeaders["Content-Type"] || "application/octet-stream";
}
