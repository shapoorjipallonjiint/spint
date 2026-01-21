"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import H2Title from "@/app/components/common/H2Title";
import Image from "next/image";
// import { assets } from "@/app/assets";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const DivisionExpertise = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const targetRef = useRef(null);
    const MotionImage = motion.create(Image);

    const imageContainerRefTwo = useRef(null);

    useEffect(() => {
        const containerEl = containerRef.current;
        const targetEl = targetRef.current;

        if (!containerEl || !targetEl) return;

        const updateMargin = () => {
            if (window.innerWidth > 768) {
                const computedStyle = window.getComputedStyle(containerEl);
                const margin = computedStyle.marginLeft;

                if (isArabic) {
                    targetEl.style.marginRight = margin;
                    targetEl.style.marginLeft = "0px";
                } else {
                    targetEl.style.marginLeft = margin;
                    targetEl.style.marginRight = "0px";
                }
            } else {
                // Reset for mobile
                targetEl.style.marginLeft = "0px";
                targetEl.style.marginRight = "0px";
            }
        };

        updateMargin();
        window.addEventListener("resize", updateMargin);

        return () => window.removeEventListener("resize", updateMargin);
    }, [isArabic]);

    return (
        <section className="pt-text30 pb30 relative  overflow-hidden">
            <div className="xl:px-[15px] md:pe-0 relative">
                {/* Counter + Arrows */}
                <div className="container flex items-center justify-between mb-[50px]" ref={containerRef}>
                    <H2Title titleText={t.title} titleColor="black" marginClass="mb-0px" />

                    <div className="flex gap-3 ">
                        <button
                            className="custom-prev-division w-10 h-10 xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <Image
                                src="/assets/images/project-details/rightarrow.svg"
                                className={`w-[16px] h-[16px]  ${
                                    isArabic ? "" : "rotate-180"
                                } group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                alt=""
                                width={14}
                                height={14}
                            />
                        </button>
                        <button
                            className="custom-next-division w-10 h-10 xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <Image
                                src="/assets/images/project-details/rightarrow.svg"
                                className={`w-[16px] h-[16px] ${
                                    isArabic ? "rotate-180" : ""
                                } group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                alt=""
                                width={14}
                                height={14}
                            />
                        </button>
                    </div>
                </div>
                {/* Swiper */}
                <div className="flex flex-col md:flex-row gap-3 md:pe-0">
                    <div className="container">
                        <Swiper
                            dir={isArabic ? "rtl" : "ltr"}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            ref={swiperRef}
                            modules={[EffectFade, Autoplay, Navigation]}
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={true}
                            loopedSlides={6}
                            centeredSlides={false}
                            navigation={{
                                prevEl: ".custom-prev-division",
                                nextEl: ".custom-next-division",
                            }}
                            // onSlideChange={(swiper) =>
                            //   setCurrentSlide((swiper.realIndex % engineeringData.featuredProjectsData.items.length) + 1)
                            // }
                            speed={800}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                300: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                600: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 40,
                                },
                                1200: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                                1400: {
                                    slidesPerView: 3.2,
                                    spaceBetween: 40,
                                },
                            }}
                            className="md:!overflow-visible h-full"
                        >
                            {t.items.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <div className="overflow-hidden  h-full">
                                        <div className="relative overflow-hidden" ref={imageContainerRefTwo}>
                                            <MotionImage
                                                width={500}
                                                height={400}
                                                variants={moveUp(0.1 * i)}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ amount: 0.2, once: true }}
                                                src={item.image}
                                                alt={item.imageAlt}
                                                className="w-full h-[200px] md:h-[250px] 2xl:h-[333px] scale-y-110 object-cover"
                                            />
                                        </div>
                                        <div
                                            className={`h-full pt-3 lg:pt-8 lg:pb-8 2xl:pt-10 2xl:pb-12 ${
                                                isArabic
                                                    ? "md:border-r md:pr-4 lg:pr-8 2xl:pr-10"
                                                    : "md:border-l md:pl-4 lg:pl-8 2xl:pl-10"
                                            } border-black/20`}
                                        >
                                            <div>
                                                <h3
                                                    className={`text-20 2xl:text-29 leading-[1.344827586206897] font-light mb-1 md:mb-3 ${
                                                        isArabic ? "text-right" : "text-left"
                                                    }`}
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p
                                                className={`text-14 xl:text-19 font-extralight font-paragraph leading-[1.5] ${
                                                    isArabic ? "text-right" : "text-left"
                                                }`}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DivisionExpertise;
