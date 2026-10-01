"use client";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { moveUp, moveLeft, moveRight } from "@/app/components/motionVarients";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Controller } from "swiper/modules";
import { assets } from "@/app/assets/index";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import H2Title from "@/app/components/common/H2Title";
import { engineeringData } from "../data";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

gsap.registerPlugin(ScrollTrigger);

// Created once, outside the component (creating it inside re-creates the component every render)
const MotionImage = motion.create(Image);

// Owns its ref + useScroll, so the target is always mounted when the hook runs
const ParallaxImage = ({ src, alt }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [-150, 150]);

    return (
        <div className="relative overflow-hidden shadow-2xl" ref={ref}>
            <MotionImage
                width={900}
                height={700}
                style={{ y }}
                src={src}
                alt={alt}
                className="w-full h-[350px] lg:h-[500px] xl:h-[600px] 3xl:h-[625px]  object-cover"
            />
        </div>
    );
};

// Tailwind `lg` = 1024px. Below this we show the accordion.
const DESKTOP_QUERY = "(min-width: 1024px)";

const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(null); // null until mounted (avoids hydration mismatch)

    useEffect(() => {
        const mql = window.matchMedia(DESKTOP_QUERY);
        const update = () => setIsDesktop(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    return isDesktop;
};

const ExpertiseSec = ({ data }) => {
    const { expertiseData } = engineeringData;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageSwiper, setImageSwiper] = useState(null);
    const [contentSwiper, setContentSwiper] = useState(null);
    const [openIndex, setOpenIndex] = useState(0); // accordion: first item open by default
    const sectionRef = useRef(null);
    const headerRefs = useRef([]);
    const isArabic = useIsPreferredLanguageArabic();
    const isDesktop = useIsDesktop();
    const t = useApplyLang(data);

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

    // Parallax for shape
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    const toggleAccordion = (index) => {
        const willOpen = openIndex !== index;
        setOpenIndex(willOpen ? index : null);

        // The previously open panel collapses above the clicked header and shifts the page,
        // so bring the clicked header back into view once the animation is done.
        if (willOpen) {
            setTimeout(() => {
                headerRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 380);
        }
    };

    return (
        <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
            <div
                className={`hidden md:block absolute bottom-0 ${isArabic ? "left-0 -scale-x-100" : "right-0"
                    } w-[280px]  lg:w-[519px]  md:w-[350px] md:h-[500px]  2xl:w-[519px] h-[525px] lg:h-[725px]`}
            >
                <MotionImage width={1500} height={1000} style={{ y: shapeY }} src={assets.mainShape} alt="" />
            </div>
            <div className="container">
                {/* Header */}
                <div className="mb-6 lg:mb-50px">
                    <H2Title titleText={t.title} titleColor="white" marginClass="mb-4 xl:mb-5" />
                    <motion.p
                        variants={moveUp(0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="text-19 leading-[1.473684210526316] font-light max-w-[85ch] pb-2 sm:pb-0"
                    >
                        {t.subTitle}
                    </motion.p>
                </div>

                {/* ============ TABLET & BELOW: ACCORDION ============ */}
                {isDesktop === false && (
                    <div className="relative z-10 border-t border-white/30" dir={isArabic ? "rtl" : "ltr"}>
                        {t.items.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className="border-b border-white/30">
                                    <button
                                        type="button"
                                        ref={(el) => (headerRefs.current[index] = el)}
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={isOpen}
                                        aria-controls={`expertise-panel-${index}`}
                                        id={`expertise-header-${index}`}
                                        className="w-full flex items-center gap-4 py-5 scroll-mt-4 text-start"
                                    >
                                        {/* <span className="text-19 font-bold shrink-0">
                                            {String(index + 1).padStart(2, "0")}
                                        </span> */}
                                        <span className="flex-1 text-[20px] md:text-[25px] leading-[1.3] font-light">
                                            {item.title}
                                        </span>
                                        {/* Plus / minus icon */}
                                        <span className="relative w-8 h-8 shrink-0 rounded-full border border-white/30 flex items-center justify-center">
                                            <span className="absolute w-[12px] h-[2px] bg-white" />
                                            <span
                                                className={`absolute w-[2px] h-[12px] bg-white transition-transform duration-300 ${isOpen ? "scale-y-0" : "scale-y-100"
                                                    }`}
                                            />
                                        </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                id={`expertise-panel-${index}`}
                                                role="region"
                                                aria-labelledby={`expertise-header-${index}`}
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-8">
                                                    <div className="relative overflow-hidden shadow-2xl mb-6">
                                                        <Image
                                                            width={900}
                                                            height={700}
                                                            src={data.items[index].image}
                                                            alt={data.items[index].imageAlt}
                                                            className="w-full h-[240px] sm:h-[320px] md:h-[400px] object-cover"
                                                        />
                                                    </div>

                                                    <p className="text-white text-19 leading-[1.473684210526316] font-light mb-6">
                                                        {item.subTitle}
                                                    </p>

                                                    <p className="text-white text-[22px] md:text-[25px] leading-[1.473684210526316] font-light mb-4">
                                                        Key Services
                                                    </p>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                                        className="our-expertise-item-desc text-white"
                                                        dir={isArabic ? "rtl" : "ltr"}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ============ DESKTOP (lg+): SWIPER LAYOUT ============ */}
                {isDesktop === true && (
                    <div className="relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 3xl:gap-[30px]">
                            {/* Image Section - Swiper */}
                            <motion.div
                                variants={moveRight(0.4)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                            >
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay, Controller]}
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    speed={700}
                                    autoplay={{
                                        delay: 7000,
                                        disableOnInteraction: false,
                                    }}
                                    loop={true}
                                    controller={{ control: contentSwiper }}
                                    onSwiper={setImageSwiper}
                                    onSlideChange={(swiper) => {
                                        setCurrentSlide(swiper.realIndex);
                                    }}
                                    className="expertise-swiper"
                                >
                                    {data.items.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <ParallaxImage src={item.image} alt={item.imageAlt} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </motion.div>

                            {/* Content Section - Static with Navigation */}
                            <motion.div
                                variants={moveLeft(0.6)}
                                initial="hidden"
                                whileInView="show"
                                className={`${isArabic ? "3xl:mr-[40px]" : "3xl:ml-[40px]"}`}
                                viewport={{ amount: 0.2, once: true }}
                            >
                                {/* Navigation - Fixed */}
                                <div className="flex items-center gap-4 xl:gap-[50px] mb-5 xl:mb-[50px] border-b border-white/30 pt-5 lg:pt-5 xl:pt-10 3xl:pt-[64px] pb-4 xl:pb-[30px]">
                                    <div className="flex items-center gap-[12px]">
                                        <button onClick={() => imageSwiper?.slidePrev()}
                                            className="w-10 h-10 xl:w-50px xl:h-50px  rounded-full border border-white/20 flex items-center justify-center transition-colors"
                                            aria-label="Previous slide"
                                        >
                                            <Image width={20} height={20} src={assets.arrowLeft2} alt="" className="w-[14px] h-[14px]" />
                                        </button>
                                        <button
                                            onClick={() => imageSwiper?.slideNext()}
                                            className="w-10 h-10 xl:w-50px xl:h-50px rounded-full border border-white/20 flex items-center justify-center transition-colors"
                                            aria-label="Next slide"
                                        >
                                            <Image width={20} height={20} src={assets.arrowRight2} alt="" className="w-[14px] h-[14px]" />
                                        </button>
                                    </div>
                                    <span className="text-19 leading-[1.473684210526316]">
                                        <span className="font-bold "> {String(currentSlide + 1).padStart(2, "0")}</span>/
                                        {String(expertiseData.items.length).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Dynamic Content - Swiper */}
                                <Swiper
                                    modules={[Autoplay, Controller]}
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    speed={700}
                                    autoplay={false}
                                    loop={true}
                                    onSwiper={setContentSwiper}
                                    allowTouchMove={false}
                                    className="content-swiper"
                                >
                                    {t.items.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div>
                                                <h3 className="text-[22px] md:text-[25px] lg:text-29 leading-[1.344827586206897] font-light mb-4  xl:mb-5">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white text-19 leading-[1.473684210526316] font-light mb-8 2xl:mb-[45px]">
                                                    {item.subTitle}
                                                </p>

                                                {/* Services */}
                                                <p className="text-white text-[22px] md:text-[25px] lg:text-29 leading-[1.473684210526316] font-light mb-5">
                                                    Key Services
                                                </p>
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                                    className="our-expertise-item-desc text-white "
                                                    dir={isArabic ? "rtl" : "ltr"}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExpertiseSec;