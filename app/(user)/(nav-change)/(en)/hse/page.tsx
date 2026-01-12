import Index from '@/app/components/Client/hse/Index'
 
const page = async() => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/hse`, { next: { revalidate: 60 } });
  const data = await response.json();
  return (
    <Index data={data.data}/>
  )
}
 
export default page