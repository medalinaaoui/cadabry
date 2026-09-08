"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="eyebrow">Something interrupted you</p>
      <h1 className="mt-2 text-title-1 text-foreground">This view didn&apos;t load</h1>
      <p className="mt-3 text-body text-muted">
        Nothing was lost — everything you saved is still in the database. Try loading it again.
      </p>
      <div className="mt-7">
        <Button variant="primary" size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
