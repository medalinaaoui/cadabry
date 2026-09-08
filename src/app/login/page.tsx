import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isOwnerSetupAvailable, authenticateWithPassword } from "@/server/auth/setup";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/server/auth/session";
import { AuthError } from "@/server/auth/errors";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { AuthLayout } from "@/components/shell/auth-layout";

export const metadata = { title: "Sign in" };

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
        sessionCookieOptions(issued.expiresAt),
      );
    } catch (e) {
      const msg =
        e instanceof AuthError
          ? "Invalid email or password."
          : "Something went wrong. Try again.";
      redirect(`/login?error=${encodeURIComponent(msg)}`);
    }
    redirect("/");
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Your universe is where you left it." error={error}>
      <form action={handleLogin} className="space-y-4">
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          autoFocus
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
