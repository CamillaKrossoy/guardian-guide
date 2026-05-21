import { motion, AnimatePresence } from "motion/react";
import { Gauge } from "lucide-react";

export type DriveMode =
  | "manual"      // driver in control, system observing
  | "suggesting"  // driver in control, suggestion available
  | "declined"    // driver kept control after suggestion
  | "handover"    // control transitioning to vehicle
  | "autonomous"  // vehicle in control
  | "takeover";   // vehicle asking driver to take control

interface ModeBarProps {
  mode: DriveMode;
  /** 0–1 system confidence in current situation */
  confidence?: number;
  /** Optional contextual hint shown after the main label */
  hint?: string;
}

const PALETTE: Record<
  DriveMode,
  {
    accent: string;
    accentSoft: string;
    glow: string;
    label: string;
    sub: string;
    tier: string;
    textClass: string;
  }
> = {
  manual: {
    accent: "oklch(0.86 0.10 200)",
    accentSoft: "oklch(0.78 0.12 195 / 0.18)",
    glow: "0 0 8px oklch(0.86 0.10 200 / 0.5)",
    label: "You are driving",
    sub: "I'm observing",
    tier: "L2 · Hands-on",
    textClass: "text-foreground/85",
  },
  suggesting: {
    accent: "oklch(0.86 0.10 200)",
    accentSoft: "oklch(0.78 0.12 195 / 0.20)",
    glow: "0 0 10px oklch(0.86 0.10 200 / 0.55)",
    label: "You are driving",
    sub: "Suggestion available",
    tier: "L2 · Hands-on",
    textClass: "text-foreground/85",
  },
  declined: {
    accent: "oklch(0.86 0.10 200)",
    accentSoft: "oklch(0.78 0.12 195 / 0.18)",
    glow: "0 0 8px oklch(0.86 0.10 200 / 0.5)",
    label: "You are driving",
    sub: "I'm on standby",
    tier: "L2 · Hands-on",
    textClass: "text-foreground/85",
  },
  handover: {
    accent: "oklch(0.86 0.12 175)",
    accentSoft: "oklch(0.82 0.10 170 / 0.22)",
    glow: "0 0 14px oklch(0.86 0.12 175 / 0.8)",
    label: "Transferring control",
    sub: "Stay loosely engaged",
    tier: "L2 → L3",
    textClass: "text-aurora-warm",
  },
  autonomous: {
    accent: "oklch(0.86 0.12 170)",
    accentSoft: "oklch(0.82 0.10 165 / 0.25)",
    glow: "0 0 14px oklch(0.86 0.12 170 / 0.85)",
    label: "AURA is driving",
    sub: "Supervise gently",
    tier: "L3 · Eyes-on",
    textClass: "text-aurora-warm",
  },
  takeover: {
    accent: "oklch(0.86 0.13 75)",
    accentSoft: "oklch(0.86 0.13 75 / 0.22)",
    glow: "0 0 14px oklch(0.86 0.13 75 / 0.8)",
    label: "Cooperative handoff",
    sub: "I'd like your help",
    tier: "L3 → L2",
    textClass: "text-caution",
  },
};

export function ModeBar({ mode, confidence, hint }: ModeBarProps) {
  const p = PALETTE[mode];
  const isAuto = mode === "autonomous" || mode === "handover";
  const conf = typeof confidence === "number" ? Math.round(confidence * 100) : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <motion.div
        layout
        className="mb-4 flex items-center justify-between gap-4 rounded-2xl border px-5 py-3 text-[11px] uppercase tracking-[0.22em]"
        animate={{
          borderColor: p.accentSoft,
          backgroundColor: isAuto
            ? "oklch(0.82 0.10 165 / 0.05)"
            : mode === "takeover"
            ? "oklch(0.86 0.13 75 / 0.05)"
            : "oklch(0.20 0.02 240 / 0.25)",
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Left — status dot + label */}
        <div className="flex min-w-0 items-center gap-3">
          <motion.span
            className="size-2 shrink-0 rounded-full animate-breathe"
            animate={{ backgroundColor: p.accent, boxShadow: p.glow }}
            transition={{ duration: 1 }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5 }}
              className={`truncate ${p.textClass}`}
            >
              {p.label}
              <span className="ml-2 text-muted-foreground">· {hint ?? p.sub}</span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Center — confidence rail (hidden on narrow) */}
        {conf !== null && (
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-mono text-[10px] text-muted-foreground">Confidence</span>
            <div className="h-0.5 w-28 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                className="h-full"
                animate={{ width: `${conf}%`, background: p.accent, boxShadow: p.glow }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </div>
            <span className="font-mono tabular-nums text-foreground/80">{conf}%</span>
          </div>
        )}

        {/* Right — autonomy tier */}
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
          <Gauge className="size-3.5" />
          <span className="font-mono">{p.tier}</span>
        </div>
      </motion.div>
    </div>
  );
}
