"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LANG_TAB_FORM_ID, useAdminLangTab, type AdminLang } from "@/contexts/adminLangTab";

const LANG_TABS: { value: AdminLang; code: string; label: string; native?: string }[] = [
    { value: "en", code: "EN", label: "English" },
    { value: "ar", code: "AR", label: "Arabic", native: "العربية" },
];

// Editor pages show the English / Arabic column headings (or the language tabs on pages that use them);
// the dashboard shows its own title.
const AdminTopBar = () => {
    const pathname = usePathname();
    const isDashboard = pathname === "/admin";
    const { enabled: hasLangTabs, lang, setLang } = useAdminLangTab();

    return (
        <div className="fixed top-0 left-68 z-10 grid h-14 w-[calc(100vw-272px)] grid-cols-2 items-center border-b border-gray-200 bg-white/90 px-6 backdrop-blur">
            {isDashboard ? (
                <>
                    <h3 className="font-semibold text-gray-900">Dashboard</h3>
                    <p className="text-right text-sm text-gray-500" suppressHydrationWarning>
                        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </>
            ) : hasLangTabs ? (
                <>
                    {/* segmented control: equal-width options with a white pill that slides under the active one */}
                    <div
                        role="tablist"
                        aria-label="Editing language"
                        className="relative grid w-fit grid-cols-2 rounded-full border border-gray-200/80 bg-gray-100/80 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]"
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
                                        active ? "text-gray-900" : "text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    <span
                                        className={`rounded-[5px] px-1.5 py-px text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                                            active ? "bg-primary text-white" : "bg-gray-200/80 text-gray-500"
                                        }`}
                                    >
                                        {tab.code}
                                    </span>
                                    {tab.label}
                                    {tab.native && (
                                        <span lang="ar" className={`font-normal transition-colors ${active ? "text-primary" : "text-gray-400"}`}>
                                            {tab.native}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {/* submits the page's form from outside it; saves both languages */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            form={LANG_TAB_FORM_ID}
                            title="Saves both English and Arabic"
                            className="h-9 cursor-pointer rounded-full px-6 text-[13px] text-white"
                        >
                            Submit
                        </Button>
                    </div>
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
