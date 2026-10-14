import { notFound } from "next/navigation";
import { getFeaturedProjectIds, isServiceHidden } from "@/lib/serviceVisibility";
import Index from '@/app/components/Client/services/interior-design/Index'

const page = async() => {
    // hidden in admin (Services > Main) -> this service page is not available
    if (await isServiceHidden("interior-design")) notFound();

    const response = await fetch(`${process.env.BASE_URL}/api/admin/services/interior-design`, { next: { revalidate: 60 } });
  const data = await response.json();

  const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
  const projectData = await projectResponse.json();
  // projects picked in admin Services > Main for this page's Featured Projects section
  const featuredIds = await getFeaturedProjectIds("interior-design");
  return (
    <Index data={data.data} projectData={projectData.data} featuredIds={featuredIds}/>
  )
}

export default page