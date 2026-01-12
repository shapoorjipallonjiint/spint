"use client";

import { motion } from "framer-motion";
import H2Title from "@/app/components/common/H2Title";
import { assets } from "@/app/assets/index";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Controller } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
gsap.registerPlugin(ScrollTrigger);

const ExpertiseSec = ({ data }) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const sectionRef = useRef(null);

  const MotionImage = motion.create(Image)

  useEffect(() => {
    if (!sectionRef.current) return;

    const overlay = sectionRef.current.querySelector(".reveal-overlay4");

    gsap.set(overlay, { xPercent: 0 });
    gsap.to(overlay, {
      xPercent: 100,
      duration: 2.7,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%",
        toggleActions: "play none none none",
      },
    });

    // Intersection Observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Get the actual slide index (handling loop)
  const getSlideDistance = (slideIndex) => {
    const totalSlides = data.items.length;
    let distance = slideIndex - activeIndex;

    // Handle loop wrapping
    if (distance < 0) distance += totalSlides;
    if (distance > totalSlides / 2) distance -= totalSlides;

    return Math.abs(distance);
  };

  return (
    <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
      <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
      <div className="container !overflow-visible">
        <div className="flex justify-between mb-5 xl:mb-50px ">
          <H2Title titleText={data.title} />
          {/* Navigation - Fixed */}
          <div className="flex items-center gap-[12px] ">
            <button onClick={() => swiperRef?.slidePrev()}
              className="w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
              aria-label="Previous slide"
            >
              <Image src={assets.arrowLeft2} width={13.89} height={13.89} alt="" className="w-[13.89px] h-[13.89px] " />
            </button>
            <button onClick={() => swiperRef?.slideNext()}
              className="w-10 h-10 xl:w-[50px] xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
              aria-label="Next slide"
            >
              <Image src={assets.arrowRight2} width={13.89} height={13.89} alt="" className="w-[13.89px] h-[13.89px] " />
            </button>
          </div>
        </div>

        <div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Controller]}
            spaceBetween={40}
            slidesPerView={1}
            speed={700}
            onSwiper={setSwiperRef}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              setSlideKey(prev => prev + 1); // Force re-animation
            }}
            loopAdditionalSlides={1}
            watchSlidesProgress={true}
            // autoplay={{
            //   delay: 7000,
            //   disableOnInteraction: false,
            // }}
            loop={true}
            breakpoints={{
              0: {
                slidesPerView: 1.15,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.1,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="expertise-swiper !overflow-visible expertise-stretch"
          >
            {data.items.map((item, index) => {
              const distance = getSlideDistance(index);
              const shouldShow = distance <= 4; // Show slides within 4 positions

              return (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                   <div 
                      key={index}
                      className="relative h-full">
                     <div  
                      className=" overflow-hidden h-full"
                      
                    >
                      <MotionImage
                      width={400}
                      height={300}
                        src={item.image}
                        alt={item.imageAlt}
                        className="w-full h-[200px] md:h-[250px] lg:h-[300px] xl:h-[333px] object-cover overflow-hidden"
                        // variants={moveUp(0.2)}
                        // initial="hidden"
                        // whileInView="show"
                        viewport={{amount:0.2, once:true}}
                        initial={{ rotateY: 90, opacity: 1 }}
                        // whileInView={{ rotateY: 0, opacity: 1 }}
                        animate={
                          isInView
                            ? { rotateY: 0, opacity: 1 }
                            : { rotateY: 90, opacity: 0 }
                        }
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: distance * 0.08
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      />
                      <div  className="pl-0 pt-4 xl:p-10 3xl:pb-[55px] xl:border-l border-white/30 h-full ">
                        <h3  className="text-20 xl:text-29 leading-[1.2] 3xl:leading-[1.724137931034483] font-light xl:font-extralight mb-2 xl:mb-[12px]">
                          {item.title}
                        </h3>
                        <p className="text-19 leading-[1.526315789473684] font-light ">
                          {item.description}
                        </p>
                      </div>
                    </div>
                   </div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default ExpertiseSec;