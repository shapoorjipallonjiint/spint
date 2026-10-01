"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveLeft } from "../../../motionVarients";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import OurValues from "./OurValues";
import Trusted from "./Trusted";

const MotionImage = motion.create(Image);

// Our Values + the CTA (Trusted) share one wrapper so a single shape can run across both sections.
// Layering inside the isolated wrapper: section backgrounds -> shape (z-0, after the sections in the DOM) -> section content (z-[1]).
const ValuesCta = ({ valuesData, ctaData }) => {
  const wrapperRef = useRef(null);
  const isArabic = useIsPreferredLanguageArabic();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const shapeY = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  return (
    <div ref={wrapperRef} className="relative isolate overflow-hidden">
      <OurValues data={valuesData} />
      <Trusted data={ctaData} />

      <MotionImage
        style={{ y: shapeY }} 
        variants={moveLeft(1)}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.2, once: true }}
        src="/assets/images/svg/sv-02.svg"
        alt=""
        width={432}
        height={607}
        className={`pointer-events-none absolute bottom-0 z-0 w-[152px] h-[200px] sm:w-[232px] sm:h-[407px] md:w-[332px] md:h-[507px] lg:w-[432px] lg:h-[607px] ${isArabic ? "left-0 -scale-x-100" : "right-0"}`}
      />
    </div>
  );
};

export default ValuesCta;
