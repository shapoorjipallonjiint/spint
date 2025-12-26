import Index from "@/app/components/Client/project-details/Index";

const page = async({params}: {params: Promise<{slug: string}>}) => {
    const slug = (await params).slug;
    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project?slug=${slug}`, { next: { revalidate: 60 } });
    const projectData = await projectResponse.json();
  return (
    <Index data={projectData.data} nextProject={projectData.nextProject}/>
  )
}

export default page