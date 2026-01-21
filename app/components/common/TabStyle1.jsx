"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

export default function TabStyle1({ data }) {
    const isArabic = useIsPreferredLanguageArabic();
    const t = useApplyLang(data);
    const [activeId, setActiveId] = useState(t[1]?._id || t[0]._id);
    const tabsContainerRef = useRef(null);
    const itemRefs = useRef({});

    function normalizeHtml(html) {
        if (!html) return "";
        return html.replace(/&nbsp;/g, " ");
    }

    useEffect(() => {
        if (!tabsContainerRef.current) return;
        const buttons = tabsContainerRef.current.querySelectorAll(".tab-style1-btn");

        gsap.fromTo(
            buttons,
            { y: -18, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                stagger: 0.08,
            },
        );
    }, []);

    const activeTab = t.find((t) => t._id === activeId);

    return (
        <div className="w-full">
            {/* ================= TABS ================= */}
            <div className="max-w-[1345px]">
                <div
                    ref={tabsContainerRef}
                    className={`flex flex-col md:flex-row ${
                        isArabic ? "md:flex-row-reverse" : ""
                    } flex-wrap w-full overflow-hidden gap-5 lg:gap-[32px]`}
                >
                    {t.map((tab, index) => {
                        const isActive = tab._id === activeId;

                        return (
                            <div key={tab._id} ref={(el) => (itemRefs.current[tab._id] = el)} className="w-full md:flex-1">
                                {/* TAB BUTTON */}
                                <motion.button
                                    variants={moveUp(0.6 + 0.2 * index)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    onClick={() => {
                                        setActiveId(tab._id);

                                        if (window.innerWidth < 768) {
                                            setTimeout(() => {
                                                itemRefs.current[tab._id]?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }, 250); // wait for accordion animation
                                        }
                                    }}
                                    className={`tab-style1-btn w-full pb-4 flex flex-col  ${
                                        isArabic ? "text-right" : "text-left"
                                    } border-b h-full 
                    ${isActive ? "border-b-3 border-secondary" : "border-white bg-transparent "}`}
                                >
                                    <span
                                        className={`text-19 leading-[1.473684210526316] max-w-[30ch] transition-all duration-300 ${
                                            isActive ? "font-bold" : "font-light"
                                        }`}
                                    >
                                        {tab.title}
                                    </span>
                                </motion.button>

                                {/* ================= MOBILE CONTENT ONLY ================= */}
                                <div className="md:hidden">
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.45, ease: "easeOut" }}
                                                className="px-4 py-6 border border-white/20"
                                            >
                                                {/* Image */}
                                                <Image
                                                    width={300}
                                                    height={300}
                                                    src={tab.image}
                                                    alt={tab.imageAlt}
                                                    className="w-full max-h-[260px] object-cover mb-4"
                                                />

                                                {/* Text */}
                                                <h3 className="text-22 font-bold mb-3 text-white">{tab.title}</h3>

                                                <div
                                                    dangerouslySetInnerHTML={{ __html: activeTab.description }}
                                                    className="tab-style1-description"
                                                ></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ================= DESKTOP CONTENT (UNCHANGED) ================= */}
            <div className="hidden md:block max-w-[1377px] mt-12">
                <AnimatePresence mode="wait">
                    {activeTab && (
                        <motion.div
                            key={activeTab._id}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className={`grid grid-cols-1 lg:grid-cols-2 ${
                                isArabic ? "2xl:grid-cols-[auto_650px]" : "2xl:grid-cols-[650px_auto]"
                            } gap-10 xl:gap-x-18 items-center`}
                        >
                            {/* Left image */}
                            <motion.div
                                initial={{ opacity: 0.6, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
                                className="w-full"
                            >
                                <Image
                                    width={900}
                                    height={700}
                                    src={activeTab.image}
                                    alt={activeTab.imageAlt}
                                    className="w-full h-full max-h-[445px] object-cover"
                                />
                            </motion.div>

                            {/* Right content */}
                            <div className="text-white text-sm lg:text-19">
                                <motion.h3
                                    variants={moveUp(0.6)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-29 font-bold mb-30px"
                                >
                                    {activeTab.title}
                                </motion.h3>

                                <div
                                    className="tab-style1-description"
                                    dangerouslySetInnerHTML={{
                                        __html: normalizeHtml(activeTab.description),
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
