import Index from '@/app/components/Client/Sustainability/Index'
 
const page = async() => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/sustainability`, { next: { revalidate: 60 } });
  const data = await response.json();
  return (
    <Index data={data.data}/>
  )
}
 
export default page