"use client";

import ClientSideLink from "@/app/(admin)/4dm1n-5p1nt/client-side-link";
import { useEffect, useState } from "react";

import {
    HomeIcon,
    NewspaperIcon,
    UserGroupIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { FileText, GalleryThumbnails, LayoutDashboard, HeartHandshake, LeafIcon, PanelBottom, PanelTop, Settings, ThumbsUp, Workflow } from "lucide-react";
import { GiPaperBagFolded } from "react-icons/gi";
import { normalizeServiceOrder, SERVICE_REGISTRY, sortByServiceOrder } from "@/lib/serviceRegistry";
import { useAdminSidebar } from "@/contexts/adminSidebar";

// fired by the Services > Main page after a show/hide or reorder so the sidebar updates
export const SERVICE_VISIBILITY_EVENT = "service-visibility-changed";

type NavItem = {
    name: string;
    href: string;
    icon: React.ElementType;
    exact?: boolean;
    hasChild?: boolean;
    children?: { name: string; href: string; muted?: boolean }[];
};
type NavGroup = { label: string; items: NavItem[] };

const AdminNavbar = () => {
    const [openLink, setOpenLink] = useState<string | null>(null);
    const [hiddenServices, setHiddenServices] = useState<string[]>([]);
    const [serviceOrder, setServiceOrder] = useState<string[]>([]);
    const { collapsed } = useAdminSidebar();

    // which services are hidden on the website and their order (refreshed when Services > Main changes something)
    useEffect(() => {
        const load = () =>
            fetch("/api/admin/services/visibility", { cache: "no-store" })
                .then((res) => (res.ok ? res.json() : null))
                .then((json) => {
                    setHiddenServices(json?.data?.hiddenServices || []);
                    setServiceOrder(normalizeServiceOrder(json?.data?.serviceOrder));
                })
                .catch(() => {});
        load();
        window.addEventListener(SERVICE_VISIBILITY_EVENT, load);
        return () => window.removeEventListener(SERVICE_VISIBILITY_EVENT, load);
    }, []);


    const servicesChildren = [
        // show / hide services on the website
        { name: "Main", href: "/4dm1n-5p1nt/services/main" },
        // in the website order; hidden services stay editable here, just marked and listed last
        ...sortByServiceOrder([...SERVICE_REGISTRY], serviceOrder, (service) => service.slug)
            .sort((a, b) => Number(hiddenServices.includes(a.slug)) - Number(hiddenServices.includes(b.slug)))
            .map((service) => ({
                name: hiddenServices.includes(service.slug) ? `${service.name} (Hidden)` : service.name,
                href: service.adminHref,
                muted: hiddenServices.includes(service.slug),
            })),
    ];

    const navGroups: NavGroup[] = [
        {
            label: "Overview",
            items: [{ name: "Dashboard", href: "/4dm1n-5p1nt", icon: LayoutDashboard, exact: true }],
        },
        {
            label: "Pages",
            items: [
                // exact: Map Locations (/4dm1n-5p1nt/home/map-locations) lives under Projects, so Home must not also light up there
                { name: "Home", href: "/4dm1n-5p1nt/home", icon: HomeIcon, exact: true },
                { name: "About", href: "/4dm1n-5p1nt/about", icon: UserGroupIcon },
                { name: "Leadership & Team", href: "/4dm1n-5p1nt/leadership", icon: UserGroupIcon },
                { name: "Quality", href: "/4dm1n-5p1nt/quality", icon: ThumbsUp },
                { name: "Global Presence", href: "/4dm1n-5p1nt/global-presence", icon: GlobeAltIcon },
                { name: "Community Engagement", href: "/4dm1n-5p1nt/community-engagement", icon: UsersIcon },
                { name: "HSE", href: "/4dm1n-5p1nt/hse", icon: HeartHandshake },
                { name: "Sustainability", href: "/4dm1n-5p1nt/sustainability", icon: LeafIcon },
                {
                    name: "Accreditation",
                    href: "#accreditation",
                    icon: GiPaperBagFolded,
                    hasChild: true,
                    children: [
                        // page content, second section and SEO
                        { name: "Main", href: "/4dm1n-5p1nt/accreditation" },
                        // accreditations and categories
                        { name: "List", href: "/4dm1n-5p1nt/accreditation/list" },
                    ],
                },
                { name: "Terms and Conditions", href: "/4dm1n-5p1nt/terms-and-conditions", icon: FileText },
            ],
        },
        {
            label: "Content",
            items: [
                {
                    name: "Projects",
                    href: "#projects",
                    icon: Workflow,
                    hasChild: true,
                    children: [
                        // projects page banner, first section and SEO
                        { name: "Main", href: "/4dm1n-5p1nt/projects/main" },
                        // add / edit / hide / reorder projects (also highlighted on the add and edit pages)
                        { name: "Project List", href: "/4dm1n-5p1nt/projects" },
                        // world map points (page lives under /4dm1n-5p1nt/home; also linked from the Home page)
                        { name: "Map Locations", href: "/4dm1n-5p1nt/home/map-locations" },
                    ],
                },
                { name: "Services", href: "#services", icon: BriefcaseIcon, hasChild: true, children: servicesChildren },
                { name: "News", href: "/4dm1n-5p1nt/news", icon: NewspaperIcon },
                { name: "Gallery", href: "/4dm1n-5p1nt/gallery", icon: GalleryThumbnails },
            ],
        },
        {
            label: "Engagement",
            items: [
                // no Enquiries page: the careers site links out to the job portal, it has no application form
                { name: "Careers", href: "/4dm1n-5p1nt/careers", icon: BriefcaseIcon },
                {
                    name: "Contact",
                    href: "#contact",
                    icon: EnvelopeIcon,
                    hasChild: true,
                    children: [
                        { name: "Main Page", href: "/4dm1n-5p1nt/contact" },
                        { name: "Enquiries", href: "/4dm1n-5p1nt/contact/enquiries" },
                    ],
                },
            ],
        },
        {
            label: "Site",
            items: [
                { name: "Header", href: "/4dm1n-5p1nt/header", icon: PanelTop },
                { name: "Footer", href: "/4dm1n-5p1nt/footer", icon: PanelBottom },
                { name: "Settings", href: "/4dm1n-5p1nt/settings", icon: Settings },
            ],
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            {navGroups.map((group) => (
                <div key={group.label}>
                    {collapsed ? (
                        // collapsed: a short divider instead of the group label
                        <div className="mx-auto mb-2 h-px w-6 bg-white/15" aria-hidden />
                    ) : (
                        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 whitespace-nowrap">
                            {group.label}
                        </p>
                    )}
                    <div className="flex flex-col gap-0.5">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <ClientSideLink
                                    key={item.href}
                                    href={item.href}
                                    name={item.name}
                                    icon={<Icon className="h-[18px] w-[18px]" />}
                                    isOpen={openLink === item.href}
                                    setOpenLink={setOpenLink}
                                    hasChild={item.hasChild}
                                    exact={item.exact}
                                >
                                    {item.children}
                                </ClientSideLink>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminNavbar;
