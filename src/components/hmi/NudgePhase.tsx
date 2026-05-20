import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import {
  Leaf,
  Brain,
  Wind,
  Check,
  X,
  Sparkles,
  Hand,
  CircleDot,
  Eye,
  Radar,
  ShieldCheck,
  Gauge,
} from "lucide-react";

type Mode = "manual" | "suggesting" | "declined" | "handover" | "autonomous";

const HANDOVER_STEPS = [
  { label: "Confirming intent", hint: "Reading your input" },
  { label: "Extending perception", hint: "640 m horizon" },
  { label: "Easing onto the wheel", hint: "Soft engagement" },
  { label: "I have control", hint: "You can supervise" },
];

export function NudgePhase() {
  const [mode, setMode] = useState<Mode>("suggesting");
  const [handoverStep, setHandoverStep] = useState(0);

  // Drive the handover sequence
  useEffect(() => {
    if (mode !== "handover") return;
    setHandoverStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    HANDOVER_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setHandoverStep(i), i * 900));
    });
    timers.push(setTimeout(() => setMode("autonomous"), HANDOVER_STEPS.length * 900 + 400));
    return () => timers.forEach(clearTimeout);
  }, [mode]);

  // After declining, return to ambient manual after a beat
  useEffect(() => {
    if (mode !== "declined") return;
    const t = setTimeout(() => setMode("manual"), 4200);
    return () => clearTimeout(t);
  }, [mode]);

  const isAuto = mode === "autonomous" || mode === "handover";
  const roadMode = isAuto ? "auto" : "manual";

  const phaseLabel =
    mode === "autonomous"
      ? "Phase 02 · Autonomous assist active"
      : mode === "handover"
      ? "Phase 02 · Handing over control"
      : "Phase 02 · You are driving";

  const rightStatus =
    mode === "autonomous" ? "AURA driving" :
    mode === "handover"   ? "Engaging…" :
    "Observing";

  return (
    <div className="flex h-full flex-col">
      {/* Ambient mode-shift glow over the whole cabin */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        animate={{
          background: isAuto
            ? "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.82 0.10 165 / 0.18), transparent 70%)"
            : "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.78 0.12 195 / 0.08), transparent 70%)",
        }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />

      <ChromeShell phaseLabel={phaseLabel} rightStatus={rightStatus} />

      {/* Driving-mode banner — always present, instantly readable */}
      <ModeBanner mode={mode} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* LEFT: telemetry — adapts to who's driving */}
        <aside className="glass flex flex-col gap-6 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Speed</div>
            <div className="mt-2 flex items-baseline gap-1">
              <motion.span
                key={isAuto ? "auto-spd" : "manual-spd"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-6xl tabular-nums"
              >
                {isAuto ? 78 : 82}
              </motion.span>
              <span className="text-sm text-muted-foreground">km/h</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isAuto ? (
              <motion.div
                key="manual-tel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <Telemetry label="Stress level" value={28} hint="Calm" color="oklch(0.82 0.10 165)" />
                <Telemetry label="Driving confidence" value={74} hint="Steady" color="oklch(0.78 0.12 195)" />
                <Telemetry label="Trip progress" value={46} hint="34 km to home" color="oklch(0.86 0.10 75)" />
              </motion.div>
            ) : (
              <motion.div
                key="auto-tel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <Telemetry label="System confidence" value={92} hint="High" color="oklch(0.82 0.10 165)" />
                <Telemetry label="Perception horizon" value={86} hint="640 m" color="oklch(0.86 0.10 175)" />
                <Telemetry label="Trip progress" value={48} hint="33 km to home" color="oklch(0.86 0.10 75)" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {isAuto ? "Watching for you" : "Learning"}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80">
              {isAuto
                ? "Hands free is fine. Eyes on the road, please — I'll hand back if anything changes."
                : "I noticed you brake earlier than usual today. I'll keep a calmer pace."}
            </p>
          </div>
        </aside>

        {/* CENTER: road */}
        <main className="relative rounded-3xl lg:col-span-6">
          <RoadView mode={roadMode} showOtherCar showOvertakePath={false} />

          {/* Mode-tinted aurora frame to reinforce who's driving */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            animate={{
              boxShadow: isAuto
                ? "inset 0 0 0 1px oklch(0.82 0.10 165 / 0.35), inset 0 0 120px oklch(0.82 0.10 165 / 0.18)"
                : "inset 0 0 0 1px oklch(0.78 0.12 195 / 0.18), inset 0 0 80px oklch(0.78 0.12 195 / 0.08)",
            }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />

          {/* Autonomous perception overlay */}
          <AnimatePresence>
            {mode === "autonomous" && (
              <motion.div
                key="perception"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="pointer-events-none absolute inset-0"
              >
                {/* Sweeping perception arc */}
                <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="perceptionArc" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="oklch(0.82 0.10 165)" stopOpacity="0.0" />
                      <stop offset="100%" stopColor="oklch(0.82 0.10 165)" stopOpacity="0.55" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 200 560 Q 500 260 800 560"
                    fill="none"
                    stroke="url(#perceptionArc)"
                    strokeWidth="1.5"
                    strokeDasharray="2 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx="500" cy="338" r="14"
                    fill="none"
                    stroke="oklch(0.86 0.10 175 / 0.7)"
                    strokeWidth="1"
                    animate={{ r: [14, 28, 14], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                  />
                </svg>

                {/* Corner tags */}
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-aurora-warm/30 bg-background/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-aurora-warm/90 backdrop-blur">
                  <Radar className="size-3" /> 360° perception
                </div>
                <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-aurora-warm/30 bg-background/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-aurora-warm/90 backdrop-blur">
                  <Eye className="size-3" /> Eyes on road suggested
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating suggestion card */}
          <AnimatePresence mode="wait">
            {mode === "suggesting" && (
              <motion.div
                key="suggest"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
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
                        <Chip icon={Brain} label="Lower mental load" />
                        <Chip icon={Wind}  label="Smoother lane changes" />
                        <Chip icon={Leaf}  label="−12% energy use" />
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-mono uppercase tracking-widest">Confidence</span>
                          <ConfidenceMeter level={0.86} />
                          <span className="font-mono">86%</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setMode("declined")}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2 text-xs text-foreground/80 hover:bg-foreground/[0.04]"
                          >
                            <X className="size-3.5" /> Not now
                          </button>
                          <button
                            onClick={() => setMode("handover")}
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

            {mode === "declined" && (
              <motion.div
                key="declined"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
              >
                <div className="glass-soft flex items-center gap-3 rounded-2xl px-5 py-3 text-sm text-foreground/85">
                  <Hand className="size-4 text-trust" />
                  <span>Understood. You're still driving — I'm here if you need me.</span>
                </div>
              </motion.div>
            )}

            {mode === "handover" && (
              <motion.div
                key="handover"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
              >
                <div className="glass relative overflow-hidden rounded-2xl p-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-aurora-warm/80 to-aurora/80" />
                  <div className="flex items-start gap-4">
                    <div className="relative grid size-11 shrink-0 place-items-center rounded-full bg-aurora-warm/15">
                      <CircleDot className="size-5 text-aurora-warm animate-breathe" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-aurora-warm">Easing into control</div>
                      <p className="mt-2 font-display text-[20px] leading-snug text-foreground">
                        Taking the wheel softly. You'll feel it settle in a moment.
                      </p>

                      {/* Progress rail */}
                      <div className="mt-5 h-1 overflow-hidden rounded-full bg-foreground/8">
                        <motion.div
                          key={handoverStep}
                          initial={{ width: `${(handoverStep / HANDOVER_STEPS.length) * 100}%` }}
                          animate={{ width: `${((handoverStep + 1) / HANDOVER_STEPS.length) * 100}%` }}
                          transition={{ duration: 0.85, ease: "easeInOut" }}
                          className="h-full rounded-full"
                          style={{
                            background: "linear-gradient(90deg, oklch(0.78 0.12 195), oklch(0.86 0.10 175))",
                            boxShadow: "0 0 14px oklch(0.82 0.10 175 / 0.6)",
                          }}
                        />
                      </div>

                      <ul className="mt-4 space-y-2">
                        {HANDOVER_STEPS.map((s, i) => {
                          const done = i < handoverStep;
                          const active = i === handoverStep;
                          return (
                            <li key={s.label} className="flex items-center gap-3 text-xs">
                              <span
                                className={`grid size-4 place-items-center rounded-full border ${
                                  done
                                    ? "border-aurora bg-aurora/20 text-aurora"
                                    : active
                                    ? "border-aurora-warm bg-aurora-warm/20 text-aurora-warm"
                                    : "border-border/50 text-muted-foreground"
                                }`}
                              >
                                {done ? <Check className="size-2.5" /> : <span className={`size-1.5 rounded-full ${active ? "bg-aurora-warm animate-breathe" : "bg-foreground/30"}`} />}
                              </span>
                              <span className={active ? "text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"}>
                                {s.label}
                              </span>
                              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                                {s.hint}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {mode === "autonomous" && (
              <motion.div
                key="auto-banner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-8"
              >
                <div className="glass flex items-center gap-4 rounded-2xl px-5 py-4">
                  <div className="relative grid size-10 place-items-center rounded-full bg-aurora-warm/15">
                    <ShieldCheck className="size-5 text-aurora-warm" />
                    <span className="absolute inset-0 rounded-full animate-pulse-ring bg-aurora-warm/20" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-aurora-warm">I have control</div>
                    <div className="font-display text-base text-foreground">
                      Autonomous assist active · 18 km planned
                    </div>
                  </div>
                  <button
                    onClick={() => setMode("manual")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2 text-xs text-foreground/85 hover:bg-foreground/[0.04]"
                  >
                    <Hand className="size-3.5" /> Resume control
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT: relationship + adaptive status */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Our relationship</div>
            <div className="mt-2 font-display text-2xl">Building together</div>
          </div>

          {/* Steering / responsibility card — the clearest "who drives" signal */}
          <ResponsibilityCard mode={mode} />

          <div className="space-y-4">
            {[
              { k: "Trips together",    v: "142" },
              { k: "Hours learned",     v: "318h" },
              { k: "Autonomy accepted", v: isAuto ? "63%" : "62%" },
            ].map((s) => (
              <div key={s.k} className="flex items-baseline justify-between border-b border-border/40 pb-3">
                <span className="text-xs text-muted-foreground">{s.k}</span>
                <span className="font-mono text-lg tabular-nums text-foreground">{s.v}</span>
              </div>
            ))}
          </div>

          {mode === "suggesting" && (
            <button
              onClick={() => setMode("manual")}
              className="text-[11px] text-muted-foreground hover:text-foreground/80"
            >
              Dismiss suggestion
            </button>
          )}
          {mode === "manual" && (
            <button
              onClick={() => setMode("suggesting")}
              className="text-[11px] text-aurora hover:underline"
            >
              Replay suggestion
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function ModeBanner({ mode }: { mode: Mode }) {
  const isAuto = mode === "autonomous" || mode === "handover";
  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <motion.div
        layout
        className="mb-4 flex items-center justify-between rounded-2xl border px-5 py-3 text-[11px] uppercase tracking-[0.22em]"
        animate={{
          borderColor: isAuto
            ? "oklch(0.82 0.10 165 / 0.35)"
            : "oklch(0.78 0.12 195 / 0.18)",
          backgroundColor: isAuto
            ? "oklch(0.82 0.10 165 / 0.06)"
            : "oklch(0.20 0.02 240 / 0.25)",
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="size-2 rounded-full"
            animate={{
              backgroundColor: isAuto ? "oklch(0.86 0.12 170)" : "oklch(0.86 0.10 200)",
              boxShadow: isAuto
                ? "0 0 14px oklch(0.86 0.12 170 / 0.8)"
                : "0 0 8px oklch(0.86 0.10 200 / 0.5)",
            }}
            transition={{ duration: 1 }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5 }}
              className={isAuto ? "text-aurora-warm" : "text-foreground/85"}
            >
              {mode === "autonomous" && "AURA is driving · supervise gently"}
              {mode === "handover"   && "Handing over to AURA…"}
              {mode === "suggesting" && "You are driving · suggestion available"}
              {mode === "declined"   && "You are driving · I'm on standby"}
              {mode === "manual"     && "You are driving · I'm observing"}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gauge className="size-3.5" />
          <span className="font-mono">{isAuto ? "L3 · Eyes-on" : "L2 · Hands-on"}</span>
        </div>
      </motion.div>
    </div>
  );
}

function ResponsibilityCard({ mode }: { mode: Mode }) {
  const isAuto = mode === "autonomous" || mode === "handover";
  return (
    <motion.div
      layout
      animate={{
        borderColor: isAuto ? "oklch(0.82 0.10 165 / 0.4)" : "oklch(0.78 0.12 195 / 0.25)",
        backgroundColor: isAuto ? "oklch(0.82 0.10 165 / 0.06)" : "oklch(0.20 0.02 240 / 0.3)",
      }}
      transition={{ duration: 1.2 }}
      className="rounded-2xl border p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Who is driving
        </span>
        <span className={`text-[10px] uppercase tracking-[0.2em] ${isAuto ? "text-aurora-warm" : "text-aurora"}`}>
          {isAuto ? "Vehicle" : "Driver"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {/* Driver side */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{
              opacity: isAuto ? 0.35 : 1,
              scale: isAuto ? 0.95 : 1,
            }}
            transition={{ duration: 0.8 }}
            className="grid size-10 place-items-center rounded-full border border-border/60 bg-foreground/[0.04]"
          >
            <Hand className="size-4 text-foreground/85" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">You</span>
        </div>

        {/* Flow line */}
        <div className="relative mx-3 h-px flex-1 bg-border/40">
          <motion.span
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full"
            animate={{
              left: isAuto ? "100%" : "0%",
              backgroundColor: isAuto ? "oklch(0.86 0.12 170)" : "oklch(0.86 0.10 200)",
              boxShadow: isAuto
                ? "0 0 10px oklch(0.86 0.12 170 / 0.8)"
                : "0 0 8px oklch(0.86 0.10 200 / 0.6)",
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        </div>

        {/* Vehicle side */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{
              opacity: isAuto ? 1 : 0.35,
              scale: isAuto ? 1 : 0.95,
              boxShadow: isAuto
                ? "0 0 24px oklch(0.82 0.10 165 / 0.45)"
                : "0 0 0px oklch(0.82 0.10 165 / 0)",
            }}
            transition={{ duration: 0.8 }}
            className="grid size-10 place-items-center rounded-full border border-aurora-warm/40 bg-aurora-warm/10"
          >
            <ShieldCheck className="size-4 text-aurora-warm" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AURA</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-foreground/70">
        {mode === "autonomous" && "I'm driving. You can rest your hands — please keep your eyes available."}
        {mode === "handover"   && "Transferring responsibility. Stay loosely engaged for a moment."}
        {mode === "suggesting" && "You're in full control. I'm offering — never insisting."}
        {mode === "declined"   && "Staying on standby. Adaptive support remains active."}
        {mode === "manual"     && "You're in full control. I'm quietly assisting in the background."}
      </p>
    </motion.div>
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
