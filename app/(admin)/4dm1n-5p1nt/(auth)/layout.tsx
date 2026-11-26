import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../client-side-link";
import AdminNavbar from "@/app/components/AdminNavbar/Index";
import AdminTopBar from "@/app/components/AdminNavbar/AdminTopBar";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";
import { AdminLangTabProvider } from "@/contexts/adminLangTab";
import { AdminShell } from "@/contexts/adminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminShell>
            <Toaster />
            {/* Sidebar */}
            <aside className="relative z-20 flex h-screen w-[var(--admin-sidebar-w)] shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-out group-data-[ready=false]/shell:transition-none admin-sidebar shadow-[8px_0_30px_-10px_rgba(11,31,77,0.35)]">
                {/* brand accent */}
                <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-300/80 to-sky-500/40" />

                <Link
                    href="/4dm1n-5p1nt"
                    className="group relative flex shrink-0 flex-col items-center gap-3 border-b border-white/10 px-6 pb-5 pt-8 transition-[padding] duration-300 group-data-[collapsed=true]/shell:px-2 group-data-[collapsed=true]/shell:pb-4 group-data-[collapsed=true]/shell:pt-6"
                >
                    <Image
                        src="/assets/logos/final-sp-logo.png"
                        alt="Shapoorji Pallonji"
                        width={1522}
                        height={897}
                        className="h-auto w-[124px] brightness-0 invert transition-[width,transform] duration-300 group-hover:scale-[1.03] group-data-[collapsed=true]/shell:w-[48px]"
                        priority
                    />
                    <span className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 whitespace-nowrap group-data-[collapsed=true]/shell:hidden">
                        Admin Console
                    </span>
                </Link>

                {/* only the navigation scrolls; logo and logout stay put */}
                <div className="admin-sidebar-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 group-data-[collapsed=true]/shell:px-2.5">
                    <nav>
                        <AdminNavbar />
                    </nav>
                    {/* soft fade so items don't cut off hard above the footer */}
                    <div className="pointer-events-none sticky -bottom-5 -mx-3 -mb-5 h-8 bg-gradient-to-t from-[#0c2259] to-transparent" />
                </div>

                {/* Account / logout section */}
                <div className="shrink-0 border-t border-white/10 p-3 group-data-[collapsed=true]/shell:p-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] group-data-[collapsed=true]/shell:p-1.5">
                        <div className="flex items-center gap-3 px-2 py-1.5 group-data-[collapsed=true]/shell:justify-center group-data-[collapsed=true]/shell:px-0">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-primary text-xs font-semibold text-white ring-2 ring-white/15">
                                SP
                            </span>
                            <span className="min-w-0 leading-tight group-data-[collapsed=true]/shell:hidden">
                                <span className="block truncate text-[13px] font-semibold text-white">Administrator</span>
                                <span className="flex items-center gap-1.5 text-[11px] text-white/55">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Signed in
                                </span>
                            </span>
                        </div>
                        <div className="mt-1.5 border-t border-white/10 pt-1.5">
                            <ClientSideLink
                                href="/4dm1n-5p1nt/logout"
                                name="Logout"
                                icon={<ArrowRightOnRectangleIcon className="h-[18px] w-[18px] text-red-300" />}
                                className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                            />
                        </div>
                    </div>
                </div>
                {/* right edge: brand gradient line (primary -> sky, fading out at the bottom) */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-sky-400 via-sky-400/40 to-white/5"
                />
            </aside>

            {/* Main content */}
            <AdminLangTabProvider>
            <main className="admin-canvas relative h-screen flex-1 overflow-hidden">
                <AdminTopBar />

                {/* Scrollable Content (relative: absolute children such as Radix's hidden <select> stay inside this scroller instead of stretching the page) */}
                <div className="relative mt-16 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar p-4">{children}</div>
            </main>
            </AdminLangTabProvider>
        </AdminShell>
    );
}
