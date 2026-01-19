"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Controller } from "swiper/modules";
import { assets } from "../../../../assets/index";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import { highlightedData } from '../data';
import H2Title from "../../../common/H2Title";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const HighlightedProgramsSlider = ({ data }) => {
    const MotionImage = motion.create(Image);
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageSwiper, setImageSwiper] = useState(null);
    const [contentSwiper, setContentSwiper] = useState(null);
    const imageContainerRef = useRef(null);
    const sectionRef = useRef(null);

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], imageOffset);
    // Parallax for shape
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);

    return (
        <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div className="absolute bottom-0 right-0 w-[150px] h-[525px] lg:w-[519px] lg:h-[725px]">
                <MotionImage width={519} height={725} style={{ y: shapeY }} src={assets.mainShape} alt="" />
            </div>
            <div className="container">
                {/* Header */}

                <H2Title titleText={data.title} titleColor="white" marginClass="mb-5 lg:mb-6 2xl:mb-50px" />

                {/* Swiper Slider */}
                <div className="relative">
                    <div className="flex flex-col lg:flex-row gap-6 xl:gap-16 2xl:gap-[80px] lg:items-center">
                        {/* Image Section - Swiper */}
                        <div className="order-2 lg:order-1 lg:w-[50%] 2xl:w-[57.3%]">
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
                                        <div className="relative overflow-hidden shadow-2xl" ref={imageContainerRef}>
                                            <MotionImage
                                                height={576}
                                                width={1920}
                                                style={{ y: imageY }}
                                                src={item.image}
                                                alt={item.imageAlt}
                                                className="w-full h-[300px] xl:h-[576px]  object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Content Section - Static with Navigation */}
                        <div className="order-1 lg:order-2   lg:w-[45%] 2xl:w-[37.5%]">
                            {/* Navigation - Fixed */}
                            <motion.div
                                variants={moveUp(0.6)}
                                initial="hidden"
                                whileInView={"show"}
                                viewport={{ amount: 0.2, once: false }}
                                className="flex items-center gap-4   border-b border-white/20 pb-4 2xl:pb-[30px] lg:pb-6 mb-4 xl:mb-50px 3xl:mb-17"
                            >
                                <button
                                    onClick={() => imageSwiper?.slidePrev()}
                                    className="group hover:-translate-x-1 transition-all duration-300  cursor-pointer w-10 h-10 xl:w-[50px] xl:h-[50px]  rounded-full border border-white/20 flex items-center justify-center  "
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
                                    className="group hover:translate-x-1 transition-all duration-300 cursor-pointer w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center  "
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
                                <span className="text-19 leading-[1.473684210526316] ml-2">
                                    {String(currentSlide + 1).padStart(2, "0")}/{String(data.items.length).padStart(2, "0")}
                                </span>
                            </motion.div>

                            {/* Dynamic Content - Swiper */}
                            <Swiper
                                modules={[Autoplay, Controller]}
                                spaceBetween={50}
                                slidesPerView={1}
                                speed={700}
                                autoplay={{
                                    delay: 7000,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                controller={{ control: imageSwiper }}
                                onSwiper={setContentSwiper}
                                allowTouchMove={false}
                                className="content-swiper w-full"
                            >
                                {data.items.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <motion.div
                                            variants={moveUp(0.7 + 0.1 * index)}
                                            initial="hidden"
                                            whileInView={"show"}
                                            viewport={{ amount: 0.2, once: false }}
                                        >
                                            <h3 className="text-29 leading-[1.344827586206897] font-light mb-3 md:mb-6">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/80 text-19 leading-[1.473684210526316] font-light xl:mb-8">
                                                {item.description}
                                            </p>
                                            {/* Services */}
                                        </motion.div>
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

export default HighlightedProgramsSlider;
