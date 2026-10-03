import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { connectApi } from "../connectApi";
import { soundService } from "../services/soundService";
import type { SoundSettings } from "../types";
import { Volume2, Bell, Phone, MessageSquare, Loader2, Play } from "lucide-react";
import { toast } from "sonner";

interface SoundSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoundSettingsDialog({ open, onOpenChange }: SoundSettingsDialogProps) {
  const [settings, setSettings] = useState<SoundSettings>({
    incomingCall: true,
    messageAlert: true,
    notificationChime: true,
    volume: 80,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      connectApi
        .getSoundSettings()
        .then((s) => {
          setSettings(s);
          soundService.updateSettings(s);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await connectApi.updateSoundSettings(settings);
      setSettings(updated);
      soundService.updateSettings(updated);
      toast.success("Sound preferences updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update sound preferences");
    } finally {
      setSaving(false);
    }
  };

  const testMessageChime = () => {
    soundService.playMessageChime();
  };

  const testCallRing = () => {
    soundService.startIncomingCallRing();
    setTimeout(() => {
      soundService.stopIncomingCallRing();
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-brand" />
            Sound Preferences
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading sound preferences...</span>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {/* Volume slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Alert Volume</span>
                <span className="text-muted-foreground">{settings.volume}%</span>
              </div>
              <Slider
                value={[settings.volume]}
                onValueChange={(val) => {
                  const newVol = val[0] ?? 80;
                  setSettings((prev) => ({ ...prev, volume: newVol }));
                  soundService.updateSettings({ ...settings, volume: newVol });
                }}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Message chime toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Message Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Play a soft chime when a new message arrives
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                  title="Test Chime"
                  onClick={testMessageChime}
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
                <Switch
                  checked={settings.messageAlert}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, messageAlert: checked }))
                  }
                />
              </div>
            </div>

            {/* Incoming call toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Incoming Call Ring</div>
                  <div className="text-xs text-muted-foreground">
                    Ring continuously during 1:1 incoming calls
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                  title="Test Ring"
                  onClick={testCallRing}
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
                <Switch
                  checked={settings.incomingCall}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({ ...prev, incomingCall: checked }))
                  }
                />
              </div>
            </div>

            {/* Notification chime toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Play sound for mentions and meeting alerts
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.notificationChime}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, notificationChime: checked }))
                }
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
