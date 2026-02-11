"use client";

// import { CertificationsData } from "../data";
import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "../../../common/ImagePopup";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Certifications = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);
    const [activeImage, setActiveImage] = useState(null);

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
                    <div
                        className={`hidden md:grid grid-cols-3 3xl:grid-cols-[520px_550px_550px] 
                                gap-2 lg:gap-23 3xl:gap-0 mt-5 xl:mt-50px border-t border-white/20
                                ${isArabic ? "rtl" : "ltr"}
                            `}   >
                        {t.items.map((item, index) => (
                            <div
                                key={index}
                                className={`p-6 lg:p-10 lg:pb-5 border-b md:border-b-0 border-white/20 ${
                                    isArabic ? "md:border-r md:last:border-l md:border-l-0" : "md:border-l md:last:border-r"
                                }`}
                            >
                                <MotionImage
                                    variants={moveUp(0.5 + 0.2 * index)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    src={item.fileImage}
                                    alt={item.fileImageAlt}
                                    width={276}
                                    height={400}
                                    className="w-fit h-[276px] 2xl:h-[400px] object-contain cursor-pointer"
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
