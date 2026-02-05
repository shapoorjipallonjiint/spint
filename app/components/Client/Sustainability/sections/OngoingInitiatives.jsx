"use client";

import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../common/H2Title";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";


const OngoingInitiatives = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    // const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    // const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const targetRef = useRef(null);

    const imageContainerRefTwo = useRef(null);

    // let imageY;

    // if (!isMobile) {
    //   const { scrollYProgress: imageProgress } = useScroll({
    //     target: imageContainerRefTwo,
    //     offset: ["start end", "end start"]
    //   });

    //   imageY = useTransform(imageProgress, [0, 1], imageOffset);
    // } else {
    //   // fallback for mobile — no movement
    //   imageY = useMotionValue(0);
    // }

    useEffect(() => {
        const containerEl = containerRef.current;
        const targetEl = targetRef.current;

        if (!containerEl || !targetEl) return;

        const updateMargin = () => {
            if (window.innerWidth > 768) {
                // Only apply margin-left on screens wider than 768px
                const computedStyle = window.getComputedStyle(containerEl);
                const marginLeft = computedStyle.marginLeft;
                targetEl.style.marginLeft = marginLeft;
            } else {
                // Reset for mobile
                targetEl.style.marginLeft = "0px";
            }
        };

        // Initial call
        updateMargin();

        // Watch for resize
        window.addEventListener("resize", updateMargin);
        return () => window.removeEventListener("resize", updateMargin);
    }, []);

    return (
        <section className="pt-text30 relative  overflow-hidden">
            <div className="xl:px-[15px] md:pe-0 relative">
                {/* Counter + Arrows */}
                <div className="container" ref={containerRef}>
                    <H2Title titleText={t.title} titleColor="black" marginClass="mb-4 xl:mb-50px" />
                </div>
                {/* Swiper */}
                <div className={`flex flex-col md:flex-row gap-3 ${isArabic ? "md:pe-0" : "md:ps-0"}`}>
                    <div className="container">
                        <div className="border-b border-cmnbdr pb30">
                            <Swiper
                                ref={swiperRef}
                                modules={[EffectFade, Autoplay, Navigation]}
                                spaceBetween={0}
                                slidesPerView={1}
                                loop={true}
                                // loopedSlides={6}
                                centeredSlides={false}
                                navigation={{
                                    prevEl: ".custom-prev",
                                    nextEl: ".custom-next",
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
                                className="md:!overflow-visible h-full "
                            >
                                {[...t.items, ...t.items].map((item, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="overflow-hidden  h-full">
                                            <div className="relative overflow-hidden" ref={imageContainerRefTwo}>
                                                <motion.img
                                                    variants={moveUp(0.4 + 0.1 * i)}
                                                    initial="hidden"
                                                    whileInView="show"
                                                    viewport={{ amount: 0.2, once: true }}
                                                    src={item.image}
                                                    alt={`slide-${i}`}
                                                    className="w-full h-[200px] md:h-[250px] 2xl:h-[333px] scale-y-110 object-cover"
                                                />
                                            </div>
                                            <div
                                                className={`pt-3 lg:pt-8 lg:pb-8 2xl:pt-10 2xl:pb-12 border-black/20
    ${isArabic
                                                        ? "md:pr-4 lg:pr-8 2xl:pr-10 md:border-r"
                                                        : "md:pl-4 lg:pl-8 2xl:pl-10 md:border-l"
                                                    }
  `}
                                            >

                                                <motion.div
                                                    variants={moveUp(0.6 + 0.1 * i)}
                                                    initial="hidden"
                                                    whileInView="show"
                                                    viewport={{ amount: 0.2, once: true }}
                                                >
                                                    <h3 className="text-20 2xl:text-29 leading-[1.344827586206897] font-light mb-1 md:mb-2">
                                                        {item.title}
                                                    </h3>
                                                </motion.div>
                                                {/* <motion.p variants={moveUp(0.8 + 0.1 * i)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-14 xl:text-19 font-light font-paragraph leading-[1.5]">{item.description}</motion.p> */}
                                                <motion.div
                                                    variants={moveUp(0.8 + 0.1 * i)}
                                                    initial="hidden"
                                                    whileInView="show"
                                                    viewport={{ amount: 0.2, once: true }}
                                                    className="text-14 xl:text-19 font-light font-paragraph leading-[1.5]"
                                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                                />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OngoingInitiatives;
