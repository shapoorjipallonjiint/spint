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
