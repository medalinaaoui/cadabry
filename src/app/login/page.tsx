import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { isOwnerSetupAvailable, authenticateWithPassword } from "@/server/auth/setup";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/server/auth/session";
import { AuthError } from "@/server/auth/errors";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const setupAvailable = await isOwnerSetupAvailable();
  if (setupAvailable) redirect("/setup");

  const { error } = await searchParams;

  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const issued = await authenticateWithPassword(email, password);
      const cookieStore = await cookies();
      cookieStore.set(
        SESSION_COOKIE_NAME,
        issued.token,
        sessionCookieOptions(issued.expiresAt)
      );
    } catch (e) {
      const msg = e instanceof AuthError
        ? "Invalid email or password."
        : "Something went wrong. Try again.";
      redirect(`/login?error=${encodeURIComponent(msg)}`);
    }
    redirect("/");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight text-accent">Cadabry</h1>
          </Link>
          <p className="mt-2 text-sm text-muted">
            Welcome back to your workspace.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <form action={handleLogin} className="space-y-5">
          <Field label="Email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          <Field label="Password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
