import Index from '@/app/components/Client/GlobalPresence/Index'
 
const page = async() => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/global-presence`, { next: { revalidate: 60 } });
  const data = await response.json();
  return (
    
    <Index data={data.data}/>
  )
}
 
export default page