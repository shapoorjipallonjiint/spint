"use client";

import { createContext, useContext, useMemo } from "react";
import { serviceSlugFromHref, sortByServiceOrder } from "@/lib/serviceRegistry";

// Hidden services and their display order for the website (set in admin Services > Main). Provided by the user layouts.
type ServiceVisibilityValue = {
    hiddenSlugs: Set<string>;
    hiddenIds: Set<string>;
    // [] = never reordered, lists keep their own order
    serviceOrder: string[];
    // service document id -> slug (projects link services by id)
    serviceIdSlugs: Record<string, string>;
};

const ServiceVisibilityContext = createContext<ServiceVisibilityValue>({
    hiddenSlugs: new Set(),
    hiddenIds: new Set(),
    serviceOrder: [],
    serviceIdSlugs: {},
});

export const ServiceVisibilityProvider = ({
    hiddenSlugs = [],
    hiddenIds = [],
    serviceOrder = [],
    serviceIdSlugs = {},
    children,
}: {
    hiddenSlugs?: string[];
    hiddenIds?: string[];
    serviceOrder?: string[];
    serviceIdSlugs?: Record<string, string>;
    children: React.ReactNode;
}) => {
    const value = useMemo(
        () => ({ hiddenSlugs: new Set(hiddenSlugs), hiddenIds: new Set(hiddenIds.map(String)), serviceOrder, serviceIdSlugs }),
        [hiddenSlugs, hiddenIds, serviceOrder, serviceIdSlugs]
    );
    return <ServiceVisibilityContext.Provider value={value}>{children}</ServiceVisibilityContext.Provider>;
};

export const useServiceVisibility = () => {
    const { hiddenSlugs, hiddenIds, serviceOrder, serviceIdSlugs } = useContext(ServiceVisibilityContext);
    return {
        hiddenSlugs,
        hiddenIds,
        // service links ("/services/mep") in the admin order; other links keep their place
        sortByHref: <T,>(items: T[], getHref: (item: T) => string | null | undefined) =>
            sortByServiceOrder(items, serviceOrder, (item) => serviceSlugFromHref(getHref(item))),
        // project services (linked by id) in the admin order
        sortByServiceId: <T,>(items: T[], getId: (item: T) => unknown) =>
            sortByServiceOrder(items, serviceOrder, (item) => {
                const id = getId(item);
                return id != null ? serviceIdSlugs[String(id)] : null;
            }),
        // true for links like "/services/mep" when MEP is hidden (non-service links are never hidden)
        isHiddenHref: (href?: string | null) => {
            const slug = serviceSlugFromHref(href);
            return !!slug && hiddenSlugs.has(slug);
        },
        isHiddenServiceId: (id?: unknown) => id != null && hiddenIds.has(String(id)),
    };
};

type MenuItem = { href?: string; submenu?: MenuItem[] | null; [key: string]: unknown };

// navData from app/components/data.js with hidden service links removed from every submenu and the service links in
// the admin order
export const useVisibleNavData = <T extends { mainMenu: MenuItem[] }>(navData: T): T => {
    const { hiddenSlugs, serviceOrder } = useContext(ServiceVisibilityContext);
    return useMemo(() => {
        if (!hiddenSlugs.size && !serviceOrder.length) return navData;
        const isHidden = (href?: string) => {
            const slug = serviceSlugFromHref(href);
            return !!slug && hiddenSlugs.has(slug);
        };
        return {
            ...navData,
            mainMenu: navData.mainMenu.map((item) => ({
                ...item,
                submenu: Array.isArray(item.submenu)
                    ? sortByServiceOrder(
                          item.submenu.filter((sub) => !isHidden(sub?.href)),
                          serviceOrder,
                          (sub) => serviceSlugFromHref(sub?.href)
                      )
                    : item.submenu,
            })),
        };
    }, [navData, hiddenSlugs, serviceOrder]);
};
