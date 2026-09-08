import type { ReactNode } from "react";
import { StarField } from "@/components/universe/star-field";
import { Wordmark } from "./brand";

/**
 * Shared frame for the signed-out screens. The star field is the app's first
 * impression, so the gate sits inside the same universe rather than on a plain
 * grey card.
 */
export function AuthLayout({
  title,
  subtitle,
  error,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main id="main" className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6">
      <StarField />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-7 flex justify-center">
          <Wordmark />
        </div>

        <div className="glass rounded-2xl p-7">
          <h1 className="text-title-1 text-foreground">{title}</h1>
          {subtitle && <p className="mt-1.5 text-body text-muted">{subtitle}</p>}

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-body text-danger"
            >
              {error}
            </p>
          )}

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-5 text-center text-caption text-subtle">{footer}</div>}
      </div>
    </main>
  );
}
