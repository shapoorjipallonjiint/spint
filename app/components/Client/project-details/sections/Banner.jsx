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
import Link from "next/link";

const Banner = ({ firstSection, secondSection }) => {
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

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="pt-12 xl:pt-15  3xl:pt-30 pb-26 md:pb-38  lg:pb-[170px] xl:pb-[230px] bg-f5f5 2xl:pb-[232px]  ">
                <div className="container relative   z-[2]">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 lg:gap-0 ">
                        <motion.div
                            variants={paragraphItem}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                        >
                            <Link href={"/projects"}>
                                <Image
                                    src={"/assets/images/icons/arrow-right.svg"}
                                    width={26}
                                    height={26}
                                    alt={"left"}
                                    className="w-8 h-8 mb-5 rotate-180"
                                />
                            </Link>
                            <h1 className="text-40 2xl:text-70 font-light leading-[1.07] mb-3 lg:mb-5">
                                <SplitTextAnimation
                                    children={firstSection.title}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.3}
                                />
                            </h1>
                            <div className="text-20 2xl:text-29 font-light text-paragraph leading-[1.33]">
                                <SplitTextAnimation
                                    children={firstSection.subTitle}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.6}
                                />
                            </div>
                        </motion.div>
                        <div className="w-fit ml-auto">
                            <div className="text-[18px] font-light text-paragraph/70 leading-[1.8] border-b [border-image-source:linear-gradient(270deg,#1E45A2_0%,#30B6F9_100%)] [border-image-slice:1]">
                                <SplitTextAnimation
                                    children={secondSection?.sector?.name}
                                    staggerDelay={0.2}
                                    animationDuration={0.8}
                                    delay={0.8}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="container relative bottom-19 md:bottom-28 lg:bottom-[120px] xl:bottom-[150px] left-0 z-[2] overflow-hidden"
                ref={imageContainerRefTwo}
            >
                {/* <MotionImage onClick={() => setActiveImage(firstSection.coverImage)} style={{ y: imageY }} variants={fadeIn(0.6)} initial="hidden" animate="show" viewport={{ amount: 0.2, once: true }} src={firstSection.coverImage} width={1620} height={750} alt={firstSection.coverImageAlt}
          className="w-full h-[250px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px] object-cover scale-110" /> */}
                <div className="w-full h-62.5 lg:h-100 xl:h-125 2xl:h-150 3xl:h-[750px] bg-primary text-29 text-white flex items-center justify-center">
                    Image
                </div>
            </div>
            <div className="container relative md:bottom-[70px] bottom-10 left-0 2xl:pb-[50px]">
                {/* <motion.h2 variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-60 font-light mb-7  xl:mb-10  2xl:mb-[58px] leading-[1.17]">About Project</motion.h2> */}
                <H2Title titleText={secondSection.title} marginClass="mb-7 xl:mb-10 2xl:mb-[58px]" />
                <motion.div
                    variants={moveUp(0.4)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-[825px_1fr]  border-t border-black/20  "
                >
                    <div className="flex items-center  py-3 lg:py-6 border-b border-black/20 md:border-b-0">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Project:</p>
                        <p className="text-19 font-light   leading-[1.475] text-black">{firstSection.title}</p>
                    </div>
                    <div className="flex items-center  py-3 lg:py-6">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Location:</p>
                        <p className="text-19 font-light   leading-[1.475] text-black">
                            {secondSection.items.find((item) => item.key === "Location").value}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    variants={moveUp(0.6)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-[825px_1fr]  border-t border-black/20  "
                >
                    <div className="flex items-center  py-3 lg:py-6 border-b border-black/20 md:border-b-0">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Sector:</p>
                        <p className="text-19 font-light   leading-[1.475] text-black">{secondSection.sector?.name}</p>
                    </div>
                    <div className="flex items-center  py-3 lg:py-6">
                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Status:</p>
                        <p className="text-19 font-light   leading-[1.475] text-black">{secondSection?.status}</p>
                    </div>
                </motion.div>

                {secondSection.items
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
                                className={`grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-[825px_1fr] border-t border-black/20 last:border-b`}
                            >
                                {/* Left item */}
                                <div className="flex items-center py-3 lg:py-6 border-black/20 md:border-b-0 border-b">
                                    <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">
                                        {item?.key}:
                                    </p>
                                    <p className="text-19 font-light leading-[1.475] text-black">{item?.value}</p>
                                </div>

                                {/* Right item */}
                                {secondSection.items[i + 2] && (
                                    <div className="flex items-center py-3 lg:py-6">
                                        <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">
                                            {secondSection.items[i + 2]?.key}:
                                        </p>
                                        <p className="text-19 font-light leading-[1.475] text-black">
                                            {secondSection.items[i + 2]?.value}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}

                {/* <motion.div variants={moveUp(1)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-[825px_1fr]  border-t border-b border-black/20  ">
          <div className="flex items-center  py-3 lg:py-6 border-b border-black/20 md:border-b-0">
            <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Consultant:</p>
            <p className="text-19 font-light   leading-[1.475] text-black">{projectdetails.Consultant}</p>
          </div>
          <div className="flex items-center  py-3 lg:py-6">
            <p className="text-19 font-light text-paragraph leading-[1.475] min-w-[11.467ch]">Contract Model:</p>
            <p className="text-19 font-light   leading-[1.475] text-black">{projectdetails.Contractmodel}</p>
          </div>
        </motion.div> */}
            </div>
            <div className="absolute top-[61px] lg:-top-20 right-0 z-0">
                <Image
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
