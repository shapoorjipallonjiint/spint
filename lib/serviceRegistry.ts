// The 7 services, identified by a fixed slug (= their page URL /services/<slug> and the `link` field stored on each
// service document). Used by the show/hide feature (admin Services > Main) and everywhere services are listed.
export const SERVICE_REGISTRY = [
  { slug: "engineering-construction", name: "Engineering & Construction", adminHref: "/admin/services/engineering-and-construction" },
  { slug: "mep", name: "MEP", adminHref: "/admin/services/mep" },
  { slug: "design-studio", name: "Design Studio", adminHref: "/admin/services/design-studio" },
  { slug: "interior-design", name: "Interior Design", adminHref: "/admin/services/interior-design" },
  { slug: "facade", name: "Facade", adminHref: "/admin/services/facade" },
  { slug: "integrated-facility-management", name: "Integrated Facility Management", adminHref: "/admin/services/integrated-facility-management" },
  { slug: "water", name: "Water", adminHref: "/admin/services/water" },
] as const;

export type ServiceSlug = (typeof SERVICE_REGISTRY)[number]["slug"];

export const SERVICE_SLUGS: string[] = SERVICE_REGISTRY.map((s) => s.slug);

export const isKnownServiceSlug = (slug: unknown): slug is ServiceSlug =>
  typeof slug === "string" && SERVICE_SLUGS.includes(slug);

// "/services/mep", "/ar/services/mep/", "mep" -> "mep" (null when it is not a service link)
export const serviceSlugFromHref = (href?: string | null) => {
  if (!href) return null;
  const match = String(href).match(/(?:^|\/)services\/([a-z0-9-]+)/);
  const slug = match ? match[1] : String(href).replace(/^\/+|\/+$/g, "");
  return isKnownServiceSlug(slug) ? slug : null;
};

// Saved order -> every known service exactly once (saved ones first, any missing ones after in registry order).
// An empty saved order stays empty: the services were never reordered and every list keeps its own order.
export const normalizeServiceOrder = (order?: unknown): string[] => {
  if (!Array.isArray(order) || !order.length) return [];
  const known = order.filter((slug, i) => isKnownServiceSlug(slug) && order.indexOf(slug) === i) as string[];
  return [...known, ...SERVICE_SLUGS.filter((slug) => !known.includes(slug))];
};

// Puts the service items of a list in the saved order. Items that are not services (slug null) keep their place,
// so mixed lists (menus) are safe. Returns the list untouched when there is no saved order.
export const sortByServiceOrder = <T>(items: T[], order: string[], getSlug: (item: T) => string | null | undefined): T[] => {
  if (!order.length || !Array.isArray(items)) return items;
  const rank = (item: T) => {
    const slug = getSlug(item);
    return slug ? order.indexOf(slug) : -1;
  };
  const serviceItems = items.filter((item) => rank(item) >= 0).sort((a, b) => rank(a) - rank(b));
  let next = 0;
  return items.map((item) => (rank(item) >= 0 ? serviceItems[next++] : item));
};
