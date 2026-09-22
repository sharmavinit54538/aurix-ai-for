import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings";

export const Route = createFileRoute("/dashboard/settings/profile")({
  head: () => ({ meta: [{ title: "User Profile — OFC360" }] }),
  component: ProfileSettingsRoutePage,
});

function ProfileSettingsRoutePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-w-0">
      <SettingsLayout
        initialSection="profile"
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
