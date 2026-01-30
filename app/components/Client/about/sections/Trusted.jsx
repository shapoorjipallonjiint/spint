"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, moveLeft } from "../../../motionVarients";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import LangLink from "@/lib/LangLink";
gsap.registerPlugin(ScrollTrigger);

const Trusted = ({data}) => {
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
  const MotionImage = motion(Image)
  const isArabic = useIsPreferredLanguageArabic()
  const t = useApplyLang(data)

  useEffect(() => {
    const el = titleRef.current;
    const text = el.innerText;
    el.innerHTML = text
      .split(" ")
      .map((word) => `<span class='word inline-block opacity-0 translate-y-[40px]'>${word}</span>`)
      .join(" ");

    const words = el.querySelectorAll(".word");

    gsap.set(words, { opacity: 0, y: 40 });

    gsap.to(words, {
      scrollTrigger: {
        trigger: el,
        start: "top 80%", // start when heading enters viewport
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      ease: "power3.out",
      duration: 0.6,
      stagger: 0.08, // delay between each word
    });
  }, []);

  return (
    <section className="py-10 xl:py-15 2xl:py-22 3xl:py-[92px] relative overflow-hidden bg-[#F5F5F5]" ref={sectionRef}>
      <MotionImage style={{y:shapeY}} variants={moveLeft(1)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} src="/assets/images/svg/sv-02.svg" alt="" width={432} height={607} className={`w-[152px] h-[200px] sm:w-[232px] sm:h-[407px] md:w-[332px] md:h-[507px] lg:w-[432px] lg:h-[607px] absolute -bottom-15 md:bottom-10 ${isArabic ? "left-0 -scale-x-100" : "right-0"} z-[-1]`} />
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[84px] lg:gap-[104px]">
          {/* ✅ Add class name for GSAP animation */}
          <h2 ref={titleRef} className="trusted-title text-60 max-w-[18.14ch] font-light leading-[1.18] text-black mb-5 lg:mb-0" >
            <SplitTextAnimation children={t.title} staggerDelay={0.1} animationDuration={0.8} delay={0.8} />
          </h2> 
       <LangLink href={t.buttonLink}>
          <div className="flex flex-col justify-end items-end sdsd">
            <MotionImage variants={moveUp(1)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} src="../assets/images/about-us/toarrow.svg" width={71} height={71} alt="arrow" className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-[71px] xl:h-[71px] ${isArabic && "rotate-270"}`} />
            <p className="text-16 font-light leading-[1.474] text-paragraph uppercase pt-3">
              {t.buttonText}
            </p>
          </div>
          </LangLink>
        </div>
      </div>
    </section>
  );
};

export default Trusted;
