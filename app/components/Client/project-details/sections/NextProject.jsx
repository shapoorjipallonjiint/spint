'use client';
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Import your data
import { nextpjt } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
const NextProject = ({slug,title,thumbnail}) => {

  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const imageContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const MotionImage = motion.create(Image)

 
  const imageContainerRefTwo = useRef(null);
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);



  useEffect(() => {
    const container = imageContainerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;

    // Set initial state - overlay covers the image
    gsap.set(overlay, { scaleX: 1, transformOrigin: "right" });

    // Create ScrollTrigger animation - only once
    gsap.to(overlay, {
      scaleX: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none none"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  return (
    <section className="pt-text30 pb30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_550px] xl:grid-cols-[auto_1fr] 3xl:grid-cols-[auto_961px] gap-8 lg:gap-20 xl:gap-[137px]">
          <div className="mb-2 md:mb-3 lg:mb-10 xl:mb-[90px] flex flex-col justify-between items-left pt-0 2xl:pt-[45px] ">
            <div className=" h-full">
              <h2 className="text-20 2xl:text-29 font-light leading-[1.17] lg:pb-5 text-paragraph">
                <SplitTextAnimation children={"Next Project"} staggerDelay={0.1} animationDuration={0.8} delay={0.2} />
              </h2>
              <div className=" flex lg:flex-col justify-between lg:justify-start xl:justify-between items-center lg:items-start h-full  ">
                {/* <p className="text-60 font-light leading-[1.17] text-black lg:max-w-[12ch] md:mb-3 lg:mb-[21px]">
                <SplitTextAnimation
                  children={nextpjt.subtitle}
                  staggerDelay={0.1} // Try smaller value
                  animationDuration={0.8}
                  delay={0.8}
                />
              </p> */}
                <H2Title titleText={title} marginClass={"md:mb-3 lg:mb-[21px]"} maxW={"lg:max-w-[12ch]"} />
              <Link href={`/projects/${slug}`} className='w-fit'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer w-[35px] h-[35px] xl:w-[71px] xl:h-[71px]"
              width="71"
              height="71"
              viewBox="0 0 71 71"
              fill="none"
            >
              <path
                d="M4.75781 4.76465H66.2437V66.2365"
                stroke="#30B6F9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M66.2468 4.76465L5.05469 66.2365"
                stroke="#30B6F9"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            </Link>
              </div>
            </div>
            
          </div>
          <div ref={imageContainerRef} className="relative overflow-hidden">
            <div className='relative overflow-hidden' ref={imageContainerRefTwo}>
              <MotionImage width={1000} height={800} style={{ y: imageY }} src={thumbnail} alt="" className="img-fluid" />
            </div>
            {/* Overlay that reveals from right to left */}
            <div ref={overlayRef} className="absolute inset-0 bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextProject;