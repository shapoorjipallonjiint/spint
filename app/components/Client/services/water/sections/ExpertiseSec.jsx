"use client";

import { useMediaQuery } from "react-responsive";
import { useRef, useState } from "react";
import { assets } from "@/app/assets/index";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import H2Title from "@/app/components/common/H2Title";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const ExpertiseSec = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const MotionImage = motion.create(Image);
    const prevIndexRef = useRef(activeIndex);

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

    const activeImage = t?.items?.[activeIndex]?.image ?? t?.items?.[0]?.image;
    const activelist = t?.items?.[activeIndex]?.description ?? t?.items?.[0]?.description;
    const activeItem = t?.items?.[activeIndex];

    const normalizeHtml = (html = "") => html.replace(/&nbsp;/g, " ");

    return (
        <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div
                className={`absolute bottom-[-358px] lg:bottom-[-150px] 3xl:bottom-0 w-[200px] lg:w-[400px] 3xl:w-[573px] h-[803px]
    ${isArabic ? "left-0 -scale-x-100" : "right-0"}`}
            >
                <MotionImage width={1500} height={1000} style={{ y: shapeY }} src={assets.mainShape} alt="" />
            </div>

            <div className="container">
                {/* Header */}
                <H2Title titleText={t.title} titleColor="white" marginClass="mb-4 xl:mb-50px" />

                {/* Swiper Slider */}
                <div className="relative overflow-hidden">
                    <div
                        className={`grid grid-cols-1
    md:grid-cols-[50%_1fr]
    2xl:grid-cols-[55%_1fr]
    3xl:grid-cols-[961px_1fr]
    ${
        isArabic
            ? "md:[grid-template-columns:1fr_50%] 2xl:[grid-template-columns:1fr_55%] 3xl:[grid-template-columns:1fr_961px]"
            : ""
    }
    gap-4 lg:gap-8 xl:gap-[70px]`}
                    >
                        <div className="h-full relative overflow-hidden" ref={imageContainerRef}>
                            {/* HEIGHT HOLDER (keeps layout same) */}
                            <div className="h-[200px] md:h-full w-full" />

                            {/* BASE IMAGE (previous) */}
                            <MotionImage
                                width={1500}
                                height={1000}
                                style={{ y: imageY }}
                                src={t.items[prevIndexRef.current]?.image}
                                alt=""
                                className="absolute inset-0 h-[200px] scale-y-110 md:h-full w-full object-cover"
                            />

                            {/* ACTIVE IMAGE (fade in) */}
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                onAnimationComplete={() => {
                                    prevIndexRef.current = activeIndex;
                                }}
                                className="absolute inset-0"
                            >
                                <MotionImage
                                    width={1500}
                                    height={1000}
                                    style={{ y: imageY }}
                                    src={activeImage}
                                    alt=""
                                    className="h-[200px] scale-y-110 md:h-full w-full object-cover"
                                />
                            </motion.div>
                        </div>

                        <div>
                            <div className="flex flex-col gap-8 lg:gap-[80px] justify-between 3xl:mt-12">
                                <div
                                    // attach pointer handlers here so child items don't each need them
                                    onTouchMove={handleTouchMove}
                                    onTouchStart={handleTouchStart}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleLeave}
                                >
                                    {t.items.map((item, index) => (
                                        <motion.div
                                            variants={moveUp(0.4 + 0.1 * index)}
                                            initial="hidden"
                                            whileInView={"show"}
                                            viewport={{ amount: 0.2, once: true }}
                                            className="flex items-center gap-2 group w-fit"
                                            key={index}
                                            ref={(el) => setItemRef(el, index)}
                                            // keep these optional — they help for quick taps on non-touch devices
                                            onMouseEnter={() => setActiveIndex(index)}
                                        >
                                            <p
                                                className={`text-19  text-white leading-[1.75] cursor-pointer transition-all duration-300 ${
                                                    activeIndex === index ? "font-bold" : "font-light group-hover:font-bold"
                                                }`}
                                            >
                                                {item.title}
                                            </p>

                                            <div
                                                className={`transition-all duration-300 opacity-0 ${
                                                    activeIndex === index
                                                        ? "rotate-0 opacity-100"
                                                        : "group-hover:opacity-100 rotate-45 "
                                                }`}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M1.25 1.25H14.2433V14.2404"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M14.2438 1.25L1.3125 14.2404"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div>
                                    {/* Image area: shows image for active index */}
                                    <motion.div
                                        variants={moveUp(0.8)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.2, once: true }}
                                        className="w-[66px] h-[66px] bg-secondary rounded-full flex items-center justify-center"
                                    >
                                        <motion.div
                                            variants={moveUp(0.8)}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ amount: 0.2, once: true }}
                                            className="w-[66px] h-[66px] bg-secondary rounded-full flex items-center justify-center"
                                        >
                                            {activeItem?.logo && (
                                                <Image
                                                    src={activeItem.logo}
                                                    alt={activeItem.logoAlt || ""}
                                                    width={32}
                                                    height={42}
                                                    className="w-[29px] h-[42px] object-contain"
                                                />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                    <hr className="border-0 border-t border-white/20 my-6" />
                                    <div className="water-our-expertise text-19 font-light">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: normalizeHtml(activelist),
                                            }}
                                        />
                                    </div>
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
