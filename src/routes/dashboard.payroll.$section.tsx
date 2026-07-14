import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { isPayrollSection, payrollSections } from "@/features/admin/payroll/payrollRoutes";

export const Route = createFileRoute("/dashboard/payroll/$section")({
  beforeLoad: ({ params }) => {
    if (!isPayrollSection(params.section)) {
      throw notFound();
    }
  },
  head: ({ params }) => ({
    meta: [{ title: payrollSections[params.section as keyof typeof payrollSections].title }],
  }),
  component: PayrollSectionRoute,
});

function PayrollSectionRoute() {
  const { section } = Route.useParams();

  if (!isPayrollSection(section)) {
    throw notFound();
  }

  const Page = payrollSections[section].page;

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
      <Page />
    </Suspense>
  );
}
