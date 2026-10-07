import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleCheck } from "lucide-react";

interface CompletionToggleProps {
  habitName: string;
  color: string;
  /** Check-ins today */
  count: number;
  /** Daily target */
  target: number;
  points: number;
  /** Returns false when the tap was ignored (e.g. a change is still saving) */
  onToggle: () => boolean;
}

const RADIUS = 11;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The habit check-off control. Single-count habits show an empty circle or
 * a check; multi-count habits fill a ring per check-in and show the check
 * only when the daily target is met.
 */
export function CompletionToggle({
  habitName,
  color,
  count,
  target,
  points,
  onToggle,
}: CompletionToggleProps) {
  const reduceMotion = useReducedMotion();
  const [pointBursts, setPointBursts] = useState<number[]>([]);

  const isDone = count >= target;
  const isPartial = count > 0 && !isDone;
  const progress = Math.min(count / target, 1);

  const handleClick = () => {
    const isAdding = !isDone;
    const acted = onToggle();
    if (acted && isAdding && !reduceMotion) {
      setPointBursts((bursts) => [...bursts, Date.now()]);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      role="checkbox"
      aria-checked={isDone ? true : isPartial ? "mixed" : false}
      aria-label={
        target > 1
          ? `${habitName}, ${count} of ${target} done today`
          : habitName
      }
      className="relative shrink-0 min-w-11 min-h-11 flex items-center justify-center rounded-full transition-transform hover:scale-110 -ml-2 sm:ml-0"
    >
      <motion.span
        className="block"
        whileTap={reduceMotion ? undefined : { scale: 0.85 }}
      >
        {isDone ? (
          <motion.span
            key="done"
            className="block"
            initial={reduceMotion ? false : { scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <CircleCheck className="w-7 h-7" style={{ color }} />
          </motion.span>
        ) : (
          <svg
            viewBox="0 0 28 28"
            className="w-7 h-7 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="14"
              cy="14"
              r={RADIUS}
              fill="none"
              strokeWidth="2.5"
              className="stroke-gray-400 dark:stroke-gray-500"
            />
            {progress > 0 && (
              <circle
                cx="14"
                cy="14"
                r={RADIUS}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                stroke={color}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                style={
                  reduceMotion
                    ? undefined
                    : { transition: "stroke-dashoffset 300ms ease-out" }
                }
              />
            )}
          </svg>
        )}
      </motion.span>

      {/* Floating "+10" reward; decorative, the toast announces the change */}
      <AnimatePresence>
        {pointBursts.map((id) => (
          <motion.span
            key={id}
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 left-1/2 text-xs font-bold whitespace-nowrap"
            style={{ color }}
            initial={{ opacity: 1, y: 0, x: "-50%" }}
            animate={{ opacity: 0, y: -28, x: "-50%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() =>
              setPointBursts((bursts) => bursts.filter((b) => b !== id))
            }
          >
            +{points}
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );
}
