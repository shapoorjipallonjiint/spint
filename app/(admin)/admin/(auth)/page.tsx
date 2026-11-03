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

type ProjectsDoc = { projects?: { isHidden?: boolean }[] };
type NewsDoc = { news?: { _id: unknown; title?: string; date?: Date; thumbnail?: string }[] };
type GalleryDoc = { gallery?: { isHidden?: boolean; categories?: { isHidden?: boolean; images?: string[] }[] }[] };
type EnquiryDoc = { _id: unknown; name: string; email: string; subject: string; organization?: string; createdAt?: Date };

async function loadDashboard(): Promise<DashboardData> {
    await connectDB();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [projectsDoc, newsDoc, galleryDoc, enquiryTotal, enquiryRecentCount, recentEnquiries, hiddenServices] =
        await Promise.all([
            Project.findOne({}, { "projects.isHidden": 1 }).lean<ProjectsDoc>(),
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
        latestNews: [...news]
            .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
            .slice(0, 5)
            .map((n) => ({
                id: String(n._id),
                title: n.title || "Untitled",
                date: n.date ? new Date(n.date).toISOString() : null,
                thumbnail: n.thumbnail || "",
            })),
    };
}

export default async function DashboardPage() {
    const data = await loadDashboard();
    return <Dashboard data={data} />;
}
