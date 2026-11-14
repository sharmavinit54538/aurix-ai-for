import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-documents")({
  component: VerifyDocumentsLayout,
});

function VerifyDocumentsLayout() {
  return <Outlet />;
}
