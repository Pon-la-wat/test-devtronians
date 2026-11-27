import { readFileSync } from "node:fs";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../src/App";

afterEach(cleanup);

const css = readFileSync("src/styles.css", "utf8");

describe("Devtronians page", () => {
  it("[EX-1] shows Devtronians centred on a dark background with gentle motion", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Devtronians" }),
    ).toBeTruthy();
    expect(css).toMatch(/background:[^;]*#0b0d14/);
    expect(css).toMatch(/color:\s*#f4f6ff/);
    expect(css).toMatch(/justify-content:\s*center/);
    expect(css).toMatch(/align-items:\s*center/);
    expect(css).toMatch(/animation:\s*drift/);
  });

  it("[EX-2] shows no menu, button, link, input or other text", () => {
    const { container } = render(<App />);
    expect(container.textContent).toBe("Devtronians");
    expect(
      container.querySelectorAll("a, button, input, nav, img, form"),
    ).toHaveLength(0);
  });

  it("[EX-3] renders at once with no async work and keeps the word legible", () => {
    render(<App />);
    expect(screen.getByText("Devtronians")).toBeTruthy();
    // light text (#f4f6ff) on near-black (#0b0d14); reduced motion is respected
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).not.toMatch(/opacity/);
  });
});
