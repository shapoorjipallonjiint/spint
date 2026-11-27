import Index from "@/app/components/Client/news-details/Index"

// SEO from admin: the article's own SEO (News > Edit). Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji", no description) stay.
// Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/news?slug=${(await params).slug}`, { next: { revalidate: 60 } });
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

const page = async({params}: {params: Promise<{slug:string}>}) => {
    const slug = (await params).slug;
  // independent requests: run them at the same time (faster render, title stays in <head>)
  const [newsData, allNewsData] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/admin/news?slug=${slug}`, { next: { revalidate: 60 } }).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/admin/news`, { next: { revalidate: 60 } }).then((res) => res.json()),
  ]);

  return (
    <Index newsData={newsData.data} allNewsData={allNewsData.data}/>
  )
}

export default page