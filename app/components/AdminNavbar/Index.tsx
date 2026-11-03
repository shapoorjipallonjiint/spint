"use client";

import ClientSideLink from "@/app/(admin)/admin/client-side-link";
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
import { FileText, GalleryThumbnails, LayoutDashboard, HeartHandshake, LeafIcon, PanelBottom, Settings, ThumbsUp, Workflow } from "lucide-react";
import { GiPaperBagFolded } from "react-icons/gi";
import { normalizeServiceOrder, SERVICE_REGISTRY, sortByServiceOrder } from "@/lib/serviceRegistry";

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
        { name: "Main", href: "/admin/services/main" },
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
            items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true }],
        },
        {
            label: "Pages",
            items: [
                { name: "Home", href: "/admin/home", icon: HomeIcon },
                { name: "About", href: "/admin/about", icon: UserGroupIcon },
                { name: "Leadership & Team", href: "/admin/leadership", icon: UserGroupIcon },
                { name: "Quality", href: "/admin/quality", icon: ThumbsUp },
                { name: "Global Presence", href: "/admin/global-presence", icon: GlobeAltIcon },
                { name: "Community Engagement", href: "/admin/community-engagement", icon: UsersIcon },
                { name: "HSE", href: "/admin/hse", icon: HeartHandshake },
                { name: "Sustainability", href: "/admin/sustainability", icon: LeafIcon },
                { name: "Accreditation", href: "/admin/accreditation", icon: GiPaperBagFolded },
                { name: "Terms and Conditions", href: "/admin/terms-and-conditions", icon: FileText },
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
                        { name: "Main", href: "/admin/projects/main" },
                        // add / edit / hide / reorder projects (also highlighted on the add and edit pages)
                        { name: "Project List", href: "/admin/projects" },
                    ],
                },
                { name: "Services", href: "#services", icon: BriefcaseIcon, hasChild: true, children: servicesChildren },
                { name: "News", href: "/admin/news", icon: NewspaperIcon },
                { name: "Gallery", href: "/admin/gallery", icon: GalleryThumbnails },
            ],
        },
        {
            label: "Engagement",
            items: [
                {
                    name: "Careers",
                    href: "#careers",
                    icon: BriefcaseIcon,
                    hasChild: true,
                    children: [
                        { name: "Main Page", href: "/admin/careers" },
                        { name: "Enquiries", href: "/admin/careers/enquiries" },
                    ],
                },
                {
                    name: "Contact",
                    href: "#contact",
                    icon: EnvelopeIcon,
                    hasChild: true,
                    children: [
                        { name: "Main Page", href: "/admin/contact" },
                        { name: "Enquiries", href: "/admin/contact/enquiries" },
                    ],
                },
            ],
        },
        {
            label: "Site",
            items: [
                { name: "Footer", href: "/admin/footer", icon: PanelBottom },
                { name: "Settings", href: "/admin/settings", icon: Settings },
            ],
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            {navGroups.map((group) => (
                <div key={group.label}>
                    <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                        {group.label}
                    </p>
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
