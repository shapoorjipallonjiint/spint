"use client";

import React, { useRef, useEffect } from "react";
import { assets } from "@/app/assets/index";
import H2Title from "@/app/components/common/H2Title";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

gsap.registerPlugin(ScrollTrigger);
const ExpertiseSec = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const swiperRef = useRef(null);
    const sectionRef = useRef(null);
    useEffect(() => {
        if (!sectionRef.current) return;

        const overlay = sectionRef.current.querySelector(".reveal-overlay4");
        if (!overlay) return;
        gsap.set(overlay, { xPercent: 0 });

        gsap.to(overlay, {
            xPercent: isArabic ? -100 : 100,
            duration: 2.7,
            ease: "expo.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 50%",
                toggleActions: "play none none none",
            },
        });
    }, [isArabic]);

    return (
        <section className="relative pt-text90 pb95 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
            <div className="absolute -top-3 right-0 w-[354px] h-[504px] lg:w-[454px] lg:h-[304px] 3xl:w-[624px] 3xl:h-[874px] z-0">
                <img src={assets.mainShape} alt="" />
            </div>
            <div className="container relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 xl:mb-50px 3xl:mb-17">
                    <H2Title titleText={t.title} titleColor="white" marginClass="mb-0" />
                    <motion.div
                        variants={moveUp(0.5)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="flex gap-2 xl:gap-5 "
                    >
                        <button className="custom-prv  w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-white/60 hover:border-secondary hover:bg-secondary/10 hover:text-white transition">
                            <Image
                                src="/assets/images/project-details/rightarrow.svg"
                                className={`w-[16px] h-[16px] xl:h-auto xl:w-auto ${
                                    isArabic ? "" : "rotate-180"
                                } group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                alt=""
                                width={14}
                                height={14}
                            />
                        </button>
                        <button
                            className="custom-nxt w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-white/60 
          hover:border-secondary hover:bg-secondary/10 hover:text-white transition"
                        >
                            <Image
                                src="/assets/images/project-details/rightarrow.svg"
                                className={`w-[16px] h-[16px] xl:h-auto xl:w-auto group-hover:brightness-0 group-hover:invert-100 transition-all duration-300 ${
                                    isArabic ? "rotate-180" : ""
                                }`}
                                alt=""
                                width={14}
                                height={14}
                            />
                        </button>
                    </motion.div>
                </div>
                <div className="">
                    <Swiper
                        ref={swiperRef}
                        modules={[EffectFade, Autoplay, Navigation]}
                        spaceBetween={40}
                        slidesPerView={1}
                        loop={true}
                        navigation={{
                            prevEl: ".custom-prv",
                            nextEl: ".custom-nxt",
                        }}
                        speed={1200}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            waitForTransition: true,
                        }}
                        breakpoints={{
                            600: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1400: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {t.items.map((item, i) => (
                            <SwiperSlide>
                                <motion.div
                                    className="relative overflow-hidden border-b xl:border-b-0 border-white/30 pb-5 xl:pb-0"
                                    initial={{ rotateY: -90, opacity: 0 }}
                                    whileInView={{ rotateY: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.15, // stagger effect
                                        ease: "easeOut",
                                    }}
                                    viewport={{ once: true, amount: 0.6 }} // triggers when card is 30% visible
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <Image
                                        width={300}
                                        height={300}
                                        src={item.image}
                                        alt={item.imageAlt}
                                        className="w-full h-[200px] md:h-[250px] xl:h-[300px] 2xl:h-[350px] 3xl:h-[416px]  object-cover"
                                    />
                                    <div className="pt-4 lg:pt-6 2xl:pt-30px">
                                        <h3 className="md:text-18 2xl:text-24 3xl:text-29 leading-[1.2] 3xl:leading-[1.35] font-light ">
                                            {item.title}
                                        </h3>
                                        <p className="text-19 leading-[1.526315789473684] font-light">{item.desc}</p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSec;
