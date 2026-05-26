import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { ModeBar, type DriveMode } from "./ModeBar";
import {
  Hand,
  Eye,
  CloudRain,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Radar,
  Navigation,
  CheckCircle2,
  RotateCcw,
  Pause,
  Play,
} from "lucide-react";

type Stage = "auto" | "degrading" | "handoff" | "manual";

const AUTO_DURATION = 5200;       // stable autonomy
const DEGRADING_DURATION = 3400;  // sensor uncertainty rising
const COUNTDOWN_START = 10;       // handoff seconds
const COUNTDOWN_TICK = 1000;

export function TakeoverPhase({ onHome }: { onHome?: () => void } = {}) {
  const [stage, setStage] = useState<Stage>("auto");
  const [seconds, setSeconds] = useState(COUNTDOWN_START);
  const [paused, setPaused] = useState(false);

  // Stage progression
  useEffect(() => {
    if (paused) return;
    if (stage === "auto") {
      const t = setTimeout(() => setStage("degrading"), AUTO_DURATION);
      return () => clearTimeout(t);
    }
    if (stage === "degrading") {
      const t = setTimeout(() => setStage("handoff"), DEGRADING_DURATION);
      return () => clearTimeout(t);
    }
    if (stage === "handoff") {
      if (seconds <= 0) {
        const t = setTimeout(() => setStage("manual"), 900);
        return () => clearTimeout(t);
      }
      const id = setInterval(
        () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
        COUNTDOWN_TICK
      );
      return () => clearInterval(id);
    }
  }, [stage, seconds, paused]);

  const restart = () => {
    setSeconds(COUNTDOWN_START);
    setPaused(false);
    setStage("auto");
  };

  // Derived
  const tier = stage === "handoff" ? (seconds > 7 ? 0 : seconds > 3 ? 1 : 2) : 0;
  const handoffTone = ["oklch(0.82 0.10 165)", "oklch(0.86 0.13 75)", "oklch(0.78 0.16 35)"][tier];

  const chromeLabel: Record<Stage, string> = {
    auto:      "Phase 04 · Autonomous cruise",
    degrading: "Phase 04 · Sensor uncertainty",
    handoff:   "Phase 04 · Cooperative handoff",
    manual:    "Phase 04 · Control restored",
  };
  const chromeStatus: Record<Stage, string> = {
    auto:      "Aurora driving",
    degrading: "Reviewing conditions",
    handoff:   "Asking for assistance",
    manual:    "You're driving",
  };

  const mode: DriveMode =
    stage === "auto" ? "autonomous"
    : stage === "degrading" ? "autonomous"
    : stage === "handoff" ? "takeover"
    : "manual";

  const confidence =
    stage === "auto" ? 0.96
    : stage === "degrading" ? 0.62
    : stage === "handoff" ? Math.max(0.18, seconds / 10)
    : 0.88;

  const modeHint =
    stage === "auto" ? "L3 · Eyes-on"
    : stage === "degrading" ? "Confidence falling"
    : stage === "handoff" ? ["Soft handoff", "Preparing handoff", "Hand-on now"][tier]
    : "Driver-assist active";

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel={chromeLabel[stage]} rightStatus={chromeStatus[stage]} onHome={onHome} />

      <ModeBar mode={mode} confidence={confidence} hint={modeHint} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <AnimatePresence mode="wait">
            {stage === "auto" && <LeftAuto key="left-auto" />}
            {stage === "degrading" && <LeftDegrading key="left-deg" />}
            {stage === "handoff" && <LeftHandoff key="left-ho" tone={handoffTone} />}
            {stage === "manual" && <LeftManual key="left-man" />}
          </AnimatePresence>
        </aside>

        {/* CENTER — road */}
        <main className="relative rounded-3xl lg:col-span-6">
          <RoadView
            mode={
              stage === "auto" ? "auto"
              : stage === "degrading" ? "auto"
              : stage === "handoff" ? "uncertain"
              : "manual"
            }
            showOtherCar
            uncertaintyHalo={stage === "degrading" || stage === "handoff"}
          />

          {/* Stage-specific halo */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            animate={{
              boxShadow:
                stage === "handoff"
                  ? `inset 0 0 ${80 + tier * 60}px ${20 + tier * 20}px ${handoffTone.replace(")", ` / ${0.18 + tier * 0.12})`)}`
                  : stage === "degrading"
                  ? "inset 0 0 90px 18px oklch(0.86 0.13 75 / 0.18)"
                  : stage === "manual"
                  ? "inset 0 0 70px 14px oklch(0.78 0.12 195 / 0.18)"
                  : "inset 0 0 70px 14px oklch(0.82 0.10 165 / 0.16)",
            }}
            transition={{ duration: 1.4 }}
          />

          {/* Top message — switches per stage */}
          <AnimatePresence mode="wait">
            {stage === "auto" && (
              <CenterMessage
                key="msg-auto"
                tone="oklch(0.82 0.10 165)"
                kicker="Autonomous · L3"
                title="I have the road."
                body="Cruising at 96 km/h. Eyes-on, hands relaxed."
                icon={ShieldCheck}
              />
            )}
            {stage === "degrading" && (
              <CenterMessage
                key="msg-deg"
                tone="oklch(0.86 0.13 75)"
                kicker="Reviewing conditions"
                title="Closer look ahead."
                body="Rain intensifying. Easing speed — may ask for help."
                icon={Radar}
              />
            )}
            {stage === "handoff" && (
              <CenterMessage
                key="msg-ho"
                tone={handoffTone}
                kicker={["Soft handoff", "Preparing handoff", "Hand-on now"][tier]}
                title={[
                  "I'd like your help shortly.",
                  "Rest your hands on the wheel.",
                  "Take control — together.",
                ][tier]}
                body="Slowing slightly. The wheel will offer resistance."
                icon={Hand}
              />
            )}
            {stage === "manual" && (
              <CenterMessage
                key="msg-man"
                tone="oklch(0.78 0.12 195)"
                kicker="Control restored"
                title="You have the wheel."
                body="Lane-keep and collision support quietly active."
                icon={CheckCircle2}
              />
            )}
          </AnimatePresence>

          {/* Bottom UI: differs by stage */}
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4 md:bottom-10">
            <AnimatePresence mode="wait">
              {stage === "auto" && (
                <motion.div
                  key="bot-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.7 }}
                  className="glass-soft flex items-center gap-3 rounded-full px-4 py-2 text-xs"
                >
                  <Sparkles className="size-3.5 text-aurora-warm" />
                  <span className="text-foreground/85">Holding lane · 38 km to next decision</span>
                </motion.div>
              )}

              {stage === "degrading" && (
                <motion.div
                  key="bot-deg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.7 }}
                  className="glass-soft flex items-center gap-3 rounded-full px-4 py-2 text-xs"
                >
                  <Radar className="size-3.5 text-caution" />
                  <span className="text-foreground/85">Easing speed · raising your awareness</span>
                </motion.div>
              )}

              {stage === "handoff" && (
                <motion.div
                  key="bot-ho"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-4"
                >
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
                      style={{ background: handoffTone.replace(")", " / 0.35)") }}
                    />
                    <SteeringGuide tone={handoffTone} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Hand className="size-3.5" style={{ color: handoffTone }} />
                    Place both hands gently · grip will register softly
                  </div>
                </motion.div>
              )}

              {stage === "manual" && (
                <motion.div
                  key="bot-man"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="glass-soft flex items-center gap-3 rounded-full px-4 py-2 text-xs">
                    <CheckCircle2 className="size-3.5 text-aurora" />
                    <span className="text-foreground/85">Hands registered · driving you forward</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Navigation className="size-3.5 text-aurora" /> Lane-keep · collision shield · adaptive cruise on standby
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT COLUMN — sequence panel */}
        <aside className="glass flex flex-col gap-6 rounded-3xl p-6 lg:col-span-3">
          <div className="w-full">
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Transition journey</div>
            <div className="mt-2 font-display text-2xl">
              {stage === "auto" && "Stable autonomy"}
              {stage === "degrading" && "Conditions shifting"}
              {stage === "handoff" && "Gentle countdown"}
              {stage === "manual" && "You're driving"}
            </div>
          </div>

          {/* Sequence rail */}
          <SequenceRail stage={stage} />

          {/* Stage-specific center */}
          <div className="flex flex-1 items-center justify-center">
            <AnimatePresence mode="wait">
              {stage === "auto" && (
                <motion.div
                  key="r-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <div className="font-display text-5xl tabular-nums text-aurora-warm">96<span className="ml-1 text-xl text-muted-foreground">km/h</span></div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Holding cruise · 4.2 km clear</div>
                </motion.div>
              )}
              {stage === "degrading" && (
                <motion.div
                  key="r-deg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Confidence trend</div>
                  <div className="mt-3 flex items-end gap-1.5">
                    {[92, 86, 78, 70, 64, 58, 50].map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${v}%` }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className="w-3 rounded-sm"
                        style={{ background: i < 3 ? "oklch(0.82 0.10 165)" : "oklch(0.86 0.13 75)" }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground">Trend · falling gently</div>
                </motion.div>
              )}
              {stage === "handoff" && (
                <CountdownRing seconds={seconds} max={COUNTDOWN_START} tone={handoffTone} />
              )}
              {stage === "manual" && (
                <motion.div
                  key="r-man"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="mx-auto grid size-20 place-items-center rounded-full border border-aurora/40 bg-aurora/10"
                  >
                    <CheckCircle2 className="size-9 text-aurora" />
                  </motion.div>
                  <div className="mt-4 font-display text-xl">Handoff complete</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">You have control</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {stage === "auto" && "Sit back. I'm watching the road."}
            {stage === "degrading" && "Preparing you gently."}
            {stage === "handoff" && (
              <>Say <span className="text-foreground">"give me a second"</span> if you need a moment.</>
            )}
            {stage === "manual" && "Drive comfortably. I'll re-offer when conditions clear."}
          </p>

          <div className="mt-auto flex w-full flex-col gap-2">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-full border border-border/60 py-2.5 text-xs text-foreground/85 hover:bg-foreground/[0.04]"
            >
              <RotateCcw className="size-3.5" /> Replay sequence
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="flex items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-xs font-medium text-background hover:bg-foreground/90"
            >
              {paused ? <><Play className="size-3.5" /> Resume</> : <><Pause className="size-3.5" /> Pause demo</>}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Left column panels ---------- */

function LeftAuto() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-5"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-aurora-warm">What I see</div>
        <div className="mt-2 font-display text-2xl">Open highway</div>
      </div>
      <div className="space-y-3">
        <SituationRow icon={ShieldCheck} label="Lane integrity strong" detail="High contrast markings" tone="aurora" />
        <SituationRow icon={Navigation} label="Trajectory locked" detail="Holding centre · 96 km/h" tone="aurora" />
        <SituationRow icon={Radar} label="Traffic predictable" detail="3 vehicles · steady flow" tone="aurora" />
      </div>
      <div className="mt-2 rounded-2xl border border-border/50 bg-foreground/[0.02] p-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">My confidence</div>
        <div className="mt-3 flex items-end gap-1.5">
          {[88, 92, 94, 95, 96, 96, 96].map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${v}%` }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="w-3 rounded-sm"
              style={{ background: "oklch(0.82 0.10 165)" }}
            />
          ))}
        </div>
        <div className="mt-2 font-mono text-[10px] text-muted-foreground">Trend · stable</div>
      </div>
    </motion.div>
  );
}

function LeftDegrading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-5"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-caution">What's changing</div>
        <div className="mt-2 font-display text-2xl">Conditions shifting</div>
      </div>
      <div className="space-y-3">
        <SituationRow icon={CloudRain} label="Rain intensifying" detail="Visibility narrowing" tone="caution" />
        <SituationRow icon={AlertCircle} label="Lane markings fading" detail="Contrast dropping" tone="caution" />
        <SituationRow icon={Eye} label="Watching closely" detail="Recalibrating perception" tone="caution" />
      </div>
      <p className="rounded-2xl border border-border/50 bg-foreground/[0.02] p-4 text-xs leading-relaxed text-muted-foreground">
        Easing speed and widening following distance. I'll let you know in a moment whether I need your help.
      </p>
    </motion.div>
  );
}

function LeftHandoff({ tone }: { tone: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-5"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: tone }}>Why I'm asking</div>
        <div className="mt-2 font-display text-2xl">Situation</div>
      </div>

      <div className="space-y-3">
        <SituationRow icon={CloudRain}   label="Heavy rain ahead"   detail="Visibility 60 m" tone="caution" />
        <SituationRow icon={AlertCircle} label="Lane markings faded" detail="Reduced confidence" tone="caution" />
        <SituationRow icon={Eye}         label="Construction zone"  detail="Unmapped change" tone="caution" />
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
    </motion.div>
  );
}

function LeftManual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.9 }}
      className="flex flex-col gap-5"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-aurora">You're driving</div>
        <div className="mt-2 font-display text-2xl">Quiet support</div>
      </div>
      <div className="space-y-3">
        <SituationRow icon={CheckCircle2} label="Hands registered" detail="Grip confirmed both sides" tone="aurora" />
        <SituationRow icon={Navigation} label="Lane-keep assisting" detail="Soft corrections only" tone="aurora" />
        <SituationRow icon={ShieldCheck} label="Collision shield" detail="Forward + side · armed" tone="aurora" />
      </div>
      <p className="rounded-2xl border border-border/50 bg-foreground/[0.02] p-4 text-xs leading-relaxed text-muted-foreground">
        I'll stay quietly in the background and re-offer autonomy when conditions improve.
      </p>
    </motion.div>
  );
}

/* ---------- Shared bits ---------- */

function CenterMessage({
  tone, kicker, title, body, icon: Icon,
}: {
  tone: string; kicker: string; title: string; body: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
    >
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: tone }}>
          <span className="size-2 rounded-full animate-breathe" style={{ background: tone, boxShadow: `0 0 14px ${tone}` }} />
          <Icon className="size-3.5" />
          {kicker}
        </div>
        <p className="mt-3 font-display text-3xl leading-tight md:text-4xl">{title}</p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>
      </div>
    </motion.div>
  );
}

function SequenceRail({ stage }: { stage: Stage }) {
  const steps: { key: Stage; label: string }[] = [
    { key: "auto", label: "Autonomous" },
    { key: "degrading", label: "Uncertainty" },
    { key: "handoff", label: "Handoff" },
    { key: "manual", label: "Manual" },
  ];
  const idx = steps.findIndex((s) => s.key === stage);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor:
                i < idx ? "oklch(0.82 0.10 165)"
                : i === idx ? (stage === "handoff" ? "oklch(0.86 0.13 75)" : stage === "manual" ? "oklch(0.78 0.12 195)" : "oklch(0.82 0.10 165)")
                : "oklch(0.95 0.02 220 / 0.12)",
              boxShadow:
                i === idx ? "0 0 10px oklch(0.86 0.10 175 / 0.6)" : "none",
            }}
            transition={{ duration: 0.6 }}
            className="h-1 flex-1 rounded-full"
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {steps.map((s, i) => (
          <span key={s.key} className={i === idx ? "text-foreground/80" : ""}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

function SituationRow({
  icon: Icon, label, detail, tone = "caution",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; detail: string;
  tone?: "caution" | "aurora";
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-foreground/[0.02] p-3">
      <Icon className={`mt-0.5 size-4 ${tone === "aurora" ? "text-aurora" : "text-caution"}`} />
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
      <line x1="90" y1="90" x2="90" y2="28" stroke={tone} strokeWidth="2.5" />
      <line x1="90" y1="90" x2="34" y2="118" stroke={tone} strokeWidth="2.5" />
      <line x1="90" y1="90" x2="146" y2="118" stroke={tone} strokeWidth="2.5" />
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
    <motion.div
      key="ring"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative grid place-items-center"
    >
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
    </motion.div>
  );
}
