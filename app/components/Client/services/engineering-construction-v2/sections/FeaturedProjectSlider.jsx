"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion, useInView } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import "./featuredProjectSlider.css";
import H2Title from "@/app/components/common/H2Title";
import Image from "next/image";
import LangLink from '@/lib/LangLink'
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useContainerInset } from "@/hooks/useContainerInset";

const FeaturedProjectSlider = ({ data = [] }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const swiperRef = useRef(null);
    const sliderContainerRef = useRef(null);
    // container margin + padding: width of the mask that hides slides in the start-side margin
    const containerInset = useContainerInset(sliderContainerRef);

    const [animatingSlide, setAnimatingSlide] = useState(null);
    const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
    const [initialAnimating, setInitialAnimating] = useState(false);

    const sectionRef = useRef(null);
    const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });

    useEffect(() => {
        if (sectionInView && !hasScrolledIntoView) {
            setHasScrolledIntoView(true);
            setInitialAnimating(true);
            // Stop initial animation after it completes
            setTimeout(() => setInitialAnimating(false), 1200);
        }
    }, [sectionInView, hasScrolledIntoView]);

    const handleSlideChange = (swiper) => {
        const activeIndex = swiper.realIndex;
        const slidesPerView = window.innerWidth >= 768 ? 2 : 1;

        let slideToAnimate;
        if (slidesPerView === 2) {
            // On 2-slide view: animate the slide next to active
            slideToAnimate = (activeIndex + 1) % t.length;
        } else {
            // On 1-slide view: animate the active slide
            slideToAnimate = activeIndex;
        }

        setAnimatingSlide(slideToAnimate);
        setTimeout(() => setAnimatingSlide(null), 1200);
    };

    const hasValidImage = (src) => typeof src === "string" && src?.trim().length > 0;

    return (
        <section className="py-80px relative bg-f5f5 overflow-hidden" ref={sectionRef} >
            <div className="xl:px-[15px] md:pe-0 relative">
                <div className="container">

                    <div className="flex justify-between items-center mb-50px gap-2">
                        <H2Title titleText="Featured Projects" titleColor="black" marginClass="mb-0" />
                        <motion.div variants={moveUp(0.5)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="flex gap-2 2xl:gap-5" >
                            <button className="custom-prev w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition">
                                <Image src="/assets/images/project-details/rightarrow.svg"
                                    className={`w-[16px] h-[16px] ${isArabic ? "" : "rotate-180" } group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                    alt="" width={14} height={14} />
                            </button>

                            <button className="custom-next w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition">
                                <Image src="/assets/images/project-details/rightarrow.svg" className={`w-[16px] h-[16px] ${isArabic ? "rotate-180" : "" } group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`} alt="" width={14} height={14} />
                            </button>
                        </motion.div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 xl:px-[15px] md:pe-0">
                    <div className="container relative" ref={sliderContainerRef}>
                        {/* slides overflow on both sides; this covers the start-side margin (up to the container's content edge) */}
                        <div
                            aria-hidden="true"
                            className={`absolute top-0 bottom-0 z-10 bg-f5f5 pointer-events-none ${
                                isArabic ? "left-[calc(100%-15px)]" : "right-[calc(100%-15px)]"
                            }`}
                            style={{ width: isArabic ? containerInset.right : containerInset.left }}
                        />

                        <Swiper
                            ref={swiperRef}
                            modules={[EffectFade, Autoplay, Navigation]}
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={true}
                            centeredSlides={false}
                            watchSlidesProgress={true}
                            navigation={{
                                prevEl: ".custom-prev",
                                nextEl: ".custom-next",
                            }}
                            onSlideChange={handleSlideChange}
                            speed={1200}
                            allowTouchMove={false}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                waitForTransition: true,
                            }}
                            breakpoints={{
                                600: {
                                    slidesPerView: 1.2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    spaceBetween: 40,
                                },
                            }}
                            className="!overflow-visible"
                        >

                            {t.map((item, i) => (
                                <SwiperSlide key={i}>
                                    {/* card links to the project page when the item has a slug */}
                                    <LangLink href={item.slug ? `/projects/${item.slug}` : "#"} className={item.slug ? "block" : "block pointer-events-none"}>
                                    {/* Outer card: clips the animation */}
                                    <div className="relative overflow-hidden">

                                        {/* Animated wrapper: image + overlay move together */}
                                        <div
                                            className={`relative ${!hasScrolledIntoView
                                                    ? "initial-hidden-img"
                                                    : animatingSlide === i || initialAnimating
                                                        ? "animate-slide-img"
                                                        : "initial-visible"
                                                }`}
                                        >
                                            {hasValidImage(item.image) ? (
                                                <Image
                                                    width={700}
                                                    height={500}
                                                    src={item.image}
                                                    alt={item.imageAlt || item.title || "Project image"}
                                                    className="w-full h-[230px] md:h-[300px] lg:h-[350px] 2xl:h-[400px] 3xl:h-[520px] object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-[230px] md:h-[300px] lg:h-[350px] 2xl:h-[400px] 3xl:h-[520px] bg-primary flex items-center justify-center text-white">
                                                    <span className="text-29 font-medium"> 700 × 500 </span>
                                                </div>
                                            )}

                                            {/* Gradient overlay now moves with the image */}
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    background:
                                                        "linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%)",
                                                }}
                                            />
                                        </div>

                                        {/* Title: keeps its own text animation, sits above the wrapper */}
                                        <div className="absolute bottom-0 start-0 w-full p-40px">
                                            <div className="overflow-hidden">
                                                <h3
                                                    className={`text-white text-29 leading-[1.344827586206897] font-light ${!hasScrolledIntoView
                                                            ? "initial-hidden-text"
                                                            : animatingSlide === i || initialAnimating
                                                                ? "animate-slide-text-1"
                                                                : "initial-visible"
                                                        }`}
                                                    style={
                                                        animatingSlide === i || initialAnimating
                                                            ? { animationDelay: "0.6s", animationFillMode: "both" }
                                                            : undefined
                                                    }
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    </LangLink>
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjectSlider;