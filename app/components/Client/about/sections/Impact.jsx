"use client";
import { useEffect, useRef, useState, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import H2Title from "../../../../components/common/H2Title";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { moveUp, moveRight } from "../../../motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

gsap.registerPlugin(ScrollTrigger);

const MotionImage = motion(Image);
const ParallaxShape = memo(({ y }) => (
    <MotionImage
        width={1500}
        height={607}
        style={{ y }}
        variants={moveRight(1)}
        initial="hidden"
        animate="show"
        src="/assets/images/svg/sv-02.svg"
        alt=""
        className=""
    />
));

const CultureDrivers = ({ CultureData }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [letterPositions, setLetterPositions] = useState([]);
    const [halfBoxWidth, setHalfBoxWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const isArabic = useIsPreferredLanguageArabic()
    const t = useApplyLang(CultureData)

    const boxRef = useRef(null);

    const sectionRef = useRef(null);
    const letterRefs = useRef([]);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 700);
        };

        checkScreen(); // initial
        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        if (!boxRef.current) return;

        const updateWidth = () => {
            setHalfBoxWidth(boxRef.current.offsetWidth / 2);
        };

        updateWidth(); // initial

        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [activeIndex]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const overlay = sectionRef.current.querySelector(".reveal-overlay");
        gsap.set(overlay, { xPercent: 0 });
        gsap.to(overlay, {
            xPercent: 100,
            duration: 2.7,
            ease: "expo.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 50%",
                toggleActions: "play none none none",
            },
        });
    }, []);

    useEffect(() => {
        // Calculate letter positions after mount
        const positions = letterRefs.current.map((ref) => {
            if (ref) {
                const rect = ref.getBoundingClientRect();
                const containerRect = ref.closest(".letter-container").getBoundingClientRect();
                return rect.left + rect.width / 2 - containerRect.left;
            }
            return 0;
        });
        console.log(positions)
        setLetterPositions(positions);

        // Recalculate on resize
        const handleResize = () => {
            const positions = letterRefs.current.map((ref) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const containerRect = ref.closest(".letter-container").getBoundingClientRect();
                    return rect.left + rect.width / 2 - containerRect.left;
                }
                return 0;
            });
            
            setLetterPositions(positions);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress: shapeProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const shapeY = useTransform(shapeProgress, [1, 0], [0, -130]);

    const lineStart =
    letterPositions.length > 0
        ? Math.min(...letterPositions)
        : 0;

const lineEnd =
    letterPositions.length > 0
        ? Math.max(...letterPositions)
        : 0;

    const lineWidth = lineEnd - lineStart;

    return (
        <section ref={sectionRef} className="pt-text30 pb30 bg-[#F5F5F5] relative overflow-hidden">
            <div className="reveal-overlay absolute inset-0 bg-white z-20"></div>
            {/* Decorative Triangle */}
            <div className={`absolute ${isArabic ? "right-0 -scale-x-100" : "left-0"}  bottom-0 md:w-44 h-[590px] xl:w-80 3xl:w-[432px] xl:h-[607px]`}>
                <ParallaxShape y={shapeY} />
            </div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    variants={moveUp(0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="mb-8 md:mb-16 lg:mb-[70px]"
                >
                    <H2Title titleText={t.title} marginClass={"mb-4 xl:mb-10 3xl:mb-[54px]"} />
                    <p className="text-19 text-[#464646] font-light mb-5">{t.subTitle}</p>
                    <p className="text-19 text-[#464646] font-light max-w-7xl">{t.description}</p>
                </motion.div>

                {/* IMPACT Letters Section */}
                <motion.div
                    variants={moveUp(0.4)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className="relative"
                >
                    {/* Letters Row */}
                    <div className="relative z-10 letter-container flex justify-center items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 3xl:gap-24 mb-[34px]">
                        {t.items.map((driver, index) => (
                            <button
                                key={index}
                                ref={(el) => (letterRefs.current[index] = el)}
                                onClick={() => setActiveIndex(index)}
                                className="flex flex-col items-center cursor-pointer transition-all duration-300 group"
                            >
                                <span
                                    className={`text-60 font-light transition-colors duration-300 ${
                                        activeIndex === index ? "text-primary" : "text-black"
                                    } group-hover:text-primary`}
                                >
                                    {driver.letter}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Line with Dots - positioned relative to letter positions */}
                    <div className="relative z-10 mx-auto">
                        <div className="relative">
                            <div
                                className="absolute h-[1px] bg-black/20"
                                style={{
                                    left: `${lineStart - 300}px`,
                                    width: `${lineWidth + 600}px`,
                                }}
                            />

                            {/* Dots positioned under each letter */}
                            {letterPositions.map((position, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className="absolute -translate-y-1/2 -translate-x-1/2 cursor-pointer group"
                                    style={{ left: `${position}px` }}
                                >
                                    <div
                                        className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
                                            activeIndex === index ? "bg-[#30B6F9] scale-125" : "bg-[#464646]"
                                        } group-hover:scale-125`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Vertical Line to Content Box - positioned at active letter */}
                        {letterPositions.length > 0 && (
                            <div
                                className="absolute top-0 w-0.5 bg-black/20 transition-all duration-500 z-[-1]"
                                style={{
                                    left: `${letterPositions[activeIndex] - 1}px`,
                                    height: "105px",
                                }}
                            />
                        )}
                    </div>

                    {/* Content Box - centered at active letter position */}
                    <div
                        className="relative z-10 mt-[105px] xl:mt-[139px]"
                        style={{
                            minHeight: isMobile ? "auto" : boxRef.current?.offsetHeight || "auto",
                        }}
                    >
                        <motion.div
                            className={`transition-all duration-500 ${isMobile ? "relative mx-auto w-full" : "absolute"}`}
                            style={
                                isMobile
                                    ? {}
                                    : {
                                          left:
                                              letterPositions.length > 0
                                                  ? `${letterPositions[activeIndex] - halfBoxWidth}px`
                                                  : "50%",
                                      }
                            }
                        >
<AnimatePresence mode="wait">
    <motion.div
        key={activeIndex}
        ref={boxRef}
        initial="hidden"
        whileInView="show"
        exit="exit"
        className="
            bg-[#1e4a8f] text-white
            p-6 md:p-10 lg:p-[45px]
            text-center
            max-w-[539px]
            w-full
            mx-auto
        "
    >
        <motion.h3
            variants={moveUp(0.3)}
            className="text-29 font-bold mb-4"
        >
            {t.items[activeIndex].title}
        </motion.h3>

        <motion.p
            variants={moveUp(0.6)}
            className="text-19 font-light mb-6"
        >
            {t.items[activeIndex].subTitle}
        </motion.p>

        <motion.div
            variants={moveUp(0.9)}
            className="w-full h-px bg-white/30 mb-6"
        />

        <motion.p
            variants={moveUp(1.2)}
            className="text-19 font-light leading-[1.47] max-w-[30ch] 2xl:max-w-[35ch]"
        >
            {t.items[activeIndex].description}
        </motion.p>
    </motion.div>
</AnimatePresence>

                        </motion.div>
                    </div>
                </motion.div>

                {/* Spacer for content box */}
            </div>
        </section>
    );
};

export default CultureDrivers;
