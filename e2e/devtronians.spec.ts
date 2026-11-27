import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type AxePage = ConstructorParameters<typeof AxeBuilder>[0]["page"];

async function expectNoSeriousViolations(page: Page) {
  // axe resolves its own copy of the Playwright types, so the two `Page`
  // types differ in this install; it is the same object at run time.
  const results = await new AxeBuilder({
    page: page as unknown as AxePage,
  }).analyze();
  const bad = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(bad).toEqual([]);
}

test("[EX-1] by keyboard, a visitor opens About from the home page and reads the sample story without signing in", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Devtronians" }),
  ).toBeVisible();
  await expectNoSeriousViolations(page);

  await page.keyboard.press("Tab");
  const link = page.getByRole("link", { name: "เกี่ยวกับเรา", exact: true });
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "เรื่องราวของธุรกิจ" }),
  ).toBeVisible();
  await expect(page.getByText(/^ข้อความตัวอย่าง/)).toBeVisible();
  await expect(page.getByText(/ธุรกิจของเราเริ่มต้นจากความตั้งใจ/)).toBeVisible();
  await expect(page.locator("input, button, form")).toHaveCount(0);
  await expectNoSeriousViolations(page);

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "กลับหน้าแรก", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { level: 1, name: "Devtronians" }),
  ).toBeVisible();
});

test("[EX-1] the About page opens directly by its address and fits a 320 px screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { level: 2, name: "เรื่องราวของธุรกิจ" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expectNoSeriousViolations(page);
});
