"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// English / Arabic tabs in the admin top bar: instead of the two columns side by side, an editor page shows one
// language at a time. Both columns stay mounted (only hidden), so switching never loses typing and one Submit still
// saves both languages. Only the pages listed here use it; the rest keep the side-by-side columns. Terms, Careers
// and Leadership use TinyMCE, which can come up blank inside a display:none column, so those pages hide their
// inactive column with visibility + 0 height instead (see their langColumn).
const LANG_TAB_PAGES = [
    "/admin/home",
    "/admin/about",
    "/admin/quality",
    "/admin/community-engagement",
    "/admin/hse",
    "/admin/sustainability",
    "/admin/accreditation",
    "/admin/global-presence",
    "/admin/projects/main",
    "/admin/news/add",
    "/admin/projects/add",
    "/admin/contact",
    "/admin/services/engineering-and-construction",
    "/admin/services/mep",
    "/admin/services/interior-design",
    "/admin/services/facade",
    "/admin/services/water",
    "/admin/services/integrated-facility-management",
    "/admin/services/design-studio",
    "/admin/terms-and-conditions",
    "/admin/careers",
    "/admin/leadership",
];

// pages whose address carries a record id (e.g. /admin/news/edit/<id>): matched by prefix
const LANG_TAB_PREFIXES = ["/admin/news/edit/", "/admin/projects/edit/"];

export type AdminLang = "en" | "ar";

// the open tab is kept in the URL (?lang=en / ?lang=ar) so a refresh or a shared link opens the same tab
const LANG_PARAM = "lang";
const readLangFromUrl = (): AdminLang =>
    new URLSearchParams(window.location.search).get(LANG_PARAM) === "ar" ? "ar" : "en";

// id of the editor form on a tabbed page; the Submit button in the top bar submits it through form={...}
export const LANG_TAB_FORM_ID = "admin-lang-tab-form";

type AdminLangTabValue = {
    // true on the pages above
    enabled: boolean;
    lang: AdminLang;
    setLang: (lang: AdminLang) => void;
    // after a failed submit: open English (Arabic fields are optional, so errors are always on English or shared
    // fields) and scroll to the first error message
    showErrors: () => void;
};

const AdminLangTabContext = createContext<AdminLangTabValue>({
    enabled: false,
    lang: "en",
    setLang: () => {},
    showErrors: () => {},
});

export const AdminLangTabProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname() || "";
    const enabled = LANG_TAB_PAGES.includes(pathname) || LANG_TAB_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const [lang, setLangState] = useState<AdminLang>("en");

    // on load and on every page change, open the tab named in the URL (English when there is none)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL, which is only readable on the client
        setLangState(enabled ? readLangFromUrl() : "en");
    }, [pathname, enabled]);

    // switch tab and write it to the URL; replaceState keeps the back button for real page changes
    // (Next.js picks up native history updates, so the router stays in sync)
    const setLang = useCallback((next: AdminLang) => {
        setLangState(next);
        const url = new URL(window.location.href);
        url.searchParams.set(LANG_PARAM, next);
        window.history.replaceState(window.history.state, "", url);
    }, []);

    const showErrors = useCallback(() => {
        setLang("en");
        // wait for the English column to show, then bring the first visible error into view
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                const firstError = Array.from(document.querySelectorAll<HTMLElement>("[data-form-error]")).find(
                    (el) => el.offsetParent !== null
                );
                firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            })
        );
    }, [setLang]);

    return (
        <AdminLangTabContext.Provider value={{ enabled, lang, setLang, showErrors }}>{children}</AdminLangTabContext.Provider>
    );
};

export const useAdminLangTab = () => useContext(AdminLangTabContext);
