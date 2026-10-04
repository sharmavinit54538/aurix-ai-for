import { useEffect, useState, useCallback } from "react";
import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import type { Channel, DirectConversation } from "../types";
import { ConnectSidebar } from "../components/ConnectSidebar";
import { ColleagueSearchModal } from "../components/ColleagueSearchModal";
import { ChannelCreateDialog } from "../components/ChannelCreateDialog";
import { SoundSettingsDialog } from "../components/SoundSettingsDialog";
import { MessageSquare, Users, Hash, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ConnectRootPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [soundSettingsOpen, setSoundSettingsOpen] = useState(false);

  const loadSidebarData = useCallback(async () => {
    try {
      const [chList, dmList] = await Promise.all([
        connectApi.listChannels(),
        connectApi.listConversations(),
      ]);
      setChannels(chList);
      setConversations(dmList);
    } catch {
      toast.error("Failed to load channels and direct messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    realtimeClient.connect();
    loadSidebarData();

    // Refresh on reconnect
    const unbind = realtimeClient.onReconnect(() => {
      loadSidebarData();
    });

    return unbind;
  }, [loadSidebarData]);

  return (
    <div className="flex h-[calc(100vh-8.5rem)] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Left Connect Navigation Sidebar */}
      <ConnectSidebar
        channels={channels}
        conversations={conversations}
        onOpenNewChannel={() => setCreateChannelOpen(true)}
        onOpenNewDm={() => setSearchModalOpen(true)}
        onOpenSoundSettings={() => setSoundSettingsOpen(true)}
      />

      {/* Main Center Stage (No channel or DM active) */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-background/50">
        <div className="h-16 w-16 rounded-3xl bg-brand/10 text-brand flex items-center justify-center mb-4 shadow-glow">
          <MessageSquare className="h-8 w-8" />
        </div>

        <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
          Welcome to OFC360 Connect
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Collaborate in real time with your team. Select a channel on the left, start a direct message, or host a voice/video huddle.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => setCreateChannelOpen(true)}
            className="gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Channel
          </Button>

          <Button
            variant="outline"
            onClick={() => setSearchModalOpen(true)}
            className="gap-2 cursor-pointer shadow-sm"
          >
            <Users className="h-4 w-4" />
            Colleague Directory
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ColleagueSearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
      />
      <ChannelCreateDialog
        open={createChannelOpen}
        onOpenChange={setCreateChannelOpen}
        onCreated={(newCh) => setChannels((prev) => [...prev, newCh])}
      />
      <SoundSettingsDialog
        open={soundSettingsOpen}
        onOpenChange={setSoundSettingsOpen}
      />
    </div>
  );
}
