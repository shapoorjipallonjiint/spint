"use client";

import { useEffect, useState, useRef } from "react";
// import { empowerData } from "../data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { paragraphItem, moveUp } from "../../../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import InsideCounter from "../../../InsideCounter";
import Image from 'next/image';
import { getSuffix } from "@/helpers/getSuffix.ts";

gsap.registerPlugin(ScrollTrigger);
const EmpowerSection = ({data}) => {
  const MotionImage = motion.create(Image)
  const [rightPadding, setRightPadding] = useState(0);

  const sectionRef = useRef(null);

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
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

  useEffect(() => {
    const updatePadding = () => {
      // only calculate padding for smaller screens
      if (window.innerWidth < 1280) {
        const container = document.createElement("div");
        container.classList.add("container");
        document.body.appendChild(container);

        const containerRect = container.getBoundingClientRect();
        setRightPadding(window.innerWidth - containerRect.right);

        container.remove();
      } else {
        // reset padding for xl and above
        setRightPadding(0);
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, []);

  return (
    <section ref={sectionRef}
      className="w-full py-8 xl:py-15 2xl:py-22 3xl:py-23 bg-primary text-white lg:max-h-[611px] lg:overflow-hidden relative overflow-hidden " >
      <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
      {/* Below XL: custom padding; XL and up: container */}
      <motion.div  className="shapelt50  flex-shrink-0">
        <MotionImage width={394} height={549} style={{ y: shapeY }} src={"/assets/images/svg/svsv.svg"} alt="logo-svg" className="w-md200 lg:w-[250px]  2xl:w-[324px] 3xl:w-[394px] h-fit object-contain absolute bottom-0 lg:bottom-0 right-0 lg:right:auto lg:left-[-84px]  xl:left-0" />
      </motion.div>  <div
        className={
          rightPadding > 0
            ? "flex flex-col xl:flex-row gap-x-[170px] container mx-auto"
            : "container mx-auto flex flex-col xl:flex-row gap-x-[170px]"
        }
      >

        {/* Right Content */}
        <div className="w-full flex flex-col justify-center lg:max-w-[800px] xl:max-w-[900px] 2xl:max-w-[1008px] 3xl:max-w-[1208px] ml-auto">
          {/* <motion.h2 variants={paragraphItem} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-60 leading-[1.1666666667] font-light mb-6 lg:mb-[30px] max-w-[20ch]">
            {heading}
          </motion.h2> */}
          <H2Title titleText={data.title} marginClass={"mb-6 lg:mb-30px max-w-[20ch]"}/>

          <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-19 text-white font-light leading-[1.4736842105] mb-8 md:mb-[62px] max-w-[72ch]">
            {data.description}
          </motion.p>

          {/* Stats */}
          <div className="relative flex flex-col md:flex-row w-full gap-5 md:gap-0">
            {data.items.map((stat, index) => (
              <motion.div variants={moveUp(0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}
                key={index}
                className="flex flex-col items-start text-left   min-w-[25%]   xl:min-w-[290px] last:w-[100%] "
              >
                <h3 className="text-[32px] sm:text-[36px] md:text-[38px] xl:text-[40px] leading-[1] font-light w-full mb-4 2xl:mb-[15px] pb-4 2xl:pb-[15px] border-b border-white/30">
                  <InsideCounter value={stat.value} delay={100} />
                  {getSuffix(stat.value)}
                </h3>

                {/* Mobile Divider */}
                <p className="text-[16px] sm:text-[17px] md:text-[16px] lg:text-[18px] xl:text-[19px] text-white/70 leading-[1.5] word-break: break-all ">
                  {stat.key}
                </p>
              </motion.div>
            ))}

            {/* Desktop Full Divider */}
            {/* <div className="hidden xl:block absolute left-0 top-[27px] w-full h-[1px] bg-white/40 my-[20px] sm:my-[24px] xl:my-[40px]" /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpowerSection;
