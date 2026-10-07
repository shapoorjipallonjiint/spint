"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation,Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { assets } from "../../../../assets/index";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../common/H2Title";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useContainerInset } from "@/hooks/useContainerInset";

const EmployeeInvolvementSlider = ({ data }) => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);
    const swiperRef = useRef(null);
    const containerRef = useRef(null);
    const targetRef = useRef(null);
    const [imageSwiper, setImageSwiper] = useState(null);
    const [contentSwiper, setContentSwiper] = useState(null);
    const sliderContainerRef = useRef(null);
    // both true when every slide fits in view (Swiper locks), so the arrows have nothing to do
    const [navState, setNavState] = useState({ isBeginning: true, isEnd: true });
    const updateNavState = (swiper) => setNavState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
    // container margin + padding: width of the mask that hides slides in the start-side margin
    const containerInset = useContainerInset(sliderContainerRef);

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
        <section className="section-spacing relative bg-f5f5 overflow-hidden">
            <div className={`px-[15px] ${isArabic ? "md:ps-0" : "md:pe-0"} relative`}>
                {/* Counter + Arrows */}
                <div className="container" ref={containerRef}>
                         <div className="flex justify-between items-center mb-4 md:mb-6 2xl:mb-50px"> 
                                <H2Title titleText={t.title} titleColor="black" marginClass="" /> 
                                <div className="order-1 lg:order-2   ">
                                    {/* Navigation - Fixed */}
                                    <motion.div
                                        variants={moveUp(0.6)}
                                        initial="hidden"
                                        whileInView={"show"}
                                        viewport={{ amount: 0.2, once: true }}
                                        className="flex justify-end items-center gap-4   border-b border-white/20  "
                                    >
                                        <button
                                            onClick={() => imageSwiper?.slidePrev()}
                                            disabled={navState.isBeginning}
                                            className={`group ${isArabic ? "rotate-180" : ""} ${navState.isBeginning ? "opacity-30 cursor-not-allowed" : `cursor-pointer ${isArabic ? "hover:translate-x-1" : "hover:-translate-x-1"}`} transition-all duration-300 w-10 h-10 xl:w-[50px] xl:h-[50px]  rounded-full border border-black/20 flex items-center justify-center`}
                                            aria-label="Previous slide"
                                        >
                                            <Image
                                                src={assets.arrowLeft2}
                                                alt=""
                                                width={14}
                                                height={14}
                                                className="w-[16px] h-[16px] group-hover:opacity-90  duration-300  transition-all delay-200"
                                            />
                                        </button>
                                        <button
                                            onClick={() => imageSwiper?.slideNext()}
                                            disabled={navState.isEnd}
                                            className={`group ${isArabic ? "-rotate-180" : ""} ${navState.isEnd ? "opacity-30 cursor-not-allowed" : `cursor-pointer ${isArabic ? "hover:-translate-x-1" : "hover:translate-x-1"}`} transition-all duration-300 w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-black/20 flex items-center justify-center`}
                                            aria-label="Next slide"
                                        >
                                            <Image
                                                src={assets.arrowRight2}
                                                alt=""
                                                width={14}
                                                height={14}
                                                className="w-[16px] h-[16px] group-hover:opacity-90  duration-300  transition-all delay-200"
                                            />
                                        </button> 
                                    </motion.div> 
                                </div>
                        </div>
                </div>
                {/* Swiper */}
                <div className={`flex flex-col md:flex-row gap-3  ${isArabic ? "md:ps-0" : "md:pe-0"}`}>
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
                            modules={[EffectFade, Autoplay, Navigation,Controller]}
                            spaceBetween={5}
                            slidesPerView={1}
                            // loop={true}
                            loopedSlides={6}
                            grabCursor={true}
                            centeredSlides={false}
                            // navigation={{
                            //     prevEl: ".custom-prev",
                            //     nextEl: ".custom-next",
                            // }}
                             onSlideChange={(swiper) => {
                                    setCurrentSlide(swiper.realIndex);
                                    updateNavState(swiper);
                                }}
                            onResize={updateNavState}
                            onBreakpoint={updateNavState}

                                controller={{ control: contentSwiper }}
                            onSwiper={(swiper) => {
                                setImageSwiper(swiper);
                                updateNavState(swiper);
                            }}
                            speed={800}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                1224: {
                                    slidesPerView: 3,
                                    spaceBetween: 10,
                                },
                            }}
                            className="!overflow-visible"
                        >
                            {t.items.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <div className="overflow-hidden ">
                                        <div className="after:h-full after:w-full  after:bg-[linear-gradient(180deg,rgba(0,0,0,0)_42.43%,rgba(0,0,0,0.75)_91.64%)] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0">
                                            {/* <MotionImage
                                                height={900}
                                                width={1000}
                                                variants={moveUp(0.1 * i)}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ amount: 0.2, once: true }}
                                                src={item.image}
                                                alt={item.imageAlt}
                                                className="w-full h-[300px] md:h-[350px] lg:h-[400px] 2xl:h-auto object-cover"
                                            /> */}
                                             <Image
                                                height={900}
                                                width={1000} 
                                                src={item.image}
                                                alt={item.imageAlt}
                                                className="w-full h-[300px] md:h-[350px] lg:h-[400px] 2xl:h-auto object-cover"
                                            />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 px-5 lg:px-8 3xl:px-12">
                                            <div className=" pb-5 lg:pb-8 3xl:pb-[42px]">
                                                <p className="text-19  mb-2 3xl:mb-[18px] leading-[1.344827586206897] font-light text-white">
                                                    {item.date}
                                                </p>
                                                <h3 className="text-[20px] md:text-29 leading-[1.1] 2xl:leading-[1.2] 3xl:leading-[1.344827586206897] font-light text-white">
                                                    {item.title}
                                                </h3>
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

export default EmployeeInvolvementSlider;
