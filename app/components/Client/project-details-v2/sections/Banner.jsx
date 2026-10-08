"use client";
import { useMediaQuery } from "react-responsive";
// import { projectdetails } from "../data";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeIn, moveUp, paragraphItem } from "../../../motionVarients";
import { useRef, useState } from "react";
import SplitTextAnimation from "../../../common/SplitTextAnimation";
import H2Title from "../../../common/H2Title";
import Image from "next/image";
import ImageLightbox from "../../../common/ImagePopup";
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

    // details grid: Location is shown separately above; BUA and Contract Model stay in the CMS but aren't shown.
    // Matched on the English label (raw data), so it works on the Arabic site too.
    const HIDDEN_DETAIL_KEYS = /^\s*(location|bua|contract\s*model)\b/i;
    const itemsWithoutLocation = tSecondSection.items.filter(
        (item, i) => !HIDDEN_DETAIL_KEYS.test(secondSection.items?.[i]?.key ?? item.key ?? ""),
    );
    // Location value, found by its English label so it also works on the Arabic site
    const locationIndex = (secondSection.items || []).findIndex((item) => /^\s*location\b/i.test(item?.key ?? ""));
    const locationValue = tSecondSection.items?.[locationIndex]?.value;
    const sectorValue = Array.isArray(tSecondSection?.sector)
        ? tSecondSection.sector.map((item) => item?.name).filter(Boolean).join(", ")
        : tSecondSection?.sector?.name;

    // subtitle under the title: the Engineering & Construction service title, else the MEP one, else the CMS subtitle.
    // Services are matched on the English name (raw data), so it works on the Arabic site too.
    const serviceTitle = (pattern) => {
        const index = (secondSection?.service || []).findIndex((s) => pattern.test(s?.serviceName ?? ""));
        return tSecondSection?.service?.[index]?.firstSection?.title?.trim() || "";
    };
    const bannerSubTitle =
        serviceTitle(/engineering|^\s*e\s*&\s*c\s*$|^\s*enc\s*$/i) || serviceTitle(/^\s*mep\b/i) || tFirstSection.subTitle;

    // About the Project grid, in reading order
    const details = [
        { label: "Project", value: tSecondSection?.project ? tSecondSection.project : tFirstSection.title },
        { label: "Location", value: locationValue },
        { label: "Sector", value: sectorValue },
        { label: "Status", value: tSecondSection?.status },
        ...itemsWithoutLocation.map((item) => ({ label: item?.key, value: item?.value })),
    ];

    // cover image first, then any additional cover images that actually have an image
    const bannerImages = [
        { src: tFirstSection?.coverImage, alt: tFirstSection?.coverImageAlt || tFirstSection?.title || "" },
        ...(tFirstSection?.additionalCoverImages || []).map((img) => ({
            src: img?.image,
            alt: img?.imageAlt || tFirstSection?.title || "",
        })),
    ].filter((img) => img.src);

    return (
        <section className="relative overflow-hidden" ref={sectionRef}>
            <div className="bg-f5f5 absolute top-0 left-0 w-full h-[250px] 3xl:h-[485px]"> </div>
            <div className="container relative z-[2] mt-80px mb-40px">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 lg:gap-0">
                    <motion.div
                        variants={paragraphItem}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                    >
                        {/* <button onClick={() => router.back()} className="cursor-pointer">
                                <Image
                                    src={"/assets/images/icons/arrow-right.svg"}
                                    width={26}
                                    height={26}
                                    alt={"left"}
                                    className={`w-8 h-8 mb-5 ${isArabic ? "" : "rotate-180"}`}
                                />
                            </button> */}
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
                                children={bannerSubTitle}
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

            <div className="container relative z-[2] overflow-hidden" ref={imageContainerRefTwo} >
                {bannerImages.length > 1 ? (
                    // several images: equal columns split by a 4px white line (the white background shows through the gap)
                    <motion.div
                        style={{ y: imageY }}
                        variants={fadeIn(0.6)}
                        initial="hidden"
                        animate="show"
                        className={`flex gap-[4px] bg-white w-full h-[250px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px] ${activeImage ? "pointer-events-none" : ""}`}
                    >
                        {bannerImages.map((img, i) => (
                            <div key={i} className="relative flex-1 min-w-0 h-full cursor-pointer" onClick={() => setActiveImage(img.src)}>
                                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1680px) 540px, 33vw" className="object-cover" />
                            </div>
                        ))}
                    </motion.div>
                ) : tFirstSection?.coverImage ? (
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
                        className={`w-full h-[250px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] 3xl:h-[750px] object-cover ${activeImage ? "pointer-events-none" : ""}`}
                    />
                ) : (
                    <div className="w-full h-62.5 lg:h-100 xl:h-125 2xl:h-150 3xl:h-[750px] bg-primary text-29 text-white flex items-center justify-center">
                        Image
                    </div>
                )}
            </div>
            <div className={`container my-80px relative `}>
                {/* <motion.h2 variants={moveUp(0.3)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-60 font-light mb-7  xl:mb-10  2xl:mb-[58px] leading-[1.17]">About Project</motion.h2> */}
                {/* <H2Title titleText={secondSection.title} marginClass="mb-7 xl:mb-10 2xl:mb-[58px]" /> */}
                <H2Title titleText={"About the Project"} marginClass="mb-50px" />
                {/* all details in one grid: 1 col on mobile, 2 from lg, 3 from 1280px. Each column is a label track (auto =
                    as wide as its longest label) + a value track, so values line up. Label/value gap: 30px, 50px from 1600px, 70px from 3xl (1680px) */}
                <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto_1fr] min-[1280px]:grid-cols-[auto_1fr_auto_1fr_auto_1fr] gap-x-[30px] min-[1600px]:gap-x-[50px] 3xl:gap-x-[70px] gap-y-3 xl:gap-y-[35px] border-t border-black/20 pt-3 xl:pt-[25px]">
                    {details.map((detail, i) => (
                        <motion.div
                            key={i}
                            variants={moveUp(0.4 + Math.min(i, 8) * 0.05)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            // spans one label + one value track of the parent grid (subgrid), so labels/values align per column
                            className="grid grid-cols-subgrid col-span-2 items-start"
                        >
                            <p className="text-19 font-light text-paragraph leading-[1.475]">{detail.label}:</p>
                            {/* end padding keeps the next column away from long values */}
                            <div className="text-19 font-light leading-[1.475] text-black pe-8">{detail.value}</div>
                        </motion.div>
                    ))}
                </div>
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
