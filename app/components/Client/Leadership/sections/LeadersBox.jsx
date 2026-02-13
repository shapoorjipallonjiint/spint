"use client";

import H2Title from "../../../../components/common/H2Title";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { assets } from "../../../../assets/index";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, fadeIn,moveLeft } from "../../../motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const LeaderBox = ({ data }) => {
    /* ---------------- NORMALIZED DATA ---------------- */
    // const normalizedData = [
    //     {
    //         name: data.name,
    //         position: data.designation,
    //         image: data.image,
    //         desc: data.description?.split("\n\n") || [],
    //     },
    //     {
    //         name: data.nameTwo,
    //         position: data.designationTwo,
    //         image: data.imageTwo,
    //         desc: data.descriptionTwo?.split("\n\n") || [],
    //     },
    // ];

    const MotionImage = motion.create(Image);

    /* ---------------- MEDIA QUERIES ---------------- */
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1280 });
    const isLaptop = useMediaQuery({ minWidth: 1280, maxWidth: 1600 });
    const isDesktop = useMediaQuery({ minWidth: 1550, maxWidth: 1920 });

    const imageOffset = isMobile
        ? [-10, 10]
        : isTablet
            ? [-20, 20]
            : isLaptop
                ? [-50, 50]
                : isDesktop
                    ? [-100, 100]
                    : [-200, 200];

    const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];

    /* ---------------- REFS ---------------- */
    const sectionRef = useRef(null);
    const imageContainerRef = useRef(null);

    /* ---------------- PARALLAX ---------------- */
    // const { scrollYProgress: imageProgress } = useScroll({
    //     target: imageContainerRefOne,
    //     offset: ["start end", "end start"],
    // });
    // const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"],
    }); // 👈 no target
    const imageY = useTransform(scrollYProgress, [0, 1], imageOffset);

    // const { scrollYProgress: imageProgress2 } = useScroll({
    //     target: imageContainerRefTwo,
    //     offset: ["start end", "end start"],
    // });
    // const image2Y = useTransform(imageProgress2, [0, 1], imageOffset);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: imageContainerRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);
    const isArabic = useIsPreferredLanguageArabic()
    const t = useApplyLang(data)

    console.log(t);


    return (
        <section className="relative" ref={sectionRef}>
            {/* <MotionImage
                width={1920}
                height={800}
                style={{ y: shapeY }}
                src={assets.mainShape2}
                alt="Decorative background shape "
                className={`absolute ${isArabic ? "left-0 -scale-x-100" : "right-0  lg:left-0"} top-10 md:top-20 xl:top-[20%] w-[150px] md:w-[30%] lg:w-[40%] 3xl:w-[764px]`}
            /> */}

            <div className="container">
                <div className=" border-cmnbdr relative overflow-hidden mb30" ref={imageContainerRef}>
                    {/* ================= LEADER ONE ================= */}


                    {t.map((item, index) => {
                        const isReverse = index % 2 !== 0;

                        return (
                            <div
                                key={index}
                                className={`grid  grid-cols-1 lg:grid-cols-2  2xl:grid-cols-2  
       last:pb-0  pb-10 3xl:pb-[100px] gap-y-6 lg:gap-y-10
        ${isReverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1 3xl:grid-cols-[auto_688px]" : "3xl:grid-cols-[688px_auto]"}
      `}
                            >
                                {/* IMAGE */}
                                <div className="relative flex flex-col justify-end">
                                    <MotionImage
                                        width={1000}
                                        height={1920}
                                        // style={{ y: imageY }}
                                        variants={moveLeft(0.3)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        src={item.image}
                                        alt={item.imageAlt}
                                        className={`relative w-fit object-contain z-20 ms-auto    lg:me-auto   3xl:me-auto  px-2 pb-4
          `}
                                    />

                                    <motion.div
                                        // style={{ y: imageY }}
                                        variants={fadeIn(0.2)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[75%] 3xl:h-[570px] w-full bg-primary z-10"
                                    />

                                    <motion.div
                                        // style={{ y: imageY }}
                                        variants={fadeIn(0.2)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[66%] w-full   z-30" style={{
                                            background:
                                                "linear-gradient(360deg, rgba(30, 69, 162, 1) 0%, rgba(30, 69, 162, 1) 5%, rgba(30, 69, 162, 0.88) 20%, rgba(30, 69, 162, 0) 100%)",
                                        }}

                                    />
                                </div>

                                {/* CONTENT */}
                                <div
                                    className={` lg:pt-[69px]  lg:ps-8 xl:ps-15 2xl:ps-17 3xl:ps-[80px]  `}
                                >
                                    <H2Title titleText={item.name} marginClass="mb-[10px]" />

                                    <motion.h3
                                        variants={moveUp(0.4)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        className="text-29 font-light leading-[1.344827586206897] text-paragraph mb-6 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-[45px]"
                                    >
                                        {item.designation}
                                    </motion.h3>

                                    <motion.div
                                     variants={moveUp(0.4)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.2, once: true }}
                                        className={` lg:max-h-[350px] xl:max-h-[450px] lg:overflow-y-auto scrollbar-thin scrollbar-pointer ${isArabic ? "pl-2" : "pr-2"}`}
                                        style={{ overscrollBehavior: "contain" }}
                                        onWheel={(e) => {
                                            const el = e.currentTarget;
                                            const { scrollTop, scrollHeight, clientHeight } = el;

                                            const isScrollable = scrollHeight > clientHeight;
                                            if (!isScrollable) return;

                                            const isAtTop = scrollTop <= 0;
                                            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                                            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) return;

                                            e.preventDefault();
                                            e.stopPropagation();

                                            const SCROLL_SPEED = 0.001;
                                            el.scrollTop += e.deltaY * SCROLL_SPEED;
                                        }}
                                    >
                                        {item.description?.split("\n").map((text, i) => (
                                            <p
                                                key={i}
                                                className="text-19 leading-[1.47] text-paragraph font-light lg:max-w-[58.7ch] mb-4 2xl:mb-7 last:mb-0"
                                            >
                                                {text}
                                            </p>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}


                </div>
            </div>
        </section>
    );
};

export default LeaderBox;
