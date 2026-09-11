import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create your workspace — OFC360" }] }),
  component: RegisterPage,
});
