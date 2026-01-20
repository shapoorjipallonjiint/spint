"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AccordionStyle1 from "@/app/components/common/AccordionStyle1";
import H2Title from "@/app/components/common/H2Title";
import { assets } from "@/app/assets";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const WhyChooseSec = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const sectionRef = useRef(null);
    const MotionImage = motion.create(Image);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    return (
        <section className="pt-text30 pb30 relative overflow-hidden" ref={sectionRef}>
            <div
                className={`absolute bottom-[-250px] lg:bottom-0 w-fit h-fit pb-20 lg:pb-25 xl:pb-30
        ${isArabic ? "left-0 lg:-right-40 xl:right-0 -scale-x-100" : "right-0 lg:-left-40 xl:left-0"}
    `}
            >
                <MotionImage
                    width={1500}
                    height={1000}
                    style={{ y: shapeY }}
                    src={assets.mainShape2}
                    alt=""
                    className="object-contain w-[152px] lg:w-[325px] h-[494px] xl:w-[425px] xl:h-[594px]"
                />
            </div>

            <div className="container relative">
                <div className={`max-w-[800px] 2xl:max-w-[900px] 3xl:max-w-[1207px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
                    <div className="border-b border-cmnbdr pb-8 xl:pb-50px">
                        <H2Title titleText={t.title} titleColor="black" marginClass="mb-0" />
                        {/* <p className="text-19 leading-[1.526315789473684] font-light text-paragraph">With over a century of experience, SP International is committed to</p> */}
                    </div>
                    <div className="">
                        <AccordionStyle1 accData={t} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSec;
