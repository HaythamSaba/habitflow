import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const DURATION_MS = 600;

/**
 * Counts to `value` from whatever is currently shown: 0 on first render,
 * then from the previous value (e.g. 120 → 130 after a check-in, not
 * 0 → 130). Shows the final value immediately when the user prefers
 * reduced motion.
 */
function AnimatedNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  // Latest number on screen, so a new target continues from there
  const shownRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const from = shownRef.current;
    if (from === value) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      const next = Math.round(from + (value - from) * eased);
      shownRef.current = next;
      setDisplayValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  return <span>{reduceMotion ? value : displayValue}</span>;
}

export default AnimatedNumber;
