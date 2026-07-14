// A tiny Web Audio tone generator for dot/dash feedback. Nothing is
// downloaded — every sound is synthesized on the spot, which keeps the app
// light on data and battery. Standard Morse timing: a dash is three units
// long, the gap between symbols in the same letter is one unit, and the
// gap between letters is three units.

const UNIT_MS = 90;
const TONE_HZ = 600;

export class MorseAudio {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private activeSources: OscillatorNode[] = [];

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  /** Call from a click/keydown handler to unlock audio on iOS/Safari. */
  unlock() {
    this.ensureContext();
  }

  private tone(durationMs: number, startAt: number): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.enabled) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = TONE_HZ;

    const start = ctx.currentTime + startAt / 1000;
    const dur = durationMs / 1000;
    const attack = Math.min(0.008, dur / 4);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.22, start + attack);
    gain.gain.setValueAtTime(0.22, start + dur - attack);
    gain.gain.linearRampToValueAtTime(0, start + dur);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    this.activeSources.push(osc);
    osc.onended = () => {
      this.activeSources = this.activeSources.filter((o) => o !== osc);
    };
  }

  playDit() {
    this.tone(UNIT_MS, 0);
  }

  playDah() {
    this.tone(UNIT_MS * 3, 0);
  }

  /** Plays a full ".-.." style pattern and resolves once it's finished. */
  playPattern(pattern: string): Promise<void> {
    let cursor = 0;
    for (const symbol of pattern) {
      const dur = symbol === "-" ? UNIT_MS * 3 : UNIT_MS;
      this.tone(dur, cursor);
      cursor += dur + UNIT_MS;
    }
    const totalMs = Math.max(0, cursor - UNIT_MS);
    return new Promise((resolve) => setTimeout(resolve, totalMs));
  }

  stop() {
    this.activeSources.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    });
    this.activeSources = [];
  }
}

let sharedInstance: MorseAudio | null = null;

export function getMorseAudio(): MorseAudio {
  if (!sharedInstance) sharedInstance = new MorseAudio();
  return sharedInstance;
}
