import Index from "@/app/components/Client/project-details/Index";
import { notFound } from "next/navigation";

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