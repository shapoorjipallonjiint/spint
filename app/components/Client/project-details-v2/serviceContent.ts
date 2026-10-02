// A project service is shown on the project page only if something in it has real content.
// Rich-text fields count as empty when they contain no visible text (e.g. "<p><br></p>" or only &nbsp;).

type ServiceLike = {
  firstSection?: { title?: string; description?: unknown };
  secondSection?: { title?: string; description?: unknown };
  items?: { title?: string; description?: unknown }[];
  images?: ({ url?: string } | string)[];
};

const hasText = (value: unknown) =>
  typeof value === "string" &&
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;| /g, " ").trim() !== "";

export const hasServiceContent = (service?: ServiceLike | null) =>
  !!service &&
  (hasText(service.firstSection?.title) ||
    hasText(service.firstSection?.description) ||
    hasText(service.secondSection?.title) ||
    hasText(service.secondSection?.description) ||
    (service.items || []).some((item) => hasText(item?.title) || hasText(item?.description)) ||
    (service.images || []).some((img) => (typeof img === "string" ? img : img?.url)));
