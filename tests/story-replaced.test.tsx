import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// The team replaces the text in the one content file; nothing else changes.
vi.mock("../src/content/story", () => ({
  story: {
    isSample: false,
    title: "เรื่องราวของธุรกิจ",
    paragraphs: ["เราเริ่มจากร้านเล็ก ๆ ริมคลอง เมื่อปี 2540"],
  },
}));

import { App } from "../src/App";

afterEach(cleanup);

describe("About page with the real story", () => {
  it("[EX-2] shows the new text on the same page and no sample notice", () => {
    render(<App path="/about" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "เรื่องราวของธุรกิจ" }),
    ).toBeTruthy();
    expect(
      screen.getByText("เราเริ่มจากร้านเล็ก ๆ ริมคลอง เมื่อปี 2540"),
    ).toBeTruthy();
    expect(screen.queryByText(/ข้อความตัวอย่าง/)).toBeNull();
    expect(screen.queryByText(/ธุรกิจของเราเริ่มต้นจากความตั้งใจ/)).toBeNull();
  });

  it("[EX-2] the link on the home page still leads to that same page", () => {
    render(<App path="/" />);
    expect(
      screen.getByRole("link", { name: "เกี่ยวกับเรา" }).getAttribute("href"),
    ).toBe("/about");
  });
});
