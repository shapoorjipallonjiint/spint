"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion, useInView } from "framer-motion";
import { moveLeft, moveUp } from "@/app/components/motionVarients";
import "./featuredProjectSlider.css";
import H2Title from "./H2Title";
import Image from "next/image";
import Link from "next/link";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";


const FeaturedProjectSlider = ({ data }) => {
    const t = useApplyLang(data)
    const isArabic = useIsPreferredLanguageArabic();
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const targetRef = useRef(null);

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

    useEffect(() => {
        const containerEl = containerRef.current;
        const targetEl = targetRef.current;

        if (!containerEl || !targetEl) return;

        const updateMargin = () => {
            if (window.innerWidth > 768) {
                const computedStyle = window.getComputedStyle(containerEl);
                const marginLeft = computedStyle.marginLeft;
                targetEl.style.marginLeft = marginLeft;
            } else {
                targetEl.style.marginLeft = "0px";
            }
        };

        updateMargin();
        window.addEventListener("resize", updateMargin);
        return () => window.removeEventListener("resize", updateMargin);
    }, []);

    return (
        <section className="pt-text90 pb25 relative bg-f5f5 overflow-hidden" ref={sectionRef}>
            <div className="xl:px-[15px] md:pe-0 relative">
                <div className="container" ref={containerRef}>
                    <div className="flex justify-between items-center mb-4 lg:mb-6 xl:mb-8 3xl:mb-17 gap-2">
                        <H2Title titleText="Featured Projects" titleColor="black" marginClass="mb-0" />
                        <motion.div
                            variants={moveUp(0.5)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="flex gap-2 2xl:gap-5 "
                        >
                            <button className="custom-prev  w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20   hover:bg-secondary hover:text-white transition">
                                <Image
                                    src="/assets/images/project-details/rightarrow.svg"
                                    className={`w-[16px] h-[16px] ${isArabic ? "" : "rotate-180"} group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                    alt=""
                                    width={14}
                                    height={14}
                                />
                            </button>
                            <button className="custom-next w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20   hover:bg-secondary hover:text-white transition">
                                <Image
                                    src="/assets/images/project-details/rightarrow.svg"
                                    className={`w-[16px] h-[16px] ${isArabic ? "rotate-180" : ""} group-hover:brightness-0 group-hover:invert-100 transition-all duration-300`}
                                    alt=""
                                    width={14}
                                    height={14}
                                />
                            </button>
                        </motion.div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 xl:px-[15px] md:pe-0">
                    <div className="container">
                        <Swiper
                            ref={swiperRef}
                            modules={[EffectFade, Autoplay, Navigation]}
                            spaceBetween={40}
                            slidesPerView={1}
                            loop={true}
                            centeredSlides={false}
                            loopAdditionalSlides={1}
                            watchSlidesProgress={true}
                            navigation={{
                                prevEl: ".custom-prev",
                                nextEl: ".custom-next",
                            }}
                            onSlideChange={handleSlideChange}
                            speed={1200}
                            // autoplay={{
                            //   delay: 4000,
                            //   disableOnInteraction: false,
                            //   waitForTransition: true,
                            // }}
                            breakpoints={{
                                600: {
                                    slidesPerView: 1,
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
                                    <div>
                                        <Link href={`/projects/${item.slug}`}>
                                            <div className="overflow-hidden">
                                                <Image
                                                    width={700}
                                                    height={500}
                                                    src={item.thumbnail}
                                                    className={`w-full h-[230px] md:h-[300px] lg:h-[350px] 2xl:h-[400px] 3xl:h-[520px] object-cover ${
                                                        !hasScrolledIntoView
                                                            ? "initial-hidden-img"
                                                            : animatingSlide === i || initialAnimating
                                                            ? "animate-slide-img"
                                                            : "initial-visible"
                                                    }`}
                                                    alt={item.thumbnailAlt}
                                                />
                                            </div>
                                        </Link>
                                        <div>
                                            <div className="border-b border-cmnbdr pt-5 3xl:pt-7 pb-5 xl:pb-7">
                                                <div className="overflow-hidden">
                                                    <Link href={`/projects/${item.slug}`}>
                                                        <h3
                                                            className={`text-24 xl:text-29 leading-[1.344827586206897] font-light ${
                                                                !hasScrolledIntoView
                                                                    ? "initial-hidden-text"
                                                                    : animatingSlide === i || initialAnimating
                                                                    ? "animate-slide-text-1"
                                                                    : "initial-visible"
                                                            }`}
                                                        >
                                                            {item.firstSection?.title}
                                                        </h3>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="border-b border-cmnbdr grid lg:grid-cols-2 2xl:grid-cols-[413px_1fr] items-center py-[2px]">
                                                <div className="border-b border-cmnbdr lg:border-0">
                                                    <div className="overflow-hidden">
                                                        <h4
                                                            className={`text-19 leading-[2.052631578947368] font-light text-paragraph ${
                                                                !hasScrolledIntoView
                                                                    ? "initial-hidden-text"
                                                                    : animatingSlide === i || initialAnimating
                                                                    ? "animate-slide-text-2"
                                                                    : "initial-visible"
                                                            }`}
                                                        >
                                                            <span>Sector: </span>
                                                            {item.secondSection?.sector?.name}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="overflow-hidden">
                                                        <h4
                                                            className={`text-19 leading-[2.052631578947368] font-light text-paragraph ${
                                                                !hasScrolledIntoView
                                                                    ? "initial-hidden-text"
                                                                    : animatingSlide === i || initialAnimating
                                                                    ? "animate-slide-text-3"
                                                                    : "initial-visible"
                                                            }`}
                                                        >
                                                            <span>BUA (Sq.ft): </span>
                                                            {item.secondSection.items.find((i) => i.key === "BUA (Sq.ft)")
                                                                ?.value ?? ""}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-b border-cmnbdr py-1">
                                                <div className="overflow-hidden">
                                                    <h4
                                                        className={`text-19 leading-[2.052631578947368] font-light text-paragraph ${
                                                            !hasScrolledIntoView
                                                                ? "initial-hidden-text"
                                                                : animatingSlide === i || initialAnimating
                                                                ? "animate-slide-text-3"
                                                                : "initial-visible"
                                                        }`}
                                                    >
                                                        <span>Location: </span>
                                                        {item.secondSection.location?.name}
                                                    </h4>
                                                </div>
                                            </div>
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

export default FeaturedProjectSlider;
