import { motion } from "motion/react";

interface RoadViewProps {
  mode: "manual" | "auto" | "overtake" | "uncertain";
  showOtherCar?: boolean;
  showOvertakePath?: boolean;
  uncertaintyHalo?: boolean;
}

/**
 * Cinematic perspective road. Pure SVG so it scales beautifully.
 * Different modes shift palette + decorations to convey system state.
 */
export function RoadView({ mode, showOtherCar = true, showOvertakePath = false, uncertaintyHalo = false }: RoadViewProps) {
  const palette = {
    manual:    { glow: "oklch(0.78 0.12 195 / 0.35)", lane: "oklch(0.88 0.06 200 / 0.7)", ego: "oklch(0.92 0.04 200)" },
    auto:      { glow: "oklch(0.82 0.10 165 / 0.40)", lane: "oklch(0.86 0.08 175 / 0.85)", ego: "oklch(0.94 0.06 175)" },
    overtake:  { glow: "oklch(0.86 0.10 75  / 0.40)", lane: "oklch(0.90 0.08 90  / 0.85)", ego: "oklch(0.96 0.06 85)"  },
    uncertain: { glow: "oklch(0.78 0.14 35  / 0.45)", lane: "oklch(0.85 0.10 40  / 0.75)", ego: "oklch(0.94 0.10 35)"  },
  }[mode];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      {/* Sky / horizon ambient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 38%, ${palette.glow}, transparent 70%),
            linear-gradient(180deg, oklch(0.20 0.025 240) 0%, oklch(0.16 0.02 240) 55%, oklch(0.12 0.02 240) 100%)
          `,
        }}
      />
      {/* Grid floor */}
      <div className="absolute inset-0 grid-fade opacity-60" />

      {/* SVG perspective road */}
      <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.30 0.02 240)" stopOpacity="0.0" />
            <stop offset="40%" stopColor="oklch(0.26 0.02 240)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.30 0.03 240)" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="laneFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.lane} stopOpacity="0" />
            <stop offset="35%" stopColor={palette.lane} stopOpacity="0.5" />
            <stop offset="100%" stopColor={palette.lane} stopOpacity="1" />
          </linearGradient>
          <radialGradient id="haze" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.95 0.02 220)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(0.95 0.02 220)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Road surface */}
        <polygon points="380,260 620,260 880,600 120,600" fill="url(#roadGrad)" />
        {/* Horizon haze */}
        <rect x="0" y="200" width="1000" height="120" fill="url(#haze)" />

        {/* Lane lines */}
        <g stroke="url(#laneFade)" strokeWidth="2.5">
          <line x1="500" y1="260" x2="500" y2="600" strokeDasharray="14 22" />
          <line x1="430" y1="260" x2="220" y2="600" />
          <line x1="570" y1="260" x2="780" y2="600" />
        </g>

        {/* Far traffic ahead (other vehicle) */}
        {showOtherCar && (
          <motion.g
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <rect x="470" y="320" width="60" height="34" rx="8" fill="oklch(0.55 0.04 230)" opacity="0.85" />
            <rect x="476" y="324" width="48" height="12" rx="3" fill="oklch(0.78 0.04 220)" opacity="0.6" />
            <circle cx="480" cy="354" r="2.5" fill="oklch(0.86 0.10 35)" />
            <circle cx="520" cy="354" r="2.5" fill="oklch(0.86 0.10 35)" />
          </motion.g>
        )}

        {/* Planned overtake trajectory */}
        {showOvertakePath && (
          <motion.path
            d="M 500 520 C 500 460, 430 430, 380 380 S 360 320, 470 290"
            fill="none"
            stroke={palette.lane}
            strokeWidth="3"
            strokeDasharray="6 8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        )}

        {/* Uncertainty halo around objects */}
        {uncertaintyHalo && (
          <>
            <circle cx="500" cy="338" r="60" fill="none" stroke="oklch(0.86 0.13 60)" strokeWidth="1" strokeDasharray="3 5" opacity="0.7" />
            <circle cx="500" cy="338" r="90" fill="none" stroke="oklch(0.86 0.13 60 / 0.4)" strokeWidth="1" strokeDasharray="3 9" />
          </>
        )}
      </svg>

      {/* Ego vehicle indicator (bottom center) */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={showOvertakePath ? { x: "-46%" } : { x: "-50%" }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      >
        <div className="relative">
          <div
            className="absolute -inset-10 rounded-full blur-2xl"
            style={{ background: palette.glow }}
          />
          <svg width="120" height="68" viewBox="0 0 120 68" className="relative">
            <ellipse cx="60" cy="56" rx="48" ry="6" fill="oklch(0 0 0 / 0.5)" />
            <path
              d="M 18 50 Q 22 22 60 18 Q 98 22 102 50 L 96 56 L 24 56 Z"
              fill={palette.ego}
              opacity="0.95"
            />
            <path d="M 32 32 L 88 32 L 84 22 L 36 22 Z" fill="oklch(0.18 0.02 240 / 0.7)" />
            <circle cx="32" cy="50" r="3" fill="oklch(0.95 0.10 200)" />
            <circle cx="88" cy="50" r="3" fill="oklch(0.95 0.10 200)" />
          </svg>
        </div>
      </motion.div>

      {/* Floating particles for ambient depth */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute block size-1 rounded-full bg-aurora/40 animate-drift"
            style={{
              left: `${(i * 73) % 100}%`,
              bottom: `${(i * 41) % 30}%`,
              animationDelay: `${(i * 0.7) % 8}s`,
            }}
          />
        ))}
      </div>

      {/* Scanlines overlay */}
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
    </div>
  );
}
