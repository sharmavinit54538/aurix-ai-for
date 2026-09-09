import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  let host = ((import.meta.env.VITE_API_URL as string) || "https://www.api.ofc360.com").trim().replace(/\/$/, "");
  if (!host.startsWith("http://") && !host.startsWith("https://")) {
    host = `https://${host}`;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${host}${normalizedPath}`;
}
