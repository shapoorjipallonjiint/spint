import Index from "@/app/components/Client/Sustainability/Index";

// SEO from admin: Sustainability > SEO. Empty fields are left out, so the layout's defaults ("Shapoorji Pallonji", no description) stay.
// Same request as the page below (same URL and options), so Next.js fetches it once.
export async function generateMetadata() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/admin/sustainability`, { next: { revalidate: 60 } });
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
  const response = await fetch(
    `${process.env.BASE_URL}/api/admin/sustainability`,
    { next: { revalidate: 60 } },
  );
  const data = await response.json();
  return <Index data={data.data} />;
};

export default page;
