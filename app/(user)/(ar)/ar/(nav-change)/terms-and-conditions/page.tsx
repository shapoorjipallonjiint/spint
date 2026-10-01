import type { Metadata } from "next";
import Index from "@/app/components/Client/TermsAndConditions/Index";

const getData = async () => {
  const response = await fetch(`${process.env.BASE_URL}/api/admin/terms-and-conditions`, { next: { revalidate: 60 } });
  if (!response.ok) return null;
  const json = await response.json();
  return json?.data ?? null;
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: data?.metaTitle_ar || data?.metaTitle || "Terms and Conditions | Shapoorji Pallonji",
    description: data?.metaDescription_ar || data?.metaDescription || "",
  };
}

const page = async () => {
  const data = await getData();
  return <Index data={data} />;
};

export default page;
