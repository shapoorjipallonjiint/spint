import Index from '@/app/components/Client/services/interior-design/Index'

const page = async() => {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/services/interior-design`, { next: { revalidate: 60 } });
  const data = await response.json();

  const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
  const projectData = await projectResponse.json();
  return (
    <Index data={data.data} projectData={projectData.data}/>
  )
}

export default page