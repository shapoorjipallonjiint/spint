import Index from '@/app/components/Client/GlobalPresence/Index'

// SEO from admin: Global Presence > SEO. Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji", no description) stay.
// Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/global-presence`, { next: { revalidate: 60 } });
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
  // the three requests don't depend on each other, so they run at the same time (the page waits for the slowest
  // one instead of all three in a row). The world map uses the same data as the homepage map: home
  // sixthSection.cities + projects (for clickable cities); the project summary is only status / sector / location.
  const [data, homeData, projectData] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/admin/global-presence`, { next: { revalidate: 60 } }).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } }).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/admin/project?view=summary`, { next: { revalidate: 60 } }).then((res) => res.json()),
  ]);

  return (
    // map legend labels: the same CMS fields as the homepage map (admin: Home > Sixth Section > Legend)
    <Index data={data.data} mapCities={homeData?.data?.sixthSection?.cities || []} mapLegend={homeData?.data?.sixthSection?.legend} projectsData={projectData?.data} />
  )
}

export default page
