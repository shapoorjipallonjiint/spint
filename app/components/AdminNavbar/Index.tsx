"use client"

import ClientSideLink from '@/app/client-side-link';
import React, { useState } from 'react'
import {
    HomeIcon,
    NewspaperIcon,
    UserGroupIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    UsersIcon
  } from "@heroicons/react/24/outline";
import { AwardIcon, GalleryThumbnails, HeartHandshake, LeafIcon, Settings, ThumbsUp, Workflow } from 'lucide-react';
import { useEffect } from 'react';



const AdminNavbar = () => {

    const [openLink, setOpenLink] = useState<string | null>(null);
    
    useEffect(() => {
      fetchCountries()
  },[])
  
  const [countries, setCountries] = useState([])
  const fetchCountries = async () => {
      const response = await fetch("/api/admin/global-presence");
      const data = await response.json();
      setCountries(data.data.thirdSection.countries)
  }

    const navItems = [
        { name: "Home", href: "/home", icon: HomeIcon },
        { name: "About", href: "/about", icon: UserGroupIcon },
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
        { name: "Projects", href: "/projects", icon: Workflow },
        { name: "News", href: "/news", icon: NewspaperIcon },
        { name: "Services", href: "##", icon:BriefcaseIcon,hasChild:true,children: [
          {name:"Engineering & Construction",href:"/services/engineering-and-construction"},
          {name:"MEP",href:"/services/mep"},
          {name:"Design Studio",href:"/services/design-studio"},
          {name:"Interior Design",href:"/services/interior-design"},
          {name:"Façade",href:"/services/facade"},
          {name:"Integrated Facility Management",href:"/services/integrated-facility-management"},
          {name:"Water",href:"/services/water"},
        ] },
        { name: "Gallery", href: "/gallery", icon: GalleryThumbnails },
        { name: "Awards", href: "/admin/awards", icon:AwardIcon },
        { name: "Leadership & Team", href: "/leadership", icon:UserGroupIcon },
        { name: "Careers", href: "####", icon:BriefcaseIcon,hasChild:true,children: [
          { name: "Main Page", href: "/admin/careers" },
          {name:"Enquiries",href:"/admin/careers/enquiries"}
        ] },
        { name: "Contact", href: "###", icon: EnvelopeIcon,hasChild:true,children: [
          { name: "Main Page", href: "/contact" },
          {name:"Enquiries",href:"/contact/enquiries"}
        ] },
        { name: "Quality", href: "/quality", icon: ThumbsUp },
        { name: "Community Engagement", href: "/community-engagement", icon: UsersIcon },
        { name: "HSE", href: "/admin/hse", icon: HeartHandshake },
        { name: "Sustainability", href: "/sustainability", icon: LeafIcon },
        { name: "Settings", href: "/admin/settings", icon: Settings},
      ];

  return (
    navItems.map((item) => {
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
      })
  )
}

export default AdminNavbar