import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { Leaf, Brain, Wind, Check, X, Sparkles } from "lucide-react";

export function NudgePhase() {
  const [decision, setDecision] = useState<"pending" | "accepted" | "declined">("pending");

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Phase 02 · Driving manually" rightStatus="Observing" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* Left: live driving telemetry */}
        <aside className="glass flex flex-col gap-6 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Speed</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-6xl tabular-nums">82</span>
              <span className="text-sm text-muted-foreground">km/h</span>
            </div>
          </div>

          <Telemetry label="Stress level"   value={28} hint="Calm" color="oklch(0.82 0.10 165)" />
          <Telemetry label="Driving confidence" value={74} hint="Steady" color="oklch(0.78 0.12 195)" />
          <Telemetry label="Trip progress" value={46} hint="34 km to home" color="oklch(0.86 0.10 75)" />

          <div className="mt-auto rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Learning</div>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80">
              I noticed you brake earlier than usual today. I'll keep a calmer pace.
            </p>
          </div>
        </aside>

        {/* Center: road */}
        <main className="relative rounded-3xl lg:col-span-6">
          <RoadView mode="manual" showOtherCar />
          {/* Floating nudge card */}
          <AnimatePresence>
            {decision === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
              >
                <div className="glass relative overflow-hidden rounded-2xl p-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-aurora/80 to-trust/80" />
                  <div className="flex items-start gap-4">
                    <div className="relative grid size-11 shrink-0 place-items-center rounded-full bg-aurora/15">
                      <Sparkles className="size-5 text-aurora" />
                      <span className="absolute inset-0 rounded-full animate-pulse-ring bg-aurora/20" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-aurora">A gentle suggestion</div>
                      <p className="mt-2 font-display text-[22px] leading-snug text-foreground">
                        Traffic is flowing predictably. I could take over the next 18 km to
                        help you arrive a little more rested.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Chip icon={Brain}  label="Lower mental load" />
                        <Chip icon={Wind}   label="Smoother lane changes" />
                        <Chip icon={Leaf}   label="−12% energy use" />
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono uppercase tracking-widest">Confidence</span>
                          <ConfidenceMeter level={0.86} />
                          <span className="font-mono">86%</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDecision("declined")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2 text-xs text-foreground/80 hover:bg-foreground/[0.04]"
                          >
                            <X className="size-3.5" /> Not now
                          </button>
                          <button
                            onClick={() => setDecision("accepted")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-aurora px-4 py-2 text-xs font-medium text-primary-foreground shadow-[0_0_24px_oklch(0.78_0.12_195_/_0.45)] hover:brightness-110"
                          >
                            <Check className="size-3.5" /> Yes, take over
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {decision !== "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
              >
                <div className="glass-soft rounded-2xl px-5 py-3 text-sm text-foreground/85">
                  {decision === "accepted"
                    ? "Engaging autonomy gently — you'll feel the wheel ease in 3 seconds."
                    : "Understood. I'll keep watch and ask again when conditions improve."}
                  <button onClick={() => setDecision("pending")} className="ml-3 text-xs text-aurora hover:underline">Reset</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right: trust journey */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Our relationship</div>
            <div className="mt-2 font-display text-2xl">Building together</div>
          </div>

          <div className="space-y-4">
            {[
              { k: "Trips together",   v: "142" },
              { k: "Hours learned",    v: "318h" },
              { k: "Autonomy accepted",v: "62%"  },
            ].map((s) => (
              <div key={s.k} className="flex items-baseline justify-between border-b border-border/40 pb-3">
                <span className="text-xs text-muted-foreground">{s.k}</span>
                <span className="font-mono text-lg tabular-nums text-foreground">{s.v}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-aurora">Trust arc</div>
            <svg viewBox="0 0 200 60" className="mt-3 w-full">
              <path
                d="M 5 50 C 40 48, 70 42, 100 30 S 170 12, 195 8"
                fill="none"
                stroke="oklch(0.78 0.12 195)"
                strokeWidth="2"
              />
              <circle cx="195" cy="8" r="3.5" fill="oklch(0.92 0.06 195)" />
            </svg>
            <p className="mt-3 text-xs leading-relaxed text-foreground/75">
              Every accepted suggestion, every declined one — both teach me.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Telemetry({ label, value, hint, color }: { label: string; value: number; hint: string; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <span className="text-xs text-foreground/80">{hint}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}

function Chip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-foreground/[0.03] px-3 py-1 text-[11px] text-foreground/85">
      <Icon className="size-3 text-trust" /> {label}
    </div>
  );
}

function ConfidenceMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => {
        const on = i < Math.round(level * 10);
        return (
          <span
            key={i}
            className={`h-3 w-0.5 rounded-full transition ${on ? "bg-aurora" : "bg-foreground/15"}`}
            style={on ? { boxShadow: "0 0 6px oklch(0.78 0.12 195)" } : undefined}
          />
        );
      })}
    </div>
  );
}
