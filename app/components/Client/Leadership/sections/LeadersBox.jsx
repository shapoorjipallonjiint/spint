// "use client"

// import H2Title from "../../../../components/common/H2Title";
// import {useRef} from "react";
// import { useMediaQuery } from "react-responsive";
// import {assets} from "../../../../assets/index";
// import { motion, useScroll ,useTransform } from "framer-motion";
// import { moveUp, fadeIn } from "../../../motionVarients";
// import Image from 'next/image'

// const LeaderBox = ({ data }) => {
//   const normalizedData = [
//     {
//       name: data.name,
//       position: data.designation,
//       image: data.image,
//       desc: data.description?.split("\n\n") || [],
//     },
//     {
//       name: data.nameTwo,
//       position: data.designationTwo,
//       image: data.imageTwo,
//       desc: data.descriptionTwo?.split("\n\n") || [],
//     },
//   ];
//   const MotionImage = motion.create(Image)

//   const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
//   const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
//   const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
//   const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
//   const sectionRef = useRef(null)
//   const imageContainerRefOne = useRef(null);
//   const imageContainerRefTwo = useRef(null);
//   const scrollRef1 = useRef(null);
//   const scrollRef2 = useRef(null);

//   // Parallax for main image container
//   const { scrollYProgress: imageProgress } = useScroll({
//     target: imageContainerRefOne,
//     offset: ["start end", "end start"]
//   });
//   const imageY = useTransform(imageProgress, [0, 1], imageOffset);

//   const { scrollYProgress: imageProgress2 } = useScroll({
//     target: imageContainerRefTwo,
//     offset: ["start end", "end start"]
//   });
//   const image2Y = useTransform(imageProgress2, [0, 1], imageOffset);

//   const { scrollYProgress: shapeProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"]
//   });
//   const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);

//   // Handle scroll for description boxes
//   const handleScroll = (e) => {
//     e.stopPropagation();
//   };

//   const handleWheel = (e) => {
//     const element = e.currentTarget;
//     const { scrollTop, scrollHeight, clientHeight } = element;
//     const isScrollable = scrollHeight > clientHeight;

//     if (!isScrollable) return;

//     const isAtTop = scrollTop === 0;
//     const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

//     // Only prevent default if we're in the middle of scrolling or can scroll in that direction
//     if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
//       e.preventDefault();
//       e.stopPropagation();
//       element.scrollTop += e.deltaY;
//     }
//   };

//   const handleTouchMove = (e) => {
//     e.stopPropagation();
//   };

//   return (
//     <section className="relative" ref={sectionRef}>
//         <MotionImage width={1920} height={800} style={{y:shapeY}} src={assets.mainShape2} alt="" className="absolute right-0 lg:left-0 bottom-10 md:bottom-20 xl:bottom-49 w-[150px] md:w-[30%] lg:w-[40%] 3xl:w-[764px]" />
//       <div className="container">
//        <div className="border-b border-cmnbdr relative overflow-hidden mb-5 xl:mb-20 2xl:mb-25">
//           <div className="grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[739px_auto] pt-5 lg:pt-10 3xl:pt-18 pb-10 3xl:pb-[135px] gap-y-6 lg:gap-y-10">
//             <div className="relative flex flex-col justify-end" ref={imageContainerRefOne}>
//               <MotionImage height={1920} width={1000} style={{ y: imageY }} variants={fadeIn(0.6)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} src={normalizedData[0].image} alt={normalizedData[0].name}
//                className="relative w-fit object-contain mr-auto ml-3 lg:ml-auto 2xl:ml-3 3xl:ml-auto lg:mr-2 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px] max-w-[710px]" />
//               <motion.div style={{y:imageY}} variants={fadeIn(0.2)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[80%] 3xl:h-[612px] w-full bg-primary z-10"></motion.div>
//               <motion.div style={{y:imageY}} variants={fadeIn(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"></motion.div>
//             </div>
//             <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[68.5px] lg:pl-8  xl:pl-15 2xl:pl-17 3xl:pl-[97px]">
//               <H2Title titleText={normalizedData[0].name} marginClass={"mb-[10px]"} />
//               <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="text-29 font-light text-paragraph leading-[1.344827586206897] mb-6 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-[45px]">{normalizedData[0].position}</motion.h3>
//               <div
//                 ref={scrollRef1}
//                 className="md:max-h-[200px] lg:max-h-[250px] xl:max-h-[385px] lg:overflow-y-scroll scrollbar-thin scrollbar-pointer pr-2"
//                 style={{ overscrollBehavior: 'contain' }}
//                 onScroll={handleScroll}
//                 onWheel={handleWheel}
//                 onTouchMove={handleTouchMove}
//               >
//                 {normalizedData[0].desc.map((item, index) => (
//                   <motion.div variants={moveUp(0.6 + 0.2*index)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} key={index} className="">
//                     <p className="text-19 leading-[1.473684210526316] text-paragraph font-light lg:max-w-[52ch] mb-4 2xl:mb-7">{item}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="xs:mt-10 md:mt-30 lg:mt-10 2xl:mt-17 3xl:mt-[135px] grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[793px_auto] gap-6 md:gap-10 xl:gap-15 2xl:gap-17 3xl:gap-[88px] pb-10 xl:pb-25 3xl:pb-[135px]">
//             <div className="relative lg:order-2 " ref={imageContainerRefTwo}>
//               <motion.img style={{y:image2Y}} variants={fadeIn(0.6)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} src={normalizedData[1].image} alt={normalizedData[1].name} className="relative w-fit ml-auto mr-3 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px]" />
//               <motion.div style={{y:image2Y}} className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[80%] 3xl:h-[612px] w-full bg-primary z-10"></motion.div>
//               <motion.div style={{ y: image2Y }} className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"></motion.div>
//             </div>
//             <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[68.5px] lg:pl-8 xl:pl-15 2xl:pl-17 3xl:pl-[97px]">
//               <H2Title titleText={normalizedData[1].name} marginClass={"mb-[10px]"} />
//               <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="text-29 font-[400] leading-[1.344827586206897] text-paragraph mb-6 lg:mb-8 xl:mb-[45px]">{normalizedData[1].position}</motion.h3>
//               <div
//                 ref={scrollRef2}
//                 className="md:max-h-[200px] lg:max-h-[250px] xl:max-h-[385px] lg:overflow-y-scroll scrollbar-thin scrollbar-pointer pr-2"
//                 style={{ overscrollBehavior: 'contain' }}
//                 onScroll={handleScroll}
//                 onWheel={handleWheel}
//                 onTouchMove={handleTouchMove}
//               >
//                 {normalizedData[1].desc.map((item, index) => (
//                   <motion.div variants={moveUp(0.6 + 0.2*index)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} key={index} className="">
//                     <p className="text-19 leading-[1.473684210526316] text-paragraph font-light lg:max-w-[54ch] mb-4 2xl:mb-7">{item}</p>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>

//           </div>
//        </div>
//       </div>
//     </section>
//   );
// }

// export default LeaderBox;

"use client";

import H2Title from "../../../../components/common/H2Title";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { assets } from "../../../../assets/index";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, fadeIn } from "../../../motionVarients";
import Image from "next/image";

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

    return (
        <section className="relative" ref={sectionRef}>
            <MotionImage
                width={1920}
                height={800}
                style={{ y: shapeY }}
                src={assets.mainShape2}
                alt="Decorative background shape"
                className="absolute right-0 lg:left-0 bottom-10 md:bottom-20 xl:bottom-49 w-[150px] md:w-[30%] lg:w-[40%] 3xl:w-[764px]"
            />

            <div className="container">
                <div className=" border-cmnbdr relative overflow-hidden mb-5 xl:mb-20 2xl:mb-25" ref={imageContainerRef}>
                    {/* ================= LEADER ONE ================= */}
                    {/* {data.items.map((item,index)=>(
                        <div key={index} className="grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[739px_auto] pt-5 lg:pt-10 3xl:pt-18 pb-10 3xl:pb-[135px] gap-y-6 lg:gap-y-10">
                        <div className="relative flex flex-col justify-end">
                            <MotionImage
                                width={1000}
                                height={1920}
                                style={{ y: imageY }}
                                variants={fadeIn(0.6)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                src={item.image}
                                alt={item.imageAlt}
                                className="relative w-fit object-contain mr-auto ml-3 lg:ml-auto 2xl:ml-3 3xl:ml-auto lg:mr-2 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px] max-w-[710px]"
                            />

                            <motion.div
                                style={{ y: imageY }}
                                variants={fadeIn(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[80%] 3xl:h-[612px] w-full bg-primary z-10"
                            />

                            <motion.div
                                style={{ y: imageY }}
                                variants={fadeIn(0.4)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"
                            />
                        </div>

                        <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[68.5px] lg:pl-8 xl:pl-15 2xl:pl-17 3xl:pl-[97px]">
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

                            <div
                                className="md:max-h-[200px] lg:max-h-[250px] xl:max-h-[385px] lg:overflow-y-auto scrollbar-thin scrollbar-pointer pr-2"
                                style={{ overscrollBehavior: "contain" }}
                                onWheel={(e) => {
                                    const el = e.currentTarget;
                                    const { scrollTop, scrollHeight, clientHeight } = el;

                                    const isScrollable = scrollHeight > clientHeight;
                                    if (!isScrollable) return;

                                    const isAtTop = scrollTop <= 0;
                                    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                                    // ⬆️ At top & scrolling up → let page scroll
                                    if (isAtTop && e.deltaY < 0) {
                                        return;
                                    }

                                    // ⬇️ At bottom & scrolling down → let page scroll
                                    if (isAtBottom && e.deltaY > 0) {
                                        return;
                                    }

                                    // 🔒 Scroll inside content (slowed)
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const SCROLL_SPEED = 0.001;
                                    el.scrollTop += e.deltaY * SCROLL_SPEED;
                                }}
                            >
                                {item.description.split('\n').map((item, index) => (
                                    <p
                                        key={index}
                                        className="text-19 leading-[1.473684210526316] text-paragraph font-light lg:max-w-[52ch] mb-4 2xl:mb-7"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    ))} */}

                    {data.items.map((item, index) => {
                        const isReverse = index % 2 !== 0;

                        return (
                            <div
                                key={index}
                                className={`grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[739px_auto]
        pt-5 lg:pt-10 3xl:pt-18 pb-10 3xl:pb-[135px] gap-y-6 lg:gap-y-10
        ${isReverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}
      `}
                            >
                                {/* IMAGE */}
                                <div className="relative flex flex-col justify-end">
                                    <MotionImage
                                        width={1000}
                                        height={1920}
                                        style={{ y: imageY }}
                                        variants={fadeIn(0.6)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        src={item.image}
                                        alt={item.imageAlt}
                                        className={`relative w-fit object-contain z-20
            h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px] max-w-[710px]
            ${isReverse ? "ml-auto mr-3 lg:mr-auto" : "mr-auto ml-3 lg:ml-auto 2xl:ml-3 3xl:ml-auto lg:mr-2"}
          `}
                                    />

                                    <motion.div
                                        style={{ y: imageY }}
                                        variants={fadeIn(0.2)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[80%] 3xl:h-[612px] w-full bg-primary z-10"
                                    />

                                    <motion.div
                                        style={{ y: imageY }}
                                        variants={fadeIn(0.4)}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ amount: 0.1, once: true }}
                                        className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div
                                    className={`pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[68.5px]
          ${isReverse ? "lg:pr-8 xl:pr-15 2xl:pr-17 3xl:pr-[97px]" : "lg:pl-8 xl:pl-15 2xl:pl-17 3xl:pl-[97px]"}
        `}
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

                                    <div
                                        className="md:max-h-[200px] lg:max-h-[250px] xl:max-h-[385px] lg:overflow-y-auto scrollbar-thin scrollbar-pointer pr-2"
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
                                        {item.description.split("\n").map((text, i) => (
                                            <p
                                                key={i}
                                                className="text-19 leading-[1.473684210526316] text-paragraph font-light lg:max-w-[52ch] mb-4 2xl:mb-7"
                                            >
                                                {text}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* ================= LEADER TWO ================= */}
                    {/* <div className="xs:mt-10 md:mt-30 lg:mt-10 2xl:mt-17 3xl:mt-[135px] grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[793px_auto] gap-6 md:gap-10 xl:gap-15 2xl:gap-17 3xl:gap-[88px] pb-10 xl:pb-25 3xl:pb-[135px]">
                        <div className="relative lg:order-2" ref={imageContainerRefTwo}>
                            <MotionImage
                                width={1000}
                                height={1920}
                                style={{ y: image2Y }}
                                variants={fadeIn(0.6)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                src={normalizedData[1].image}
                                alt={normalizedData[1].name}
                                className="relative w-fit ml-auto mr-3 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px]"
                            />

                            <motion.div
                                style={{ y: image2Y }}
                                variants={fadeIn(0.2)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="absolute bottom-0 left-0 h-[80%] xl:h-[80%] 3xl:h-[612px] w-full bg-primary z-10"
                            />

                            <motion.div
                                style={{ y: image2Y }}
                                variants={fadeIn(0.4)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"
                            />
                        </div>

                        <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[63.89px] lg:order-1">
                            <H2Title titleText={normalizedData[1].name} marginClass="mb-[10px]" />

                            <motion.h3
                                variants={moveUp(0.4)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.1, once: true }}
                                className="text-29 font-light leading-[1.344827586206897] text-paragraph mb-6 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-[45px]"
                            >
                                {normalizedData[1].position}
                            </motion.h3>

                            <div
                                className="md:max-h-[200px] lg:max-h-[300px] xl:max-h-[350px] 3xl:max-h-[490px] lg:overflow-y-auto scrollbar-thin pr-2"
                                style={{ overscrollBehavior: "contain" }}
                            >
                                {normalizedData[1].desc.map((item, index) => (
                                    <p
                                        key={index}
                                        className="text-19 leading-[1.473684210526316] text-paragraph font-light lg:max-w-[54ch] mb-4 2xl:mb-6"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default LeaderBox;
