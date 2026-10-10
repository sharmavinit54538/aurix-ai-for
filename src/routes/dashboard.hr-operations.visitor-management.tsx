import { createFileRoute } from "@tanstack/react-router";
import { Users, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function VisitorManagementUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl text-amber-500 border border-amber-500/20">
        <Users className="h-8 w-8" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-amber-500" />
            Visitor Management Unavailable
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            This feature is not available yet. Backend endpoint is pending implementation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Visitor management (kiosk registration, host notifications, visitor passes, security logs)
            will be available once the backend API is implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/dashboard/hr-operations/visitor-management")({
  head: () => ({ meta: [{ title: "Visitor Management — OFC360" }] }),
  component: VisitorManagementUnavailable,
});
