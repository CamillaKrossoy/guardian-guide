import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { ArrowRight, Sparkles, Shield, Heart } from "lucide-react";

const profiles = [
  { name: "Sofia",  meta: "Returning · 142 trips", hue: "oklch(0.82 0.10 165)" },
  { name: "Henrik", meta: "Returning · 38 trips",  hue: "oklch(0.86 0.10 75)"  },
  { name: "Guest",  meta: "New profile",            hue: "oklch(0.78 0.12 195)" },
];

const questions = [
  { q: "When driving, you usually prefer…", a: ["A calm pace", "Steady flow", "Spirited drives"] },
  { q: "On the motorway, you feel…",        a: ["Relaxed", "Focused", "A little tense"] },
  { q: "You'd like the car to…",            a: ["Suggest gently", "Take initiative", "Stay quiet"] },
];

export function OnboardingPhase() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>("Sofia");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Phase 01 · Welcoming" driverName={selected ?? "Guest"} rightStatus="Profile sync" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-8 pb-6 md:grid-cols-12">
        {/* Left: welcoming pane */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="glass relative overflow-hidden rounded-3xl p-10 md:col-span-5"
        >
          <div className="absolute -top-24 -right-24 size-72 rounded-full aurora-ring blur-2xl" />
          <div className="absolute inset-x-10 top-10 h-px hairline" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="size-3.5 text-aurora" /> Good evening
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
              Welcome back,
              <br />
              <span className="text-aurora italic">{selected ?? "friend"}</span>.
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              I've been quietly learning the way you like to drive. We can pick up
              where we left off — or take a moment to tune things together.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: Heart,   label: "Adapts gradually" },
                { icon: Shield,  label: "You stay in control" },
                { icon: Sparkles,label: "Always optional" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="glass-soft rounded-2xl p-4">
                  <Icon className="size-4 text-aurora" />
                  <div className="mt-3 text-xs leading-snug text-foreground/80">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-aurora/70"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step + 1) / 4) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="font-mono">{step + 1} / 4</span>
            </div>
          </div>
        </motion.section>

        {/* Right: conversational steps */}
        <section className="glass relative overflow-hidden rounded-3xl p-8 md:col-span-7">
          <div className="pointer-events-none absolute -inset-px opacity-60">
            <div className="absolute inset-x-0 top-0 h-px hairline" />
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="profiles"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col"
              >
                <Eyebrow>Who's driving tonight?</Eyebrow>
                <h2 className="mt-2 font-display text-3xl">Choose your profile</h2>

                <div className="mt-8 grid gap-3">
                  {profiles.map((p) => {
                    const active = selected === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setSelected(p.name)}
                        className={`group relative flex items-center justify-between rounded-2xl border px-5 py-5 text-left transition-all
                          ${active
                            ? "border-aurora/50 bg-foreground/[0.04]"
                            : "border-border/60 bg-foreground/[0.015] hover:bg-foreground/[0.03]"
                          }`}
                      >
                        <div className="flex items-center gap-5">
                          <span
                            className="relative grid size-12 place-items-center rounded-full"
                            style={{ background: `${p.hue.replace(")", " / 0.18)")}`, boxShadow: `inset 0 0 0 1px ${p.hue.replace(")", " / 0.35)")}` }}
                          >
                            <span className="font-display text-lg" style={{ color: p.hue }}>{p.name[0]}</span>
                            {active && <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: `${p.hue.replace(")", " / 0.18)")}` }} />}
                          </span>
                          <div>
                            <div className="text-base font-medium text-foreground">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.meta}</div>
                          </div>
                        </div>
                        <ArrowRight className={`size-4 transition ${active ? "text-aurora translate-x-0" : "text-muted-foreground -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </button>
                    );
                  })}
                </div>

                <Footer onNext={() => setStep(1)} nextLabel="Continue" />
              </motion.div>
            )}

            {step >= 1 && step <= 3 && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="flex h-full flex-col"
              >
                <Eyebrow>A gentle question · {step} of 3</Eyebrow>
                <h2 className="mt-2 font-display text-3xl leading-tight">{questions[step - 1].q}</h2>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  Your answer shapes how I suggest, when I speak, and how I drive. You can change anything later.
                </p>

                <div className="mt-8 grid gap-3">
                  {questions[step - 1].a.map((ans) => {
                    const active = answers[step] === ans;
                    return (
                      <button
                        key={ans}
                        onClick={() => setAnswers({ ...answers, [step]: ans })}
                        className={`relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all
                          ${active
                            ? "border-aurora/50 bg-foreground/[0.05]"
                            : "border-border/60 bg-foreground/[0.015] hover:bg-foreground/[0.03]"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] text-foreground">{ans}</span>
                          <span className={`size-2.5 rounded-full ${active ? "bg-aurora shadow-[0_0_12px_oklch(0.78_0.12_195)]" : "bg-foreground/15"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Footer
                  onBack={() => setStep(step - 1)}
                  onNext={() => setStep(step + 1 > 3 ? 3 : step + 1)}
                  nextLabel={step === 3 ? "Begin driving" : "Continue"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] uppercase tracking-[0.28em] text-aurora/80">{children}</div>;
}

function Footer({ onNext, onBack, nextLabel }: { onNext: () => void; onBack?: () => void; nextLabel: string }) {
  return (
    <div className="mt-auto flex items-center justify-between pt-10">
      <div className="text-xs text-muted-foreground">
        {onBack ? <button onClick={onBack} className="hover:text-foreground">← Back</button> : <span className="opacity-60">Adaptive learning · enabled</span>}
      </div>
      <button
        onClick={onNext}
        className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:bg-foreground/90"
      >
        {nextLabel} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
