import { cn } from "@/lib/cn";

/**
 * The mark: a four-point star inside an orbit. Drawn rather than imported so
 * it inherits currentColor and stays crisp at any size.
 */
export function CadabryMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <ellipse
        cx="12"
        cy="12"
        rx="10.25"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.42"
        transform="rotate(-28 12 12)"
      />
      <path
        d="M12 3.5c.55 4.3 1.7 5.45 6 6-4.3.55-5.45 1.7-6 6-.55-4.3-1.7-5.45-6-6 4.3-.55 5.45-1.7 6-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <CadabryMark className="h-5 w-5 text-accent" />
      <span className="text-title-3 font-semibold tracking-[-0.02em] text-foreground">
        Cadabry
      </span>
    </span>
  );
}
