"use client";
import { values } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, moveLeft, paragraphItem } from "../../../motionVarients";
import { useRef, useState } from "react";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import { memo } from "react";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const MotionImage = motion(Image)
const ParallaxShape = memo(({ y }) => (
  <MotionImage
    width={1500}
    height={607}
    style={{ y }}
    variants={moveLeft(1)}
    initial="hidden"
    animate="show"
    src="/assets/images/svg/sv-02.svg"
    alt=""
    className=""
  />
));

const OurValues = ({data}) => {
  const listRef = useRef(null);
  const [isHovered, setIsHovered] = useState(1);
  const [height, setHeight] = useState(0);
  const sectionRef = useRef(null)
  const isArabic = useIsPreferredLanguageArabic()
  const t = useApplyLang(data)


  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  const handleMouseEnter = (index) => {
    if (listRef.current) {
      setHeight(listRef.current.scrollHeight);
    }
    setIsHovered(index);
  };

  const handleMouseLeave = (index) => {
    setIsHovered(index);
    setHeight(0);
  };
  return (
    // <section className="py-12 xl:py-15 2xl:py-30 bg-[url('/assets/images/about-us/valuebg.svg')] bg-auto bg-right-bottom bg-no-repeat">
    <section className="pt-text30 pb30 relative overflow-hidden" ref={sectionRef}>
      <div className={`absolute -bottom-40 lg:bottom-0 ${isArabic ? "left-0 lg:-left-25  xl:-left-40  2xl:-left-25 3xl:left-0 -scale-x-100" : "right-0 lg:-right-25  xl:-right-40  2xl:-right-25 3xl:right-0"} z-[-1] w-[152px] h-full sm:w-[232px] sm:h-full lg:w-[432px] lg:h-[607px]`}>
      <ParallaxShape y={shapeY} />
      </div>
      {/* <MotionImage width={1500} height={607} style={{ y: shapeY }} ref={sectionRef} variants={moveLeft(1)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} src="/assets/images/svg/sv-02.svg" alt="" className="absolute -bottom-40 lg:bottom-0 right-0 lg:-right-25  xl:-right-40  2xl:-right-25 3xl:right-0 z-[-1] w-[152px] h-full sm:w-[232px] sm:h-full lg:w-[432px] lg:h-[607px]" /> */}
      <div className="container">
        {/* <motion.h2 variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}}
         className="text-60 font-light leading-[1.18] text-black mb-5 2xl:mb-10 3xl:mb-[54px]">
          {values.title}
        </motion.h2> */}
        <H2Title titleText={t.title} marginClass={"mb-4 xl:mb-10 3xl:mb-[54px]"} />

        <div className="md:max-w-[70%] lg:max-w-[80%] 2xl:max-w-[74.51%] border-t border-black/20">
          {t.items.map((item, index) => (
            // <ValueItem key={index} item={item} />
            <motion.div key={index} variants={paragraphItem} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}>
            <div className={`group grid lg:grid-cols-[1.2fr_2.4fr_auto] py-2 2xl:py-[16px] cursor-pointer border-b border-black/20  transition-all duration-300
                 ${isHovered === index ? "items-start" : "items-center"}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-19 xs:text-20 xl:text-29  leading-[1.474] lg:leading-[2.43] text-paragraph group-hover:text-black transition-all ease-in-out duration-500 group-hover:font-bold ${isHovered === index ? "font-bold text-black" : "font-light"}`}>
                  {item.title}
                </h3>
                <div className={`flex lg:hidden w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 
                ${isHovered === index ? "rotate-180" : "" }`}>
                  <Image src="/assets/images/about-us/toparrow.svg" width={14} height={14} alt="arrow" />
                </div>
              </div>

              <div className="grid grid-cols-[2fr_auto] overflow-hidden gap-10 lg:gap-[217px]">
                {/* Expanding List */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden  ${isHovered === index ? `opacity-100 h-[${height}px]` : "opacity-0 h-0"}`} >
                  <div key={isHovered === index ? "open" : "closed"} dangerouslySetInnerHTML={{__html:item.description}} className={`${isArabic ? "our-values-about-ar" : "our-values-about"}`}>

                  </div>
                  {/* <ul ref={listRef} key={isHovered === index ? "open" : "closed"} className="text-sm xl:text-19 leading-[1.85] max-w-50ch ps-6 lg:ps-12 py-[11px]">
                    {item.description.split("<li data-list=`bullet`>").slice(0).map((listItem, i) => (
                      <motion.li variants={moveUp(i * 0.07)} key={i} initial="hidden" animate="show" viewport={{ amount: 0.2, once: true }} className="relative before:content-[''] before:absolute before:-left-6 before:top-[14px] before:w-[7px] before:h-[7px] before:bg-secondary before:rounded-none font-light text-paragraph">{listItem}</motion.li>
                    ))}
                  </ul> */}
                </div>

                <div className={`hidden lg:flex w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 ${isHovered === index ? "" : "rotate-180"
                  }`}>
                  <Image src="/assets/images/about-us/arrow-top1.svg" width={20} height={20} alt="arrow" className="w-3 h-3 xl:w-[14px] xl:h-[14px]" />
                </div>
              </div>
            </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



export default OurValues; 