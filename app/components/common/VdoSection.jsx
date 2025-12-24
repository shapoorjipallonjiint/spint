"use client";
import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { assets } from "../../assets";
import H2Title from "./H2Title";
import VideoPlayer from "./VideoPlayer";
import { motion } from "framer-motion";
import { moveUp } from "../motionVarients";
import Image from "next/image";

const VdoSection = ({ data, maxW, maxtextwidth }) => { 
  const [enableAnim, setEnableAnim] = useState(false);
  const MotionImage = motion.create(Image);

  // Check screen size (Tablet >= 768px)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 992px)");
    const updateMatch = () => setEnableAnim(media.matches);

    updateMatch();
    media.addEventListener("change", updateMatch);

    return () => media.removeEventListener("change", updateMatch);
  }, []);

  // Inside your component:
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const blurValue = useTransform(scrollYProgress,
    [0, 0.35, 0.75, 1],
    [20, 0, 0, 0]
  );

  const blur = useTransform(
    blurValue,
    (value) => `blur(${value}px)`
  );

  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.5, 1.05, 1.05, 1.05]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [200, 0, 0, 0]);
  const x = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-150, 0, 0, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [45, 0, 0, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-25, 0, 0, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-8, 0, 0, 0]);


  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  return (
    <section className="relative overflow-hidden pt-text25 pb-120" ref={sectionRef}>
      <div className="absolute bottom-40 lg:bottom-[54px] 3xl:bottom-[-30px] right-0 lg:left-[-200px] xl:left-[-22%] 2xl:left-[-116px] 3xl:left-[-58px] h-fit w-fit z-0 ">
        <MotionImage height={1000} width={1920} style={{ y: shapeY }} src={assets.mainShape2} alt="" className="w-[152px] lg:w-[400px] xl:w-[500px] 3xl:w-[100%] h-auto 3xl:h-[954px] max-w-[681px] object-contain" />
      </div>
      <div className="container">
        <div className="w-full lg:max-w-[80%] xl:max-w-[1000px]  3xl:max-w-[1238px] mx-auto relative z-10 overflow-hidden">
          <div>
            <div className="lg:max-w-[680px] xl:max-w-[895px] 2xl:max-w-[757px] 3xl:max-w-[880px] ml-auto mb-50px 3xl:mb-17">
              {/* <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}> */}
                <H2Title titleText={data.title} titleColor="black" marginClass="mb-50px " maxW={maxW} delay={1.2} />
              {/* </motion.div> */}
              {/* {
                data.desc.map((item, i) => (
                  <motion.p key={i} variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className={`${maxtextwidth} text-19 leading-[1.473684210526316] font-light text-paragraph mb-4 xl:mb-8 last:mb-0`}>{item}</motion.p>
                ))
              } */}
              <motion.p variants={moveUp(1.8)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className={`${maxtextwidth} text-19 leading-[1.473684210526316] font-light text-paragraph`}>{data.description}</motion.p>
            </div>
          </div>
          <motion.div ref={containerRef} 
            style={
              enableAnim
                ? {
                  scale,
                  y,
                  x,
                  rotateX,
                  rotateY,
                  rotateZ,
                  filter: blur,
                  transformPerspective: 1500,
                  transformStyle: "preserve-3d",
                }
                : {}
            }
            className="container-scroll-effect lg:max-w-[100%] mx-auto">
            <VideoPlayer src={data.video} vdoAlt={data.videoAlt} poster={data.videoPosterImage} posterAlt={data.videoPosterImageAlt} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default VdoSection;