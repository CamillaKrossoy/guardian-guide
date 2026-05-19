import { motion } from "motion/react";
import { ChromeShell } from "./ChromeShell";
import { RoadView } from "./RoadView";
import { Moon, MapPin, Music2, Thermometer } from "lucide-react";

interface WelcomePhaseProps {
  onFirstTime?: () => void;
}

export function WelcomePhase({ onFirstTime }: WelcomePhaseProps) {
  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Continuing where we left off" rightStatus="At rest" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-8 pb-6 lg:grid-cols-12">
        {/* Left — soft greeting */}
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative flex flex-col justify-between rounded-3xl p-10 lg:col-span-5"
        >
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full aurora-ring blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
              <Moon className="size-3.5 text-aurora" /> Tuesday evening
            </div>
            <h1 className="mt-8 font-display text-[64px] leading-[0.95] text-foreground md:text-[78px]">
              Welcome back,
              <br />
              <span className="text-aurora italic">Sofia</span>.
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              The cabin is warm and your seat is the way you like it.
              Take your time — I'll be ready whenever you are.
            </p>
          </div>

          <div className="relative mt-12 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Not you?{" "}
            <button
              onClick={onFirstTime}
              className="ml-1 text-foreground/80 underline-offset-4 hover:text-aurora hover:underline"
            >
              First time in this car
            </button>
          </div>
        </motion.section>

        {/* Right — continuity column */}
        <section className="flex flex-col gap-4 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="glass relative overflow-hidden rounded-3xl"
          >
            <div className="relative h-[280px]">
              <RoadView mode="manual" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-aurora">Last drive · yesterday</div>
                <div className="mt-2 font-display text-2xl text-foreground">
                  Home from Frognerseteren — calm, no interruptions.
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Recall
              delay={0.3}
              eyebrow="Continue"
              title="Route home"
              detail="34 km · 28 min · light traffic on E18"
              icon={MapPin}
            />
            <Recall
              delay={0.4}
              eyebrow="Resume"
              title="Ólafur Arnalds"
              detail="Where you paused, at 02:14"
              icon={Music2}
            />
            <Recall
              delay={0.5}
              eyebrow="Comfort"
              title="Cabin · 20.5°"
              detail="Pre-warmed for the cold tonight"
              icon={Thermometer}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="glass-soft rounded-3xl p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="relative grid size-10 place-items-center rounded-full bg-aurora/15">
                  <span className="absolute inset-0 rounded-full animate-pulse-ring bg-aurora/15" />
                  <span className="size-1.5 rounded-full bg-aurora shadow-[0_0_12px_oklch(0.78_0.12_195)]" />
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Quietly noted</div>
                  <p className="mt-1 max-w-md text-[15px] leading-snug text-foreground/90">
                    You usually prefer a slower start on Tuesdays. I'll ease into the drive.
                  </p>
                </div>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                142 drives together
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function Recall({
  eyebrow,
  title,
  detail,
  icon: Icon,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="glass-soft rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-aurora/80">
        <Icon className="size-3.5" /> {eyebrow}
      </div>
      <div className="mt-3 font-display text-xl leading-tight text-foreground">{title}</div>
      <div className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{detail}</div>
    </motion.div>
  );
}
