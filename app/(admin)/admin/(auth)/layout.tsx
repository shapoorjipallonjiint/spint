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
            <aside className="relative z-20 flex h-screen w-68 flex-col overflow-hidden border-r border-gray-200 bg-white">
                <Link
                    href="/admin"
                    className="flex shrink-0 items-center justify-center border-b border-gray-100 px-6 py-7"
                >
                    <Image src="/assets/images/sp-logo.png" alt="Logo" width={150} height={85} className="h-auto w-[132px]" />
                </Link>

                {/* only the navigation scrolls; logo and logout stay put */}
                <div className="admin-sidebar-scroll relative min-h-0 flex-1 overflow-y-auto px-3 py-5">
                    <nav>
                        <AdminNavbar />
                    </nav>
                </div>

                {/* Logout Section */}
                <div className="shrink-0 border-t border-gray-100 bg-white p-3">
                    <ClientSideLink
                        href="/admin/logout"
                        name="Logout"
                        icon={<ArrowRightOnRectangleIcon className="h-[18px] w-[18px] text-red-500" />}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    />
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
