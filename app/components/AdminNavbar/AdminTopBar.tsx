"use client";

import { usePathname } from "next/navigation";

// Editor pages show the English / Arabic column headings; the dashboard shows its own title.
const AdminTopBar = () => {
    const pathname = usePathname();
    const isDashboard = pathname === "/admin";

    return (
        <div className="fixed top-0 left-68 z-10 grid h-14 w-[calc(100vw-272px)] grid-cols-2 items-center border-b border-gray-200 bg-white/90 px-6 backdrop-blur">
            {isDashboard ? (
                <>
                    <h3 className="font-semibold text-gray-900">Dashboard</h3>
                    <p className="text-right text-sm text-gray-500" suppressHydrationWarning>
                        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </>
            ) : (
                <>
                    <h3 className="font-bold text-primary">English Version</h3>
                    <h3 className="font-bold text-primary text-right">Arabic Version</h3>
                </>
            )}
        </div>
    );
};

export default AdminTopBar;
