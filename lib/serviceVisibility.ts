import connectDB from "@/lib/mongodb";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import { isKnownServiceSlug, normalizeServiceOrder } from "@/lib/serviceRegistry";

type ServiceSettingsDoc = { hiddenServices?: string[]; serviceOrder?: string[] };

// Server-side: the hidden service slugs straight from the database (read only).
export async function readHiddenServiceSlugs(): Promise<string[]> {
    await connectDB();
    const doc = await ServiceVisibility.findOne({}).lean<ServiceSettingsDoc>();
    return (doc?.hiddenServices || []).filter(isKnownServiceSlug);
}

// Server-side: the saved display order of the services (read only). [] = never reordered.
export async function readServiceOrder(): Promise<string[]> {
    await connectDB();
    const doc = await ServiceVisibility.findOne({}).lean<ServiceSettingsDoc>();
    return normalizeServiceOrder(doc?.serviceOrder);
}

export const SERVICE_VISIBILITY_TAG = "service-visibility";

export type ServiceVisibilityData = {
    hiddenServices: string[];
    hiddenServiceIds: string[];
    serviceOrder: string[];
    // service document id -> slug (projects link services by id), used to order the project service tabs
    serviceIdSlugs: Record<string, string>;
};

const EMPTY_VISIBILITY: ServiceVisibilityData = { hiddenServices: [], hiddenServiceIds: [], serviceOrder: [], serviceIdSlugs: {} };

// Server components (layouts / pages): the hidden services and their order through the API, cached and refreshed
// instantly when an admin changes them (the PATCH / PUT revalidate this tag). Fails open: on any error nothing is
// hidden and every list keeps its own order.
export async function fetchServiceVisibility(): Promise<ServiceVisibilityData> {
    try {
        const res = await fetch(`${process.env.BASE_URL}/api/admin/services/visibility`, {
            next: { revalidate: 60, tags: [SERVICE_VISIBILITY_TAG] },
        });
        if (!res.ok) return EMPTY_VISIBILITY;
        const json = await res.json();
        const idSlugs = json?.data?.serviceIdSlugs;
        return {
            hiddenServices: Array.isArray(json?.data?.hiddenServices) ? json.data.hiddenServices.filter(isKnownServiceSlug) : [],
            hiddenServiceIds: Array.isArray(json?.data?.hiddenServiceIds) ? json.data.hiddenServiceIds.map(String) : [],
            serviceOrder: normalizeServiceOrder(json?.data?.serviceOrder),
            serviceIdSlugs: idSlugs && typeof idSlugs === "object" ? idSlugs : {},
        };
    } catch {
        return EMPTY_VISIBILITY;
    }
}

export async function isServiceHidden(slug: string): Promise<boolean> {
    const { hiddenServices } = await fetchServiceVisibility();
    return hiddenServices.includes(slug);
}
