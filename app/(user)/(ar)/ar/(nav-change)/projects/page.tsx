import Index from '@/app/components/Client/projects-v2/Index'

const page = async() => {
    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
    const projectData = await projectResponse.json();

    const sectorResponse = await fetch(`${process.env.BASE_URL}/api/admin/project/sector`, { next: { revalidate: 60 } });
    const sectorData = await sectorResponse.json();

    const countryResponse = await fetch(`${process.env.BASE_URL}/api/admin/home/countries`, { next: { revalidate: 60 } });
    const countryData = await countryResponse.json();

    const serviceResponse = await fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } });
    const serviceData = await serviceResponse.json();

  return (
    <Index data={projectData.data} sectorData={sectorData.data} countryData={countryData.data} serviceData={(serviceData.data || []).filter((s: { hidden?: boolean }) => !s.hidden)}/>
  )
}

export default page