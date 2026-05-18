import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { Hand, Eye, CloudRain, AlertCircle } from "lucide-react";

export function TakeoverPhase() {
  const [seconds, setSeconds] = useState(10);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Escalation tier — calm, focused, urgent
  const tier = seconds > 7 ? 0 : seconds > 3 ? 1 : 2;
  const tone = ["oklch(0.82 0.10 165)", "oklch(0.86 0.13 75)", "oklch(0.78 0.16 35)"][tier];
  const headline = [
    "I'd like your help shortly.",
    "Please rest your hands on the wheel.",
    "Take control now — together.",
  ][tier];
  const tierLabel = ["Soft handoff", "Preparing handoff", "Hand-on now"][tier];

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Phase 04 · Cooperative handoff" rightStatus="Asking for assistance" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* Left — situation */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: tone }}>Why I'm asking</div>
            <div className="mt-2 font-display text-2xl">Situation</div>
          </div>

          <div className="space-y-3">
            <SituationRow icon={CloudRain}   label="Heavy rain ahead"   detail="Visibility 60 m" />
            <SituationRow icon={AlertCircle} label="Lane markings faded" detail="Reduced confidence" />
            <SituationRow icon={Eye}         label="Construction zone"  detail="Unmapped change"  />
          </div>

          <div className="mt-2 rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">My confidence</div>
            <div className="mt-3 flex items-end gap-1.5">
              {[80, 72, 60, 48, 40, 32, 26].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                  className="w-3 rounded-sm"
                  style={{
                    background: i < 3 ? "oklch(0.82 0.10 165)" : i < 5 ? "oklch(0.86 0.13 75)" : "oklch(0.78 0.16 35)",
                  }}
                />
              ))}
            </div>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">Trend · falling</div>
          </div>
        </aside>

        {/* Center — road + steering guide */}
        <main className="relative rounded-3xl lg:col-span-6">
          <RoadView mode="uncertain" showOtherCar uncertaintyHalo />

          {/* Ambient escalation halo */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            animate={{ boxShadow: `inset 0 0 ${80 + tier * 60}px ${20 + tier * 20}px ${tone.replace(")", ` / ${0.18 + tier * 0.12})`)}` }}
            transition={{ duration: 1.2 }}
          />

          {/* Top calm message */}
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
          >
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: tone }}>
                <span className="size-2 rounded-full animate-breathe" style={{ background: tone, boxShadow: `0 0 14px ${tone}` }} />
                {tierLabel}
              </div>
              <p className="mt-3 font-display text-3xl leading-tight md:text-4xl">{headline}</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                I'm slowing slightly to give us both more room. You'll feel the wheel offer
                resistance — we'll take it together.
              </p>
            </div>
          </motion.div>

          {/* Steering wheel guide bottom */}
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4 md:bottom-10">
            <div className="glass-soft flex items-center gap-3 rounded-full px-4 py-2 text-xs">
              <Eye className="size-3.5 text-aurora" />
              <span className="text-foreground/85">Eyes forward · attention recovering</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-aurora"
                    style={{ opacity: tier >= i ? 1 : 0.25 }}
                  />
                ))}
              </span>
            </div>

            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                className="absolute -inset-10 rounded-full blur-2xl"
                style={{ background: tone.replace(")", " / 0.35)") }}
              />
              <SteeringGuide tone={tone} />
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Hand className="size-3.5" style={{ color: tone }} />
              Place both hands gently · grip will register softly
            </div>
          </div>
        </main>

        {/* Right — countdown */}
        <aside className="glass flex flex-col items-center gap-6 rounded-3xl p-6 lg:col-span-3">
          <div className="w-full">
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Time together</div>
            <div className="mt-2 font-display text-2xl">Gentle countdown</div>
          </div>

          <CountdownRing seconds={seconds} max={10} tone={tone} />

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            I'll keep driving until you're ready. If you need a moment, just say
            <span className="text-foreground"> "give me a second"</span>.
          </p>

          <div className="mt-auto flex w-full flex-col gap-2">
            <button
              onClick={() => { setSeconds(10); setPaused(false); }}
              className="rounded-full border border-border/60 py-2.5 text-xs text-foreground/85 hover:bg-foreground/[0.04]"
            >
              Restart sequence
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="rounded-full bg-foreground py-2.5 text-xs font-medium text-background hover:bg-foreground/90"
            >
              {paused ? "Resume" : "Pause demo"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SituationRow({ icon: Icon, label, detail }: { icon: React.ComponentType<{ className?: string }>; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-foreground/[0.02] p-3">
      <Icon className="mt-0.5 size-4 text-caution" />
      <div className="flex-1">
        <div className="text-sm text-foreground">{label}</div>
        <div className="font-mono text-[11px] text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

function SteeringGuide({ tone }: { tone: string }) {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="relative">
      <defs>
        <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tone} stopOpacity="0.5" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="90" r="80" fill="url(#wheelGlow)" />
      <circle cx="90" cy="90" r="62" fill="none" stroke="oklch(0.95 0.02 220 / 0.18)" strokeWidth="2" />
      <circle cx="90" cy="90" r="62" fill="none" stroke={tone} strokeWidth="2.5" strokeDasharray="14 12" />
      <circle cx="90" cy="90" r="14" fill="oklch(0.22 0.02 240)" stroke={tone} strokeWidth="1.5" />
      {/* Spokes */}
      <line x1="90" y1="90" x2="90" y2="28" stroke={tone} strokeWidth="2.5" />
      <line x1="90" y1="90" x2="34" y2="118" stroke={tone} strokeWidth="2.5" />
      <line x1="90" y1="90" x2="146" y2="118" stroke={tone} strokeWidth="2.5" />
      {/* Hand placement zones */}
      <circle cx="34" cy="118" r="6" fill={tone} opacity="0.85">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="146" cy="118" r="6" fill={tone} opacity="0.85">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  );
}

function CountdownRing({ seconds, max, tone }: { seconds: number; max: number; tone: string }) {
  const pct = seconds / max;
  const r = 78;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="oklch(0.95 0.02 220 / 0.10)" strokeWidth="6" />
        <motion.circle
          cx="100" cy="100" r={r}
          fill="none"
          stroke={tone}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 12px ${tone})` }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-6xl tabular-nums">{seconds}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">seconds</div>
      </div>
    </div>
  );
}
