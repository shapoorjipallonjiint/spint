import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Briefcase, Images, Inbox, Newspaper, Workflow } from "lucide-react";

export type DashboardData = {
    projects: { total: number; visible: number };
    news: { total: number };
    gallery: { albums: number; photos: number };
    enquiries: { total: number; last30Days: number };
    services: { total: number; live: number };
    recentEnquiries: { id: string; name: string; email: string; subject: string; organization: string; createdAt: string | null }[];
    latestNews: { id: string; title: string; date: string | null; thumbnail: string }[];
};

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const QUICK_ACTIONS = [
    { label: "Add project", href: "/admin/projects/add" },
    { label: "Add news article", href: "/admin/news/add" },
    { label: "Manage gallery", href: "/admin/gallery" },
    { label: "Edit home page", href: "/admin/home" },
    { label: "Service visibility", href: "/admin/services/main" },
    { label: "Site settings", href: "/admin/settings" },
];

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border border-gray-200 bg-white ${className}`}>{children}</div>
);

const SectionHeader = ({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) => (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
        {href && (
            <Link href={href} className="flex items-center gap-1 text-[13px] font-medium text-primary hover:underline">
                {linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        )}
    </div>
);

const Dashboard = ({ data }: { data: DashboardData }) => {
    const stats = [
        {
            label: "Projects",
            value: data.projects.total,
            detail: `${data.projects.visible} live on website`,
            icon: Workflow,
            href: "/admin/projects",
        },
        {
            label: "Services",
            value: data.services.live,
            detail: `of ${data.services.total} visible`,
            icon: Briefcase,
            href: "/admin/services/main",
        },
        {
            label: "News articles",
            value: data.news.total,
            detail: "Published articles",
            icon: Newspaper,
            href: "/admin/news",
        },
        {
            label: "Gallery",
            value: data.gallery.albums,
            detail: `${data.gallery.photos.toLocaleString()} photos across albums`,
            icon: Images,
            href: "/admin/gallery",
        },
        {
            label: "Enquiries",
            value: data.enquiries.total,
            detail: `${data.enquiries.last30Days} in the last 30 days`,
            icon: Inbox,
            href: "/admin/contact/enquiries",
        },
    ];

    return (
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-2">
            {/* Heading */}
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.label} href={stat.href} className="group">
                            <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-sm">
                                <div className="flex items-start justify-between">
                                    <p className="text-[13px] font-medium text-gray-500">{stat.label}</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                                        <Icon className="h-[18px] w-[18px]" />
                                    </span>
                                </div>
                                <p className="mt-3 text-3xl font-semibold tabular-nums text-gray-900">{stat.value}</p>
                                <p className="mt-1 text-[13px] text-gray-500">{stat.detail}</p>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Recent enquiries */}
                <Card className="xl:col-span-2">
                    <SectionHeader title="Recent enquiries" href="/admin/contact/enquiries" linkLabel="View all" />
                    {data.recentEnquiries.length === 0 ? (
                        <p className="px-5 py-10 text-center text-sm text-gray-500">No enquiries yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-[12px] uppercase tracking-wide text-gray-400">
                                        <th className="px-5 py-3 font-medium">Name</th>
                                        <th className="px-5 py-3 font-medium">Subject</th>
                                        <th className="px-5 py-3 font-medium">Organization</th>
                                        <th className="px-5 py-3 text-right font-medium">Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.recentEnquiries.map((enquiry) => (
                                        <tr key={enquiry.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3">
                                                <p className="font-medium text-gray-900">{enquiry.name}</p>
                                                <p className="text-[12px] text-gray-500">{enquiry.email}</p>
                                            </td>
                                            <td className="max-w-[240px] truncate px-5 py-3 text-gray-700">{enquiry.subject}</td>
                                            <td className="px-5 py-3 text-gray-500">{enquiry.organization || "—"}</td>
                                            <td className="whitespace-nowrap px-5 py-3 text-right text-gray-500">
                                                {formatDate(enquiry.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Quick actions */}
                <Card>
                    <SectionHeader title="Quick actions" />
                    <div className="flex flex-col p-2">
                        {QUICK_ACTIONS.map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
                            >
                                {action.label}
                                <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-primary" />
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Latest news */}
            <Card>
                <SectionHeader title="Latest news" href="/admin/news" linkLabel="Manage news" />
                {data.latestNews.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-gray-500">No news articles yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 2xl:grid-cols-5">
                        {data.latestNews.map((article) => (
                            <Link key={article.id} href={`/admin/news/edit/${article.id}`} className="group">
                                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                                    {article.thumbnail && (
                                        <Image
                                            src={article.thumbnail}
                                            alt={article.title}
                                            fill
                                            sizes="(min-width: 1536px) 20vw, (min-width: 768px) 30vw, 100vw"
                                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    )}
                                </div>
                                <p className="mt-2.5 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary">
                                    {article.title}
                                </p>
                                <p className="mt-0.5 text-[12px] text-gray-500">{formatDate(article.date)}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
