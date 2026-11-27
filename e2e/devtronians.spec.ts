import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("[EX-1] dark page with Devtronians centred and gently moving", async ({
  page,
}) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { name: "Devtronians" });
  await expect(h1).toBeVisible();
  const box = await h1.boundingBox();
  const vp = page.viewportSize();
  expect(box && vp).toBeTruthy();
  if (box && vp) {
    expect(Math.abs(box.x + box.width / 2 - vp.width / 2)).toBeLessThan(10);
    expect(Math.abs(box.y + box.height / 2 - vp.height / 2)).toBeLessThan(20);
  }
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe("rgb(11, 13, 20)");
  const anim = await h1.evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe("drift");
});

test("[EX-2] only the word, nothing focusable, no login", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveText("Devtronians");
  await page.keyboard.press("Tab");
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).toBe("BODY");
  await expect(page.locator("a, button, input, nav, form")).toHaveCount(0);
  // `as never`: axe bundles its own copy of the Playwright Page type.
  const results = await new AxeBuilder({ page: page as never }).analyze();
  const bad = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(bad).toEqual([]);
});

test("[EX-3] shows within seconds and is legible", async ({ page }) => {
  const start = Date.now();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Devtronians" })).toBeVisible();
  expect(Date.now() - start).toBeLessThan(3000);
  const results = await new AxeBuilder({ page: page as never })
    .withRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});
