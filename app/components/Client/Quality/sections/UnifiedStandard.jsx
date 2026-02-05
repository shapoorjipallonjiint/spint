"use client";
import { motion, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { assets } from "@/app/assets";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { moveUp } from "@/app/components/motionVarients";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const UnifiedStandard = ({ data }) => {
    const MotionImage = motion.create(Image);
    const imageParRef = useRef(null);
    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageParRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], [-150, 150]);
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);


 
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
        <section className="pt25  relative overflow-hidden bg-primary text-white">
            <div className="container"></div>
           <div className="flex gap-12 md:gap-[60px] 2xl:gap-[100px] 3xl:gap-[149px] items-end">
             <div
                ref={imageParRef}
                className={`  absolute lg:static
    -bottom-30 lg:bottom-0 
    w-fit h-fit
    ${
        isArabic
            ? "left-0 lg:right-[-180px] xl:right-[-170px] 2xl:right-[-19px] -scale-x-100"
            : "right-0 lg:left-[-180px] xl:left-[-170px] 2xl:left-[-19px]"
    }
  `}
            >
                <MotionImage
                    width={1000}
                    height={1000}
                    style={{ y: imageY }}
                    src={assets.mainShape2}
                    alt=""
                    className="object-contain w-[152px] h-[350px] lg:w-[325px] lg:h-[494px] xl:w-[965px] xl:h-[758px]"
                />
            </div>

            <div className="  pe-4 relative container lg:w-full " 
          style={
    isArabic
      ? { marginLeft: `${rightSpace}px` }
      : { marginRight: `${rightSpace}px` }
  }>
                <div
                    className={` ${
                        isArabic ? "mr-auto" : "ml-auto"
                    } h-auto`}
                >
                    <div className="flex flex-col gap-7 xl:gap-10 2xl:gap-[60px]">
                        {t.items.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={moveUp(0.4 + 1 * 0.15)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className={`${
                                    item.hasBorder ? "border-b border-cmnbdr  pb-[54px]" : ""
                                } relative mb-0 flex flex-col gap-4 xl:gap-[30px] pb-7 xl:pb-9 2xl:pb-[54px] last:!pb-8 last:md:!pb-11 last:xl:!pb-15 2xl:pb-22 last:3xl:!pb-25
border-b border-white/20 last:border-b-0`}
                            >
                                <button
                                    className={`w-full flex ${isArabic ? "text-right" : "text-left"} group transition-all duration-500 cursor-pointer`}
                                >
                                    <div className="flex flex-col gap-4 xl:gap-5 3xl:gap-[30px]">
                                        <Image
                                            src={item.logo}
                                            alt={"Image"}
                                            width={65}
                                            height={65}
                                            className="w-[45px] h-[45px] lg:w-[65px] lg:h-[65px]"
                                        />

                                        <h3 className="text-24 lg:text-60 3xl:text-60 leading-[1.166666666666667] font-normal letterspacing-2-5">
                                            {item.title}
                                        </h3>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    <motion.div key="content" className="overflow-hidden">
                                        <div className="">
                                            <motion.p
                                                variants={moveUp(0.001)}
                                                className="text-19 font-light leading-7  "
                                            >
                                                {item.description}
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
           </div>
        </section>
    );
};

export default UnifiedStandard;
