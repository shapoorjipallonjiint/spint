"use client";

import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { moveUp } from "@/app/components/motionVarients";
import H2Title from "@/app/components/common/H2Title";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

const QualityPractices = ({ data, bgColor = "", sectionSpacing = "" }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);

    const isMob = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    /* ================= BACKEND DATA NORMALIZATION ================= */
    // const heading = t?.title ?? "";
    // const subTitle = t?.subTitle ?? "";
    // const points =
    //     t?.points ??
    //     t?.items?.map((item) => ({
    //         text: item.title,
    //         image: item.image,
    //     })) ??
    //     [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [activeImage, setActiveImage] = useState(FALLBACK_IMAGE);
    const [mounted, setMounted] = useState(false);

    const imageRef = useRef(null);

    /* ================= MOUNT CHECK ================= */
    useEffect(() => {
        setMounted(true);
    }, []);

    /* ================= RESPONSIVE CHECK ================= */
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ================= INITIAL IMAGE ================= */
    useEffect(() => {
        if (t.items.length) {
            setActiveImage(t.items[0].image ?? FALLBACK_IMAGE);
        }
    }, []);

    /* ================= SCROLL PARALLAX ================= */
    const imageOffset = isMob ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];

    const { scrollYProgress } = useScroll(mounted ? { target: imageRef, offset: ["start end", "end start"] } : {});

    const imageY = useTransform(scrollYProgress ?? 0, [0, 1], imageOffset);

    /* ================= IMAGE UPDATE ================= */
    const updateImage = (index) => {
        if (t.items[index]?.image) {
            setActiveImage(t.items[index].image); 
             
        }
    };

    // const isActive = (index ) =>
    //   isMobile
    //     ? activeIndex === index
    //     : hoverIndex === index || activeIndex === index;

    const isActive = (index) => (isMobile ? activeIndex === index : hoverIndex === index);

    if (!t.items.length) return null;

    return (
        <section className={`w-full ${bgColor} text-black ${sectionSpacing}`}>
            <div className="container">
                {/* ================= TITLE ================= */}
                <motion.div
                    variants={moveUp(0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-7 2xl:mb-[50px]"
                >
                    <H2Title titleText={t.title} titleColor="black" marginClass="mb-4 lg:mb-6 xl:mb-8 3xl:mb-[30px]" />
                    <motion.p
                        variants={moveUp(0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="text-19 font-light leading-[1.474] max-w-[85ch] text-[#464646]"
                    >
                        {t.subTitle}
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-[0.8fr_1fr] 2xl:grid-cols-[600px_auto] 3xl:grid-cols-[916px_auto] gap-8 xl:gap-10 2xl:gap-18 3xl:gap-[107px] items-center">
                    {/* ================= IMAGE (DESKTOP ONLY) ================= */}
                    <div ref={imageRef} className="hidden md:block relative h-[250px] md:h-full overflow-hidden">
                        <MotionImage
                            key={activeImage}
                            src={activeImage}
                            alt=""
                            width={1920}
                            height={1000}
                            style={{ y: imageY }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full object-cover scale-110 md:scale-150 lg:scale-110"
                        />
                    </div>

                    {/* ================= TEXT ================= */}
                    <div className="border-t border-b border-black/20 3xl:max-w-[50ch]">
                        {t.items.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={moveUp(0.15 * index)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                // onMouseEnter={() => {
                                //   if (!isMobile) {
                                //     setHoverIndex(index);
                                //     updateImage(index);
                                //   }
                                // }}
                                onMouseEnter={() => {
                                    if (!isMobile) {
                                        setHoverIndex(index);
                                        updateImage(index); 
                                    }
                                }}
                                // onMouseLeave={() => !isMobile && setHoverIndex(null)}
                                // onMouseLeave={() => {
                                //     if (!isMobile) {
                                //         setHoverIndex(null);
                                //     }
                                // }}
                                // onClick={() => {
                                //   setActiveIndex(index);
                                //   updateImage(index);
                                // }}
                                onClick={() => {
                                    if (isMobile) {
                                        setActiveIndex(index);
                                        updateImage(index);
                                    }
                                }}
                                className="border-b border-black/20 last:border-b-0 py-4 lg:py-5 3xl:py-[15px] cursor-pointer"
                            >
                                {/* TITLE */}
                                <div
                                    className={`relative 2xl:text-24 3xl:text-29 transition-all 2xl:w-[96%] text-black ${
                                        isActive(index) ? " font-semibold" : "  font-light"
                                    }`}
                                >
                                    {/* LEFT BAR */}
                                    <span
                                        className={`absolute ${
                                            isArabic ? "right-0" : "left-0"
                                        } top-0 h-full w-[3px] bg-secondary transition-transform origin-top ${
                                            isActive(index) ? "scale-y-100" : "scale-y-0"
                                        }`}
                                    />

                                    {/* TITLE */}
                                    <span
                                        className={`inline-block transition-transform pe-[20px] md:pe-0 ${
                                            isActive(index)
                                                ? isArabic
                                                    ? "-translate-x-[20px] xl:-translate-x-[43px]  "
                                                    : "translate-x-[20px] xl:translate-x-[43px] "
                                                : "translate-x-0"
                                        }`}
                                    >
                                        {item.title}
                                    </span>
 {/* ================= MOBILE IMAGE ================= */}
                                {isMobile && isActive(index) && (
                                    <MotionImage
                                        src={item.image}
                                        alt=""
                                        width={800}
                                        height={400}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className={`mt-4 w-full h-[200px] object-cover ps-[20px] md:ps-0 ${
                                            isActive(index)
                                                ?    " ps-[20px] md:ps-0" 
                                                : " "
                                        }`}
                                    />
                                )}
                                    {/* DESCRIPTION (only when hovered / active) */}
                                    <motion.p
                                        initial={false}
                                        animate={{
                                            opacity: isActive(index) ? 1 : 0,
                                            height: isActive(index) ? "auto" : 0,
                                            marginTop: isActive(index) ? 10 : 0,
                                        }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className={`overflow-hidden text-sm lg:text-base text-paragraph font-light leading-relaxed pe-[20px] md:pe-0 ${
                                            isActive(index)
                                                ? isArabic
                                                    ? "-translate-x-[20px] xl:-translate-x-[43px]  "
                                                    : "translate-x-[20px] xl:translate-x-[43px]  "
                                                : "translate-x-0 "
                                        }`}
                                    >
                                        {item.description}
                                    </motion.p>
                                </div>

                               
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QualityPractices;
