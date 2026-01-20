"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef } from "react";
import { Autoplay, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import H2Title from "@/app/components/common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
const SectorsSec = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();

    const containerRef = useRef(null);
    const dynamicRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !dynamicRef.current) return;

        const updateMargin = () => {
            const rect = containerRef.current.getBoundingClientRect();

            if (isArabic) {
                dynamicRef.current.style.marginRight = `${window.innerWidth - rect.right + 15}px`;
                dynamicRef.current.style.marginLeft = "0px";
            } else {
                dynamicRef.current.style.marginLeft = `${rect.left + 15}px`;
                dynamicRef.current.style.marginRight = "0px";
            }
        };

        updateMargin();
        window.addEventListener("resize", updateMargin);

        return () => window.removeEventListener("resize", updateMargin);
    }, [isArabic]);

    return (
        <section className="pt-text30 pb30 overflow-hidden">
            <div ref={containerRef} className="container"></div>
            <div ref={dynamicRef} className="ml-dynamic">
                <div>
                    <H2Title titleText={t.title} titleColor="black" marginClass="mb-5 xl:mb-50px" />
                </div>
                <div>
                    <Swiper
                        modules={[Autoplay, Controller]}
                        spaceBetween={40}
                        slidesPerView={1}
                        speed={700}
                        autoplay={{
                            delay: 7000,
                            disableOnInteraction: true,
                        }}
                        loop={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            480: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1400: {
                                slidesPerView: 4,
                            },
                        }}
                        className="expertise-swiper "
                    >
                        {[...t.items, ...t.items].map((item, index) => (
                            <SwiperSlide key={index} className="cursor-grab">
                                <div
                                    className={`relative overflow-hidden border-white/30 ${
                                        isArabic ? "border-r" : "border-l"
                                    }`}
                                >
                                    <motion.div
                                        variants={moveUp(0.2 * index)}
                                        initial="hidden"
                                        animate="show"
                                        viewport={{ amount: 0.6, once: true }}
                                        className="w-15 h-15 xl:w-20 xl:h-20 bg-secondary rounded-full flex items-center justify-center mb-5"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            src={item.image}
                                            alt={item.imageAlt}
                                            className="w-auto h-5 md:h-6 2xl:h-[36px] object-contain"
                                        />
                                    </motion.div>
                                    <div className="">
                                        <h3 className="text-32 leading-[1.3125] font-light mb-2 xl:mb-3">{item.title}</h3>
                                        <p className="text-19 leading-[1.526315789473684] font-light text-paragraph">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default SectorsSec;
