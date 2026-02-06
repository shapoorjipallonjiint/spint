"use client";

import { useMediaQuery } from "react-responsive";
import { assets } from "@/app/assets";
import H2Title from "@/app/components/common/H2Title";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, paragraphItem } from "@/app/components/motionVarients";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

gsap.registerPlugin(ScrollTrigger);

const Continual = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const sectionRef = useRef(null);
    const imageContainerRefTwo = useRef(null);
    const MotionImage = motion.create(Image);

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
        <section ref={sectionRef} className="py25 relative overflow-hidden bg-[#F5F5F5]">
            <MotionImage
                width={1500}
                height={1000}
                style={{ y: shapeY }}
                src={assets.mainShape2}
                alt=""
                className={`absolute bottom-0 w-[35%] xl:w-[365px] 3xl:w-[465px] h-auto object-contain ${
                    isArabic ? "left-0 -scale-x-100" : "right-0 lg:right-0"
                }`}
            />

            <div className="container">
                <div className="  grid grid-cols-1 lg:grid-cols-[400px_auto] xl:grid-cols-[500px_auto]  2xl:grid-cols-[650px_auto] 3xl:grid-cols-[932px_auto] items-center lg:gap-10 xl:gap-x-[40px] 3xl:gap-x-[70px] gap-y-6">
                    <div className=" relative overflow-hidden" ref={imageContainerRefTwo}>
                        <MotionImage
                            style={{ y: imageY }}
                            src={t.image}
                            width={932}
                            height={532}
                            className="w-full h-[250px] md:h-[320px] lg:h-[450px] md:w-full lg:w-full xl:h-[450px] 2xl:h-[555px] 2xl:w-[932px] object-cover scale-105 "
                            alt={t.imageAlt}
                        />
                        {/* <div ref={overlayRefTwo} className="absolute top-0 left-0 w-full h-full bg-white z-10"></div> */}
                    </div>

                    <div>
                        <div className="border-b border-[#CCCCCC] pb-5 md:pb-[30px] 2xl:pb-[50px]">
                            <H2Title titleText={t?.title} titleColor="black" marginClass="mb-5 2xl:mb-[30px]" />
                            <motion.p
                                variants={paragraphItem}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className="text-19 leading-[1.473684210526316] font-light text-paragraph "
                            >
                                {t?.description}
                            </motion.p>
                        </div>

                        <h4 className="text-29 pt-3 md:pt-[30px]">{t?.subTitle}</h4>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Continual;
