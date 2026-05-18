import { motion } from "motion/react";

export type Phase = "onboarding" | "nudge" | "logic" | "takeover";

const phases: { id: Phase; n: string; label: string; sub: string }[] = [
  { id: "onboarding", n: "01", label: "Profile", sub: "Welcome & setup" },
  { id: "nudge",      n: "02", label: "Nudge",   sub: "Smart suggestion" },
  { id: "logic",      n: "03", label: "Intent",  sub: "What I plan to do" },
  { id: "takeover",   n: "04", label: "Assist",  sub: "I need you here" },
];

export function PhaseNav({ active, onChange }: { active: Phase; onChange: (p: Phase) => void }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-6">
      <div className="glass flex items-stretch justify-between gap-1 rounded-2xl p-1.5">
        {phases.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className="relative flex-1 rounded-xl px-3 py-3 text-left transition-colors hover:bg-foreground/[0.03]"
            >
              {isActive && (
                <motion.span
                  layoutId="phase-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.32 0.05 200 / 0.7), oklch(0.26 0.04 220 / 0.6))",
                    boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.08), 0 8px 24px -10px oklch(0.78 0.12 195 / 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <span className={`font-mono text-[10px] tracking-widest ${isActive ? "text-aurora" : "text-muted-foreground"}`}>
                  {p.n}
                </span>
                <div className="min-w-0">
                  <div className={`text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/75"}`}>
                    {p.label}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{p.sub}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
