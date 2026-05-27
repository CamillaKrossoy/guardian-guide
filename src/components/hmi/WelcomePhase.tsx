import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChromeShell } from "./ChromeShell";
import {
  MapPin,
  Music2,
  Thermometer,
  BatteryCharging,
  Wind,
  Sparkles,
  ArrowRight,
  Navigation,
  Play,
  Pause,
  Plus,
  Minus,
  Moon,
  ArrowLeft,
  Car,
  Lightbulb,
  Lock,
  Shield,
  Radio,
  SkipBack,
  SkipForward,
  Snowflake,
  Sun,
  Fan,
  Search,
  Clock,
  Gauge,
  Settings2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WelcomePhaseProps {
  driverName?: string;
  driverAccent?: string;
  driverDrives?: number;
  onSwitchDriver?: () => void;
  onStartAutonomy?: () => void;
}

type ExpandedModule = "navigation" | "media" | "climate" | "vehicle" | null;

export function WelcomePhase({
  driverName = "Sofia",
  driverAccent = "oklch(0.82 0.10 200)",
  driverDrives = 142,
  onSwitchDriver,
  onStartAutonomy,
}: WelcomePhaseProps) {
  const isNew = driverDrives === 0;
  const [expanded, setExpanded] = useState<ExpandedModule>(null);

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Home" driverName={driverName} rightStatus="Parked · Ready" />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 px-8 pb-6 lg:grid-cols-12">
        {/* LEFT — Greeting + autonomy CTA (persists across expand) */}
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
            <h1 className="mt-6 font-display text-[52px] font-light leading-[1.02] tracking-tight text-foreground md:text-[60px]">
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

          {/* Autonomy CTA — always transitions to Stage 03 */}
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
                <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="size-3 text-trust" /> Tier 3 available
                  </span>
                  <span className="size-1 rounded-full bg-foreground/30" />
                  <span>{isNew ? "First drive" : `${driverDrives} drives`}</span>
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

        {/* RIGHT — Dashboard area (overview ↔ expanded module) */}
        <section className="relative lg:col-span-8">
          <AnimatePresence mode="wait">
            {expanded === null ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="grid h-full grid-cols-2 gap-4 lg:grid-cols-6 lg:grid-rows-6"
              >
                {/* Navigation */}
                <ModuleTile
                  id="navigation"
                  delay={0.05}
                  onExpand={() => setExpanded("navigation")}
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
                </ModuleTile>

                {/* Vehicle status */}
                <ModuleTile
                  id="vehicle"
                  delay={0.1}
                  onExpand={() => setExpanded("vehicle")}
                  className="col-span-1 row-span-2 lg:col-span-2 lg:row-span-2"
                >
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
                      <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                        <span>Vehicle · ready</span>
                        <span className="text-trust">All systems</span>
                      </div>
                    </div>
                  </div>
                </ModuleTile>

                {/* Climate */}
                <ModuleTile
                  id="climate"
                  delay={0.15}
                  onExpand={() => setExpanded("climate")}
                  className="col-span-1 row-span-2 lg:col-span-2 lg:row-span-2"
                >
                  <div className="flex h-full flex-col justify-between p-5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Thermometer className="size-3 text-aurora-warm" /> Cabin</span>
                      <span>Auto</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-display text-4xl tabular-nums text-foreground">20.5°</div>
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">Fan 2 · cabin</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <ControlPip onClick={(e) => e.stopPropagation()}><Plus className="size-3.5" /></ControlPip>
                        <ControlPip onClick={(e) => e.stopPropagation()}><Minus className="size-3.5" /></ControlPip>
                      </div>
                    </div>
                  </div>
                </ModuleTile>

                {/* Media */}
                <ModuleTile
                  id="media"
                  delay={0.2}
                  onExpand={() => setExpanded("media")}
                  className="col-span-2 row-span-2 lg:col-span-4 lg:row-span-2"
                >
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
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-foreground text-background transition hover:bg-foreground/90"
                    >
                      <Play className="size-4 translate-x-0.5 fill-current" />
                    </button>
                  </div>
                </ModuleTile>

                {/* Quick chips row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="glass-soft col-span-2 row-span-1 overflow-hidden rounded-3xl lg:col-span-6 lg:row-span-1"
                >
                  <div className="flex h-full items-center gap-2 overflow-x-auto p-3">
                    <Chip icon={Wind} label="Ambient · soft" />
                    <Chip icon={Lightbulb} label="Cabin light · low" />
                    <Chip icon={Lock} label="Locked" />
                    <Chip icon={Radio} label="Hands-free" />
                    <div className="ml-auto flex items-center gap-2 pr-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-trust animate-breathe" />
                      Cabin ready
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <ExpandedView
                key={expanded}
                module={expanded}
                accent={driverAccent}
                onCollapse={() => setExpanded(null)}
              />
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

/* ---------------- Module tile (clickable, animates to expanded) ---------------- */

function ModuleTile({
  id,
  children,
  className = "",
  delay = 0,
  onExpand,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onExpand: () => void;
}) {
  return (
    <motion.button
      layoutId={`module-${id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={onExpand}
      className={`glass-soft group relative overflow-hidden rounded-3xl text-left transition-all hover:border-aurora/30 hover:shadow-[0_20px_60px_-30px_oklch(0.78_0.12_195_/_0.4)] ${className}`}
    >
      {children}
      <span className="pointer-events-none absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-foreground/[0.04] text-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowRight className="size-3.5" />
      </span>
    </motion.button>
  );
}

function ControlPip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className="grid size-7 place-items-center rounded-full border border-border/50 text-foreground/70 hover:border-aurora/40 hover:text-aurora"
    >
      {children}
    </button>
  );
}

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.02] px-4 py-2 text-[12px] text-foreground/80 transition hover:border-aurora/40 hover:text-foreground">
      <Icon className="size-3.5 text-aurora/80 transition group-hover:text-aurora" /> {label}
      <ArrowRight className="size-3 opacity-0 transition group-hover:opacity-60" />
    </button>
  );
}

/* ---------------- Expanded module shell ---------------- */

function ExpandedView({
  module,
  accent,
  onCollapse,
}: {
  module: Exclude<ExpandedModule, null>;
  accent: string;
  onCollapse: () => void;
}) {
  const meta: Record<
    Exclude<ExpandedModule, null>,
    { label: string; icon: LucideIcon; eyebrow: string }
  > = {
    navigation: { label: "Navigation", icon: Navigation, eyebrow: "Route & destinations" },
    media: { label: "Media", icon: Music2, eyebrow: "Entertainment" },
    climate: { label: "Climate", icon: Thermometer, eyebrow: "Cabin comfort" },
    vehicle: { label: "Vehicle", icon: Car, eyebrow: "Status & settings" },
  };
  const m = meta[module];

  return (
    <motion.div
      layoutId={`module-${module}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-soft relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl"
    >
      {/* breadcrumb header */}
      <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onCollapse}
            className="group inline-flex items-center gap-2 rounded-full border border-border/40 bg-foreground/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground/75 transition hover:border-aurora/40 hover:text-aurora"
          >
            <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
            Home
          </button>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>Home</span>
            <span className="opacity-50">/</span>
            <span className="flex items-center gap-1.5 text-aurora">
              <m.icon className="size-3" /> {m.label}
            </span>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {m.eyebrow}
        </div>
      </div>

      {/* body */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 overflow-auto p-6"
      >
        {module === "navigation" && <NavigationExpanded accent={accent} />}
        {module === "media" && <MediaExpanded />}
        {module === "climate" && <ClimateExpanded />}
        {module === "vehicle" && <VehicleExpanded />}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Navigation expanded ---------------- */

function NavigationExpanded({ accent }: { accent: string }) {
  const destinations = [
    { label: "Home", sub: "Bygdøy · 34 km", eta: "21:46", icon: MapPin },
    { label: "Office", sub: "Skøyen · 12 km", eta: "21:28", icon: MapPin },
    { label: "Charger · Aker Brygge", sub: "8 km · 4 free", eta: "21:24", icon: BatteryCharging },
    { label: "Recent · Frognerparken", sub: "5 km", eta: "21:21", icon: Clock },
  ];
  return (
    <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="relative col-span-3 overflow-hidden rounded-2xl">
        <MapPreview accent={accent} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <div className="absolute inset-x-5 top-4 flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-2 backdrop-blur">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            placeholder="Search destination, charger, address…"
          />
        </div>
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-border/40 bg-background/60 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Route</div>
              <div className="mt-1 font-display text-xl text-foreground">Home · 34 km</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">ETA</div>
              <div className="font-display text-xl text-trust tabular-nums">21:46</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-foreground/70">
            <span>Traffic <span className="text-trust">light</span></span>
            <span className="size-1 rounded-full bg-foreground/30" />
            <span>2 chargers en route</span>
            <span className="size-1 rounded-full bg-foreground/30" />
            <span>1 toll · NOK 38</span>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Suggestions</div>
        {destinations.map((d) => (
          <button
            key={d.label}
            className="group flex items-center gap-4 rounded-2xl border border-border/30 bg-foreground/[0.02] px-4 py-3 text-left transition hover:border-aurora/40 hover:bg-foreground/[0.04]"
          >
            <span className="grid size-10 place-items-center rounded-full bg-aurora/10 text-aurora">
              <d.icon className="size-4" />
            </span>
            <div className="flex-1">
              <div className="text-[13px] text-foreground">{d.label}</div>
              <div className="text-[11px] text-muted-foreground">{d.sub}</div>
            </div>
            <div className="font-mono text-[11px] tabular-nums text-trust">{d.eta}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Media expanded ---------------- */

function MediaExpanded() {
  const [playing, setPlaying] = useState(false);
  const queue = [
    { title: "re:member", artist: "Ólafur Arnalds", time: "5:42" },
    { title: "Saman", artist: "Ólafur Arnalds", time: "4:18" },
    { title: "Hands, be still", artist: "Hammock", time: "6:02" },
    { title: "Avril 14th", artist: "Aphex Twin", time: "2:04" },
  ];
  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="col-span-3 flex flex-col items-center justify-center gap-5 rounded-2xl border border-border/30 bg-foreground/[0.02] p-8">
        <div
          className="relative grid size-44 place-items-center overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.30 0.05 240), oklch(0.18 0.04 220))",
          }}
        >
          <Music2 className="size-12 text-aurora" />
          <span className="absolute inset-0 rounded-3xl ring-1 ring-aurora/30" />
        </div>
        <div className="text-center">
          <div className="font-display text-2xl text-foreground">Ólafur Arnalds</div>
          <div className="mt-1 text-[12px] text-muted-foreground">re:member · Island Songs</div>
        </div>
        <div className="w-full max-w-sm">
          <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-[34%] rounded-full bg-aurora" />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
            <span>02:14</span>
            <span>05:42</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-foreground/70 hover:text-foreground"><SkipBack className="size-5" /></button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid size-14 place-items-center rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 translate-x-0.5 fill-current" />}
          </button>
          <button className="text-foreground/70 hover:text-foreground"><SkipForward className="size-5" /></button>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Radio className="size-3" /> Spatial audio · Bowers & Wilkins
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>Up next</span>
          <span>{queue.length} tracks</span>
        </div>
        {queue.map((t, i) => (
          <button
            key={t.title}
            className="group flex items-center gap-4 rounded-2xl border border-border/30 bg-foreground/[0.02] px-4 py-3 text-left transition hover:border-aurora/40"
          >
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground w-4">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="truncate text-[13px] text-foreground">{t.title}</div>
              <div className="truncate text-[11px] text-muted-foreground">{t.artist}</div>
            </div>
            <div className="font-mono text-[11px] tabular-nums text-muted-foreground">{t.time}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Climate expanded ---------------- */

function ClimateExpanded() {
  const [temp, setTemp] = useState(20.5);
  const [fan, setFan] = useState(2);
  const zones = [
    { name: "Driver", temp: 20.5 },
    { name: "Passenger", temp: 21.0 },
    { name: "Rear left", temp: 19.5 },
    { name: "Rear right", temp: 19.5 },
  ];
  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="col-span-3 flex flex-col gap-5 rounded-2xl border border-border/30 bg-foreground/[0.02] p-6">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cabin · driver zone</div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-aurora">
            <Sparkles className="size-3" /> Auto
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 py-4">
          <button
            onClick={() => setTemp((t) => Math.max(16, t - 0.5))}
            className="grid size-12 place-items-center rounded-full border border-border/50 text-foreground/70 hover:border-aurora/40 hover:text-aurora"
          >
            <Minus className="size-5" />
          </button>
          <div className="text-center">
            <div className="font-display text-7xl tabular-nums text-foreground">{temp.toFixed(1)}°</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cabin temperature</div>
          </div>
          <button
            onClick={() => setTemp((t) => Math.min(28, t + 0.5))}
            className="grid size-12 place-items-center rounded-full border border-border/50 text-foreground/70 hover:border-aurora/40 hover:text-aurora"
          >
            <Plus className="size-5" />
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Fan className="size-3" /> Fan</span>
            <span className="font-mono">Level {fan}</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setFan(n)}
                className={`h-2 flex-1 rounded-full transition ${
                  n <= fan ? "bg-aurora" : "bg-foreground/10"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ClimateToggle icon={Snowflake} label="A/C" active />
          <ClimateToggle icon={Sun} label="Heated seat" />
          <ClimateToggle icon={Wind} label="Defrost" />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Zones</div>
        {zones.map((z) => (
          <div
            key={z.name}
            className="flex items-center justify-between rounded-2xl border border-border/30 bg-foreground/[0.02] px-4 py-3"
          >
            <div className="text-[13px] text-foreground">{z.name}</div>
            <div className="font-display text-lg tabular-nums text-foreground">{z.temp.toFixed(1)}°</div>
          </div>
        ))}
        <div className="mt-2 rounded-2xl border border-aurora/20 bg-aurora/5 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-aurora">Air quality</div>
          <div className="mt-1 font-display text-xl text-foreground">Excellent</div>
          <div className="text-[11px] text-muted-foreground">HEPA · 99.8% clean</div>
        </div>
      </div>
    </div>
  );
}

function ClimateToggle({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  const [on, setOn] = useState(active);
  return (
    <button
      onClick={() => setOn((s) => !s)}
      className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-[11px] transition ${
        on
          ? "border-aurora/40 bg-aurora/10 text-aurora"
          : "border-border/40 bg-foreground/[0.02] text-foreground/70 hover:border-aurora/30"
      }`}
    >
      <Icon className="size-4" /> {label}
    </button>
  );
}

/* ---------------- Vehicle expanded ---------------- */

function VehicleExpanded() {
  return (
    <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="col-span-3 flex flex-col gap-5">
        <div className="rounded-2xl border border-border/30 bg-foreground/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-trust">
              <BatteryCharging className="size-3" /> Battery
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">78% · charging at home</div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-display text-5xl tabular-nums text-foreground">412<span className="ml-1 text-base text-muted-foreground">km</span></div>
              <div className="mt-1 text-[12px] text-muted-foreground">Range · efficient mode</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Full at</div>
              <div className="font-display text-xl text-foreground">06:20</div>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-trust to-aurora" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={Gauge} label="Tyre pressure" value="2.4 bar" sub="All balanced" />
          <StatCard icon={Shield} label="Software" value="4.2.1" sub="Up to date" />
          <StatCard icon={Lock} label="Doors" value="Locked" sub="Cabin secure" />
          <StatCard icon={Radio} label="Connectivity" value="5G · strong" sub="Cloud sync" />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Quick settings</div>
        <SettingRow icon={Lightbulb} label="Cabin lighting" value="Low · warm" />
        <SettingRow icon={Sun} label="Sunroof" value="Closed" />
        <SettingRow icon={Settings2} label="Drive profile" value="Comfort" />
        <SettingRow icon={Shield} label="Sentry mode" value="On" />
        <div className="mt-2 rounded-2xl border border-aurora/20 bg-aurora/5 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-aurora">Adaptation</div>
          <div className="mt-1 text-[12px] leading-relaxed text-foreground/80">
            Aurora has learned your seat, mirror and ambient preferences across 142 drives.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border/30 bg-foreground/[0.02] p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <Icon className="size-3 text-aurora" /> {label}
      </div>
      <div className="mt-2 font-display text-xl text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <button className="flex items-center justify-between rounded-2xl border border-border/30 bg-foreground/[0.02] px-4 py-3 text-left transition hover:border-aurora/40">
      <span className="flex items-center gap-3 text-[13px] text-foreground">
        <Icon className="size-4 text-aurora/80" /> {label}
      </span>
      <span className="text-[12px] text-muted-foreground">{value}</span>
    </button>
  );
}

/* ---------------- Map preview (shared) ---------------- */

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
      <g fill="none" stroke="oklch(0.55 0.04 210 / 0.10)" strokeWidth="1">
        <path d="M -20 320 C 120 280, 280 360, 460 280 S 640 240, 720 260" />
        <path d="M -20 260 C 140 220, 300 300, 480 220 S 640 180, 720 200" />
        <path d="M -20 200 C 160 160, 320 240, 500 160 S 640 120, 720 140" />
        <path d="M -20 140 C 180 100, 340 180, 520 100 S 640 60, 720 80" />
      </g>
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
      <circle cx="90" cy="320" r="6" fill={accent} />
      <circle cx="90" cy="320" r="12" fill="none" stroke={accent} strokeOpacity="0.5" />
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
