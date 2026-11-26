"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANG_TAB_FORM_ID, useAdminLangTab, type AdminLang } from "@/contexts/adminLangTab";

const LANG_TABS: { value: AdminLang; code: string; label: string; native?: string }[] = [
    { value: "en", code: "EN", label: "English" },
    { value: "ar", code: "AR", label: "Arabic", native: "العربية" },
];

// breadcrumb wording for URL segments that don't read well title-cased
const SEGMENT_LABELS: Record<string, string> = {
    hse: "HSE",
    mep: "MEP",
    "integrated-facility-management": "Facility Management",
    "engineering-and-construction": "Engineering & Construction",
    "terms-and-conditions": "Terms & Conditions",
    "map-locations": "Map Locations",
    "global-presence": "Global Presence",
    "community-engagement": "Community Engagement",
    "design-studio": "Design Studio",
    "interior-design": "Interior Design",
    list: "List",
    main: "Main",
};
const titleCase = (segment: string) =>
    SEGMENT_LABELS[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// record ids in the URL (Mongo ObjectId / numbers) are not shown in the breadcrumb
const isId = (segment: string) => /^[a-f0-9]{24}$/i.test(segment) || /^\d+$/.test(segment);

// pages with no side-by-side English / Arabic columns (lists, tables, single-column settings): no column legend
const NO_COLUMN_PAGES = [
    "/4dm1n-5p1nt/projects",
    "/4dm1n-5p1nt/accreditation/list",
    "/4dm1n-5p1nt/careers/enquiries",
    "/4dm1n-5p1nt/contact/enquiries",
    "/4dm1n-5p1nt/home/map-locations",
    "/4dm1n-5p1nt/settings",
    "/4dm1n-5p1nt/header",
    "/4dm1n-5p1nt/footer",
    "/4dm1n-5p1nt/services/main",
];
// same, for every page under these (the gallery and its album pages)
const NO_COLUMN_PREFIXES = ["/4dm1n-5p1nt/gallery"];

// Top bar of every admin page: breadcrumb on the left; in the middle the English / Arabic tabs (pages that use
// them) or a legend for the side-by-side columns; on the right "View site" and, with tabs, Submit.
const AdminTopBar = () => {
    const pathname = usePathname() || "";
    const isDashboard = pathname === "/4dm1n-5p1nt";
    const { enabled: hasLangTabs, lang, setLang } = useAdminLangTab();

    const crumbs = pathname
        .split("/")
        .filter(Boolean)
        .slice(1) // drop "admin"
        .filter((segment) => !isId(segment))
        .map(titleCase);
    const showColumnLegend =
        !isDashboard &&
        !hasLangTabs &&
        !NO_COLUMN_PAGES.includes(pathname) &&
        !NO_COLUMN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

    return (
        <div className="fixed top-0 left-[var(--admin-sidebar-w)] z-10 grid h-14 w-[calc(100vw-var(--admin-sidebar-w))] grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-200/60 bg-white/75 px-6 shadow-[0_6px_20px_-14px_rgba(15,23,42,0.18)] backdrop-blur-xl backdrop-saturate-150 transition-[left,width] duration-300 ease-out group-data-[ready=false]/shell:transition-none">
            {/* brand hairline along the bottom edge */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            />

            {/* LEFT: where you are */}
            <div className="flex min-w-0 items-center gap-3">
                {isDashboard ? (
                    <>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#3b6fd8] text-white shadow-[0_3px_8px_-2px_rgba(30,69,162,0.45)]">
                            <LayoutDashboard className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 leading-tight">
                            <h3 className="text-[15px] font-semibold text-slate-900">Dashboard</h3>
                            <p className="truncate text-[12px] text-slate-500" suppressHydrationWarning>
                                {new Date().toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </>
                ) : (
                    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
                        <Link href="/4dm1n-5p1nt" className="shrink-0 text-slate-400 transition-colors hover:text-primary">
                            Admin
                        </Link>
                        {crumbs.map((crumb, i) => {
                            const last = i === crumbs.length - 1;
                            return (
                                <span key={`${crumb}-${i}`} className="flex min-w-0 items-center gap-1.5">
                                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                                    <span
                                        className={`truncate ${last ? "font-semibold text-slate-900" : "text-slate-500"}`}
                                        aria-current={last ? "page" : undefined}
                                    >
                                        {crumb}
                                    </span>
                                </span>
                            );
                        })}
                    </nav>
                )}
            </div>

            {/* CENTER: language tabs, or a legend for the side-by-side English / Arabic columns */}
            <div className="flex justify-center">
                {hasLangTabs ? (
                    // segmented control: equal-width options with a white pill that slides under the active one
                    <div
                        role="tablist"
                        aria-label="Editing language"
                        className="relative grid w-fit grid-cols-2 rounded-full border border-slate-200/80 bg-slate-100/80 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]"
                    >
                        <span
                            aria-hidden
                            className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12),0_0_0_1px_rgba(30,69,162,0.08)] transition-transform duration-300 ease-out ${
                                lang === "ar" ? "translate-x-full" : "translate-x-0"
                            }`}
                        />
                        {LANG_TABS.map((tab) => {
                            const active = lang === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setLang(tab.value)}
                                    className={`relative z-[1] flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                                        active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    <span
                                        className={`rounded-[5px] px-1.5 py-px text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                                            active ? "bg-primary text-white" : "bg-slate-200/80 text-slate-500"
                                        }`}
                                    >
                                        {tab.code}
                                    </span>
                                    {tab.label}
                                    {tab.native && (
                                        <span lang="ar" className={`font-normal transition-colors ${active ? "text-primary" : "text-slate-400"}`}>
                                            {tab.native}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : showColumnLegend ? (
                    // the page shows both languages side by side: English on the left, Arabic on the right
                    <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-1.5 py-1 text-[12px] text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <span className="rounded-[4px] bg-primary px-1 text-[9px] font-semibold text-white">EN</span>
                            English
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5">
                            <span className="rounded-[4px] bg-primary px-1 text-[9px] font-semibold text-white">AR</span>
                            Arabic
                            <span lang="ar" className="text-primary">
                                العربية
                            </span>
                        </span>
                    </div>
                ) : null}
            </div>

            {/* RIGHT: view the website; with tabs, Submit (saves both languages) */}
            <div className="flex items-center justify-end gap-2">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open the website in a new tab"
                    className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3.5 text-[13px] font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-primary/30 hover:text-primary"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View site
                </a>
                {hasLangTabs && (
                    <Button
                        type="submit"
                        form={LANG_TAB_FORM_ID}
                        title="Saves both English and Arabic"
                        className="h-9 cursor-pointer rounded-full px-6 text-[13px] text-white"
                    >
                        Submit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AdminTopBar;
