import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../../admin/client-side-link";
import AdminNavbar from "@/app/components/AdminNavbar/Index";
import Image from "next/image";
import { Toaster } from "sonner";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Toaster />
            {/* Sidebar */}
            <aside className="w-68 bg-white shadow-md flex flex-col h-screen overflow-y-auto">
                <div className="flex items-center w-full pt-10 pb-2 justify-center">
                    <Image src="/main-logo.svg" alt="Logo" width={150} height={150} />
                </div>
                <div className="flex-1 px-3 py-4">
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
                <div className="px-3 py-4 border-t border-gray-200">
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
            <main className="flex-1 h-screen overflow-hidden">
                {/* Fixed Top Bar */}
                <div className="grid grid-cols-2 w-[calc(100vw-272px)]  shadow-sm py-4 px-4 fixed top-0 left-68 z-10 border-b bg-white">
                    <h2 className="font-bold text-primary">English Version</h2>
                    <h2 className="font-bold text-primary text-right">Arabic Version</h2>
                </div>

                {/* Scrollable Content */}
                <div className="mt-14 h-[calc(100vh-72px)] overflow-y-auto p-4 bg-gray-100">{children}</div>
            </main>
        </div>
    );
}
