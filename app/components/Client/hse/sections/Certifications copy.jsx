"use client";

import H2Title from "@/app/components/common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/app/components/common/ImagePopup";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

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
                    <div className="md:hidden mt-5 border-t border-white/20">
                        <Swiper
                            modules={[Autoplay]}
                            slidesPerView={2}
                            spaceBetween={12}
                            autoplay={{ delay: 2500 }}
                            loop={true}
                        >
                            {t.items.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="pt-6 pb-4 border-b border-white/20">
                                <MotionImage
                                    src={item.fileImage}
                                    alt={item.fileImageAlt}
                                    width={276}
                                    height={400}
                                    className="w-fit   object-contain cursor-pointer"
                                    onClick={() => setActiveImage(item.fileImage)}
                                />

                                <motion.h3 className="text-19 mt-4 text-white font-light">
                                    {item.fileName}
                                </motion.h3>
                                </div>
                            </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="hidden md:grid grid-cols-1  md:grid-cols-3  3xl:grid-cols-[520px_550px_550px]  gap-2 lg:gap-23 3xl:gap-0 mt-5 xl:mt-50px border-t border-white/20">
                        {t.items.map((item, index) => (
                            <div
                                key={index}
                                className="p-6 lg:p-10 lg:pb-5 md:border-l border-white/20 md:last:border-r border-b md:border-b-0"
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
                                 <motion.p
                                    variants={moveUp(0.5 + 0.2 * index)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-19   mt-4 text-white font-light leading-[1.2]   "
                                >
                                    {item.description}
                                </motion.p>
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
