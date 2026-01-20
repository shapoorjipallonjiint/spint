"use client";
import { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import H2Title from "@/app/components/common/H2Title";
import { assets } from "@/app/assets";
import { moveUp, moveLeft } from "@/app/components/motionVarients";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const InnovationSustainability = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const [activeIndex, setActiveIndex] = useState(1);
    const imageRef = (useRef < HTMLDivElement) | (null > null);
    const MotionImage = motion.create(Image);
    const prevIndexRef = useRef(activeIndex);

    const sectionRef = useRef(null);
    const imageContainerRef = useRef(null);
    // Define movement amounts based on device
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];

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

    const handleAccordionClick = (index) => {
        setActiveIndex(activeIndex === index ? index : index);
    };

    const getSpacing = (index) => {
        if (activeIndex === index) return "73px";
        if (activeIndex === index + 1) return "73px";
        return "26px";
    };

    let activeSize;
    let inactiveSize;

    if (isMobile) {
        activeSize = 50;
        inactiveSize = 16;
    } else if (isTablet) {
        activeSize = 50;
        inactiveSize = 18;
    } else {
        // Desktop / Larger
        activeSize = 79;
        inactiveSize = 25;
    }

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden pt-text30 pb30 bg-gradient-to-br from-slate-50 to-blue-50"
        >
            <MotionImage
                width={1500}
                height={1000}
                style={{ y: shapeY }}
                src={assets.mainShape2}
                alt=""
                className={`absolute bottom-50 lg:bottom-3 w-[152px] lg:w-[30%] 2xl:w-[430px] 3xl:w-[460px]
    lg:bottom-40 2xl:bottom-50 3xl:bottom-80 h-auto object-contain
    ${
        isArabic
            ? "left-0 lg:right-0 2xl:right-[-40px] 3xl:right-0 -scale-x-100"
            : "right-0 lg:left-0 2xl:left-[-40px] 3xl:left-0"
    }
  `}
            />

            <div className="container mx-auto px-4">
                <motion.div
                    variants={moveUp(0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.6, once: true }}
                >
                    <H2Title titleText={t.title} titleColor="black" marginClass="mb-5 lg:mb-10 xl:mb-50px 3xl:mb-18" />
                </motion.div>
                <div className="grid lg:grid-cols-2 xl:grid-cols-[0.8fr_1.1fr] 3xl:grid-cols-[1fr_916px] gap-8 lg:gap-13 items-center">
                    {/* LEFT SIDE */}
                    <div className="relative h-full">
                        {/* Vertical line – perfectly centered with circles */}
                        <div
                            className={`pointer-events-none absolute top-0 bottom-0 w-px bg-gradient-to-b from-primary to-secondary ${
                                isArabic ? "right-4" : "left-4"
                            }`}
                        />

                        <div className="flex flex-col justify-center h-full">
                            {t.items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    className="flex"
                                    style={{
                                        marginBottom: index < t.items.length - 1 ? getSpacing(index) : "0",
                                    }}
                                    initial={false}
                                    animate={{
                                        marginBottom:
                                            index < t.items.length - 1 ? (isMobile ? "30px" : getSpacing(index)) : "0",
                                    }}
                                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    {/* Timeline cell: circles + line center aligned */}
                                    <motion.div
                                        variants={moveUp(0.2 * index)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.6, once: true }}
                                        className="w-8 flex items-start justify-center"
                                    >
                                        <motion.button
                                            onClick={() => handleAccordionClick(index)}
                                            className="relative z-10 flex items-center justify-center cursor-pointer"
                                        >
                                            <motion.div
                                                animate={{
                                                    backgroundColor: "#30B6F94D",
                                                    width: activeIndex === index ? activeSize : inactiveSize,
                                                    height: activeIndex === index ? activeSize : inactiveSize,
                                                }}
                                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                                className="rounded-full flex items-center justify-center backdrop-blur-[10px]"
                                            >
                                                {/* <AnimatePresence mode="wait"> */}
                                                {activeIndex === index && (
                                                    <MotionImage
                                                        width={20}
                                                        height={20}
                                                        key="icon"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.3 }}
                                                        src={item.logo}
                                                        alt={item.logoAlt}
                                                        className="w-5 md:w-6 xl:w-[32px] h-auto object-contain"
                                                    />
                                                )}
                                                {/* </AnimatePresence> */}
                                            </motion.div>
                                        </motion.button>
                                    </motion.div>

                                    {/* Content cell */}
                                    <motion.div
                                        variants={moveUp(0.2 * index)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.6, once: true }}
                                        className={`flex-1 ${
                                            isArabic ? "pr-8 md:pr-10 2xl:pr-12" : "pl-8 md:pl-10 2xl:pl-12"
                                        }`}
                                    >
                                        <motion.button
                                            onClick={() => handleAccordionClick(index)}
                                            className={`w-full group flex items-start cursor-pointer ${
                                                isArabic ? "text-right" : "text-left"
                                            }`}
                                            whileHover={{ x: isArabic ? -4 : 4 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <motion.h3
                                                animate={{
                                                    color: activeIndex === index ? "#000000" : "#4B5563",
                                                    marginTop: activeIndex === index ? (isMobile ? "8px" : "20px") : "",
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }}
                                                className={`font-light ${
                                                    activeIndex === index
                                                        ? "text-20 md:text-24 xl:text-29" // Active sizes
                                                        : "text-base md:text-16 xl:text-19" // Inactive sizes
                                                }`}
                                                style={{ lineHeight: "1.2" }}
                                            >
                                                {item.title}
                                            </motion.h3>
                                        </motion.button>

                                        <AnimatePresence initial={false}>
                                            {activeIndex === index && item.description && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        ease: [0.4, 0, 0.2, 1],
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <motion.p
                                                        initial={{ y: -10 }}
                                                        animate={{ y: 0 }}
                                                        exit={{ y: -10 }}
                                                        transition={{ duration: 0.4 }}
                                                        className={`text-16 2xl:text-19 leading-[1.473684210526316] text-paragraph font-light mt-4 2xl:mt-[25px] max-w-full xl:max-w-[37ch] ${
                                                            isArabic ? "pl-8" : "pr-8"
                                                        }`}
                                                    >
                                                        {item.description}
                                                    </motion.p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE – unchanged */}
                    <motion.div
                        variants={isArabic ? moveLeft(-0.2) : moveLeft(0.2)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.6, once: true }}
                        className="relative"
                    >
                        <motion.div ref={imageRef} className="relative overflow-hidden xl:aspect-[4/3]">
                            <div ref={imageContainerRef} className="relative">
                                {/* HEIGHT SPACER — keeps layout */}
                                <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] 2xl:h-[706px]" />

                                {/* BASE IMAGE */}
                                <MotionImage
                                    width={1000}
                                    height={1000}
                                    style={{ y: imageY }}
                                    src={t.items[prevIndexRef.current]?.image}
                                    alt={t.items[prevIndexRef.current]?.title}
                                    className="absolute inset-0 w-full h-full object-cover scale-125 lg:scale-100"
                                />

                                {/* ACTIVE IMAGE (unchanged animation) */}
                                <AnimatePresence
                                    initial={false}
                                    onExitComplete={() => {
                                        prevIndexRef.current = activeIndex;
                                    }}
                                >
                                    <MotionImage
                                        key={activeIndex}
                                        width={1000}
                                        height={1000}
                                        style={{ y: imageY }}
                                        src={t.items[activeIndex]?.image}
                                        alt={t.items[activeIndex]?.title}
                                        className="absolute inset-0 w-full h-full object-cover scale-125 lg:scale-100"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </motion.div>

                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className={`absolute -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10 ${
                                isArabic ? "-left-4" : "-right-4"
                            }`}
                        />

                        <motion.div
                            animate={{
                                rotate: [360, 0],
                                scale: [1, 1.08, 1],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className={`absolute -bottom-4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -z-10 ${
                                isArabic ? "-right-4" : "-left-4"
                            }`}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InnovationSustainability;
