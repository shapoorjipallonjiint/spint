"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import { assets } from "../../../../assets/index";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const FocusArea = ({ data }) => {
    const MotionImage = motion.create(Image);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const isSyncingRef = useRef(false);
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

    function syncScroll(sourceEl, targetEl) {
        if (!sourceEl || !targetEl) return;
        const sourceScrollableHeight = sourceEl.scrollHeight - sourceEl.clientHeight;
        const targetScrollableHeight = targetEl.scrollHeight - targetEl.clientHeight;
        const sourceRatio = sourceScrollableHeight <= 0 ? 0 : sourceEl.scrollTop / sourceScrollableHeight;

        const targetTop = Math.round(sourceRatio * Math.max(0, targetScrollableHeight));

        window.requestAnimationFrame(() => {
            targetEl.scrollTop = targetTop;
        });
    }

    useEffect(() => {
        const left = leftRef.current;
        const right = rightRef.current;
        const wrapper = wrapperRef.current;
        const section = sectionRef.current;

        if (!left || !right || !wrapper || !section) return;

        function onLeftScroll() {
            if (isSyncingRef.current) return;
            isSyncingRef.current = true;
            syncScroll(left, right);
            requestAnimationFrame(() => {
                isSyncingRef.current = false;
            });
        }

        function onRightScroll() {
            if (isSyncingRef.current) return;
            isSyncingRef.current = true;
            syncScroll(right, left);
            requestAnimationFrame(() => {
                isSyncingRef.current = false;
            });
        }

        // Handle main scroll to control internal scroll
        function handleScroll() {
            const wrapperRect = wrapper.getBoundingClientRect();

            // Check if section is stuck at top
            if (wrapperRect.top <= 0 && wrapperRect.bottom > window.innerHeight) {
                // Calculate scroll progress within the wrapper
                const scrollProgress = Math.abs(wrapperRect.top) / (wrapper.offsetHeight - window.innerHeight);
                const maxScrollRight = right.scrollHeight - right.clientHeight;

                // Scroll the right column based on progress
                const targetScrollRight = scrollProgress * maxScrollRight;
                right.scrollTop = targetScrollRight;

                // Sync left column using the original sync function
                if (left) {
                    syncScroll(right, left);
                }
            }
        }

        left.addEventListener("scroll", onLeftScroll, { passive: true });
        right.addEventListener("scroll", onRightScroll, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });

        syncScroll(left, right);

        return () => {
            left.removeEventListener("scroll", onLeftScroll);
            right.removeEventListener("scroll", onRightScroll);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Calculate wrapper height based on content scroll height
    const itemCount = t.items.length;
    const wrapperHeight = `${itemCount * 100 + 100}vh`;

    useEffect(() => {
        if (isArabic) {
            document.documentElement.classList.add("is-ar");
        } else {
            document.documentElement.classList.remove("is-ar");
        }
    }, [isArabic]);

    return (
        <div ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
            <section className="sticky top-0 h-screen pt-text90 pb25 bg-f5f5 overflow-hidden" ref={sectionRef}>
                <div className="container relative h-full">
                    <div
                        className={`w-[800px] 2xl:w-[1016px] 3xl:w-[1316px] flex ${
                            isArabic
                                ? "justify-start lg:absolute 3xl:mr-auto right-0 lg:right-[120px] xl:right-[160px] 3xl:left-0"
                                : "justify-end lg:absolute 3xl:ml-auto left-0 lg:left-[120px] xl:left-[160px] 3xl:right-0"
                        }`}
                    >
                        <motion.h2
                            variants={moveUp(0.2)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className={`relative lg:before:absolute before:top-0 before:left-[-170px]
  before:w-[100px] before:h-[47px] before:2xl:h-[53px] before:3xl:h-[70px]
  before:bg-f5f5 before:z-10 bg-f5f5 z-10 w-full
  pl-0 xl:pl-[25px] 2xl:pl-[90px] 3xl:pl-[90px]
  text-60 font-light leading-[1.18] mb-5 lg:mb-8 xl:mb-[90px]
  ${isArabic ? "before:right-[-170px] before:left-auto pr-0 xl:pr-[25px] 2xl:pr-[90px] text-right" : ""}
`}
                        >
                            {t.title}
                        </motion.h2>
                    </div>

                    <div className="flex gap-6 xl:gap-[80px] justify-end relative z-[2]">
                        {/* Left column */}
                        <div
                            ref={leftRef}
                            className="max-h-screen overflow-y-auto scrollbar-hidden hidden lg:block lg:pt-[100px] 2xl:pt-25 3xl:pt-[180px] pb-12 xl:pb-20"
                        >
                            {t.items.map((area, i) => (
                                <div
                                    key={i}
                                    className={`pb-6 xl:pb-[63px] last:pb-6 last:xl:pb-[63px] flex items-start
  ${isArabic ? "items-end" : ""}
`}
                                    style={{ minHeight: "262px" }}
                                >
                                    <Image height={50} width={50} src={area.icon} alt={area.iconAlt} className="pt-2" />
                                </div>
                            ))}
                        </div>

                        {/* Right column */}
                        <div ref={rightRef} className="w-[1316px] pb-2 max-h-screen overflow-y-auto custom-scroll-left">
                            <div
                                className={`pl-2 lg:pl-10 2xl:pl-[107px] lg:pt-[100px] 2xl:pt-25 3xl:pt-[180px] pb-20 xl:pb-20
    ${isArabic ? "pr-2 lg:pr-10 2xl:pr-[107px] pl-0 text-right" : ""}
  `}
                            >
                                {t.items.map((area, i) => (
                                    <div key={i} className="flex gap-3 pb-6 xl:pb-[63px] last:pb-6 last:xl:pb-[63px]">
                                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 2xl:gap-[181px] justify-between w-full sdsdsd">
                                            <motion.div
                                                variants={moveUp(0.2 * i)}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ amount: 0.2, once: true }}
                                            >
                                                <div className="flex gap-3 lg:block items-center">
                                                    <Image
                                                        height={50}
                                                        width={50}
                                                        src={area.icon}
                                                        alt={area.iconAlt}
                                                        className="lg:hidden w-[32px] h-[32px] mb-3 lg:mb-5"
                                                    />
                                                    <p className="text-[18px] md:text-29 font-light mb-3 lg:mb-5 leading-[1.474]">
                                                        {area.title}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-19 font-light leading-[1.527] text-paragraph max-w-[42ch] 3xl:min-w-[41.3ch]">
                                                        {area.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                            <div className="relative overflow-hidden mb-3 xs:mb-0">
                                                <MotionImage
                                                    width={1920}
                                                    height={900}
                                                    variants={moveUp(0.2 * i)}
                                                    initial="hidden"
                                                    whileInView="show"
                                                    viewport={{ amount: 0.2, once: true }}
                                                    src={area.image}
                                                    alt={area.imageAlt}
                                                    className="w-full  object-cover h-[200px] lg:min-h-[262px]  min-w-[258px] lg:min-w-[358px] xl:min-w-[478px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute top-2/3 translate-y-[-1%] lg:top-1/2 lg:translate-y-[-20%] right-0 xl:left-0 z-[1]
    w-[150px] h-[714px] lg:w-[190px] lg:h-[714px]
    2xl:w-[250px] 2xl:h-[714px] 3xl:w-[510px] 3xl:h-[714px]
    ${isArabic ? "left-0 right-auto xl:right-0 xl:left-auto -scale-x-100" : ""}
  `}
                >
                    <Image height={714} width={510} style={{ y: shapeY }} src={assets.mainShape} alt="" />
                </div>
            </section>
        </div>
    );
};

export default FocusArea;
