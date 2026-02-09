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
import { GalleryThumbnails, HeartHandshake, LeafIcon, Settings, ThumbsUp, Workflow } from "lucide-react";
import { GiPaperBagFolded } from "react-icons/gi";

const AdminNavbar = () => {
    const [openLink, setOpenLink] = useState<string | null>(null);


    const navItems = [
        { name: "Home", href: "/admin/home", icon: HomeIcon },
        { name: "About", href: "/admin/about", icon: UserGroupIcon },
        // { name: "Clients", href: "/admin/clients", icon: PresentationChartBarIcon },
        // { name: "Services", href: "#", icon: EnvelopeIcon,hasChild:true,children: [
        //     { name: "Engineering", href: "/admin/services/engineering" },
        //     { name: "Fabrication", href: "/admin/services/fabrication" },
        //     { name: "Blasting", href: "/admin/services/blasting" },
        //     { name: "Steel Erection", href: "/admin/services/steel-erection" },
        //   ] },
        // // { name: "Industries", href: "/admin/industries", icon: BriefcaseIcon },
        // { name: "Global Presence", href: "##", icon: GlobeAltIcon , hasChild:true,children: [
        //   { name: "Main Page", href: "/admin/global-presence" },
        //   ...countries.map((country: { _id: string,title:string }) => (
        //     { name: country.title, href: `/admin/global-presence/${country._id}` }
        //   )),
        // ] },
        { name: "Projects", href: "/admin/projects", icon: Workflow },
        { name: "News", href: "/admin/news", icon: NewspaperIcon },
        {
            name: "Services",
            href: "##",
            icon: BriefcaseIcon,
            hasChild: true,
            children: [
                { name: "Engineering & Construction", href: "/admin/services/engineering-and-construction" },
                { name: "MEP", href: "/admin/services/mep" },
                { name: "Design Studio", href: "/admin/services/design-studio" },
                { name: "Interior Design", href: "/admin/services/interior-design" },
                { name: "Facade", href: "/admin/services/facade" },
                { name: "Integrated Facility Management", href: "/admin/services/integrated-facility-management" },
                { name: "Water", href: "/admin/services/water" },
            ],
        },
        { name: "Gallery", href: "/admin/gallery", icon: GalleryThumbnails },
        // { name: "Awards", href: "/admin/awards", icon: AwardIcon },
        { name: "Leadership & Team", href: "/admin/leadership", icon: UserGroupIcon },
        {
            name: "Careers",
            href: "####",
            icon: BriefcaseIcon,
            hasChild: true,
            children: [
                { name: "Main Page", href: "/admin/careers" },
                { name: "Enquiries", href: "/admin/careers/enquiries" },
            ],
        },
        {
            name: "Contact",
            href: "###",
            icon: EnvelopeIcon,
            hasChild: true,
            children: [
                { name: "Main Page", href: "/admin/contact" },
                { name: "Enquiries", href: "/admin/contact/enquiries" },
            ],
        },
        { name: "Quality", href: "/admin/quality", icon: ThumbsUp },
        { name: "Global Presence", href: "/admin/global-presence", icon: GlobeAltIcon },
        { name: "Community Engagement", href: "/admin/community-engagement", icon: UsersIcon },
        { name: "HSE", href: "/admin/hse", icon: HeartHandshake },
        { name: "Sustainability", href: "/admin/sustainability", icon: LeafIcon },
        { name: "Accreditation", href: "/admin/accreditation", icon: GiPaperBagFolded },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return navItems.map((item) => {
        const Icon = item.icon;
        return (
            <ClientSideLink
                key={item.href}
                href={item.href}
                name={item.name}
                icon={<Icon className="h-5 w-5" />}
                isOpen={openLink === item.href}
                setOpenLink={setOpenLink}
                hasChild={item.hasChild}
            >
                {item.children}
            </ClientSideLink>
        );
    });
};

export default AdminNavbar;
