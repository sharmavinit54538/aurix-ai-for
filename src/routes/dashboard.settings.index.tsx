import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsLayout, type SettingsSectionKey } from "@/features/settings";

export const Route = createFileRoute("/dashboard/settings/")({
  head: () => ({ meta: [{ title: "Organization Settings — OFC360" }] }),
  validateSearch: (search: Record<string, unknown>): { section?: SettingsSectionKey } => {
    return {
      section: (search.section as SettingsSectionKey) || undefined,
    };
  },
  component: SettingsIndexPage,
});

function SettingsIndexPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/dashboard/settings/" });

  const handleSectionChange = (section?: SettingsSectionKey | null) => {
    navigate({
      search: section ? { section } : {},
      replace: false,
    });
  };

  return (
    <div className="w-full min-w-0">
      <SettingsLayout initialSection={search.section} onSectionChange={handleSectionChange} />
    </div>
  );
}
