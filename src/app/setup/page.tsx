import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isOwnerSetupAvailable, setupOwner } from "@/server/auth/setup";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/server/auth/session";
import { AuthError } from "@/server/auth/errors";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { AuthLayout } from "@/components/shell/auth-layout";

export const metadata = { title: "Create your workspace" };

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
    <AuthLayout
      title="Create your workspace"
      subtitle="Your universe of unfinished ideas becoming real software."
      error={error}
      footer="You're the owner. Public signup stays closed until you open it."
    >
      <form action={handleSetup} className="space-y-4">
        <Field
          label="Display name"
          name="displayName"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          required
          autoFocus
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          hint="At least 12 characters."
        />
        <Field
          label="Confirm password"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Create your workspace
        </Button>
      </form>
    </AuthLayout>
  );
}
