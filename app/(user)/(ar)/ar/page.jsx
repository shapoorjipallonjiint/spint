import Index from "@/app/components/Client/home/Index";
import { fetchFooter } from "@/lib/footer";

const page = async () => {
    // "Stay Connected" icons use the same socials as the footer (admin > Footer)
    const footer = await fetchFooter();

    const response = await fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } });
    const data = await response.json();

    const serviceResponse = await fetch(`${process.env.BASE_URL}/api/admin/services`, { next: { revalidate: 60 } });
    const serviceData = await serviceResponse.json();

    const projectResponse = await fetch(`${process.env.BASE_URL}/api/admin/project?view=summary`, { next: { revalidate: 60 } }); // only status / sector / location (see the API)
    const projectData = await projectResponse.json();

    // services hidden in admin (Services > Main) are not listed
    return <Index data={data.data} serviceData={(serviceData.data || []).filter((s) => !s.hidden)} projectsData={projectData.data} socials={footer.socials} />;
};

export default page;
