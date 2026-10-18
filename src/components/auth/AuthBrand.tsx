import { ChartSpline, CircleCheck, Trophy } from "lucide-react";

/**
 * Logo, name and one-line pitch above the login and signup cards, so a
 * first-time visitor knows what HabitFlow is before being asked to log in.
 */
export function AuthBrand() {
  return (
    <div className="flex flex-col items-center text-center mb-5 sm:mb-6">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="" className="w-9 h-9 sm:w-10 sm:h-10" />
        <span className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          HabitFlow
        </span>
      </div>
      <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        A habit tracker that rewards showing up every day.
      </p>
    </div>
  );
}

const FEATURES = [
  {
    icon: CircleCheck,
    text: "Check off habits in one tap and keep your streaks going",
  },
  {
    icon: Trophy,
    text: "Earn points, level up and unlock achievements",
  },
  {
    icon: ChartSpline,
    text: "See your progress in a heatmap and charts",
  },
];

/** Three-point feature list under the login and signup cards. */
export function AuthFeatures() {
  return (
    <ul className="flex flex-col md:flex-row gap-4 mt-5 sm:mt-6 px-1">
      {FEATURES.map(({ icon: Icon, text }) => (
        <li
          key={text}
          className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
        >
          <Icon
            className="w-5 h-5 shrink-0 text-primary-700 dark:text-primary-400"
            aria-hidden="true"
          />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
