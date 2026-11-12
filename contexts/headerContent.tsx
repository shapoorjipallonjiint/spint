"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_HEADER, type HeaderData } from "@/lib/header";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

// Website header content (admin Header page). Provided by the user layouts; the default header otherwise.
const HeaderContentContext = createContext<HeaderData>(DEFAULT_HEADER);

export const HeaderContentProvider = ({ data, children }: { data: HeaderData; children: React.ReactNode }) => (
    <HeaderContentContext.Provider value={data}>{children}</HeaderContentContext.Provider>
);

// The menu in the shape the header components were built on ({ mainMenu: [{ id, title, href, submenu }] }):
// ids follow the display order, dropdown items link to "#", and items without links have no submenu.
// Pass the result through useVisibleNavData so hidden services are removed.
export const useHeaderNavData = () => {
    const { menu } = useContext(HeaderContentContext);
    return useMemo(
        () => ({
            mainMenu: menu.map((item, index) => ({
                id: index + 1,
                title: item.title,
                title_ar: item.title_ar,
                href: item.submenu.length ? item.href || "#" : item.href,
                submenu: item.submenu.length ? item.submenu : null,
            })),
        }),
        [menu]
    );
};

// "Employee Login" button: null when hidden or without a link; label in the current language
export const useHeaderPortal = () => {
    const { portal } = useContext(HeaderContentContext);
    const isArabic = useIsPreferredLanguageArabic();
    if (portal.hidden || !portal.href) return null;
    return { href: portal.href, label: (isArabic && portal.label_ar) || portal.label || "Employee Login" };
};
