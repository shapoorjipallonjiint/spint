"use client"

import { assets } from "../../../../assets/index"
import SplitTextAnimation from "../../../common/SplitTextAnimation"
import { motion } from "framer-motion"
import { moveUp } from "../../../motionVarients"
import Image from 'next/image'
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const Banner = ({data}) => {
  const MotionImage = motion.create(Image)
  const isArabic = useIsPreferredLanguageArabic()
  const t = useApplyLang(data)

  return ( 
    <section className="py-11 xl:py-15 2xl:py-22 3xl:pt-[171px] 3xl:pb-[76px] mb-12 xl:mb-10 3xl:mb-18 bg-f5f5 relative overflow-hidden">
      <MotionImage width={1920} height={800} src={assets.mainShape2} alt="" className={`absolute -bottom-15 md:bottom-7 ${isArabic ? "-left-2 -scale-x-100" : "-right-2"}   w-[150px] md:w-[327px] lg:w-[327px] 3xl:w-[487px] h-fit`} />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[830px_auto] gap-5 lg:gap-0">
          <div >
            <h1 className="text-70 font-light leading-[1.071428571428571]">
              <SplitTextAnimation children={t.pageTitle} staggerDelay={0.2} animationDuration={0.8} delay={0.2}/>
            </h1>
          </div>
          <div className={isArabic ? "lg:pr-8  xl:pr-15 2xl:pr-17 3xl:pr-0" : "lg:pl-8  xl:pl-15 2xl:pl-17 3xl:pl-0"}>
            <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-29 leading-[1.344827586206897] font-light mb-3 xl:mb-5">{t?.pageSubTitle}</motion.h3>
            <motion.p variants={moveUp(0.6)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-19 leading-[1.473684210526316] text-paragraph font-light max-w-xl">{t?.pageDescription}</motion.p>
          </div>
        </div>
      </div>
    </section>
   );
}
 
export default Banner;