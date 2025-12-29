"use client"

import { useMediaQuery } from "react-responsive";
import { useRef, useState } from 'react';
import { assets } from "@/app/assets/index"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { wtrData } from '../data';
import H2Title from '@/app/components/common/H2Title';
import {motion, useScroll, useTransform } from "framer-motion";
import {moveUp} from "@/app/components/motionVarients"
import Image from "next/image";
const ExpertiseSec = ({data}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
  const { expertiseData } = wtrData;
  const itemRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const MotionImage = motion.create(Image)

  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);

  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);

  // Helper to set ref for each item
  const setItemRef = (el, i) => {
    itemRefs.current[i] = el;
  };

  // Determine index at (x,y) — returns -1 if none
  const getIndexAtPoint = (x, y) => {
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i;
      }
    }
    return -1;
  };

  // touch move handler
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const idx = getIndexAtPoint(touch.clientX, touch.clientY);
    if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
  };
 
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    const idx = getIndexAtPoint(touch.clientX, touch.clientY);
    if (idx !== -1) setActiveIndex(idx);
  };
 
  const handleMouseMove = (e) => {
    const idx = getIndexAtPoint(e.clientX, e.clientY);
    if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
  };
 
  const handleLeave = () => {
    setActiveIndex(activeIndex);
  };

  const activeImage = data?.items?.[activeIndex]?.image ?? data?.items?.[0]?.image;
  const activelist = data?.items?.[activeIndex]?.description ?? data?.items?.[0]?.description;
  console.log(activelist)

  return (
    <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
      <div className="absolute bottom-[-358px] lg:bottom-[-150px] 3xl:bottom-0 right-0 w-[200px] lg:w-[400px] 3xl:w-[573px] h-[803px]"><MotionImage width={1500} height={1000} style={{y:shapeY}} src={assets.mainShape} alt="" /></div>
      <div className="container">
        {/* Header */}
        <H2Title titleText={data.title} titleColor="white" marginClass="mb-4 xl:mb-50px" />

        {/* Swiper Slider */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[50%_1fr] 2xl:grid-cols-[55%_1fr] 3xl:grid-cols-[961px_1fr] gap-4 lg:gap-8 xl:gap-[70px]  " >
            <div className='h-full relative overflow-hidden' ref={imageContainerRef}>
              <MotionImage width={1500} height={1000} style={{y:imageY}} src={activeImage} alt="" className='h-[200px] scale-y-110 md:h-full w-full object-cover' />
            </div>
            <div>
              <div className="flex flex-col gap-8 lg:gap-[80px] justify-between 3xl:mt-12">
                <div
                  // attach pointer handlers here so child items don't each need them
                  onTouchMove={handleTouchMove}
                  onTouchStart={handleTouchStart}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleLeave}
                >
                  {data.items.map((item, index) => (
                    <motion.div variants={moveUp(0.4 + 0.1 * index)} initial="hidden" whileInView={"show"} viewport={{amount:0.2,once:false}}
                      className="flex items-center gap-2 group w-fit"
                      key={index}
                      ref={(el) => setItemRef(el, index)}
                      // keep these optional — they help for quick taps on non-touch devices
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <p className={`text-19  text-white leading-[1.75] cursor-pointer transition-all duration-300 ${activeIndex === index ? "font-bold" : "font-light group-hover:font-bold" }`}>
                        {item.title}
                      </p>

                      <div
                        className={`transition-all duration-300 opacity-0 ${activeIndex === index ? "rotate-0 opacity-100" : "group-hover:opacity-100 rotate-45 "
                          }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M1.25 1.25H14.2433V14.2404" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.2438 1.25L1.3125 14.2404" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div>
                  {/* Image area: shows image for active index */}
                  <motion.div variants={moveUp(0.8)} initial="hidden" whileInView="show" viewport={{amount:0.2,once:false}} className="w-[66px] h-[66px] bg-secondary rounded-full flex items-center justify-center">
                    {/* keep your existing svg if you want to keep it — or replace by the image */}
                    {/* svg retained per your markup */}
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
                  {/* <div className="mt-4 xl:mt-5 border-t border-white/20 pt-4 xl:pt-[28px]">
                    <ul className="list-disc max-w-[45.5ch] ml-[18px]"  >
                      {activelist.map((desc, i) => (
                        <motion.li variants={moveUp(0.8 + 0.1 * i)} initial="hidden" whileInView={"show"} viewport={{amount:0.2,once:false}} key={i} className='text-19 font-light'>{desc}</motion.li>
                      ))}
                    </ul>
                  </div> */}
                  <div className="water-our-expertise">
                  <div dangerouslySetInnerHTML={{__html:activelist}} >

                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSec;