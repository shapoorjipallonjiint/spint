import Index from "@/app/components/Client/press-release/Index"

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