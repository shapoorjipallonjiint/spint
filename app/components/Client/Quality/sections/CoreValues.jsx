"use client";

import { useMediaQuery } from "react-responsive";
// import { coreValueData } from "../data";
import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { assets } from "../../../../assets/index";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const CoreValues = ({ data }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);
    const MotionImage = motion.create(Image);
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
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
    return (
        <section className="pt25 pb30 relative overflow-hidden" ref={sectionRef}>
            <div className="container ">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[658px_auto] gap-5 2xl:gap-15 3xl:gap-23 items-center">
                    <div className="relative overflow-hidden" ref={imageContainerRefTwo}>
                        <MotionImage
                            style={{ y: imageY }}
                            variants={moveUp(1.6)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            src={t.image}
                            width={658}
                            height={545}
                            alt=""
                            className="w-full h-[200px] xs:h-[250px] md:h-[300px] lg:h-[400px] 2xl:h-[545px] object-cover"
                        />
                    </div>
                    <div className="border-b border-[#cccccc] pb-5 md:pb-7 xl:pb-[42px]">
                        <H2Title
                            titleText={t.title}
                            titleColor="black"
                            marginClass="mb-4 2xl:mb-[30px] max-w-[15ch]"
                            delay={1.3}
                        />
                        <motion.p
                            variants={moveUp(1.4)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-19 font-light leading-[1.474] xl:max-w-[59ch] text-paragraph"
                        >
                            {t.description}
                        </motion.p>
                    </div>
                    <MotionImage
                        src={assets.mainShape2}
                        style={{ y: shapeY }}
                        alt=""
                        className={`absolute 
    bottom-[-60px] md:bottom-[-43px] 
    z-[-1] 
    w-[150px] sm:w-[360px] lg:w-[461px] 2xl:w-[461px] 3xl:w-[667px] 
    h-[434px] xl:h-[934px]
    ${isArabic ? "left-[-30px] lg:left-[-80px] xl:left-0 -scale-x-100" : "right-[-30px] lg:right-[-80px] xl:right-0"}
  `}
                        width={667}
                        height={934}
                    />
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
