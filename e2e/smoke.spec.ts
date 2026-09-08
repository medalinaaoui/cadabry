import { test, expect } from "@playwright/test";

const OWNER_EMAIL = "medali@cadabry.app";
const OWNER_PASSWORD = "strong-password-2026!";

test("owner setup → dashboard → project → resume", async ({ page }) => {
  // If the current URL is /login, the owner already exists → sign in instead.
  await page.goto("/");

  if (page.url().includes("/login")) {
    await page.getByLabel("Email").fill(OWNER_EMAIL);
    await page.getByLabel("Password").fill(OWNER_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
  } else {
    await page.waitForURL(/\/setup$/, { timeout: 15_000 });
    await page.getByLabel("Display name").fill("Med Ali");
    await page.getByLabel("Email").fill(OWNER_EMAIL);
    await page.getByLabel("Password", { exact: true }).fill(OWNER_PASSWORD);
    await page.getByLabel("Confirm password").fill(OWNER_PASSWORD);
    await page.getByRole("button", { name: "Create your workspace" }).click();
  }

  await page.waitForURL(/\/$/, { timeout: 20_000 });

  // Create a project — unique name per run
  const projectName = `Test App ${Date.now() % 100000}`;
  const slug = projectName.toLowerCase().replace(/\s+/g, "-");

  await page.goto("/projects/new");
  await page.getByLabel("Project name").fill(projectName);
  await page.getByLabel("One-line description").fill("A test project for the smoke flow");
  await page.getByRole("button", { name: "Create Project" }).click();

  await page.waitForURL(new RegExp(`/${slug}$`), { timeout: 20_000 });
  await page.getByRole("heading", { name: projectName }).waitFor({ timeout: 10_000 });

  // Open Resume Building
  await page.getByRole("link", { name: "Resume Building" }).click();
  await page.waitForURL(/\/resume$/, { timeout: 10_000 });
  await page.getByRole("heading", { name: "Resume Building" }).waitFor({ timeout: 10_000 });

  // Verify a context packet was generated
  const pre = page.locator("pre");
  await pre.waitFor({ timeout: 10_000 });
  const text = await pre.textContent();
  expect(text).toContain("# " + projectName);
  expect(text).toContain("## Current task");
  expect(text).toContain("## Instructions");

  // Go to prompts library
  await page.goto("/prompts");
  await page.getByRole("heading", { name: "Prompt library" }).waitFor({ timeout: 10_000 });

  // Quick capture flow
  await page.goto("/");
  await page.getByRole("button", { name: "Capture a thought" }).first().click();
  await page.getByLabel("New thought").fill("Add Stripe customer portal later");
  await page.getByRole("button", { name: "Capture", exact: true }).click();
  await page.getByText("Captured to inbox").waitFor({ timeout: 10_000 });

  // Logout works
  await page.goto("/logout");
  await page.waitForURL(/\/login$/, { timeout: 10_000 });
  await page.getByRole("button", { name: "Sign in" }).waitFor({ timeout: 10_000 });
});
