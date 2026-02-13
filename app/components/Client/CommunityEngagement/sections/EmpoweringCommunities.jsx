"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import Image from 'next/image'
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const size = {
  big: "2xl:min-w-full h-[120px] sm:h-[160px] md:h-[200px]  lg:h-[200px] xl:h-[240px] 2xl:h-[305px] 3xl:h-[405px]",
  large: "2xl:min-w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[180px] xl:h-[200px] 2xl:h-[235px] 3xl:h-[345px]",
  medium: "2xl:w-full h-[70px] sm:h-[80px] md:h-[110px] lg:h-[174px] 3xl:h-[244px]",
  small: "2xl:w-full h-[70px] sm:h-[80px]  md:h-[100px] lg:h-[182px] 3xl:h-[182px]",
  extrasmall: "2xl:w-full h-[74px] sm:h-[90px]  md:h-[100px] lg:h-[218px]",
};

const EmpoweringCommunities = ({ data }) => {
  const t = useApplyLang(data);
  const isArabic = useIsPreferredLanguageArabic();
  const sectionRef = useRef(null);
  const MotionImage = motion.create(Image)

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  const all = useMemo(() => {
    const items = data?.items || {};
    return [
      items.leftMost?.map(i => i.image) || [],
      items.leftColTop?.map(i => i.image) || [],
      items.leftOfCenter?.map(i => i.image) || [],
      items.leftColBottom?.map(i => i.image) || [],
      items.center?.map(i => i.image) || [],
      items.rightOfCenter?.map(i => i.image) || [],
      items.rightMost?.map(i => i.image) || [],
      items.rightColTop?.map(i => i.image) || [],
      items.rightColBottom?.map(i => i.image) || [],
    ];
  }, [data]);

  const [idx, setIdx] = useState(new Array(9).fill(0));

  // const intervals = [15000, 15500, 16000, 16500, 17000, 17500, 18000, 16200, 16800];
  const intervals = [15000, 15500, 8000, 8500, 17000, 7500, 18000, 6200, 12800];

  useEffect(() => {
    const timers = all.map((arr, i) =>
      arr.length
        ? setInterval(() => {
            setIdx(prev => {
              const updated = [...prev];
              updated[i] = (prev[i] + 1) % arr.length;
              return updated;
            });
          }, intervals[i])
        : null
    );

    return () => timers.forEach(t => t && clearInterval(t));
  }, [all]);

  const fade = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1.15 },
    exit: { opacity: 0, scale: 1.1 },
  };

  return (
    <section className="pt-10 xl:pt-15 2xl:pt-25 overflow-hidden relative" ref={sectionRef}>
      <div className="w-full h-[260px] sm:h-[320px] lg:h-[600px] 3xl:h-[670px] flex justify-center gap-1 lg:gap-3 2xl:gap-[16px]">

        <motion.div variants={moveUp(1.1 * idx[0])} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[120px] sm:mt-[200px] lg:mt-[280px] min-w-[15.27%]">
          <Block src={all[0][idx[0]]} size={size.extrasmall} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.2 * idx[1])} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col gap-1 lg:gap-4 mt-[100px] sm:mt-[120px] lg:mt-[218px] min-w-[15.27%]">
          <Block src={all[1][idx[1]]} size={size.small} fade={fade} />
          <Block src={all[3][idx[3]]} size={size.medium} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.3 * idx[2])} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[60px] lg:mt-[136px] min-w-[20%] md:min-w-[15.74%]">
          <Block src={all[2][idx[2]]} size={size.large} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.4 * idx[4])} initial="hidden" whileInView="show" viewport={{ once: true }} className="min-w-[30%] md:min-w-[21.71%]">
          <Block src={all[4][idx[4]]} size={size.big} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.5 * idx[5])} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[60px] lg:mt-[136px] min-w-[20%] md:min-w-[15.74%]">
          <Block src={all[5][idx[5]]} size={size.large} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.6 * idx[7])} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col gap-1 lg:gap-3 mt-[100px] sm:mt-[120px] lg:mt-[218px] min-w-[15.27%]">
          <Block src={all[7][idx[7]]} size={size.small} fade={fade} />
          <Block src={all[8][idx[8]]} size={size.medium} fade={fade} />
        </motion.div>

        <motion.div variants={moveUp(1.7 * idx[6])} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-[150px] sm:mt-[200px] lg:mt-[320px] min-w-[15.27%]">
          <Block src={all[6][idx[6]]} size={size.extrasmall} fade={fade} />
        </motion.div>
      </div>

      <div className="container">
        <div className="pb30">
          <motion.h1 variants={moveUp(0.6)} initial="hidden" whileInView="show" viewport={{ once: true }}  className="text-[32px] lg:text-60 font-light leading-[1.18] max-w-[20ch] text-center mb-5 m-auto">
            <SplitTextAnimation children={t.title} staggerDelay={0.5} animationDuration={0.8} delay={0.4} />
          </motion.h1>

          <motion.p variants={moveUp(0.6)} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-19 lg:text-29 text-paragraph font-light leading-[1.285] max-w-[46ch] m-auto text-center">
            {t.description}
          </motion.p>
        </div>
      </div>

      <div className={`absolute top-20 lg:top-15 ${isArabic ? 'left-0 -scale-x-100' : 'right-0'} z-[-1]`}>
        <MotionImage width={500} height={1500} style={{ y: shapeY }} src="/assets/images/svg/sv-03.svg" alt="" className="w-[150px] lg:w-[500px]" />
      </div>
    </section>
  );
};

function Block({ src, size, fade }) {
  if (!src) return null;

  return (
    <div className={`${size} relative overflow-hidden`}>
      <AnimatePresence mode="popLayout">
        <motion.div key={src} className="absolute inset-0" initial={fade.initial} animate={fade.animate} exit={fade.exit} transition={{ duration: 5 }}>
          <Image width={1920} height={1000} src={src} className="w-full h-full object-cover" alt="" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EmpoweringCommunities;
