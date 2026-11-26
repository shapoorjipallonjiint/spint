import Link from "next/link";
import Image from "next/image";
import {
    ArrowUpRight,
    Briefcase,
    CalendarDays,
    ExternalLink,
    Eye,
    Home,
    Images,
    Inbox,
    Newspaper,
    PenSquare,
    Plus,
    Settings,
    Workflow,
} from "lucide-react";

export type DashboardData = {
    projects: { total: number; visible: number };
    news: { total: number };
    gallery: { albums: number; photos: number };
    enquiries: { total: number; last30Days: number };
    services: { total: number; live: number };
    recentEnquiries: { id: string; name: string; email: string; subject: string; organization: string; createdAt: string | null }[];
    latestProjects: { id: string; title: string; status: string; thumbnail: string; isHidden: boolean; addedAt: string | null }[];
};

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const QUICK_ACTIONS = [
    { label: "Add project", href: "/4dm1n-5p1nt/projects/add", icon: Plus },
    { label: "Add news article", href: "/4dm1n-5p1nt/news/add", icon: PenSquare },
    { label: "Manage gallery", href: "/4dm1n-5p1nt/gallery", icon: Images },
    { label: "Edit home page", href: "/4dm1n-5p1nt/home", icon: Home },
    { label: "Service visibility", href: "/4dm1n-5p1nt/services/main", icon: Eye },
    { label: "Site settings", href: "/4dm1n-5p1nt/settings", icon: Settings },
];

// one accent per KPI card (icon chip, progress bar, top glow)
const TONES = {
    blue: { chip: "bg-blue-50 text-blue-600 ring-blue-100", bar: "bg-blue-500", glow: "from-blue-500/10", line: "from-blue-500 to-sky-400" },
    violet: { chip: "bg-violet-50 text-violet-600 ring-violet-100", bar: "bg-violet-500", glow: "from-violet-500/10", line: "from-violet-500 to-fuchsia-400" },
    amber: { chip: "bg-amber-50 text-amber-600 ring-amber-100", bar: "bg-amber-500", glow: "from-amber-500/10", line: "from-amber-500 to-orange-400" },
    emerald: { chip: "bg-emerald-50 text-emerald-600 ring-emerald-100", bar: "bg-emerald-500", glow: "from-emerald-500/10", line: "from-emerald-500 to-teal-400" },
    sky: { chip: "bg-sky-50 text-sky-600 ring-sky-100", bar: "bg-sky-500", glow: "from-sky-500/10", line: "from-sky-500 to-cyan-400" },
} as const;

// subject badge colours (contact form options); "other" and anything else fall back to grey
const SUBJECT_TONES: Record<string, string> = {
    general: "bg-sky-50 text-sky-700 ring-sky-200/60",
    partnership: "bg-violet-50 text-violet-700 ring-violet-200/60",
    support: "bg-amber-50 text-amber-700 ring-amber-200/60",
};

const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "?";

// rendered on the server (usually UTC), so the hour is read in the office's time zone
const greeting = () => {
    const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Dubai" }).format(new Date()));
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div
        className={`rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-14px_rgba(15,23,42,0.14)] ${className}`}
    >
        {children}
    </div>
);

const SectionHeader = ({
    title,
    subtitle,
    href,
    linkLabel,
}: {
    title: string;
    subtitle?: string;
    href?: string;
    linkLabel?: string;
}) => (
    <div className="relative flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        {/* same brand accent as the section titles on the editor pages */}
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-primary to-sky-400" />
        <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12px] text-slate-500">{subtitle}</p>}
        </div>
        {href && (
            <Link
                href={href}
                className="flex shrink-0 items-center gap-1 rounded-full border border-primary/15 bg-primary/[0.04] px-3 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary/10"
            >
                {linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        )}
    </div>
);

const Dashboard = ({ data }: { data: DashboardData }) => {
    const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
    const stats = [
        {
            label: "Projects",
            value: data.projects.total,
            detail: `${data.projects.visible} live on website`,
            progress: pct(data.projects.visible, data.projects.total),
            icon: Workflow,
            href: "/4dm1n-5p1nt/projects",
            tone: TONES.blue,
        },
        {
            label: "Services",
            value: data.services.live,
            detail: `of ${data.services.total} visible`,
            progress: pct(data.services.live, data.services.total),
            icon: Briefcase,
            href: "/4dm1n-5p1nt/services/main",
            tone: TONES.violet,
        },
        {
            label: "News articles",
            value: data.news.total,
            detail: "Published articles",
            icon: Newspaper,
            href: "/4dm1n-5p1nt/news",
            tone: TONES.amber,
        },
        {
            label: "Gallery",
            value: data.gallery.albums,
            detail: `${data.gallery.photos.toLocaleString()} photos across albums`,
            icon: Images,
            href: "/4dm1n-5p1nt/gallery",
            tone: TONES.emerald,
        },
        {
            label: "Enquiries",
            value: data.enquiries.total,
            detail: `${data.enquiries.last30Days} in the last 30 days`,
            icon: Inbox,
            href: "/4dm1n-5p1nt/contact/enquiries",
            tone: TONES.sky,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#13337f] via-[#0f2a6b] to-[#0b1f4d] px-7 py-7 text-white shadow-[0_18px_40px_-18px_rgba(11,31,77,0.55)]">
                {/* same family as the sidebar: dot texture, sky glow, rings and a sky accent line */}
                <span
                    className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(90deg,transparent,#000_70%)]"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                />
                <span className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/[0.06]" />
                <span className="pointer-events-none absolute -top-24 left-1/3 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
                <span className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-[#3b6fd8]/30 blur-3xl" />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-300/80 to-transparent" />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-medium text-sky-200">{greeting()}</p>
                        <h1 className="mt-0.5 text-[26px] font-semibold tracking-[-0.02em]">Welcome back</h1>
                        <p className="mt-1 text-sm text-white/70">
                            Here is an overview of the website content and the latest enquiries.
                        </p>
                        {/* live summary */}
                        <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
                            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-white/85">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" />
                                {data.projects.visible.toLocaleString()} projects live
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-white/85">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_0_3px_rgba(125,211,252,0.2)]" />
                                {data.enquiries.last30Days.toLocaleString()} enquiries in the last 30 days
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[13px] font-medium backdrop-blur transition-colors hover:bg-white/20"
                        >
                            <ExternalLink className="h-3.5 w-3.5" /> View website
                        </Link>
                        <Link
                            href="/4dm1n-5p1nt/projects/add"
                            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-primary shadow-sm transition-colors hover:bg-white/90"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add project
                        </Link>
                    </div>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.label} href={stat.href} className="group">
                            <Card className="relative h-full overflow-hidden p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_36px_-14px_rgba(30,69,162,0.22)]">
                                <span className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${stat.tone.glow} to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
                                <span className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${stat.tone.line} origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`} />
                                <div className="relative flex items-start justify-between">
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${stat.tone.chip}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <ArrowUpRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-500" />
                                </div>
                                <p className="relative mt-4 text-[13px] font-medium text-slate-500">{stat.label}</p>
                                <p className="relative mt-0.5 text-[32px] font-semibold tracking-tight tabular-nums text-slate-900">
                                    {stat.value.toLocaleString()}
                                </p>
                                {stat.progress !== undefined ? (
                                    <div className="relative mt-3">
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                            <div className={`h-full rounded-full ${stat.tone.bar}`} style={{ width: `${stat.progress}%` }} />
                                        </div>
                                        <p className="mt-1.5 text-[12px] text-gray-500">{stat.detail}</p>
                                    </div>
                                ) : (
                                    <p className="relative mt-3 text-[12px] text-gray-500">{stat.detail}</p>
                                )}
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Recent enquiries */}
                <Card className="overflow-hidden xl:col-span-2">
                    <SectionHeader
                        title="Recent enquiries"
                        subtitle="The latest messages from the contact form"
                        href="/4dm1n-5p1nt/contact/enquiries"
                        linkLabel="View all"
                    />
                    {data.recentEnquiries.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                <Inbox className="h-5 w-5" />
                            </span>
                            <p className="text-sm text-gray-500">No enquiries yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed text-left text-sm">
                                <colgroup>
                                    <col className="w-[44%]" />
                                    <col className="w-[18%]" />
                                    <col className="w-[22%]" />
                                    <col className="w-[16%]" />
                                </colgroup>
                                <thead className="bg-slate-50/80">
                                    <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                                        <th className="px-5 py-2.5 font-medium">Name</th>
                                        <th className="px-5 py-2.5 font-medium">Subject</th>
                                        <th className="px-5 py-2.5 font-medium">Organization</th>
                                        <th className="px-5 py-2.5 text-right font-medium">Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.recentEnquiries.map((enquiry) => (
                                        <tr key={enquiry.id} className="transition-colors hover:bg-primary/[0.025]">
                                            <td className="px-5 py-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-sky-400/15 text-[12px] font-semibold text-primary">
                                                        {initials(enquiry.name)}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-gray-900" title={enquiry.name}>
                                                            {enquiry.name}
                                                        </p>
                                                        <p className="truncate text-[12px] text-gray-500" title={enquiry.email}>
                                                            {enquiry.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-block max-w-full truncate rounded-full px-2.5 py-0.5 text-[12px] font-medium capitalize ring-1 ${
                                                        SUBJECT_TONES[enquiry.subject?.toLowerCase()] || "bg-gray-50 text-gray-600 ring-gray-200/80"
                                                    }`}
                                                >
                                                    {enquiry.subject || "—"}
                                                </span>
                                            </td>
                                            <td className="truncate px-5 py-3 text-gray-500" title={enquiry.organization}>
                                                {enquiry.organization || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-3 text-right text-[13px] text-gray-500">
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
                    <SectionHeader title="Quick actions" subtitle="Jump to common tasks" />
                    <div className="grid grid-cols-2 gap-2.5 p-4">
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="group flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-[0_6px_16px_rgba(30,69,162,0.08)]"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 transition-all group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-[#3b6fd8] group-hover:text-white group-hover:ring-primary group-hover:shadow-[0_3px_8px_-2px_rgba(30,69,162,0.45)]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-[13px] font-medium leading-snug text-gray-700 group-hover:text-gray-900">
                                        {action.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Latest projects */}
            <Card>
                <SectionHeader
                    title="Latest projects"
                    subtitle="Most recently added projects"
                    href="/4dm1n-5p1nt/projects"
                    linkLabel="Manage projects"
                />
                {data.latestProjects.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                            <Workflow className="h-5 w-5" />
                        </span>
                        <p className="text-sm text-gray-500">No projects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3 2xl:grid-cols-5">
                        {data.latestProjects.map((article) => (
                            <Link
                                key={article.id}
                                href={`/4dm1n-5p1nt/projects/edit/${article.id}`}
                                className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    {article.thumbnail ? (
                                        <Image
                                            src={article.thumbnail}
                                            alt={article.title}
                                            fill
                                            sizes="(min-width: 1536px) 20vw, (min-width: 768px) 30vw, 100vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                        />
                                    ) : (
                                        <span className="flex h-full items-center justify-center text-gray-300">
                                            <Workflow className="h-8 w-8" />
                                        </span>
                                    )}
                                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                    {/* status / hidden badges */}
                                    <span className="absolute left-2.5 top-2.5 flex gap-1.5">
                                        {article.status && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm backdrop-blur ${
                                                    /ongoing/i.test(article.status)
                                                        ? "bg-amber-50/95 text-amber-700"
                                                        : /completed/i.test(article.status)
                                                          ? "bg-emerald-50/95 text-emerald-700"
                                                          : "bg-white/90 text-slate-600"
                                                }`}
                                            >
                                                {article.status}
                                            </span>
                                        )}
                                        {article.isHidden && (
                                            <span className="rounded-full bg-slate-900/75 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                                                Hidden
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="p-3.5">
                                    <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 group-hover:text-primary">
                                        {article.title}
                                    </p>
                                    <p className="mt-2 flex items-center gap-1.5 text-[12px] text-gray-500">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Added {formatDate(article.addedAt)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
