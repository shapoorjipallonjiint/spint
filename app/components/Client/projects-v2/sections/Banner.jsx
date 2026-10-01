"use client";
import React, { useRef, useEffect } from "react";
// import { projectDetails } from "../data";
import gsap from "gsap";
import { moveUp, moveLeft, moveRight } from "../../../motionVarients";
import { motion } from "framer-motion";
import InsideCounter from "@/app/components/InsideCounter";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const Banner = ({ banner, bannerAlt, pageTitle, data }) => {
    const tData = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();
    const containerRef = useRef(null);
    const targetRef = useRef(null);

    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const titleRef = useRef(null);
    const maskRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out", duration: 1.4 },
            });

            tl
                // Step 1: mask slides left → right revealing the overlay + image
                .fromTo(
                    maskRef.current,
                    { x: "0%" },
                    {
                        x: isArabic ? "-100%" : "100%",
                        duration: 1.6,
                        ease: "power4.inOut",
                    },
                )

                // Step 2: subtle image zoom-out
                .fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "power3.out" }, "-=1.2")
                // Step 3: text fade-in after reveal
                .fromTo(
                    titleRef.current,
                    { opacity: 0, x: isArabic ? 40 : -40 },
                    { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                    "-=0.6",
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const containerEl = containerRef.current;
        const targetEl = targetRef.current;

        if (!containerEl || !targetEl) return;

        const computedStyle = window.getComputedStyle(containerEl);

        const margin = computedStyle.marginLeft;

        if (isArabic) {
            targetEl.style.marginRight = margin;
            targetEl.style.marginLeft = "0px";
        } else {
            targetEl.style.marginLeft = margin;
            targetEl.style.marginRight = "0px";
        }

        const handleResize = () => {
            const updatedStyle = window.getComputedStyle(containerEl);

            const margin = updatedStyle.marginLeft;

            if (isArabic) {
                targetEl.style.marginRight = margin;
                targetEl.style.marginLeft = "0px";
            } else {
                targetEl.style.marginLeft = margin;
                targetEl.style.marginRight = "0px";
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isArabic]);

    return (
        <section
            ref={sectionRef}
            // same height setup as common/Banner: pulled up under the fixed nav (--nav-h), so the heights include the header
            className="relative w-full mt-[calc(-1*var(--nav-h,0px))] h-[200px] md:h-[280px] lg:h-[350px] 2xl:h-[480px] 3xl:h-[550px] bg-secondary/20 overflow-hidden"
        >
            <Image
                width={1500}
                height={1000}
                ref={imgRef}
                src={banner}
                alt={bannerAlt}
                className="absolute top-0 left-0 w-full h-full object-cover object-top z-0"
            />
            <div ref={overlayRef} className="absolute inset-0 bg-[linear-gradient(360deg,rgba(0,0,0,0.75)_17.15%,rgba(0,0,0,0)_66.31%)]" ></div>
            <div className="container" ref={containerRef}></div>
            <div className="relative z-2 h-full pb-100px" ref={targetRef}>
                <div className="flex flex-col justify-end h-full  ">
                    <div className="flex flex-col md:flex-row justify-between ps-3 gap-5 lg:gap-0">
                        <h1 ref={titleRef} className="text-white text-70 xl:text-32 2xl:text-70 font-light leading-[1.08]">
                            {pageTitle}
                        </h1>
                    
                    </div>
                </div>
            </div>
            <motion.div
                variants={moveUp(2)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.2, once: true }}
                className={`absolute -bottom-8 lg:bottom-0 z-10 ${isArabic ? "left-0" : "right-0"}`}
            >
                <Image
                    width={1500}
                    height={1000}
                    src="../assets/images/svg/sv-02.svg"
                    alt=""
                    className={`w-[138px] h-[193px] md:w-[193px] md:h-[270px] lg:w-[241px] lg:h-[337px] 2xl:w-[330px] 2xl:h-[463px] 3xl:w-[378px] 3xl:h-[530px] object-cover object-center ${
                        isArabic ? "-scale-x-100" : ""
                    }`}
                />
            </motion.div>
        </section>
    );
};

export default Banner;
