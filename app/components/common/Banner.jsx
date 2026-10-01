"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const Banner = ({ title, image, imageAlt, data }) => {
    console.log(data, "js")
    const sectionRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const titleRef = useRef(null);
    const maskRef = useRef(null);
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();

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
                        duration: 0.8,
                        ease: "power4.inOut",
                    },
                )

                // Step 2: subtle image zoom-out
                .fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, duration: 1.9, ease: "power3.out" }, "-=1.2")
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

    return (
        <section
            ref={sectionRef}
            // pulled up under the fixed nav (--nav-h is set by the navbar), so the heights below include the header like the Figma frames
            className="relative w-full mt-[calc(-1*var(--nav-h,0px))] h-[200px] md:h-[280px] lg:h-[350px] 2xl:h-[480px] 3xl:h-[550px] overflow-hidden bg-secondary/20"
        >
            {/* Background Image */}
            <div ref={imgRef} className="absolute inset-0 w-full h-full z-0">
                <Image
                    src={t?.banner ? t.banner : image}
                    alt={t?.bannerAlt ? t.bannerAlt : imageAlt ? imageAlt : title}
                    fill
                    className="object-cover object-top w-full h-full"
                    priority
                />
            </div>

            {/* Single Gradient Overlay (dark bottom → transparent top) */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_18.92%,rgba(0,0,0,0)_72.69%)] z-10"
            ></div>

            {/* White mask that slides away to reveal the gradient */}
            <div ref={maskRef} className="absolute inset-0 bg-primary z-20"></div>

            {/* Content */}
            <div className="container relative z-30 h-full">
                <div className="flex flex-col justify-end h-full pb-5 sm:pb-8  md:pb-8 lg:pb-10 2xl:pb-16 3xl:pb-25">
                    <h1
                        ref={titleRef}
                        className={`text-white text-60 xl:text-70 font-light leading-[1.08] ${
                            isArabic ? "text-right normal-case" : "capitalize"
                        }`}
                    >
                        {t?.pageTitle ? t.pageTitle : title}
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default Banner;
