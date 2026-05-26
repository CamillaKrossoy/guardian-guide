import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhaseNav, type Phase } from "@/components/hmi/PhaseNav";
import { ArrivalPhase, type DriverProfile } from "@/components/hmi/ArrivalPhase";
import { WelcomePhase } from "@/components/hmi/WelcomePhase";
import { OnboardingPhase } from "@/components/hmi/OnboardingPhase";
import { NudgePhase } from "@/components/hmi/NudgePhase";
import { LogicPhase } from "@/components/hmi/LogicPhase";
import { TakeoverPhase } from "@/components/hmi/TakeoverPhase";

export const Route = createFileRoute("/")({
  component: Index,
});

type Stage = "arrival" | "onboarding" | "cabin";

function Index() {
  const [stage, setStage] = useState<Stage>("arrival");
  const [phase, setPhase] = useState<Phase>("welcome");
  const [driver, setDriver] = useState<DriverProfile | null>(null);

  const key =
    stage === "arrival" ? "arrival" :
    stage === "onboarding" ? "onboarding" :
    `cabin-${phase}`;

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
              key={key}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{
                opacity: { duration: 1.0, ease: [0.22, 0.7, 0.2, 1] },
                y: { duration: 1.0, ease: [0.22, 0.7, 0.2, 1] },
                filter: { duration: 0.9 },
              }}
              className="min-h-[calc(100vh-120px)]"
            >
              {stage === "arrival" && (
                <ArrivalPhase
                  onSelect={(p) => {
                    setDriver(p);
                    setPhase("welcome");
                    setStage("cabin");
                  }}
                  onNewDriver={() => setStage("onboarding")}
                />
              )}

              {stage === "onboarding" && (
                <OnboardingPhase
                  onComplete={(name) => {
                    setDriver({
                      id: "new",
                      name,
                      initials: name.charAt(0).toUpperCase() || "•",
                      accent: "oklch(0.78 0.12 195)",
                      lastSeen: "Just now",
                      drives: 0,
                      signature: "Still learning the shape of your drives.",
                      lastRoute: "—",
                    });
                    setPhase("welcome");
                    setStage("cabin");
                  }}
                />
              )}

              {stage === "cabin" && (
                <>
                  {phase === "welcome"  && (
                    <WelcomePhase
                      driverName={driver?.name}
                      driverAccent={driver?.accent}
                      driverDrives={driver?.drives}
                      onSwitchDriver={() => setStage("arrival")}
                      onStartAutonomy={() => setPhase("logic")}
                    />
                  )}
                  {phase === "nudge"    && <NudgePhase onHome={() => setPhase("welcome")} />}
                  {phase === "logic"    && <LogicPhase onHome={() => setPhase("welcome")} />}
                  {phase === "takeover" && <TakeoverPhase onHome={() => setPhase("welcome")} />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {stage === "cabin" && phase !== "welcome" && <PhaseNav active={phase} onChange={setPhase} />}
      </div>
    </div>
  );
}
