import { About } from "./About";

export const ABOUT_PATH = "/about";

function isAbout(path: string): boolean {
  return path.replace(/\/+$/, "") === ABOUT_PATH;
}

/** The home page (brand name and a link to About) or the About page. */
export function App({ path }: { path?: string }) {
  if (isAbout(path ?? window.location.pathname)) return <About />;
  return (
    <main className="stage">
      <nav className="topnav" aria-label="เมนูหลัก">
        <a href={ABOUT_PATH}>เกี่ยวกับเรา</a>
      </nav>
      <h1 className="brand">Devtronians</h1>
    </main>
  );
}
