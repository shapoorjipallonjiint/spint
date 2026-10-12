import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../../admin/client-side-link";
import AdminNavbar from "@/app/components/AdminNavbar/Index";
import Image from "next/image";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen overflow-hidden bg-gray-100">
            <Toaster />
            {/* Sidebar */}
            <aside className="relative w-68 bg-white shadow-md flex flex-col h-screen overflow-hidden">
                <div className="shrink-0 flex items-center w-full pt-10 pb-5 justify-center border-b border-gray-200">
                    <Image src="/assets/images/sp-logo.png" alt="Logo" width={150} height={85} className="w-[150px] h-auto" />
                </div>
                {/* only the navigation scrolls; logo and logout stay put */}
                <div className="relative flex-1 min-h-0 overflow-y-auto px-3">
                    <div className="mb-6 px-4 flex flex-col gap-2">
                        {/* <div className="flex items-center">
        <Image src="/assets/img/logo.svg" alt="Logo" width={150} height={150} />
          </div> */}
                    </div>
                    <nav className="space-y-1">
                        <AdminNavbar />
                    </nav>
                </div>

                {/* Logout Section */}
                <div className="shrink-0 px-3 py-4 border-t border-gray-200 bg-white">
                    <ClientSideLink
                        href="/admin/logout"
                        name="Logout"
                        icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    />
                </div>
            </aside>

            {/* Main content */}
            {/* <main className="flex-1  h-screen overflow-y-auto p-8 bg-gray-100">{children}</main> */}
            <main className="relative flex-1 h-screen overflow-hidden">
                {/* Fixed Top Bar */}
                <div className="grid grid-cols-2 w-[calc(100vw-272px)] shadow-sm py-4 px-4 fixed top-0 left-68 z-10 border-b bg-white">
                    <h3 className="font-bold text-primary">English Version</h3>
                    <h3 className="font-bold text-primary text-right">Arabic Version</h3>
                </div>

                {/* Scrollable Content (relative: absolute children such as Radix's hidden <select> stay inside this scroller instead of stretching the page) */}
                <div className="relative mt-14 h-[calc(100vh-56px)] overflow-y-auto p-4 bg-gray-100">{children}</div>
            </main>
        </div>
    );
}
