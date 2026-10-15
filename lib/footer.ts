// Footer content managed in admin (Footer page). Shared by the API route, the website layouts and the footers.

export type FooterLink = { label: string; label_ar: string; href: string };
export type FooterColumn = { title: string; title_ar: string; links: FooterLink[] };
// hidden icons stay saved in admin but are not shown on the website
export type FooterSocial = { name: string; icon: string; href: string; hidden: boolean };

export type FooterData = {
    logo: string;
    logoAlt: string;
    logoAlt_ar: string;
    address: string;
    address_ar: string;
    phone: string;
    email: string;
    socials: FooterSocial[];
    columns: FooterColumn[];
    // "{year}" is replaced with the current year
    copyright: string;
    copyright_ar: string;
    bottomLinks: FooterLink[];
};

export const FOOTER_TAG = "footer";

// the footer as it was before it became editable; used until the first save and whenever loading fails
export const DEFAULT_FOOTER: FooterData = {
    logo: "/assets/images/sp-logo.png",
    logoAlt: "SP International",
    logoAlt_ar: "",
    address: "Al Hudaiba Mall, Al Mina Street P.O. Box No. 118219\nDubai, UAE, Office 307, 3rd Floor",
    address_ar: "",
    phone: "+971 42156222",
    email: "info@spinternational.ae",
    socials: [
        { name: "Instagram", icon: "/assets/images/icons/insta-white.svg", href: "#", hidden: false },
        { name: "LinkedIn", icon: "/assets/images/icons/linked-in.svg", href: "#", hidden: false },
        { name: "YouTube", icon: "/assets/images/icons/youtube.svg", href: "#", hidden: false },
    ],
    columns: [
        {
            title: "About",
            title_ar: "",
            links: [
                { label: "Overview", label_ar: "", href: "/about-us" },
                { label: "Legacy", label_ar: "", href: "#" },
                { label: "Leadership", label_ar: "", href: "/leadership" },
            ],
        },
        {
            title: "Services",
            title_ar: "",
            links: [
                { label: "Engineering & Construction", label_ar: "", href: "/services/engineering-construction" },
                { label: "MEP", label_ar: "", href: "/services/mep" },
                { label: "Interior Fit-out", label_ar: "", href: "/services/interior-design" },
                { label: "Facade", label_ar: "", href: "/services/facade" },
                { label: "Facilities Management", label_ar: "", href: "/services/integrated-facility-management" },
                { label: "Water", label_ar: "", href: "/services/water" },
            ],
        },
        {
            title: "Commitments",
            title_ar: "",
            links: [
                { label: "Sustainability", label_ar: "", href: "/sustainability" },
                { label: "Community Engagement", label_ar: "", href: "/community-engagement" },
                { label: "Safety & Quality", label_ar: "", href: "/quality" },
            ],
        },
        {
            title: "Media",
            title_ar: "",
            links: [
                { label: "Press Releases", label_ar: "", href: "/press-releases" },
                { label: "Media Coverage", label_ar: "", href: "#" },
                { label: "Thought Leadership", label_ar: "", href: "#" },
            ],
        },
        {
            title: "Quick Links",
            title_ar: "",
            links: [
                { label: "Careers", label_ar: "", href: "/careers" },
                { label: "Projects", label_ar: "", href: "/projects" },
                { label: "Terms and Conditions", label_ar: "", href: "/terms-and-conditions" },
            ],
        },
    ],
    copyright: "Copyright ©{year} All Rights Reserved",
    copyright_ar: "",
    bottomLinks: [
        { label: "Privacy Policy", label_ar: "", href: "#" },
        { label: "Cookie Policy", label_ar: "", href: "#" },
    ],
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];

const normalizeLinks = (value: unknown): FooterLink[] =>
    list(value)
        .map((link) => ({ label: str(link.label), label_ar: str(link.label_ar), href: str(link.href) }))
        .filter((link) => link.label && link.href);

// every field present (the _ar keys too, so the language switch works) and empty rows dropped
export function normalizeFooter(value: unknown): FooterData {
    const data = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    return {
        logo: str(data.logo),
        logoAlt: str(data.logoAlt),
        logoAlt_ar: str(data.logoAlt_ar),
        address: str(data.address),
        address_ar: str(data.address_ar),
        phone: str(data.phone),
        email: str(data.email),
        socials: list(data.socials)
            .map((social) => ({
                name: str(social.name),
                icon: str(social.icon),
                href: str(social.href),
                hidden: social.hidden === true,
            }))
            .filter((social) => social.icon && social.href),
        columns: list(data.columns)
            .map((column) => ({ title: str(column.title), title_ar: str(column.title_ar), links: normalizeLinks(column.links) }))
            .filter((column) => column.title),
        copyright: str(data.copyright),
        copyright_ar: str(data.copyright_ar),
        bottomLinks: normalizeLinks(data.bottomLinks),
    };
}

// Server components (layouts): the footer through the API, cached and refreshed instantly when an admin saves it
// (the PATCH revalidates this tag). Falls back to the default footer on any error.
export async function fetchFooter(): Promise<FooterData> {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/admin/footer`, {
            next: { revalidate: 60, tags: [FOOTER_TAG] },
        });
        if (!res.ok) return DEFAULT_FOOTER;
        const json = await res.json();
        return normalizeFooter(json?.data);
    } catch {
        return DEFAULT_FOOTER;
    }
}

// "tel:" link from a display number like "+971 42156222"
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/i.test(href);
