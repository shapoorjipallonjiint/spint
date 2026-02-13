'use client';
import { useMediaQuery } from "react-responsive";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp,moveLeft } from "../../../motionVarients";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const Banner = ({newsData}) => {
  const isArabic = useIsPreferredLanguageArabic();
  const tNewsData = useApplyLang(newsData);
  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
  const imageContainerRefTwo = useRef(null);
  const sectionRef = useRef(null)

  const MotionImage = motion.create(Image)
  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    const { scrollYProgress: shapeProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"]
    });
    const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);
  return (
    <section className="relative overflow-hidden" ref={sectionRef}>
      <div className="pt-12 xl:pt-25  2xl:pt-30">
        <div className="container relative">
          <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="border-y border-cmnbdr  py-6 xl:py-[35px]">
            <div className="flex justify-between">
              <div className=" ">
                <div className="flex gap-15 xl:gap-[90px] 2xl:gap-[325px] ">
                  <div className="w-fit">
                    <p className="uppercase text-paragraph text-19 font-light">{tNewsData.topic.name}</p>
                  </div>
                  <div className="w-fit">
                    <p className="uppercase text-paragraph text-19 font-light">{new Date(tNewsData.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex  justify-between items-center my-6 lg:my-10">
            <div>
              <h1 className="text-40 2xl:text-70 font-light leading-[1.143] max-w-[26.35ch]">
                <SplitTextAnimation children={tNewsData.title} staggerDelay={0.1} animationDuration={0.8} delay={0.8} />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <motion.div variants={moveUp(1)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="container relative overflow-hidden" ref={imageContainerRefTwo}>
        <MotionImage style={{ y: imageY }} src={tNewsData.coverImage} alt={tNewsData.coverImageAlt} width={1620} height={687} className="w-full h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] 3xl:h-[687px] scale-y-110 object-cover" />
      </motion.div>
<div
  className={`absolute bottom-20 md:bottom-1/4 lg:-top-8 z-[-1]
    ${
      isArabic
        ? "left-0 -scale-x-100"
        : "right-0"
    }
  `}
>
  <MotionImage
    width={1500}
    height={1000}
    style={{ y: shapeY }}
    variants={moveLeft(0.4)}
    initial="hidden"
    whileInView="show"
    viewport={{ amount: 0.2, once: true }}
    src="/assets/images/project-details/bannerbg.svg"
    alt=""
    className="w-md200 h-[450px] md:h-[476px] lg:w-[577px] lg:h-[576px] object-fit"
  />
</div>

      
    </section>
  );
};

export default Banner;
