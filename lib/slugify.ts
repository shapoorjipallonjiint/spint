// URL-safe slug from an English name: "Côte d’Ivoire" -> "cote-d-ivoire", "Engineering & Construction" -> "engineering-and-construction".
// Used for the /projects filter query params (and by the maps that link to a filtered /projects).
export const slugify = (value?: string | null) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
