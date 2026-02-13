"use client";
import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { assets } from "../../assets"
import H2Title from "./H2Title";
import VideoPlayer from "./VideoPlayer";
import { motion } from "framer-motion";
import { moveUp, moveLeft } from "@/app/components/motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import { usePathname } from "next/navigation";


const VdoSection = ({ data, maxW, maxtextwidth }) => {
  const MotionImage = motion.create(Image)

  const [enableAnim, setEnableAnim] = useState(false);
  const isArabic = useIsPreferredLanguageArabic()
  const t = useApplyLang(data)
  // Check screen size (Tablet >= 768px)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 992px)");
    const updateMatch = () => setEnableAnim(media.matches);

    updateMatch();
    media.addEventListener("change", updateMatch);

    return () => media.removeEventListener("change", updateMatch);
  }, []);

  // Inside your component:
  const containerRef = useRef < HTMLDivElement > (null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end 80%"]
  });
  const blurValue = useTransform(scrollYProgress,
    [0, 0.25, 0.75, 1],
    [20, 0, 0, 20]
  );

  const blur = useTransform(
    blurValue,
    (value) => `blur(${value}px)`
  );

  const dir = isArabic ? -1 : 1;
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.5, 1, 1.05, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [200, 0, 0, -200]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [-150 * dir, 0, 0, 150 * dir]
  );

  const rotateX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [45, 0, 0, -45]);
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [-25 * dir, 0, 0, 25 * dir]
  );

  const rotateZ = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [-8, 0, 0, 8]);



  // Parallax for shape
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  const pathname = usePathname();

  const showProfile = [
    "/services/mep",
    "/services/water",
    "/services/facade",
    "/services/interior-design",
  ].some((route) => pathname?.startsWith(route));

  console.log(pathname);


  return (
    <section className="relative sectm-100 pb30" ref={sectionRef}>
      {showProfile && (
        <div className="absolute inset-0 z-10 hidden lg:block">
          <div className="container">
            <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className={`flex flex-col 3xl:ml-[10%] 3xl:-mt-6 ${pathname === "/services/interior-design" ? "lg:-translate-y-[8%]" : ""}`}>
              <Image src={t.headProfilePic} alt={t.headProfilePicAlt} width={300} height={350} className="object-cover w-[200px] h-[220px] xl:w-[200px] xl:h-[210px] 2xl:w-[240px] 2xl:h-[245px] 3xl:w-[290px] 3xl:h-[290px]" />
              <motion.p variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-20 3xl:text-24 font-medium mt-1">{t.headName}</motion.p>
              <motion.p variants={moveUp(0.42)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-16 3xl:text-18 font-light leading-[1.2]">{t.headDesignation}</motion.p>
            </motion.div>
          </div>
        </div>
      )}

      <div className={`absolute top-custom-100 h-fit w-fit z-0 ${isArabic ? "left-0 lg:right-[-4%] xl:right-0 2xl:right-[-6%] 3xl:right-0" : "right-0 lg:left-[-4%] xl:left-0 2xl:left-[-6%] 3xl:left-0"}`}>
        <MotionImage width={1500} height={1000} style={{ y: shapeY }} variants={moveLeft(0.4)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} src={assets.mainShape2} alt="" className={`${isArabic && "-scale-x-100"} w-[152px] lg:w-[400px] xl:w-[55%] 2xl:w-[70%] 3xl:w-[100%] h-fit object-contain vdo-shape`} />
      </div>
      <div className="container">
        <div className={`w-full lg:max-w-[70%] xl:max-w-[100%] 2xl:max-w-[74%] 3xl:max-w-[70%] ${isArabic ? "mr-auto 2xl:ml-[137px]" : "ml-auto 2xl:mr-[137px]"} relative z-10 overflow-hidden vdo-content-wrapper`}>
          <div>
            <div className={`lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[700px] 3xl:max-w-[795px] ${isArabic ? "mr-auto" : "ml-auto"} mb-4 xl:mb-50px 3xl:mb-17 vdo-content`}>
              {/* <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}> */}
              <H2Title titleText={t.title} titleColor="black" marginClass="mb-3 md:mb-4 lg:mb-5 3xl:mb-10 " maxW={maxW} delay={1.2} />
              {/* </motion.div> */}
              {
                t.description.split("\n").map((item, i) => (
                  <motion.p key={i} variants={moveUp(1.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className={`${maxtextwidth} text-16 xl:text-19 leading-[1.473684210526316] font-light text-paragraph mb-4 xl:mb-8 last:mb-0`}>{item}</motion.p>
                ))
              }
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
            className="container-scroll-effect lg:max-w-[100%] mx-auto pt-1 2xl:pt-3">
            <VideoPlayer src={data.video} poster={data.poster} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default VdoSection;