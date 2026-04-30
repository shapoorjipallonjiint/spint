"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import H2Title from "../../../../components/common/H2Title";
import { detailsTabsData } from "../data";
import { moveUp } from "../../../motionVarients";

const MotionImage = motion.create(Image);
const MOBILE_ACCORDION_DURATION = 450;

type WorkSection = {
  title: string;
  items: string[];
};

type ScopeItem = {
  title: string;
  description: string;
};

type DetailsTabItem = {
  title: string;
  type?: string;
  subtitle?: string;
  description?: string;
  scopeTitle?: string;
  scopeItems?: ScopeItem[];
  workSections?: WorkSection[];
  images?: string[];
};

type DetailsTabProps = {
  defaultOpenTitle?: string;
};

const DetailsTab = ({ defaultOpenTitle = "Electrical" }: DetailsTabProps) => {
  const isArabic = useIsPreferredLanguageArabic();
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileTabRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobilePanelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileScrollFrame = useRef<number | null>(null);
  const tabs = detailsTabsData as DetailsTabItem[];
  const [activeTab, setActiveTab] = useState("MEP");
  const [openMobileTab, setOpenMobileTab] = useState(() => {
    const defaultIndex = tabs.findIndex((tab) => tab.title === "MEP");

    return defaultIndex >= 0 ? defaultIndex : 0;
  });
  const [openSection, setOpenSection] = useState(() => {
    const mepTab = tabs.find((tab) => tab.title === "MEP");
    const defaultIndex = (mepTab?.workSections ?? []).findIndex(
      (section) => section.title === defaultOpenTitle
    );

    return defaultIndex >= 0 ? defaultIndex : 1;
  });
  const [activeImage, setActiveImage] = useState(0);
  const activeTabData = tabs.find((tab) => tab.title === activeTab) ?? tabs[0];
  const activeImages = activeTabData?.images ?? [];

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  const showPreviousImage = () => {
    if (!activeImages.length) return;

    setActiveImage((current) =>
      current === 0 ? activeImages.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    if (!activeImages.length) return;

    setActiveImage((current) =>
      current === activeImages.length - 1 ? 0 : current + 1
    );
  };

  const renderAccordionContent = (section: WorkSection) => {
    if (!section.items.length) return null;

    return (
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 pb-5 xl:pt-[11px] xl:pb-[15px]">
        {section.items.map((item) => (
          <div
            key={item}
            className="flex gap-3 text-13 lg:text-14 text-paragraph font-light"
          >
            <span className="mt-[8px] w-[5px] h-[5px] bg-[#39aef0] shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleTabChange = (tab: DetailsTabItem) => {
    setActiveTab(tab.title);
    setActiveImage(0);

    if (tab.type === "accordion") {
      const defaultIndex = (tab.workSections ?? []).findIndex(
        (section) => section.title === defaultOpenTitle
      );

      setOpenSection(defaultIndex >= 0 ? defaultIndex : 1);
    }
  };

  // 👉 New mobile tab handler with synced scroll

 

  const handleMobileTabChange = (tab: DetailsTabItem, index: number) => {
    const direction = index < openMobileTab ? "up" : "down";

    setOpenMobileTab(index);
    handleTabChange(tab);

    // ⏱ Wait for animation to complete
    setTimeout(() => {
      const row = mobileTabRefs.current[index];
      const panel = mobilePanelRefs.current[index];

      // 👉 Always scroll to ROW (more stable UX)
      const target = row;

      if (!target) return;

      animateWindowScrollToElement(target, 500);
    }, MOBILE_ACCORDION_DURATION); // match animation duration
  };

  const animateWindowScrollToElement = (
    element: HTMLElement,
    duration: number
  ) => {
    if (mobileScrollFrame.current) {
      cancelAnimationFrame(mobileScrollFrame.current);
    }

    const topOffset = 90;
    const startY = window.scrollY;
    const targetY =
      window.scrollY + element.getBoundingClientRect().top - topOffset;
    const distance = targetY - startY;
    let startTime: number | null = null;

    const easeInOut = (value: number) =>
      value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;

    const step = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOut(progress));

      if (progress < 1) {
        mobileScrollFrame.current = requestAnimationFrame(step);
      }
    };

    mobileScrollFrame.current = requestAnimationFrame(step);
  };

  const renderScopeContent = (tab: DetailsTabItem) => (
    <motion.div key={tab.title} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} >
      <motion.h2 variants={moveUp(0)}  className="text-38 xl:text-50 3xl:text-60 font-light leading-[1.166666666666667] text-black mb-4"
      >
        {tab.title}
      </motion.h2>

      {tab.subtitle && (
        <motion.p
          variants={moveUp(0.1)}
          className="text-20 xl:text-24 text-black font-light leading-[1.45] mb-5"
        >
          {tab.subtitle}
        </motion.p>
      )}

      {tab.description && (
        <motion.p variants={moveUp(0.2)}
          className="text-16 xl:text-19 text-paragraph font-light leading-[1.55] mb-8 xl:mb-12 max-w-[110ch]"
        >
          {tab.description}
        </motion.p>
      )}

      {tab.scopeTitle && (
        <motion.h3 variants={moveUp(0.3)} className="text-40 font-light leading-[1.25] text-black mb-6 xl:mb-10" >
          {tab.scopeTitle}
        </motion.h3>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 xl:gap-x-10 gap-y-8 xl:gap-y-12 2xl:gap-y-60px 2xl:gap-x-30px">
        {(tab.scopeItems ?? []).map((item, index) => (
          <motion.div key={item.title} variants={moveUp(0.35 + index * 0.08)}>
            <h4 className="text-29 font-light text-black leading-[1.344827586206897] pb-3 border-b border-black/15 mb-4">
              {item.title}
            </h4>
            <p className="text-15 xl:text-17 text-paragraph font-light leading-[1.55]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderTabContent = (tab: DetailsTabItem) =>
    tab.type === "accordion" ? (
      <>
        <H2Title titleText={`${tab.title} Work`} titleColor="" marginClass="mb-4 lg:mb-5" maxW="" />

        <motion.div variants={moveUp(0.1)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="border-t border-black/20" >
          {(tab.workSections ?? []).map((section, index) => {
            const isOpen = openSection === index;

            return (
              <div
                key={section.title}
                role="button"
                tabIndex={0}
                onClick={() => setOpenSection(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setOpenSection(index);
                  }
                }}
                className={`group grid lg:grid-cols-[1.2fr_2.4fr_auto] py-2 2xl:py-[16px] cursor-pointer border-b border-black/20 transition-all duration-300 ${
                  isOpen ? "items-start" : "items-center"
                }`}
              >
                <div className="flex justify-between items-center text-start">
                  <span
                    className={`text-22 md:text-24 xl:text-29 leading-[1.35] lg:leading-[2.43] text-paragraph group-hover:text-black 
                      transition-all ease-in-out duration-500 group-hover:font-bold ${
                      isOpen ? "font-bold text-black" : "font-[300] "
                    } ${isOpen ? "mb-3 lg:mb-0" : ""}`}
                  >
                    {section.title}
                  </span>
                  <span
                    className={`flex lg:hidden w-[35px] h-[35px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <Image src="/assets/images/about-us/toparrow.svg" width={14} height={14} alt="arrow" />
                  </span>
                </div>

                <div className="overflow-hidden">
                  <AnimatePresence initial={false}>
                    {isOpen && section.items.length ? (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: {
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                          },
                          opacity: { duration: 0.25 },
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div initial="hidden" animate="show" variants={moveUp(0.05)} >
                          {renderAccordionContent(section)}
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div
                  className={`hidden lg:flex w-[35px] h-[35px] xl:w-[50px] xl:h-[50px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 justify-self-end ${
                    isOpen ? "" : "rotate-180"
                  }`}
                >
                  <Image src="/assets/images/about-us/arrow-top1.svg" width={20} height={20} alt="arrow" className="w-3 h-3 xl:w-[16px] xl:h-[16px]" />
                </div>
              </div>
            );
          })}
        </motion.div>
      </>
    ) : (
      renderScopeContent(tab)
    );

  const renderTabImage = (tab: DetailsTabItem) => {
    const images = tab.images ?? [];

    return images.length ? (
      <div className="relative mt-8 lg:mt-15 overflow-hidden">
        <Image
          src={images[activeImage]}
          alt={`${tab.title} work reference`}
          width={1207}
          height={600}
          className="w-full aspect-[1207/600] object-cover max-h-[600px]"
        />
        <button
          type="button"
          onClick={showPreviousImage}
          aria-label="Previous image"
          className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 xl:w-10 xl:h-10 2xl:h-[50px] 2xl:w-[50px] rounded-full border border-white/70 bg-black/20 text-white flex items-center justify-center hover:bg-secondary transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 xl:w-auto xl:h-auto text-secondary group-hover:text-white group-hover:-translate-x-[1px] transition transition-all linear" strokeWidth={1.7} />
        </button>
        <button
          type="button"
          onClick={showNextImage}
          aria-label="Next image"
          className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 xl:w-10 xl:h-10 2xl:h-[50px] 2xl:w-[50px] rounded-full border border-white/70 bg-black/20 text-white flex items-center justify-center hover:bg-secondary transition-colors group cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 xl:w-auto xl:h-auto text-secondary group-hover:text-white group-hover:translate-x-[1px] transition transition-all linear" strokeWidth={1.7} />
        </button>
      </div>
    ) : null;
  };

  return (
    <section className="relative overflow-hidden " ref={sectionRef}>
      <div className="pt-8 pb-9 xl:py-15 2xl:py-120px relative bg-f5f5 min-h-screen">
        <div className="container relative">
          <div className={`2xl:max-w-[1008px] 3xl:max-w-[1208px] ${ isArabic ? "mr-auto" : "ml-auto" }`} >
            <div className="relative z-20">
              <div className="hidden lg:block">
                <div className="grid grid-cols-5 border border-black/10 mb-10 xl:mb-60px">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.title;

                    return (
                      <button
                        key={tab.title}
                        type="button"
                        onClick={() => handleTabChange(tab)}
                        className={`min-h-[42px] py-3 xl:py-6 text-19 leading-[1.473684210526316] cursor-pointer border-black/10 transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-[#4bb5f4] to-[#2d41b8] text-white font-medium"
                            : "bg-transparent text-paragraph font-light hover:bg-white"
                        } ${
                          isArabic
                            ? "border-l last:border-l-0"
                            : "border-r last:border-r-0"
                        }`}
                      >
                        {tab.title}
                      </button>
                    );
                  })}
                </div>

                {renderTabContent(activeTabData)}
                {renderTabImage(activeTabData)}
              </div>

              <div className="lg:hidden border-t border-black/15">
                {tabs.map((tab, index) => {
                  const isOpen = openMobileTab === index;

                  return (
                    <div
                      key={tab.title}
                      ref={(element) => {
                        mobileTabRefs.current[index] = element;
                      }}
                      className="border-b border-black/15"
                    >
                      <button
                        type="button"
                        onClick={() => handleMobileTabChange(tab, index)}
                        className={`w-full min-h-[58px] flex items-center justify-between gap-4 text-start py-3 ${
                          isOpen ? "text-white" : "text-black"
                        }`}
                      >
                        <span
                          className={`text-18 font-light leading-[1.35] ${
                            isOpen
                              ? "bg-gradient-to-r from-[#4bb5f4] to-[#2d41b8] px-4 py-2 text-white"
                              : ""
                          }`}
                        >
                          {tab.title}
                        </span>
                        <span
                          className={`flex w-[35px] h-[35px] rounded-full border border-black/20 justify-center items-center transition-transform duration-500 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <Image
                            src="/assets/images/about-us/toparrow.svg"
                            width={14}
                            height={14}
                            alt="arrow"
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            key={`${tab.title}-content`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: {
                                duration: MOBILE_ACCORDION_DURATION / 1000,
                                ease: [0.4, 0, 0.2, 1],
                              },
                              opacity: { duration: 0.25 },
                            }}
                            className="overflow-hidden"
                          >
                            <div
                              ref={(element) => {
                                mobilePanelRefs.current[index] = element;
                              }}
                              className="bg-white px-4 py-6 sm:px-6 sm:py-8 mb-4"
                            >
                              {renderTabContent(tab)}
                              {renderTabImage(tab)}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={`absolute hidden xl:block top-0 lg:bottom-[73px] z-10 ${
            isArabic
              ? "left-0 lg:right-[-400px] 3xl:right-[-290px]"
              : "right-0 lg:left-[-400px] 3xl:left-[-290px]"
          }`}
        >
          <MotionImage
            width={1500}
            height={1000}
            style={{ y: shapeY }}
            src="/assets/images/svg/sv-02.svg"
            className={`w-[500px] h-[992px] md:w-[150px] md:h-[340px] lg:w-[742px] lg:h-[1040px] object-cover object-center ${
              isArabic ? "-scale-x-100" : ""
            }`}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default DetailsTab;
