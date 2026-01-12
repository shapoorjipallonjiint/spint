import Index from "@/app/components/Client/home/Index";

const page = async () => {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } });
    const data = await response.json();

    const serviceResponse = await fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } });
    const serviceData = await serviceResponse.json();

    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project`, { next: { revalidate: 60 } });
    const projectData = await projectResponse.json();

    return <Index data={data.data} serviceData={serviceData.data} projectsData={projectData.data} />;
};

export default page;
