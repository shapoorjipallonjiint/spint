import Index from '@/app/components/Client/CommunityEngagement/Index'
 
const page = async() => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/community-engagement`, { next: { revalidate: 60 } });
  const data = await response.json();
  return (
    
    <Index data={data.data}/>
  )
}
 
export default page