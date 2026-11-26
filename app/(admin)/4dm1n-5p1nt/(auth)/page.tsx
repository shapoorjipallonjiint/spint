import Dashboard, { type DashboardData } from "@/app/components/AdminHome/Index";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Project";
import News from "@/app/models/News";
import Gallery from "@/app/models/Gallery";
import Enquiry from "@/app/models/Enquiry";
import { readHiddenServiceSlugs } from "@/lib/serviceVisibility";
import { SERVICE_REGISTRY } from "@/lib/serviceRegistry";

// always read live numbers (the admin area is behind the auth check in proxy.ts)
export const dynamic = "force-dynamic";

type ProjectsDoc = {
    projects?: {
        _id: unknown;
        isHidden?: boolean;
        thumbnail?: string;
        firstSection?: { title?: string; status?: string };
        secondSection?: { status?: string };
    }[];
};
type NewsDoc = { news?: { _id: unknown; title?: string; date?: Date; thumbnail?: string }[] };
type GalleryDoc = { gallery?: { isHidden?: boolean; categories?: { isHidden?: boolean; images?: string[] }[] }[] };
type EnquiryDoc = { _id: unknown; name: string; email: string; subject: string; organization?: string; createdAt?: Date };

async function loadDashboard(): Promise<DashboardData> {
    await connectDB();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [projectsDoc, newsDoc, galleryDoc, enquiryTotal, enquiryRecentCount, recentEnquiries, hiddenServices] =
        await Promise.all([
            Project.findOne(
                {},
                {
                    "projects._id": 1,
                    "projects.isHidden": 1,
                    "projects.thumbnail": 1,
                    "projects.firstSection.title": 1,
                    "projects.firstSection.status": 1,
                    "projects.secondSection.status": 1,
                }
            ).lean<ProjectsDoc>(),
            News.findOne({}, { "news._id": 1, "news.title": 1, "news.date": 1, "news.thumbnail": 1 }).lean<NewsDoc>(),
            Gallery.findOne({}, { gallery: 1 }).lean<GalleryDoc>(),
            Enquiry.countDocuments(),
            Enquiry.countDocuments({ createdAt: { $gte: monthAgo } }),
            Enquiry.find({}, { name: 1, email: 1, subject: 1, organization: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean<EnquiryDoc[]>(),
            readHiddenServiceSlugs(),
        ]);

    const projects = projectsDoc?.projects || [];
    const albums = (galleryDoc?.gallery || []).flatMap((section) => section.categories || []);
    const news = newsDoc?.news || [];

    return {
        projects: { total: projects.length, visible: projects.filter((p) => !p.isHidden).length },
        news: { total: news.length },
        gallery: {
            albums: albums.length,
            photos: albums.reduce((sum, album) => sum + (album.images?.length || 0), 0),
        },
        enquiries: { total: enquiryTotal, last30Days: enquiryRecentCount },
        services: { total: SERVICE_REGISTRY.length, live: SERVICE_REGISTRY.length - hiddenServices.length },
        recentEnquiries: recentEnquiries.map((e) => ({
            id: String(e._id),
            name: e.name,
            email: e.email,
            subject: e.subject,
            organization: e.organization || "",
            createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
        })),
        // newest first: a project's _id (ObjectId) carries the time it was added; the array itself is in display order
        latestProjects: [...projects]
            .map((p) => ({ p, id: String(p._id) }))
            .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0))
            .slice(0, 5)
            .map(({ p, id }) => ({
                id,
                title: p.firstSection?.title || "Untitled",
                status: p.secondSection?.status || p.firstSection?.status || "",
                thumbnail: p.thumbnail || "",
                isHidden: !!p.isHidden,
                addedAt: /^[a-f0-9]{24}$/i.test(id) ? new Date(parseInt(id.slice(0, 8), 16) * 1000).toISOString() : null,
            })),
    };
}

export default async function DashboardPage() {
    const data = await loadDashboard();
    return <Dashboard data={data} />;
}
