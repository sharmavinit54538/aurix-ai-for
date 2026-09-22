import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings";

export const Route = createFileRoute("/dashboard/settings/company")({
  head: () => ({ meta: [{ title: "Company Settings — OFC360" }] }),
  component: CompanySettingsRoutePage,
});

function CompanySettingsRoutePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-w-0">
      <SettingsLayout
        initialSection="company"
        onSectionChange={(section) => {
          if (!section) {
            navigate({ to: "/dashboard/settings" });
          } else {
            navigate({ to: "/dashboard/settings", search: { section } });
          }
        }}
      />
    </div>
  );
}
