import connectDB from "@/lib/mongodb";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import { isKnownServiceSlug } from "@/lib/serviceRegistry";

// Server-side: the hidden service slugs straight from the database (read only).
export async function readHiddenServiceSlugs(): Promise<string[]> {
    await connectDB();
    const doc = await ServiceVisibility.findOne({}).lean<{ hiddenServices?: string[] }>();
    return (doc?.hiddenServices || []).filter(isKnownServiceSlug);
}

export const SERVICE_VISIBILITY_TAG = "service-visibility";

// Server components (layouts / pages): the hidden services through the API, cached and refreshed instantly when an
// admin toggles a service (the PATCH revalidates this tag). Fails open: on any error nothing is hidden.
export async function fetchServiceVisibility(): Promise<{ hiddenServices: string[]; hiddenServiceIds: string[] }> {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/admin/services/visibility`, {
            next: { revalidate: 60, tags: [SERVICE_VISIBILITY_TAG] },
        });
        if (!res.ok) return { hiddenServices: [], hiddenServiceIds: [] };
        const json = await res.json();
        return {
            hiddenServices: Array.isArray(json?.data?.hiddenServices) ? json.data.hiddenServices.filter(isKnownServiceSlug) : [],
            hiddenServiceIds: Array.isArray(json?.data?.hiddenServiceIds) ? json.data.hiddenServiceIds.map(String) : [],
        };
    } catch {
        return { hiddenServices: [], hiddenServiceIds: [] };
    }
}

export async function isServiceHidden(slug: string): Promise<boolean> {
    const { hiddenServices } = await fetchServiceVisibility();
    return hiddenServices.includes(slug);
}
