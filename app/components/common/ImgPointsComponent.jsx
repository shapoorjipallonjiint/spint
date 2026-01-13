"use client";

import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { moveUp } from "../motionVarients";
import H2Title from "./H2Title";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = "/assets/images/placeholder.jpg";

const ImgPointsComponent = ({ data, bgColor = "", sectionSpacing = "" }) => {
    const MotionImage = motion.create(Image);

    const isMob = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    /* ================= BACKEND DATA NORMALIZATION ================= */
    const heading = data?.title ?? "";
    const points =
        data?.points ??
        data?.items?.map((item) => ({
            text: item.title,
            image: item.image,
        })) ??
        [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);
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
        if (points.length) {
            setActiveImage(points[0].image ?? FALLBACK_IMAGE);
        }
    }, [points]);

    /* ================= SCROLL PARALLAX ================= */
    const imageOffset = isMob ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];

    const { scrollYProgress } = useScroll(mounted ? { target: imageRef, offset: ["start end", "end start"] } : {});

    const imageY = useTransform(scrollYProgress ?? 0, [0, 1], imageOffset);

    /* ================= IMAGE UPDATE ================= */
    const updateImage = (index) => {
        if (points[index]?.image) {
            setActiveImage(points[index].image);
        }
    };

    // const isActive = (index ) =>
    //   isMobile
    //     ? activeIndex === index
    //     : hoverIndex === index || activeIndex === index;

    const isActive = (index) => (isMobile ? activeIndex === index : hoverIndex === index);

    if (!points.length) return null;

    return (
        <section className={`w-full ${bgColor} text-black ${sectionSpacing}`}>
            <div className="container">
                {/* ================= TITLE ================= */}
                <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <H2Title titleText={heading} titleColor="black" marginClass="mb-4 lg:mb-6 xl:mb-8 3xl:mb-17" />
                </motion.div>

                <div className="grid md:grid-cols-[0.8fr_1fr] 2xl:grid-cols-[600px_auto] 3xl:grid-cols-[916px_auto] gap-8 xl:gap-10 2xl:gap-18 3xl:gap-[107px]">
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
                        {points.map((item, index) => (
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
                                onMouseLeave={() => {
                                    if (!isMobile) {
                                        setHoverIndex(null);
                                    }
                                }}
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
                                className="border-b border-black/20 last:border-b-0 py-5 3xl:py-8 cursor-pointer"
                            >
                                {/* TITLE */}
                                <div
                                    className={`relative 2xl:text-24 3xl:text-29 transition-all 2xl:w-[96%] ${
                                        isActive(index) ? "text-black font-semibold" : "text-paragraph font-light"
                                    }`}
                                >
                                    <span
                                        className={`absolute left-0 top-0 h-full w-[3px] bg-secondary transition-transform origin-top ${
                                            isActive(index) ? "scale-y-100" : "scale-y-0"
                                        }`}
                                    />
                                    <span
                                        className={`inline-block transition-transform ${
                                            isActive(index) ? "translate-x-[20px] xl:translate-x-[43px]" : "translate-x-0"
                                        }`}
                                    >
                                        {item.text}
                                    </span>
                                </div>

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
                                        className="mt-4 w-full h-[200px] object-cover"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImgPointsComponent;
