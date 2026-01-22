"use client";

import H2Title from "@/app/components/common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/app/components/common/ImagePopup";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const Certifications = ({ data }) => {
    const MotionImage = motion.create(Image);
    const [activeImage, setActiveImage] = useState(null);
    const t = useApplyLang(data);

    return (
        <section className="pt-text90 pb25 bg-primary">
            <div className="container ">
                <div>
                    <H2Title titleText={t.title} titleColor="white" marginClass="mb-4 2xl:mb-50px" />
                    <motion.p
                        variants={moveUp(0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="text-19 font-light leading-[1.474] max-w-[85ch] text-white"
                    >
                        {t.description}
                    </motion.p>
                </div>
                <div>
                    <div className="grid grid-cols-1  md:grid-cols-3  3xl:grid-cols-[520px_550px_550px]  gap-2 lg:gap-23 3xl:gap-0 mt-5 xl:mt-50px border-t border-white/20">
                        {t.items.map((item, index) => (
                            <div
                                key={index}
                                className="p-6 lg:p-10 md:border-l border-white/20 md:last:border-r border-b md:border-b-0"
                            >
                                {/* <MotionImage width={276} height={400} variants={moveUp(0.5 + 0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} src={item.fileImage} alt="" /> */}
                                <MotionImage
                                    width={276}
                                    height={400}
                                    variants={moveUp(0.5 + 0.2 * index)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    src={item.fileImage}
                                    alt={item.fileName}
                                    className="cursor-pointer"
                                    onClick={() => setActiveImage(item.fileImage)}
                                />

                                <motion.h3
                                    variants={moveUp(0.5 + 0.2 * index)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-19 lg:text-29 mt-7 text-white font-light leading-[1.312]  max-w-[15ch]"
                                >
                                    {item.fileName}
                                </motion.h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ImageLightbox src={activeImage} alt="Certificate preview" onClose={() => setActiveImage(null)} />
        </section>
    );
};

export default Certifications;
