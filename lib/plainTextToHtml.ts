// Descriptions saved before the rich-text editor are plain text with "\n" between paragraphs.
// Loaded as-is, the editor would read them as HTML and merge every paragraph into one, so wrap
// each line in its own <p> first. HTML (already saved by the editor) is passed through unchanged.
export const isHtml = (value?: string) => typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value);

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const plainTextToHtml = (value?: string) => {
  if (!value) return "";
  if (isHtml(value)) return value;
  return value
    .split("\n")
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : "<p><br></p>"))
    .join("");
};
