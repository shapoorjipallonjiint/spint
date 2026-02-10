"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import H2Title from "@/app/components/common/H2Title";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { motion, useScroll, useTransform } from 'framer-motion'
import { assets } from "@/app/assets/index";
import { useApplyLang } from "@/lib/applyLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css"
gsap.registerPlugin(ScrollTrigger);

const DiversitySection = ({ data }) => {
  const t = useApplyLang(data);
  const MotionImage = motion.create(Image)
  const isArabic = useIsPreferredLanguageArabic();
  const { title, subtitle, images } = t;
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  useEffect(() => {
    const triggers = [];

    imageRefs.current.forEach((img, index) => {
      if (!img) return;

      const isOdd = index % 2 === 1;

      const tween = gsap.fromTo(
        img,
        {
          y: isOdd ? 40 : -40,
        },
        {
          y: isOdd ? -40 : 40,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach(t => t && t.kill());
    };
  }, []);


  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white pt-text30"
    >
      {/* Arrow */}
      <div
        className={`
    hidden md:block absolute -top-10
    ${isArabic
            ? "left-10 2xl:left-20 scale-x-[-1]"
            : "right-10 2xl:right-20"}
    w-[220px] h-[308px]
    lg:w-[280px] lg:h-[392px]
    xl:w-[340px] xl:h-[475px]
    2xl:w-[393px] 2xl:h-[549px]
    pointer-events-none
  `}
      >
        <MotionImage
          width={1500}
          height={1000}
          style={{ y: shapeY }}
          src={assets.mainShape}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
      {/* Heading */}
      <div className={`flex flex-col w-full max-w-[840px] mx-auto mb-50px px-[15px] ${isArabic ? "text-right" : "text-left"}`}>
        <H2Title titleText={title} marginClass="mb-[20px]" />
        <p className="text-19 leading-[1.47] text-[#464646]">
          {subtitle}
        </p>
      </div>

      {/* Image Strip */}
      <Swiper
  modules={[Autoplay]}
  slidesPerView={"auto"}
  spaceBetween={24}
  loop
  allowTouchMove={false}
  autoplay={{
    delay: 0,
    disableOnInteraction: false,
  }}
  speed={2000}
  className="h-[400px] md:h-[400px] xl:h-[450px] 2xl:h-[500px] 3xl:h-[624px]"
>
  {[...images, ...images].map((item, index) => {
    const isTop = index % 2 === 1;

    return (
      <SwiperSlide
        key={index}
        style={{ width: "clamp(160px, 14vw, 246px)" }}
        className="!flex"
      >
        <div
          className={`flex w-full ${
            isTop ? "items-start" : "items-end"
          }`}
        >
          <div
            className="relative will-change-transform w-full"
            style={{
              height: "clamp(340px, 28vw, 510px)",
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px,
                     (max-width: 1024px) 200px,
                     246px"
            />

            <div className="absolute bottom-3 left-3 bg-black px-3 py-1 rounded-sm">
              <p className="text-white font-19">{item.country}</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    );
  })}
</Swiper>
    </section>
  );
};

export default DiversitySection;
