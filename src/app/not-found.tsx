import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="eyebrow">Off the map</p>
      <h1 className="mt-2 text-title-1 text-foreground">Nothing orbits here</h1>
      <p className="mt-3 text-body text-muted">
        This page doesn&apos;t exist, or it isn&apos;t part of your workspace.
      </p>
      <div className="mt-7">
        <Button asChild variant="primary" size="lg">
          <Link href="/">Back to your universe</Link>
        </Button>
      </div>
    </main>
  );
}
