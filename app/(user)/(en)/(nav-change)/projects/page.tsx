import Index from '@/app/components/Client/projects-v2/Index'
import { getVisitorCountry } from '@/lib/visitorCountry'

const page = async({ searchParams }: { searchParams: Promise<{ geo?: string | string[] }> }) => {
    const visitorCountry = await getVisitorCountry((await searchParams).geo);

    // the five requests are independent, so they run in parallel (same requests, same caching as before).
    // view=list: only the fields the listing uses (cards + filters + country order), not the full project content
    const [projectResponse, sectorResponse, countryResponse, serviceResponse, orderResponse] = await Promise.all([
        fetch(`${process.env.BASE_URL}/api/admin/project?view=list`, { next: { revalidate: 60 } }),
        fetch(`${process.env.BASE_URL}/api/admin/project/sector`, { next: { revalidate: 60 } }),
        fetch(`${process.env.BASE_URL}/api/admin/home/countries`, { next: { revalidate: 60 } }),
        fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } }),
        fetch(`${process.env.BASE_URL}/api/admin/project/order`, { next: { revalidate: 60 } }),
    ]);
    const [projectData, sectorData, countryData, serviceData, orderData] = await Promise.all([
        projectResponse.json(),
        sectorResponse.json(),
        countryResponse.json(),
        serviceResponse.json(),
        orderResponse.ok ? orderResponse.json() : { data: [] },
    ]);

  return (
    <Index data={projectData.data} sectorData={sectorData.data} countryData={countryData.data} serviceData={(serviceData.data || []).filter((s: { hidden?: boolean }) => !s.hidden)} visitorCountry={visitorCountry} projectOrders={orderData.data}/>
  )
}

export default page