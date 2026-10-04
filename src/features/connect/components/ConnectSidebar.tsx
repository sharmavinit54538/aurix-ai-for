import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import type { Channel, DirectConversation, PresenceStatus } from "../types";
import { useMyPresence } from "../stores/presenceStore";
import {
  Hash,
  Lock,
  Plus,
  Search,
  MessageSquare,
  Volume2,
  Phone,
  Video,
  User,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectSidebarProps {
  channels: Channel[];
  conversations: DirectConversation[];
  onOpenNewChannel: () => void;
  onOpenNewDm: () => void;
  onOpenSoundSettings: () => void;
  activeChannelId?: string;
  activeConversationId?: string;
}

export function ConnectSidebar({
  channels,
  conversations,
  onOpenNewChannel,
  onOpenNewDm,
  onOpenSoundSettings,
  activeChannelId,
  activeConversationId,
}: ConnectSidebarProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const { myStatus, setMyStatus } = useMyPresence();

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredDms = conversations.filter((d) =>
    d.participant.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getStatusColor = (status?: PresenceStatus) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "away":
        return "bg-amber-500";
      case "offline":
        return "bg-neutral-400";
      default:
        return "";
    }
  };

  return (
    <div className="flex h-full w-64 md:w-72 flex-col border-r border-border bg-card/60 backdrop-blur-xl shrink-0 select-none">
      {/* Top Header & Search Bar */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-brand-foreground text-xs font-bold shadow-sm">
              C
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Connect
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Sound Preferences"
              onClick={onOpenSoundSettings}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </Button>

            <Link to="/dashboard/calls">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                title="Calls History"
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link to="/dashboard/meetings">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                title="Meetings"
              >
                <Video className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search channels or DMs..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-md border border-border/80 bg-background/60 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-brand/40"
          />
        </div>
      </div>

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* CHANNELS SECTION */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            <span>Channels</span>
            <button
              onClick={onOpenNewChannel}
              className="rounded p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Create Channel"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {filteredChannels.length === 0 ? (
            <div className="px-2 py-1 text-xs text-muted-foreground/60 italic">
              {filterQuery ? "No channels match" : "No channels yet"}
            </div>
          ) : (
            filteredChannels.map((c) => {
              const isActive = activeChannelId === c.id;
              return (
                <Link
                  key={c.id}
                  to="/dashboard/connect/channels/$channelId"
                  params={{ channelId: c.id }}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {c.isPrivate ? (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <Hash className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{c.name}</span>
                  </div>

                  {c.unreadCount > 0 ? (
                    <span className="ml-2 rounded-full bg-brand px-1.5 py-0.2 text-[10px] font-bold text-brand-foreground shrink-0 shadow-sm">
                      {c.unreadCount}
                    </span>
                  ) : null}
                </Link>
              );
            })
          )}
        </div>

        {/* DIRECT MESSAGES SECTION */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            <span>Direct Messages</span>
            <button
              onClick={onOpenNewDm}
              className="rounded p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Start Direct Message"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {filteredDms.length === 0 ? (
            <div className="px-2 py-1 text-xs text-muted-foreground/60 italic">
              {filterQuery ? "No DMs match" : "No conversations yet"}
            </div>
          ) : (
            filteredDms.map((conv) => {
              const isActive = activeConversationId === conv.id;
              return (
                <Link
                  key={conv.id}
                  to="/dashboard/connect/dm/$conversationId"
                  params={{ conversationId: conv.id }}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <div className="relative h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold overflow-hidden">
                      {conv.participant.avatar ? (
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        conv.participant.name.slice(0, 1)
                      )}
                      {conv.participant.presence ? (
                        <span
                          className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full ring-1 ring-background ${getStatusColor(
                            conv.participant.presence
                          )}`}
                        />
                      ) : null}
                    </div>
                    <span className="truncate">{conv.participant.name}</span>
                  </div>

                  {conv.unreadCount > 0 ? (
                    <span className="ml-2 rounded-full bg-brand px-1.5 py-0.2 text-[10px] font-bold text-brand-foreground shrink-0 shadow-sm">
                      {conv.unreadCount}
                    </span>
                  ) : null}
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* User Presence Footer Bar */}
      <div className="p-2.5 border-t border-border bg-card/40 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors text-xs text-left cursor-pointer w-full">
              <span
                className={`h-2.5 w-2.5 rounded-full ring-1 ring-background ${getStatusColor(
                  myStatus
                )}`}
              />
              <span className="flex-1 capitalize font-medium text-foreground truncate">
                {myStatus}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem
              onClick={() => setMyStatus("online")}
              className="text-xs gap-2 cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setMyStatus("away")}
              className="text-xs gap-2 cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Away
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setMyStatus("offline")}
              className="text-xs gap-2 cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              Offline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
