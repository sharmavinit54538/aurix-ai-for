import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings";

export const Route = createFileRoute("/dashboard/settings/notifications")({
  head: () => ({ meta: [{ title: "Notification Settings — OFC360" }] }),
  component: NotificationSettingsRoutePage,
});

function NotificationSettingsRoutePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-w-0">
      <SettingsLayout
        initialSection="notifications"
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
