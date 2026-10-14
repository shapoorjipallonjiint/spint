import { notFound } from "next/navigation";
import { getFeaturedProjectIds, isServiceHidden } from "@/lib/serviceVisibility";
import Index from '@/app/components/Client/services/mep/Index'
import React from 'react'

const page = async() => {
    // hidden in admin (Services > Main) -> this service page is not available
    if (await isServiceHidden("mep")) notFound();

  const response = await fetch(`${process.env.BASE_URL}/api/admin/services/mep`, { next: { revalidate: 60 } });
  const data = await response.json();

  const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
  const projectData = await projectResponse.json();
  // projects picked in admin Services > Main for this page's Featured Projects section
  const featuredIds = await getFeaturedProjectIds("mep");
  return (
    <Index data={data.data} projectData={projectData.data} featuredIds={featuredIds}/>
  )
}

export default page