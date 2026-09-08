/**
 * Route-level skeleton. Shapes mirror the universe header and star field so
 * the page doesn't visibly reflow when the real content arrives.
 */
export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-(--page-max) px-(--gutter) py-10 md:px-(--gutter-lg)"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-3 w-24 animate-pulse rounded-full bg-surface-raised" />
      <div className="mt-3 h-8 w-64 animate-pulse rounded-lg bg-surface-raised" />
      <div className="mt-6 h-28 animate-pulse rounded-2xl bg-surface" />
      <div className="mt-4 h-96 animate-pulse rounded-3xl bg-surface" />
    </div>
  );
}
