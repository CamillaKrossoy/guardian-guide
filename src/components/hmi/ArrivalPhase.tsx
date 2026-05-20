import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChromeShell } from "./ChromeShell";
import { Plus, ArrowRight, Clock3, MapPin } from "lucide-react";

export interface DriverProfile {
  id: string;
  name: string;
  initials: string;
  accent: string;       // oklch color
  lastSeen: string;     // e.g. "Yesterday, 21:14"
  drives: number;
  signature: string;    // a single quiet line of memory
  lastRoute: string;
}

const profiles: DriverProfile[] = [
  {
    id: "sofia",
    name: "Sofia",
    initials: "S",
    accent: "oklch(0.82 0.10 200)",
    lastSeen: "Yesterday · 21:14",
    drives: 142,
    signature: "Prefers a slower start on Tuesdays.",
    lastRoute: "Frognerseteren → Home",
  },
  {
    id: "henrik",
    name: "Henrik",
    initials: "H",
    accent: "oklch(0.84 0.10 75)",
    lastSeen: "3 days ago · 07:42",
    drives: 86,
    signature: "Quiet mornings, no music before coffee.",
    lastRoute: "Home → Lysaker",
  },
  {
    id: "ingrid",
    name: "Ingrid",
    initials: "I",
    accent: "oklch(0.82 0.10 165)",
    lastSeen: "Last week · 18:02",
    drives: 31,
    signature: "Likes the windows just slightly open.",
    lastRoute: "Bygdøy → Grünerløkka",
  },
];

interface ArrivalPhaseProps {
  onSelect: (profile: DriverProfile) => void;
  onNewDriver: () => void;
}

export function ArrivalPhase({ onSelect, onNewDriver }: ArrivalPhaseProps) {
  const [hovered, setHovered] = useState<string | null>("sofia");
  const [chosen, setChosen] = useState<string | null>(null);

  // a calm recognition moment — long enough to emotionally register
  useEffect(() => {
    if (!chosen) return;
    if (chosen === "__new__") {
      const t = setTimeout(onNewDriver, 2400);
      return () => clearTimeout(t);
    }
    const p = profiles.find((x) => x.id === chosen);
    if (!p) return;
    const t = setTimeout(() => onSelect(p), 2900);
    return () => clearTimeout(t);
  }, [chosen, onSelect, onNewDriver]);

  const focused = profiles.find((p) => p.id === (hovered ?? "sofia")) ?? profiles[0];

  return (
    <div className="flex h-full flex-col">
      <ChromeShell phaseLabel="Awaiting driver" driverName="—" rightStatus="At rest" />

      <AnimatePresence mode="wait">
        {!chosen ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-8 pb-10"
          >
            {/* Soft greeting header */}
            <div className="relative pt-6">
              <div className="pointer-events-none absolute -left-10 -top-8 size-[420px] rounded-full aurora-ring blur-3xl opacity-60" />
              <div className="relative">
                <div className="text-[11px] uppercase tracking-[0.32em] text-aurora/80">
                  Good evening
                </div>
                <h1 className="mt-5 font-display text-5xl leading-[1.02] text-foreground md:text-[68px]">
                  Who is driving
                  <br />
                  <span className="italic text-aurora">tonight?</span>
                </h1>
                <p className="mt-5 max-w-md text-[14px] leading-relaxed text-muted-foreground">
                  Choose your profile so the car can pick up where you left off.
                </p>
              </div>
            </div>

            {/* Profiles row */}
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.9fr]">
              {profiles.map((p, i) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  delay={0.1 + i * 0.08}
                  isFocused={focused.id === p.id}
                  onHover={() => setHovered(p.id)}
                  onSelect={() => setChosen(p.id)}
                />
              ))}

              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + profiles.length * 0.08 }}
                onMouseEnter={() => setHovered("__new__")}
                onClick={() => setChosen("__new__")}
                className="group relative flex flex-col items-start justify-between overflow-hidden rounded-3xl border border-dashed border-border/60 p-6 text-left transition-all hover:border-aurora/50 hover:bg-foreground/[0.02]"
              >
                <div className="grid size-14 place-items-center rounded-full border border-border/60 text-foreground/70 transition-colors group-hover:border-aurora/60 group-hover:text-aurora">
                  <Plus className="size-5" />
                </div>
                <div className="mt-8">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    First time here
                  </div>
                  <div className="mt-2 font-display text-2xl text-foreground">
                    Someone new
                  </div>
                  <div className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    A short, quiet introduction.
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-foreground/70 group-hover:text-aurora">
                  Begin <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </motion.button>
            </div>

            {/* Memory whisper — proves the car remembers people */}
            <motion.div
              key={focused.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6 text-[12px] text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: focused.accent, boxShadow: `0 0 12px ${focused.accent}` }}
                />
                <span className="uppercase tracking-[0.22em]">Quietly remembered</span>
                <span className="text-foreground/80">— {focused.signature}</span>
              </div>
              <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.22em]">
                <span className="flex items-center gap-1.5"><Clock3 className="size-3" /> {focused.lastSeen}</span>
                <span className="flex items-center gap-1.5"><MapPin className="size-3" /> {focused.lastRoute}</span>
                <span>{focused.drives} drives</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="recognizing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1, ease: [0.22, 0.7, 0.2, 1] },
            }}
            className="flex flex-1 items-center justify-center px-8"
          >
            <Recognition chosen={chosen} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileCard({
  profile,
  isFocused,
  delay,
  onHover,
  onSelect,
}: {
  profile: DriverProfile;
  isFocused: boolean;
  delay: number;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onSelect}
      className={`group relative flex flex-col items-start overflow-hidden rounded-3xl border p-6 text-left transition-all
        ${isFocused
          ? "border-aurora/40 bg-foreground/[0.035] shadow-[0_30px_80px_-40px_oklch(0.78_0.12_195/0.5)]"
          : "border-border/50 hover:bg-foreground/[0.02]"}`}
    >
      {/* halo */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl transition-opacity ${
          isFocused ? "opacity-70" : "opacity-30"
        }`}
        style={{ background: `radial-gradient(circle, ${profile.accent} 0%, transparent 65%)` }}
      />

      <div className="relative flex items-center gap-4">
        <span
          className="relative grid size-14 place-items-center rounded-full font-display text-2xl text-background"
          style={{
            background: `linear-gradient(135deg, ${profile.accent}, oklch(0.55 0.06 230))`,
            boxShadow: `0 0 0 1px oklch(1 0 0 / 0.08), 0 12px 30px -10px ${profile.accent}`,
          }}
        >
          {profile.initials}
          {isFocused && (
            <span
              className="absolute -inset-1 rounded-full animate-pulse-ring"
              style={{ background: `radial-gradient(circle, ${profile.accent} 0%, transparent 70%)`, opacity: 0.4 }}
            />
          )}
        </span>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Returning driver
          </div>
          <div className="mt-1 font-display text-2xl text-foreground">{profile.name}</div>
        </div>
      </div>

      <div className="relative mt-10 w-full">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{profile.drives} drives</span>
          <span>{profile.lastSeen.split("·")[0].trim()}</span>
        </div>
        <div className="mt-3 text-[12px] leading-relaxed text-foreground/70">
          {profile.signature}
        </div>
      </div>

      <div
        className={`relative mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] transition-colors ${
          isFocused ? "text-aurora" : "text-foreground/60 group-hover:text-aurora"
        }`}
      >
        Continue <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}

function Recognition({ chosen }: { chosen: string }) {
  const profile = profiles.find((p) => p.id === chosen);
  const isNew = chosen === "__new__";
  const accent = profile?.accent ?? "oklch(0.78 0.12 195)";
  const name = isNew ? "you" : profile?.name ?? "you";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
      transition={{
        opacity: { duration: 1.2, ease: [0.22, 0.7, 0.2, 1] },
        scale: { duration: 1.6, ease: [0.22, 0.7, 0.2, 1] },
        filter: { duration: 0.9 },
      }}
      className="relative flex flex-col items-center text-center"
    >
      <motion.span
        className="absolute -inset-32 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 65%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0.32, 0.4] }}
        transition={{ duration: 2.6, ease: "easeInOut", times: [0, 0.4, 0.7, 1] }}
      />
      <motion.span
        className="relative grid size-24 place-items-center rounded-full font-display text-4xl text-background"
        style={{
          background: `linear-gradient(135deg, ${accent}, oklch(0.55 0.06 230))`,
          boxShadow: `0 0 0 1px oklch(1 0 0 / 0.1), 0 20px 60px -10px ${accent}`,
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      >
        {profile?.initials ?? "+"}
        <span
          className="absolute -inset-2 rounded-full animate-pulse-ring"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, opacity: 0.5 }}
        />
      </motion.span>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
        className="relative mt-8 text-[11px] uppercase tracking-[0.32em] text-aurora/80"
      >
        {isNew ? "A new conversation" : "Recognizing"}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 0.7, 0.2, 1] }}
        className="relative mt-3 font-display text-4xl text-foreground md:text-5xl"
      >
        {isNew ? "Let's begin gently." : <>Welcome back, <span className="italic text-aurora">{name}</span>.</>}
      </motion.h2>
    </motion.div>
  );
}
