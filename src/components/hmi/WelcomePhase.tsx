import { motion } from "motion/react";
import { ChromeShell } from "./ChromeShell";
import {
  MapPin,
  Music2,
  Thermometer,
  BatteryCharging,
  Wind,
  Phone,
  Sparkles,
  ArrowRight,
  Navigation,
  Play,
  Plus,
  Minus,
  Moon,
} from "lucide-react";

interface WelcomePhaseProps {
  driverName?: string;
  driverAccent?: string;
  driverDrives?: number;
  onSwitchDriver?: () => void;
  onStartAutonomy?: () => void;
}

export function WelcomePhase({
  driverName = "Sofia",
  driverAccent = "oklch(0.82 0.10 200)",
  driverDrives = 142,
  onSwitchDriver,
  onStartAutonomy,
}: WelcomePhaseProps) {
  const isNew = driverDrives === 0;

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Home" driverName={driverName} rightStatus="Parked · Ready" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 px-8 pb-6 lg:grid-cols-12">
        {/* LEFT — Greeting + autonomy CTA */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative flex flex-col justify-between gap-8 lg:col-span-4"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full aurora-ring blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <Moon className="size-3" style={{ color: driverAccent }} /> Tuesday · 21:14
            </div>
            <h1 className="mt-6 font-display text-[56px] font-light leading-[1.02] tracking-tight text-foreground md:text-[64px]">
              {isNew ? "Hello," : "Welcome back,"}
              <br />
              <span style={{ color: driverAccent }}>{driverName}.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
              {isNew
                ? "The cabin is yours. Step in when you're ready."
                : "Cabin warmed. Seat set. Ready when you are."}
            </p>
          </div>

          {/* Autonomy CTA */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            onClick={onStartAutonomy}
            className="group relative overflow-hidden rounded-3xl border border-aurora/30 bg-gradient-to-br from-aurora/10 via-trust/5 to-transparent p-6 text-left transition-all hover:border-aurora/60 hover:shadow-[0_30px_80px_-40px_oklch(0.78_0.12_195_/_0.6)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-aurora/20 blur-3xl transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-aurora">
                  <Sparkles className="size-3" /> Autonomy ready
                </div>
                <div className="mt-3 font-display text-2xl text-foreground">
                  Begin autonomous drive
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">
                  Route home · 34 km · 28 min
                </div>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-aurora text-primary-foreground shadow-[0_0_24px_oklch(0.78_0.12_195_/_0.45)] transition-transform group-hover:translate-x-0.5">
                <Play className="size-4 fill-current" />
              </span>
            </div>
          </motion.button>

          <div className="relative text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Not you?{" "}
            <button
              onClick={onSwitchDriver}
              className="ml-1 text-foreground/80 underline-offset-4 hover:text-aurora hover:underline"
            >
              Switch driver
            </button>
          </div>
        </motion.section>

        {/* RIGHT — Dashboard grid */}
        <section className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-6 lg:grid-rows-6">
          {/* Navigation — large */}
          <Tile
            delay={0.1}
            className="col-span-2 row-span-3 lg:col-span-4 lg:row-span-3"
          >
            <div className="relative h-full overflow-hidden rounded-3xl">
              <MapPreview accent={driverAccent} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
              <div className="absolute inset-x-6 top-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-aurora">
                  <Navigation className="size-3" /> Navigation
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  E18 · light
                </div>
              </div>
              <div className="absolute inset-x-6 bottom-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Suggested</div>
                <div className="mt-1 font-display text-2xl text-foreground">Home</div>
                <div className="mt-1 flex items-center gap-3 text-[12px] text-foreground/70">
                  <span>34 km</span>
                  <span className="size-1 rounded-full bg-foreground/30" />
                  <span>28 min</span>
                  <span className="size-1 rounded-full bg-foreground/30" />
                  <span className="text-trust">Arrive 21:46</span>
                </div>
              </div>
            </div>
          </Tile>

          {/* Range / Battery */}
          <Tile delay={0.15} className="col-span-1 row-span-2 lg:col-span-2 lg:row-span-2">
            <div className="flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="flex items-center gap-1.5"><BatteryCharging className="size-3 text-trust" /> Range</span>
                <span>78%</span>
              </div>
              <div>
                <div className="font-display text-4xl tabular-nums text-foreground">412<span className="ml-1 text-base text-muted-foreground">km</span></div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                    className="h-full rounded-full bg-gradient-to-r from-trust to-aurora"
                    style={{ boxShadow: "0 0 10px oklch(0.82 0.10 165 / 0.5)" }}
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] text-muted-foreground">
                  +120 km charging at home
                </div>
              </div>
            </div>
          </Tile>

          {/* Climate */}
          <Tile delay={0.2} className="col-span-1 row-span-2 lg:col-span-2 lg:row-span-2">
            <div className="flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Thermometer className="size-3 text-aurora-warm" /> Cabin</span>
                <span>Auto</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="font-display text-4xl tabular-nums text-foreground">20.5°</div>
                <div className="flex flex-col gap-1.5">
                  <button className="grid size-7 place-items-center rounded-full border border-border/50 text-foreground/70 hover:border-aurora/40 hover:text-aurora">
                    <Plus className="size-3.5" />
                  </button>
                  <button className="grid size-7 place-items-center rounded-full border border-border/50 text-foreground/70 hover:border-aurora/40 hover:text-aurora">
                    <Minus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Tile>

          {/* Media */}
          <Tile delay={0.25} className="col-span-2 row-span-2 lg:col-span-4 lg:row-span-2">
            <div className="flex h-full items-center gap-5 p-5">
              <div
                className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.30 0.05 240), oklch(0.20 0.04 220))",
                }}
              >
                <Music2 className="size-7 text-aurora" />
                <span className="absolute inset-0 rounded-2xl ring-1 ring-aurora/20" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Paused</div>
                <div className="mt-1 truncate font-display text-xl text-foreground">Ólafur Arnalds</div>
                <div className="mt-0.5 truncate text-[12px] text-muted-foreground">re:member · 02:14</div>
                <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full w-[34%] rounded-full bg-aurora/70" />
                </div>
              </div>
              <button className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-background transition hover:bg-foreground/90">
                <Play className="size-4 translate-x-0.5 fill-current" />
              </button>
            </div>
          </Tile>

          {/* Quick chips */}
          <Tile delay={0.3} className="col-span-2 row-span-1 lg:col-span-6 lg:row-span-1">
            <div className="flex h-full items-center gap-2 overflow-x-auto p-3">
              <Chip icon={Wind} label="Ambient · soft" />
              <Chip icon={Sparkles} label="Seat memory · 02" />
              <Chip icon={Phone} label="Hands-free · ready" />
              <Chip icon={MapPin} label="Favourites" />
              <div className="ml-auto flex items-center gap-2 pr-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-trust animate-breathe" />
                {isNew ? "First drive" : `${driverDrives} drives together`}
              </div>
            </div>
          </Tile>
        </section>
      </div>
    </div>
  );
}

function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-soft overflow-hidden rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Chip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.02] px-4 py-2 text-[12px] text-foreground/80 transition hover:border-aurora/40 hover:text-foreground">
      <Icon className="size-3.5 text-aurora/80 transition group-hover:text-aurora" /> {label}
      <ArrowRight className="size-3 opacity-0 transition group-hover:opacity-60" />
    </button>
  );
}

/* Cinematic abstract map preview — calm Scandinavian topography */
function MapPreview({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.22 0.025 240)" />
          <stop offset="100%" stopColor="oklch(0.16 0.02 240)" />
        </linearGradient>
        <linearGradient id="mapRoute" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="50%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#mapSky)" />
      {/* Contour curves */}
      <g fill="none" stroke="oklch(0.55 0.04 210 / 0.10)" strokeWidth="1">
        <path d="M -20 320 C 120 280, 280 360, 460 280 S 640 240, 720 260" />
        <path d="M -20 260 C 140 220, 300 300, 480 220 S 640 180, 720 200" />
        <path d="M -20 200 C 160 160, 320 240, 500 160 S 640 120, 720 140" />
        <path d="M -20 140 C 180 100, 340 180, 520 100 S 640 60, 720 80" />
      </g>
      {/* Route */}
      <motion.path
        d="M 90 320 C 200 300, 240 180, 380 170 S 500 110, 540 90"
        fill="none"
        stroke="url(#mapRoute)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
        style={{ filter: `drop-shadow(0 0 8px ${accent})` }}
      />
      {/* Origin */}
      <circle cx="90" cy="320" r="6" fill={accent} />
      <circle cx="90" cy="320" r="12" fill="none" stroke={accent} strokeOpacity="0.5" />
      {/* Destination */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.7 }}
      >
        <circle cx="540" cy="90" r="7" fill="oklch(0.86 0.10 75)" />
        <circle cx="540" cy="90" r="14" fill="none" stroke="oklch(0.86 0.10 75 / 0.5)" />
      </motion.g>
    </svg>
  );
}
