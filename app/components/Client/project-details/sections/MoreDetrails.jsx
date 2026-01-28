"use client";
import { moredetrails } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, paragraphItem } from "../../../motionVarients";
import { useRef } from "react";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const MoreDetrails = ({ data }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);
    const sectionRef = useRef(null);
    const MotionImage = motion.create(Image);

    // Parallax for shape
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    const normalizeDescription = (text = "") =>
        text
            // Normalize Windows line endings to Unix
            .replace(/\r\n/g, "\n")

            // Fix sentence-breaking newlines (comma/letter → lowercase continuation)
            .replace(/([^\n])\n\s*\n([a-z])/g, "$1 $2")

            // Collapse excessive newlines
            .replace(/\n{3,}/g, "\n\n")

            .trim();

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="pt-8 pb-9 xl:py-15 2xl:py-22  3xl:py-[80px]  relative bg-f5f5 ">
                <div className="container relative">
                    <div className={`2xl:max-w-[1008px] 3xl:max-w-[1208px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
                        <div className="flex  justify-between items-center border-b border-black/20">
                            <div className="relative z-20">
                                <H2Title titleText={t.title} marginClass="mb-3 lg:mb-7" />
                                <div>
                                    {normalizeDescription(t.description)
                                        .split("\n\n")
                                        .map((paragraph, index) => (
                                            <motion.p
                                                key={index}
                                                variants={paragraphItem}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ amount: 0.2, once: true }}
                                                className="text-19 font-light text-paragraph mb-3 xl:mb-5 3xl:mb-[25.4px] last:mb-6 last:lg:mb-10 last:2xl:mb-[80px]"
                                            >
                                                {paragraph}
                                            </motion.p>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute hidden xl:block bottom-8 lg:bottom-[73px] z-10
    ${isArabic
                            ? "left-0 lg:right-[-400px] 3xl:right-[-290px]"
                            : "right-0 lg:left-[-400px] 3xl:left-[-290px]"
                        }
  `}
                >
                    <MotionImage
                        width={1500}
                        height={1000}
                        style={{ y: shapeY }}
                        src="/assets/images/svg/sv-02.svg"
                        className={`w-[500px] h-[992px] md:w-[150px] md:h-[340px] lg:w-[742px] lg:h-[1040px] object-cover object-center ${isArabic ? "-scale-x-100" : ""}`}
                        alt=""
                    />
                </div>

            </div>
        </section>
    );
};

export default MoreDetrails;
