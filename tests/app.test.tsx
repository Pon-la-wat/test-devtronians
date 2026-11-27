import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { story } from "../src/content/story";

afterEach(cleanup);

describe("Home page", () => {
  it("shows the brand name and a link to the About page", () => {
    render(<App path="/" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Devtronians" }),
    ).toBeTruthy();
    const link = screen.getByRole("link", { name: "เกี่ยวกับเรา" });
    expect(link.getAttribute("href")).toBe("/about");
  });
});

describe("About page", () => {
  it("[EX-1] shows the business story heading with labelled Thai sample text, no sign-in", () => {
    render(<App path="/about" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "เรื่องราวของธุรกิจ" }),
    ).toBeTruthy();
    expect(screen.getByText(/^ข้อความตัวอย่าง/)).toBeTruthy();
    expect(story.paragraphs.length).toBeGreaterThan(0);
    for (const paragraph of story.paragraphs) {
      expect(screen.getByText(paragraph)).toBeTruthy();
    }
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByLabelText(/รหัสผ่าน|password/i)).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(
      screen.getByRole("link", { name: "กลับหน้าแรก" }).getAttribute("href"),
    ).toBe("/");
  });

  it("[EX-1] marks the document as Thai on the About page and restores the language when leaving", () => {
    document.documentElement.lang = "en";
    const { unmount } = render(<App path="/about" />);
    expect(document.documentElement.lang).toBe("th");
    unmount();
    expect(document.documentElement.lang).toBe("en");
  });

  it("[EX-1] the home page keeps the document language and marks only the Thai link as Thai", () => {
    document.documentElement.lang = "en";
    render(<App path="/" />);
    expect(document.documentElement.lang).toBe("en");
    expect(
      screen.getByRole("link", { name: "เกี่ยวกับเรา" }).getAttribute("lang"),
    ).toBe("th");
  });

  it("opens the same page with a trailing slash", () => {
    render(<App path="/about/" />);
    expect(
      screen.getByRole("heading", { name: "เรื่องราวของธุรกิจ" }),
    ).toBeTruthy();
  });
});
