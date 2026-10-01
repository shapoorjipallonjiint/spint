"use client";
import { useMediaQuery } from "react-responsive";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

import { assets } from "../../../../assets/index";

const moveUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.5, ease: "easeIn" },
  },
});

const Legacy = ({ data }) => {
  const [imageSwiper, setImageSwiper] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const imageContainerRefTwo = useRef(null);
  const MotionImage = motion.create(Image);
  const isArabic = useIsPreferredLanguageArabic();
  const t = useApplyLang(data);

  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);

  return (
    <section className="section-spacing bg-primary relative overflow-hidden">
      <div className="container">
        <div>
          <div className="">
            <div className="flex flex-col-reverse md:flex-row gap-7 md:gap-5 2xl:gap-[20%] 3xl:gap-[23.3%] justify-between md:items-end">
              {/* RIGHT: Main Content */}
              <div className="w-full">
                <Swiper
                  modules={[Thumbs, EffectFade, Autoplay]}
                  thumbs={{ swiper: thumbsSwiper }}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={false}
                  onSwiper={setImageSwiper}
                  onRealIndexChange={(s) => setActiveSlide(s.realIndex)}
                  // fade stacks every slide in one spot, so without this the swiper is always as tall as the
                  // tallest slide and shorter ones leave empty space below (mostly visible on mobile)
                  autoHeight
                  className="legacy-main-swiper"
                >
                  {t.items.map((item, i) => (
                    <SwiperSlide key={i}>
                      <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-[1fr_795px] gap-7 lg:gap-15 2xl:gap-25 3xl:gap-[137px] pt-6 md:pt-4 lg:pt-0">
                        {/* LEFT CONTENT */}
                        <div className="opacity-80">
                          <H2Title
                            titleText={t.title}
                            titleColor="white"
                            marginClass="mb-80px"
                          />
                          <div className="flex items-center gap-4 border-b border-white/30 mb-50px pb-50px">
                            <div className="flex items-center gap-5">
                              <button
                                onClick={() => imageSwiper?.slidePrev()}
                                className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center ${isArabic && "rotate-180"}`}
                              >
                                <Image
                                  height={20}
                                  width={20}
                                  src={assets.arrowLeft2}
                                  alt=""
                                />
                              </button>
                              <button
                                onClick={() => imageSwiper?.slideNext()}
                                className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center ${isArabic && "rotate-180"}`}
                              >
                                <Image
                                  height={20}
                                  width={20}
                                  src={assets.arrowRight2}
                                  alt=""
                                />
                              </button>
                            </div>
                          </div>

                          {/* Animated year, title, description */}
                          <div className="overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.p
                                key={`year-${activeSlide}`}
                                variants={moveUp(0)}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="text-29 text-white font-light leading-[1] mb-5"
                              >
                                {item.year}
                              </motion.p>
                            </AnimatePresence>
                          </div>

                          <div className="overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.p
                                key={`desc-${activeSlide}`}
                                variants={moveUp(0.4)}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                className="text-19 font-light leading-[1.474] text-white"
                              >
                                {item.description}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* RIGHT SIDE — IMAGE SWIPER */}
                        <div
                          className="relative overflow-hidden"
                          ref={imageContainerRefTwo}
                        >
                          <Swiper
                            modules={[Autoplay, EffectFade]}
                            slidesPerView={1}
                            loop
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            autoplay={{
                              delay: 1300,
                              disableOnInteraction: false,
                            }}
                            allowTouchMove={false}
                            className="w-full"
                          >
                            {(item.images || [item.image]).map((img, idx) => (
                              <SwiperSlide key={idx}>
                                <div className="relative w-full">
                                  <MotionImage
                                    width={1500}
                                    height={1000}
                                    src={img.image}
                                    alt={img.imageAlt || ""}
                                    className="object-cover w-full h-[305px] xl:h-[505px] min-[1810px]:min-h-[565px]"
                                  />
                                  {/* bottom shade so the title/subtitle stay readable on the image */}
                                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0)_43.72%,rgba(0,0,0,0.9)_100%)]" />
                                  <div className="absolute bottom-0 start-0 p-5 lg:p-40px text-white">
                                    <AnimatePresence mode="wait" initial={false}>
                                      <motion.div
                                        key={`title-${activeSlide}`}
                                        variants={moveUp(0.4)}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                      >
                                        <p className="text-29 font-light leading-[1.344]">{img.title}</p>
                                        {img.subtitle?.trim() && (
                                          <p className="text-19 font-light leading-[1.473] text-white/80 mt-2 xl:mt-3 2xl:mt-5">
                                            {img.subtitle}
                                          </p>
                                        )}
                                      </motion.div>
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
