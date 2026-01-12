"use client";
import React, { useRef, useEffect } from 'react';
import { assets } from "@/app/assets/index"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { motion,useScroll,useTransform } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import H2Title from '@/app/components/common/H2Title';
import Image from 'next/image';
const SecondSection = ({data}) => {
  const sectionRef = useRef(null);
  const MotionImage = motion.create(Image)
  useEffect(() => {
    if (!sectionRef.current) return;

    const overlay = sectionRef.current.querySelector(".reveal-overlay4");

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

  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  return (
    <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
      <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
      <div className="absolute bottom-[-100px] lg:bottom-[-52px] right-0 ">
        <MotionImage width={1500} height={1000} style={{y:shapeY}} src={assets.mainShape} className=' object-contain w-[200px] lg:w-[325px] 3xl:w-[425px] h-[594px] ' alt="" /></div>
      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-10 xl:mb-50px 3xl:mb-17">
          <H2Title titleText={data.title} titleColor="white" marginClass=" mb-4  xl:mb-5 2xl:mb-[20px]" />
          <p className='text-19 leading-[1.473684210526316] font-extralight max-w-[100ch]'>{data.description}</p>
        </div>
        <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-5 xl:gap-10 mt-8 md:mt-0'>
            {
              data.items.map((item,index)=>(
                <div>
                  <motion.div variants={moveUp(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} className='border-b border-white/30 pb-30px'>
                    <Image src={item.image} alt={item.imageAlt} width={65} height={65} className='h-10 w-auto xl:h-[50px] 3xl:h-[65px] object-contain' />
                  </motion.div>
                  <motion.h3 variants={moveUp(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} className='text-29 leading-[1.344827586206897] font-light mt-30px mb-4'>{item.title}</motion.h3>
                  <motion.p variants={moveUp(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} className='text-19 leading-[1.473684210526316] font-extralight'>{item.description}</motion.p>
                </div>
              ))
            }
        </div>
      </div>
    </section>
  );
};

export default SecondSection;