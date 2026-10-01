"use client";

import H2Title from "../../../../components/common/H2Title";
import { assets } from "../../../../assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const ExpandingHorizons = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const sectionRef = useRef(null);
    const MotionImage = motion.create(Image);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
    const [rightSpace, setRightSpace] = useState(0);

    useEffect(() => {
        function updateSpace() {
            const container = document.querySelector(".container");
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const space = window.innerWidth - rect.right;

            setRightSpace(space);
        }

        updateSpace();
        window.addEventListener("resize", updateSpace);

        return () => window.removeEventListener("resize", updateSpace);
    }, []);
    return (
        <section className="relative overflow-hidden section-spacing" ref={sectionRef}>
            <div className="">
                <div>
                    <div className="flex gap-10 lg:gap-18 2xl:gap-25">
                        {/* pattern column: fixed width keeps the text to its right; the image is absolute so the
                            section height comes from the text + padding (the section's overflow-hidden clips the pattern) */}
                        <div className="hidden md:block relative shrink-0 w-[150px] lg:w-[260px] 3xl:w-[453px]">
                            <MotionImage
                                height={1200}
                                width={563}
                                style={{ y: shapeY }}
                                src={assets.mainShape2}
                                alt=""
                                className="absolute top-0 start-0 w-full h-auto object-contain"
                            />
                        </div>
                        <div
                            className={`container lg:w-full   lg:max-w-[65%] 2xl:max-w-[74%] 3xl:max-w-[73.84%] lg:ps-0 lg:pe-4`} style={
                                isArabic
                                    ? { marginLeft: `${rightSpace}px` }
                                    : { marginRight: `${rightSpace}px` }
                            }
                        >
                            {/* <h2 className="text-60 font-light leading-[1.166666666666667] mb-50px max-w-[22ch]">{data.title}</h2> */}
                            <H2Title titleText={t.title} titleColor="black" marginClass="mb-4 md:mb-6 2xl:mb-40px" maxW="xl:max-w-[32ch] 3xl:max-w-[22ch]" delay={1.3} />
                            {
                                <motion.p
                                    variants={moveUp(1.5)}
                                    initial="hidden"
                                    whileInView={"show"}
                                    viewport={{ amount: 0.2, once: true }}
                                    // same text style as the other pages' overview sections (Quality / HSE CoreValues)
                                    className="mb-4 xl:mb-8 last:mb-0 text-19 font-light leading-[1.474] xl:max-w-[59ch] text-paragraph"
                                >
                                    {t.description}
                                </motion.p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpandingHorizons;
