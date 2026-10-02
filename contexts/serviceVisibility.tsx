"use client";

import { createContext, useContext, useMemo } from "react";
import { serviceSlugFromHref } from "@/lib/serviceRegistry";

// Hidden services for the website (set in admin Services > Main). Provided by the user layouts.
type ServiceVisibilityValue = { hiddenSlugs: Set<string>; hiddenIds: Set<string> };

const ServiceVisibilityContext = createContext<ServiceVisibilityValue>({ hiddenSlugs: new Set(), hiddenIds: new Set() });

export const ServiceVisibilityProvider = ({
    hiddenSlugs = [],
    hiddenIds = [],
    children,
}: {
    hiddenSlugs?: string[];
    hiddenIds?: string[];
    children: React.ReactNode;
}) => {
    const value = useMemo(
        () => ({ hiddenSlugs: new Set(hiddenSlugs), hiddenIds: new Set(hiddenIds.map(String)) }),
        [hiddenSlugs, hiddenIds]
    );
    return <ServiceVisibilityContext.Provider value={value}>{children}</ServiceVisibilityContext.Provider>;
};

export const useServiceVisibility = () => {
    const { hiddenSlugs, hiddenIds } = useContext(ServiceVisibilityContext);
    return {
        hiddenSlugs,
        hiddenIds,
        // true for links like "/services/mep" when MEP is hidden (non-service links are never hidden)
        isHiddenHref: (href?: string | null) => {
            const slug = serviceSlugFromHref(href);
            return !!slug && hiddenSlugs.has(slug);
        },
        isHiddenServiceId: (id?: unknown) => id != null && hiddenIds.has(String(id)),
    };
};

type MenuItem = { href?: string; submenu?: MenuItem[] | null; [key: string]: unknown };

// navData from app/components/data.js with hidden service links removed from every submenu
export const useVisibleNavData = <T extends { mainMenu: MenuItem[] }>(navData: T): T => {
    const { hiddenSlugs } = useContext(ServiceVisibilityContext);
    return useMemo(() => {
        if (!hiddenSlugs.size) return navData;
        const isHidden = (href?: string) => {
            const slug = serviceSlugFromHref(href);
            return !!slug && hiddenSlugs.has(slug);
        };
        return {
            ...navData,
            mainMenu: navData.mainMenu.map((item) => ({
                ...item,
                submenu: Array.isArray(item.submenu) ? item.submenu.filter((sub) => !isHidden(sub?.href)) : item.submenu,
            })),
        };
    }, [navData, hiddenSlugs]);
};
