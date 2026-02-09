"use client";

// import { pressReleases } from "../data";
import { moveUp } from "../../../motionVarients";
import { useRef } from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const Gallery = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);

    const ITEMS_PER_PAGE = 12;
    const ALL_CATEGORY = useMemo(
        () => (isArabic ? "الكل" : "All"),
        [isArabic]
    );

    const normalizedItems = useMemo(() => {
        if (!t?.gallery) return [];

        return t.gallery.flatMap((section) =>
            section.categories.flatMap((category) => {
                if (!category.images?.length) return [];

                return {
                    title: category.title,
                    category: section.title,
                    image: category.images[0],
                    lmglist: category.images.slice(1),
                };
            })
        );
    }, [t]);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef(null);
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        if (selectedCategory === ALL_CATEGORY) return normalizedItems;
        return normalizedItems.filter(item => item.category === selectedCategory);
    }, [selectedCategory, normalizedItems, ALL_CATEGORY]);


    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    // Get current items for the page
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredItems.slice(startIndex, endIndex);
    }, [currentPage, filteredItems]);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        if (category === selectedCategory || isAnimating) return;

        setIsAnimating(true);
        setSelectedCategory(category);

        // Scroll to top of section smoothly
        const section = document.querySelector("section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || isAnimating) return;

        setIsAnimating(true);
        setCurrentPage(newPage);

        // Scroll to top of section smoothly
        const section = document.querySelector("section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Reset animation state
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    const handlePrev = () => {
        handlePageChange(currentPage - 1);   
        setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 200);
    };

    const handleNext = () => {
        handlePageChange(currentPage + 1); 
         setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 200);
         
    };
    
   
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState([]); // array of image urls for modal
    const [index, setIndex] = useState(0); // current slide index

    // Open modal for an item: main image first, then lmglist
    const openModal = useCallback((item, startIdx = 0) => {
        const imgs = [item.image, ...(item.lmglist || [])];
        setImages(imgs);
        setIndex(startIdx);
        setIsOpen(true);
        // stop body scroll
        document.body.style.overflow = "hidden";
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setImages([]);
        setIndex(0);
        document.body.style.overflow = "";
    }, []);

    // Prev / Next with wrap-around
    const prev = useCallback(() => {
        setIndex((i) => (i - 1 + images.length) % images.length);
    }, [images.length]);

    const next = useCallback(() => {
        setIndex((i) => (i + 1) % images.length);
    }, [images.length]);

    // keyboard support
    useEffect(() => {
        if (!isOpen) return;
        function onKey(e) {
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, closeModal, next, prev]);

    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const SWIPE_THRESHOLD = 50; // px
    const SWIPE_VERTICAL_LIMIT = 80; // ignore mostly vertical scroll

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null || touchStartY.current === null) return;

        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartX.current;
        const dy = touch.clientY - touchStartY.current;

        // ignore mostly vertical swipes
        if (Math.abs(dy) > SWIPE_VERTICAL_LIMIT) {
            touchStartX.current = null;
            touchStartY.current = null;
            return;
        }

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
            if (dx < 0) {
                // swipe left -> next image
                next();
            } else {
                // swipe right -> previous image
                prev();
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    return (
        <>
            <section className="relative pt-12 xl:pt-15 3xl:pt-30" ref={sectionRef}>
                <div
                    className={`absolute top-[61px] lg:top-0 z-0
    ${isArabic
                            ? "left-0 sm:left-[-25px] 2xl:left-[-50px] -scale-x-100"
                            : "right-0 sm:right-[-25px] 2xl:right-[-50px]"
                        }
  `}
                >
                    <Image
                        height={1000}
                        width={1920}
                        style={{ y: shapeY }}
                        src="/assets/images/project-details/bannerbg.svg"
                        alt=""
                        className="w-[150px] h-[376px] sm:w-[477px] sm:h-[476px] lg:w-[577px] lg:h-[576px] object-fit"
                    />
                </div>

                <div className="container">
                    <div className="mb-7 md:mb-10 xl:mb-12 3xl:mb-20 ">
                        <h1 className="text-70 font-light leading-[1.071428571428571]">
                            <SplitTextAnimation
                                children={t.pageTitle}
                                staggerDelay={0.2}
                                animationDuration={0.8}
                                delay={0.2}
                            />
                        </h1>
                    </div>

                    <motion.div
                        variants={moveUp(0.8)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between border-y border-cmnbdr pt-[15px] md:pt-[25px] xl:pt-[35px] mb-10 lg:mb-15 3xl:mb-25"
                    >
                        <div className="flex flex-wrap justify-between xl:justify-start gap-3 md:gap-15 xl:gap-[75px] mb-4 md:mb-0">
                            {[ALL_CATEGORY, ...(t?.gallery?.map((g) => g.title) || [])].map((cat) => (
                                <div
                                    key={cat}
                                    className={`relative pb-0 md:pb-35px transition-all duration-300 group cursor-pointer ${selectedCategory === cat ? "text-black" : ""
                                        }`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    <span
                                        className={`text-16 font-semibold leading-[1.75] uppercase group-hover:text-black ${selectedCategory === cat ? "text-black" : "text-paragraph"
                                            }`}
                                    >
                                        {cat}
                                    </span>

                                    <div
                                        className={`absolute bottom-[-2px] left-0 w-full h-1 bg-secondary transition-all duration-300 ${selectedCategory === cat ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            }`}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div
                        className={`relative grid xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-10 xl:gap-y-15 2xl:gap-y-18 3xl:gap-y-20 mb-10 xl:mb-12 2xl:mb-18 3xl:mb-[100.32px] transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                            }`}
                        style={{
                            transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                            transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
                        }}
                    >
                        {currentItems.length === 0 ? (
                            <div className="col-span-full flex justify-center items-center py-10">
                                <p className="text-paragraph text-18 font-light">No items found.</p>
                            </div>
                        ) : (
                            currentItems.map((item, idx) => (
                                <motion.div
                                    variants={moveUp(0.9 + 0.1 * idx)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    key={`${selectedCategory}-${item.title}-${idx}`}
                                    className="border-b border-black/20 pb-5 lg:border-b-0 lg:pb-0 cursor-pointer"
                                    onClick={() => openModal(item, 0)}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={520}
                                        height={339}
                                        className="w-full h-[200px] xl:h-[339px] 2xl:h-[422px] object-cover"
                                    />
                                    <div className="pt-7">
                                        <h4 className="text-paragraph text-sm 2xl:text-16 font-light leading-[1.75] uppercase 2xl:pb-3">
                                            {item.category}
                                        </h4>
                                        <h3 className="text-16 2xl:text-29 noLetterSpacing leading-[1.344827586206897] font-light xl:max-w-[90%]">
                                            {item.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                    <AnimatePresence>
                        {isOpen && images.length > 0 && (
                            <motion.div
                                key="modal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6"
                                aria-modal="true"
                                role="dialog"
                                onClick={closeModal} // close when clicking backdrop
                            >
                                {/* backdrop */}
                                <div className="absolute inset-0 bg-black/75" />

                                {/* dialog */}
                                <motion.div
                                    initial={{ scale: 0.98, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.98, opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="relative z-10 max-w-[1100px]  3xl:max-w-[1436px]  w-full md:w-[79%] xl:w-full mx-auto bg-transparent"
                                    onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking content
                                >
                                    {/* top bar: close */}

                                    {/* main image area */}
                                    <div className="relative   rounded-md  ">
                                        <button
                                            onClick={prev}
                                            aria-label="Previous image"
                                            className="w-12 h-12 flex items-center justify-center absolute -left-20 top-1/2 -translate-y-1/2 z-20 p-2 border border-white cursor-pointer transition-all duration-300 hover:bg-black/40 rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <g clipPath="url(#clip0_3796_3103)">
                                                    <path
                                                        d="M9.82093 18.325L1.31602 9.82006L9.81899 1.31709"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M1.31759 9.82016L18.2848 9.78147"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3796_3103">
                                                        <rect
                                                            width="13.8889"
                                                            height="13.8889"
                                                            fill="white"
                                                            transform="translate(9.82093 19.6419) rotate(-135)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>

                                        <button
                                            onClick={next}
                                            aria-label="Next image"
                                            className="w-12 h-12 flex items-center justify-center absolute -right-20 top-1/2 z-20 p-2 border border-white cursor-pointer transition-all duration-300 hover:bg-black/40 rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                className="rotate-180"
                                            >
                                                <g clipPath="url(#clip0_3796_3103)">
                                                    <path
                                                        d="M9.82093 18.325L1.31602 9.82006L9.81899 1.31709"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M1.31759 9.82016L18.2848 9.78147"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3796_3103">
                                                        <rect
                                                            width="13.8889"
                                                            height="13.8889"
                                                            fill="white"
                                                            transform="translate(9.82093 19.6419) rotate(-135)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>

                                        {/* animate image change */}
                                        <div
                                            className="w-full  h-full  flex items-center justify-center"
                                            onTouchStart={handleTouchStart}
                                            onTouchEnd={handleTouchEnd}
                                        >
                                            <MotionImage
                                                height={1000}
                                                width={1920}
                                                key={images[index]} // important so framer animates on src change
                                                src={images[index]}
                                                alt={`Gallery image ${index + 1}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.25 }}
                                                className="max-h-[60vh] sm:max-h-[80vh] 3xl:max-h-[83.44dvh] object-cover w-full "
                                            />
                                        </div>

                                        {/* caption / count */}
                                        <div className="w-fit mx-auto text-white z-20 mt-[17px]">
                                            <div>
                                                <span className="text-16 font-bold">{index + 1}</span> /{" "}
                                                <span className="text-16 font-light">{images.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* thumbnails */}
                                    {/* <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`flex-shrink-0 rounded overflow-hidden border ${i === index ? "ring-2 ring-offset-2 ring-white" : "border-transparent"}`}
                    aria-label={`Go to image ${i + 1}`}
                  >
                    <img src={src} className="w-20 h-12 object-cover" alt={`thumb-${i}`} />
                  </button>
                ))}
              </div> */}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pagination flex items-center gap-2 2xl:gap-5 justify-center mb-10 xl:mb-15 3xl:mb-[131.68px]">
                    <button
                        className={` ${isArabic ? "rotate-180" : ""} prev cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === 1 || isAnimating ? "opacity-30" : "opacity-100"
                            }`}
                        onClick={handlePrev}
                        disabled={currentPage === 1 || isAnimating}
                    >
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <span className="current-page font-bold text-16 leading-[2.4375] text-paragraph">
                            {String(currentPage).padStart(2, "0")}
                        </span>
                        {" / "}
                        <span className="total-pages font-light text-16 leading-[2.4375] text-paragraph">{String(totalPages).padStart(2, "0")}</span>
                    </p>

                    <button
                        className={` ${isArabic ? "rotate-180" : ""} next cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === totalPages || isAnimating ? "opacity-30" : "opacity-100"
                            }`}
                        onClick={handleNext}
                        disabled={currentPage === totalPages || isAnimating}
                    >
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </section>
        </>
    );
};

export default Gallery;
