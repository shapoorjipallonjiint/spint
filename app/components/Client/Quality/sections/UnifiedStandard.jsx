"use client";
import { motion, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { assets } from "@/app/assets";
import { useRef } from "react";
import Image from "next/image";
import { moveUp } from "@/app/components/motionVarients";

const UnifiedStandard = ({ data }) => {
    const MotionImage = motion.create(Image);
    const imageParRef = useRef(null);
    // Parallax for main image container
    const { scrollYProgress: imageProgress } = useScroll({
        target: imageParRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(imageProgress, [0, 1], [-150, 150]);

    return (
        <section className="py-25 relative overflow-hidden bg-primary text-white">
            <div
                className="absolute -bottom-30 lg:bottom-0 right-0  lg:left-[-180px] xl:left-[-170px] 2xl:left-[-19px]  w-fit h-fit "
                ref={imageParRef}
            >
                <MotionImage
                    width={1000}
                    height={1000}
                    style={{ y: imageY }}
                    src={assets.mainShape2}
                    alt=""
                    className="object-contain w-[152px] h-[350px] lg:w-[325px] lg:h-[494px] xl:w-[425px] xl:h-[594px]"
                />
            </div>
            <div className="container relative">
                <div className="max-w-[800px] 2xl:max-w-[900px] 3xl:max-w-[1207px] ml-auto h-auto">
                    <div className="flex flex-col gap-[60px]">
                        {data.items.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={moveUp(0.4 + 1 * 0.15)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className={`${
                                    item.hasBorder ? "border-b border-cmnbdr pb-[54px]" : ""
                                } relative mb-0 flex flex-col gap-[30px]`}
                            >
                                <button
                                    className={`w-full flex text-left group transition-all duration-500 cursor-pointer`}
                                >
                                    <div className="flex flex-col gap-[30px]">
                                        <Image
                                            src={item.logo}
                                            alt={"Image"}
                                            width={65}
                                            height={65}
                                            className="w-[65px] h-[65px]"
                                        />

                                        <h3 className="text-24 xl:text-60 3xl:text-60 leading-[70px] font-normal">
                                            {item.title}
                                        </h3>
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    <motion.div key="content" className="overflow-hidden">
                                        <div className="">
                                            <motion.p
                                                variants={moveUp(0.001)}
                                                className="text-19 font-light leading-7 max-w-5xl"
                                            >
                                                {item.description}
                                            </motion.p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UnifiedStandard;
