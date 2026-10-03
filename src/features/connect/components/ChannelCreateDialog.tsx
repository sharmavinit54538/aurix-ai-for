import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { connectApi } from "../connectApi";
import type { Channel } from "../types";
import { Loader2, Hash, Lock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface ChannelCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channel: Channel) => void;
}

export function ChannelCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: ChannelCreateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const channel = await connectApi.createChannel({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description.trim() || undefined,
        topic: topic.trim() || undefined,
        isPrivate,
      });

      toast.success(`Channel #${channel.name} created!`);
      onOpenChange(false);
      setName("");
      setDescription("");
      setTopic("");
      setIsPrivate(false);

      if (onCreated) {
        onCreated(channel);
      }
      navigate({
        to: "/dashboard/connect/channels/$channelId",
        params: { channelId: channel.id },
      });
    } catch {
      toast.error("Failed to create channel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            {isPrivate ? <Lock className="h-4 w-4 text-brand" /> : <Hash className="h-4 w-4 text-brand" />}
            Create a Channel
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="channel-name">Channel Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                #
              </span>
              <Input
                id="channel-name"
                placeholder="e.g. general, announcements, engineering"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-7 text-sm"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Names should be lowercase, without spaces (dashes will replace spaces automatically).
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="channel-topic">Topic (Optional)</Label>
            <Input
              id="channel-topic"
              placeholder="What is this channel about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="channel-desc">Description (Optional)</Label>
            <Textarea
              id="channel-desc"
              placeholder="Provide context on channel guidelines or members"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Make Private</div>
              <div className="text-xs text-muted-foreground">
                When private, only invited members can view or join.
              </div>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Channel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
