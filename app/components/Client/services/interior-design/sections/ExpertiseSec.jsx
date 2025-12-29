"use client";
import { assets } from "@/app/assets/index"
import 'swiper/css';
import H2Title from "@/app/components/common/H2Title";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, moveDown } from "@/app/components/motionVarients";
import { useRef } from "react";
import Image from "next/image";

// import { useClassParallax } from "../../common/useClassParallax";
const ExpertiseSec = ({data}) => {
  
  const sectionRef = useRef(null);
  const MotionImage = motion.create(Image)


  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  return (
    <section className="relative pt-text30 overflow-hidden" ref={sectionRef}>
      <div className="absolute top-75 lg:top-20 xl:top-30 2xl:top-40 3xl:top-50 right-0 lg:left-[-85px] 3xl:left-0 w-[158px] lg:w-[558px] h-[725px]"><motion.img style={{y:shapeY}} src={assets.mainShape2} alt="" /></div>
      <div className="container">
        <div className="lg:border-b pb-0 lg:pb-10 xl:pb-15 2xl:pb-22 3xl:pb-30 border-cmnbdr">
            <H2Title titleText={data.title} titleColor="black" marginClass="mb-5 xl:mb-50px" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-30px 2xl:gap-10">
            {
              data.items.map((item, index) => (
                <div className="relative overflow-hidden" >
                    <MotionImage width={500} height={400} variants={moveUp(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} src={item.image} alt={item.imageAlt} className="w-full h-[200px] lg:h-[250px] 2xl:h-[300px] 3xl:h-[333px] object-cover " />
                  <div className="border-b lg:border-l lg:border-b-0 border-cmnbdr p-4 xl:p-10">
                    <motion.h3 variants={moveDown(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} className="text-24 2xl:text-29 leading-tight 3xl:leading-[1.724137931034483] font-light mb-2 2xl:mb-3">{item.title}</motion.h3>
                    <motion.p variants={moveDown(0.2*index)} initial="hidden" whileInView="show" viewport={{ amount: 0.6, once: true }} className="text-paragraph text-19 leading-[1.526315789473684] font-light">{item.description}</motion.p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSec;