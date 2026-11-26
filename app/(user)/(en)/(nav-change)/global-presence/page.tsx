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
  const response = await fetch(`${process.env.BASE_URL}/api/admin/global-presence`, { next: { revalidate: 60 } });
  const data = await response.json();

  // the world map uses the same data as the homepage map: home sixthSection.cities + projects (for clickable cities)
  const homeResponse = await fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } });
  const homeData = await homeResponse.json();

  const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project?view=summary`, { next: { revalidate: 60 } }); // only status / sector / location (see the API)
  const projectData = await projectResponse.json();

  return (
    // map legend labels: the same CMS fields as the homepage map (admin: Home > Sixth Section > Legend)
    <Index data={data.data} mapCities={homeData?.data?.sixthSection?.cities || []} mapLegend={homeData?.data?.sixthSection?.legend} projectsData={projectData?.data} />
  )
}

export default page
