
import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const CustomButton = forwardRef(
  (
    {
      children,
      onClick,
      icon: Icon,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-[#0446DB] text-white border-[#0446DB] hover:bg-blue-700",
      outline:
        "bg-white text-[#0446DB] border-blue-200 hover:bg-blue-50",
      danger:
        "bg-red-600 text-white border-red-600 hover:bg-red-700",
      success:
        "bg-green-600 text-white border-green-600 hover:bg-green-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          group relative inline-flex items-center
          justify-center gap-2 overflow-hidden
          rounded-lg border font-semibold
          shadow-sm transition-all duration-300
          hover:-translate-y-0.5 hover:shadow-sm
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:translate-y-0
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      >
        <span
          className="pointer-events-none absolute inset-0
          -translate-x-full bg-gradient-to-r
          from-transparent via-white/20 to-transparent
          transition-transform duration-700
          group-hover:translate-x-full"
        />

        {loading ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          Icon && <Icon size={17} />
        )}

        <span className="relative z-10">
          {children}
        </span>
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
