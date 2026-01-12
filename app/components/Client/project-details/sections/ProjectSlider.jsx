"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import Image from "next/image";

const legacyData = [
  { image: "/assets/images/project-details/abtsl1.jpg" },
  { image: "/assets/images/project-details/abtsl2.jpg" },
  { image: "/assets/images/project-details/abtsl1.jpg" },
  { image: "/assets/images/project-details/abtsl2.jpg" },
  { image: "/assets/images/project-details/abtsl1.jpg" },
  { image: "/assets/images/project-details/abtsl2.jpg" },
  { image: "/assets/images/project-details/abtsl1.jpg" },
  { image: "/assets/images/project-details/abtsl2.jpg" },
  { image: "/assets/images/project-details/abtsl1.jpg" },
  { image: "/assets/images/project-details/abtsl2.jpg" },
];

const ProjectSlider = ({data}) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const MotionImage = motion.create(Image);

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
    <section className="pb25 relative bg-f5f5">
      <div className="container  " ref={containerRef}></div>
      <div className=" px-[15px] md:pe-0 relative" ref={targetRef}>
        {/* Counter + Arrows */}
        <div className="flex justify-between items-center mb-5    h-[35px]   xl:h-[50px] ">
          <div className="  flex items-center gap-1">
            <span className="font-bold text-paragraph text-[16px] ">
              {String(currentSlide).padStart(2, "0")}
            </span>
            <span className="text-paragraph font-light text-[16px]  ">/</span>
            <span className="text-paragraph font-light text-[16px] ">
              {String(data.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-3 absolute right-[15px] md:right-[26.5%] md:translate-x-[26.5%] lg:right-[25.5%] lg:translate-x-[25.5%]  3xl:right-[25.2%] 3xl:translate-x-[25.2%] top-0">
            <button className="custom-prev w-10 h-10 xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition" >
              <Image src="/assets/images/project-details/rightarrow.svg" className="w-[14px] h-[14px] rotate-180 group-hover:brightness-0 group-hover:invert-100 transition-all duration-300" alt="" width={14} height={14} />
            </button>
            <button className="custom-next w-10 h-10 xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20 hover:bg-secondary hover:text-white transition">
              <Image src="/assets/images/project-details/rightarrow.svg" className="w-[14px] h-[14px] group-hover:brightness-0 group-hover:invert-100 transition-all duration-300" alt="" width={14} height={14} />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full">
            <Swiper
              ref={swiperRef}
              modules={[EffectFade, Autoplay, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              centeredSlides={false}
              speed={1200}
              loop={true}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              onSlideChange={(swiper) =>
                setCurrentSlide((swiper.realIndex % legacyData.length) + 1)
              }
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 1.3,
                  spaceBetween: 30,
                },
              }}
              className="overflow-visible"
            >
              {data.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="overflow-hidden ">
                    <MotionImage width={1500} height={1000} variants={moveUp(0.1*i)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} src={item} alt={`slide-${i}`} className="w-full h-auto object-cover" />
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

export default ProjectSlider;
