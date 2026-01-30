"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { cultureData } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import LangLink from "@/lib/LangLink";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CultureSection = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const { title, description, image, button } = t || {};

    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const overlayRef = useRef(null);
    const clipPathRef = useRef(null);

    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-90, 90];

    const imageContainerRefTwo = useRef(null);

    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRefTwo,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    useEffect(() => {
        const section = sectionRef.current;
        const content = contentRef.current;
        const overlay = overlayRef.current;
        const clipPath = clipPathRef.current;

        if (!section || !content || !overlay || !clipPath) return;

        // ---- Direction helpers ----
        const overlayOrigin = isArabic ? "right" : "left";

        const clipStart = isArabic
            ? "inset(0% 0% 0% 100%)"   // hide from right
            : "inset(0% 100% 0% 0%)"; // hide from left

        const clipEnd = "inset(0% 0% 0% 0%)";

        // ---- Initial states ----
        gsap.set(content, { opacity: 0, y: 50 });

        gsap.set(overlay, {
            scaleX: 1,
            transformOrigin: overlayOrigin,
        });

        gsap.set(clipPath, {
            clipPath: clipStart,
        });

        // ---- Timeline ----
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 20%",
            },
        });

        tl.to(clipPath, {
            clipPath: clipEnd,
            duration: 1,
            ease: "power2.inOut",
        })
            .to(
                overlay,
                {
                    scaleX: 0,
                    duration: 0.8,
                    ease: "power4.inOut",
                },
                "-=0.5"
            )
            .to(
                content,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power4.out",
                },
                "-=0.6"
            );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [isArabic]);


    return (
        <section id="careers-stop-section" ref={sectionRef} className="pb30 pt-text30 overflow-hidden">
            <div
                className="relative w-full h-[350px] lg:h-[420px] xl:h-[490px] overflow-hidden flex items-center container"
                ref={imageContainerRefTwo}
            >
                {/* Background image with clip path reveal */}
                <motion.div
                    ref={clipPathRef}
                    className="absolute h-full inset-0"
                    style={{
                        backgroundImage: isArabic
                            ? `linear-gradient(
        270deg,
        rgba(0, 0, 0, 0.8) 7.22%,
        rgba(0, 0, 0, 0) 74.6%
     ), url(${image})`
                            : `linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.8) 7.22%,
        rgba(0, 0, 0, 0) 74.6%
     ), url(${image})`,

                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        y: imageY,
                    }}
                />
                {/* Overlay for additional reveal effect */}
                <div ref={overlayRef} className="absolute inset-0 bg-black/50" style={{ transformOrigin: isArabic ? "right" : "left" }} />
                {/* Content */}
                <div ref={contentRef} className="relative z-10 text-white px-6 sm:px-10 md:px-14 lg:px-[100px]">
                    {/* <h2 className="text-60 font-light leading-[1.166666666666667] mb-6 xl:mb-[30px] lg:max-w-[500px]">
            {title}
          </h2> */}
                    <H2Title
                        titleText={title}
                        marginClass={"mb-3 md:mb-6 xl:mb-[30px]"}
                        maxW={"max-w-xs lg:max-w-[500px]"}
                    />
                    <p className="text-16 md:text-19 font-light leading-[1.473684210526316] max-w-[660px] mb-[24px] xl:mb-[30px]">
                        {description}
                    </p>
                    {/* Button with centered text over SVG */}
                    <LangLink href={button.btnLink} target="blank">
                        <button className="relative inline-flex items-center justify-center">
                            <Image
                                width={240}
                                height={600}
                                src="/assets/images/careers/partofus/btn-svg.svg"
                                alt="button"
                                className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px] h-full"
                            />
                            <span className="absolute text-white font-light uppercase text-12 md:text-14 lg:text-16 leading-[1.75]">
                                {button.text}
                            </span>
                        </button>
                    </LangLink>
                </div>
            </div>
        </section>
    );
};

export default CultureSection;
