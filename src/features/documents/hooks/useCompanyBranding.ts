import { useEffect, useState, useMemo } from "react";
import { useAurix, aurix, type Company } from "@/lib/aurix-store";
import apiInstance from "@/api/apiInstance";

const BACKEND_BASE = (import.meta.env.VITE_API_URL || "https://api.ofc360.com").replace(/\/+$/, "");

export function resolveAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_BASE}${cleanPath}`;
}

export interface CompanyBrandingData {
  companyName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl: string | null;
  stampUrl: string | null;
  hasCustomStamp: boolean;
  signatureUrl: string | null;
  signatoryName: string;
  signatoryDesignation: string;
  isLoading: boolean;
}

export function useCompanyBranding(): CompanyBrandingData {
  const ws = useAurix();
  const company = ws.company as (Company & {
    company_stamp_url?: string;
    company_stamp?: string;
    stampUrl?: string;
    company_logo_url?: string;
    company_logo?: string;
    digital_signature_url?: string;
    signature_url?: string;
  }) | null;

  const [backendOrg, setBackendOrg] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if we already have the stamp from onboarding
    const existingStamp =
      company?.stampDataUrl ||
      company?.stampUrl ||
      company?.company_stamp_url ||
      company?.company_stamp;

    const fetchOrg = async () => {
      setIsLoading(true);
      try {
        // Attempt to fetch organization from onboarding endpoint
        const res = await apiInstance.get("/onboarding/organization");
        const data = res.data?.data || res.data || {};
        if (isMounted && data) {
          setBackendOrg(data);

          // Sync into aurix store so other modules also have the latest stamp & logo
          const stampFromBackend =
            data.company_stamp_url || data.company_stamp || data.stamp || null;
          const logoFromBackend =
            data.company_logo_url || data.company_logo || data.logo || null;

          if (stampFromBackend || logoFromBackend) {
            aurix.set({
              company: {
                ...company,
                id: company?.id || data.id || "default",
                name: company?.name || data.name || data.company_name || "Organization",
                stampUrl: stampFromBackend || company?.stampUrl,
                company_stamp_url: stampFromBackend || company?.company_stamp_url,
                logoUrl: logoFromBackend || company?.logoUrl,
                logoDataUrl: company?.logoDataUrl || (logoFromBackend ? resolveAssetUrl(logoFromBackend) || undefined : undefined),
              } as Company,
            });
          }
        }
      } catch {
        // If /onboarding/organization is not available, try /onboarding/company or /settings/company
        try {
          const fallbackRes = await apiInstance.get("/onboarding/company");
          const fData = fallbackRes.data?.data || fallbackRes.data || {};
          if (isMounted && fData) {
            setBackendOrg(fData);
          }
        } catch {
          // Keep store defaults
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOrg();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => {
    const rawStamp =
      company?.stampDataUrl ||
      company?.stampUrl ||
      company?.company_stamp_url ||
      company?.company_stamp ||
      backendOrg?.company_stamp_url ||
      backendOrg?.company_stamp ||
      backendOrg?.stamp ||
      null;

    const rawLogo =
      company?.logoDataUrl ||
      company?.logoUrl ||
      company?.company_logo_url ||
      company?.company_logo ||
      backendOrg?.company_logo_url ||
      backendOrg?.company_logo ||
      backendOrg?.logo ||
      null;

    const rawSignature =
      company?.signatureDataUrl ||
      company?.signatureUrl ||
      company?.digital_signature_url ||
      backendOrg?.digital_signature_url ||
      backendOrg?.signature_url ||
      null;

    const companyName =
      company?.name ||
      backendOrg?.name ||
      backendOrg?.company_name ||
      "OFC360 Organization";

    const address = company?.address || backendOrg?.address || "";
    const city = company?.city || backendOrg?.city || "";
    const state = company?.state || backendOrg?.state || "";
    const country = company?.country || backendOrg?.country || "India";
    const phone = company?.phone || backendOrg?.phone || "";
    const email = company?.email || backendOrg?.email || "";
    const website = company?.website || backendOrg?.website || "";

    const stampUrl = resolveAssetUrl(rawStamp);
    const logoUrl = resolveAssetUrl(rawLogo);
    const signatureUrl = resolveAssetUrl(rawSignature);

    return {
      companyName,
      address,
      city,
      state,
      country,
      phone,
      email,
      website,
      logoUrl,
      stampUrl,
      hasCustomStamp: Boolean(stampUrl),
      signatureUrl,
      signatoryName: ws.user?.fullName || "HR Administrator",
      signatoryDesignation: "Authorized Signatory",
      isLoading,
    };
  }, [company, backendOrg, ws.user, isLoading]);
}
