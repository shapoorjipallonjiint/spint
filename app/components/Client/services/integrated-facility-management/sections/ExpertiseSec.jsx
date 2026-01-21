"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import { assets } from "@/app/assets/index";
import H2Title from "@/app/components/common/H2Title";
import TabStyle1 from "@/app/components/common/TabStyle1";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
gsap.registerPlugin(ScrollTrigger);

const ExpertiseSec = ({ data }) => {
    
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const overlay = sectionRef.current.querySelector(".reveal-overlay4");
        if (!overlay) return;

        gsap.set(overlay, { xPercent: 0 });

        gsap.to(overlay, {
            xPercent: isArabic ? -100 : 100,
            duration: 2.7,
            ease: "expo.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 50%",
                toggleActions: "play none none none",
            },
        });
    }, [isArabic]);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
    const MotionImage = motion.create(Image);

    return (
        <section className="relative pt-text90 pb25 bg-primary text-white overflow-hidden" ref={sectionRef}>
            <div className="reveal-overlay4 absolute inset-0 bg-black/20 z-20"></div>
            <div
                className={`absolute bottom-0 ${
                    isArabic ? "left-0 -scale-x-100" : "right-0"
                } w-[359px] h-[625px] 3xl:w-[519px] 3xl:h-[725px]`}
            >
                <MotionImage width={1500} height={1000} style={{ y: shapeY }} src={assets.mainShape3} alt="" />
            </div>

            <div className="container relative z-[1]">
                {/* Header */}
                <div className="mb-50px">
                    <H2Title titleText={t.title} titleColor="white" marginClass="mb-4 " />
                    <motion.p
                        variants={moveUp(0.4)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.6, once: true }}
                        className="text-19 leading-[1.473684210526316] opacity-90 font-light max-w-5xl"
                    >
                        {t.description}
                    </motion.p>
                </div>
                <TabStyle1 data={t.items} />
            </div>
        </section>
    );
};

export default ExpertiseSec;
