"use client";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../motionVarients";
import gsap from "gsap";
import SplitTextAnimation from "./SplitTextAnimation";
import Image from 'next/image'
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

export default function TabStyle1Light({ data }) {
  
  const [activeId, setActiveId] = useState(data[1]?._id || data[0]?._id);

  const tabsContainerRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const imageContainerRefOne = useRef(null);
  const MotionImage = motion.create(Image);
  const isArabic = useIsPreferredLanguageArabic();

  // Move useScroll inside the AnimatePresence content so it updates per tab
  // We'll create a separate component for the image with its own parallax

  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const buttons = tabsContainerRef.current.querySelectorAll(".tab-style1-btn");

    gsap.fromTo(
      buttons,
      { y: -18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
      }
    );
  }, []);

  const activeTab = data.find((t) => t._id === activeId) || data[0];
  const formatNumber = (i) => String(i + 1).padStart(2, "0");

  // Separate component for parallax image
  function ParallaxImage({ src, alt, imageOffset }) {
    const imageRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
      target: imageRef,
      offset: ["start end", "end start"]
    });
    
    const y = useTransform(scrollYProgress, [0, 1], imageOffset);

    return (
      <div className="relative w-full overflow-hidden" ref={imageRef}>
        <MotionImage 
          width={800} 
          height={800} 
          style={{ y }} 
          src={src} 
          alt={alt} 
          className="w-full h-full max-h-[300px] lg:max-h-[350px] xl:max-h-[487px] object-cover scale-110" 
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className=" 2xl:max-w-[1109px] 3xl:max-w-[1209px]">
        <div ref={tabsContainerRef} className={`grid  grid-cols-2 gap-2 md:gap-0 md:flex flex-wrap w-full overflow-hidden `}>
          {data.map((tab, index) => (
            <motion.button 
              variants={moveUp(0.4 + 0.1*index)} 
              initial="hidden" 
              whileInView={"show"} 
              viewport={{once:true, amount:0.2}}
              key={tab._id}
              onClick={() => setActiveId(tab._id)}
              className={`tab-style1-btn flex-1 px-4 py-4 lg:py-5 flex flex-col items-center text-center border border-cmnbdr cursor-pointer  ${
                index !== 0 ? "-ml-[1px]" : ""
              } ${
                tab._id === activeId
                  ? "bg-f5f5 shadow-[inset_0_2px_0_0_#30B6F9,inset_0_-2px_0_0_#30B6F9] relative z-10"
                  : "bg-transparent hover:bg-f5f5"
              }`}
            >
              <span className="text-16 leading-[1.75] text-paragraph font-light mb-4">
                {formatNumber(index)}
              </span>
              <span className={`text-19 leading-[1.473684210526316] max-w-[30ch] transition-all duration-300  ${
                tab._id === activeId ? "font-bold" : "font-light"
              }`}>
                {tab.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="2xl:max-w-[1109px] 3xl:max-w-[1209px] mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[537px_auto] gap-10 xl:gap-x-18 items-center"
          >
            {/* Left image with parallax */}
            <motion.div
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 1.6 }}
              className="w-full"
            >
              <ParallaxImage 
                src={activeTab.image} 
                alt={activeTab.title} 
                imageOffset={imageOffset}
              />
            </motion.div>

            {/* Right content */}
            <div className="text-sm lg:text-19">
              <motion.div 
                variants={moveUp(0.6)} 
                initial="hidden" 
                whileInView="show" 
                viewport={{amount: 0.2, once: true}} 
                className="w-[66px] h-[66px] bg-[#30B6F94D] rounded-full flex items-center justify-center mb-5 md:mb-6 lg:mb-[33px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="42" viewBox="0 0 29 42" fill="none">
                  <g clipPath="url(#clip0_3796_1444)">
                    <path d="M12.9026 28.0991V16.3916C12.9026 14.6782 11.5346 13.2871 9.84971 13.2871C8.16478 13.2871 6.79688 14.6782 6.79688 16.3916C6.79688 18.105 8.16478 19.4961 9.84971 19.4961H19.6658C21.3507 19.4961 22.7186 18.105 22.7186 16.3916C22.7186 14.6782 21.3507 13.2871 19.6658 13.2871C17.9808 13.2871 16.6129 14.6782 16.6129 16.3916V28.0991" stroke="#1E45A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22.3043 28.0986H6.71138C6.03372 28.0986 5.48438 28.6573 5.48438 29.3464V33.6628C5.48438 34.3519 6.03372 34.9106 6.71138 34.9106H22.3043C22.982 34.9106 23.5313 34.3519 23.5313 33.6628V29.3464C23.5313 28.6573 22.982 28.0986 22.3043 28.0986Z" stroke="#1E45A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.46875 34.9108L11.6821 39.8481C11.8347 40.1824 12.1635 40.3973 12.5216 40.3973H16.5196C16.8836 40.3973 17.2183 40.1764 17.365 39.8361L19.5138 34.9048" stroke="#1E45A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21.764 28.0989L25.9323 20.8511H25.9264C26.8775 19.0183 27.4118 16.9347 27.4118 14.7258C27.4118 7.47204 21.629 1.59741 14.5018 1.59741C7.37459 1.59741 1.58594 7.47801 1.58594 14.7258C1.58594 16.9407 2.12605 19.0243 3.07126 20.8511L7.23956 28.0989" stroke="#1E45A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_3796_1444">
                      <rect width="29" height="42" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </motion.div>
              <h3 className="text-40 leading-[1.344827586206897] font-light mb-3 2xl:mb-[25px] max-w-[17ch]">
                <SplitTextAnimation children={activeTab.title} staggerDelay={0.2} animationDuration={0.8} delay={0.8} />
              </h3>
              <motion.p 
                variants={moveUp(0.9)} 
                initial="hidden" 
                whileInView="show" 
                viewport={{amount: 0.2, once: true}} 
                className=" text-19 max-w-[38ch] leading-[1.473684210526316] font-light text-paragraph"
              >
                {activeTab.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}