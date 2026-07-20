import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CreditCard, Layers, Mail, MessageSquare, Users, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectIntegrations, selectSettingsLoading } from "@/store/settings/settingsSelectors";
import { fetchIntegrations, toggleIntegration } from "@/store/settings/settingsThunk";
import type { IntegrationItem } from "@/store/settings/settingsTypes";

export const Route = createFileRoute("/dashboard/settings/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Aurix" }] }),
  component: IntegrationsPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Mail,
  Users,
  CreditCard,
  Video,
};

function IntegrationsPage() {
  const dispatch = useAppDispatch();
  const integrations = useAppSelector(selectIntegrations);
  const loading = useAppSelector(selectSettingsLoading);

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  const handleToggle = async (item: IntegrationItem) => {
    try {
      await dispatch(toggleIntegration({ id: item.id, connected: !item.connected })).unwrap();
      toast.success(`${item.name} ${!item.connected ? "connected" : "disconnected"}`);
    } catch {
      toast.error(`Failed to update ${item.name} integration`);
    }
  };

  if (loading && integrations.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Integrations & Ecosystem</h2>
          <p className="text-xs text-muted-foreground">Connect Aurix with your enterprise toolstack for automated communications, single sign-on, and sync.</p>
        </div>
        <Layers className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {integrations.map((item) => {
          const IconComponent = item.icon ? ICON_MAP[item.icon] || Layers : Layers;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:border-foreground/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-foreground">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{item.name}</div>
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </div>
                  </div>
                  {item.connected ? (
                    <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20">Connected</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Disconnected</Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-xs text-muted-foreground">
                  {item.connected ? "Active real-time sync" : "Not connected"}
                </span>
                <Button
                  size="sm"
                  variant={item.connected ? "outline" : "default"}
                  onClick={() => handleToggle(item)}
                >
                  {item.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
