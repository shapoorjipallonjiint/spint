// "use client";

// import { useState, useEffect } from "react";
// import { useMediaQuery } from "react-responsive";
// import { moveUp } from "../motionVarients";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import H2Title from "./H2Title";

// gsap.registerPlugin(ScrollTrigger);
// const ImgPointsComponent = ({ data, bgColor, sectionSpacing }) => {
//   console.log(data, "F")
//   const isMob = useMediaQuery({ maxWidth: 767 }); // < 768
//   const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
//   const { title, image, points } = data;
//   const [activeIndex, setActiveIndex] = useState(null); // selected item
//   const [hoverIndex, setHoverIndex] = useState(null); // hovered item
//   const [isMobile, setIsMobile] = useState(false);

//   const imageContainerRefTwo = useRef(null);
//   const textContentRef = useRef(null);
//   const imageOffset = isMob ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
//   // Parallax for main image
//   const { scrollYProgress: imageProgress } = useScroll({
//     target: imageContainerRefTwo,
//     offset: ["start end", "end start"]
//   });
//   const imageY = useTransform(imageProgress, [0, 1], imageOffset);

//   // detect screen size to determine mobile vs desktop behavior
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.matchMedia("(max-width: 1023px)").matches); // below xl breakpoint
//     };
//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);
//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   // logic to determine active state
//   const getIsActive = (index) =>
//     isMobile
//       ? activeIndex === index // on mobile: only clicked item
//       : hoverIndex === index || (hoverIndex === null && activeIndex === index); // on desktop: hover or clicked

//   return (
//     <section className={`w-full bg-${bgColor} text-black ${sectionSpacing}`}>
//       <div className="container">
//         <motion.div variants={moveUp(0.2)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}>
//           <H2Title titleText={title} titleColor="black" marginClass="mb-50px 3xl:mb-17" />
//         </motion.div>
//         <div className="grid lg:grid-cols-[0.8fr_1fr] 2xl:grid-cols-[730px_auto] 3xl:grid-cols-[916px_auto] xl:items-center gap-8 xl:gap-10 3xl:gap-[108px] transition-all duration-300">
//           {/* Left Side - Image */}
//           <div className="flex-shrink-0 relative overflow-hidden h-[250px] md:h-[300px] lg:h-full transition-all duration-300" ref={imageContainerRefTwo}>
//             <motion.img
//               style={{ y: imageY }}
//               src={image}
//               alt="Workplace environment"
//               className="object-cover w-full   lg:w-full h-[250px] md:h-[300px] lg:h-full scale-110 md:scale-150 lg:scale-110"
//             />
//           </div>

//           {/* Right Side - Text Content */}
//           <motion.div
//             ref={textContentRef}
//             // style={{ y: textY }}
//             className="flex flex-col justify-start w-full transition-all duration-300"
//           >
//             <div className="flex flex-col border-t border-b border-black/20 3xl:max-w-[50ch]">
//               {points.map((point, index) => {
//                 const isActive = getIsActive(index);
//                 return (
//                   <motion.div variants={moveUp(0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}
//                     key={index}
//                     onMouseEnter={() => !isMobile && setHoverIndex(index)}
//                     onMouseLeave={() => !isMobile && setHoverIndex(null)}
//                     onClick={() => setActiveIndex(index)}
//                     className="border-b border-black/20 last:border-b-0 py-5 xl:pt-[32px] xl:pb-[31px] last:xl:pb-[22px] pr-2"
//                   >
//                     <div
//                       className={`relative text-24 2xl:text-29 leading-[1.34] cursor-pointer select-none transition-all duration-300 ${isActive ? "text-black font-semibold xl:font-bold" : "text-paragraph font-light"}`} >
//                       {/* Animate-in left border without pushing layout */}
//                       <span
//                         className={`absolute left-0 top-0 h-full w-[3px] transition-transform duration-300 ${isActive || hoverIndex === index ? "bg-secondary scale-y-100" : "bg-transparent scale-y-0"}`}
//                         style={{ transformOrigin: "top" }}
//                       ></span>

//                       {/* Animate movement visually instead of padding */}
//                       <span
//                         className={`   inline-block transition-transform duration-300 max-w-[95%] ${isActive || hoverIndex === index
//                           ? "translate-x-[20px] xl:translate-x-[43px]"
//                           : "translate-x-0"
//                           }`}
//                       >
//                         {point}
//                       </span>
//                     </div>

//                   </motion.div>
//                 );
//               })}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ImgPointsComponent;



"use client";

import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { moveUp } from "../motionVarients";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import H2Title from "./H2Title";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ImgPointsComponent = ({ data, bgColor, sectionSpacing }) => {
    const MotionImage = motion.create(Image);
    const isMob = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    /* BACKEND DATA NORMALIZATION (NO LOGIC CHANGE) */
    const normalizedData = {
        title: data?.title,
        image: data?.image ?? data?.items?.[0]?.image,
        points: data?.points ?? data?.items?.map((item) => item.title) ?? [],
    };

    /* ORIGINAL CONTRACT — UNCHANGED */
    const { title, image, points } = normalizedData;

    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const imageContainerRefTwo = useRef(null);
    const textContentRef = useRef(null);

    const imageOffset = isMob ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];

    const { scrollYProgress: imageProgress } = useScroll({
        target: imageContainerRefTwo,
        offset: ["start end", "end start"],
    });

    const imageY = useTransform(imageProgress, [0, 1], imageOffset);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
        };
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const getIsActive = (index) =>
        isMobile ? activeIndex === index : hoverIndex === index || (hoverIndex === null && activeIndex === index);

    const images = data?.items?.map((item) => item.image) ?? [];

    const currentIndex = hoverIndex !== null ? hoverIndex : activeIndex;

    const currentImage = images[currentIndex] ?? image;

    return (
        <section className={`w-full bg-${bgColor} text-black ${sectionSpacing}`}>
            <div className="container">
                <motion.div
                    variants={moveUp(0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                >
                    <H2Title titleText={title} titleColor="black" marginClass="mb-50px 3xl:mb-17" />
                </motion.div>

                <div className="grid lg:grid-cols-[0.8fr_1fr] 2xl:grid-cols-[730px_auto] 3xl:grid-cols-[916px_auto] xl:items-center gap-8 xl:gap-10 3xl:gap-[70px] transition-all duration-300">
                    {/* Image */}
                    <div
                        ref={imageContainerRefTwo}
                        className="flex-shrink-0 relative overflow-hidden h-[250px] md:h-[300px] lg:h-full transition-all duration-300"
                    >
                        <MotionImage
                            style={{ y: imageY }}
                            src={currentImage}
                            height={1000}
                            width={1920}
                            alt=""
                            className="object-cover w-full lg:w-full h-[250px] md:h-[300px] lg:h-full scale-110 md:scale-150 lg:scale-110"
                        />
                    </div>

                    {/* Text */}
                    <motion.div
                        ref={textContentRef}
                        className="flex flex-col justify-start w-full transition-all duration-300"
                    >
                        <div className="flex flex-col border-t border-b border-black/20 3xl:max-w-[50ch]">
                            {points.map((point, index) => {
                                const isActive = getIsActive(index);

                                return (
                                    <motion.div
                                        key={index}
                                        variants={moveUp(0.2 * index)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.2, once: true }}
                                        onMouseEnter={() => !isMobile && setHoverIndex(index)}
                                        onMouseLeave={() => !isMobile && setHoverIndex(null)}
                                        onClick={() => setActiveIndex(index)}
                                        className="border-b border-black/20 last:border-b-0 py-5 xl:pt-[32px] xl:pb-[31px] last:xl:pb-[22px] pr-2"
                                    >
                                        <div
                                            className={`relative text-24 2xl:text-29 leading-[1.34] cursor-pointer select-none transition-all duration-300 ${
                                                isActive
                                                    ? "text-black font-semibold xl:font-bold"
                                                    : "text-paragraph font-light"
                                            }`}
                                        >
                                            <span
                                                className={`absolute left-0 top-0 h-full w-[3px] transition-transform duration-300 ${
                                                    isActive || hoverIndex === index
                                                        ? "bg-secondary scale-y-100"
                                                        : "bg-transparent scale-y-0"
                                                }`}
                                                style={{ transformOrigin: "top" }}
                                            />

                                            <span
                                                className={`inline-block transition-transform duration-300 max-w-none tracking-tight ${
                                                    isActive || hoverIndex === index
                                                        ? "translate-x-[20px] xl:translate-x-[43px]"
                                                        : "translate-x-0"
                                                }`}
                                            >
                                                {point}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ImgPointsComponent;
