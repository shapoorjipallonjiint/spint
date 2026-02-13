"use client";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState, useRef } from "react";
// import { valuesData } from "../data";
import { moveLeft, moveUp } from "../../../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const ValuesSection = ({ data }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);
    const MotionImage = motion.create(Image);
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const { title, description, image, imageAlt } = t;
    const [leftOffset, setLeftOffset] = useState(0);
    const [isWideScreen, setIsWideScreen] = useState(false);

    const sectionRef = useRef(null);
    const imageContainerRefTwo = useRef(null);

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRefTwo,
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
        const updateOffset = () => {
            const container = document.querySelector(".container");
            const isWide = window.innerWidth >= 1024; // lg breakpoint
            setIsWideScreen(isWide);

            if (container) {
                const rect = container.getBoundingClientRect();
                setLeftOffset(rect.left + 15); // small tweak for visual balance
            }
        };

        // Run on mount + resize
        updateOffset();
        window.addEventListener("resize", updateOffset);
        return () => window.removeEventListener("resize", updateOffset);
    }, []);

    return (
        <section
            className="bg-primary text-white w-full flex flex-col md:flex-row xl:h-[600px] 2xl:h-[656px] overflow-hidden pt-8 pb-10 md:py-0"
            ref={sectionRef}
        >
            {/* Wrapper */}
            <div className="flex flex-col md:flex-row w-full md:items-stretch">
                {/* Left Section */}
                <div
                    className="relative w-full md:w-1/2 flex flex-col justify-center pb-6 md:py-0 "
                    style={
                        isWideScreen
                            ? isArabic
                                ? { paddingRight: `${leftOffset}px` }
                                : { paddingLeft: `${leftOffset}px` }
                            : undefined
                    }

                >
                    {/* Background SVG (always fixed bottom-right) */}
                    <MotionImage
                        width={425}
                        height={1000}
                        style={{ y: shapeY }}
                        variants={moveUp(0.2)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        src="/assets/images/careers/our-values/left-svg.svg"
                        alt="background design"
                        className={`absolute bottom-0 pointer-events-none object-contain md:object-cover opacity-90
    w-[200px] md:w-[360px] lg:w-[420px] 2xl:w-[425px] h-auto
    ${isArabic ? "left-0 -scale-x-100" : "right-0"}
  `}
                    />

                    <div className={`relative z-10 ${!isWideScreen ? "container" : ""}`}>
                        {/* <motion.h2 variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-60 font-light leading-[1.166666666666667] max-w-[390px] mb-[24px] md:mb-[30px]">
              {title}
            </motion.h2> */}
                        <H2Title titleText={title} marginClass={"mb-[24px] md:mb-[30px] max-w-[10ch]"} />
<motion.p
  variants={moveUp(0.2)}
  initial="hidden"
  whileInView="show"
  viewport={{ amount: 0.2, once: true }}
  className="text-19 font-light text-white leading-[1.473684210526316] max-w-[43ch] [&_p]:mb-3 [&_p:last-child]:mb-0"
  dangerouslySetInnerHTML={{ __html: description }}
/>


                    </div>
                </div>

                {/* Right Section */}
                <motion.div
                    variants={moveLeft(0.6)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="w-full md:w-1/2 h-[260px] sm:h-[340px] md:h-full px-[15px] md:px-0 relative overflow-hidden"
                    ref={imageContainerRefTwo}
                >
                    <MotionImage
                        width={1920}
                        height={1000}
                        style={{ y: imageY }}
                        src={image}
                        alt={imageAlt}
                        className="w-full h-full object-cover scale-110"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default ValuesSection;
