"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import AccordionCareer from "../../../common/AccordionCareer";
import H2Title from "../../../common/H2Title";
import Image from "next/image";
import WipeSlideshow from "../../../common/WipeSlideshow";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const ImageAcc = ({ data }) => {
    const sectionRef = useRef(null);
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data)

    const [openIndex, setOpenIndex] = useState(1);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    // image follows the open item; when every item is collapsed it keeps the last one instead of going blank
    const [imageIndex, setImageIndex] = useState(1);
    if (openIndex !== null && openIndex !== imageIndex) setImageIndex(openIndex);

    return (
        <section className="section-spacing relative overflow-hidden" ref={sectionRef}>
            <div className="container relative">
                <div>
                    <div className="pb-8 xl:pb-50px">
                        <H2Title titleText={t.title} titleColor="black" marginClass="mb-0" />
                    </div>

                    <div className="grid lg:grid-cols-[600px_1fr] 2xl:grid-cols-[700px_auto] 3xl:grid-cols-[916px_auto] gap-8 2xl:gap-18 3xl:gap-[107px] items-center">
                        {/* LEFT IMAGE – CHANGES WITH ACCORDION */}
                        {/* same clip-path wipe as the other image switchers (TabStyle1, Legacy) */}
                        <WipeSlideshow
                            items={t?.items || []}
                            index={imageIndex}
                            isArabic={isArabic}
                            renderSlide={(item, i, isLayer) => (
                                <Image
                                    width={1200}
                                    height={621}
                                    src={item?.image}
                                    alt={item?.imageAlt || ""}
                                    className={isLayer ? "w-full h-full object-cover" : "sm:h-[300px] max-h-[621px] lg:h-auto w-full object-cover"}
                                />
                            )}
                        />

                        <div className="border-t border-cmnbdr">
                            <AccordionCareer accData={t} openIndex={openIndex} setOpenIndex={setOpenIndex} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageAcc;
