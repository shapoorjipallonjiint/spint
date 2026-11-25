import HomeV2 from "@/app/components/Client/home/HomeV2";
import { fetchFooter } from "@/lib/footer";

// Same as the home page (/ar), except the hero video rotates per visit (admin: Home > First Section > Rotating Videos).
// Kept out of search results so it doesn't compete with /ar as duplicate content; remove `robots` if it goes live.
export const metadata = { robots: { index: false, follow: false } };

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
    return <HomeV2 data={data.data} serviceData={(serviceData.data || []).filter((s) => !s.hidden)} projectsData={projectData.data} socials={footer.socials} />;
};

export default page;
