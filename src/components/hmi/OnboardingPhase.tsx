import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChromeShell } from "./ChromeShell";
import { ArrowRight } from "lucide-react";

interface OnboardingPhaseProps {
  onComplete?: (name: string) => void;
}

type Step = "name" | "comfort" | "voice" | "ready";

const comfortOptions = [
  { id: "quiet",    label: "A quiet presence",   sub: "Speak only when it matters." },
  { id: "company",  label: "Gentle company",     sub: "A few words now and then." },
  { id: "guidance", label: "A reassuring guide", sub: "Talk me through what's happening." },
];

const voiceOptions = [
  { id: "soft",    label: "Soft and low" },
  { id: "warm",    label: "Warm and steady" },
  { id: "minimal", label: "Almost silent" },
];

export function OnboardingPhase({ onComplete }: OnboardingPhaseProps) {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [comfort, setComfort] = useState<string | null>(null);
  const [voice, setVoice] = useState<string | null>(null);

  const skipToReady = () => setStep("ready");

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="A first quiet conversation" driverName={name || "Friend"} rightStatus="Listening" />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-8 pb-10">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span>Only this once</span>
          {step !== "ready" && (
            <button onClick={skipToReady} className="hover:text-foreground">
              Skip — we'll learn as we go
            </button>
          )}
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto size-[420px] rounded-full aurora-ring blur-3xl opacity-60" />

          <AnimatePresence mode="wait">
            {step === "name" && (
              <Slide key="name">
                <Murmur>I'd love to know what to call you.</Murmur>
                <h1 className="mt-6 font-display text-5xl font-light tracking-tight leading-tight text-foreground md:text-[64px]">
                  What name feels like
                  <br />
                  <span className="text-aurora">home?</span>
                </h1>

                <div className="mt-12 max-w-md">
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Type a name, or a nickname"
                    className="w-full border-0 border-b border-border/60 bg-transparent pb-3 font-display text-3xl text-foreground placeholder:text-muted-foreground/50 focus:border-aurora focus:outline-none"
                  />
                  <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    You can change this any time.
                  </div>
                </div>

                <Next onClick={() => setStep("comfort")} disabled={!name.trim()} label="Lovely to meet you" />
              </Slide>
            )}

            {step === "comfort" && (
              <Slide key="comfort">
                <Murmur>Long drives are easier with the right kind of company.</Murmur>
                <h1 className="mt-6 font-display text-5xl leading-tight text-foreground md:text-6xl">
                  When we're on the road, would you like…
                </h1>

                <div className="mt-12 grid gap-3">
                  {comfortOptions.map((o) => {
                    const active = comfort === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setComfort(o.id)}
                        className={`group flex items-center justify-between rounded-2xl border px-6 py-5 text-left transition-all
                          ${active
                            ? "border-aurora/50 bg-foreground/[0.04]"
                            : "border-border/50 hover:bg-foreground/[0.02]"}`}
                      >
                        <div>
                          <div className="font-display text-2xl text-foreground">{o.label}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{o.sub}</div>
                        </div>
                        <span className={`size-2 rounded-full ${active ? "bg-aurora shadow-[0_0_12px_oklch(0.78_0.12_195)]" : "bg-foreground/15"}`} />
                      </button>
                    );
                  })}
                </div>

                <Next onClick={() => setStep("voice")} disabled={!comfort} label="Continue" />
              </Slide>
            )}

            {step === "voice" && (
              <Slide key="voice">
                <Murmur>And the way I speak to you…</Murmur>
                <h1 className="mt-6 font-display text-5xl font-light tracking-tight leading-tight text-foreground md:text-6xl">
                  Which voice feels <span className="text-aurora">restful?</span>
                </h1>

                <div className="mt-12 flex flex-wrap gap-3">
                  {voiceOptions.map((v) => {
                    const active = voice === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVoice(v.id)}
                        className={`rounded-full border px-6 py-3 font-display text-lg transition-all
                          ${active
                            ? "border-aurora/60 bg-aurora/10 text-foreground"
                            : "border-border/50 text-foreground/80 hover:bg-foreground/[0.03]"}`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-10 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Everything else, I'll learn quietly — from how you drive, how you pause,
                  how you settle in. Nothing you need to teach.
                </p>

                <Next onClick={() => setStep("ready")} disabled={!voice} label="That's enough for now" />
              </Slide>
            )}

            {step === "ready" && (
              <Slide key="ready">
                <Murmur>Thank you{name ? `, ${name}` : ""}.</Murmur>
                <h1 className="mt-6 font-display text-5xl font-light tracking-tight leading-tight text-foreground md:text-[68px]">
                  We'll get to know each other
                  <br />
                  <span className="text-aurora">one drive at a time.</span>
                </h1>
                <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  Step in whenever you're ready.
                </p>

                <Next onClick={() => onComplete?.(name || "Friend")} label="Take me to the car" />
              </Slide>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative flex h-full flex-col pt-16"
    >
      {children}
    </motion.div>
  );
}

function Murmur({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.32em] text-aurora/80">{children}</div>
  );
}

function Next({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <div className="mt-auto pt-16">
      <button
        onClick={onClick}
        disabled={disabled}
        className="group inline-flex items-center gap-3 rounded-full bg-foreground/95 px-7 py-3.5 text-sm font-medium text-background transition-all hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        {label}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
