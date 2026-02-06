"use client";

import { useMediaQuery } from "react-responsive";
import { useRef, useState } from "react";
import { assets } from "../../../../assets/index";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import H2Title from "../../../common/H2Title";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const ExpertiseSec = (data) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const expertiseData = t.data;

    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const sectionRef = useRef(null);
    const imageContainerRef = useRef(null);

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    // Parallax for shape
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);

    // Helper to set ref for each item
    const setItemRef = (el, i) => {
        itemRefs.current[i] = el;
    };

    // Determine index at (x,y) — returns -1 if none
    const getIndexAtPoint = (x, y) => {
        for (let i = 0; i < itemRefs.current.length; i++) {
            const el = itemRefs.current[i];
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return i;
            }
        }
        return -1;
    };

    // touch move handler
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const idx = getIndexAtPoint(touch.clientX, touch.clientY);
        if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        const idx = getIndexAtPoint(touch.clientX, touch.clientY);
        if (idx !== -1) setActiveIndex(idx);
    };

    const handleMouseMove = (e) => {
        const idx = getIndexAtPoint(e.clientX, e.clientY);
        if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
    };

    const handleLeave = () => {
        setActiveIndex(activeIndex);
    };

    // The main image is at the root level, not inside items
    const activeImage = expertiseData?.image;
    const currentItem = expertiseData?.items?.[activeIndex] || expertiseData?.items?.[0];
    const activeIcon = currentItem?.icon;
    const activeIconAlt = currentItem?.iconAlt || currentItem?.title || "";
    const activeTitle = currentItem?.title || "";
    const activeDescription = currentItem?.description || "";

    return (
        <section className="relative pt-text90 pb25 bg-f5f5 overflow-hidden" ref={sectionRef}>
            <div
                className={`absolute bottom-0 lg:bottom-[-150px] 3xl:bottom-0
    w-[200px] md:w-[300px] lg:w-[400px] 3xl:w-[522px]
    h-[281px] md:h-[431px] lg:h-[731px]
    ${isArabic ? "left-0 -scale-x-100" : "right-0"}
  `}
            >
                <MotionImage style={{ y: shapeY }} src={assets.mainShape} alt="" width={522} height={731} />
            </div>

            <div className="container">
                <H2Title
                    titleText={expertiseData.title}
                    titleColor="black"
                    marginClass="mb-4 xl:mb-50px"
                    maxW="max-w-[11ch]"
                />

                <div className="relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[55%_1fr] 2xl:grid-cols-[55%_1fr] 3xl:grid-cols-[961px_1fr] gap-4 md:gap-8 lg:gap-8 xl:gap-[70px]">
                        <motion.div
                            className="h-full relative overflow-hidden"
                            ref={imageContainerRef}
                            style={{ y: imageY }}
                        >
                            {activeImage && (
                                <Image
                                    src={activeImage}
                                    alt={expertiseData?.imageAlt || ""}
                                    width={961}
                                    height={600}
                                    className="h-[200px] scale-110 md:h-full xl:h-[598px] w-full object-cover"
                                />
                            )}
                        </motion.div>

                        <div>
                            <div className="flex flex-col gap-8 lg:gap-25 justify-between 3xl:mt-12">
                                <div
                                    onTouchMove={handleTouchMove}
                                    onTouchStart={handleTouchStart}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleLeave}
                                >
                                    {expertiseData.items.map((item, index) => (
                                        <div
                                            key={index}
                                            ref={(el) => setItemRef(el, index)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className="flex items-center gap-2 group w-fit"
                                        >
                                            <p
                                                className={`text-19 leading-[1.75] cursor-pointer transition-all duration-300 ${
                                                    activeIndex === index
                                                        ? "font-bold text-black"
                                                        : "font-light group-hover:font-bold text-paragraph"
                                                }`}
                                            >
                                                {item.title}
                                            </p>

                                            <div
                                                className={`transition-all duration-300 opacity-0 ${
                                                    isArabic ? "-scale-x-100" : ""
                                                } ${
                                                    activeIndex === index
                                                        ? "rotate-0 opacity-100"
                                                        : isArabic
                                                        ? "group-hover:opacity-100 -rotate-45"
                                                        : "group-hover:opacity-100 rotate-45"
                                                }`}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path
                                                        d="M1.25 1.25H14.2433V14.2404"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                    />
                                                    <path
                                                        d="M14.2438 1.25L1.3125 14.2404"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
                                        <motion.div
                                            variants={moveUp(0.2)}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ amount: 0.2, once: true }}
                                            className="w-[50px] h-[50px] lg:w-[66px] lg:h-[66px] bg-secondary/30 rounded-full flex items-center justify-center"
                                        >
                                            {activeIcon && (
                                                <Image
                                                    src={activeIcon}
                                                    alt={activeIconAlt}
                                                    width={29}
                                                    height={42}
                                                    className="w-8 h-8 lg:w-7.25 lg:h-10.5"
                                                />
                                            )}
                                        </motion.div>

                                        <motion.h3
                                            variants={moveUp(0.4)}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ amount: 0.2, once: true }}
                                            className="text-29 leading-[1.724] text-black font-light"
                                        >
                                            {activeTitle}
                                        </motion.h3>
                                    </div>

                                    {activeDescription && (
                                        <div className="mt-2 lg:mt-4 xl:mt-5 border-t border-black/20 pt-4 xl:pt-[28px]">
                                            <motion.p
                                                variants={moveUp(0.6)}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ amount: 0.2, once: true }}
                                                className="text-19 leading-[1.526] text-paragraph font-light max-w-lg"
                                            >
                                                {activeDescription}
                                            </motion.p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSec;
