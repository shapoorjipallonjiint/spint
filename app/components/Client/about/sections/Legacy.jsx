"use client";
import { useMediaQuery } from "react-responsive";
import  { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";


import { assets } from "../../../../assets/index"

const legacyData = [
  {
    year: "1971",
    title: "The Beginning",
    description: "As the first Indian construction company to operate in the GCC, we marked our global debut with the construction of the iconic Al Alam Palace in Muscat, Oman. This landmark project laid the foundation for our enduring legacy in the region.",
    images: [
      "/assets/images/about-us/slide1.jpg" 
    ]
  },
  {
    year: "2005 - 2010",
    title: "Establishing SP International",
    description: "With the formal establishment of SP International, we undertook iconic UAE projects such as DAMAC Park Towers, Taj Grandeur Hotel, Jumeirah Lake Towers, and the Fairmont Hotel in Abu Dhabi. These developments showcased our ability to deliver high-profile, complex projects on time and to exacting standards.",
    image: "/assets/images/careers/banner.jpg",
  },
  {
    year: "2011 - 2015",
    title: "Regional Expansion",
    description: "Expanding across Qatar, Saudi Arabia, and Kuwait, we delivered landmark projects including Barwa Commercial Avenue, Barwa City, King Abdullah Financial District (KAFD), AKH Tower, Kuwait University, and Al Sabah Hospital. This period demonstrated our capacity to manage multi-location, large-scale developments with efficiency and excellence.",
     images: [
      "/assets/images/about-us/slide1.jpg" 
    ]
  },
  {
    year: "2016 - 2020",
    title: "Prestige & Growth",
    description: "We delivered some of the GCC and Africa’s most prestigious projects, including 5JJ Tower, Dubai Hills, Kings College, SECO, and SABIC Headquarters, as well as cultural landmarks like the Mall of Oman and Oman Convention Centre.Beyond the Gulf, we completed the Niger Convention Centre, reinforcing our global execution capabilities.",
    image: "/assets/images/about-us/slide1.jpg",
  },
  {
    year: "2021 - 2025",
    title: "Diversification & New Horizons",
    description: "Expanding into entertainment and lifestyle, we delivered Obhur Entertainment Complex, Exit 10, Palm Beach Towers, and Al Marjan Islands Residences, alongside critical healthcare projects like Corniche Hospital. These developments highlight our ability to execute diverse, large-scale projects across multiple sectors.",
    image: "/assets/images/about-us/slide1.jpg",
  },
];
const Legacy = ({data}) => {
  const [imageSwiper, setImageSwiper] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const imageContainerRefTwo = useRef(null);
  const MotionImage = motion.create(Image)
  const isArabic = useIsPreferredLanguageArabic()
  const t = useApplyLang(data)

  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);
  return (
    <section className="py-7 xl:py-15 2xl:pt-18 3xl:pt-[108px] pb30 bg-primary relative overflow-hidden">
      <div className="container">
        <div>
          <div className="">
            {/* <motion.h2 variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-60 font-light leading-[1.18] text-white">
              Legacy
            </motion.h2> */}
            <H2Title titleText={t.title} titleColor="white" marginClass="md:mb-4 lg:mb-8 xl:mb-15" />

            <div className="flex flex-col-reverse md:flex-row gap-7 md:gap-5 2xl:gap-[20%]  3xl:gap-[23.3%] justify-between md:items-end">
              {/* LEFT: Vertical Year Thumbs */}


              {/* RIGHT: Main Content */}
              <div className="  w-full ">
                <Swiper
      modules={[Thumbs, EffectFade, Autoplay]}
      thumbs={{ swiper: thumbsSwiper }}
      spaceBetween={30}
      slidesPerView={1}
      loop
      effect="fade"
      fadeEffect={{ crossFade: true }}
      // autoplay={{
      //   delay: 8000,
      //   disableOnInteraction: false,
      // }}
      autoplay={false}
      onSwiper={setImageSwiper}
      onSlideChange={(swiper) => {
        setCurrentSlide(swiper.realIndex);
      }}
      className="legacy-main-swiper"
    >
      {/* {legacyData.map((item, i) => ( */}
        
      {t.items.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-15 2xl:gap-[137px] pt-6 md:pt-4 lg:pt-0 ">

            {/* LEFT CONTENT */}
            <div className="pt-0 xl:pt-10 2xl:pt-12 3xl:pt-15">
              <div className="flex items-center gap-4 xl:gap-[51px] mb-5 xl:mb-[50px] border-b border-white/30 lg:pt-5 pb-4 xl:pb-[50px]">

                <div className="flex items-center gap-5">
                  <button
                    onClick={() => imageSwiper?.slidePrev()}
                    className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center ${isArabic && "rotate-180"}`}
                  >
                    <Image height={20} width={20} src={assets.arrowLeft2} alt="" />
                  </button>

                  <button
                    onClick={() => imageSwiper?.slideNext()}
                    className={`w-10 xl:w-[50px] h-10 xl:h-[50px] rounded-full border border-white/20 flex items-center justify-center ${isArabic && "rotate-180"}`}
                  >
                    <Image height={20} width={20} src={assets.arrowRight2} alt="" />
                  </button>
                </div>
              </div>

              <p className="text-29 text-white font-light leading-[1] mb-3 xl:mb-5">
                {item.year}
              </p>

              <p className="text-19 font-light leading-[1.474] text-white">
                {item.description}
              </p>
            </div>

            {/* RIGHT SIDE — IMAGE SWIPER */}
            <div className="relative overflow-hidden" ref={imageContainerRefTwo}>
              
              <Swiper
                modules={[Autoplay, EffectFade]}
                slidesPerView={1}
                loop
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                allowTouchMove={false}
                className="w-full"
              >
                {(item.images || [item.image]).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <MotionImage
                      width={1500}
                      height={1000}
                      style={{ y: imageY }}
                      src={img}
                      alt={item.imageAlt || ""}
                      className="object-cover scale-110 w-full h-[305px] md:w-full xl:w-[795px] xl:h-[505px]"
                    /> 
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
