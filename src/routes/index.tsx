import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhaseNav, type Phase } from "@/components/hmi/PhaseNav";
import { WelcomePhase } from "@/components/hmi/WelcomePhase";
import { OnboardingPhase } from "@/components/hmi/OnboardingPhase";
import { NudgePhase } from "@/components/hmi/NudgePhase";
import { LogicPhase } from "@/components/hmi/LogicPhase";
import { TakeoverPhase } from "@/components/hmi/TakeoverPhase";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [firstTime, setFirstTime] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Ambient cinematic glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-[640px] rounded-full bg-aurora/10 blur-[140px]" />
        <div className="absolute -right-40 bottom-0 size-[520px] rounded-full bg-aurora-warm/10 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 size-[420px] -translate-x-1/2 rounded-full bg-trust/8 blur-[120px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={firstTime ? "onboarding" : phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="min-h-[calc(100vh-120px)]"
            >
              {firstTime ? (
                <OnboardingPhase
                  onComplete={() => {
                    setFirstTime(false);
                    setPhase("welcome");
                  }}
                />
              ) : (
                <>
                  {phase === "welcome"  && <WelcomePhase onFirstTime={() => setFirstTime(true)} />}
                  {phase === "nudge"    && <NudgePhase />}
                  {phase === "logic"    && <LogicPhase />}
                  {phase === "takeover" && <TakeoverPhase />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!firstTime && <PhaseNav active={phase} onChange={setPhase} />}
      </div>
    </div>
  );
}
