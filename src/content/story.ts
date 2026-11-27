/**
 * The business story shown on the About page: the single place to edit.
 *
 * When the owner has the real text, replace `paragraphs` with it and set
 * `isSample` to false. The About page then shows the new text and drops the
 * "sample" notice; no page needs to be created or changed.
 */
export interface BusinessStory {
  /** True while the text below is placeholder text. */
  isSample: boolean;
  /** Section heading. */
  title: string;
  /** The story, one string per paragraph. */
  paragraphs: readonly string[];
}

export const story: BusinessStory = {
  isSample: true,
  title: "เรื่องราวของธุรกิจ",
  paragraphs: [
    "ธุรกิจของเราเริ่มต้นจากความตั้งใจเล็ก ๆ ที่อยากทำสิ่งดี ๆ ให้ลูกค้าทุกคน",
    "เราใส่ใจในคุณภาพและการบริการ เพื่อให้ทุกครั้งที่ลูกค้าเลือกเรา เป็นความประทับใจที่อยากกลับมาอีก",
    "ขอบคุณที่แวะมารู้จักกัน เรื่องราวที่แท้จริงของเราจะมาเล่าให้ฟังที่นี่เร็ว ๆ นี้",
  ],
};
