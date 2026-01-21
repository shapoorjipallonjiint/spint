"use client";
import { useMediaQuery } from "react-responsive";
import { assets } from "@/app/assets/index";
import H2Title from "@/app/components/common/H2Title";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
gsap.registerPlugin(ScrollTrigger);

const DesignExcellence = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const imageContainerRefTwo = useRef(null);
    const overlayRefTwo = useRef(null);

    const MotionImage = motion.create(Image);

    const sectionRef = useRef(null);
    const imageContainerRefOne = useRef(null);

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRefOne,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    // Parallax for shape
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);

    useEffect(() => {
        const container = imageContainerRefTwo.current;
        const overlay = overlayRefTwo.current;

        if (!container || !overlay) return;

        // Set initial state - overlay covers the image
        gsap.set(overlay, {
            scaleX: 1,
            transformOrigin: isArabic ? "left" : "right",
        });

        // Create ScrollTrigger animation
        gsap.to(overlay, {
            scaleX: 0,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                end: "top 20%",
                delay: 0.8,
                // scrub: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [isArabic]);

    return (
        <section className="relative overflow-hidden pt30 3xl:pt-[161px] pb30" ref={sectionRef}>
            <div
                className={`absolute bottom-[-140px] pt30 3xl:pt-[161px] h-full w-full z-0 ${
                    isArabic ? "right-[-120px] xl:right-0" : "left-[-120px] xl:left-0"
                }`}
            >
                <MotionImage
                    width={1500}
                    height={1000}
                    style={{ y: shapeY }}
                    src={assets.mainShape2}
                    alt=""
                    className={`w-[30%] 2xl:w-[425px] h-auto max-w-[425px] object-contain ${
                        isArabic ? "-scale-x-100" : ""
                    }`}
                />
            </div>

            <div className="container">
                <div
                    className={`w-full max-w-[700px] xl:max-w-[700px] 2xl:max-w-[900px] 3xl:max-w-[1207px] ${
                        isArabic ? "mr-auto" : "ml-auto"
                    } flex flex-col gap-5 xl:gap-0`}
                >
                    <div className="mb-0 md:mb-6 2xl:mb-12 3xl:mb-18 order-2 xl:order-1">
                        <H2Title titleText={t.title} marginClass={"mb-2 xl:mb-6 2xl:mb-30px"} />
                        <motion.p
                            variants={moveUp(0.4)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-19 leading-[1.473684210526316] font-light text-paragraph max-w-3xl"
                        >
                            {t.description}
                        </motion.p>
                    </div>
                    <div className="order-1 xl:order-2 relative overflow-hidden" ref={imageContainerRefTwo}>
                        <div ref={imageContainerRefOne} className="relative">
                            <MotionImage
                                style={{ y: imageY }}
                                src={t.image}
                                alt={t.imageAlt}
                                width={1270}
                                height={470}
                                className="w-full h-[200px] md:h-[300px] lg:h-[350px] 2xl:w-[1270px] 2xl:h-[470px] scale-110 lg:scale-150 xl:scale-110 object-cover"
                            />
                        </div>
                        <div
                            ref={overlayRefTwo}
                            className={`absolute top-0 ${isArabic ? "right-0" : "left-0"} w-full h-full bg-white z-10`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignExcellence;
