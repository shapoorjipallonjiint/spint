import { notFound } from "next/navigation";
import { getFeaturedProjectIds, isServiceHidden } from "@/lib/serviceVisibility";
import Index from '@/app/components/Client/services/mep/Index'
import React from 'react'

// SEO from admin: Services > MEP > SEO. Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji",
// no description) stay. Same request as the page below, so Next.js fetches it once.
export async function generateMetadata() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/services/mep`, { next: { revalidate: 60 } });
    const { data } = await response.json();
    const title = data?.metaTitle?.trim();
    const description = data?.metaDescription?.trim();
    return {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    };
  } catch {
    return {};
  }
}

const page = async() => {
    // hidden in admin (Services > Main) -> this service page is not available
    if (await isServiceHidden("mep")) notFound();

  // the page content, the projects and the projects picked in admin Services > Main for this page's Featured
  // Projects section don't depend on each other: load them at the same time
  const [data, projectData, featuredIds] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/admin/services/mep`, { next: { revalidate: 60 } }).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } }).then((res) => res.json()),
    getFeaturedProjectIds("mep"),
  ]);
  return (
    <Index data={data.data} projectData={projectData.data} featuredIds={featuredIds}/>
  )
}

export default page