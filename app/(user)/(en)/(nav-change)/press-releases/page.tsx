import Index from "@/app/components/Client/press-release/Index"

// SEO from admin: News > Page (SEO). Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji", no description) stay.
// Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/news`, { next: { revalidate: 60 } });
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
  const newsResponse = await fetch(`${process.env.BASE_URL}/api/admin/news`, { next: { revalidate: 60 } });
  const newsData = await newsResponse.json();

  const topicResponse = await fetch(`${process.env.BASE_URL}/api/admin/news/topic`, { next: { revalidate: 60 } });
  const topicData = await topicResponse.json();

  return (
    <Index newsData={newsData.data} topicData={topicData.data}/>
  )
}

export default page