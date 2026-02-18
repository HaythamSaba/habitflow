import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "btn inline-flex items-center justify-center cursor-pointer font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-0 focus:ring-offset-0 dark:hover:bg-gray-700 dark:text-gray-100 dark:hover:text-white";

    const variants = {
      primary:
        "btn-primary bg-primary text-white hover:bg-emerald-600 focus:ring-primary",
      secondary:
        "btn-secondary bg-secondary text-gray-900 hover:bg-yellow-400 focus:ring-secondary",
      ghost:
        "btn-ghost bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
      danger:
        "btn-danger bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
      outline:
        "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400",
    };

    const sizes = {
      sm: "btn-sm px-3 py-1.5 text-xs sm:text-sm min-h-9 sm:min-h-10",
      md: "btn-md px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base min-h-10 sm:min-h-11",
      lg: "btn-lg px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg min-h-11 sm:min-h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
        onClick={onClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-1.5 sm:mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-1.5 sm:ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
