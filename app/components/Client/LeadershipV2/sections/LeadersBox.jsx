"use client";

import H2Title from "../../../../components/common/H2Title";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
// import { assets } from "../../../../assets/index";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, fadeIn, moveLeft, paragraphItem } from "../../../motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const LeaderBox = ({data,big}) => {
    console.log(`data check ${data}`)
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

    // console.log(t);


    return (
        <section className="relative" ref={sectionRef}>
            <div className="container">
                <div className="border-b py-80px border-cmnbdr relative overflow-hidden " ref={imageContainerRef}>
                   {/* ================= LEADER ================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-[594px_auto] gap-y-6 lg:gap-y-10 gap-x-100px">

                        {/* IMAGE */}
                        {/* <div className="relative flex flex-col justify-end">

                            <MotionImage
                                width={1000}
                                height={1920}
                                variants={moveLeft(0.3)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                src={data.image}
                                alt={data.name}
                                className="relative w-fit object-contain z-20 ms-auto lg:me-auto 3xl:me-auto px-2 pb-4 max-h-[571px]"
                            />
                            {
                                
                            }
                            <motion.div
                                variants={fadeIn(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className={`absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[75%] ${big ? "3xl:h-[530px]" : "3xl:h-[410px]"}  w-full bg-linear-to-b from-[#0079BA] to-[#003792] z-10`}
                            />

                            <motion.div
                                variants={fadeIn(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className={`absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[75%] ${big ? "3xl:h-[530px]" : "3xl:h-[410px]"} w-full z-30`}
                                style={{ background: "linear-gradient(360deg, rgba(30, 69, 162, 1) 0%, rgba(30, 69, 162, 1) 5%, rgba(30, 69, 162, 0.88) 20%, rgba(30, 69, 162, 0) 100%)",
                                }}
                            />

                        </div> */}

                        <div className="relative flex flex-col items-center justify-end w-full max-w-[594px] overflow-x-hidden">

                            <MotionImage
                                width={1000}
                                height={1920}
                                variants={moveLeft(0.3)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                src={data.image}
                                alt={data.name}
                                className={`relative z-20 mx-auto block h-auto w-auto max-w-full object-contain object-bottom 
                                    ${big
                                        ? "max-h-[571.67px] 3xl:h-[571.67px]"
                                        : "max-h-[470px] 3xl:h-[470px]"
                                    }`}
                                style={{
                                    WebkitMaskImage: "linear-gradient(to bottom, #000 35.6%, transparent 100%)",
                                    maskImage: "linear-gradient(to bottom, #000 35.6%, transparent 100%)",
                                }}
                            />

                            {/* Blue gradient box: 594 x 530, flush with the image bottom */}
                            <motion.div
                                variants={fadeIn(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className={`absolute bottom-0 left-0 w-full z-10 bg-linear-to-b from-[#0079BA] to-[#003792] h-[80%] lg:h-[70%] xl:h-[75%] 
                                    ${big ? "3xl:h-[530px]" : "3xl:h-[410px]"
                                    }`}
                            />
                        </div>


                        {/* RIGHT CONTENT */}
                        <div className="">
                            <H2Title titleText={t?.name} marginClass="mb-[10px]" />
                            <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="text-29 font-light leading-[1.344827586206897] text-paragraph mb-6 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-[45px]"
                            >
                                {data.designation}
                            </motion.h3>

                            <div className="description">
                                {data.description &&
                                    <motion.div variants={fadeIn(0.6)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-19 leading-[1.47] text-paragraph font-light [&>p]:mb-4 [&>p]:2xl:mb-7 [&>p]:last:mb-0"
                                     dangerouslySetInnerHTML={{ __html: data.description }}>
                                    </motion.div>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeaderBox;
