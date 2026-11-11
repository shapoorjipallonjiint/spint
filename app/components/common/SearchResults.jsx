"use client";

import LangLink from "@/lib/LangLink";

// Groups /api/search results by type so users can tell projects, services and press releases apart.
// Results keep the API's relevance order inside each group.
const GROUPS = [
    {
        key: "project",
        label: "Projects",
        label_ar: "المشاريع",
        match: (item) => Boolean(item?.project),
        href: (item) => `/projects/${item.project.slug}`,
        title: (item, isArabic) => pickTitle(item.project?.firstSection?.title, item.project?.firstSection?.title_ar, isArabic),
    },
    {
        key: "service",
        label: "Services",
        label_ar: "الخدمات",
        match: (item) => item?.type === "service",
        href: (item) => `/services/${item.item.link}`,
        title: (item, isArabic) => pickTitle(item.item?.title, item.item?.title_ar, isArabic),
    },
    {
        key: "news",
        label: "Press Releases",
        label_ar: "البيانات الصحفية",
        match: (item) => item?.type === "news",
        href: (item) => `/press-releases/${item.item.slug}`,
        title: (item, isArabic) => pickTitle(item.item?.title, item.item?.title_ar, isArabic),
    },
];

const pickTitle = (en, ar, isArabic) => (isArabic && ar?.trim() ? ar : en);

/**
 * @param result    array from /api/search, or null before any search
 * @param onSelect  called when a result is clicked (close the panel, clear results)
 * @param isArabic  shows Arabic labels/titles when true
 * @param columns   1 or 2 columns for the items inside each group
 */
const SearchResults = ({ result, onSelect, isArabic = false, columns = 1 }) => {
    if (!result) return null;

    if (result.length === 0) {
        return <div className="text-sm">{isArabic ? "لا توجد نتائج" : "No Results"}</div>;
    }

    const groups = GROUPS.map((group) => ({ ...group, items: result.filter(group.match) })).filter(
        (group) => group.items.length > 0,
    );

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pb-5">
            {groups.map((group) => (
                <section key={group.key}>
                    <div className="text-md font-semibold mb-3">
                        {isArabic ? group.label_ar : group.label}{" "}
                        <span className="font-normal opacity-60">({group.items.length})</span>
                    </div>
                    <ul className={`grid ${columns === 2 ? "grid-cols-2" : "grid-cols-1"} list-disc gap-x-5 gap-y-3 text-sm px-4`}>
                        {group.items.map((item, index) => (
                            <li key={`${group.key}-${index}`}>
                                <LangLink href={group.href(item)} className="cursor-pointer hover:underline" onClick={onSelect}>
                                    {group.title(item, isArabic)}
                                </LangLink>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
};

export default SearchResults;
