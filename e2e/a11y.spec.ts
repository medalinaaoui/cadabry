import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const OWNER_EMAIL = "medali@cadabry.app";
const OWNER_PASSWORD = "strong-password-2026!";

/** Routes that exist regardless of which projects are seeded. */
const GLOBAL_ROUTES = [
  "/",
  "/prompts",
  "/starter",
  "/packs",
  "/skills",
  "/inbox",
  "/settings",
  "/projects/new",
];

const PROJECT_SECTIONS = [
  "",
  "/resume",
  "/queue",
  "/features",
  "/milestones",
  "/bugs",
  "/decisions",
  "/notes",
  "/inspirations",
  "/commands",
  "/env",
  "/sessions",
  "/timeline",
  "/export",
  "/edit",
];

async function signIn(page: Page) {
  await page.goto("/");
  if (page.url().includes("/login")) {
    await page.getByLabel("Email").fill(OWNER_EMAIL);
    await page.getByLabel("Password").fill(OWNER_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL((url) => !url.pathname.includes("login"), { timeout: 20_000 });
  }
}

async function scan(page: Page, route: string) {
  await page.goto(route, { waitUntil: "networkidle" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}) on ${v.nodes.length} node(s): ${v.help}`,
  );
  expect(summary, `Accessibility violations on ${route}`).toEqual([]);
}

test.describe("accessibility", () => {
  test("global routes have no WCAG A/AA violations", async ({ page }) => {
    await signIn(page);
    for (const route of GLOBAL_ROUTES) {
      await scan(page, route);
    }
  });

  test("every project section has no WCAG A/AA violations", async ({ page }) => {
    await signIn(page);

    // Use whichever project the universe lists first, so this works against
    // any seeded database rather than a hardcoded slug.
    await page.goto("/", { waitUntil: "networkidle" });
    const first = page.locator(".universe a.node").first();
    const hasProjects = (await first.count()) > 0;
    test.skip(!hasProjects, "No projects in the universe to audit");

    const slug = await first.getAttribute("href");
    expect(slug).toBeTruthy();

    for (const section of PROJECT_SECTIONS) {
      await scan(page, `${slug}${section}`);
    }
  });

  test("signed-out screens have no WCAG A/AA violations", async ({ page }) => {
    await page.goto("/logout");
    await page.waitForURL(/\/login$/, { timeout: 10_000 });
    await scan(page, "/login");
  });
});
