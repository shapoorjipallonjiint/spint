import Index from "@/app/components/Client/project-details-v2/Index";
import { notFound } from "next/navigation";

// SEO from admin: Projects > Edit project > SEO. Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji",
// no description) stay. Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/project?slug=${(await params).slug}`, { next: { revalidate: 60 } });
    if (!response.ok) return {};
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

const page = async({params}: {params: Promise<{slug: string}>}) => {
    const slug = (await params).slug;
    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project?slug=${slug}`, { next: { revalidate: 60 } });
    // hidden or unknown project: the API returns 404, so show the not-found page
    if (!projectResponse.ok) notFound();
    const projectData = await projectResponse.json();
  return (
    <Index data={projectData.data} nextProject={projectData.nextProject}/>
  )
}

export default page