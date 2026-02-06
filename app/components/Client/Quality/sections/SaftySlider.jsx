"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { moveLeft, moveUp } from "../../../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";
import InsideCounter from "../../../InsideCounter";
import Image from "next/image";
import H2Title from "../../../common/H2Title";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const SaftySlider = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const MotionImage = motion.create(Image);

    const [activeIndex, setActiveIndex] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    const sectionRef = useRef(null);

    /* ---------------- viewport width (SSR safe) ---------------- */
    useEffect(() => {
        const updateWidth = () => setViewportWidth(window.innerWidth);
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    /* ---------------- parallax (unchanged logic) ---------------- */
    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
    const imageY = useTransform(shapeProgress, [0, 1], [-150, 150]);

    /* ---------------- height logic (unchanged) ---------------- */
    const computeHeight = (i, scale = 1) => {
            const diff = Math.abs(activeIndex - i);
        let baseHeight = 455;

        if (diff === 0) baseHeight = 679;
        else if (diff === 1 && i > activeIndex) baseHeight = 536;
        else if (diff === 1 && i < activeIndex) baseHeight = 593;
        else if (diff === 2 && i < activeIndex) baseHeight = 517;
        else if (diff === 2 && i > activeIndex) baseHeight = 455;

        return `${baseHeight * scale}px`;
    };

    const scale =
        viewportWidth >= 1536
            ? 1
            : viewportWidth >= 1280
            ? 0.9
            : viewportWidth >= 1024
            ? 0.8
            : viewportWidth >= 768
            ? 0.7
            : 0.6;

    return (
        <section ref={sectionRef} className="max-w-[1920px] mx-auto overflow-hidden">
            <div className="relative mb-3">
<MotionImage
  style={{ y: shapeY }}
  src="/assets/images/svg/sv-02.svg"
  alt=""
  width={468}
  height={655}
  className={`absolute top-0 lg:bottom-0 2xl:bottom-[-58px] z-[-1]
    w-[150px] h-[355px] lg:w-[468px] lg:h-[655px] 2xl:h-[555px] 3xl:h-[655px]
    ${
      isArabic
        ? "left-0 lg:right-[-150px] 3xl:right-0 -scale-x-100"
        : "right-0 lg:left-[-150px] 3xl:left-0"
    }
  `}
/>


                <div className="container pt-text30">
                    <div className={`max-w-[1206px] 2xl:max-w-[1056px] 3xl:max-w-[1206px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
                        <H2Title titleText={t.title} titleColor="black" marginClass="mb-4 2xl:mb-50px max-w-[15ch]" />

                        <motion.p
                            variants={moveUp(0.2)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="text-19 font-light leading-[1.474] max-w-[59ch] text-paragraph"
                        >
                            {t.description}
                        </motion.p>

                        {/* <motion.div
                            variants={moveLeft(0.2)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 3xl:grid-cols-[406px_300px_auto] p-5 lg:px-12 lg:py-10  2xl:pt-[43px] 2xl:pb-[42px] bg-f5f5 gap-8 md:gap-0"
                        >
                            {data.itemsOne.map((item, index) => (
                                <div key={index} className="last:2xl:w-[90%]">
                                    <motion.p
                                        variants={moveLeft(0.3 * index)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.2, once: true }}
                                        className="text-40 font-light leading-[1.02] text-black mb-3 lg:mb-[18px]"
                                    >
                                        <InsideCounter value={item?.value} delay={100} suffix={index === 2 ? "K" : "+"} />
                                    </motion.p>

                                    <motion.p
                                        variants={moveLeft(0.3 * index)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.2, once: true }}
                                        className="text-19 font-light text-black/70 leading-[1.48] pt-3 lg:pt-[14px] border-t border-[#cccccc] xl:whitespace-nowrap pr-5 lg:pr-[100px] 3xl:pr-[150px]"
                                    >
                                        {item?.key}
                                    </motion.p>
                                </div>
                            ))}
                        </motion.div> */}
                    </div>
                </div>
            </div>

            <div className="w-full bg-white pb30">
                <motion.div
                    variants={moveLeft(0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="overflow-hidden"
                >
                    <Swiper
                        modules={[Autoplay]}
                        centeredSlides
                        loop
                        spaceBetween={15}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        speed={1400}
                        breakpoints={{
                            1536: { slidesPerView: 3.6165 },
                            1280: { slidesPerView: 3.45 },
                            1024: { slidesPerView: 2.2 },
                            768: { slidesPerView: 2.2 },
                            0: { slidesPerView: 1.2 },
                        }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="h-[400px] md:h-[470px] lg:h-[570px] xl:h-[586px] 2xl:h-[611px] 3xl:h-[679px]"
                    >
                        {[...t.itemsTwo, ...t.itemsTwo].map((img, i) => (
                            <SwiperSlide
                                key={i}
                                className="flex justify-center items-center transition-all duration-500 ease-in-out"
                                style={{ width: "520px" }}
                            >
                                <div
                                    className="overflow-hidden relative transition-all duration-500 ease-in-out"
                                    style={{
                                        height: computeHeight(i, scale),
                                        width: "100%",
                                    }}
                                >
                                    <MotionImage
                                        src={img.image}
                                        alt={img.imageAlt}
                                        width={900}
                                        height={600}
                                        style={{ y: imageY }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default SaftySlider;
