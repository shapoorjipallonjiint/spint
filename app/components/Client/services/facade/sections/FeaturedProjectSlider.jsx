"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../common/H2Title";

const FeaturedProjectSlider = ({data}) => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const containerRef = useRef(null);
  const targetRef = useRef(null);

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
    <section className="py-10 xl:py-15 2xl:pt-[80px] 2xl:pb-25 relative bg-f5f5">
      <div className="px-[15px] md:pe-0 relative">
        {/* Counter + Arrows */}
        <div className="container" ref={containerRef}>
          <div className="flex justify-between items-center mb-5 xl:mb-17">
            <div className="text-lg font-semibold text-black flex items-center gap-1">
              <H2Title titleText="Featured Projects" titleColor="black" marginClass="mb-0" />
            </div>

            <div className="flex gap-3 ">
              <button
                className="custom-prev  w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20   hover:bg-secondary hover:text-white transition"
              >

                <img src="/assets/images/project-details/rightarrow.svg" className="rotate-180 group-hover:brightness-0 group-hover:invert-100 transition-all duration-300" alt="" width={14} height={14} />
              </button>
              <button
                className="custom-next w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] flex items-center justify-center cursor-pointer rounded-full group border border-black/20   hover:bg-secondary hover:text-white transition"
              >
                <img src="/assets/images/project-details/rightarrow.svg" className="group-hover:brightness-0 group-hover:invert-100 transition-all duration-300" alt="" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
        {/* Swiper */}
        <div className="flex flex-col md:flex-row gap-3 px-[15px] md:pe-0" >
          <div className="container">
            <Swiper
              ref={swiperRef}
              modules={[EffectFade, Autoplay, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              loopedSlides={6}
              centeredSlides={false}
              navigation={{
                prevEl: ".custom-prev",
                nextEl: ".custom-next",
              }}
              // onSlideChange={(swiper) =>
              //   setCurrentSlide((swiper.realIndex % engineeringData.featuredProjectsData.items.length) + 1)
              // }
              speed={800}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 40,
                },
              }}
              className="!overflow-visible"
            >
              {data.items.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="overflow-hidden ">
                    <div>
                      <motion.img variants={moveUp(0.1 * i)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} src={item.image} alt={`slide-${i}`} className="w-full h-auto object-cover" />
                    </div>
                    <div>
                      <div className="border-b border-cmnbdr pt-5 xl:pt-7 pb-5 xl:pb-7">
                        <h3 className="text-29 leading-[1.344827586206897] font-light">{item.title}</h3>
                      </div>
                      <div className="border-b border-cmnbdr grid grid-cols-2 items-center">
                        <h4 className="text-19 leading-[2.052631578947368] font-light text-paragraph"><span>Sector: </span>{item.sector}</h4>
                        <h4 className="text-19 leading-[2.052631578947368] font-light text-paragraph"><span>BUA (Sq.ft): </span>500000</h4>
                      </div>
                      <div className="border-b border-cmnbdr">
                        <h4 className="text-19 leading-[2.052631578947368] font-light text-paragraph"><span>Location: </span>{item.location}</h4>
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
