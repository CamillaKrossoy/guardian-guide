import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { ModeBar } from "./ModeBar";
import { Eye, Route, Gauge, Check, X, CheckCircle2 } from "lucide-react";

type Decision = "pending" | "executing" | "stayed";

interface PlanStep {
  t: string;
  title: string;
  detail: string;
  /** seconds from execution start when this step becomes active */
  at: number;
}

const OVERTAKE_PLAN: PlanStep[] = [
  { t: "now",  title: "Hold lane",           detail: "Maintain 82 km/h",       at: 0 },
  { t: "+2s",  title: "Mirror & signal",     detail: "Indicate left",          at: 2 },
  { t: "+4s",  title: "Ease into left lane", detail: "2.4° steering, gentle",  at: 4 },
  { t: "+9s",  title: "Pass vehicle",        detail: "Maintain +15 km/h",      at: 9 },
  { t: "+12s", title: "Return right",        detail: "When safe gap",          at: 12 },
];

const STAY_PLAN: PlanStep[] = [
  { t: "now",  title: "Holding lane",         detail: "Maintain 82 km/h",      at: 0 },
  { t: "+3s",  title: "Soften pace",          detail: "Match vehicle ahead",   at: 3 },
  { t: "+6s",  title: "Adaptive cruise",      detail: "Gap 2.4 s, steady",     at: 6 },
  { t: "+30s", title: "Re-evaluate overtake", detail: "If a clean gap opens",  at: 30 },
];

export function LogicPhase() {
  const [decision, setDecision] = useState<Decision>("pending");
  const [elapsed, setElapsed] = useState(0);

  const plan = decision === "stayed" ? STAY_PLAN : OVERTAKE_PLAN;

  // active step derived from elapsed time
  const activeIndex = useMemo(() => {
    if (decision === "pending") return 0;
    let idx = 0;
    for (let i = 0; i < plan.length; i++) {
      if (elapsed >= plan[i].at) idx = i;
    }
    return idx;
  }, [elapsed, plan, decision]);

  // tick clock while executing or stay-acknowledged
  useEffect(() => {
    if (decision === "pending") return;
    setElapsed(0);
    const start = performance.now();
    const id = setInterval(() => {
      setElapsed((performance.now() - start) / 1000);
    }, 100);
    const stop = decision === "executing" ? 14000 : 8000;
    const end = setTimeout(() => clearInterval(id), stop);
    return () => {
      clearInterval(id);
      clearTimeout(end);
    };
  }, [decision]);

  // road mode reflects the live maneuver
  const roadMode: "auto" | "overtake" =
    decision === "executing" && activeIndex >= 1 && activeIndex <= 3 ? "overtake" : "auto";
  const showPath = decision === "executing" && activeIndex >= 1 && activeIndex <= 3;

  const choose = (next: "executing" | "stayed") => {
    setDecision(next);
    setElapsed(0);
  };
  const reset = () => {
    setDecision("pending");
    setElapsed(0);
  };

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
          <RoadView mode={roadMode} showOtherCar showOvertakePath={showPath} />

          {/* Intention overlay */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="absolute inset-x-6 top-6 md:inset-x-10 md:top-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${decision}-${activeIndex}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
                className="glass-soft inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs text-foreground/85"
              >
                <span
                  className={`size-1.5 rounded-full animate-breathe ${
                    decision === "stayed" ? "bg-trust" : decision === "executing" ? "bg-aurora" : "bg-caution"
                  }`}
                />
                <span className="font-mono tracking-widest uppercase text-[10px]">
                  {decision === "pending"
                    ? "Planning · 2.4 s"
                    : decision === "stayed"
                    ? "Holding · steady"
                    : `Maneuver · ${plan[activeIndex].t}`}
                </span>
                <span>
                  {decision === "pending"
                    ? "Lane change to overtake slower vehicle"
                    : decision === "stayed"
                    ? "Decision acknowledged — staying behind"
                    : plan[activeIndex].title}
                </span>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Decision / progress card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10"
          >
            <div className="glass rounded-2xl p-6">
              <AnimatePresence mode="wait">
                {decision === "pending" && (
                  <motion.div
                    key="ask"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                  >
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
                          onClick={() => choose("stayed")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-4 py-2.5 text-xs hover:bg-foreground/[0.04]"
                        >
                          <X className="size-3.5" /> Stay
                        </button>
                        <button
                          onClick={() => choose("executing")}
                          className="inline-flex items-center gap-1.5 rounded-full bg-aurora px-4 py-2.5 text-xs font-medium text-primary-foreground hover:brightness-110"
                        >
                          <Check className="size-3.5" /> Overtake
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {decision !== "pending" && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.7, 0.2, 1] }}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div
                          className={`text-[11px] uppercase tracking-[0.22em] ${
                            decision === "stayed" ? "text-trust" : "text-aurora"
                          }`}
                        >
                          {decision === "stayed" ? "Holding lane" : "Executing maneuver"}
                        </div>
                        <p className="mt-2 font-display text-[20px] leading-snug">
                          {plan[activeIndex].title}
                          <span className="ml-2 text-foreground/60 text-[14px] font-sans">
                            — {plan[activeIndex].detail}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={reset}
                        className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Progress rail across the steps */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span>{decision === "stayed" ? "Adaptive cruise engaged" : "Maneuver progress"}</span>
                        <span className="font-mono">
                          {activeIndex + 1} / {plan.length}
                        </span>
                      </div>
                      <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                        <motion.div
                          key={decision}
                          initial={{ width: "0%" }}
                          animate={{ width: `${((activeIndex + 1) / plan.length) * 100}%` }}
                          transition={{ duration: 0.9, ease: [0.22, 0.7, 0.2, 1] }}
                          className={`h-full ${
                            decision === "stayed"
                              ? "bg-gradient-to-r from-trust to-aurora"
                              : "bg-gradient-to-r from-aurora to-caution"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        {/* Right — intention timeline */}
        <aside className="glass flex flex-col gap-5 rounded-3xl p-6 lg:col-span-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-aurora">What I plan</div>
            <div className="mt-2 font-display text-2xl">
              {decision === "stayed" ? "Next 30 s" : "Next 12 s"}
            </div>
          </div>

          <ol className="relative space-y-5 border-l border-border/60 pl-5">
            {plan.map((step, i) => (
              <Step
                key={`${decision}-${i}`}
                t={step.t}
                title={step.title}
                detail={step.detail}
                state={
                  decision === "pending"
                    ? i === 0 ? "active" : "upcoming"
                    : i < activeIndex
                    ? "done"
                    : i === activeIndex
                    ? "active"
                    : "upcoming"
                }
              />
            ))}
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

function Step({
  t, title, detail, state,
}: { t: string; title: string; detail: string; state: "done" | "active" | "upcoming" }) {
  return (
    <motion.li
      layout
      animate={{ opacity: state === "upcoming" ? 0.45 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
      className="relative"
    >
      <span
        className={`absolute -left-[26px] top-1.5 grid size-2.5 place-items-center rounded-full transition-all ${
          state === "active"
            ? "bg-aurora shadow-[0_0_14px_oklch(0.78_0.12_195)] scale-125"
            : state === "done"
            ? "bg-trust shadow-[0_0_10px_oklch(0.82_0.10_165)]"
            : "bg-foreground/20"
        }`}
      >
        {state === "done" && <CheckCircle2 className="size-2.5 text-background" strokeWidth={3} />}
      </span>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t}</div>
      <div
        className={`mt-0.5 text-sm transition-colors ${
          state === "active" ? "text-foreground" : state === "done" ? "text-foreground/60 line-through decoration-foreground/20" : "text-foreground/70"
        }`}
      >
        {title}
      </div>
      <div className="text-xs text-muted-foreground">{detail}</div>
    </motion.li>
  );
}
