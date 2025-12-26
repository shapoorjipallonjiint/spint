"use client";

import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { moveLeft } from "../../../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";

const ImageCarousel = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  const imageContainerRefTwo = useRef(null);

  /* ✅ SAFE WINDOW WIDTH */
  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(imageProgress, [0, 1], [-150, 150]);

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

  /* ✅ SAME LOGIC, WINDOW SAFE */
  const scaleFactor =
    screenWidth >= 1536
      ? 1
      : screenWidth >= 1280
      ? 0.9
      : screenWidth >= 1024
      ? 0.8
      : screenWidth >= 768
      ? 0.7
      : 0.6;

  return (
    <section className="max-w-[1920px] mx-auto">
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
            loop={true}
            spaceBetween={15}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            speed={1400}
            breakpoints={{
              1536: { slidesPerView: 3.6165 },
              1280: { slidesPerView: 3.45 },
              1024: { slidesPerView: 3.2 },
              768: { slidesPerView: 2.2 },
              0: { slidesPerView: 1.2 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-[400px] md:h-[470px] lg:h-[570px] xl:h-[586px] 2xl:h-[611px] 3xl:h-[679px]"
          >
            {[...(data?.items || []), ...(data?.items || []), ...(data?.items || [])].map((item, i) => (
              <SwiperSlide
                key={i}
                className="flex justify-center items-center transition-all duration-500 ease-in-out"
                style={{
                  flexShrink: 0,
                  width: "520px",
                  transition: "height 0.6s ease",
                }}
              >
                <div
                  ref={imageContainerRefTwo}
                  className="overflow-hidden transition-all duration-500 ease-in-out relative"
                  style={{
                    height: computeHeight(i, scaleFactor),
                    width: "100%",
                  }}
                >
                  <motion.img
                    style={{ y: imageY }}
                    src={item.image}
                    alt={item.imageAlt || `slide-${i}`}
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

export default ImageCarousel;
