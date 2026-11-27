import { useState, type CSSProperties } from "react";
import { API_BASE_URL } from "@/api/baseUrl";

const failedSources = new Set<string>();

export function resolveEmployeeImageUrl(source?: string): string | undefined {
  const value = source?.trim();
  if (!value || /^(null|undefined|none|n\/a)$/i.test(value)) return undefined;
  // Bare filenames without path separators would mistakenly resolve to frontend origin
  if (!/^(https?:\/\/|\/|data:image\/)/i.test(value)) return undefined;
  if (value.startsWith("data:image/")) return value;
  try {
    const url = new URL(value, `${API_BASE_URL}/`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return undefined;
    if (/\.(invalid|example|local)$/i.test(url.hostname)) return undefined;
    if (/^(?:via\.placeholder\.com|placeholder\.com|dummyimage\.com|example\.(com|org|net))$/i.test(url.hostname)) {
      return undefined;
    }
    return url.href;
  } catch {
    return undefined;
  }
}

interface EmployeeAvatarProps {
  src?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
  fallbackStyle?: CSSProperties;
}

/** A failed source stays local to initials, including when another employee view mounts. */
export function EmployeeAvatar({ src, name, className, fallbackClassName, fallbackStyle }: EmployeeAvatarProps) {
  const resolved = resolveEmployeeImageUrl(src);
  const [failedSource, setFailedSource] = useState<string>();
  const initials = name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'EM';

  if (!resolved || failedSource === resolved || failedSources.has(resolved)) {
    return <span role="img" aria-label={name} className={fallbackClassName || `${className ?? ''} inline-flex items-center justify-center bg-primary/10 font-semibold text-primary`} style={fallbackStyle}>{initials}</span>;
  }

  return <img src={resolved} alt={name} className={className} onError={() => {
    if (failedSources.size >= 200) failedSources.delete(failedSources.values().next().value ?? '');
    failedSources.add(resolved);
    setFailedSource(resolved);
  }} />;
}
