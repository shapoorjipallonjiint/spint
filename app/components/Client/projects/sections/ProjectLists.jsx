"use client";

import { Listbox } from "@headlessui/react";
// import { pjtList } from "../data";
import { useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { dropdownItemVariants, dropdownListVariants, moveUp, moveUpV2 } from "../../../motionVarients";
import LangLink from "@/lib/LangLink"
import { useRef } from "react";
import { statusData, UI_LABELS } from "@/app/components/AdminProject/statusData";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import Reveal from "@/app/components/common/Reveal";
import { useToNavigateCountryContext } from "@/contexts/toNavigateCountry";



const ITEMS_PER_PAGE = 12;

const ProjectLists = ({ sectorData, countryData, serviceData, data }) => {
    const tSectorData = useApplyLang(sectorData);
    const tCountryData = useApplyLang(countryData);
    const tServiceData = useApplyLang(serviceData);
    const tData = useApplyLang(data);
    const router = useRouter();
    const pathname = usePathname();
    const isArabic = useIsPreferredLanguageArabic();
    const searchParams = useSearchParams();
    const isInitialized = useRef(false);
    const MotionImage = motion.create(Image);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef(null);
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    const [view, setView] = useState("grid");

    useEffect(() => {
        const urlView = searchParams.get("view");

        if (urlView === "list") {
            setView("list");
        } else {
            setView("grid");
        }
    }, [searchParams]);
    // Project with Countries
    const projectCountries = useMemo(() => {
        if (!tData?.length) return new Set();

        return new Set(
            tData
                .map((item) => item?.secondSection?.location?.name)
                .filter(Boolean)
                .map((name) => name.toLowerCase()),
        );
    }, [tData]);

    const { ALL_OPTION } = UI_LABELS;

    const sector = [ALL_OPTION, ...tSectorData];

    const status = [
        ALL_OPTION,
        ...statusData
            .filter((item) => item.name && item.name.toLowerCase() !== "nill")
            .map((item, index) => ({
                id: index + 2,
                ...item,
            })),
    ];

    const filteredCountryData = useMemo(() => {
        return tCountryData.filter((c) => c.showInProjectFilter);
    }, [tCountryData]);

    const country = [ALL_OPTION, ...filteredCountryData];

    const service = [ALL_OPTION, ...tServiceData];

    // 🔹 Filter states
    const [selectedSector, setSelectedSector] = useState(sector[0]);
    const [selectedStatus, setSelectedStatus] = useState(status[0]);
    const [selectedCountry, setSelectedCountry] = useState(country[0]);
    const [selectedService, setSelectedService] = useState(service[0]);
    const { toNavigateCountry, setToNavigateCountry } = useToNavigateCountryContext();

    // 🔹 Filter items based on all dropdowns
    const filteredItems = useMemo(() => {
        let items = [...tData];
        console.log(items);
        if (selectedSector.id !== 1) {
            items = items.filter((item) =>
                item.secondSection?.sector?.some(
                    (sector) => sector.name.toLowerCase() === selectedSector?.name.toLowerCase(),
                ),
            );
        }

        if (selectedStatus.id !== 1) {
            // assuming your data has item.status
            items = items.filter((item) => item.secondSection?.status.toLowerCase() === selectedStatus?.name.toLowerCase());
        }

        if (selectedCountry.id !== 1) {
            items = items.filter(
                (item) => item.secondSection?.location?.name.toLowerCase() === selectedCountry?.name.toLowerCase(),
            );
        }

        if (selectedService.id !== 1) {
            // assuming your data has item.service
            items = items.filter((item) =>
                item.secondSection?.service?.some(
                    (service) => service.title.toLowerCase() === selectedService?.title.toLowerCase(),
                ),
            );
        }

        return items;
    }, [selectedSector, selectedStatus, selectedCountry, selectedService]);

    // 🔹 Total pages based on filtered data
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    }, [filteredItems.length]);

    // 🔹 Current page items from filtered list
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, endIndex);
    }, [currentPage, filteredItems]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || isAnimating) return;

        setIsAnimating(true);
        setCurrentPage(newPage);

        const section = document.querySelector("section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const handlePrev = () => {
        handlePageChange(currentPage - 1);
    };

    const handleNext = () => {
        handlePageChange(currentPage + 1);
    };

    // 🔹 Filter change handlers (reset page to 1)
    const handleSectorChange = (opt) => {
        setSelectedSector(opt);
        setCurrentPage(1);
    };

    const handleStatusChange = (opt) => {
        setSelectedStatus(opt);
        setCurrentPage(1);
    };
    const handleCountryChange = (opt) => {
        // update filter immediately
        setSelectedCountry(opt);
        setCurrentPage(1);

        // update URL (no state reading from it)
        // if (opt.name === "All") {
        //     router.push(pathname);
        // } else {
        //     router.push(`${pathname}?country=${encodeURIComponent(opt.name)}`);
        // }
    };

    const handleServiceChange = (opt) => {
        setSelectedService(opt);
        setCurrentPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSelectedSector(sector[0]);
        setSelectedStatus(status[0]);
        setSelectedCountry(country[0]);
        setSelectedService(service[0]);
        setCurrentPage(1);
    };


    useEffect(() => {


        // 🔴 Case 1: User did NOT come from home → remove query
        if (toNavigateCountry) {
            // 🟢 Case 2: User came from home → apply filter
            if (isInitialized.current) return;


            const matchedCountry = country.find(
                (c) => c.name.toLowerCase() === toNavigateCountry.toLowerCase()
            );

            if (matchedCountry) {
                setSelectedCountry(matchedCountry);
                setCurrentPage(1);
            }

            isInitialized.current = true;

            // ✅ Important: delay resetting flag
            setToNavigateCountry("");
        } else {
            if (toNavigateCountry) {
                router.replace(pathname);
            }
            return;
        }

    }, [country, searchParams, toNavigateCountry]);





    const handleView = () => {
        const params = new URLSearchParams(searchParams);
        params.set("view", "list");
        router.push(`${pathname}?${params.toString()}`);
        setView("list");
    };
    const handleGrid = () => {
        const params = new URLSearchParams(searchParams);
        params.set("view", "grid");
        router.push(`${pathname}?${params.toString()}`);
        setView("grid");
    };
    const [showFilters, setShowFilters] = useState(false);

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="container">
                <motion.div
                    variants={moveUp(0.5)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="border-y border-cmnbdr my-5 md:mt-10 xl:mt-25 md:mb-8 xl:mb-15 py-4 md:py-6 xl:py-[35px]"
                >
                    <div className="flex flex-col lg:flex-row justify-between  lg:gap-4 lg:gap-0">
                        <div className="md:hidden mb-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-between w-full border border-white/20 text-paragraph text-[14px] uppercase"
                            >
                                <span>Filter</span>
                                <span>{showFilters ? "−" : "+"}</span>
                            </button>
                        </div>
                        <div className={` ${showFilters ? "block" : "hidden"} md:block mb-3`}>
                            <div className="flex flex-col md:flex-row gap-5 md:items-center lg:gap-12  2xl:gap-25  3xl:gap-[174px] justify-between">
                                <div className="flex flex-col md:flex-row gap-3 lg:gap-10 2xl:gap-[90px] w-full ">
                                    {/* Sector */}
                                    <div className="w-full lg:w-fit relative">
                                        <Listbox value={selectedSector} onChange={handleSectorChange}>
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[16px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase">
                                                    {/* {selectedSector?.name === "All" ? "Sector" : selectedSector?.name} */}
                                                    {selectedSector?.name === "All"
                                                        ? isArabic
                                                            ? UI_LABELS.SECTOR.ar
                                                            : UI_LABELS.SECTOR.en
                                                        : isArabic
                                                            ? selectedSector?.name_ar ?? selectedSector?.name
                                                            : selectedSector?.name}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
                                                    className="w-[14px] h-[7px]"
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
                                                className="
    absolute
    w-full md:w-[290px]
    h-[290px]
    overflow-y-auto
    overscroll-contain
    bg-white
    rounded-sm
    shadow-sm
    z-[50]
  "
                                            >
                                                {sector.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.id}
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
                                                        <span
                                                            className="
          transition-transform duration-300
          group-hover:scale-[1.03]
        "
                                                        >
                                                            {isArabic ? opt?.name_ar ?? opt?.name : opt?.name}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Status */}
                                    <div className="w-full lg:w-fit relative">
                                        <Listbox value={selectedStatus} onChange={handleStatusChange}>
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[16px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase">
                                                    {/* {selectedStatus?.name === "All" ? "Status" : selectedStatus?.name} */}
                                                    {selectedStatus?.name === "All"
                                                        ? isArabic
                                                            ? UI_LABELS.STATUS.ar
                                                            : UI_LABELS.STATUS.en
                                                        : isArabic
                                                            ? selectedStatus?.name_ar
                                                            : selectedStatus?.name}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
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
                                                {status.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.id}
                                                        value={opt}
                                                        as={motion.div}
                                                        variants={dropdownItemVariants}
                                                        className="
        py-1 px-4
        cursor-pointer group
        hover:bg-[#f0f0f0]
        hover:font-bold
        w-full transition-colors duration-300
      "
                                                    >
                                                        <span className="group-hover:scale-[1.03] transition-transform duration-300">
                                                            {/* {opt?.name} */}
                                                            {isArabic ? opt?.name_ar ?? opt?.name : opt?.name}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Country */}
                                    <div className="w-full lg:w-fit relative">
                                        <Listbox value={selectedCountry} onChange={handleCountryChange}>
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[16px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase">
                                                    {/* {selectedCountry?.name === "All" ? "Country" : selectedCountry?.name} */}
                                                    {selectedCountry?.name === "All"
                                                        ? isArabic
                                                            ? UI_LABELS.COUNTRY.ar
                                                            : UI_LABELS.COUNTRY.en
                                                        : isArabic
                                                            ? selectedCountry?.name_ar ?? selectedCountry?.name
                                                            : selectedCountry?.name}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
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
                                                {country.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.id}
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
                                                            {isArabic ? opt?.name_ar ?? opt?.name : opt?.name}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>

                                    {/* Service */}
                                    <div className="w-full lg:w-fit relative">
                                        <Listbox value={selectedService} onChange={handleServiceChange}>
                                            <Listbox.Button className="relative w-full cursor-pointer text-left flex items-center gap-[16px] outline-0 border-0 justify-between md:justify-start">
                                                <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase">
                                                    {/* {selectedService?.title === "All" ? "Service" : selectedService?.title} */}
                                                    {selectedService?.title === "All"
                                                        ? isArabic
                                                            ? UI_LABELS.SERVICE.ar
                                                            : UI_LABELS.SERVICE.en
                                                        : isArabic
                                                            ? selectedService?.title_ar ?? selectedService?.title
                                                            : selectedService?.title}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="7"
                                                    viewBox="0 0 16 9"
                                                    fill="none"
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
                                                {service.map((opt) => (
                                                    <Listbox.Option
                                                        key={opt.id}
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
                                                            {opt?.title}
                                                        </span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Listbox>
                                    </div>
                                </div>

                                {/* Clear Filter */}
                                <div className="">
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
                            </div>
                        </div>
                        {/* View toggles */}
                        <div className="flex items-center gap-6 lg:gap-5 2xl:gap-[30px] justify-end">
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
                                <p className="uppercase text-[12px] md:text-[14px] lg:text-16 text-paragraph font-light ">
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
                                <p className="uppercase text-[12px] md:text-[14px] lg:text-16 text-paragraph font-light ">
                                    {isArabic ? UI_LABELS.LIST_VIEW.ar : UI_LABELS.LIST_VIEW.en}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* GRID VIEW */}
                <div
                    className={`gap-5 3xl:gap-x-[30px]  gap-y-10 md:gap-y-12 xl:gap-y-[80px] pb-10 xl:pb-[80px] transition-all duration-300 
          ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"} ${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" : "hidden"
                        }`}
                    style={{
                        transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
                    }}
                >
                    {currentItems.map((item, index) => (

                        <Reveal key={index} variants={moveUpV2} className="group">


                            <LangLink href={`/projects/${item.slug}`}>
                                <div className="relative">
                                    {item?.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.thumbnailAlt || item.firstSection.title}
                                            width={520}
                                            height={395}
                                            className="w-full h-[200px] md:h-[250px] xl:h-[395px] object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="
      w-full
      h-[200px] md:h-[250px] xl:h-[395px]
      bg-primary opacity-90
      flex items-center justify-center
    "
                                        >
                                            <span className="text-white text-29 font-medium">395×250</span>
                                        </div>
                                    )}

                                    <div
                                        className={` ${isArabic ? "-scale-x-100 right-0" : "left-0"
                                            } opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 w-[50px] h-[50px]  xl:w-[80px] xl:h-[80px] flex items-center justify-center bg-primary`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="-translate-x-2 group-hover:translate-x-0 translate-y-2 group-hover:translate-y-0 transition-all duration-500 w-[25px] h-[25px] lg:w-[25px] lg:h-[25px]"
                                            width="35"
                                            height="35"
                                            viewBox="0 0 35 35"
                                            fill="none"
                                        >
                                            <path
                                                d="M1.25 1.25H33.2484V33.2411"
                                                stroke="#30B6F9"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M33.2498 1.25L1.4043 33.2411"
                                                stroke="#30B6F9"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-[20px] lg:text-24 2xl:text-29 truncate leading-[1.344827586206897] font-light py-4 md:py-6 xl:max-w-[90%]">
                                        {item.firstSection.title}
                                    </h2>
                                </div>
                                <div className="flex justify-between border-t border-t-black/20 border-b border-b-black/20">
                                    <p className="text-paragraph text-19 font-light leading-[2.44] max-w-[18ch] truncate">
                                        {isArabic ? UI_LABELS.SECTOR.ar : UI_LABELS.SECTOR.en}: {item?.secondSection?.sector?.map((item, i) => (<span key={i}>{item.name}</span>))}
                                    </p>
                                    {(() => {
                                        const buaItem = item?.secondSection?.items?.find((i) => i?.key?.includes("BUA"));

                                        const label = buaItem?.key ?? "BUA";
                                        const value = buaItem?.value ?? "";

                                        if (buaItem?.value == "" || buaItem?.value == null) {
                                            return null;
                                        } else {
                                            return (
                                                <p className="text-paragraph text-19 font-light leading-[2.44] pe-1 3xl:xl:pe-6 max-w-[18ch] truncate">
                                                    {label}: {value}
                                                </p>
                                            );
                                        }
                                    })()}
                                </div>
                                <div className="border-b border-b-black/20">
                                    <p className="text-paragraph text-19 font-light leading-[2.44]">
                                        {isArabic ? UI_LABELS.ProjectCardDetails.Location.ar : UI_LABELS.ProjectCardDetails.Location.en}:{" "}
                                        {item?.secondSection?.items?.find((i) => i.key === "Location")?.value ??
                                            item?.secondSection?.location?.name ??
                                            ""}
                                    </p>
                                </div>
                            </LangLink>
                        </Reveal>
                    ))}

                    {currentItems.length === 0 && (
                        <div className="col-span-full text-center py-10 text-paragraph">
                            No projects found for selected filters.
                        </div>
                    )}
                </div>

                {/* LIST VIEW */}
                <div
                    className={`   pb-10 xl:pb-[80px] transition-all duration-300 
          ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"} ${view === "list" ? "flex flex-col " : "hidden"
                        }`}
                    style={{
                        transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                        transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
                    }}
                >
                    {currentItems.map((item, index) => (
                        <Reveal key={index} variants={moveUpV2} className="border-b border-black/20 pb-[30px] mb-[30px] group">
                            <LangLink href={`/projects/${item.slug}`}>
                                <div className="flex flex-col lg:grid grid-cols-[240px_244px_448px_0px] xl:grid-cols-[240px_244px_448px_32px] 2xl:grid-cols-[274px_324px_458px_32px] 3xl:grid-cols-[274px_384px_658px_32px] justify-between gap-3 md:gap-8 lg:gap-4 3xl:gap-[69px] ">
                                    <div className="w-full xl:w-full">
                                        {item?.thumbnail ? (
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.thumbnailAlt || item.firstSection.title}
                                                width={274}
                                                height={208}
                                                className="w-full h-[250px] md:h-[350px] lg:h-[208px] xl:min-w-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-[250px] md:h-[350px] lg:h-[208px] xl:min-w-full bg-primary flex items-center justify-center">
                                                <span className="text-white text-19 font-medium">Image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div>
                                            <h3 className="text20 text-29 leading-[1.344827586206897] font-light  ">
                                                {item.firstSection.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bg-f5f5 p-5 xl:py-[18px] xl:px-[30px]">
                                            <div className="flex gap-5 3xl:gap-[168px] justify-between border-b border-b-black/20 pb-[11px] mb-[7px] ">
                                                <p className="text-paragraph text-19 font-light  leading-[1.4] md:leading-[2] ">
                                                    {isArabic ? UI_LABELS.SECTOR.ar : UI_LABELS.SECTOR.en}: <br className="hidden lg:block 2xl:hidden"></br>
                                                    {item?.secondSection?.sector?.name}
                                                </p>
                                                <p className="text-paragraph text-19 font-light leading-[1.4] md:leading-[2] xl:pe-6">
                                                    BUA (Sq.ft): <br className="hidden lg:block 2xl:hidden" />
                                                    {item?.secondSection?.items?.find((i) => i?.key?.includes("BUA"))
                                                        ?.value ?? ""}
                                                </p>
                                            </div>
                                            <div className="">
                                                <p className="text-paragraph text-19 font-light leading-[2]">
                                                    {isArabic ? UI_LABELS.ProjectCardDetails.Location.ar : UI_LABELS.ProjectCardDetails.Location.en}: {item.secondSection?.location?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={` ${isArabic ? "-scale-x-100" : ""
                                            } opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 35 35"
                                            fill="none"
                                        >
                                            <path
                                                d="M1.25 1.25H33.2484V33.2411"
                                                stroke="#30B6F9"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M33.2498 1.25L1.4043 33.2411"
                                                stroke="#30B6F9"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </LangLink>
                        </Reveal>
                    ))}

                    {currentItems.length === 0 && (
                        <div className="text-center py-10 text-paragraph">No projects found for selected filters.</div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 w-full pb-10 xl:pb-15 2xl:pb-[120px]">
                    <div className="pagination flex items-center gap-5 justify-center ">
                        <button
                            className={`prev cursor-pointer transition-all duration-200 hover:scale-110 ${isArabic ? "rotate-180" : ""
                                }  disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === 1 || isAnimating ? "opacity-30" : "opacity-100"
                                }`}
                            onClick={handlePrev}
                            disabled={currentPage === 1 || isAnimating}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.7549 1.25L1.25 9.7549M1.25 9.7549L9.75297 18.2579M1.25 9.7549L18.2169 9.79374"
                                    stroke="#30B6F9"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <p>
                            <span className="current-page font-bold text-16 leading-[2.4375]">
                                {String(currentPage).padStart(2, "0")}
                            </span>
                            {" / "}
                            <span className="total-pages">{String(totalPages).padStart(2, "0")}</span>
                        </p>

                        <button
                            className={`next cursor-pointer transition-all duration-200 hover:scale-110 ${isArabic ? "rotate-180" : ""
                                } disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === totalPages || isAnimating ? "opacity-30" : "opacity-100"
                                }`}
                            onClick={handleNext}
                            disabled={currentPage === totalPages || isAnimating}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9.71189 1.25L18.2168 9.7549M18.2168 9.7549L9.71383 18.2579M18.2168 9.7549L1.24994 9.79374"
                                    stroke="#30B6F9"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
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
