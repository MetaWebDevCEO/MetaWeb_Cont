import * as React from "react";
import { cn } from "cn";

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Botón con borde rotativo negro, gris y verde MetaWeb.
 */
const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="group relative inline-flex rounded-full p-[1px] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100">
        {/* Borde rotativo en negro, gris y verde MetaWeb */}
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,#000000_0deg,#737373_120deg,#1D6E47_240deg,#000000_360deg)] blur-sm [animation-duration:4s]"
        />
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#09090b] px-8 py-3 text-sm font-medium tracking-wide text-white",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]",
            "transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-black active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  },
);
GlowButton.displayName = "GlowButton";

export { GlowButton };
