import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isOwnerSetupAvailable, setupOwner } from "@/server/auth/setup";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/server/auth/session";
import { AuthError } from "@/server/auth/errors";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const available = await isOwnerSetupAvailable();
  if (!available) redirect("/login");

  const { error } = await searchParams;

  async function handleSetup(formData: FormData) {
    "use server";
    const displayName = formData.get("displayName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      redirect("/setup?error=Passwords+do+not+match");
    }

    try {
      const issued = await setupOwner({ displayName, email, password });
      const cookieStore = await cookies();
      cookieStore.set(
        SESSION_COOKIE_NAME,
        issued.token,
        sessionCookieOptions(issued.expiresAt)
      );
    } catch (e) {
      const msg =
        e instanceof AuthError
          ? "Invalid input. Check your details."
          : "Something went wrong. Try again.";
      redirect(`/setup?error=${encodeURIComponent(msg)}`);
    }
    redirect("/");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-accent">Cadabry</h1>
          <p className="mt-2 text-sm text-muted">
            Your universe of unfinished ideas becoming real software.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <form action={handleSetup} className="space-y-5">
          <Field label="Display name" name="displayName" type="text" placeholder="Your name" autoComplete="name" required />
          <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          <Field label="Password" name="password" type="password" placeholder="At least 12 characters" autoComplete="new-password" minLength={12} required />
          <Field label="Confirm password" name="passwordConfirm" type="password" placeholder="Re-enter password" autoComplete="new-password" minLength={12} required />
          <Button type="submit" variant="primary" className="w-full">
            Create your workspace
          </Button>
        </form>
      </div>
    </main>
  );
}
