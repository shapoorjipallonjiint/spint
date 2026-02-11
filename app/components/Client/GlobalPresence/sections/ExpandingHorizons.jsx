"use client";

import H2Title from "../../../../components/common/H2Title";
import { assets } from "../../../../assets";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import { useRef,useEffect,useState } from "react";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const ExpandingHorizons = ({ data }) => {
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const sectionRef = useRef(null);
    const MotionImage = motion.create(Image);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
   const [rightSpace, setRightSpace] = useState(0);

  useEffect(() => {
    function updateSpace() {
      const container = document.querySelector(".container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const space = window.innerWidth - rect.right;

      setRightSpace(space);
    }

    updateSpace();
    window.addEventListener("resize", updateSpace);

    return () => window.removeEventListener("resize", updateSpace);
  }, []);
    return (
        <section className="relative overflow-hidden pt-text25  " ref={sectionRef}>
            
 
            <div className="">
                <div>
                    <div className="flex gap-10 lg:gap-18 2xl:gap-25">
                        <div
                className={`hidden md:block bottom-[-10px] lg:bottom-0 w-fit ${
                    isArabic ? "left-0 lg:right-0" : "right-0 lg:left-0"
                }`}
            >
                <MotionImage
                    height={1200}
                    width={563}
                    style={{ y: shapeY }}
                    src={assets.mainShape2}
                    alt=""
                    className={`w-[150px] lg:w-[350px] 3xl:w-full h-auto   object-contain relative `}
                />
            </div>
                        <div
                            className={`container lg:w-full   lg:max-w-[65%] 2xl:max-w-[74%] 3xl:max-w-[73.84%] ps-0 pe-4` }  style={
    isArabic
      ? { marginLeft: `${rightSpace}px` }
      : { marginRight: `${rightSpace}px` }
  }
                        >
                            {/* <h2 className="text-60 font-light leading-[1.166666666666667] mb-50px max-w-[22ch]">{data.title}</h2> */}
                            <H2Title
                                titleText={t.title}
                                titleColor="black"
                                marginClass="mb-4 md:mb-6 2xl:mb-50px"
                                maxW="xl:max-w-[32ch] 3xl:max-w-[22ch]"
                                delay={1.6}
                            />
                            {
                                <motion.p
                                    variants={moveUp(0.8)}
                                    initial="hidden"
                                    whileInView={"show"}
                                    viewport={{ amount: 0.2, once: false }}
                                    className="pb25 mb-4 xl:mb-8 last:mb-0 text-19 lg:text-20 3xl:text-29 font-light leading-[1.35] text-paragraph xl:max-w-[60ch] 3xl:max-w-[48ch]"
                                >
                                    {t.description}
                                </motion.p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExpandingHorizons;
