import { motion } from "motion/react";

export type Phase = "welcome" | "nudge" | "logic" | "takeover";

const phases: { id: Phase; n: string; label: string }[] = [
  { id: "welcome",  n: "01", label: "Home" },
  { id: "nudge",    n: "02", label: "Suggest" },
  { id: "logic",    n: "03", label: "Intent" },
  { id: "takeover", n: "04", label: "Assist" },
];

export function PhaseNav({ active, onChange }: { active: Phase; onChange: (p: Phase) => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-5">
      <div className="glass-soft flex items-stretch justify-between gap-0.5 rounded-full p-1">
        {phases.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className="relative flex-1 rounded-full px-3 py-2 text-center transition-colors hover:bg-foreground/[0.03]"
            >
              {isActive && (
                <motion.span
                  layoutId="phase-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.32 0.05 200 / 0.55), oklch(0.26 0.04 220 / 0.45))",
                    boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.06), 0 6px 18px -10px oklch(0.78 0.12 195 / 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <div className="relative flex items-center justify-center gap-2">
                <span className={`font-mono text-[9px] tracking-[0.22em] ${isActive ? "text-aurora" : "text-muted-foreground"}`}>
                  {p.n}
                </span>
                <span className={`text-[12px] tracking-[0.04em] ${isActive ? "text-foreground" : "text-foreground/65"}`}>
                  {p.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
