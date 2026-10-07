import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clearCelebration, useCelebrationStore } from "@/lib/celebration";

const BURST_DURATION_S = 1.4;

/**
 * Renders the confetti burst fired by celebrate(). Mount once near the app
 * root. Purely decorative: hidden from screen readers, ignores pointer
 * events, and renders nothing when the user prefers reduced motion.
 */
export function CelebrationHost() {
  const burstId = useCelebrationStore((state) => state.burstId);
  const particles = useCelebrationStore((state) => state.particles);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (burstId === 0) return;
    const timer = setTimeout(clearCelebration, (BURST_DURATION_S + 0.4) * 1000);
    return () => clearTimeout(timer);
  }, [burstId]);

  if (reduceMotion || particles.length === 0) return null;

  return (
    <div
      key={burstId}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-1/3 z-60 flex justify-center"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute block rounded-sm"
          style={{
            width: particle.size,
            height: particle.size * 0.6,
            backgroundColor: particle.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            rotate: particle.rotate,
          }}
          transition={{
            duration: BURST_DURATION_S,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
