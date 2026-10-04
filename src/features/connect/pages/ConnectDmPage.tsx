import { useEffect, useState, useCallback } from "react";
import { useParams } from "@tanstack/react-router";
import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import type { Channel, DirectConversation } from "../types";
import { ConnectSidebar } from "../components/ConnectSidebar";
import { DirectMessageView } from "../components/DirectMessageView";
import { ColleagueSearchModal } from "../components/ColleagueSearchModal";
import { ChannelCreateDialog } from "../components/ChannelCreateDialog";
import { SoundSettingsDialog } from "../components/SoundSettingsDialog";
import { toast } from "sonner";

export function ConnectDmPage() {
  const { conversationId } = useParams({ strict: false }) as { conversationId: string };
  const [channels, setChannels] = useState<Channel[]>([]);
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
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
      toast.error("Failed to load sidebar channels and direct messages");
    }
  }, []);

  useEffect(() => {
    realtimeClient.connect();
    loadSidebarData();

    const unbind = realtimeClient.onReconnect(() => {
      loadSidebarData();
    });

    return unbind;
  }, [loadSidebarData]);

  return (
    <div className="flex h-[calc(100vh-8.5rem)] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ConnectSidebar
        channels={channels}
        conversations={conversations}
        activeConversationId={conversationId}
        onOpenNewChannel={() => setCreateChannelOpen(true)}
        onOpenNewDm={() => setSearchModalOpen(true)}
        onOpenSoundSettings={() => setSoundSettingsOpen(true)}
      />

      <DirectMessageView conversationId={conversationId} />

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
