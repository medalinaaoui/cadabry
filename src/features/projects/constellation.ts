/**
 * Constellation layout.
 *
 * Projects are placed on a golden-angle (phyllotaxis) spiral: the same
 * arrangement sunflower seeds use. Two properties earn it here —
 *
 *   1. Points never collide and never form visible rows, so the field reads as
 *      a sky rather than a grid in disguise.
 *   2. It is a pure function of index, so the layout is identical on the
 *      server and the client and stable across reloads. A project keeps its
 *      place in the sky, which is what makes the map learnable.
 *
 * Order is "most recently touched first", so live work sits near the centre
 * and dormant work drifts to the rim.
 */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 137.5°

export type NodePlacement = {
  /** Horizontal position as a percentage of the field. */
  x: number;
  /** Vertical position as a percentage of the field. */
  y: number;
  /** Node diameter in px, before importance scaling. */
  size: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  driftDelay: number;
};

/** Cheap deterministic hash → the drift of each node differs but never changes. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Below this count a spiral looks like an accident rather than a design — the
 * first few points cluster on one side and leave half the sky empty. Small
 * universes get an evenly-spaced ring instead, which reads as deliberate.
 */
const RING_THRESHOLD = 7;

export function placeNode(
  index: number,
  total: number,
  seed: string,
  importance: number,
): NodePlacement {
  let x: number;
  let y: number;

  if (total <= RING_THRESHOLD) {
    // One ring, evenly divided. The quarter-turn offset puts the first (most
    // recently active) project at the top rather than out on the right edge.
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    // A gentle inward pull on alternating nodes keeps a ring of 4+ from
    // reading as a perfect circle, which would look mechanical.
    const radius = index % 2 === 0 ? 1 : 0.82;
    x = 50 + Math.cos(angle) * radius * 35;
    y = 50 + Math.sin(angle) * radius * 28;
  } else {
    // Spread the spiral to fill the field. sqrt keeps the density even.
    const t = index / (total - 1);
    const radius = Math.sqrt(t);
    const angle = index * GOLDEN_ANGLE;

    // The field is wider than it is tall, so the spiral is stretched to match
    // rather than leaving vertical bands of empty sky.
    x = 50 + Math.cos(angle) * radius * 39;
    y = 50 + Math.sin(angle) * radius * 34;
  }

  // Keep node centers inside a safe band: labels + orbs need clearance from
  // the field's top and bottom edges, or the constellation crops itself.
  y = Math.min(Math.max(y, 18), 74);

  const r1 = hash(seed);
  const r2 = hash(`${seed}:drift`);

  // Importance 0–5 maps to a real but restrained size range: a flagship reads
  // as larger without a side project becoming unclickable.
  const size = 64 + Math.min(Math.max(importance, 0), 5) * 8;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    size,
    driftX: Math.round((r1 * 10 - 5) * 10) / 10,
    driftY: Math.round((r2 * 10 - 6) * 10) / 10,
    driftDuration: Math.round((14 + r1 * 10) * 10) / 10,
    driftDelay: Math.round(r2 * -12 * 10) / 10,
  };
}

export type Star = { x: number; y: number; r: number; o: number; delay: number };

/**
 * Background stars. Seeded so server and client render the same sky — a
 * Math.random() field would hydrate into a different constellation every load
 * and throw a mismatch.
 */
export function generateStars(count: number, seed = 1): Star[] {
  let state = seed * 9301 + 49297;
  const next = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const r = next();
    stars.push({
      x: Math.round(next() * 10000) / 100,
      y: Math.round(next() * 10000) / 100,
      // Most stars are dust; a handful are bright enough to notice.
      r: Math.round((r > 0.94 ? 1.5 : r > 0.75 ? 1 : 0.6) * 100) / 100,
      o: Math.round((0.18 + next() * 0.5) * 100) / 100,
      delay: Math.round(next() * 6000) / 1000,
    });
  }
  return stars;
}
