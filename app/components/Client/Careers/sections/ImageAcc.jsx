"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import AccordionCareer from "../../../common/AccordionCareer";
import H2Title from "../../../common/H2Title";
import Image from "next/image";
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

    const activeItem = t?.items?.[openIndex];

    return (
        <section className="py30 relative overflow-hidden" ref={sectionRef}>
            <div className="container relative">
                <div>
                    <div className="pb-8 xl:pb-50px">
                        <H2Title titleText={t.title} titleColor="black" marginClass="mb-0" />
                    </div>

                    <div className="grid lg:grid-cols-[430px_1fr] 2xl:grid-cols-[700px_auto] 3xl:grid-cols-[916px_auto] gap-8 2xl:gap-18 3xl:gap-[107px] items-center">
                        {/* LEFT IMAGE – CHANGES WITH ACCORDION */}
                        <Image
                            width={1200}
                            height={621}
                            src={activeItem?.image}
                            alt={activeItem?.imageAlt || ""}
                            className="sm:h-[300px] max-h-[621px] lg:h-auto w-full object-cover"
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
