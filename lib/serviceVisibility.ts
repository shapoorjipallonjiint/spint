import connectDB from "@/lib/mongodb";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import { isKnownServiceSlug, normalizeServiceOrder } from "@/lib/serviceRegistry";

type ServiceSettingsDoc = { hiddenServices?: string[]; serviceOrder?: string[]; featuredProjects?: Record<string, string[]> };

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

// Server-side: the projects picked for each service's Featured Projects section (read only). { slug: [projectId] }
export async function readFeaturedProjects(): Promise<Record<string, string[]>> {
    await connectDB();
    const doc = await ServiceVisibility.findOne({}, { featuredProjects: 1 }).lean<ServiceSettingsDoc>();
    return cleanFeaturedProjects(doc?.featuredProjects);
}

// known service slugs only, each with a list of unique id strings
const cleanFeaturedProjects = (value: unknown): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    if (!value || typeof value !== "object") return result;
    Object.entries(value as Record<string, unknown>).forEach(([slug, ids]) => {
        if (isKnownServiceSlug(slug) && Array.isArray(ids)) result[slug] = [...new Set(ids.map(String))];
    });
    return result;
};

export const SERVICE_VISIBILITY_TAG = "service-visibility";

export type ServiceVisibilityData = {
    hiddenServices: string[];
    hiddenServiceIds: string[];
    serviceOrder: string[];
    // service document id -> slug (projects link services by id), used to order the project service tabs
    serviceIdSlugs: Record<string, string>;
    // service slug -> project ids picked for its Featured Projects section
    featuredProjects: Record<string, string[]>;
};

const EMPTY_VISIBILITY: ServiceVisibilityData = {
    hiddenServices: [],
    hiddenServiceIds: [],
    serviceOrder: [],
    serviceIdSlugs: {},
    featuredProjects: {},
};

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
            featuredProjects: cleanFeaturedProjects(json?.data?.featuredProjects),
        };
    } catch {
        return EMPTY_VISIBILITY;
    }
}

export async function isServiceHidden(slug: string): Promise<boolean> {
    const { hiddenServices } = await fetchServiceVisibility();
    return hiddenServices.includes(slug);
}

// Server components: ids of the projects picked for a service's Featured Projects section ([] = none picked)
export async function getFeaturedProjectIds(slug: string): Promise<string[]> {
    const { featuredProjects } = await fetchServiceVisibility();
    return featuredProjects[slug] || [];
}
