import { useEffect, useRef } from "react";

const CLICK_TARGET_SELECTOR = "[data-click-sound]";

export const ClickSoundManager = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    const initContext = () => {
      if (audioContextRef.current) return audioContextRef.current;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      return ctx;
    };

    // Build a small "cartoon pop" buffer
    const buildClickBuffer = (ctx: AudioContext) => {
      if (clickBufferRef.current) return clickBufferRef.current;

      const duration = 0.12; // slightly longer than before, still tiny
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(duration * sampleRate);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      // We'll make a soft blip: quick attack, quick decay, slight pitch rise
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;

        // envelope: fast attack -> smooth decay
        const attack = 0.008;
        const env =
          t < attack
            ? t / attack
            : Math.exp(-(t - attack) * 20); // quick decay

        // base freq for the blip
        const baseFreq = 320;
        const endFreq = 460;
        const freq = baseFreq + (endFreq - baseFreq) * (t / duration);

        const tone = Math.sin(2 * Math.PI * freq * t);
        data[i] = tone * env;
      }

      clickBufferRef.current = buffer;
      return buffer;
    };

    const playClick = async () => {
      const now = performance.now();
      // prevent spam (multiple pointerdowns in <70ms)
      if (now - lastPlayTimeRef.current < 70) return;
      lastPlayTimeRef.current = now;

      const ctx = initContext();
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => undefined);
      }

      const buffer = buildClickBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // small random detune so it feels organic
      const detuneSemitones = (Math.random() * 2 - 1) * 40; // ±40 cents
      source.detune.value = detuneSemitones;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2500;
      filter.Q.value = 0.8;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.11; // softer than before

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start();
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest(CLICK_TARGET_SELECTOR)) return;
      void playClick();
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      audioContextRef.current?.close().catch(() => undefined);
      audioContextRef.current = null;
      clickBufferRef.current = null;
    };
  }, []);

  return null;
};

export default ClickSoundManager;
