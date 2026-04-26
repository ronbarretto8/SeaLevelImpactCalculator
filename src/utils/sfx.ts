class SFX {
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Add a global listener to resume AudioContext on mobile
      const resume = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
      };
      window.addEventListener("click", resume);
      window.addEventListener("touchstart", resume);
    }
  }

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Subtle high-frequency tick for sliders
  playTick() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      // Increased for mobile audibility
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.002); 
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {
      // Ignore if audio context fails
    }
  }

  // Subtle low-frequency thud for buttons
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Higher frequency (800Hz) and slightly longer for mobile speakers
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      // Increased gain for mobile audibility (0.4)
      gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.005); 
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // Ignore
    }
  }
}

export const sfx = new SFX();
