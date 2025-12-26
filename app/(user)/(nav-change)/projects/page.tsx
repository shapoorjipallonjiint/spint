import Index from '@/app/components/Client/projects/Index'

const page = async() => {
    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
    const projectData = await projectResponse.json();

    const sectorResponse = await fetch(`${process.env.BASE_URL}/api/admin/project/sector`, { next: { revalidate: 60 } });
    const sectorData = await sectorResponse.json();

    const countryResponse = await fetch(`${process.env.BASE_URL}/api/admin/project/country`, { next: { revalidate: 60 } });
    const countryData = await countryResponse.json();

    const serviceResponse = await fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } });
    const serviceData = await serviceResponse.json();

  return (
    <Index data={projectData.data} sectorData={sectorData.data} countryData={countryData.data} serviceData={serviceData.data}/>
  )
}

export default page