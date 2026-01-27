"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { paragraphItem, moveUp } from "../../../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

gsap.registerPlugin(ScrollTrigger);
const CounterSection = ({ data }) => {
  const t = useApplyLang(data);
  const isArabic = useIsPreferredLanguageArabic();
  // const { svgSrc, stats } = data;
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

    // Start position
    gsap.set(overlay, { xPercent: isArabic ? 0 : 0 });

    gsap.to(overlay, {
      // English → slide to right
      // Arabic  → slide to left
      xPercent: isArabic ? -100 : 100,
      duration: 2.7,
      ease: "expo.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 50%",
        toggleActions: "play none none none",
      },
    });
  }, [isArabic]);


  useEffect(() => {
    const updatePadding = () => {
      if (window.innerWidth < 1280) {
        const container = document.createElement("div");
        container.classList.add("container");
        document.body.appendChild(container);

        const rect = container.getBoundingClientRect();

        if (isArabic) {
          // RTL → space on the left
          setRightPadding(rect.left);
        } else {
          // LTR → space on the right (original logic)
          setRightPadding(window.innerWidth - rect.right);
        }

        container.remove();
      } else {
        setRightPadding(0);
      }
    };

    updatePadding();
    window.addEventListener("resize", updatePadding);
    return () => window.removeEventListener("resize", updatePadding);
  }, [isArabic]);


  return (
    <section ref={sectionRef}
      className="w-full py-8 xl:py-15 2xl:py-22 3xl:py-23 bg-primary text-white lg:max-h-[611px] lg:overflow-hidden relative overflow-hidden " >
      <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
      {/* Below XL: custom padding; XL and up: container */}
      <div className={
        rightPadding > 0
          ? "flex flex-col xl:flex-row gap-x-[170px] container mx-auto"
          : "container mx-auto flex flex-col xl:flex-row gap-x-[170px]"
      }
      >
        <motion.div className="hidden xl:block flex-shrink-0">
          <motion.img
            style={{ y: shapeY }}
            src="/assets/images/svg/svsv.svg"
            alt="logo-svg"
            width={229}
            height={320}
            className={`2xl:w-[229px] 2xl:h-[320px] object-contain absolute
      ${isArabic
                ? "right-[-80px] 2xl:right-auto -scale-x-100"
                : "left-[-80px] 2xl:left-auto"
              }
    `}
          />
        </motion.div>


        {/* Right Content */}
        <div
          className={`w-full flex flex-col justify-center w-[500px]
    2xl:max-w-[950px] 3xl:max-w-[1070px]
    ${isArabic
              ? "mr-auto 2xl:ml-[25px] 3xl:ml-[136px]"
              : "ml-auto 2xl:mr-[25px] 3xl:mr-[136px]"
            }
  `}
        >

          {/* Stats */}
          <div
            className={`relative grid
    lg:grid-cols-3
    2xl:grid-cols-[360px_280px_330px]
    3xl:grid-cols-[360px_280px_430px]
    w-full gap-5 md:gap-0
    ${isArabic ? "rtl" : "ltr"}
  `}
          >

            {t.map((stat, index) => (
              <motion.div variants={moveUp(0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}
                key={index} className={`flex flex-col items-start ${isArabic ? "text-right" : "text-left"
                  }`}
              >
                <h3 className="text-[32px] sm:text-[36px] md:text-[38px] xl:text-[40px] leading-[1] font-light w-full mb-4 2xl:mb-[14px] pb-4 2xl:pb-[18px] border-b border-white/30">
                  {stat.value}
                </h3>

                {/* Mobile Divider */}
                <p className="text-[16px] sm:text-[17px] md:text-[18px] xl:text-[19px] text-white/70 leading-[1.5] word-break: break-all font-extralight ">
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

export default CounterSection;
