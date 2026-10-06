import React from "react";
import { EmptyState } from "@/components/common/EmptyState";

export function CioAnalyticsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <EmptyState
        title="Data not available yet"
        description="Generated IT analytics and executive compliance reports are not connected to a backend service."
      />
    </div>
  );
}

export default CioAnalyticsPage;
