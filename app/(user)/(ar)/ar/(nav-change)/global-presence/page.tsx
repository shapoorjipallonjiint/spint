import Index from '@/app/components/Client/GlobalPresence/Index'

const page = async() => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/global-presence`, { next: { revalidate: 60 } });
  const data = await response.json();

  // the world map uses the same data as the homepage map: home sixthSection.cities + projects (for clickable cities)
  const homeResponse = await fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } });
  const homeData = await homeResponse.json();

  const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
  const projectData = await projectResponse.json();

  return (
    <Index data={data.data} mapCities={homeData?.data?.sixthSection?.cities || []} projectsData={projectData?.data} />
  )
}

export default page
