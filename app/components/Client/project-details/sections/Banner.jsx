"use client";
import { useMediaQuery } from "react-responsive";
// import { projectdetails } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, moveUp, paragraphItem } from "../../../motionVarients";
import { useRef, useState } from "react";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import ImageLightbox from "../../../../components/common/ImagePopup";
import { useRouter } from "next/navigation";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const Banner = ({ firstSection, secondSection }) => {
    const tFirstSection = useApplyLang(firstSection);
    const tSecondSection = useApplyLang(secondSection);
    const isArabic = useIsPreferredLanguageArabic();
    const router = useRouter();
    const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
    const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
    const sectionRef = useRef(null);
    const imageContainerRefTwo = useRef(null);
    const MotionImage = motion.create(Image);
    const [activeImage, setActiveImage] = useState(null);

    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRefTwo,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], imageOffset);
    const hasAnimatedRef = useRef(false);

    const itemsWithoutLocation = tSecondSection.items.filter((item) => item.key !== "Location");

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="pt-12 xl:pt-15  3xl:pt-30 pb-26 md:pb-38  lg:pb-[170px] xl:pb-[230px] bg-f5f5 2xl:pb-[232px]  ">
                <div className="container relative   z-[2] sm:px-0">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 lg:gap-0">
                        <motion.div
                            variants={paragraphItem}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                        >
                            <button onClick={() => router.back()} className="cursor-pointer">
                                <Image
                                    src={"/assets/images/icons/arrow-right.svg"}
                                    width={26}
                                    height={26}
                                    alt={"left"}
                                    className={`w-8 h-8 mb-5 ${isArabic ? "" : "rotate-180"}`}
                                />
                            </button>
                            <h1 className="text-40 2xl:text-70 font-light leading-[1.07] mb-3 lg:mb-5">
                                <SplitTextAnimation
                                    children={tFirstSection.title}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.3}
                                />
                            </h1>
                            <div className="text-20 2xl:text-29 font-light text-paragraph leading-[1.33]">
                                <SplitTextAnimation
                                    children={tFirstSection.subTitle}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.6}
                                />
                            </div>
                        </motion.div>
                        <div className={`w-fit ${isArabic ? "mr-auto" : "ml-auto"}`}>
                            <motion.div variants={moveUp(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className="text-[18px] font-light text-paragraph/70 leading-[1.8] border-b [border-image-source:linear-gradient(270deg,#1E45A2_0%,#30B6F9_100%)] [border-image-slice:1]">
                                <SplitTextAnimation
                                    children={tSecondSection?.sector?.name}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.8}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="container relative bottom-19 md:bottom-28 lg:bottom-[120px] xl:bottom-[150px] left-0 z-[2] overflow-hidden"
                ref={imageContainerRefTwo}
            >
                {tFirstSection?.coverImage ? (
                    <MotionImage
                        onClick={() => setActiveImage(tFirstSection.coverImage)}
                        style={{ y: imageY }}
                        variants={fadeIn(0.6)}
                        initial={hasAnimatedRef.current ? false : "hidden"}
                        animate="show"
                        viewport={{ amount: 0.2, once: true }}
                        src={tFirstSection.coverImage}
                        onAnimationComplete={() => {
                            hasAnimatedRef.current = true;
                        }}
                        width={1620}
                        height={750}
                        alt={tFirstSection.coverImageAlt || tFirstSection.title}
                        className={`w-full h-[250px] lg:h-[400px] xl:h-[500px] 
                            2xl:h-[600px] 3xl:h-[750px] object-cover scale-110
                            ${activeImage ? "pointer-events-none" : ""}`}
                    />
                ) : (
                    <div className="w-full h-62.5 lg:h-100 xl:h-125 2xl:h-150 3xl:h-[750px] bg-primary text-29 text-white flex items-center justify-center">
                        Image
                    </div>
                )}
            </div>
            <div className={`container  relative md:bottom-[70px] bottom-10 ${isArabic ? "right-0" : "left-0"} 2xl:pb-[50px] md:px-0`}>
                {/* <motion.h2 variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-60 font-light mb-7  xl:mb-10  2xl:mb-[58px] leading-[1.17]">About Project</motion.h2> */}
                {/* <H2Title titleText={secondSection.title} marginClass="mb-7 xl:mb-10 2xl:mb-[58px]" /> */}
                <H2Title titleText={"About the Project"} marginClass="mb-7 xl:mb-10 2xl:mb-[58px]" />
                <motion.div
                    variants={moveUp(0.4)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[825px_1fr]  border-t border-black/20  "
                >
                    <div className="flex items-center  py-3 lg:py-6 border-b border-black/20 lg:border-b-0">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Project:</p>
                        <p className="text-19 font-light   leading-[1.475] text-black">{tSecondSection?.project == "" || tSecondSection?.project == undefined ? tFirstSection.title : tSecondSection?.project}</p>
                    </div>
                    <div className="flex items-center  py-3 lg:py-6">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch] lg:min-w-[15ch]">
                            Location:
                        </p>
                        <p className="text-19 font-light   leading-[1.475] text-black">
                            {tSecondSection.items.find((item) => item.key === "Location")?.value}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={moveUp(0.6)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[825px_1fr]  border-t border-black/20  "
                >
                    <div className="flex items-center  py-3 lg:py-6 border-b border-black/20 lg:border-b-0">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Sector:</p>
                        {Array.isArray(tSecondSection?.sector) ? tSecondSection?.sector?.map((item, i) => (
                            <div key={i} className="flex items-center">
                                <p className="text-19 font-light   leading-[1.475] text-black">{item.name}</p>
                                {i !== tSecondSection.sector?.length - 1 && <span>,&nbsp;</span>}
                            </div>
                        )) : <p className="text-19 font-light   leading-[1.475] text-black">{tSecondSection?.sector.name}</p>}
                    </div>
                    <div className="flex items-center  py-3 lg:py-6">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch] lg:min-w-[15ch]">
                            Status:
                        </p>
                        <p className="text-19 font-light   leading-[1.475] text-black">{tSecondSection?.status}</p>
                    </div>
                </motion.div>

                {/* {secondSection.items
                    .filter((item) => item.key !== "Location")
                    .map((item, i) => {
                        if (i % 2 !== 0) return null;

                        return (
                            <motion.div
                                key={item.key}
                                variants={moveUp(0.8)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className={`grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[825px_1fr] border-t border-black/20 last:border-b`}
                            >
    
                                <div className="flex items-center py-3 lg:py-6 border-black/20 lg:border-b-0 border-b">
                                    <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">
                                        {item?.key}:
                                    </p>
                                    <p className="text-19 font-light leading-[1.475] text-black">{item?.value}</p>
                                </div>

                                {secondSection.items[i + 2] && (
                                    <div className="flex items-center  py-3 lg:py-6">
                                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch] lg:min-w-[15ch]">
                                            {secondSection.items[i + 2]?.key}:
                                        </p>
                                        <p className="text-19 font-light leading-[1.475] text-black">
                                            {secondSection.items[i + 2]?.value}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })} */}

                {itemsWithoutLocation.map((item, i) => {
                    if (i % 2 !== 0) return null;

                    return (
                        <motion.div
                            key={item.key}
                            variants={moveUp(0.8)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[825px_1fr] border-t border-black/20 last:border-b"
                        >
                            {/* Left item */}
                            <div className="flex items-center py-3 lg:py-6 border-black/20 border-b lg:border-b-0">
                                <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">
                                    {item?.key}:
                                </p>
                                <p className="text-19 font-light leading-[1.475] text-black">{item?.value}</p>
                            </div>

                            {/* Right item */}
                            {itemsWithoutLocation[i + 1] && (
                                <div className="flex items-center py-3 lg:py-6">
                                    <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch] lg:min-w-[15ch]">
                                        {itemsWithoutLocation[i + 1]?.key}:
                                    </p>
                                    <p className="text-19 font-light leading-[1.475] text-black">
                                        {itemsWithoutLocation[i + 1]?.value}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            <div className="absolute top-[61px] lg:-top-20 right-0 z-0">
                <MotionImage
                    variants={moveUp(0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    width={1500}
                    height={1000}
                    src="/assets/images/project-details/bannerbg.svg"
                    alt=""
                    className="w-md200 h-[376px] lg:w-[577px] lg:h-[576px] object-fit"
                />
            </div>
            <ImageLightbox src={activeImage} alt="Certificate preview" onClose={() => setActiveImage(null)} />
        </section>
    );
};

export default Banner;
