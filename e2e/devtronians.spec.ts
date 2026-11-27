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

test("[EX-1] the home page loads within seconds, is dark, centred and gently moving", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const brand = page.getByRole("heading", { level: 1, name: "Devtronians" });
  await expect(brand).toBeVisible({ timeout: 3000 });

  const look = await page.evaluate(() => {
    const h1 = document.querySelector("h1.brand") as HTMLElement;
    const stage = document.querySelector(".stage") as HTMLElement;
    return {
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      stageBackground: getComputedStyle(stage).backgroundImage,
      animation: getComputedStyle(h1).animationName,
    };
  });
  expect(look.bodyBackground).toBe("rgb(11, 13, 20)");
  expect(look.stageBackground).toContain("radial-gradient");
  expect(look.animation).toBe("drift");

  const box = await brand.boundingBox();
  expect(box).not.toBeNull();
  const centreX = box!.x + box!.width / 2;
  const centreY = box!.y + box!.height / 2;
  // The text drifts up and down by 6 px, so allow a little vertical slack.
  expect(Math.abs(centreX - 640)).toBeLessThanOrEqual(2);
  expect(Math.abs(centreY - 360)).toBeLessThanOrEqual(10);
});

test("[EX-1] the home page stops moving when the visitor prefers reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const animation = await page
    .getByRole("heading", { level: 1, name: "Devtronians" })
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe("none");
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
