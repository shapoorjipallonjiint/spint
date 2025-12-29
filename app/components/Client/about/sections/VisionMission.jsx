'use client';
import { useMediaQuery } from "react-responsive";
import { Vision } from "../data";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);
const VisionMission = ({data}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const sectionRef = useRef(null);
  const imageContainerRefTwo = useRef(null);

  const MotionImage = motion(Image)

  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);
  useEffect(() => {
    if (!sectionRef.current) return;

    const overlay = sectionRef.current.querySelector(".reveal-overlay");

    gsap.set(overlay, { xPercent: 0 }); // start covering
    gsap.to(overlay, {
      xPercent: 100, // slide out to the right
      duration: 2.7,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%", // when section comes into view
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py25 bg-f5f5 relative overflow-hidden">
        <div className="reveal-overlay absolute inset-0 bg-white z-20"></div>
        <div className="container">
          <div className={`grid grid-cols-1 md:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] 3xl:grid-cols-[1fr_567px] gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-[60px] 3xl:gap-[90px] items-center justify-stretch`}>
            {/* Left Column */}
            <div className="h-full relative overflow-hidden" ref={imageContainerRefTwo}>
              <MotionImage width={1600} height={1300} style={{y:imageY}} variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="z-10 relative h-full scale-110 object-cover max-h-[200px] md:max-h-full" src={data.image} alt={data.imageAlt} />
            </div>

            {/* Right Column */}
            <div>
              <div className="z-10 relative">
                <div className="flex flex-col gap-y-4 gap-x-8 2xl:gap-x-[56px]">
                  {/* {Vision.right.map((item, i) => (
                    <motion.div variants={moveUp(0.5*i)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="z-10" key={i}>
                      <h3 className='text-60 font-light leading-[1.18] text-black mb-1 lg:mb-2 2xl:mb-6'>
                        {item.title}
                      </h3>
                      <H2Title titleText={item.title} marginClass={"mb-1 lg:mb-2 2xl:mb-6"} />
                      <p className='text-19 font-light leading-[1.474] text-paragraph'>{item.desc}</p>
                    </motion.div>
                  ))} */}
                  <motion.div variants={moveUp(0.5*0)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="z-10" key={1}>
                      {/* <h3 className='text-60 font-light leading-[1.18] text-black mb-1 lg:mb-2 2xl:mb-6'>
                        {item.title}
                      </h3> */}
                      <H2Title titleText={"Vision"} marginClass={"mb-1 lg:mb-2 2xl:mb-6"} />
                      <p className='text-19 font-light leading-[1.474] text-paragraph'>{data.vision}</p>
                    </motion.div>

                    <motion.div variants={moveUp(0.5*1)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="z-10" key={2}>
                      {/* <h3 className='text-60 font-light leading-[1.18] text-black mb-1 lg:mb-2 2xl:mb-6'>
                        {item.title}
                      </h3> */}
                      <H2Title titleText={"Mission"} marginClass={"mb-1 lg:mb-2 2xl:mb-6"} />
                      <p className='text-19 font-light leading-[1.474] text-paragraph'>{data.mission}</p>
                    </motion.div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default VisionMission;
