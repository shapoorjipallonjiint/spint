"use client";
import {motion, useScroll, useTransform} from "framer-motion"
import { assets } from "../../../../assets/index"
import H2Title from "../../../common/H2Title"
import TabStyle1Light from "../../../common/TabStyle1Light"
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const RoadMap = ({data}) => {
  const sectionRef = useRef(null);
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

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  return (
    <section className="relative pt-text90 pb25  overflow-hidden" ref={sectionRef}>
      <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
      <div className="absolute bottom-0 right-0 2xl:-right-30 3xl:right-0 w-[200px] md:w-[359px] h-[340px] md:h-[625px] 3xl:w-[561px] 3xl:h-[725px] z-[-1]"><motion.img style={{y:shapeY}} src={assets.mainShape3} alt="" /></div>
      <div className="container">
        {/* Header */}
        <div className="mb-50px">
          <H2Title titleText={data.title} titleColor="black" marginClass="mb-4 xl:mb-50px" />
        </div>
        <TabStyle1Light data={data.items} />
      </div>
    </section>
  );
};

export default RoadMap;