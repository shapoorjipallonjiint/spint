import Index from '@/app/components/Client/projects-v2/Index'
import { getVisitorCountry } from '@/lib/visitorCountry'

const page = async({ searchParams }: { searchParams: Promise<{ geo?: string | string[] }> }) => {
    const visitorCountry = await getVisitorCountry((await searchParams).geo);

    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
    const projectData = await projectResponse.json();

    const sectorResponse = await fetch(`${process.env.BASE_URL}/api/admin/project/sector`, { next: { revalidate: 60 } });
    const sectorData = await sectorResponse.json();

    const countryResponse = await fetch(`${process.env.BASE_URL}/api/admin/home/countries`, { next: { revalidate: 60 } });
    const countryData = await countryResponse.json();

    const serviceResponse = await fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } });
    const serviceData = await serviceResponse.json();

    const orderResponse = await fetch(`${process.env.BASE_URL}/api/admin/project/order`, { next: { revalidate: 60 } });
    const orderData = orderResponse.ok ? await orderResponse.json() : { data: [] };

  return (
    <Index data={projectData.data} sectorData={sectorData.data} countryData={countryData.data} serviceData={(serviceData.data || []).filter((s: { hidden?: boolean }) => !s.hidden)} visitorCountry={visitorCountry} projectOrders={orderData.data}/>
  )
}

export default page