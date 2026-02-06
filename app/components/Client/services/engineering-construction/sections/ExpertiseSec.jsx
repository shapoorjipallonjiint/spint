"use client";
import { motion, useScroll, useTransform } from "framer-motion";
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

const ExpertiseSec = ({ data }) => {
    const { expertiseData } = engineeringData;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageSwiper, setImageSwiper] = useState(null);
    const [contentSwiper, setContentSwiper] = useState(null);
    const sectionRef = useRef(null);
    const imageParRef = useRef(null);
    const isArabic = useIsPreferredLanguageArabic();
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

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageParRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], [-150, 150]);
    const MotionImage = motion.create(Image);

    return (
        <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
            <div
                className={`hidden md:block absolute bottom-0 ${
                    isArabic ? "left-0 -scale-x-100" : "right-0"
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

                {/* Swiper Slider */}
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
                                        <div className="relative overflow-hidden shadow-2xl" ref={imageParRef}>
                                            <MotionImage
                                                width={900}
                                                height={700}
                                                style={{ y: imageY }}
                                                src={item.image}
                                                alt={item.imageAlt}
                                                className="w-full h-[350px] lg:h-[500px] xl:h-[600px] 3xl:h-[625px]  object-cover"
                                            />
                                        </div>
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
                            <div className="flex items-center gap-4 xl:gap-[51px] mb-5 xl:mb-[50px] border-b border-white/30 pt-5 lg:pt-5 xl:pt-10 pb-4 xl:pb-[30px]">
                                <div className="flex items-center gap-[12px]">
                                    <button
                                        onClick={() => imageSwiper?.slidePrev()}
                                        className="w-10 h-10 xl:w-50px xl:h-50px  rounded-full border border-white/20 flex items-center justify-center transition-colors"
                                        aria-label="Previous slide"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            src={assets.arrowLeft2}
                                            alt=""
                                            className="w-[14px] h-[14px]"
                                        />
                                    </button>
                                    <button
                                        onClick={() => imageSwiper?.slideNext()}
                                        className="w-10 h-10 xl:w-50px xl:h-50px rounded-full border border-white/20 flex items-center justify-center transition-colors"
                                        aria-label="Next slide"
                                    >
                                        <Image
                                            width={20}
                                            height={20}
                                            src={assets.arrowRight2}
                                            alt=""
                                            className="w-[14px] h-[14px]"
                                        />
                                    </button>
                                </div>
                                <span className="text-19 leading-[1.473684210526316] ml-2">
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
                                            >
                                                {/* <h4 className="text-29 leading-[1.344827586206897] font-light mb-3 xl:mb-5">
                          {item.subTitle}
                        </h4> */}
                                                {/* <ul className="space-y-2">
                          {item.desc.map((service, idx) => (
                            <li key={idx} className="text-white/80 text-19 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul> */}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSec;
