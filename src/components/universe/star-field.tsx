import { generateStars } from "@/features/projects/constellation";
import { cn } from "@/lib/cn";

const STARS = generateStars(180);
const BRIGHT = STARS.filter((s) => s.r > 1.2);

/**
 * The sky behind the constellation. Purely decorative, so it is hidden from
 * assistive technology and never intercepts a pointer event.
 *
 * Only the handful of bright stars twinkle — animating all 180 would cost more
 * than it says, and a field that shimmers everywhere reads as noise.
 */
export function StarField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("sky pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.r / 10}
            fill={i % 11 === 0 ? "var(--gold-300)" : "var(--ink-50)"}
            opacity={star.o}
          />
        ))}
        {BRIGHT.map((star, i) => (
          <circle
            key={`b${i}`}
            cx={star.x}
            cy={star.y}
            r={star.r / 9}
            fill="var(--ink-50)"
            style={{
              animation: `cadabry-twinkle ${4 + (i % 4)}s var(--ease-in-out) ${star.delay}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* Vignette: settles the edges so nodes near the rim don't float off. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_38%,var(--ink-980)_100%)]" />
    </div>
  );
}
