import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Battery, Signal, Cloud, MapPin, Home } from "lucide-react";

interface ChromeShellProps {
  phaseLabel: string;
  driverName?: string;
  rightStatus?: string;
  onHome?: () => void;
}

export function ChromeShell({ phaseLabel, driverName = "Sofia", rightStatus = "Connected", onHome }: ChromeShellProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center justify-between px-8 py-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
    >
      <div className="flex items-center gap-5">
        {onHome && (
          <button
            onClick={onHome}
            className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-foreground/[0.02] px-3 py-1.5 text-foreground/75 transition-colors hover:border-aurora/40 hover:text-aurora"
            aria-label="Return to home"
          >
            <Home className="size-3.5" />
            <span className="tracking-[0.22em]">Home</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-aurora animate-breathe" />
          <span className="font-mono text-foreground/80">AURA · OS 4.2</span>
        </div>
        <span className="hidden md:inline">{phaseLabel}</span>
      </div>

      <div className="flex items-center gap-6">
        <span
          suppressHydrationWarning
          className="font-mono text-foreground/90 tracking-[0.15em] text-sm tabular-nums min-w-[3ch]"
        >
          {time || "\u00A0\u00A0:\u00A0\u00A0"}
        </span>
        <div className="hidden md:flex items-center gap-1.5"><Cloud className="size-3.5" /> 14°</div>
        <div className="hidden md:flex items-center gap-1.5"><MapPin className="size-3.5" /> E18 · Oslo</div>
        <div className="flex items-center gap-1.5"><Signal className="size-3.5" /> 5G</div>
        <div className="flex items-center gap-1.5"><Battery className="size-3.5" /> 78%</div>
        <span className="hidden md:inline opacity-70">· {rightStatus} · {driverName}</span>
      </div>
    </motion.div>
  );
}
