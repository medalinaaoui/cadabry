import { placeNode } from "@/features/projects/constellation";

/**
 * The lines that make a set of stars a constellation.
 *
 * Purely decorative, so it is hidden from assistive technology — the list
 * underneath already carries the projects and their order.
 */
export function ConstellationLines({
  projects,
}: {
  projects: { id: string; importance: number }[];
}) {
  if (projects.length < 2) return null;

  const points = projects.map((project, i) =>
    placeNode(i, projects.length, project.id, project.importance),
  );

  // Walk the nodes by their angle around the centre rather than by index.
  // Connecting spiral neighbours in index order would send lines clear across
  // the field (consecutive golden-angle points sit ~137° apart) and tangle
  // into a web; an angular sweep is a star-shaped polygon, so it can never
  // cross itself.
  const ordered = [...points].sort(
    (a, b) => Math.atan2(a.y - 50, a.x - 50) - Math.atan2(b.y - 50, b.x - 50),
  );

  // Closed, so the constellation reads as one figure rather than a loose path.
  const path = [...ordered, ordered[0]!].map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      focusable="false"
    >
      <polyline
        points={path}
        fill="none"
        stroke="var(--constellation)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="3 7"
        opacity="0.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
