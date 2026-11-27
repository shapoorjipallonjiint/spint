"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// English / Arabic tabs in the admin top bar: instead of the two columns side by side, an editor page shows one
// language at a time. Both columns stay mounted (only hidden), so switching never loses typing and one Submit still
// saves both languages. Only the pages listed here use it; the rest keep the side-by-side columns. Terms, Careers
// and Leadership use TinyMCE, which can come up blank inside a display:none column, so those pages hide their
// inactive column with visibility + 0 height instead (see their langColumn).
const LANG_TAB_PAGES = [
    "/4dm1n-5p1nt/home",
    "/4dm1n-5p1nt/about",
    "/4dm1n-5p1nt/quality",
    "/4dm1n-5p1nt/community-engagement",
    "/4dm1n-5p1nt/hse",
    "/4dm1n-5p1nt/sustainability",
    "/4dm1n-5p1nt/accreditation",
    "/4dm1n-5p1nt/global-presence",
    "/4dm1n-5p1nt/projects/main",
    "/4dm1n-5p1nt/news/add",
    "/4dm1n-5p1nt/projects/add",
    "/4dm1n-5p1nt/contact",
    "/4dm1n-5p1nt/services/engineering-and-construction",
    "/4dm1n-5p1nt/services/mep",
    "/4dm1n-5p1nt/services/interior-design",
    "/4dm1n-5p1nt/services/facade",
    "/4dm1n-5p1nt/services/water",
    "/4dm1n-5p1nt/services/integrated-facility-management",
    "/4dm1n-5p1nt/services/design-studio",
    "/4dm1n-5p1nt/terms-and-conditions",
    "/4dm1n-5p1nt/careers",
    "/4dm1n-5p1nt/leadership",
];

// pages whose address carries a record id (e.g. /4dm1n-5p1nt/news/edit/<id>): matched by prefix
const LANG_TAB_PREFIXES = ["/4dm1n-5p1nt/news/edit/", "/4dm1n-5p1nt/projects/edit/"];

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
    // turn the tabs on from a page itself (see useAdminLangTabFor)
    setOptIn: (on: boolean) => void;
};

const AdminLangTabContext = createContext<AdminLangTabValue>({
    enabled: false,
    lang: "en",
    setLang: () => {},
    showErrors: () => {},
    setOptIn: () => {},
});

export const AdminLangTabProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname() || "";
    // a page can also switch the tabs on for part of itself (e.g. only one of its own tabs): useAdminLangTabFor
    const [optIn, setOptIn] = useState(false);
    const enabled =
        optIn || LANG_TAB_PAGES.includes(pathname) || LANG_TAB_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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
        <AdminLangTabContext.Provider value={{ enabled, lang, setLang, showErrors, setOptIn }}>{children}</AdminLangTabContext.Provider>
    );
};

export const useAdminLangTab = () => useContext(AdminLangTabContext);

// For a page whose English / Arabic editor is only part of it (e.g. the News page's "Page" tab): the tabs are on
// while `active` is true, and off again when it turns false or the page is left.
export const useAdminLangTabFor = (active: boolean) => {
    const context = useContext(AdminLangTabContext);
    const { setOptIn } = context;
    useEffect(() => {
        setOptIn(active);
        return () => setOptIn(false);
    }, [active, setOptIn]);
    return context;
};
