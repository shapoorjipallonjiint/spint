"use client"
import { useState } from "react";
import H2Title from "../../../common/H2Title";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import { assets } from "../../../../assets/index"
import "swiper/css";


const Promoters = ({ items,title, btmBorder }) => {
    const [imageSwiper, setImageSwiper] = useState(null);
  return (
    <section className="relative overflow-hidden pt-80px">
      <div className="container overflow-visible">
        <div className="flex justify-between mb-40px 3xl:mb-[45px]">
          <H2Title titleText={title} />

          <div className="">
            <div className="flex items-center gap-4 xl:gap-[51px]  border-b border-white/30 ">
              <div className="flex items-center gap-5">
                <motion.button variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} onClick={() => imageSwiper?.slidePrev()}
                  className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-black/20 flex items-center justify-center cursor-pointer`}
                >
                  <Image height={20} width={20} src={assets.arrowLeft2} alt="" />
                </motion.button>
                <motion.button variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} 
                  onClick={() => imageSwiper?.slideNext()}
                  className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-black/20 flex items-center justify-center cursor-pointer`}
                >
                  <Image height={20} width={20} src={assets.arrowRight2} alt="" />
                </motion.button>
              </div>
            </div>

        
          </div>
        </div>
        <div className="emp-slider-wr">
          <Swiper
            modules={[Thumbs, EffectFade, Autoplay]}
            spaceBetween={10}
            slidesPerView={1.5}
            loop
            autoplay={true}
            onSwiper={setImageSwiper}
            className="w-full !overflow-visible"
            breakpoints={{
              576: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1400:{
                slidesPerView: 4.1,
                spaceBetween:40,
              }
            }}
          >
            {
              items.map((item, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div className="relative">
                      {/* <motion.div key={i} variants={moveUp(0.5 + 0.2 * i)} initial="hidden" whileInView="show" viewport={{ amount: 0.1, once: true }} className="relative" > */}
                      <div className="relative group h-[180px]  md:h-[200px] lg:h-[240px]  xl:h-[320px] 2xl:h-[391px] flex flex-col items-center justify-end">
                        <Image
                          width={600}
                          height={600}
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          className="w-full xs:w-fit max-h-full object-contain  absolute bottom-0 px-2"
                        />
                        <div className="bg-f5f5  w-full h-[70%] md:h-[70%] lg:h-[78%] 2xl:h-[79%] max-h-[303.94px] z-[-1]"></div>

                      </div>
                      <div className="mt-3 xl:mt-[27px]">
                        <h3 className="text-20 xl:text-24 2xl:text-29 font-light leading-[1.344827586206897] mb-0 xl:mb-[7px]">
                          {item.name}
                        </h3>
                        <p className="text-paragraph text-16 2xl:text-19 font-light">{item.designation}</p>
                      </div>
                      {/* </motion.div> */}
                    </div>
                  </SwiperSlide>
                )
              })
            }

          </Swiper>
        </div>
        {
          btmBorder && (
            <div className="w-full h-px bg-black/20 mt-80px"></div>
          )
        }
      </div>
    </section>
  );
}

export default Promoters;