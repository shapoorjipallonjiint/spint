import Index from "@/app/components/Client/news-details/Index"

const page = async({params}: {params: Promise<{slug:string}>}) => {
    const slug = (await params).slug;
  const newsResponse = await fetch(`${process.env.BASE_URL}/api/admin/news?slug=${slug}`, { next: { revalidate: 60 } });
  const newsData = await newsResponse.json();

  const allNewsResponse = await fetch(`${process.env.BASE_URL}/api/admin/news`, { next: { revalidate: 60 } });
  const allNewsData = await allNewsResponse.json();

  return (
    <Index newsData={newsData.data} allNewsData={allNewsData.data}/>
  )
}

export default page