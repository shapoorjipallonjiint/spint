import HomeV2 from "@/app/components/Client/home/HomeV2";
import { fetchFooter } from "@/lib/footer";

// SEO from admin: Home > SEO. Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji", no description) stay.
// Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata() {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/admin/home`, { next: { revalidate: 60 } });
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
    // hero video rotates per visit (admin: Home > First Section > Rotating Videos), see HomeV2
    return <HomeV2 data={data.data} serviceData={(serviceData.data || []).filter((s) => !s.hidden)} projectsData={projectData.data} socials={footer.socials} />;
};

export default page;
