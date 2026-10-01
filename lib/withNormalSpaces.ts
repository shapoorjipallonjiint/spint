// CMS text pasted from Word/web often joins every word with &nbsp;, which turns a whole sentence into one
// unbreakable "word" (small screens then cut it mid-word). Render those as normal spaces so text wraps
// between words. Display only - the stored content is not changed.
export const withNormalSpaces = (html?: string | unknown[]) =>
  typeof html === "string" ? html.replace(/&nbsp;| /g, " ") : "";
