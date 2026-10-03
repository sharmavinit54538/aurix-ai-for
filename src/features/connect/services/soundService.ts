import { connectApi } from "../connectApi";
import type { SoundSettings } from "../types";

class SoundService {
  private audioCtx: AudioContext | null = null;
  private ringOscillator: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: any = null;
  private settings: SoundSettings = {
    incomingCall: true,
    messageAlert: true,
    notificationChime: true,
    volume: 80,
  };
  private isLoaded = false;

  public async init(): Promise<void> {
    if (this.isLoaded || typeof window === "undefined") return;
    try {
      this.settings = await connectApi.getSoundSettings();
      this.isLoaded = true;
    } catch {
      this.isLoaded = true;
    }
  }

  public updateSettings(newSettings: SoundSettings): void {
    this.settings = newSettings;
  }

  public getSettings(): SoundSettings {
    return this.settings;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private getEffectiveGain(): number {
    return (this.settings.volume / 100) * 0.2; // keep audio safe and pleasant
  }

  /**
   * Pleasant two-tone chime for incoming chat messages.
   */
  public playMessageChime(): void {
    if (!this.settings.messageAlert) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5

      const targetGain = this.getEffectiveGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio autoplay policy caught
    }
  }

  /**
   * Continuous repeating ring for incoming calls.
   */
  public startIncomingCallRing(): void {
    if (!this.settings.incomingCall) return;
    this.stopIncomingCallRing();

    const ringCycle = () => {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(480, now + 0.2); // B4

        const targetGain = this.getEffectiveGain() * 1.5;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(targetGain, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      } catch {
        // Safe catch
      }
    };

    ringCycle();
    this.ringInterval = setInterval(ringCycle, 2000);
  }

  public stopIncomingCallRing(): void {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (this.ringOscillator) {
      try {
        this.ringOscillator.stop();
        this.ringOscillator.disconnect();
      } catch {}
      this.ringOscillator = null;
    }
  }

  /**
   * Short affirmative blip when WebRTC connects.
   */
  public playCallConnectedTone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

      const targetGain = this.getEffectiveGain();
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch {}
  }

  /**
   * Soft descending tone when a call terminates.
   */
  public playCallEndedTone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.1);

      const targetGain = this.getEffectiveGain();
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }
}

export const soundService = new SoundService();
