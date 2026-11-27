import { useEffect } from "react";
import { story } from "./content/story";

/** The About page: open to everyone, no sign-in. */
export function About() {
  useEffect(() => {
    const previous = document.title;
    document.title = `${story.title} | Devtronians`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="about">
      <nav className="topnav" aria-label="เมนูหลัก">
        <a href="/">กลับหน้าแรก</a>
      </nav>
      <h1 className="about-title">เกี่ยวกับเรา</h1>
      <section aria-labelledby="story-heading" className="story">
        <h2 id="story-heading">{story.title}</h2>
        {story.isSample && (
          <p className="sample-badge">
            ข้อความตัวอย่าง: ยังไม่ใช่เรื่องราวจริงของธุรกิจ
          </p>
        )}
        {story.paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </section>
    </main>
  );
}
