import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../../admin/client-side-link";
import AdminNavbar from "@/app/components/AdminNavbar/Index";
import AdminTopBar from "@/app/components/AdminNavbar/AdminTopBar";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen overflow-hidden bg-gray-100">
            <Toaster />
            {/* Sidebar */}
            <aside className="relative z-20 flex h-screen w-68 flex-col overflow-hidden border-r border-gray-200/80 bg-gradient-to-b from-white via-white to-slate-50 shadow-[1px_0_12px_rgba(15,23,42,0.03)]">
                {/* brand accent */}
                <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-sky-400" />

                <Link
                    href="/admin"
                    className="group relative flex shrink-0 flex-col items-center gap-3 border-b border-gray-300 bg-[radial-gradient(ellipse_at_top,rgba(30,69,162,0.07),transparent_70%)] px-6 pb-5 pt-8"
                >
                    <Image
                        src="/assets/images/sp-logo.png"
                        alt="Shapoorji Pallonji"
                        width={404}
                        height={228}
                        className="h-auto w-[124px] transition-transform duration-300 group-hover:scale-[1.03]"
                        priority
                    />
                    <span className="rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Admin Console
                    </span>
                </Link>

                {/* only the navigation scrolls; logo and logout stay put */}
                <div className="admin-sidebar-scroll relative min-h-0 flex-1 overflow-y-auto px-3 py-5">
                    <nav>
                        <AdminNavbar />
                    </nav>
                    {/* soft fade so items don't cut off hard above the footer */}
                    <div className="pointer-events-none sticky -bottom-5 -mx-3 -mb-5 h-8 bg-gradient-to-t from-slate-50 to-transparent" />
                </div>

                {/* Account / logout section */}
                <div className="shrink-0 border-t border-gray-300 p-3">
                    <div className="rounded-xl border border-gray-200/80 bg-white p-2 shadow-sm">
                        <div className="flex items-center gap-3 px-2 py-1.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-xs font-semibold text-white ring-2 ring-primary/10">
                                SP
                            </span>
                            <span className="min-w-0 leading-tight">
                                <span className="block truncate text-[13px] font-semibold text-gray-900">Administrator</span>
                                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Signed in
                                </span>
                            </span>
                        </div>
                        <div className="mt-1.5 border-t border-gray-100 pt-1.5">
                            <ClientSideLink
                                href="/admin/logout"
                                name="Logout"
                                icon={<ArrowRightOnRectangleIcon className="h-[18px] w-[18px] text-red-500" />}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="relative h-screen flex-1 overflow-hidden">
                <AdminTopBar />

                {/* Scrollable Content (relative: absolute children such as Radix's hidden <select> stay inside this scroller instead of stretching the page) */}
                <div className="relative mt-14 h-[calc(100vh-56px)] overflow-y-auto bg-gray-100 p-4">{children}</div>
            </main>
        </div>
    );
}
