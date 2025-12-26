"use client";

import { useEffect, useState, useRef } from "react";
// import { careersData } from "../data";
import { motion, AnimatePresence } from "framer-motion";
import { moveRight, moveUp } from "../../../motionVarients";
import H2Title from "../../../../components/common/H2Title";

const Strength = ({ data }) => {
    const containerRef = useRef(null);
    const [leftPos, setLeftPos] = useState(0);
    const [showSticky, setShowSticky] = useState(false);

    useEffect(() => {
        const updateLeft = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setLeftPos(rect.left);
            }
        };

        updateLeft();
        window.addEventListener("resize", updateLeft);
        return () => window.removeEventListener("resize", updateLeft);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const showAfterScroll = window.scrollY > 100;
            const stopEl = document.getElementById("careers-stop-section");

            if (!stopEl) {
                setShowSticky(showAfterScroll);
                return;
            }

            const rect = stopEl.getBoundingClientRect();
            const shouldStop = rect.top <= window.innerHeight;

            setShowSticky(showAfterScroll && !shouldStop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="py25">
            <div
                className="container flex flex-col lg:flex-row items-start gap-5 xl:gap-12 2xl:gap-[190px]"
                ref={containerRef}
            >
                {/* Left Button */}
                <motion.div
                    variants={moveRight(0.4)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className=" md:mt-[10px] flex justify-center md:justify-start"
                >
                    <div className={` inline-block transition-all duration-300 relative`}>
                        {/* SVG Gradient Border */}
                        <svg
                            width="223"
                            height="45"
                            viewBox="0 0 223 45"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[223px] h-[45px]"
                        >
                            <rect
                                x="0.5"
                                y="0.5"
                                width="222"
                                height="43"
                                rx="22"
                                ry="22"
                                fill="white"
                                stroke="url(#gradient)"
                                strokeWidth="1"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="222" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#1E45A2" />
                                    <stop offset="1" stopColor="#30B6F9" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center Text */}
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-16 leading-[1.75] font-light hover:opacity-[0.8] transition-all duration-300 ease-in-out cursor-pointer w-full text-center">
                            {data.button.text}
                        </span>

                        {/* Hover Fill Layer */}
                        <span
                            className="absolute inset-0 rounded-full bg-[#0055A5] opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out"
                            style={{ zIndex: -1 }}
                        ></span>
                    </div>
                    <AnimatePresence>
                        {showSticky && (
                            <motion.div
                                key="sticky-cta"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1], // butter smooth
                                }}
                                className="fixed bottom-4 z-50"
                                style={{ left: leftPos + "px" }}
                            >
                                {/* SVG Gradient Border */}
                                <svg
                                    width="223"
                                    height="45"
                                    viewBox="0 0 223 45"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-[223px] h-[37px]"
                                >
                                    <rect
                                        x="0.5"
                                        y="0.5"
                                        width="222"
                                        height="43"
                                        rx="22"
                                        ry="22"
                                        fill="white"
                                        stroke="url(#gradient)"
                                        strokeWidth="1"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="222" y1="0" x2="0" y2="0">
                                            <stop stopColor="#1E45A2" />
                                            <stop offset="1" stopColor="#30B6F9" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Center Text */}
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-[14px] leading-[1.75] font-light hover:opacity-[0.8] cursor-pointer w-full text-center">
                                    {data.button.text}
                                </span>

                                {/* Hover Fill Layer */}
                                <span className="absolute inset-0 rounded-full bg-[#0055A5] opacity-0 hover:opacity-100" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Right Text Section */}
                <div className="text-left">
                    {/* <motion.h2 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-60 font-light leading-[1.166666666666667] text-black mb-3 md:mb-5">{careersData.title}</motion.h2> */}
                    <H2Title titleText={data.title} marginClass={"mb-3 md:mb-5"} />
                    <motion.p
                        variants={moveUp(0.6)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="text-19 font-light leading-[1.473684210526316] text-paragraph max-w-[72ch]"
                    >
                        {data.description}
                    </motion.p>
                    <motion.div
                        variants={moveUp(0.8)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="border-b border-gray-200 mt-[30px] xl:mt-[50px] 2xl:mt-[70px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Strength;
