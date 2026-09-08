import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "press inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl " +
  "font-semibold transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-(--duration-fast) ease-(--ease-out) " +
  "disabled:pointer-events-none disabled:opacity-50";

// Gold is the only "act on this" signal in the system; everything else recedes.
const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-strong shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]",
  secondary:
    "border border-line bg-surface-raised text-foreground hover:border-line-strong hover:bg-overlay",
  ghost: "text-muted hover:bg-surface-raised hover:text-foreground",
  quiet:
    "border border-transparent text-muted hover:border-line hover:bg-surface hover:text-foreground",
  danger:
    "border border-danger-strong/60 bg-danger-strong/15 text-danger hover:bg-danger-strong/25 hover:text-foreground",
};

// Every interactive target clears 44px of height at md and lg, per Apple's
// touch-target floor. sm is reserved for dense toolbars on pointer devices.
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-caption",
  md: "h-11 px-4 text-body",
  lg: "h-12 px-6 text-title-3",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** Render the child element instead of a <button> (e.g. a Next <Link>). */
  asChild?: boolean;
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(base, variants[variant], sizes[size], className)}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
}

/** Square icon-only button. Requires an aria-label. */
export function IconButton({
  className,
  variant = "ghost",
  size = "md",
  asChild = false,
  type,
  ...props
}: ButtonProps & { "aria-label": string }) {
  const Comp = asChild ? Slot : "button";
  const square = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
  return (
    <Comp
      className={cn(base, variants[variant], square, "rounded-xl p-0", className)}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
}
