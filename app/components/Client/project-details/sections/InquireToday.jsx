'use client';
import { Inquiretoday } from "../data";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const InquireToday = ({ data }) => {
  const t = useApplyLang(data);
  const isArabic = useIsPreferredLanguageArabic();
  const sectionRef = useRef(null);
  const MotionImage = motion.create(Image)

  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
  useEffect(() => {
    if (!sectionRef.current) return;

    const overlay = sectionRef.current.querySelector(".reveal-overlay3");

    gsap.set(overlay, { xPercent: 0 }); // start covering
    gsap.to(overlay, {
      xPercent: isArabic ? -100 : 100, // slide out to the right
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
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="reveal-overlay3 absolute inset-0 bg-black/20 z-20"></div>
      <div className="bg-primary">
        <MotionImage
          width={1500}
          height={1000}
          style={{ y: shapeY }}
          variants={moveUp(0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: true }}
          src="/assets/images/svg/sv-02.svg"
          alt=""
          className={`block 3xl:hidden w-[150px] h-[200px] lg:w-[313px] lg:h-[440px]
    absolute bottom-0 z-10 object-contain
    ${isArabic
              ? "left-[0px] xl:right-[-70px] 3xl:right-[13px] -scale-x-100"
              : "right-[0px] xl:left-[-70px] 3xl:left-[13px]"
            }
  `}
        />


        <div className="container relative py-8 xl:py-15 2xl:py-22 3xl:py-[108px] overflow-hidden">
          <MotionImage
            width={1500}
            height={1000}
            style={{ y: shapeY }}
            variants={moveUp(0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.2, once: true }}
            src="/assets/images/svg/sv-02.svg"
            alt=""
            className={`hidden 3xl:block w-[150px] h-[200px] lg:w-[313px] lg:h-[440px]
    absolute bottom-0 z-10 object-contain
    ${isArabic
                ? "left-[0px] lg:right-[0px] 3xl:right-[13px] -scale-x-100"
                : "right-[0px] lg:left-[0px] 3xl:left-[13px]"
              }
  `}
          />

          <div className={`xl:max-w-[900px] 2xl:max-w-[1008px] 3xl:max-w-[1208px] ${isArabic ? "mr-auto" : "ml-auto"} `}>
            <div className="flex justify-between items-center ">
              <div className="mb-3 md:mb-5 xl:mb-[68px]">
                <H2Title titleText={t.title} titleColor={"white"} marginClass="mb-5 md:mb-3 lg:mb-[21px]" />
                <motion.p variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-29 font-light leading-[1.35] text-white">
                  {t.subTitle}</motion.p>
              </div>
            </div>
            <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0, once: true }} className="flex items-center gap-2">
              <p className="font-16 font-light text-white uppercase leading-[1.75]">Email</p>
              <p className="font-16 font-light text-[#97B6FF] leading-[1.75]">info@spinternational.com</p>
              <div className={isArabic ? "-scale-x-100" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="17" viewBox="0 0 27 17" fill="none">
                  <path d="M17.6328 1.93262L25.0111 8.5134L17.6579 15.0679" stroke="#30B6F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24.5954 8.5H1.98047" stroke="#30B6F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquireToday;
