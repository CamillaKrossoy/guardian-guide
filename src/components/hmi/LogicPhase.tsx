import { motion } from "motion/react";
import { useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { Eye, Route, Gauge, Check, X } from "lucide-react";

export function LogicPhase() {
  const [decision, setDecision] = useState<"pending" | "approved" | "declined">("pending");

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Phase 03 · Autonomous · Level 3" rightStatus="In control" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* Left — awareness */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-aurora">What I see</div>
            <div className="mt-2 font-display text-2xl">Surroundings</div>
          </div>

          <AwarenessItem icon={Eye}   label="Vehicle ahead" detail="68 km/h · 42 m" tone="aurora" />
          <AwarenessItem icon={Route} label="Left lane"     detail="Clear · 220 m"  tone="trust"  />
          <AwarenessItem icon={Gauge} label="Speed limit"   detail="100 km/h"       tone="muted"  />

          <div className="mt-2 rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Sensor health</div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {["LIDAR", "CAM", "RADAR", "GPS"].map((s) => (
                <div key={s} className="rounded-lg bg-foreground/[0.04] p-2 text-center">
                  <div className="size-1.5 mx-auto rounded-full bg-trust shadow-[0_0_8px_oklch(0.82_0.10_165)]" />
                  <div className="mt-1.5 font-mono text-[9px] text-muted-foreground">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center — cinematic plan */}
        <main className="relative rounded-3xl lg:col-span-6">
          <RoadView mode="overtake" showOtherCar showOvertakePath />

          {/* Intention overlay */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
          >
            <div className="glass-soft inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs text-foreground/85">
              <span className="size-1.5 rounded-full bg-caution animate-breathe" />
              <span className="font-mono tracking-widest uppercase text-[10px]">Planning · 2.4 s</span>
              <span>Lane change to overtake slower vehicle</span>
            </div>
          </motion.div>

          {/* Permission card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-caution">Asking your permission</div>
                  <p className="mt-2 font-display text-[22px] leading-snug">
                    Would you like me to overtake the vehicle ahead? The left lane is clear and the maneuver feels safe.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right text-[11px] text-muted-foreground">
                    <div className="font-mono uppercase tracking-widest">Confidence</div>
                    <div className="mt-1 font-display text-xl text-aurora">94%</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDecision("declined")}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2.5 text-xs hover:bg-foreground/[0.04] ${decision === "declined" ? "border-foreground/40 bg-foreground/[0.06]" : ""}`}
                    >
                      <X className="size-3.5" /> Stay
                    </button>
                    <button
                      onClick={() => setDecision("approved")}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-aurora px-4 py-2.5 text-xs font-medium text-primary-foreground hover:brightness-110 ${decision === "approved" ? "shadow-[0_0_28px_oklch(0.78_0.12_195_/_0.6)]" : ""}`}
                    >
                      <Check className="size-3.5" /> Overtake
                    </button>
                  </div>
                </div>
              </div>

              {/* Decision timer */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span>If silent, I will hold position</span>
                  <span className="font-mono">8s</span>
                </div>
                <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-aurora to-caution"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Right — intention timeline */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-aurora">What I plan</div>
            <div className="mt-2 font-display text-2xl">Next 12 s</div>
          </div>

          <ol className="relative space-y-5 border-l border-border/60 pl-5">
            <Step t="now"  title="Hold lane"          detail="Maintain 82 km/h" active />
            <Step t="+2s"  title="Mirror & signal"    detail="Indicate left" />
            <Step t="+4s"  title="Ease into left lane" detail="2.4° steering, gentle" />
            <Step t="+9s"  title="Pass vehicle"        detail="Maintain +15 km/h" />
            <Step t="+12s" title="Return right"        detail="When safe gap" />
          </ol>

          <div className="mt-auto rounded-2xl border border-border/50 bg-foreground/[0.02] p-4 text-[11px] text-muted-foreground">
            You can interrupt anytime — touch the wheel or say <span className="text-foreground">"hold on"</span>.
          </div>
        </aside>
      </div>
    </div>
  );
}

function AwarenessItem({
  icon: Icon, label, detail, tone,
}: { icon: React.ComponentType<{ className?: string }>; label: string; detail: string; tone: "aurora" | "trust" | "muted" }) {
  const toneClass = { aurora: "text-aurora", trust: "text-trust", muted: "text-muted-foreground" }[tone];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-foreground/[0.02] p-3">
      <Icon className={`size-4 ${toneClass}`} />
      <div className="flex-1">
        <div className="text-sm text-foreground">{label}</div>
        <div className="font-mono text-[11px] text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

function Step({ t, title, detail, active }: { t: string; title: string; detail: string; active?: boolean }) {
  return (
    <li className="relative">
      <span
        className={`absolute -left-[26px] top-1.5 size-2.5 rounded-full ${active ? "bg-aurora shadow-[0_0_12px_oklch(0.78_0.12_195)]" : "bg-foreground/20"}`}
      />
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t}</div>
      <div className={`mt-0.5 text-sm ${active ? "text-foreground" : "text-foreground/85"}`}>{title}</div>
      <div className="text-xs text-muted-foreground">{detail}</div>
    </li>
  );
}
