"use client";

import { Listbox } from "@headlessui/react";
import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { dropdownItemVariants, dropdownListVariants, moveUp } from "../../../motionVarients";
import { statusData, UI_LABELS } from "@/app/components/AdminProject/statusData";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import { slugify } from "@/lib/slugify";
import ProjectCard from "./ProjectCard";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 12;
const MotionImage = motion.create(Image);

const ALL = { slug: "", ids: new Set(), label: UI_LABELS.ALL_OPTION.name, label_ar: UI_LABELS.ALL_OPTION.name_ar };

// one option per slug (two sectors with the same name become one option that matches both)
const toOptions = (list = [], labelKey = "name") => {
    const bySlug = new Map();
    (list || []).forEach((entry) => {
        const slug = slugify(entry?.[labelKey]);
        if (!slug) return;
        if (!bySlug.has(slug)) {
            bySlug.set(slug, {
                slug,
                ids: new Set(),
                label: entry?.[labelKey],
                label_ar: entry?.[`${labelKey}_ar`],
            });
        }
        if (entry?._id) bySlug.get(slug).ids.add(String(entry._id));
    });
    return [ALL, ...bySlug.values()];
};

const ProjectLists = ({ sectorData, countryData, serviceData, data, visitorCountry }) => {
    const tData = useApplyLang(data);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isArabic = useIsPreferredLanguageArabic();
    const [isAnimating, setIsAnimating] = useState(false);
    // first load: cards wait for the filter bar (moveUp(0.5), 0.7s) so the filters appear first;
    // once the bar has animated in, cards revealed while scrolling get no extra delay
    const [filterBarShown, setFilterBarShown] = useState(false);
    const cardRevealDelay = filterBarShown ? 0 : 0.8;
    const sectionRef = useRef(null);
    const listTopRef = useRef(null);
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    // ---------- filter options (built from the untranslated data, so slugs are always English) ----------
    const sectorOptions = useMemo(() => toOptions(sectorData), [sectorData]);
    const countryOptions = useMemo(() => toOptions((countryData || []).filter((c) => c?.showInProjectFilter)), [countryData]);
    const serviceOptions = useMemo(() => toOptions(serviceData, "title"), [serviceData]);
    const statusOptions = useMemo(
        () => toOptions(statusData.filter((item) => item.name && item.name.toLowerCase() !== "nill")),
        [],
    );

    const optionLabel = (opt) => (isArabic ? opt?.label_ar || opt?.label : opt?.label);
    const pick = (options, slug) => options.find((opt) => opt.slug === slug) ?? ALL;

    // ---------- current state, read from the URL ----------
    const selectedSector = pick(sectorOptions, searchParams.get("sector") || "");
    const selectedStatus = pick(statusOptions, searchParams.get("status") || "");
    const selectedCountry = pick(countryOptions, searchParams.get("country") || "");
    const selectedService = pick(serviceOptions, searchParams.get("service") || "");
    const view = searchParams.get("view") === "list" ? "list" : "grid";
    const requestedPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

    // locations whose country code is the visitor's (several map locations can share one country)
    const visitorLocationIds = useMemo(
        () =>
            new Set(
                (countryData || [])
                    .filter((c) => visitorCountry && c?.code?.toUpperCase() === visitorCountry)
                    .map((c) => String(c._id))
            ),
        [countryData, visitorCountry]
    );

    // ---------- filtering (by ids / English status, independent of the page language) ----------
    const filteredItems = useMemo(() => {
        const translatedById = new Map((tData || []).map((item) => [String(item?._id), item]));

        const matched = (data || [])
            .filter((item) => {
                const second = item?.secondSection || {};
                if (selectedSector.slug && !(second.sector || []).some((sec) => selectedSector.ids.has(String(sec?._id))))
                    return false;
                if (selectedStatus.slug && slugify(second.status) !== selectedStatus.slug) return false;
                if (selectedCountry.slug && !selectedCountry.ids.has(String(second.location?._id))) return false;
                if (selectedService.slug && !(second.service || []).some((sv) => selectedService.ids.has(String(sv?.serviceId))))
                    return false;
                return true;
            });

        // visitor's country first, everything else after it, both in the existing order (no match = unchanged)
        const isVisitorCountry = (item) => visitorLocationIds.has(String(item?.secondSection?.location?._id));
        return [...matched.filter(isVisitorCountry), ...matched.filter((item) => !isVisitorCountry(item))].map(
            (item) => translatedById.get(String(item?._id)) || item
        );
    }, [data, tData, selectedSector, selectedStatus, selectedCountry, selectedService, visitorLocationIds]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(requestedPage, totalPages);
    const currentItems = useMemo(
        () => filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [currentPage, filteredItems],
    );

    // ---------- URL updates ----------
    // replace: filters / view (no history entry per click). push: page changes (Back goes to the previous page).
    const updateUrl = (changes, { push = false } = {}) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") params.delete(key);
            else params.set(key, String(value));
        });
        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;
        if (push) router.push(url, { scroll: false });
        else router.replace(url, { scroll: false });
    };

    const handleFilterChange = (key) => (opt) => updateUrl({ [key]: opt?.slug || null, page: null });
    const handleSectorChange = handleFilterChange("sector");
    const handleStatusChange = handleFilterChange("status");
    const handleCountryChange = handleFilterChange("country");
    const handleServiceChange = handleFilterChange("service");

    const hasActiveFilters = Boolean(selectedSector.slug || selectedStatus.slug || selectedCountry.slug || selectedService.slug);

    const handleClearFilters = () => updateUrl({ sector: null, status: null, country: null, service: null, page: null });

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || isAnimating) return;
        setIsAnimating(true);
        updateUrl({ page: newPage === 1 ? null : newPage }, { push: true });
        // bring the top of the project list into view (not the top of the page)
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setIsAnimating(false), 300);
    };
    const handlePrev = () => handlePageChange(currentPage - 1);
    const handleNext = () => handlePageChange(currentPage + 1);

    const handleView = () => updateUrl({ view: "list" });
    const handleGrid = () => updateUrl({ view: null });
    const [showFilters, setShowFilters] = useState(false);

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="container">
                <motion.div
                    variants={moveUp(0.5)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    ref={listTopRef}
                    onAnimationComplete={() => setFilterBarShown(true)}
                    className="border-b border-t mt-80px border-cmnbdr mb-50px py-4 md:py-6 xl:py-[35px] scroll-mt-28"
                >
                    {/* filters + view toggles: one row from 2xl; below that the toggles sit on their own line at the left */}
                    <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between 2xl:gap-10">
                        <div className="lg:hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-between w-full gap-2 border border-white/20 text-paragraph text-[14px] uppercase"
                            >
                                <span>Filter</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="w-[16px] h-[16px]"
                                >
                                    <path d="M1 8H15" stroke="#464646" strokeWidth="2" strokeLinecap="round" />
                                    {!showFilters && (
                                        <path d="M8 1V15" stroke="#464646" strokeWidth="2" strokeLinecap="round" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        <div className={` ${showFilters ? "block" : "hidden"} lg:block mt-4 lg:mt-0`}>
                            <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between 2xl:justify-start md:gap-10 lg:gap-12 2xl:gap-[100px] 3xl:gap-[174px]">
                                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-x-8 md:gap-y-3 lg:gap-x-10 2xl:gap-x-[60px] 3xl:gap-x-[90px] w-full md:w-auto">
                                    {/* Sector */}
                                    <div className="w-full md:w-fit relative">
                                        <Listbox value={selectedSector} onChange={handleSectorChange} by="slug">
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[14px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="whitespace-nowrap text-paragraph text-16 font-semibold uppercase">
                                                    {selectedSector.slug ? optionLabel(selectedSector) : isArabic ? UI_LABELS.SECTOR.ar : UI_LABELS.SECTOR.en}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
                                                    className="w-[16px] h-[10px]"
                                                >
                                                    <path
                                                        d="M15 1L7.9992 8L1 1.00159"
                                                        stroke="#464646"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Listbox.Button>
                                            <Listbox.Options
                                                as={motion.div}
                                                initial="hidden"
                                                animate="show"
                                                variants={dropdownListVariants}
                                                onWheel={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                onTouchMove={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                className=" absolute w-full md:w-[290px] h-[290px] overflow-y-auto overscroll-contain  bg-white rounded-sm shadow-sm z-[50]" >
                                                {sectorOptions.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.slug || "all"}
                                                        value={opt}
                                                        as={motion.div}
                                                        variants={dropdownItemVariants}
                                                        className=" py-1 px-4 cursor-pointer group hover:bg-[#f0f0f0] hover:font-bold transition-colors duration-300 w-full " >
                                                        <span className=" transition-transform duration-300 group-hover:scale-[1.03] " >
                                                            {optionLabel(opt)}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Status */}
                                    <div className="w-full md:w-fit relative">
                                        <Listbox value={selectedStatus} onChange={handleStatusChange} by="slug">
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[14px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="whitespace-nowrap text-paragraph text-16 font-semibold uppercase">
                                                    {selectedStatus.slug ? optionLabel(selectedStatus) : isArabic ? UI_LABELS.STATUS.ar : UI_LABELS.STATUS.en}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
                                                    className="w-[16px] h-[10px]"
                                                >
                                                    <path
                                                        d="M15 1L7.9992 8L1 1.00159"
                                                        stroke="#464646"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Listbox.Button>
                                            <Listbox.Options
                                                as={motion.div}
                                                initial="hidden"
                                                animate="show"
                                                variants={dropdownListVariants}
                                                className="border-0 outline-0 absolute w-full md:w-[150px] bg-white rounded-sm shadow-sm z-[1]"
                                            >
                                                {statusOptions.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.slug || "all"}
                                                        value={opt}
                                                        as={motion.div}
                                                        variants={dropdownItemVariants}
                                                        className=" py-1 px-4 cursor-pointer group hover:bg-[#f0f0f0] hover:font-bold w-full transition-colors duration-300 " >
                                                        <span className="group-hover:scale-[1.03] transition-transform duration-300">
                                                            {optionLabel(opt)}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Country */}
                                    <div className="w-full md:w-fit relative">
                                        <Listbox value={selectedCountry} onChange={handleCountryChange} by="slug">
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[14px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="whitespace-nowrap text-paragraph text-16 font-semibold uppercase">
                                                    {selectedCountry.slug ? optionLabel(selectedCountry) : isArabic ? UI_LABELS.COUNTRY.ar : UI_LABELS.COUNTRY.en}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
                                                    className="w-[16px] h-[10px]"
                                                >
                                                    <path
                                                        d="M15 1L7.9992 8L1 1.00159"
                                                        stroke="#464646"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Listbox.Button>
                                            <Listbox.Options
                                                as={motion.div}
                                                initial="hidden"
                                                animate="show"
                                                variants={dropdownListVariants}
                                                className="
    border-0 outline-0
    absolute w-full md:w-[200px]
    max-h-[220px] overflow-y-auto
    bg-white rounded-sm shadow-sm z-[50]
  "
                                                onWheel={(e) => e.stopPropagation()}
                                                onTouchMove={(e) => e.stopPropagation()}
                                            >
                                                {countryOptions.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.slug || "all"}
                                                        value={opt}
                                                        as={motion.div}
                                                        variants={dropdownItemVariants}
                                                        className="
        py-1 px-4
        cursor-pointer group
        hover:bg-[#f0f0f0]
        hover:font-bold transition-colors duration-300
        w-full
      "
                                                    >
                                                        <span className="group-hover:scale-[1.03] transition-transform duration-300">
                                                            {optionLabel(opt)}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Service */}
                                    <div className="w-full md:w-fit relative">
                                        <Listbox value={selectedService} onChange={handleServiceChange} by="slug">
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[14px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="whitespace-nowrap text-paragraph text-16 font-semibold uppercase">
                                                    {selectedService.slug ? optionLabel(selectedService) : isArabic ? UI_LABELS.SERVICE.ar : UI_LABELS.SERVICE.en}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
                                                    className="w-[16px] h-[10px]"
                                                >
                                                    <path
                                                        d="M15 1L7.9992 8L1 1.00159"
                                                        stroke="#464646"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </Listbox.Button>
                                            <Listbox.Options
                                                as={motion.div}
                                                initial="hidden"
                                                animate="show"
                                                variants={{
                                                    hidden: {},
                                                    show: {
                                                        transition: {
                                                            staggerChildren: 0.08,
                                                        },
                                                    },
                                                }}
                                                className="border-0 outline-0 absolute w-full md:w-[200px] 2xl:w-[270px] bg-white rounded-sm shadow-sm z-[1]"
                                            >
                                                {serviceOptions.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.slug || "all"}
                                                        value={opt}
                                                        as={motion.div}
                                                        variants={{
                                                            hidden: {
                                                                opacity: 0,
                                                                x: -6,
                                                                y: -10,
                                                                filter: "blur(1px)",
                                                            },
                                                            show: {
                                                                opacity: 1,
                                                                x: 0,
                                                                y: 0,
                                                                filter: "blur(0px)",
                                                                transition: {
                                                                    duration: 0.4,
                                                                    ease: "easeOut",
                                                                },
                                                            },
                                                        }}
                                                        className="py-1 px-4 hover:bg-[#f0f0f0] cursor-pointer group hover:font-bold transition-colors duration-300 w-full"
                                                    >
                                                        <span className="group-hover:scale-[1.03] transition-transform duration-300">
                                                            {optionLabel(opt)}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                </div>

                                {/* Clear Filter: only when a filter is applied in the URL */}
                                {hasActiveFilters && (
                                <div className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="flex items-center gap-[8px] lg:gap-[10px] cursor-pointer"
                                    >
                                        <div className={`${isArabic ? "rotate-180" : ""}`}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 27 17"
                                                fill="none"
                                                className="w-[20px] h-[14px] lg:w-[27px] lg:h-[17px]"
                                            >
                                                <g clipPath="url(#clip0_3119_4427)">
                                                    <path
                                                        d="M9.36719 1.93262L1.98894 8.5134L9.34206 15.0679"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.40464 8.5H25.0195"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3119_4427">
                                                        <rect
                                                            width="27"
                                                            height="17"
                                                            fill="white"
                                                            transform="matrix(-1 0 0 1 27 0)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p className="uppercase text-16 text-paragraph font-light w-max">
                                            {isArabic ? UI_LABELS.CLEAR_FILTER.ar : UI_LABELS.CLEAR_FILTER.en}
                                        </p>
                                    </button>
                                </div>
                                )}
                            </div>
                        </div>
                        {/* View toggles */}
                        <div className="flex shrink-0 items-center gap-6 lg:gap-5 2xl:gap-[30px] justify-start mt-4 md:mt-5 2xl:mt-0">
                            <div className="flex group items-center gap-[6px] cursor-pointer" onClick={handleGrid}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 19 19"
                                    fill="none"
                                    className={`w-[16px] h-[16px] md:w-[19px] md:h-[19px] brightness-0 group-hover:brightness-100 transition-all duration-300 ${view === "grid" ? "brightness-100" : "brightness-0"
                                        }`}
                                >
                                    <rect width="8" height="8" fill="#30B6F9" />
                                    <rect y="11" width="8" height="8" fill="#30B6F9" />
                                    <rect x="11" width="8" height="8" fill="#30B6F9" />
                                    <rect x="11" y="11" width="8" height="8" fill="#30B6F9" />
                                </svg>
                                <p className="uppercase whitespace-nowrap text-[12px] md:text-[14px] lg:text-16 text-paragraph font-light ">
                                    {isArabic ? UI_LABELS.GRID_VIEW.ar : UI_LABELS.GRID_VIEW.en}
                                </p>
                            </div>
                            <div
                                className="flex group items-center gap-[6px] cursor-pointer"
                                // onClick={() => setView("list")}
                                onClick={handleView}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-[14px] h-[11px] md:w-[19px] md:h-[13px] brightness-0 group-hover:brightness-100 transition-all duration-300 ${view === "list" ? "brightness-100" : "brightness-0"
                                        }`}
                                    viewBox="0 0 19 13"
                                    fill="none"
                                >
                                    <line y1="0.5" x2="19" y2="0.5" stroke="#30B6F9" />
                                    <line y1="12.5" x2="19" y2="12.5" stroke="#30B6F9" />
                                </svg>
                                <p className="uppercase whitespace-nowrap text-[12px] md:text-[14px] lg:text-16 text-paragraph font-light ">
                                    {isArabic ? UI_LABELS.LIST_VIEW.ar : UI_LABELS.LIST_VIEW.en}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* GRID VIEW */}
                <div className={`gap-5 3xl:gap-x-30px  gap-y-50px pb-10 xl:pb-[70px] transition-all duration-300 
                ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"} ${view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3" : "hidden"
                        }`}
                    style={{
                        transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
                    }}
                >
                    {currentItems.map((item) => (
                        <ProjectCard key={item._id} item={item} variant="grid" isArabic={isArabic} revealDelay={cardRevealDelay} />
                    ))}

                    {currentItems.length === 0 && (
                        <div className="col-span-full text-center py-10 text-paragraph">
                            No projects found for selected filters.
                        </div>
                    )}
                </div>

                {/* LIST VIEW */}
                <div
                    className={`   pb-10 xl:pb-[70px] transition-all duration-300 
          ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"} ${view === "list" ? "flex flex-col " : "hidden"
                        }`}
                    style={{
                        transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
                    }}
                >
                    {currentItems.map((item) => (
                        <ProjectCard key={item._id} item={item} variant="list" isArabic={isArabic} revealDelay={cardRevealDelay} />
                    ))}

                    {currentItems.length === 0 && (
                        <div className="text-center py-10 text-paragraph">No projects found for selected filters.</div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    disabled={isAnimating}
                    isArabic={isArabic}
                />
            </div>

            {view === "grid" && (
                <>
                    <div
                        className={`${currentItems.length === 0
                            ? "hidden"
                            : currentItems.length < 4
                                ? "top-[27%] 3xl:bottom-[-16%]"
                                : "top-[25%] lg:bottom-[30%] xl:bottom-[30%] 3xl:bottom-3/7"
                            } absolute 3xl:top-auto translate-y-[58px] z-[-1]
    ${isArabic ? "left-0 lg:right-[-140px] 3xl:right-0" : "right-0 lg:left-[-140px] 3xl:left-0"}`}
                    >
                        <MotionImage
                            width={1500}
                            height={1000}
                            style={{ y: shapeY }}
                            src="/assets/images/projects/pjtbdy1.svg"
                            alt=""
                            className={` ${isArabic ? "-scale-x-100" : ""
                                } w-[150px] sm:w-[270px] lg:w-[670px] object-contain`}
                        />
                    </div>

                    <div
                        className={`${currentItems.length === 0
                            ? "hidden"
                            : currentItems.length < 4
                                ? "bottom-[5%] hidden"
                                : "bottom-[5%] lg:bottom-0"
                            } absolute z-[-1]
    ${isArabic ? "left-0 lg:left-[-150px] 3xl:left-0 scale-x-[-1]" : "right-0 lg:right-[-150px] 3xl:right-0"}`}
                    >
                        <MotionImage
                            width={1500}
                            height={1000}
                            style={{ y: shapeY }}
                            src="/assets/images/projects/pjtbdy2.svg"
                            alt=""
                            className="w-[150px] sm:w-[270px] lg:w-[670px] object-contain"
                        />
                    </div>
                </>
            )}
        </section>
    );
};

export default ProjectLists;
