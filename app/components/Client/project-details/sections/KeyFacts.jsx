'use client';
import { keyfactors } from "../data";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const KeyFacts = ({ data }) => {
  const sectionRef = useRef(null);
  const t = useApplyLang(data);
  const isArabic = useIsPreferredLanguageArabic();
  useEffect(() => {
    if (!sectionRef.current) return;

    const overlay = sectionRef.current.querySelector(".reveal-overlay2");

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
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="py-8 xl:py-15 2xl:py-22  3xl:pt-[88px]  3xl:pb-[80px] bg-primary  ">
        <div className="reveal-overlay2 absolute inset-0 bg-black/20 z-20"></div>
        <div className="container relative">
          <div className={`2xl:max-w-[1008px] 3xl:max-w-[1208px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
            <div className="flex  justify-between items-center ">
              <div>
                <H2Title titleText={t.title} titleColor={"white"} marginClass={" mb-7 lg:mb-15"} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 3xl:grid-cols-[364px_364px_364px]  gap-8 md:gap-6 xl:gap-0">
              {t.items.map((item, i) => (
                <div key={i}>
                  <h3 className="text-40 font-light leading-[1.3] text-white">{item.number}</h3>
                  <p className="text-19 font-extralight leading-[1.474] text-white/70">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFacts;
