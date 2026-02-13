"use client";

import { Listbox } from "@headlessui/react";
import { pressReleases } from "./data";
import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveLeft, moveRight, moveUp } from "../../motionVarients";
import SplitTextAnimation from "../../../components/common/SplitTextAnimation";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import LangLink from "@/lib/LangLink";

const ITEMS_PER_PAGE = 12;

const Index = ({ newsData, topicData }) => {
  const isArabic = useIsPreferredLanguageArabic();
  const tNewsData = useApplyLang(newsData);
  const tTopicData = useApplyLang(topicData);

  const years = [
    { id: 1, title: isArabic ? "السنة" : "Year" },
    { id: 2, title: "2025" },
    { id: 3, title: "2024" },
    { id: 4, title: "2023" },
    { id: 5, title: "2022" },
    { id: 6, title: "2021" },
  ];

  const topics = [
    { id: 1, name: isArabic ? "Topic ar" : "Topic" }, // default (no filter)
    ...tTopicData
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  const MotionImage = motion.create(Image)





  const [selectedYear, setSelectedYear] = useState(years[0]);
  const sectionRef = useRef(null)
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
  // 🔹 Filter items by topic + year
  const filteredItems = useMemo(() => {
    let items = [...tNewsData.news];

    // Topic filter (ignore default "Topic")
    if (selectedTopic.id !== 1) {
      items = items.filter((item) => item.topic.name === selectedTopic.name);
    }

    // Year filter (ignore default "Year")
    if (selectedYear.id !== 1) {
      items = items.filter((item) => {
        const year = new Date(item.date).getUTCFullYear();
        console.log(year)
        return year === Number(selectedYear.title);
      });
    }


    return items;
  }, [selectedTopic, selectedYear]);

  // 🔹 Total pages based on filtered data
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  }, [filteredItems.length]);

  // 🔹 Current page items from filtered list
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [currentPage, filteredItems]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || isAnimating) return;

    setIsAnimating(true);
    setCurrentPage(newPage);

    const section = document.querySelector("section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  // 🔹 When topic changes → reset to page 1
  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  // 🔹 When year changes → reset to page 1
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  // 🔹 Clear all filters
  const handleClearFilters = () => {
    setSelectedTopic(topics[0]);
    setSelectedYear(years[0]);
    setCurrentPage(1);
  };

  return (
    <>
      {/* <header className="">
        <MainNavbar />
      </header> */}
      <main>
        <section className="relative overflow-hidden" ref={sectionRef}>
          <div
            className={`absolute top-[61px] lg:top-0 z-[-1]
    ${isArabic
                ? "left-0 2xl:left-[-50px] -scale-x-100"
                : "right-0 2xl:right-[-50px]"
              }
  `}
          >
            <MotionImage
              width={1500}
              height={1000}
              style={{ y: shapeY }}
                  variants={moveLeft(0.4)}
                                              initial="hidden"
                                              whileInView="show"
                                              viewport={{ amount: 0.2, once: true }}
              src="/assets/images/project-details/bannerbg.svg"
              alt=""
              className="w-[150px] h-[376px] md:w-[377px] md:h-[476px] lg:w-[577px] lg:h-[576px] object-fit"
            />
          </div>

          {/* <img src="./assets/images/shape-left.svg" alt="" className="absolute  bottom-30 left-0 z-[-1]" /> */}
          <div className="container">
            <div className="mb-7 md:mb-10 xl:mb-12 3xl:mb-20 mt-12 xl:mt-15 3xl:mt-30">
              <motion.h1
                variants={moveUp(0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.2, once: true }}
                className="text-40 2xl:text-70 font-light leading-[1.071428571428571]"
              >

                <SplitTextAnimation children={tNewsData.title} staggerDelay={0.1} animationDuration={0.8} delay={0.8} />
              </motion.h1>
            </div>

            <motion.div variants={moveUp(0.8)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}
              className="flex flex-row gap-x-6 md:gap-0 justify-between border-y border-cmnbdr py-35px mb-10 lg:mb-12  3xl:mb-20" >
              <div className="flex flex-row gap-5 md:gap-15 xl:gap-[90px]">
                {/* Topic filter */}
                <div className="   md:min-w-[77px] relative">
                  <Listbox value={selectedTopic} onChange={handleTopicChange}>
                    <Listbox.Button className="relative w-fit cursor-pointer text-left flex items-center gap-3 2xl:gap-[16px] outline-0 border-0 justify-between">
                      <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase whitespace-nowrap">
                        {selectedTopic.name}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 w-3 md:w-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="border-0 outline-0 absolute md:w-[200px] w-[200px] bg-white rounded-sm shadow-sm z-10">
                      {topics
                        .filter(topic => topic.id !== 1) // hide default
                        .map((topic) => (
                          <Listbox.Option
                            key={topic.id}
                            value={topic}
                            className="py-1 px-4 hover:bg-[#f0f0f0] cursor-pointer group hover:font-bold transition-all duration-300 w-full"
                          >
                            <span className="group-hover:scale-[1.03]">
                              {topic.name}
                            </span>
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>

                  </Listbox>
                </div>

                {/* Year filter */}
                <div className=" md:min-w-[77px] relative">
                  <Listbox value={selectedYear} onChange={handleYearChange}>
                    <Listbox.Button className="relative w-fit cursor-pointer text-left flex items-center gap-3 2xl:gap-[16px] outline-0 border-0 justify-between">
                      <span className="text-paragraph text-16 font-semibold leading-[1.75] uppercase">
                        {selectedYear.title}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6   w-3 md:w-full"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </Listbox.Button>
                    <Listbox.Options className="md:w-[200px] w-[200px] border-0 outline-0 absolute   bg-white rounded-sm shadow-sm z-10">
                      {years.map((year) => (
                        <Listbox.Option
                          key={year.id}
                          value={year}
                          className="py-1 px-4 hover:bg-[#f0f0f0] cursor-pointer group hover:font-bold transition-all duration-300 w-full"
                        >
                          <span className="group-hover:scale-[1.03]">
                            {year.title}
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>

              {/* Clear Filter */}
              <button type="button" onClick={handleClearFilters} className="flex items-center gap-1 md:gap-[10px] group cursor-pointer justify-end" >
                <Image width={150} height={150} src="/assets/images/icons/arrow-tail-left.svg" alt="" className={`w-4 h-4 sm:w-auto sm:h-auto ${isArabic ? "rotate-180 group-hover:translate-x-[3px]" : "group-hover:translate-x-[-3px]"} transition-all duration-300`} />
                <p className="text-paragraph text-16 font-light leading-[1.75] uppercase transition-all duration-300 group-hover:font-semibold">
                  {isArabic ? "مسح الفلاتر" : "Clear Filter"}
                </p>
              </button>
            </motion.div>

            {/* Grid */}
            <div
              className={`relative grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-10 xl:gap-y-15 2xl:gap-y-20 3xl:gap-y-30 mb-10 xl:mb-12 2xl:mb-[100.32px] transition-all duration-300 ${isAnimating
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
                }`}
              style={{
                transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
              }}
            >
              {currentItems.map((item, index) => (
                <LangLink key={index} href={`/press-releases/${item.slug}`}>
                  <motion.div variants={moveUp(1 + 0.1 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}
                    key={item.id}
                    className="border-b border-black/20 pb-5 lg:border-b-0 lg:pb-0"
                  >
                    <Image src={item.thumbnail} alt={item.thumbnailAlt} width={520} height={339} className="w-full h-[200px] md:h-[250px] lg:h-[300px] 3xl:h-[339px] object-cover" />
                    <div className="pt-5">
                      <div className={`flex items-center justify-between pt-[14px] pb-[13px] ${isArabic ? "pl-[23.15px] pr-[23.17px]" : "pl-[23.17px] pr-[23.15px]"} bg-f5f5`}>
                        <h4 className="text-paragraph text-16 font-light leading-[1.75] uppercase">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h4>
                        <h4 className="text-paragraph text-16 font-light leading-[1.75] uppercase">
                          {item.topic.name}
                        </h4>
                      </div>

                      <h3 className="text-20 2xl:text-29 leading-[1.344827586206897] font-light mt-2 xl:mt-30px 3xl:max-w-[90%]">
                        {item.title}
                      </h3>

                    </div>
                  </motion.div>
                </LangLink>
              ))}

              {/* Optional: show empty state if no results */}
              {currentItems.length === 0 && (
                <div className="col-span-full text-center py-10 text-paragraph">
                  No press releases found for selected filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="pagination flex items-center  gap-5 justify-center mb-10 xl:mb-15 2xl:mb-[131.68px]">
              <button
                className={`${isArabic ? "rotate-180" : ""} prev cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === 1 || isAnimating ? "opacity-30" : "opacity-100"
                  }`}
                onClick={handlePrev}
                disabled={currentPage === 1 || isAnimating}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.7549 1.25L1.25 9.7549M1.25 9.7549L9.75297 18.2579M1.25 9.7549L18.2169 9.79374"
                    stroke="#30B6F9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p>
                <span className="current-page font-bold text-16 leading-[2.4375]">
                  {String(currentPage).padStart(2, "0")}
                </span>
                {" / "}
                <span className="total-pages">
                  {String(totalPages).padStart(2, "0")}
                </span>
              </p>

              <button
                className={`${isArabic ? "rotate-180" : ""} next cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed ${currentPage === totalPages || isAnimating
                  ? "opacity-30"
                  : "opacity-100"
                  }`}
                onClick={handleNext}
                disabled={currentPage === totalPages || isAnimating}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.71189 1.25L18.2168 9.7549M18.2168 9.7549L9.71383 18.2579M18.2168 9.7549L1.24994 9.79374"
                    stroke="#30B6F9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>


          <div
            className={`absolute z-[-1] w-fit
    ${isArabic
                ? "left-0 lg:right-[-141px] 3xl:right-0 -scale-x-100"
                : "right-0 lg:left-[-141px] 3xl:left-0"
              }
    ${currentItems.length === 0
                ? "hidden"
                : currentItems.length < 6
                  ? "3xl:bottom-[-16%] 2xl:bottom-[-24%] lg:bottom-[14%] bottom-[-14%]"
                  : "3xl:bottom-[18%] 2xl:bottom-[32%] bottom-[28%]"
              }
  `}
          >
            <MotionImage
              width={1500}
              height={1000}
              style={{ y: shapeY }}
              variants={moveRight(0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: true }}
              src="/assets/images/press-releases/listbody.svg"
              alt=""
              className="object-fit w-md200 lg:w-[350px] 2xl:w-[754px] 2xl:h-[1056px] relative 2xl:top-[14px]"
            />
          </div>

        </section>
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
};

export default Index;
