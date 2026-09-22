import React from "react";
import { AlertCircle, Terminal } from "lucide-react";

interface ApiUnavailableAlertProps {
  endpoint?: string;
  method?: string;
  featureName?: string;
  className?: string;
}

export function ApiUnavailableAlert({
  endpoint: _endpoint,
  method: _method = "GET",
  featureName: _featureName,
  className: _className = "",
}: ApiUnavailableAlertProps) {
  return null;
}
