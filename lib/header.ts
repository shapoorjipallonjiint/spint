// Website header content managed in admin (Header page). Shared by the API route, the website layouts and the
// header components (desktop navbars, mobile menu, homepage menu overlays).

export type HeaderLink = { label: string; label_ar: string; href: string };
// a top-level menu item; with submenu links it opens a dropdown, otherwise it links to href
export type HeaderMenuItem = { title: string; title_ar: string; href: string; submenu: HeaderLink[] };
export type HeaderPortal = { label: string; label_ar: string; href: string; hidden: boolean };

export type HeaderData = {
    menu: HeaderMenuItem[];
    // "Employee Login" button
    portal: HeaderPortal;
};

export const HEADER_TAG = "header";

// the header as it was before it became editable; used until the first save and whenever loading fails
export const DEFAULT_HEADER: HeaderData = {
    menu: [
        {
            title: "About",
            title_ar: "",
            href: "",
            submenu: [
                { label: "Overview", label_ar: "", href: "/about-us" },
                { label: "Leadership", label_ar: "", href: "/leadership" },
            ],
        },
        {
            title: "Services",
            title_ar: "",
            href: "",
            submenu: [
                { label: "Engineering & Construction", label_ar: "", href: "/services/engineering-construction" },
                { label: "Mechanical, Electrical & Plumbing", label_ar: "", href: "/services/mep" },
                { label: "Interior Fit-out", label_ar: "", href: "/services/interior-design" },
                { label: "Facade", label_ar: "", href: "/services/facade" },
                { label: "Facilities Management", label_ar: "", href: "/services/integrated-facility-management" },
                { label: "Water", label_ar: "", href: "/services/water" },
                { label: "Design Studio", label_ar: "", href: "/services/design-studio" },
            ],
        },
        { title: "Global Presence", title_ar: "", href: "/global-presence", submenu: [] },
        { title: "Projects", title_ar: "", href: "/projects", submenu: [] },
        {
            title: "Our Commitments",
            title_ar: "",
            href: "",
            submenu: [
                { label: "Accreditations", label_ar: "", href: "/accreditation" },
                { label: "Health, Safety and Environment", label_ar: "", href: "/hse" },
                { label: "Quality", label_ar: "", href: "/quality" },
                { label: "Sustainability", label_ar: "", href: "/sustainability" },
                { label: "Community Engagement", label_ar: "", href: "/community-engagement" },
            ],
        },
        {
            title: "Media",
            title_ar: "",
            href: "",
            submenu: [{ label: "Gallery", label_ar: "", href: "/gallery" }],
        },
        { title: "People & Careers", title_ar: "", href: "/careers", submenu: [] },
        { title: "Contact", title_ar: "", href: "/contact-us", submenu: [] },
    ],
    portal: {
        label: "Employee Login",
        label_ar: "",
        href: "https://portal.zinghr.ae/2015/pages/authentication/zing.aspx?ccode=shapoorji",
        hidden: false,
    },
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];

const normalizeLinks = (value: unknown): HeaderLink[] =>
    list(value)
        .map((link) => ({ label: str(link.label), label_ar: str(link.label_ar), href: str(link.href) }))
        .filter((link) => link.label && link.href);

// every field present (the _ar keys too, so the language switch works) and empty rows dropped
export function normalizeHeader(value: unknown): HeaderData {
    const data = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    const portal = (data.portal && typeof data.portal === "object" ? data.portal : {}) as Record<string, unknown>;
    return {
        menu: list(data.menu)
            .map((item) => ({
                title: str(item.title),
                title_ar: str(item.title_ar),
                href: str(item.href),
                submenu: normalizeLinks(item.submenu),
            }))
            // an item needs somewhere to go: its own link or a dropdown
            .filter((item) => item.title && (item.href || item.submenu.length)),
        portal: {
            label: str(portal.label),
            label_ar: str(portal.label_ar),
            href: str(portal.href),
            hidden: portal.hidden === true,
        },
    };
}

// Server components (layouts): the header through the API, cached and refreshed instantly when an admin saves it
// (the PATCH revalidates this tag). Falls back to the default header on any error.
export async function fetchHeader(): Promise<HeaderData> {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/admin/header`, {
            next: { revalidate: 60, tags: [HEADER_TAG] },
        });
        if (!res.ok) return DEFAULT_HEADER;
        const json = await res.json();
        return normalizeHeader(json?.data);
    } catch {
        return DEFAULT_HEADER;
    }
}
