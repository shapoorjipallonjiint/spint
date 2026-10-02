"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "@/app/components/common/H2Title";
import { moveLeft, moveUp, paragraphItem } from "../../../../motionVarients";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { withNormalSpaces } from "@/lib/withNormalSpaces";

const MotionImage = motion.create(Image);

// "Our Façade, Glazing & Metalwork" accordion (same idea as the HSE Environmental section).
// Data: facade.systemsSection { title, subTitle, items: [{ title, description (bullet list HTML) }] } from the admin.
// Renders nothing until the admin has added items. The scroll hooks live in SystemsSecContent so they
// only run when the <section> (their ref target) is actually rendered.
const SystemsSec = ({ data }) => {
    const t = useApplyLang(data || {});
    const items = (t?.items || []).filter((item) => item?.title);
    if (!items.length) return null;
    return <SystemsSecContent t={t} items={items} />;
};

const SystemsSecContent = ({ t, items }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const sectionRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(0);
    // while a row opens/closes (500ms) the rows move under a still mouse pointer; ignore hovers until it settles,
    // otherwise the row that slides under the pointer would open too
    const hoverLockUntil = useRef(0);
    const openOnHover = (index, eventTime) => {
        if (eventTime < hoverLockUntil.current || index === openIndex) return;
        hoverLockUntil.current = eventTime + 600;
        setOpenIndex(index);
    };

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const shapeY = useTransform(scrollYProgress, [0, 1], [-200, 200]);

    return (
        <section className="section-spacing bg-f5f5 relative overflow-hidden" ref={sectionRef}>
            {/* background shape (right, mirrored in Arabic) */}
            <div
                className={`absolute bottom-0 z-0 pointer-events-none w-[152px] sm:w-[232px] lg:w-[432px] ${
                    isArabic ? "left-0 -scale-x-100" : "right-0"
                }`}
            >
                <MotionImage
                    width={432}
                    height={607}
                    style={{ y: shapeY }}
                    variants={moveLeft(1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    src="/assets/images/svg/sv-02.svg"
                    alt=""
                    className="w-full h-auto"
                />
            </div>

            <div className="container relative z-[1]">
                <H2Title titleText={t.title} titleColor="black" marginClass="mb-4 md:mb-6 2xl:mb-50px" maxW="max-w-[18ch]" />

                {t.subTitle && (
                    <motion.p
                        variants={moveUp(0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ amount: 0.2, once: true }}
                        className="text-19 font-light leading-[1.474] max-w-[85ch] text-paragraph mb-7 lg:mb-10"
                    >
                        {t.subTitle}
                    </motion.p>
                )}

                <div className="2xl:max-w-[92%] 3xl:max-w-[1345px] border-t border-black/20">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                variants={paragraphItem}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ amount: 0.2, once: true }}
                                className="border-b border-black/20"
                            >
                                <div
                                    className={`group grid lg:grid-cols-[1fr_2fr_auto] min-[1810px]:grid-cols-[minmax(521px,1fr)_2fr_auto] gap-x-6 py-3 md:py-4 2xl:py-[16px] cursor-pointer ${
                                        isOpen ? "items-start" : "items-center"
                                    }`}
                                    onMouseEnter={(e) => openOnHover(index, e.timeStamp)}
                                    // one item is always open: the first by default, then whichever was last hovered / clicked (stays open)
                                    onClick={() => setOpenIndex(index)}
                                >
                                    {/* title (+ arrow on mobile) */}
                                    <div className="flex justify-between items-center gap-4">
                                        <h3
                                            className={`text-19 xs:text-20 xl:text-29 leading-[1.474] lg:leading-[2.43] transition-all duration-500 group-hover:text-black ${
                                                isOpen ? "text-black" : "text-paragraph"
                                            } font-light`}
                                        >
                                            {item.title}
                                        </h3>
                                        <span
                                            className={`flex lg:hidden shrink-0 w-[35px] h-[35px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        >
                                            <Image src="/assets/images/about-us/toparrow.svg" width={14} height={14} alt="" />
                                        </span>
                                    </div>

                                    {/* bullet list, smooth open/close via grid rows. Two columns from md: several lists (as saved from the editor) = one
                                        list per column; a single list is split into two columns. Empty <p></p> spacers are hidden. */}
                                    <div
                                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div
                                                className={`pt-2 lg:pt-[11px] pb-2 lg:pb-[15px] text-19 text-paragraph font-light md:grid md:grid-cols-2 md:gap-x-[60px] md:items-start [&>p:empty]:hidden [&>p]:col-span-2 [&>ul:only-of-type]:col-span-2 md:[&>ul:only-of-type]:columns-2 md:[&>ul:only-of-type]:gap-x-[60px] [&_li]:break-inside-avoid ${
                                                    isArabic ? "our-values-about-ar" : "our-values-about"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: withNormalSpaces(item.description) }}
                                            />
                                        </div>
                                    </div>

                                    {/* arrow (desktop) */}
                                    <span
                                        className={`hidden lg:flex shrink-0 w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 ${
                                            isOpen ? "" : "rotate-180"
                                        }`}
                                    >
                                        <Image
                                            src="/assets/images/about-us/arrow-top1.svg"
                                            width={20}
                                            height={20}
                                            alt=""
                                            className="w-3 h-3 xl:w-[16px] xl:h-[16px]"
                                        />
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SystemsSec;
