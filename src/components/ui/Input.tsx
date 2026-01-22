import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      placeholder,
      helperText,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(isPassword);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={!showPassword ? "text" : type}
            id={inputId}
            ref={ref}
            placeholder={placeholder}
            className={cn(
              "input w-full px-4 py-2.5 rounded-lg border border-gray-300",
              "bg-white text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
              error && "border-red-500 focus-ring-500",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              <span>
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </span>
            </button>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
