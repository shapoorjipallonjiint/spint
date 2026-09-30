"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { paragraphItem } from "@/app/components/motionVarients";
import AccordionStyle1 from "@/app/components/common/AccordionStyle1";
import H2Title from "@/app/components/common/H2Title";
import { assets } from "@/app/assets";
import { useRef } from "react";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const WhyChooseSec = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);
    const imageParRef = useRef(null);
    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageParRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], [-150, 150]);
    return (
        <section className="pt30 pb30 relative overflow-hidden">
            <div
                ref={imageParRef}
                className={`absolute -bottom-30 lg:bottom-0 w-fit h-fit pb-20 lg:pb-25 xl:pb-30
    ${isArabic ? "left-0 lg:right-[-100px] xl:right-0 -scale-x-100" : "right-0 lg:left-[-100px] xl:left-0"}
  `}
            >
                <MotionImage
                    width={1000}
                    height={1000}
                    style={{ y: imageY }}
                    src={assets.mainShape2}
                    alt=""
                    className="object-contain w-[152px] h-[350px] lg:w-[325px] lg:h-[494px] xl:w-[425px] xl:h-[594px]"
                />
            </div>
            <div className="container relative">
                <div className={`max-w-[800px] 2xl:max-w-[900px] 3xl:max-w-[1207px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
                    <div className="border-b border-cmnbdr pb-5 xl:pb-50px">
                        <H2Title titleText={t.title} titleColor="black" marginClass=" mb-5  xl:mb-5" />
                        <motion.p
                            variants={paragraphItem}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-19 leading-[1.526315789473684] font-light text-paragraph"
                        >
                            {t.description}
                        </motion.p>
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
